import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface Coefficients {
  intercept: number;
  area: number;
  amenity: number;
  floor: number;
}

export interface PriceEstimate {
  estimatedPrice: number;
  minPrice: number;
  maxPrice: number;
  currentPriceStatus: 'low' | 'fair' | 'high' | 'very_high';
  percentageDiff: number;
  suggestion: string;
  similarRoomsCount: number;
  coefficients: Coefficients; // để hiển thị trong báo cáo
}

@Injectable()
export class PriceEstimatorService {
  constructor(private prisma: PrismaService) {}

  async estimate(
    area: number,
    amenityCount: number,
    floor: number,
    address: string,
    currentPrice?: number,
  ): Promise<PriceEstimate> {
    // Lấy dữ liệu phòng cùng khu vực để train
    const rawData = await this.getTrainingData(address);

    // Lọc outlier trước khi train
    const trainingData = this.removeOutliers(rawData);

    let coefficients: Coefficients;
    let estimated: number;

    if (trainingData.length >= 5) {
      // Đủ data → train Linear Regression (OLS đa biến đúng)
      coefficients = this.trainOLS(trainingData);
      estimated = this.predict(coefficients, area, amenityCount, floor);
    } else {
      // Không đủ data → dùng hệ số mặc định thị trường VN
      coefficients = {
        intercept: 500_000,
        area: 80_000,
        amenity: 150_000,
        floor: 30_000,
      };
      estimated = this.predict(coefficients, area, amenityCount, floor);
    }

    // Giới hạn hợp lý
    estimated = Math.max(500_000, Math.min(50_000_000, estimated));

    const minPrice = Math.round(estimated * 0.85);
    const maxPrice = Math.round(estimated * 1.15);

    // Đánh giá giá hiện tại
    let currentPriceStatus: PriceEstimate['currentPriceStatus'] = 'fair';
    let percentageDiff = 0;

    if (currentPrice && currentPrice > 0) {
      percentageDiff = Math.round(
        ((currentPrice - estimated) / estimated) * 100,
      );
      currentPriceStatus =
        percentageDiff < -15
          ? 'low'
          : percentageDiff <= 15
            ? 'fair'
            : percentageDiff <= 30
              ? 'high'
              : 'very_high';
    }

    return {
      estimatedPrice: Math.round(estimated),
      minPrice,
      maxPrice,
      currentPriceStatus,
      percentageDiff,
      suggestion: this.getSuggestion(
        currentPriceStatus,
        Math.abs(percentageDiff),
      ),
      similarRoomsCount: trainingData.length,
      coefficients,
    };
  }

  // ── Loại bỏ outlier bằng IQR ──────────────────────────────────
  // Loại các phòng có giá nằm ngoài [Q1 - 1.5×IQR, Q3 + 1.5×IQR]
  private removeOutliers(
    data: {
      price: number;
      area: number;
      amenityCount: number;
      floor: number;
    }[],
  ) {
    if (data.length < 4) return data;

    const prices = data.map((d) => d.price).sort((a, b) => a - b);
    const q1 = prices[Math.floor(prices.length * 0.25)];
    const q3 = prices[Math.floor(prices.length * 0.75)];
    const iqr = q3 - q1;
    const lower = q1 - 1.5 * iqr;
    const upper = q3 + 1.5 * iqr;

    return data.filter((d) => d.price >= lower && d.price <= upper);
  }

  // ── Ordinary Least Squares (OLS) đa biến ─────────────────────
  // Giải Normal Equation: β = (XᵀX)⁻¹ Xᵀy
  // y = b₀ + b₁×area + b₂×amenity + b₃×floor
  private trainOLS(
    data: {
      price: number;
      area: number;
      amenityCount: number;
      floor: number;
    }[],
  ): Coefficients {
    const n = data.length;
    const p = 4; // số tham số: intercept, area, amenity, floor

    // Xây dựng ma trận X (n×4) và vector y (n×1)
    // Mỗi hàng X[i] = [1, area, amenityCount, floor]
    const X: number[][] = data.map((d) => [1, d.area, d.amenityCount, d.floor]);
    const y: number[] = data.map((d) => d.price);

    // Tính XᵀX (4×4)
    const XtX: number[][] = Array.from({ length: p }, () => Array(p).fill(0));
    for (let i = 0; i < p; i++) {
      for (let j = 0; j < p; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += X[k][i] * X[k][j];
        }
        XtX[i][j] = sum;
      }
    }

    // Tính Xᵀy (4×1)
    const Xty: number[] = Array(p).fill(0);
    for (let i = 0; i < p; i++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += X[k][i] * y[k];
      }
      Xty[i] = sum;
    }

    // Giải hệ (XᵀX)β = Xᵀy bằng Gauss-Jordan elimination
    const beta = this.solveLinearSystem(XtX, Xty);

    if (!beta) {
      // Ma trận suy biến → fallback hệ số mặc định
      return {
        intercept: 500_000,
        area: 80_000,
        amenity: 150_000,
        floor: 30_000,
      };
    }

    // Clamp hệ số để đảm bảo ý nghĩa kinh tế:
    // - area >= 0 (phòng lớn hơn phải đắt hơn hoặc bằng)
    // - amenity >= 0 (nhiều tiện ích hơn phải đắt hơn hoặc bằng)
    // - floor: cho phép âm (tầng cao có thể rẻ hơn do không thang máy)
    return {
      intercept: Math.round(beta[0]),
      area: Math.round(Math.max(0, beta[1])),
      amenity: Math.round(Math.max(0, beta[2])),
      floor: Math.round(beta[3]),
    };
  }

  // ── Gauss-Jordan Elimination ──────────────────────────────────
  // Giải hệ phương trình tuyến tính Ax = b
  // Trả về null nếu ma trận suy biến (singular)
  private solveLinearSystem(A: number[][], b: number[]): number[] | null {
    const n = A.length;

    // Tạo augmented matrix [A | b]
    const aug: number[][] = A.map((row, i) => [...row, b[i]]);

    for (let col = 0; col < n; col++) {
      // Partial pivoting: tìm hàng có |A[row][col]| lớn nhất
      let maxRow = col;
      let maxVal = Math.abs(aug[col][col]);
      for (let row = col + 1; row < n; row++) {
        if (Math.abs(aug[row][col]) > maxVal) {
          maxVal = Math.abs(aug[row][col]);
          maxRow = row;
        }
      }

      // Swap rows
      if (maxRow !== col) {
        [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
      }

      const pivot = aug[col][col];
      if (Math.abs(pivot) < 1e-10) {
        return null; // ma trận suy biến
      }

      // Chia hàng pivot cho pivot value
      for (let j = col; j <= n; j++) {
        aug[col][j] /= pivot;
      }

      // Khử các hàng khác
      for (let row = 0; row < n; row++) {
        if (row === col) continue;
        const factor = aug[row][col];
        for (let j = col; j <= n; j++) {
          aug[row][j] -= factor * aug[col][j];
        }
      }
    }

    // Kết quả nằm ở cột cuối
    return aug.map((row) => row[n]);
  }

  private predict(
    coef: Coefficients,
    area: number,
    amenityCount: number,
    floor: number,
  ): number {
    return (
      coef.intercept +
      coef.area * area +
      coef.amenity * amenityCount +
      coef.floor * floor
    );
  }

  private async getTrainingData(address: string) {
    const district = this.extractDistrict(address);

    const rooms = await this.prisma.room.findMany({
      where: {
        status: { not: 'HIDDEN' },
        area: { not: null, gt: 0 },
        ...(district && {
          address: { contains: district, mode: 'insensitive' },
        }),
      },
      include: { amenities: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return rooms.map((r) => ({
      price: Number(r.price),
      area: r.area || 20,
      amenityCount: r.amenities.length,
      floor: r.floor || 1,
    }));
  }

  private extractDistrict(address: string): string {
    const match = address.match(
      /Quận\s+\d+|Quận\s+[A-Za-zÀ-ỹ]+|Huyện\s+[A-Za-zÀ-ỹ]+|Bình Thạnh|Gò Vấp|Tân Bình|Phú Nhuận|Thủ Đức|Bình Tân|Tân Phú|Bình Chánh|Hóc Môn|Nhà Bè|Cần Giờ|Củ Chi|Ba Đình|Hoàn Kiếm|Đống Đa|Hai Bà Trưng|Cầu Giấy|Thanh Xuân|Hoàng Mai|Long Biên|Nam Từ Liêm|Bắc Từ Liêm|Hà Đông|Tây Hồ/i,
    );
    return match ? match[0] : '';
  }

  private getSuggestion(status: string, diff: number): string {
    const map: Record<string, string> = {
      low: `💰 Giá đang thấp hơn thị trường ${diff}%. Có thể tăng thêm để tối ưu doanh thu.`,
      fair: `✅ Giá hợp lý so với thị trường. Dễ thu hút người thuê.`,
      high: `⚠️ Giá cao hơn thị trường ${diff}%. Cân nhắc giảm hoặc bổ sung thêm tiện ích.`,
      very_high: `🚨 Giá cao hơn thị trường ${diff}%. Rất khó thu hút người thuê ở mức giá này.`,
    };
    return map[status] || map.fair;
  }
}

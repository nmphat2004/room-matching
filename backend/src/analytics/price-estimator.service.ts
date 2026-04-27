import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface Coefficients {
  intercept: number;
  area: number;
  amenity: number;
  floor: number;
}

interface PriceEstimate {
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
    const trainingData = await this.getTrainingData(address);

    let coefficients: Coefficients;
    let estimated: number;

    if (trainingData.length >= 5) {
      // Đủ data → train Linear Regression
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

  // ── Ordinary Least Squares (OLS) ─────────────────────────────
  // Tìm hệ số b₀, b₁, b₂, b₃ tối thiểu hóa Σ(yᵢ - ŷᵢ)²
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

    // Tính giá trị trung bình
    const mPrice = data.reduce((s, d) => s + d.price, 0) / n;
    const mArea = data.reduce((s, d) => s + d.area, 0) / n;
    const mAmenity = data.reduce((s, d) => s + d.amenityCount, 0) / n;
    const mFloor = data.reduce((s, d) => s + d.floor, 0) / n;

    // Tính covariance và variance
    let covAreaPrice = 0,
      covAmenityPrice = 0,
      covFloorPrice = 0;
    let varArea = 0,
      varAmenity = 0,
      varFloor = 0;

    data.forEach((d) => {
      const da = d.area - mArea;
      const dm = d.amenityCount - mAmenity;
      const df = d.floor - mFloor;
      const dp = d.price - mPrice;

      covAreaPrice += da * dp;
      covAmenityPrice += dm * dp;
      covFloorPrice += df * dp;
      varArea += da * da;
      varAmenity += dm * dm;
      varFloor += df * df;
    });

    // Hệ số hồi quy
    const b1 = varArea > 0 ? covAreaPrice / varArea : 80_000;
    const b2 = varAmenity > 0 ? covAmenityPrice / varAmenity : 150_000;
    const b3 = varFloor > 0 ? covFloorPrice / varFloor : 30_000;
    const b0 = mPrice - b1 * mArea - b2 * mAmenity - b3 * mFloor;

    return {
      intercept: Math.round(b0),
      area: Math.round(b1),
      amenity: Math.round(b2),
      floor: Math.round(b3),
    };
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
      /Quận\s+\d+|Quận\s+[A-Za-zÀ-ỹ]+|Bình Thạnh|Gò Vấp|Tân Bình|Phú Nhuận|Thủ Đức/i,
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

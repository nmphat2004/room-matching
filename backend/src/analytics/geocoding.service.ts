import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeocodingService {
  private readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

  private normalizeAddress(address: string): string {
    return address
      .replace(/\bTP\.?\s*HCM\b/gi, 'Ho Chi Minh City')
      .replace(/\bTP\.?\s*Hồ\s*Chí\s*Minh\b/gi, 'Ho Chi Minh City')
      .replace(/\bQ\.?\s*(\d+)\b/gi, 'Quận $1')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private extractDistrict(address: string): string | null {
    const chunks = address
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    const district = chunks.find((chunk) =>
      /quận\s*\d+|huyện|thủ đức|district/i.test(chunk),
    );
    return district || null;
  }

  private async geocodeQuery(query: string): Promise<{ lat: number; lng: number } | null> {
    const response = await axios.get(this.NOMINATIM_URL, {
      params: {
        q: query,
        format: 'json',
        limit: 1,
        addressdetails: 1,
      },
      headers: {
        'User-Agent': 'RoomMatchingApp/1.0',
      },
    });

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lon);

      if (Number.isFinite(parsedLat) && Number.isFinite(parsedLng)) {
        return { lat: parsedLat, lng: parsedLng };
      }
    }

    return null;
  }

  async geocode(address: string): Promise<{ lat: number; lng: number } | null> {
    if (!address) return null;

    const normalized = this.normalizeAddress(address);
    const district = this.extractDistrict(normalized);
    const candidateQueries = [
      `${address}, Vietnam`,
      `${normalized}, Vietnam`,
      district ? `${district}, Ho Chi Minh City, Vietnam` : null,
      'Ho Chi Minh City, Vietnam',
    ].filter(Boolean) as string[];

    try {
      for (const query of candidateQueries) {
        const result = await this.geocodeQuery(query);
        if (result) {
          return result;
        }
      }

      return null;
    } catch (error: any) {
      console.error('Geocoding Error:', error?.message || error);
      return null;
    }
  }
}

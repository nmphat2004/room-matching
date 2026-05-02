import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeocodingService {
  private extractCoordsFromUrl(
    url: string,
  ): { lat: number; lng: number } | null {
    // Regex tìm tọa độ dạng @10.123,106.123 hoặc /place/10.123,106.123
    const match =
      url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
      url.match(/place\/(-?\d+\.\d+),(-?\d+\.\d+)/) ||
      url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);

    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }
    return null;
  }

  async resolveGoogleMapsUrl(
    url: string,
  ): Promise<{ lat: number; lng: number } | null> {
    try {
      let targetUrl = url;

      // Nếu là link rút gọn maps.app.goo.gl hoặc goo.gl/maps
      if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps')) {
        const response = await axios.get(url, {
          maxRedirects: 5,
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        targetUrl = response.request.res.responseUrl || url;
      }

      return this.extractCoordsFromUrl(targetUrl);
    } catch (error) {
      console.error('Error resolving Google Maps URL:', error);
      return null;
    }
  }
}

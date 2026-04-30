import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeocodingService {
  private readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

  async geocode(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const response = await axios.get(this.NOMINATIM_URL, {
        params: {
          q: address,
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
        return {
          lat: parseFloat(lat),
          lng: parseFloat(lon),
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding Error:', error.message);
      return null;
    }
  }
}

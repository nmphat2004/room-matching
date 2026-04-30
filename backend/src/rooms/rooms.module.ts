import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { UploadModule } from 'src/upload/upload.module';
import { GeocodingService } from '../analytics/geocoding.service';

@Module({
  imports: [UploadModule],
  controllers: [RoomsController],
  providers: [RoomsService, GeocodingService],
  exports: [RoomsService],
})
export class RoomsModule {}

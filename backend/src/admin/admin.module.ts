import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../users/users.module';
import { FraudModule } from '../fraud/fraud.module';

@Module({
  imports: [PrismaModule, UserModule, FraudModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

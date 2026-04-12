import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';
import { RoomsModule } from './rooms/rooms.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    PrismaModule,
    AuthModule,
    UploadModule,
    RoomsModule,
    ReviewsModule,
    ChatModule,
  ],
})
export class AppModule {}

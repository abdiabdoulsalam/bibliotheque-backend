import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtConfigModule } from '~/jwt/jwt.module';
import { UsersModule } from '~/users/users.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    JwtConfigModule,
    UsersModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

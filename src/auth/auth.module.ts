import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtConfigModule } from '~/jwt/jwt.module';
import { UsersModule } from '~/users/users.module';

@Module({
  imports: [JwtConfigModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

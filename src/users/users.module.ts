import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtConfigModule } from '~/jwt/jwt.module';

@Module({
  imports: [JwtConfigModule, TypeOrmModule.forFeature([UserEntity], 'DbConnection')],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

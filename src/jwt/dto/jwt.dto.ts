import { PickType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class JwtUserDto {
  @IsString()
  readonly id: string;

  @IsNumber()
  readonly iat: number;

  @IsNumber()
  readonly exp: number;
}

export class JwtPayloadDto extends PickType(JwtUserDto, ['id']) {}

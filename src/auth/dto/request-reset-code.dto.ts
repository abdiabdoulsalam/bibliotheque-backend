import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Email de la personne',
    example: 'youssou.ndiaye@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'mot de passe de la personne',
    example: 'youssou.ndiaye@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    description: 'confirmation du mot de passe',
    example: 'youssou.ndiaye@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  readonly confirm_password: string;

  @ApiProperty({
    description: 'code de la personne',
    example: 'youssou.ndiaye@gmail.com',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly code: number;
}

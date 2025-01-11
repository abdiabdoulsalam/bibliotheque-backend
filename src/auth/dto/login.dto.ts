import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email de la personne',
    example: 'youssou.ndiaye@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'Mot de passe de la personne',
    example: '********',
  })
  @IsString()
  @Length(4, 128, {
    message: 'Le mot de passe doit comporter entre 4 et 128 caractères',
  })
  readonly password: string;
}

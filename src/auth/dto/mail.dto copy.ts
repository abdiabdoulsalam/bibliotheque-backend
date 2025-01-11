import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class MailDto {
  @ApiProperty({
    description: 'Email de la personne',
    example: 'youssou.ndiaye@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}

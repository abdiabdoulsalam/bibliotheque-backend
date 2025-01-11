import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Prenom de la personne',
    example: 'Youssou',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 32)
  readonly username: string;

  @ApiProperty({
    description: 'email de la personne',
    example: 'Youssou@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'email de la personne',
    example: 'Youssou@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

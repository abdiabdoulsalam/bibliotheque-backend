import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePassword {
  @ApiProperty({
    description: 'password de la personne',
    example: 'Youssou@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  readonly old_password: string;

  @ApiProperty({
    description: 'password de la personne',
    example: 'Youssou@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    description: 'confirme password',
    example: 'Youssou@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  readonly confirm_password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateReviewsDto {
  @ApiProperty({
    description: 'Contenu du commentaire',
    example: '...',
  })
  @IsString()
  @IsNotEmpty()
  readonly content: string;
}

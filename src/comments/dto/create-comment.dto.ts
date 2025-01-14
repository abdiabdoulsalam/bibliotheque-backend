import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Contenu du commentaire',
    example: 'Voici le contenu de mon premier post...',
  })
  @IsString()
  @IsNotEmpty()
  readonly content: string;
}

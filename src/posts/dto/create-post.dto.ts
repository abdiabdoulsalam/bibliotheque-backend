import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'Titre du post',
    example: 'Mon premier post',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 254)
  readonly title: string;

  @ApiProperty({
    description: 'Contenu du post',
    example: 'Voici le contenu de mon premier post...',
  })
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @ApiProperty({
    description: "URL de l'image associée au post",
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  readonly image: string;
}

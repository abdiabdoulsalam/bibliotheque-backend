import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateBookDto {
  @ApiProperty({
    description: 'Titre du livre',
    example: 'Mon premier livre',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 254)
  readonly title: string;

  @ApiProperty({
    description: "Nom de l'auteur du livre",
    example: 'victor hugo',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 32)
  readonly author: string;

  @ApiProperty({
    description: "URL de l'image associée au post",
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  readonly image: string;
}

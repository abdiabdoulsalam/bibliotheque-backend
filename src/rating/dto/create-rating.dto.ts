import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Max, Min } from "class-validator";

export class CreateRatingDto {
  @ApiProperty({
    description: 'rating',
    example: '1',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}

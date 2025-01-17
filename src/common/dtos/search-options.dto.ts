import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchOptionsDto {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    type: Number,
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 1000,
    default: 10,
    type: Number,
    example: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(10000)
  @IsOptional()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  orderDirection: 'ASC' | 'DESC' = 'ASC';

  @ApiPropertyOptional({
    description: 'Search term for book title or author',
    type: String,
  })
  @IsString()
  @IsOptional()
  search?: string;
}

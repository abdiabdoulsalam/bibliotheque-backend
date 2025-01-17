import { PartialType } from '@nestjs/swagger';
import { CreateReviewsDto } from './create-reviews.dto';

export class UpdateReviewsDto extends PartialType(CreateReviewsDto) {}

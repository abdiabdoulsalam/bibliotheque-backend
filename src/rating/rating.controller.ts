import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { RequestWithUser } from '~/common/types/extended-interfaces';
import { User } from '~/common/decorators/user.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerifyGuard } from '~/common/guards/user.guard';

@Controller('ratings')
@ApiTags('Ratings Controller')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get('all-ratings')
  @UseGuards(VerifyGuard)
  @ApiResponse({ status: 200, description: 'List of all ratings retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'No ratings found.' })
  findAll() {
    return this.ratingService.findAll();
  }

  @Post('add-rating/:id')
  @UseGuards(VerifyGuard)
  @ApiResponse({ status: 201, description: 'Rating successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request, validation failed.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  create(@Body() createRatingDto: CreateRatingDto, @User() user: RequestWithUser['user'], @Param('id') id: string) {
    return this.ratingService.create(createRatingDto, user, id);
  }

  @Get(':id')
  @UseGuards(VerifyGuard)
  @ApiResponse({ status: 200, description: 'Rating details retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Rating not found.' })
  findOne(@Param('id') id: string) {
    return this.ratingService.findOne(id);
  }
}

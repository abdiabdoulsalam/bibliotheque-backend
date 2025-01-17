import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './comments.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateReviewsDto } from './dto/create-reviews.dto';
import { User } from '~/common/decorators/user.decorator';
import { RequestWithUser } from '~/common/types/extended-interfaces';
import { VerifyGuard } from '~/common/guards/user.guard';

@Controller('comments')
@ApiTags('Comments Controller')
export class ReviewsController {
  constructor(private readonly commentsService: ReviewsService) {}

  @Get('all-comments')
  @UseGuards(VerifyGuard)
  @ApiResponse({ status: 200, description: 'List of all comments retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'No comments found.' })
  findAllComments() {
    return this.commentsService.findAll();
  }

  @Post('add-comment/:bookId')
  @UseGuards(VerifyGuard)
  @ApiResponse({ status: 201, description: 'Comment successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request, validation failed.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  async writeComment(
    @Param('bookId') bookId: string,
    @Body() createCommentDto: CreateReviewsDto,
    @User() user: RequestWithUser['user'],
  ) {
    return this.commentsService.writeComment(createCommentDto, user, bookId);
  }

  @Get(':id')
  @UseGuards(VerifyGuard)
  @ApiResponse({ status: 200, description: 'Comment details retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Comment successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async deleteComment(@Param('id') id: string) {
    return this.commentsService.deleteComment(id);
  }

  @Patch('update-comment/:id')
  @UseGuards(VerifyGuard)
  @ApiResponse({ status: 200, description: 'Comment successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request, validation failed.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: CreateReviewsDto,
    @User() user: RequestWithUser['user'],
  ) {
    return this.commentsService.updateComment(id, updateCommentDto, user);
  }
}

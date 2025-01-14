import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '~/common/decorators/user.decorator';
import { RequestWithUser } from '~/common/types/extended-interfaces';

@Controller('comments')
@ApiTags('comments controllers')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('all-comments')
  @ApiResponse({})
  findAllComments() {
    return this.commentsService.findAllComments();
  }

  @Post('add-comment/:postId')
  @ApiResponse({})
  async writeComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @User() user: RequestWithUser['user'],
  ) {
    return this.commentsService.writeComment(createCommentDto, user, postId);
  }

  @Get(':id')
  @ApiResponse({})
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Delete(':id')
  @ApiResponse({})
  async deleteComment(@Param('id') id: string) {
    return this.commentsService.deleteComment(id);
  }

  @Patch('update-comment/:id')
  @ApiResponse({})
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: CreateCommentDto,
    @User() user: RequestWithUser['user'],
  ) {
    return this.commentsService.updateComment(id, updateCommentDto, user);
  }
}

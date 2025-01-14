import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '~/common/decorators/user.decorator';
import { RequestWithUser } from '~/common/types/extended-interfaces';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
@ApiTags('post controller')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiResponse({})
  findAll() {
    return this.postsService.findAll();
  }

  @Post('add-post')
  @ApiResponse({})
  addPost(@Body() createPostDto: CreatePostDto, @User() user: RequestWithUser['user']) {
    return this.postsService.addPost(createPostDto, user);
  }

  @Patch('update-post/:id')
  @ApiResponse({})
  updatePost(@Param('id') id: string, @User() user: RequestWithUser['user'], @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updatePost(id, updatePostDto, user);
  }

  @Get(':id')
  @ApiResponse({})
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }
}

import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { PostsModule } from '~/posts/posts.module';

@Module({
  imports: [PostsModule, TypeOrmModule.forFeature([CommentEntity], 'DbConnection')],
  exports: [CommentsService],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}

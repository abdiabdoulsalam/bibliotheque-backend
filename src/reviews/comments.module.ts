import { Module } from '@nestjs/common';
import { ReviewsService } from './comments.service';
import { ReviewsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsEntity } from './entities/comment.entity';
import { BooksModule } from '~/Books/books.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewsEntity], 'DbConnection'), BooksModule],
  exports: [ReviewsService],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class CommentsModule {}

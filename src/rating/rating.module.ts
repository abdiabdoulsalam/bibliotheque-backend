import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingEntity } from './entities/rating.entity';
import { BooksModule } from '~/Books/books.module';

@Module({
  imports: [TypeOrmModule.forFeature([RatingEntity], 'DbConnection'), BooksModule],
  exports: [RatingService],
  providers: [RatingService],
  controllers: [RatingController],
})
export class RatingModule {}

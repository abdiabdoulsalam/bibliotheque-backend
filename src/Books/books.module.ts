import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BookEntity } from './entities/books.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagerService } from '~/common/services/pager.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity], 'DbConnection')],
  controllers: [BooksController],
  providers: [PagerService, BooksService],
  exports: [BooksService],
})
export class BooksModule {}

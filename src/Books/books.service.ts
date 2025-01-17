import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { BookEntity } from './entities/books.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UpdateBookDto } from './dto/update-book.dto';
import { PageOptionsDto } from '~/common/dtos/page-options.dto';
import { PagerService } from '~/common/services/pager.service';
import { SearchOptionsDto } from '~/common/dtos/search-options.dto';
import { errors } from '~/common/util/error-messages';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookEntity, 'DbConnection')
    private readonly bookRepository: Repository<BookEntity>,
    private pagerService: PagerService,
  ) {}

  addBook(createLivreDto: CreateBookDto) {
    return this.bookRepository.save(createLivreDto);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    try {
      const queryBuilder = this.bookRepository
        .createQueryBuilder('book')
        .leftJoinAndSelect('book.ratings', 'ratings')
        .leftJoinAndSelect('book.reviews', 'reviews')
        .select(['book', 'ratings', 'reviews'])
        .groupBy('book.id, reviews.id, ratings.id')
        .orderBy('book.id', pageOptionsDto.orderDirection);

      const pageDto = await this.pagerService.applyPagination({
        queryBuilder,
        pageOptionsDto,
      });

      const booksWithAverageRating = pageDto.data.map((book) => {
        const ratings = book.ratings || [];
        const averageRating = ratings.length
          ? ratings.reduce((sum, rating) => sum + rating.note, 0) / ratings.length
          : 0;

        return { ...book, averageRating };
      });

      return {
        ...pageDto,
        data: booksWithAverageRating,
      };
    } catch (error) {
      console.error('Error fetching books:', error);
      throw new Error('An error occurred while fetching the list of books.');
    }
  }

  async findOne(id: string) {
    try {
      return await this.bookRepository.findOne({ where: { id }, relations: ['reviews'] });
    } catch (error) {
      console.error('Error fetching books:', error);
      throw new Error('An error occurred while fetching the list of books.');
    }
  }

  async update(id: string, updateLivreDto: UpdateBookDto) {
    try {
      const book = await this.bookRepository.findOne({ where: { id } });
      if (!book) {
        throw new NotFoundException(errors.book.not_found);
      }
      return this.bookRepository.update(id, updateLivreDto);
    } catch (err) {
      console.error('Error fetching books:', err);
      throw new Error('An error occurred while fetching the list of books.');
    }
  }

  async remove(id: string) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(errors.book.not_found);
    }
    return this.bookRepository.delete(id);
  }

  async topratings() {
    try {
      const books = await this.bookRepository.find({ relations: ['reviews', 'ratings'] });
      console.log('Livres récupérés:', books);
      const booksWithAverageRating = books.map((book) => {
        const ratings = book.ratings || [];
        const averageRating = ratings.length
          ? ratings.reduce((sum, rating) => sum + rating.note, 0) / ratings.length
          : 0;

        return { ...book, averageRating };
      });

      const sortedBooks = booksWithAverageRating.sort((a, b) => b.averageRating - a.averageRating);

      const top5Books = sortedBooks.slice(0, 5);

      return top5Books;
    } catch (error) {
      console.error('Error fetching top 5 books:', error);
      throw new Error('An error occurred while fetching the top 5 books.');
    }
  }

  async search(searchOptionsDto: SearchOptionsDto) {
    try {
      const queryBuilder: SelectQueryBuilder<BookEntity> = this.bookRepository
        .createQueryBuilder('book')
        .leftJoinAndSelect('book.ratings', 'ratings')
        .leftJoinAndSelect('book.reviews', 'reviews')
        .select(['book', 'ratings', 'reviews'])
        .groupBy('book.id, reviews.id, ratings.id')
        .orderBy('book.id', searchOptionsDto.orderDirection);

      if (searchOptionsDto.search) {
        queryBuilder.andWhere('book.title LIKE :search OR book.author LIKE :search', {
          search: `%${searchOptionsDto.search}%`,
        });
      }

      const [books, total] = await queryBuilder.getManyAndCount();

      const booksWithAverageRating = books.map((book) => {
        const ratings = book.ratings || [];
        const averageRating = ratings.length
          ? ratings.reduce((sum, rating) => sum + rating.note, 0) / ratings.length
          : 0;

        return { ...book, averageRating };
      });

      return {
        data: booksWithAverageRating,
        total,
        page: searchOptionsDto.page,
        limit: searchOptionsDto.limit,
      };
    } catch (error) {
      console.error('Error fetching books:', error);
      throw new Error('An error occurred while fetching the list of books.');
    }
  }
}

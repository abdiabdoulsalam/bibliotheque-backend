import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RatingEntity } from './entities/rating.entity';
import { Repository } from 'typeorm';
import { BooksService } from '~/Books/books.service';
import { RequestWithUser } from '~/common/types/extended-interfaces';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(RatingEntity, 'DbConnection')
    private readonly ratingRepository: Repository<RatingEntity>,
    private readonly booksService: BooksService,
  ) {}
  async create(createRatingDto: CreateRatingDto, user: RequestWithUser['user'], id: string) {
    try {
      const book = await this.booksService.findOne(id);
      if (!book) {
        throw new NotFoundException('Livre introuvable.');
      }

      const existingRating = await this.ratingRepository.findOne({
        where: {
          user: { id: user.id },
          book: { id },
        },
        relations: ['user', 'book'],
      });

      if (existingRating) {
        throw new BadRequestException('Vous avez déjà évalué ce livre.');
      }

      const newRating = this.ratingRepository.create({
        ...createRatingDto,
        user,
        book,
      });

      return await this.ratingRepository.save(newRating);
    } catch (error) {
      console.error('Error while writing a rating:', error);
      throw new Error(
        error instanceof NotFoundException || error.message === 'Vous avez déjà évalué ce livre.'
          ? error.message
          : "Une erreur est survenue lors de l'ajout du rating.",
      );
    }
  }

  findAll() {
    return this.ratingRepository.find({ relations: ['user', 'book'] });
  }

  findOne(id: string) {
    return this.ratingRepository.findOne({ where: { id } });
  }
}

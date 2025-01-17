import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewsEntity } from './entities/comment.entity';
import { RequestWithUser } from '~/common/types/extended-interfaces';
import { CreateReviewsDto } from './dto/create-reviews.dto';
import { BooksService } from '~/Books/books.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewsEntity, 'DbConnection')
    private readonly commentRepository: Repository<ReviewsEntity>,
    private readonly booksService: BooksService,
  ) {}

  async writeComment(
    createCommentDto: CreateReviewsDto,
    user: RequestWithUser['user'],
    id: string,
  ): Promise<ReviewsEntity> {
    try {
      const book = await this.booksService.findOne(id);
      if (!book) {
        throw new NotFoundException('Livre introuvable.');
      }

      const newComment = this.commentRepository.create({
        ...createCommentDto,
        user,
        book,
      });

      return await this.commentRepository.save(newComment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new Error("Une erreur est survenue lors de l'ajout du commentaire.");
      }
    }
  }

  findAll() {
    return this.commentRepository.find({ relations: ['user', 'book'] });
  }

  findOne(id: string) {
    return this.commentRepository.findOne({ where: { id } });
  }

  async deleteComment(id: string) {
    const comment = await this.findOne(id);
    if (!comment) {
      throw new NotFoundException('Commentaire introuvable.');
    }
    await this.commentRepository.delete({ id });
    return { message: 'success' };
  }

  async updateComment(id: string, updateCommentDto: CreateReviewsDto, user: RequestWithUser['user']) {
    const comment = await this.findOne(id);
    if (!comment) {
      throw new NotFoundException('Commentaire introuvable.');
    }
    if (!(comment.user.id === user.id)) {
      throw new NotFoundException('Vous ne pouvez pas modifier ce commentaire.');
    }

    comment.content = updateCommentDto.content;
    await this.commentRepository.save(comment);

    return comment;
  }
}

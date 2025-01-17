import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewsDto } from './dto/create-reviews.dto';
import { NotFoundException } from '@nestjs/common';
import { ReviewsService } from './comments.service';
import { ReviewsEntity } from './entities/comment.entity';
import { BooksService } from '~/Books/books.service';
import { BookEntity } from '~/Books/entities/books.entity';
import { ROLE } from '~/common/enums/role.enum';
import { UserEntity } from '~/users/entities/user.entity';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let commentRepository: Repository<ReviewsEntity>;
  let booksService: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: getRepositoryToken(ReviewsEntity, 'DbConnection'),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: BooksService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    commentRepository = module.get<Repository<ReviewsEntity>>(getRepositoryToken(ReviewsEntity, 'DbConnection'));
    booksService = module.get<BooksService>(BooksService);
  });

  describe('writeComment', () => {
    const createCommentDto: CreateReviewsDto = {
      content: 'Great book!',
    };

    const user: UserEntity = {
      id: 'user1',
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password',
      role: ROLE.USER,
      created_at: new Date(),
      updated_at: new Date(),
      ratings: [],
      reviews: [],
      active: true,
      code: 3333,
      is_code_used: false,
      hasId: () => true,
      save: jest.fn(),
      remove: jest.fn(),
      softRemove: jest.fn(),
      recover: jest.fn(),
      reload: jest.fn(),
    };
    const bookId = 'book1';
    const book: BookEntity = {
      id: bookId,
      title: '',
      author: '',
      reviews: [],
      ratings: [],
      created_at: new Date(),
      updated_at: new Date(),
      hasId: () => true,
      save: jest.fn(),
      remove: jest.fn(),
      softRemove: jest.fn(),
      recover: jest.fn(),
      reload: jest.fn(),
    };
    const newComment: ReviewsEntity = {
      id: 'comment1',
      content: createCommentDto.content,
      created_at: new Date(),
      updated_at: new Date(),
      user,
      book,
    };

    it('should create a comment', async () => {
      jest.spyOn(booksService, 'findOne').mockResolvedValue(book);
      jest.spyOn(commentRepository, 'create').mockReturnValue(newComment);
      jest.spyOn(commentRepository, 'save').mockResolvedValue(newComment);

      const result = await service.writeComment(createCommentDto, user, bookId);

      expect(booksService.findOne).toHaveBeenCalledWith(bookId);
      expect(commentRepository.create).toHaveBeenCalledWith({
        ...createCommentDto,
        user,
        book,
      });
      expect(commentRepository.save).toHaveBeenCalledWith(newComment);
      expect(result).toEqual(newComment);
    });

    it('should throw NotFoundException if book is not found', async () => {
      jest.spyOn(booksService, 'findOne').mockResolvedValue(null);

      await expect(service.writeComment(createCommentDto, user, bookId)).rejects.toThrow(NotFoundException);
    });

    it('should handle errors during comment creation', async () => {
      jest.spyOn(booksService, 'findOne').mockResolvedValue(book);
      jest.spyOn(commentRepository, 'create').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(service.writeComment(createCommentDto, user, bookId)).rejects.toThrow(
        "Une erreur est survenue lors de l'ajout du commentaire.",
      );
    });
  });
});

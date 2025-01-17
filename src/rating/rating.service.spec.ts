import { Test, TestingModule } from '@nestjs/testing';
import { RatingService } from './rating.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRatingDto } from './dto/create-rating.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { RatingEntity } from './entities/rating.entity';
import { BooksService } from '~/Books/books.service';
import { BookEntity } from '~/Books/entities/books.entity';
import { UserEntity } from '~/users/entities/user.entity';
import { ROLE } from '~/common/enums/role.enum';

describe('RatingService', () => {
  let service: RatingService;
  let ratingRepository: Repository<RatingEntity>;
  let booksService: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingService,
        {
          provide: getRepositoryToken(RatingEntity),
          useClass: Repository,
        },
        {
          provide: BooksService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RatingService>(RatingService);
    ratingRepository = module.get<Repository<RatingEntity>>(getRepositoryToken(RatingEntity));
    booksService = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a rating', async () => {
      const createRatingDto: CreateRatingDto = {
        rating: 5,
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
      const newRating: RatingEntity = {
        id: 'rating1',
        note: createRatingDto.rating,
        created_at: new Date(),
        updated_at: new Date(),
        user,
        book,
      };

      jest.spyOn(booksService, 'findOne').mockResolvedValue(book);
      jest.spyOn(ratingRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(ratingRepository, 'create').mockReturnValue(newRating);
      jest.spyOn(ratingRepository, 'save').mockResolvedValue(newRating);

      const result = await service.create(createRatingDto, user, bookId);

      expect(booksService.findOne).toHaveBeenCalledWith(bookId);
      expect(ratingRepository.findOne).toHaveBeenCalledWith({
        where: {
          user: { id: user.id },
          book: { id: bookId },
        },
        relations: ['user', 'book'],
      });
      expect(ratingRepository.create).toHaveBeenCalledWith({
        ...createRatingDto,
        user,
        book,
      });
      expect(ratingRepository.save).toHaveBeenCalledWith(newRating);
      expect(result).toEqual(newRating);
    });

    it('should throw NotFoundException if book is not found', async () => {
      const createRatingDto: CreateRatingDto = {
        rating: 5,
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

      jest.spyOn(booksService, 'findOne').mockResolvedValue(null);

      await expect(service.create(createRatingDto, user, bookId)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if rating already exists', async () => {
      const createRatingDto: CreateRatingDto = {
        rating: 5,
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


      jest.spyOn(booksService, 'findOne').mockResolvedValue(book);

      await expect(service.create(createRatingDto, user, bookId)).rejects.toThrow(BadRequestException);
    });
  });
});

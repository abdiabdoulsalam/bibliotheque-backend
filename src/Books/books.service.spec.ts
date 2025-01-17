import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookEntity } from './entities/books.entity';
import { PagerService } from '~/common/services/pager.service';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { NotFoundException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let repository: Repository<BookEntity>;
  let pagerService: PagerService;

  const mockRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      getMany: jest.fn().mockResolvedValue([]),
      where: jest.fn().mockReturnThis(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: PagerService,
          useValue: {
            applyPagination: jest.fn().mockResolvedValue({
              data: [],
              metadata: {
                page: 1,
                take: 10,
                itemCount: 0,
                pageCount: 0,
                hasPreviousPage: false,
                hasNextPage: false,
              },
            }),
          },
        },
        {
          provide: getRepositoryToken(BookEntity, 'DbConnection'),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<Repository<BookEntity>>(getRepositoryToken(BookEntity, 'DbConnection'));
    pagerService = module.get<PagerService>(PagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addBook', () => {
    it('devrait créer un nouveau livre avec succès', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        image: 'test-image.jpg',
      };

      const savedBook = {
        id: '1',
        ...createBookDto,
        ratings: [],
        reviews: [],
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(repository, 'save').mockResolvedValue(savedBook as unknown as BookEntity);

      const result = await service.addBook(createBookDto);

      expect(repository.save).toHaveBeenCalledWith(createBookDto);
      expect(result).toEqual(savedBook);
    });

    it('devrait gérer les erreurs lors de la sauvegarde', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        image: 'test-image.jpg',
      };

      jest.spyOn(repository, 'save').mockRejectedValue(new Error('DB Error'));

      await expect(service.addBook(createBookDto)).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('devrait retourner un livre par son ID', async () => {
      const mockBook = {
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        image: 'test-image.jpg',
        ratings: [],
        reviews: [],
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockBook as unknown as BookEntity);

      const result = await service.findOne('1');
      expect(result).toEqual(mockBook);
    });

    it("devrait gérer le cas où le livre n'existe pas", async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.findOne('999');
      expect(result).toBeNull();
    });
  });
});

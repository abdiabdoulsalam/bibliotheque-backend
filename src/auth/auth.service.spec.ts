import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
import { JwtConfigService } from '~/jwt/jwt.service';
import { CreateUserDto } from '~/users/dto/create-user.dto';
import { UserEntity } from '~/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtConfigService: JwtConfigService;
  let configService: ConfigService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtConfigService,
          useValue: {
            bcryptHash: jest.fn(),
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtConfigService = module.get<JwtConfigService>(JwtConfigService);
    configService = module.get<ConfigService>(ConfigService);
    mailerService = module.get<MailerService>(MailerService);
  });

  describe('createUser', () => {
    const mockResponse = {
      cookie: jest.fn(),
    } as unknown as Response;
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
      username: 'John',
    };

    it('devrait créer un utilisateur avec succès', async () => {
      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        id: '1',
        email: createUserDto.email,
        firstName: createUserDto.username,
      };
      const jwt = 'mockJwtToken';

      jest.spyOn(jwtConfigService, 'bcryptHash').mockResolvedValue(hashedPassword);
      jest.spyOn(usersService, 'createUser').mockResolvedValue(createdUser as unknown as UserEntity);
      jest.spyOn(jwtConfigService, 'signAsync').mockResolvedValue(jwt);

      const result = await service.createUser(createUserDto, mockResponse);

      expect(jwtConfigService.bcryptHash).toHaveBeenCalledWith(createUserDto.password);
      expect(usersService.createUser).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(jwtConfigService.signAsync).toHaveBeenCalledWith({ id: createdUser.id });
      expect(mockResponse.cookie).toHaveBeenCalledWith('user', jwt, { httpOnly: true });
      expect(result).toEqual({
        message: 'user created successfully',
        user: createdUser,
      });
    });

    it('devrait lever une erreur si le mot de passe est manquant', async () => {
      const invalidDto = {
        ...createUserDto,
        password: undefined,
      };

      await expect(service.createUser(invalidDto as unknown as CreateUserDto, mockResponse)).rejects.toThrow(
        'Password is required',
      );
    });

    it('devrait gérer les erreurs de hachage du mot de passe', async () => {
      jest.spyOn(jwtConfigService, 'bcryptHash').mockRejectedValue(new Error('Hashing failed'));

      await expect(service.createUser(createUserDto, mockResponse)).rejects.toThrow('Hashing failed');
    });

    it("devrait gérer les erreurs de création d'utilisateur", async () => {
      jest.spyOn(jwtConfigService, 'bcryptHash').mockResolvedValue('hashedPassword');
      jest.spyOn(usersService, 'createUser').mockRejectedValue(new Error('User creation failed'));

      await expect(service.createUser(createUserDto, mockResponse)).rejects.toThrow('User creation failed');
    });

    it('devrait gérer les erreurs de génération de JWT', async () => {
      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        id: '1',
        email: createUserDto.email,
        firstName: createUserDto.username,
      };

      jest.spyOn(jwtConfigService, 'bcryptHash').mockResolvedValue(hashedPassword);
      jest.spyOn(usersService, 'createUser').mockResolvedValue(createdUser as unknown as UserEntity);
      jest.spyOn(jwtConfigService, 'signAsync').mockRejectedValue(new Error('JWT generation failed'));

      await expect(service.createUser(createUserDto, mockResponse)).rejects.toThrow('JWT generation failed');
    });
  });
});

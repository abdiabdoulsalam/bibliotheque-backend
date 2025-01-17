import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtConfigService } from '~/jwt/jwt.service';
import { Response } from 'express';
import { CreateUserDto } from '~/users/dto/create-user.dto';
import { UsersService } from '~/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RequestWithUser } from '~/common/types/extended-interfaces';
import { UserEntity } from '~/users/entities/user.entity';
import { ROLE } from '~/common/enums/role.enum';
import { UpdatePassword } from './dto/update-password.dto';
import { MailDto } from './dto/mail.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from './dto/request-reset-code.dto';
import { errors } from '~/common/util/error-messages';
import { UploadApiResponse, v2 } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtConfigService: JwtConfigService,
    private readonly usersService: UsersService,
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {
    v2.config({
      cloud_name: this.configService.get('secret.cloudinary_cloud_name'),
      api_key: this.configService.get('secret.cloudinary_api_key'),
      api_secret: this.configService.get('secret.cloudinary_api_secret'),
    });
  }

  async createUser(createAuthDto: CreateUserDto, response: Response) {
    const { password, ...dto } = createAuthDto;
    if (!password) {
      throw new Error('Password is required');
    }
    const hashedPassword = await this.jwtConfigService.bcryptHash(password);
    const user = await this.usersService.createUser({ ...dto, password: hashedPassword });

    const jwt = await this.jwtConfigService.signAsync({ id: user.id });
    response.cookie('user', jwt, { httpOnly: true });
    return { message: 'user created successfully', user };
  }

  async createAdmin(createAuthDto: CreateUserDto, response: Response) {
    const { password, ...dto } = createAuthDto;
    const hashedPassword = await this.jwtConfigService.bcryptHash(password);

    const admin = new UserEntity();
    Object.assign(admin, {
      ...dto,
      role: ROLE.ADMIN,
      password: hashedPassword,
    });

    await this.usersService.createUser(admin);

    const jwt = await this.jwtConfigService.signAsync({ id: admin.id });
    response.cookie('user', jwt, { httpOnly: true });

    return { message: 'user created successfully', admin };
  }

  async login(loginDto: LoginDto, response: Response) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByUserEmail(email);
    if (!user) {
      throw new UnauthorizedException(errors.auth.invalid_credentials);
    }

    if (!(await this.jwtConfigService.bcryptCompare(password, user.password))) {
      throw new BadRequestException(errors.auth.invalid_password);
    }
    const jwt = await this.jwtConfigService.signAsync({ id: user.id });

    response.cookie('user', jwt, { httpOnly: true });
    await this.jwtConfigService.signAsync({ id: user.id });
    return { success: true, message: 'Login successful' };
  }

  getUserSession(user: RequestWithUser['user']) {
    const session = {
      id: user.id,
      email: user.email,
      name: user.username,
      image: user.image,
    };

    return session;
  }

  async updatepassword(user: RequestWithUser['user'], updatePassword: UpdatePassword) {
    const { password, confirm_password, old_password } = updatePassword;

    if (password !== confirm_password) {
      throw new BadRequestException('Passwords do not match');
    }

    const isOldPasswordCorrect = await this.jwtConfigService.bcryptCompare(old_password, user.password);
    if (!isOldPasswordCorrect) {
      throw new BadRequestException('Invalid old password');
    }

    if (await this.jwtConfigService.bcryptCompare(password, user.password)) {
      throw new BadRequestException('New password cannot be the same as the old one');
    }

    const hashedPassword = await this.jwtConfigService.bcryptHash(password);
    await this.usersService.update(user.id, {
      password: hashedPassword,
    });

    return { success: true, message: 'Password updated successfully' };
  }

  generateResetCode(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  async sendCode(mailDto: MailDto) {
    const code = this.generateResetCode();
    const { email } = mailDto;
    if (!email) {
      throw new BadRequestException(errors.user.email_not_found);
    }
    const user = await this.usersService.findByUserEmail(email);
    if (!user) {
      throw new NotFoundException(errors.user.not_found);
    }
    user.code = code;
    user.is_code_used = false;
    await this.usersService.save(user);

    await this.mailService.sendMail({
      to: 'abdoulsalammohamed830@gmail.com',
      subject: 'Réinitialiser votre mot de passe',
      html: `${code}`,
    });

    return { success: true, message: 'Code de réinitialisation envoyé' };
  }

  async forgotPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, password, code, confirm_password } = resetPasswordDto;
    const user = await this.usersService.findByUserEmail(email);

    if (!user) throw new NotFoundException(errors.user.not_found);

    if (user.is_code_used) {
      throw new BadRequestException(errors.auth.code_used);
    }

    if (user.code !== code) {
      throw new BadRequestException(errors.auth.invalid_code);
    }

    if (password !== confirm_password) {
      throw new BadRequestException(errors.auth.invalid_password);
    }

    const hashedPassword = await this.jwtConfigService.bcryptHash(password);

    await this.usersService.update(user.id, {
      password: hashedPassword,
      is_code_used: true,
    });

    return { success: true, message: 'Password updated successfully' };
  }

  async uploadImage(filePath: string, user: RequestWithUser['user']): Promise<UploadApiResponse> {
    try {
      const result = await v2.uploader.upload(filePath, { folder: 'fintra' });
      if (!result) {
        throw new Error('Cloudinary returned an undefined upload result');
      }
      const updatedUser = { ...user, image: result.url };

      await this.usersService.update(user.id, updatedUser);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Image upload failed: ${error.message}`);
      }
      throw new Error('Unexpected error occurred during image upload');
    }
  }
}

import { Body, Controller, Get, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '~/common/decorators/public.decorator';
import { CreateUserDto } from '~/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RequestWithUser } from '~/common/types/extended-interfaces';
import { User } from '~/common/decorators/user.decorator';
import { Roles } from '~/common/decorators/roles.decorator';
import { ROLE } from '~/common/enums/role.enum';
import { UpdatePassword } from './dto/update-password.dto';
import { UsersService } from '~/users/users.service';
import { MailDto } from './dto/mail.dto';
import { ResetPasswordDto } from './dto/request-reset-code.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Express } from 'express';
import { VerifyGuard } from '~/common/guards/user.guard';

@Controller('auth')
@ApiTags('auth Controller')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('register')
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad request, validation failed.' })
  async createUser(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
    return await this.authService.createUser(createUserDto, response);
  }

  @Public()
  @Post('login')
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Unauthorized, invalid credentials.' })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    return await this.authService.login(loginDto, response);
  }

  @Roles(ROLE.ADMIN)
  @Post('create-admin')
  @ApiResponse({ status: 201, description: 'Admin user successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request, validation failed.' })
  async createAdmin(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
    return await this.authService.createAdmin(createUserDto, response);
  }

  @Get('session')
  @UseGuards(VerifyGuard)
  @ApiResponse({ status: 200, description: 'User session retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User session not found.' })
  getUserSession(@User() user: RequestWithUser['user']) {
    return this.authService.getUserSession(user);
  }

  @Post('logout')
  @UseGuards(VerifyGuard)
  @ApiResponse({ status: 200, description: 'User successfully logged out.' })
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('user');
    return { success: true, message: 'Vous avez été déconnecté' };
  }

  @Put('update-password')
  @UseGuards(VerifyGuard)
  @ApiResponse({ status: 200, description: 'Password successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request, validation failed.' })
  async updatePassword(@User() user: RequestWithUser['user'], @Body() updatePassword: UpdatePassword) {
    return await this.authService.updatepassword(user, updatePassword);
  }

  @Post('send-code')
  @Public()
  @ApiResponse({ status: 200, description: 'Reset code successfully sent.' })
  @ApiResponse({ status: 400, description: 'Bad request, validation failed.' })
  async sendResetCode(@Body() mailDto: MailDto) {
    return await this.authService.sendCode(mailDto);
  }

  @Post('reset-password')
  @Public()
  @ApiResponse({ status: 200, description: 'Password successfully reset.' })
  @ApiResponse({ status: 400, description: 'Bad request, validation failed.' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.forgotPassword(resetPasswordDto);
  }

  @Post('upload-image')
  @ApiResponse({ status: 200, description: 'Image successfully uploaded.' })
  @ApiResponse({ status: 400, description: 'Bad request, validation failed.' })
  @UseGuards(VerifyGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updloadImage(@UploadedFile() file: Express.Multer.File, @User() user: RequestWithUser['user']) {
    try {
      const result = await this.authService.uploadImage(file.path, user);
      return result.url;
    } catch (error) {
      console.error('Detailed upload error:', {
        originalError: error,
        message: error.message,
        stack: error.stack,
      });

      throw error;
    }
  }
}

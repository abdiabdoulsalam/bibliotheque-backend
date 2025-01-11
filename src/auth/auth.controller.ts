import { Body, Controller, Get, Post, Put, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '~/common/decorators/public.decorator';
import { CreateUserDto } from '~/users/dto/create-user.dto';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { RequestWithUser } from '~/common/types/extended-interfaces';
import { User } from '~/common/decorators/user.decorator';
import { Roles } from '~/common/decorators/roles.decorator';
import { ROLE } from '~/common/enums/role.enum';
import { UpdatePassword } from './dto/update-password.dto';
import { UsersService } from '~/users/users.service';
import { MailDto } from './dto/mail.dto';
import { ResetPasswordDto } from './dto/request-reset-code.dto';

@Controller('auth')
@ApiTags('auth Controller')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('register-user')
  @ApiResponse({})
  async createUser(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
    return await this.authService.createUser(createUserDto, response);
  }

  @Public()
  @Post('login')
  @ApiResponse({})
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    return await this.authService.login(loginDto, response);
  }

  @Public()
  @Post('create-admin')
  @ApiResponse({})
  async createAdmin(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
    return await this.authService.createAdmin(createUserDto, response);
  }

  @Get('session')
  @ApiResponse({})
  getUserSession(@User() user: RequestWithUser['user']) {
    return this.authService.getUserSession(user);
  }

  @Post('logout')
  @ApiResponse({})
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('user');
    return { success: true, message: 'Vous avez été déconnecté' };
  }

  @Put('update-password')
  @Roles(ROLE.ADMIN, ROLE.USER)
  @ApiResponse({})
  async updatePassword(@User() user: RequestWithUser['user'], @Body() updatePassword: UpdatePassword) {
    return await this.authService.updatepassword(user, updatePassword);
  }

  @Post('send-code')
  @Public()
  @ApiResponse({})
  async sendResetCode(@Body() mailDto: MailDto) {
    return await this.authService.sendCode(mailDto);
  }

  @Post('reset-password')
  @Public()
  @ApiResponse({})
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.forgotPassword(resetPasswordDto);
  }
}

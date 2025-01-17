import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ROLE } from '~/common/enums/role.enum';
import { Roles } from '~/common/decorators/roles.decorator';
import { User } from '~/common/decorators/user.decorator';
import { RequestWithUser } from '~/common/types/extended-interfaces';
import { VerifyAdminGuard, VerifyGuard, VerifyUserGuard } from '~/common/guards/user.guard';

@Controller('users')
@ApiTags('Users Controller')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(VerifyAdminGuard)
  @ApiResponse({ status: 200, description: 'List of all users retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'No users found.' })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Patch('update-profile')
  @UseGuards(VerifyGuard)
  @ApiResponse({ status: 200, description: 'User profile successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request, validation failed.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateProfile(@User() user: RequestWithUser['user'], @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateProfile(user, updateUserDto);
  }

  @Patch('update-user/:id')
  @UseGuards(VerifyAdminGuard)
  @ApiResponse({ status: 200, description: 'User successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request, validation failed.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(VerifyAdminGuard)
  @ApiResponse({ status: 200, description: 'User successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async delete(@Param('id') id: string) {
    await this.usersService.delete(id);
    return { message: 'User deleted successfully' };
  }

  @Get(':id')
  @UseGuards(VerifyGuard)
  @ApiResponse({ status: 200, description: 'User details retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }
}

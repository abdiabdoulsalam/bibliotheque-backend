import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ROLE } from '~/common/enums/role.enum';
import { Roles } from '~/common/decorators/roles.decorator';
import { User } from '~/common/decorators/user.decorator';
import { RequestWithUser } from '~/common/types/extended-interfaces';

@Controller('users')
@ApiTags('user controller')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(ROLE.ADMIN)
  @ApiResponse({})
  async findAll() {
    return await this.usersService.findAll();
  }

  @Patch('update-users')
  @Roles(ROLE.ADMIN)
  @ApiResponse({})
  async updateUsers(@Param() id: string, @Body() updateUserDto: UpdateUserDto) {
    await this.usersService.update(id, updateUserDto);
  }

  @Get(':id')
  @Roles(ROLE.ADMIN)
  @ApiResponse({})
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch('update-user/:id')
  @Roles(ROLE.ADMIN)
  @ApiResponse({})
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Patch('update-profile')
  @Roles(ROLE.USER, ROLE.ADMIN)
  @ApiResponse({})
  async updateProfile(@User() user: RequestWithUser['user'], @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateProfile(user, updateUserDto);
  }

  @Delete(':id')
  @Roles(ROLE.ADMIN)
  @ApiResponse({})
  async delete(@Param('id') id: string) {
    await this.usersService.delete(id);
    return { message: 'user deleted successfully' };
  }
}

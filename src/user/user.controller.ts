import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body('name') name: string, @Body('email') email: string) {
    return this.userService.createUser(name, email);
  }

  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    return this.userService.getUserById(userId);
  }

  @Get(':userId/avatar')
  async getUserAvatar(@Param('userId') userId: string) {
    console.log('I m here', userId);

    return this.userService.getUserAvatar(userId);
  }

  @Delete(':userId/avatar')
  async deleteUserAvatar(@Param('userId') userId: string) {
    return this.userService.deleteUserAvatar(userId);
  }
}

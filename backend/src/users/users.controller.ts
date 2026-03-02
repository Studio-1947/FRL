import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Get('people')
  @ApiOperation({ summary: 'Get all user public profiles (without passwords)' })
  @ApiResponse({ status: 200, description: 'Returns safe profiles suitable for public directory' })
  async getPeople() {
    return this.usersService.findPeople();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  async createUser(@Body() body: { email: string; name?: string }) {
    return this.usersService.create(body);
  }
}

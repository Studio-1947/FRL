import { Controller, Get, Post, Body, Patch, UseGuards, Req, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SuperAdmin')
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Get('people')
  @ApiOperation({ summary: 'Get all user public profiles (without passwords) with pagination' })
  @ApiResponse({ status: 200, description: 'Returns safe profiles with pagination metadata' })
  async getPeople(@Query('page') page: string = '1', @Query('limit') limit: string = '3') {
    return this.usersService.findPeople(parseInt(page), parseInt(limit));
  }

  @Get('people/:id')
  @ApiOperation({ summary: 'Get a specific user public profile' })
  @ApiResponse({ status: 200, description: 'Returns safe profile for a specific user' })
  async getPersonById(@Param('id') id: string) {
    return this.usersService.findPersonById(parseInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get logged in user profile' })
  @ApiResponse({ status: 200, description: 'Returns the current users complete profile' })
  async getProfile(@Req() req: Request & { user: any }) {
    // req.user is populated by JwtStrategy validate method
    return this.usersService.findById(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @ApiOperation({ summary: 'Update logged in user profile' })
  @ApiResponse({ status: 200, description: 'The user profile has been successfully updated.' })
  async updateProfile(@Req() req: Request & { user: any }, @Body() body: any) {
    // Disallow updating password or ID through this open object payload
    const { password, id, createdAt, updatedAt, ...safeData } = body;
    return this.usersService.updateProfile(req.user.sub, safeData);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  async createUser(@Body() body: { email: string; name?: string }) {
    return this.usersService.create(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SuperAdmin')
  @Patch(':id/role')
  @ApiOperation({ summary: 'Update user role (SuperAdmin only)' })
  @ApiResponse({ status: 200, description: 'The user role has been successfully updated.' })
  async updateUserRole(@Param('id') id: string, @Body() body: { role: string }) {
    return this.usersService.updateRole(parseInt(id), body.role);
  }
}

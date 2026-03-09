import { Controller, Post, Delete, Param, UseGuards, Req, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FollowsService } from './follows.service';
import { Request } from 'express';

@ApiTags('Follows')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':id')
  @ApiOperation({ summary: 'Follow a user' })
  async follow(@Req() req: Request & { user: any }, @Param('id') id: string) {
    return this.followsService.follow(Number(req.user.sub), parseInt(id));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Unfollow a user' })
  async unfollow(@Req() req: Request & { user: any }, @Param('id') id: string) {
    return this.followsService.unfollow(Number(req.user.sub), parseInt(id));
  }

  @Get('status/:id')
  @ApiOperation({ summary: 'Check if following a user' })
  async status(@Req() req: Request & { user: any }, @Param('id') id: string) {
    const isFollowing = await this.followsService.isFollowing(Number(req.user.sub), parseInt(id));
    return { isFollowing };
  }
}

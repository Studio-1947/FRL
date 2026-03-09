import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Request } from 'express';

@ApiTags('Comments')
@ApiBearerAuth()
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new comment or reply for a post' })
  async create(
    @Req() req: Request & { user: any },
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(Number(req.user.sub), parseInt(postId), createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments for a post in a threaded structure' })
  async findAll(@Param('postId') postId: string) {
    return this.commentsService.findByPost(parseInt(postId));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a comment' })
  async remove(@Req() req: Request & { user: any }, @Param('id') id: string) {
    return this.commentsService.remove(parseInt(id), Number(req.user.sub));
  }
}

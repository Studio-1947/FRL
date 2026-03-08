import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Request } from 'express';
import { put } from '@vercel/blob';
import { extname } from 'path';

@ApiTags('Posts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post with optional image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        content: { type: 'string' },
        category: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Req() req: Request & { user: any },
    @UploadedFile() file: any,
    @Body() createPostDto: CreatePostDto,
  ) {
    let imageUrl = null;

    if (file) {
      console.log('File upload detected:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        bufferExists: !!file.buffer,
      });

      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (!token) {
        console.error('CRITICAL: BLOB_READ_WRITE_TOKEN is not defined');
        throw new BadRequestException('Image upload service is currently unavailable');
      }

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname) || '.jpg';
      const filename = `post-${uniqueSuffix}${ext}`;

      try {
        const blob = await put(`posts/${filename}`, file.buffer, {
          access: 'public',
          token: token,
        });
        imageUrl = blob.url;
        console.log('Blob upload successful:', imageUrl);
      } catch (blobError) {
        console.error('Vercel Blob upload failed:', blobError);
        throw new BadRequestException('Failed to upload image. Please try again.');
      }
    }

    return this.postsService.create(Number(req.user.sub), {
      ...createPostDto,
      imageUrl,
    });
  }

  @Get('feed')
  @ApiOperation({ summary: 'Get paginated feed' })
  async getFeed(
    @Req() req: Request & { user: any },
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    // In a real app, we'd fetch user expertise from req.user or a service
    return this.postsService.findFeed(Number(req.user.sub), parseInt(page), parseInt(limit));
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like a post' })
  async like(@Req() req: Request & { user: any }, @Param('id') id: string) {
    return this.postsService.like(Number(req.user.sub), parseInt(id));
  }

  @Delete(':id/like')
  @ApiOperation({ summary: 'Unlike a post' })
  async unlike(@Req() req: Request & { user: any }, @Param('id') id: string) {
    return this.postsService.unlike(Number(req.user.sub), parseInt(id));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  async remove(@Req() req: Request & { user: any }, @Param('id') id: string) {
    return this.postsService.remove(parseInt(id), Number(req.user.sub));
  }
}

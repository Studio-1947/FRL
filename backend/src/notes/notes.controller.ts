import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { put } from '@vercel/blob';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotesService } from './notes.service';

@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async findAll(@Req() req: Request & { user: any }) {
    return this.notesService.findAllByUserId(req.user.sub);
  }

  @Post()
  async create(@Req() req: Request & { user: any }, @Body() body: any) {
    return this.notesService.create(req.user.sub, body);
  }

  @Post('voice')
  @UseInterceptors(FileInterceptor('file')) // using default memory storage
  async createVoiceNote(
    @Req() req: Request & { user: any },
    @UploadedFile() file: any,
    @Body() body: any,
  ) {
    if (!file) {
      throw new BadRequestException('Voice note file is required');
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname) || '.webm';
    const filename = `voice-${uniqueSuffix}${ext}`;

    // Upload to Vercel Blob
    const blob = await put(`voice-notes/${filename}`, file.buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return this.notesService.create(req.user.sub, {
      ...body,
      isVoiceNote: true,
      audioUrl: blob.url,
    });
  }

  @Patch(':id')
  async update(@Req() req: Request & { user: any }, @Param('id') id: string, @Body() body: any) {
    return this.notesService.update(parseInt(id), req.user.sub, body);
  }

  @Delete(':id')
  async remove(@Req() req: Request & { user: any }, @Param('id') id: string) {
    return this.notesService.remove(parseInt(id), req.user.sub);
  }
}

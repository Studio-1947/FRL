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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { put } from '@vercel/blob';
import { Request } from 'express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@ApiTags('Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notes for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Return all notes.' })
  async findAll(@Req() req: Request & { user: any }) {
    console.log('Fetching notes for user:', req.user);
    return this.notesService.findAllByUserId(Number(req.user.sub));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new text note' })
  @ApiResponse({ status: 201, description: 'The note has been successfully created.' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Req() req: Request & { user: any }, @Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(Number(req.user.sub), createNoteDto);
  }

  @Post('voice')
  @ApiOperation({ summary: 'Create a new voice note' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        title: { type: 'string' },
        transcription: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'The voice note has been successfully created.' })
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

    return this.notesService.create(Number(req.user.sub), {
      ...body,
      isVoiceNote: true,
      audioUrl: blob.url,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing note' })
  @ApiResponse({ status: 200, description: 'The note has been successfully updated.' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Req() req: Request & { user: any },
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(parseInt(id), Number(req.user.sub), updateNoteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note' })
  @ApiResponse({ status: 200, description: 'The note has been successfully deleted.' })
  async remove(@Req() req: Request & { user: any }, @Param('id') id: string) {
    return this.notesService.remove(parseInt(id), Number(req.user.sub));
  }
}

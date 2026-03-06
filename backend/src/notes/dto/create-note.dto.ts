import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({ example: 'My Meeting Notes', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'This is the body of the note.', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isVoiceNote?: boolean;

  @ApiProperty({ example: 'https://example.com/audio.webm', required: false })
  @IsString()
  @IsOptional()
  audioUrl?: string;

  @ApiProperty({ example: 'Transcribed text from voice.', required: false })
  @IsString()
  @IsOptional()
  transcription?: string;
}

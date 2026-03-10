import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateFilmDto {
  @ApiProperty({ example: 'The Silent Forest' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'A documentary about untouched ecosystems.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'https://www.youtube.com/embed/dQw4w9WgXcQ' })
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  embedUrl: string;
}

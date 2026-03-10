import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Community Climate Action Summit' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Discussing the future of ecological interventions.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2026-04-15T10:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 'Bangalore, India', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePublicationDto {
  @ApiProperty({ example: 'Regenerative Agriculture 101' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'A comprehensive guide to soil health.' })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiProperty({ example: 'https://example.com/guide.pdf' })
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  pdfUrl: string;

  @ApiProperty({ example: 'John Doe, Jane Smith', required: false })
  @IsString()
  @IsOptional()
  authors?: string;
}

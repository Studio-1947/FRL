import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({ example: 'The Future of Regenerative Landscapes' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Full markdown content of the blog post...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'Dr. Jane Smith', required: false })
  @IsString()
  @IsOptional()
  authorName?: string;

  @ApiProperty({ example: 'https://example.com/cover.jpg', required: false })
  @IsString()
  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}

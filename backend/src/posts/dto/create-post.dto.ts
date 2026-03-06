import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: "What's on your mind?", description: 'The content of the post' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'healthcare', description: 'Category of the post', required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'URL of the image',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}

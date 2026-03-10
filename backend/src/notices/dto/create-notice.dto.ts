import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNoticeDto {
  @ApiProperty({ example: 'Platform Maintenance' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'The platform will be down for 2 hours on Sunday.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'high', required: false })
  @IsString()
  @IsOptional()
  priority?: string;
}

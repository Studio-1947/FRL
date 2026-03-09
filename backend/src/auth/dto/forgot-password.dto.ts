import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'newPassword123', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}

import { Injectable, UnauthorizedException, ConflictException, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    await this.seedSuperAdmin();
  }

  private async seedSuperAdmin() {
    const adminEmail = 'superadmin@gmail.com';
    const existing = await this.usersService.findByEmail(adminEmail);

    if (!existing) {
      console.log('Seeding SuperAdmin user...');
      const hashedPassword = await bcrypt.hash('superadmin', 10);
      await this.usersService.create({
        email: adminEmail,
        password: hashedPassword,
        name: 'Super Admin',
        role: 'SuperAdmin',
      });
      console.log('SuperAdmin user seeded successfully.');
    } else if (existing.role !== 'SuperAdmin') {
      console.log('Updating existing user to SuperAdmin role...');
      await this.usersService.updateRole(existing.id, 'SuperAdmin');
      console.log('User role updated to SuperAdmin.');
    }
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      phone: registerDto.phone,
      bio: registerDto.bio,
      expertise: registerDto.expertise,
      role: registerDto.role,
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.usersService.findById(payload.sub);

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException();
      }

      const isTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isTokenValid) {
        throw new UnauthorizedException();
      }

      return this.generateTokens(user.id, user.email, user.role);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private async generateTokens(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '36500d' }),
      this.jwtService.signAsync(payload, { expiresIn: '36500d' }),
    ]);

    // Store hashed refresh token
    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);

    return { access_token, refresh_token };
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.usersService.updateProfile(userId, {
      password: hashedNewPassword,
      refreshToken: null, // Revoke all active sessions for security
    });

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists for security, just return success
      return { message: 'If an account exists with this email, a reset link will be sent' };
    }

    const resetToken = require('crypto').randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    await this.usersService.updateResetToken(user.id, resetToken, resetTokenExpires);

    // In a real app, send email. For now, log to console
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    console.log('--- PASSWORD RESET LINK ---');
    console.log(`URL: ${frontendUrl}/reset-password?token=${resetToken}`);
    console.log('---------------------------');

    return { message: 'If an account exists with this email, a reset link will be sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);

    if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updateProfile(user.id, {
      password: hashedNewPassword,
      resetToken: null,
      resetTokenExpires: null,
      refreshToken: null, // Revoke active sessions
    });

    return { message: 'Password reset successfully' };
  }
}

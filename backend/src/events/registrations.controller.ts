import { Controller, Post, Get, Param, UseGuards, Req, ConflictException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventsService } from './events.service';
import { Request } from 'express';

@ApiTags('Events')
@Controller('events')
export class RegistrationsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post(':id/register')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Register for an event' })
  async register(@Param('id') id: string, @Req() req: Request & { user: any }) {
    return this.eventsService.registerForEvent(+id, req.user.sub);
  }

  @Get(':id/registration-status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check if current user is registered for an event' })
  async getStatus(@Param('id') id: string, @Req() req: Request & { user: any }) {
    const isRegistered = await this.eventsService.getRegistrationStatus(+id, req.user.sub);
    return { isRegistered };
  }

  @Get('my-registrations')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get events the current user is registered for' })
  async getMyRegistrations(@Req() req: Request & { user: any }) {
    return this.eventsService.getUserRegistrations(req.user.sub);
  }
}

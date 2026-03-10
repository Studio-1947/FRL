import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { RegistrationsController } from './registrations.controller';

@Module({
  controllers: [EventsController, RegistrationsController],
  providers: [EventsService],
})
export class EventsModule {}

import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, desc } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';

@Injectable()
export class EventsService {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>) {}

  async create(createEventDto: CreateEventDto, userId: number) {
    const [newEvent] = await this.db
      .insert(schema.events)
      .values({
        ...createEventDto,
        date: new Date(createEventDto.date),
        createdBy: userId,
      })
      .returning();
    return newEvent;
  }

  async findAll() {
    return this.db.query.events.findMany({
      orderBy: [desc(schema.events.date)],
      with: {
        // Assume createdBy relation is needed (may require relation definition in schema)
      },
    });
  }

  async findOne(id: number) {
    const event = await this.db.query.events.findFirst({
      where: eq(schema.events.id, id),
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const updateData: any = { ...updateEventDto, updatedAt: new Date() };
    if (updateEventDto.date) {
      updateData.date = new Date(updateEventDto.date);
    }

    const [updatedEvent] = await this.db
      .update(schema.events)
      .set(updateData)
      .where(eq(schema.events.id, id))
      .returning();

    if (!updatedEvent) throw new NotFoundException('Event not found');
    return updatedEvent;
  }

  async remove(id: number) {
    const [deletedEvent] = await this.db
      .delete(schema.events)
      .where(eq(schema.events.id, id))
      .returning();

    if (!deletedEvent) throw new NotFoundException('Event not found');
    return { success: true };
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, desc } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';

@Injectable()
export class NotificationsService {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>) {}

  async create(userId: number, title: string, message: string, type: string = 'general') {
    const [notification] = await this.db
      .insert(schema.notifications)
      .values({
        userId,
        title,
        message,
        type,
      })
      .returning();
    return notification;
  }

  async findAll(userId: number) {
    return this.db.query.notifications.findMany({
      where: eq(schema.notifications.userId, userId),
      orderBy: [desc(schema.notifications.createdAt)],
    });
  }

  async markAsRead(id: number, userId: number) {
    const [updated] = await this.db
      .update(schema.notifications)
      .set({ isRead: true })
      .where(eq(schema.notifications.id, id)) // Ideally check userId too
      .returning();
    return updated;
  }
}

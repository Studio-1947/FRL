import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, desc, sql } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';

@Injectable()
export class NoticesService {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>) {}

  async create(createNoticeDto: CreateNoticeDto, userId: number) {
    const [newNotice] = await this.db
      .insert(schema.notices)
      .values({
        ...createNoticeDto,
        createdBy: userId,
      })
      .returning();
    return newNotice;
  }

  async findAll(page: number = 1, limit: number = 5) {
    const offset = (page - 1) * limit;

    const [data, [{ count }]] = await Promise.all([
      this.db.query.notices.findMany({
        limit,
        offset,
        orderBy: [desc(schema.notices.createdAt)],
        with: {
          creator: {
            columns: {
              name: true,
              email: true,
            },
          },
        },
      }),
      this.db.select({ count: sql<number>`count(*)` }).from(schema.notices),
    ]);

    const total = Number(count);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const notice = await this.db.query.notices.findFirst({
      where: eq(schema.notices.id, id),
    });
    if (!notice) throw new NotFoundException('Notice not found');
    return notice;
  }

  async update(id: number, updateNoticeDto: UpdateNoticeDto) {
    const [updatedNotice] = await this.db
      .update(schema.notices)
      .set({
        ...updateNoticeDto,
        updatedAt: new Date(),
      })
      .where(eq(schema.notices.id, id))
      .returning();

    if (!updatedNotice) throw new NotFoundException('Notice not found');
    return updatedNotice;
  }

  async remove(id: number) {
    const [deletedNotice] = await this.db
      .delete(schema.notices)
      .where(eq(schema.notices.id, id))
      .returning();

    if (!deletedNotice) throw new NotFoundException('Notice not found');
    return { success: true };
  }
}

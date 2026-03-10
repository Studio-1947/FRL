import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, desc, sql } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';

@Injectable()
export class PublicationsService {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>) {}

  async create(createPublicationDto: CreatePublicationDto, userId: number) {
    const [newPub] = await this.db
      .insert(schema.publications)
      .values({
        ...createPublicationDto,
        createdBy: userId,
      })
      .returning();
    return newPub;
  }

  async findAll(page: number = 1, limit: number = 5) {
    const offset = (page - 1) * limit;

    const [data, [{ count }]] = await Promise.all([
      this.db.query.publications.findMany({
        limit,
        offset,
        orderBy: [desc(schema.publications.createdAt)],
        with: {
          creator: {
            columns: {
              name: true,
              email: true,
            },
          },
        },
      }),
      this.db.select({ count: sql<number>`count(*)` }).from(schema.publications),
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
    const pub = await this.db.query.publications.findFirst({
      where: eq(schema.publications.id, id),
    });
    if (!pub) throw new NotFoundException('Publication not found');
    return pub;
  }

  async update(id: number, updatePublicationDto: UpdatePublicationDto) {
    const [updatedPub] = await this.db
      .update(schema.publications)
      .set({
        ...updatePublicationDto,
        updatedAt: new Date(),
      })
      .where(eq(schema.publications.id, id))
      .returning();

    if (!updatedPub) throw new NotFoundException('Publication not found');
    return updatedPub;
  }

  async remove(id: number) {
    const [deletedPub] = await this.db
      .delete(schema.publications)
      .where(eq(schema.publications.id, id))
      .returning();

    if (!deletedPub) throw new NotFoundException('Publication not found');
    return { success: true };
  }
}

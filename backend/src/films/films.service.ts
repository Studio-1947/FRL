import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, desc } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';

@Injectable()
export class FilmsService {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>) {}

  async create(createFilmDto: CreateFilmDto, userId: number) {
    const [newFilm] = await this.db
      .insert(schema.films)
      .values({
        ...createFilmDto,
        createdBy: userId,
      })
      .returning();
    return newFilm;
  }

  async findAll() {
    return this.db.query.films.findMany({
      orderBy: [desc(schema.films.createdAt)],
    });
  }

  async findOne(id: number) {
    const film = await this.db.query.films.findFirst({
      where: eq(schema.films.id, id),
    });
    if (!film) throw new NotFoundException('Film not found');
    return film;
  }

  async update(id: number, updateFilmDto: UpdateFilmDto) {
    const [updatedFilm] = await this.db
      .update(schema.films)
      .set({
        ...updateFilmDto,
        updatedAt: new Date(),
      })
      .where(eq(schema.films.id, id))
      .returning();

    if (!updatedFilm) throw new NotFoundException('Film not found');
    return updatedFilm;
  }

  async remove(id: number) {
    const [deletedFilm] = await this.db
      .delete(schema.films)
      .where(eq(schema.films.id, id))
      .returning();

    if (!deletedFilm) throw new NotFoundException('Film not found');
    return { success: true };
  }
}

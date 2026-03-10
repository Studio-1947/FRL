import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, desc } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';

@Injectable()
export class BlogsService {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>) {}

  async create(createBlogDto: CreateBlogDto, userId: number) {
    const [newBlog] = await this.db
      .insert(schema.blogs)
      .values({
        ...createBlogDto,
        createdBy: userId,
      })
      .returning();
    return newBlog;
  }

  async findAll() {
    return this.db.query.blogs.findMany({
      orderBy: [desc(schema.blogs.createdAt)],
    });
  }

  async findOne(id: number) {
    const blog = await this.db.query.blogs.findFirst({
      where: eq(schema.blogs.id, id),
    });
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    const [updatedBlog] = await this.db
      .update(schema.blogs)
      .set({
        ...updateBlogDto,
        updatedAt: new Date(),
      })
      .where(eq(schema.blogs.id, id))
      .returning();

    if (!updatedBlog) throw new NotFoundException('Blog not found');
    return updatedBlog;
  }

  async remove(id: number) {
    const [deletedBlog] = await this.db
      .delete(schema.blogs)
      .where(eq(schema.blogs.id, id))
      .returning();

    if (!deletedBlog) throw new NotFoundException('Blog not found');
    return { success: true };
  }
}

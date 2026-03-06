import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, desc, and, sql, or, inArray } from 'drizzle-orm';
import * as schema from '../database/schema';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @Inject('DRIZZLE_IO')
    private db: NodePgDatabase<typeof schema>,
  ) {}

  async create(userId: number, createPostDto: CreatePostDto) {
    const [post] = await this.db
      .insert(schema.posts)
      .values({
        userId,
        content: createPostDto.content,
        imageUrl: createPostDto.imageUrl,
        category: createPostDto.category,
      })
      .returning();
    return post;
  }

  async findFeed(userId: number, page: number = 1, limit: number = 10, userExpertise?: string) {
    const offset = (page - 1) * limit;

    // Build the query
    let query = this.db
      .select({
        id: schema.posts.id,
        content: schema.posts.content,
        imageUrl: schema.posts.imageUrl,
        category: schema.posts.category,
        createdAt: schema.posts.createdAt,
        userId: schema.posts.userId,
        userName: schema.users.name,
        userAvatar: schema.users.avatarUrl,
        userExpertise: schema.users.expertise,
        likesCount:
          sql<number>`(SELECT count(*) FROM ${schema.likes} WHERE ${schema.likes.postId} = ${schema.posts.id})`.mapWith(
            Number,
          ),
        isLiked: sql<boolean>`EXISTS (SELECT 1 FROM ${schema.likes} WHERE ${schema.likes.postId} = ${schema.posts.id} AND ${schema.likes.userId} = ${userId})`,
      })
      .from(schema.posts)
      .leftJoin(schema.users, eq(schema.posts.userId, schema.users.id));

    // Adding priority for user expertise if provided
    // For now, we'll just order by date, but in a real app, we might boost posts matching userExpertise
    const results = await query.orderBy(desc(schema.posts.createdAt)).limit(limit).offset(offset);

    const [{ total }] = await this.db
      .select({ total: sql<number>`count(*)`.mapWith(Number) })
      .from(schema.posts);

    return {
      data: results,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async like(userId: number, postId: number) {
    // Check if already liked
    const existing = await this.db
      .select()
      .from(schema.likes)
      .where(and(eq(schema.likes.userId, userId), eq(schema.likes.postId, postId)))
      .limit(1);

    if (existing.length > 0) {
      return { message: 'Already liked' };
    }

    await this.db.insert(schema.likes).values({
      userId,
      postId,
    });

    return { message: 'Liked' };
  }

  async unlike(userId: number, postId: number) {
    await this.db
      .delete(schema.likes)
      .where(and(eq(schema.likes.userId, userId), eq(schema.likes.postId, postId)));

    return { message: 'Unliked' };
  }

  async remove(id: number, userId: number) {
    const post = await this.db.select().from(schema.posts).where(eq(schema.posts.id, id)).limit(1);

    if (post.length === 0) {
      throw new NotFoundException('Post not found');
    }

    if (post[0].userId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.db.delete(schema.posts).where(eq(schema.posts.id, id));
    return { message: 'Post deleted' };
  }
}

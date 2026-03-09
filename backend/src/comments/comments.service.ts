import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and, desc, sql } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(DRIZZLE)
    private db: NodePgDatabase<typeof schema>,
  ) {}

  async create(userId: number, postId: number, createCommentDto: CreateCommentDto) {
    // Optional: Check if postId exists
    // Optional: Check if parentId exists and belongs to the same postId

    const results = await this.db
      .insert(schema.comments)
      .values({
        userId,
        postId,
        parentId: createCommentDto.parentId,
        content: createCommentDto.content,
      })
      .returning();

    const comment = results[0];

    // Fetch with user info for immediate return
    return this.findCommentWithUser(comment.id);
  }

  async findByPost(postId: number) {
    const allComments = await this.db
      .select({
        id: schema.comments.id,
        content: schema.comments.content,
        parentId: schema.comments.parentId,
        createdAt: schema.comments.createdAt,
        userId: schema.comments.userId,
        userName: schema.users.name,
        userAvatar: schema.users.avatarUrl,
      })
      .from(schema.comments)
      .leftJoin(schema.users, eq(schema.comments.userId, schema.users.id))
      .where(eq(schema.comments.postId, postId))
      .orderBy(desc(schema.comments.createdAt));

    return this.buildTree(allComments);
  }

  private buildTree(comments: any[]) {
    const map = new Map();
    const roots = [];

    comments.forEach((comment) => {
      map.set(comment.id, { ...comment, replies: [] });
    });

    comments.forEach((comment) => {
      if (comment.parentId && map.has(comment.parentId)) {
        map.get(comment.parentId).replies.push(map.get(comment.id));
      } else {
        roots.push(map.get(comment.id));
      }
    });

    return roots;
  }

  private async findCommentWithUser(id: number) {
    const [comment] = await this.db
      .select({
        id: schema.comments.id,
        content: schema.comments.content,
        parentId: schema.comments.parentId,
        createdAt: schema.comments.createdAt,
        userId: schema.comments.userId,
        userName: schema.users.name,
        userAvatar: schema.users.avatarUrl,
      })
      .from(schema.comments)
      .leftJoin(schema.users, eq(schema.comments.userId, schema.users.id))
      .where(eq(schema.comments.id, id))
      .limit(1);

    return comment;
  }

  async remove(id: number, userId: number) {
    const comment = await this.db
      .select()
      .from(schema.comments)
      .where(eq(schema.comments.id, id))
      .limit(1);

    if (comment.length === 0) {
      throw new NotFoundException('Comment not found');
    }

    if (comment[0].userId !== userId) {
      throw new Error('Not authorized to delete this comment');
    }

    // Note: Depends on DB configuration for cascade delete of child comments.
    // If not cascading, we would need to handle child comments here.
    await this.db.delete(schema.comments).where(eq(schema.comments.id, id));
    return { success: true };
  }
}

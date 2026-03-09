import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';

@Injectable()
export class FollowsService {
  constructor(
    @Inject(DRIZZLE)
    private db: NodePgDatabase<typeof schema>,
  ) {}

  async follow(followerId: number, followingId: number) {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    // Check if user to follow exists
    const userToFollow = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, followingId))
      .limit(1);
    if (userToFollow.length === 0) {
      throw new NotFoundException('User not found');
    }

    // Check if already following
    const existing = await this.db
      .select()
      .from(schema.follows)
      .where(
        and(eq(schema.follows.followerId, followerId), eq(schema.follows.followingId, followingId)),
      )
      .limit(1);

    if (existing.length > 0) {
      return { message: 'Already following' };
    }

    await this.db.insert(schema.follows).values({
      followerId,
      followingId,
    });

    return { message: 'Successfully followed' };
  }

  async unfollow(followerId: number, followingId: number) {
    await this.db
      .delete(schema.follows)
      .where(
        and(eq(schema.follows.followerId, followerId), eq(schema.follows.followingId, followingId)),
      );

    return { message: 'Successfully unfollowed' };
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const existing = await this.db
      .select()
      .from(schema.follows)
      .where(
        and(eq(schema.follows.followerId, followerId), eq(schema.follows.followingId, followingId)),
      )
      .limit(1);

    return existing.length > 0;
  }

  async getFollowingIds(userId: number): Promise<number[]> {
    const results = await this.db
      .select({ followingId: schema.follows.followingId })
      .from(schema.follows)
      .where(eq(schema.follows.followerId, userId));

    return results.map((r) => r.followingId);
  }

  async getFollowersCount(userId: number): Promise<number> {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(schema.follows)
      .where(eq(schema.follows.followingId, userId));
    return result?.count || 0;
  }

  async getFollowingCount(userId: number): Promise<number> {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(schema.follows)
      .where(eq(schema.follows.followerId, userId));
    return result?.count || 0;
  }
}

// Helper for raw sql if needed, but wait, I didn't import sql
import { sql } from 'drizzle-orm';

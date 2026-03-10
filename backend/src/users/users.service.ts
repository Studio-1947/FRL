import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, sql } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>) {}

  async findAll() {
    return this.db.query.users.findMany();
  }

  async findByEmail(email: string) {
    return this.db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
  }

  async findPeople(page: number = 1, limit: number = 3) {
    const offset = (page - 1) * limit;

    const query = this.db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        bio: schema.users.bio,
        expertise: schema.users.expertise,
        role: schema.users.role,
        values: schema.users.values,
        professionalProfile: schema.users.professionalProfile,
        geographicalSpread: schema.users.geographicalSpread,
        interventions: schema.users.interventions,
        problem: schema.users.problem,
        systemChange: schema.users.systemChange,
        systemImpact: schema.users.systemImpact,
        abundance: schema.users.abundance,
        helpNeeded: schema.users.helpNeeded,
        avatarUrl: schema.users.avatarUrl,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .limit(limit)
      .offset(offset);

    const [data, [{ count }]] = await Promise.all([
      query,
      this.db.select({ count: sql<number>`count(*)` }).from(schema.users),
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

  async findPersonById(id: number) {
    const [user] = await this.db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        bio: schema.users.bio,
        expertise: schema.users.expertise,
        role: schema.users.role,
        values: schema.users.values,
        professionalProfile: schema.users.professionalProfile,
        geographicalSpread: schema.users.geographicalSpread,
        interventions: schema.users.interventions,
        problem: schema.users.problem,
        systemChange: schema.users.systemChange,
        systemImpact: schema.users.systemImpact,
        abundance: schema.users.abundance,
        helpNeeded: schema.users.helpNeeded,
        avatarUrl: schema.users.avatarUrl,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .where(eq(schema.users.id, id));
    return user;
  }

  async findById(id: number) {
    return this.db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });
  }

  async updateProfile(id: number, data: any) {
    const [updatedUser] = await this.db
      .update(schema.users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, id))
      .returning();

    return updatedUser;
  }

  async updateRole(id: number, role: string) {
    const [updatedUser] = await this.db
      .update(schema.users)
      .set({
        role,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, id))
      .returning();

    return updatedUser;
  }

  async deleteAvatar(id: number) {
    const [updatedUser] = await this.db
      .update(schema.users)
      .set({
        avatarUrl: null,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, id))
      .returning();

    return updatedUser;
  }

  async updateRefreshToken(id: number, refreshToken: string | null) {
    await this.db
      .update(schema.users)
      .set({
        refreshToken,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, id));
  }

  async updateResetToken(id: number, token: string | null, expires: Date | null) {
    await this.db
      .update(schema.users)
      .set({
        resetToken: token,
        resetTokenExpires: expires,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, id));
  }

  async findByResetToken(token: string) {
    return this.db.query.users.findFirst({
      where: eq(schema.users.resetToken, token),
    });
  }

  async create(data: {
    email: string;
    password?: string;
    name?: string;
    phone?: string;
    bio?: string;
    expertise?: string;
    role?: string;
  }) {
    const [user] = await this.db
      .insert(schema.users)
      .values({
        email: data.email,
        password: data.password || '',
        name: data.name,
        phone: data.phone,
        bio: data.bio,
        expertise: data.expertise,
        role: data.role || 'Individual',
      })
      .returning();
    return user;
  }
}

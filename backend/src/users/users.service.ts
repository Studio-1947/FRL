import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
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

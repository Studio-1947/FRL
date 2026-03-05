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

  async findPeople() {
    return this.db
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
        createdAt: schema.users.createdAt,
      })
      .from(schema.users);
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

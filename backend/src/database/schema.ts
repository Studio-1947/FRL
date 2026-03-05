import { pgTable, serial, varchar, timestamp, text } from 'drizzle-orm/pg-core';

// Example User Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  bio: text('bio'),
  expertise: varchar('expertise', { length: 100 }),
  role: varchar('role', { length: 50 }).default('Individual'),

  // Detailed Profile Fields
  values: text('values'),
  professionalProfile: text('professional_profile'),
  geographicalSpread: text('geographical_spread'),
  interventions: text('interventions'),
  problem: text('problem'),
  systemChange: text('system_change'),
  systemImpact: text('system_impact'),
  abundance: text('abundance'),
  helpNeeded: text('help_needed'),

  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

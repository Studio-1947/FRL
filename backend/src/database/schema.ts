import { pgTable, serial, varchar, timestamp, text, boolean, integer } from 'drizzle-orm/pg-core';

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
  refreshToken: text('refresh_token'),
  resetToken: varchar('reset_token', { length: 255 }),
  resetTokenExpires: timestamp('reset_token_expires'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  title: varchar('title', { length: 255 }),
  content: text('content'),
  isVoiceNote: boolean('is_voice_note').default(false).notNull(),
  audioUrl: text('audio_url'),
  transcription: text('transcription'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  category: varchar('category', { length: 100 }), // Added for preference filtering
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  postId: integer('post_id')
    .references(() => posts.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  postId: integer('post_id')
    .references(() => posts.id)
    .notNull(),
  parentId: integer('parent_id').references(() => comments.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const follows = pgTable('follows', {
  id: serial('id').primaryKey(),
  followerId: integer('follower_id')
    .references(() => users.id)
    .notNull(),
  followingId: integer('following_id')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

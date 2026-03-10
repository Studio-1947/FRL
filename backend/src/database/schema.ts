import { pgTable, serial, varchar, timestamp, text, boolean, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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

// Admin Managed Resources
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  date: timestamp('date').notNull(),
  location: varchar('location', { length: 255 }),
  imageUrl: text('image_url'),
  createdBy: integer('created_by')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const notices = pgTable('notices', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  priority: varchar('priority', { length: 50 }).default('normal'),
  createdBy: integer('created_by')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const blogs = pgTable('blogs', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  authorName: varchar('author_name', { length: 255 }),
  imageUrl: text('image_url'),
  createdBy: integer('created_by')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const films = pgTable('films', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  embedUrl: text('embed_url').notNull(),
  createdBy: integer('created_by')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const publications = pgTable('publications', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  summary: text('summary').notNull(),
  authors: varchar('authors', { length: 255 }),
  pdfUrl: text('pdf_url'),
  createdBy: integer('created_by')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const eventRegistrations = pgTable('event_registrations', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id')
    .references(() => events.id)
    .notNull(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  registeredAt: timestamp('registered_at').defaultNow().notNull(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).default('general'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
  notices: many(notices),
  blogs: many(blogs),
  films: many(films),
  publications: many(publications),
  eventRegistrations: many(eventRegistrations),
  notifications: many(notifications),
}));

export const eventRegistrationsRelations = relations(eventRegistrations, ({ one }) => ({
  event: one(events, {
    fields: [eventRegistrations.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventRegistrations.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  creator: one(users, {
    fields: [events.createdBy],
    references: [users.id],
  }),
}));

export const noticesRelations = relations(notices, ({ one }) => ({
  creator: one(users, {
    fields: [notices.createdBy],
    references: [users.id],
  }),
}));

export const blogsRelations = relations(blogs, ({ one }) => ({
  creator: one(users, {
    fields: [blogs.createdBy],
    references: [users.id],
  }),
}));

export const filmsRelations = relations(films, ({ one }) => ({
  creator: one(users, {
    fields: [films.createdBy],
    references: [users.id],
  }),
}));

export const publicationsRelations = relations(publications, ({ one }) => ({
  creator: one(users, {
    fields: [publications.createdBy],
    references: [users.id],
  }),
}));

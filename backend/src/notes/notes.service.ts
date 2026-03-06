import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import { notes } from '../database/schema';

@Injectable()
export class NotesService {
  constructor(@Inject(DRIZZLE) private readonly db: any) {}

  async findAllByUserId(userId: number) {
    return this.db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(desc(notes.createdAt));
  }

  async create(userId: number, data: any) {
    // If the data payload comes with 'isVoiceNote' as string "true" we convert it
    const isVoiceNote = data.isVoiceNote === 'true' || data.isVoiceNote === true;
    const [newNote] = await this.db
      .insert(notes)
      .values({
        title: data.title,
        content: data.content,
        isVoiceNote,
        audioUrl: data.audioUrl,
        transcription: data.transcription,
        userId,
      })
      .returning();
    return newNote;
  }

  async update(id: number, userId: number, data: any) {
    const isVoiceNote = data.isVoiceNote === 'true' || data.isVoiceNote === true;
    const updateData: any = { ...data, updatedAt: new Date() };
    if (data.isVoiceNote !== undefined) updateData.isVoiceNote = isVoiceNote;

    // Safety: don't let it update id or userId
    delete updateData.id;
    delete updateData.userId;

    const [updatedNote] = await this.db
      .update(notes)
      .set(updateData)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning();

    if (!updatedNote) throw new NotFoundException('Note not found');
    return updatedNote;
  }

  async remove(id: number, userId: number) {
    const [deletedNote] = await this.db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning();

    if (!deletedNote) throw new NotFoundException('Note not found');
    return { success: true };
  }
}

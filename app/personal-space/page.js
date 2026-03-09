"use client";

import { useEffect, useState } from "react";
import NotesList from "../components/notes/NotesList";
import CreateNoteModal from "../components/notes/CreateNoteModal";
import { fetchApi } from "../../lib/api";
import { Button } from "../components/ui/Button";
import { GlassCard } from "../components/ui/GlassCard";
import { Plus, Loader2 } from "lucide-react";

export default function PersonalSpacePage() {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotes = async () => {
    setIsLoading(true);
    try {
      const response = await fetchApi("/v1/notes");
      if (response && response.ok) {
        const data = await response.json();
        setNotes(Array.isArray(data) ? data : []);
      } else {
        const errorData = await response?.json();
        console.error("Failed to load notes:", errorData);
      }
    } catch (err) {
      console.error("Error in loadNotes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (note) => {
    setNoteToEdit(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNoteToEdit(null);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className="min-h-screen bg-background py-16 px-6 sm:px-10 lg:px-16 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <header className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl md:text-8xl font-semibold tracking-tighter text-foreground uppercase leading-[0.85]">
              Personal Space
            </h1>
            <p className="text-xl text-muted-foreground font-light max-w-md leading-relaxed italic">
              Private records of your reflections, insights, and audio
              recordings.
            </p>
          </div>
          <Button
            onClick={() => {
              setNoteToEdit(null);
              setIsModalOpen(true);
            }}
            variant="primary"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" strokeWidth={2.5} />
            Create Entry
          </Button>
        </header>

        <main className="relative min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <Loader2
                className="w-12 h-12 text-primary animate-spin"
                strokeWidth={1.5}
              />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
                Synchronizing entries...
              </p>
            </div>
          ) : notes.length === 0 ? (
            <GlassCard className="!p-20 text-center border-dashed opacity-80">
              <p className="text-xl font-bold text-muted-foreground italic mb-8">
                Your digital sanctuary is empty.
              </p>
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(true)}
                className="rounded-xl px-8"
              >
                Start Refecting
              </Button>
            </GlassCard>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <NotesList
                notes={notes}
                onNotesUpdate={loadNotes}
                onEdit={handleEdit}
              />
            </div>
          )}
        </main>

        {isModalOpen && (
          <CreateNoteModal
            noteToEdit={noteToEdit}
            onClose={handleCloseModal}
            onSuccess={() => {
              handleCloseModal();
              loadNotes();
            }}
          />
        )}
      </div>
    </div>
  );
}

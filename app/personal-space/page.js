"use client";

import { useEffect, useState } from "react";
import NotesList from "../components/notes/NotesList";
import CreateNoteModal from "../components/notes/CreateNoteModal";
import { fetchApi } from "../../lib/api";

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
    <div className="min-h-screen bg-[#F4F4F5] dark:bg-[#0c0c0c] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              Personal Space
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Your private collection of thoughts and audio recordings.
            </p>
          </div>
          <button
            onClick={() => {
              setNoteToEdit(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full font-medium shadow-sm hover:scale-105 transition-transform"
          >
            <span>+</span> New Note
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <NotesList
            notes={notes}
            onNotesUpdate={loadNotes}
            onEdit={handleEdit}
          />
        )}

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

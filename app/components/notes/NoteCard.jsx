"use client";

import { useState } from "react";
import { fetchApi, API_BASE_URL } from "../../../lib/api";
import { Trash2, Mic, FileText, Edit2 } from "lucide-react";

export default function NoteCard({ note, onComplete, onEdit }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Delete note?")) return;
    setIsDeleting(true);
    try {
      await fetchApi(`/v1/notes/${note.id}`, { method: "DELETE" });
      onComplete();
    } catch (e) {
      console.error(e);
      setIsDeleting(false);
    }
  };

  // Resolve backend API base url for relative audio assets
  const backendBaseUrl = API_BASE_URL;

  return (
    <div className="relative group bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4 border-b border-gray-50 dark:border-gray-800 pb-3">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full">
            {note.isVoiceNote ? (
              <Mic size={16} className="text-primary" />
            ) : (
              <FileText size={16} className="text-primary" />
            )}
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {new Date(note.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(note)}
            className="text-gray-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-[#1a1a1a]"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-[#1a1a1a]"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {note.title && (
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3 tracking-tight">
          {note.title}
        </h3>
      )}

      {note.isVoiceNote ? (
        <div className="space-y-4">
          <audio
            src={
              note.audioUrl?.startsWith("http")
                ? note.audioUrl
                : `${backendBaseUrl}${note.audioUrl}`
            }
            controls
            className="w-full h-10 mt-2 rounded-full"
          />
          {note.transcription && (
            <div className="bg-gray-50 dark:bg-[#252525] p-4 rounded-xl shadow-inner">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                "{note.transcription}"
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap text-[15px] leading-relaxed">
          {note.content}
        </p>
      )}
    </div>
  );
}

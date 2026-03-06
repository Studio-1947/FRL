import NoteCard from "./NoteCard";

export default function NotesList({ notes, onNotesUpdate }) {
  if (notes.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1a1a1a] p-12 text-center rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mt-6">
        <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
          No notes yet
        </h3>
        <p className="text-gray-500 mt-2">
          Start writing or recording your thoughts.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onComplete={onNotesUpdate} />
      ))}
    </div>
  );
}

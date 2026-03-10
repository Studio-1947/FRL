import React from "react";
import { BookOpen } from "lucide-react";

export const metadata = {
  title: "Publications | FRL",
  description:
    "Formal research, guides, and documentation of our methodologies.",
};

export default function PublicationsPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col items-center justify-center -mt-20">
      <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-700">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20">
          <BookOpen className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight uppercase text-center">
          Publications
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl font-light text-center max-w-md">
          Library pending. We are assembling our research and methodology
          guides.
        </p>
      </div>
    </div>
  );
}

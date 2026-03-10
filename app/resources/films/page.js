import React from "react";
import { Film } from "lucide-react";

export const metadata = {
  title: "Films | FRL",
  description:
    "Visual narratives documenting social and ecological transformation.",
};

export default function FilmsPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col items-center justify-center -mt-20">
      <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-700">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20">
          <Film className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight uppercase text-center">
          Films
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl font-light text-center max-w-md">
          Our film collection is currently being curated. Come back soon to
          watch.
        </p>
      </div>
    </div>
  );
}

import React from "react";
import { Newspaper } from "lucide-react";

export const metadata = {
  title: "Blogs | FRL",
  description:
    "Thought pieces and field notes from our network of change-makers.",
};

export default function BlogsPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col items-center justify-center -mt-20">
      <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-700">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20">
          <Newspaper className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight uppercase text-center">
          Blogs
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl font-light text-center max-w-md">
          We are currently brewing our first set of thought pieces. Stay tuned!
        </p>
      </div>
    </div>
  );
}

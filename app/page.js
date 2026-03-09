"use client";

import Hero from "./components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-20">
        <Hero />
      </div>
    </div>
  );
}

"use client";
import React from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { Button } from "../components/ui/Button";
import Link from "next/link";
import { ArrowRight, Box } from "lucide-react";

export default function ContentsPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-3xl text-center flex flex-col gap-12 items-center">
        <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center border border-primary/10 shadow-xl">
          <Box className="w-12 h-12 text-primary" />
        </div>

        <header className="flex flex-col gap-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground uppercase leading-[0.9]">
            Archives
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
            Our central knowledge repository is currently being indexed for a
            more refined exploration experience.
          </p>
        </header>

        <GlassCard className="!p-16 border-dashed opacity-80 group">
          <p className="text-2xl font-bold text-muted-foreground italic mb-10">
            Constructing Digital Sanctuary...
          </p>
          <Link href="/">
            <Button
              variant="outline"
              className="rounded-2xl px-12 py-6 text-lg font-black uppercase tracking-widest gap-3"
            >
              Exit to Home
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </GlassCard>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Film, PlayCircle, Loader2 } from "lucide-react";
import { fetchApi } from "../../../lib/api";
import { GlassCard } from "../../components/ui/GlassCard";

export default function FilmsPage() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadFilms = async () => {
      setLoading(true);
      try {
        const result = await fetchApi(`/v1/films?page=${page}&limit=4`);
        if (result && result.data) {
          setFilms(result.data);
          setTotalPages(result.meta.totalPages);
        }
      } catch (err) {
        console.error("Failed to load films", err);
      } finally {
        setLoading(false);
      }
    };
    loadFilms();
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-3 text-primary mb-2">
            <Film className="w-8 h-8" />
            <span className="text-xl font-bold uppercase tracking-widest">
              Media
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight uppercase">
            Film & Documentaries
          </h1>
          <p className="text-muted-foreground text-xl font-light max-w-2xl">
            Visual storytelling capturing the essence of ecological restoration
            and social impact.
          </p>
        </div>

        {films.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-20">
            <p className="text-muted-foreground text-lg italic text-center">
              Our film collection is currently being curated. <br /> New visual
              stories coming soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {films.map((film) => (
              <GlassCard
                key={film.id}
                className="group flex flex-col h-full !p-0 overflow-hidden"
              >
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    src={film.embedUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-8 flex flex-col gap-4">
                  <h3 className="text-3xl font-bold uppercase tracking-tight group-hover:text-primary transition-colors">
                    {film.title}
                  </h3>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    {film.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                    <PlayCircle size={16} /> Now Playing
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 pt-12 border-t border-border/40">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-full border border-border hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground"
            >
              ΓåÉ Previous
            </button>
            <span className="text-sm font-bold opacity-50 uppercase tracking-widest">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-full border border-border hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground"
            >
              Next ΓåÆ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

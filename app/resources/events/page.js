"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock, Loader2, ArrowRight } from "lucide-react";
import { fetchApi } from "../../../lib/api";
import { GlassCard } from "../../components/ui/GlassCard";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const response = await fetchApi(`/v1/events?page=${page}&limit=6`);
        if (response.ok) {
          const result = await response.json();
          if (result && result.data) {
            setEvents(result.data);
            setTotalPages(result.meta.totalPages);
          }
        }
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
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
            <Calendar className="w-8 h-8" />
            <span className="text-xl font-bold uppercase tracking-widest">
              Gatherings
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight uppercase">
            Upcoming Events
          </h1>
          <p className="text-muted-foreground text-xl font-light max-w-2xl">
            Join our workshops, seminars, and community meets fostering
            collective action.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-20">
            <p className="text-muted-foreground text-lg italic text-center">
              We are currently organizing our upcoming schedule. <br /> Check
              back soon for updates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <GlassCard
                key={event.id}
                className="group hover:border-primary/40 transition-all flex flex-col h-full !p-0 overflow-hidden"
              >
                {event.imageUrl && (
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  </div>
                )}
                <div className="p-8 flex flex-col flex-1 gap-4">
                  <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest text-primary">
                    <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                      <Clock size={14} />
                      {new Date(event.date).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                        <MapPin size={14} />
                        {event.location}
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight leading-none group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground font-light leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                  <div className="mt-auto pt-6 border-t border-border/40">
                    <Link
                      href={`/resources/events/${event.id}`}
                      className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 group/link"
                    >
                      View Details{" "}
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
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

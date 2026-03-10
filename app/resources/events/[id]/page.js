"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Calendar,
  MapPin,
  Clock,
  Loader2,
  ArrowLeft,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { fetchApi } from "../../../../lib/api";
import { GlassCard } from "../../../components/ui/GlassCard";
import { Button } from "../../../components/ui/Button";

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const response = await fetchApi(`/v1/events/${id}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data);
        }
      } catch (err) {
        console.error("Failed to load event", err);
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold uppercase tracking-tighter">
          Event Not Found
        </h1>
        <Link href="/resources/events">
          <Button variant="outline">Back to Gatherings</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground py-24 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Back Link */}
        <Link
          href="/resources/events"
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} /> Back to Gatherings
        </Link>

        {/* Hero Image */}
        {event.imageUrl && (
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-border/40">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest text-primary">
            <div className="flex items-center gap-1.5 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <Calendar size={14} />
              {new Date(event.date).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center gap-1.5 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <Clock size={14} />
              {new Date(event.date).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            {event.location && (
              <div className="flex items-center gap-1.5 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-muted-foreground">
                <MapPin size={14} />
                {event.location}
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight uppercase leading-none italic">
            {event.title}
          </h1>

          <div className="flex items-center gap-4 py-6 border-y border-border/40">
            <Button className="flex-1 md:flex-none uppercase tracking-widest font-bold">
              Register Now
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 size={18} /> Share
            </Button>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-muted-foreground font-light leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        </div>

        {/* Organizer info or other metadata can go here */}
      </div>
    </div>
  );
}

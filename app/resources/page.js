"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Mic,
  Calendar,
  Bookmark,
  Newspaper,
  Film,
  BookOpen,
} from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { Button } from "../components/ui/Button";

export default function ResourcesPage() {
  const resources = [
    {
      title: "Podcasts",
      icon: <Mic className="w-6 h-6" />,
      desc: "In-depth conversations and audio journals exploring sustainable shifts.",
      link: "/resources/podcast",
    },
    {
      title: "Events",
      icon: <Calendar className="w-6 h-6" />,
      desc: "Gatherings, workshops and seminars fostering collective action.",
      link: "/resources/events",
    },
    {
      title: "Notice Board",
      icon: <Bookmark className="w-6 h-6" />,
      desc: "Real-time updates, announcements and community opportunities.",
      link: "/resources/notice-board",
    },
    {
      title: "Blogs",
      icon: <Newspaper className="w-6 h-6" />,
      desc: "Thought pieces and field notes from our network of change-makers.",
      link: "/resources/blogs",
    },
    {
      title: "Films",
      icon: <Film className="w-6 h-6" />,
      desc: "Visual narratives documenting social and ecological transformation.",
      link: "/resources/films",
    },
    {
      title: "Publications",
      icon: <BookOpen className="w-6 h-6" />,
      desc: "Formal research, guides and documentation of our methodologies.",
      link: "/resources/publications",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-20 px-6 lg:px-12 flex flex-col items-center">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
        {/* Hero Section */}
        <div className="lg:w-1/2 flex flex-col pt-4">
          <div className="flex flex-col gap-6 text-left mb-12">
            <h1 className="text-3xl md:text-8xl font-semibold tracking-tighter text-foreground uppercase leading-[0.85]">
              Knowledge Hub
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-lg italic">
              A curated collection of resources designed to inspire personal and
              social transformation.
            </p>
          </div>

          <GlassCard className="!p-10 border-primary/5 bg-primary/[0.02] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ArrowUpRight className="w-24 h-24" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4 uppercase tracking-tight">
              Self-Assessment
            </h2>
            <p className="text-muted-foreground mb-8 text-lg font-light leading-relaxed">
              Map your current state of balance and identify areas for growth
              with our interactive diagnostic tool.
            </p>
            <Link href="/life-balance">
              <Button variant="primary" size="default">
                Launch Wheel
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </GlassCard>
        </div>

        {/* Resource Grid */}
        <div className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {resources.map((res, i) => (
            <GlassCard
              key={i}
              className="group !p-8 flex flex-col h-full border-[1.5px] border-primary/30 hover:border-primary/50 hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-2xl"
            >
              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                {res.icon}
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight uppercase group-hover:text-primary transition-colors">
                {res.title}
              </h3>

              <p className="text-muted-foreground text-sm font-light leading-relaxed mb-8 flex-1">
                {res.desc}
              </p>

              <Link
                href={res.link}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary hover:tracking-[0.3em] transition-all"
              >
                <span>View Content</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

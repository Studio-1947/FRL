"use client";

import React, { useEffect, useState } from "react";
import { Bell, Clock, AlertCircle, Loader2 } from "lucide-react";
import { fetchApi } from "../../../lib/api";
import { GlassCard } from "../../components/ui/GlassCard";

export default function NoticeBoardPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const data = await fetchApi("/v1/notices");
        if (Array.isArray(data)) setNotices(data);
      } catch (err) {
        console.error("Failed to load notices", err);
      } finally {
        setLoading(false);
      }
    };
    loadNotices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground py-24 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-3 text-primary mb-2">
            <Bell className="w-8 h-8" />
            <span className="text-xl font-bold uppercase tracking-widest">
              Updates
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight uppercase">
            Notice Board
          </h1>
          <p className="text-muted-foreground text-xl font-light max-w-2xl">
            Real-time updates, community announcements, and important
            opportunities.
          </p>
        </div>

        {notices.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-20 border border-dashed border-border/40 rounded-3xl">
            <p className="text-muted-foreground text-lg italic text-center">
              There are currently no active notices. <br /> Check back later for
              community updates.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {notices.map((notice) => (
              <GlassCard
                key={notice.id}
                className={`group transition-all ${
                  notice.priority === "high"
                    ? "border-orange-500/30 bg-orange-500/[0.02]"
                    : "hover:border-primary/40"
                }`}
              >
                <div className="flex items-start gap-6">
                  <div
                    className={`p-4 rounded-2xl ${
                      notice.priority === "high"
                        ? "bg-orange-500/10"
                        : "bg-primary/10"
                    }`}
                  >
                    {notice.priority === "high" ? (
                      <AlertCircle className="w-6 h-6 text-orange-500" />
                    ) : (
                      <Bell className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-4">
                      <h3
                        className={`text-2xl font-bold uppercase tracking-wide ${
                          notice.priority === "high"
                            ? "text-orange-500"
                            : "group-hover:text-primary"
                        } transition-colors`}
                      >
                        {notice.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <Clock size={14} />
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-lg font-light leading-relaxed whitespace-pre-wrap">
                      {notice.content}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

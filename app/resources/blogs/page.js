"use client";

import React, { useEffect, useState } from "react";
import { Newspaper, User, Clock, Loader2 } from "lucide-react";
import { fetchApi } from "../../../lib/api";
import { GlassCard } from "../../components/ui/GlassCard";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await fetchApi("/v1/blogs");
        if (Array.isArray(data)) setBlogs(data);
      } catch (err) {
        console.error("Failed to load blogs", err);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
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
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-3 text-primary mb-2">
            <Newspaper className="w-8 h-8" />
            <span className="text-xl font-bold uppercase tracking-widest">
              Thought Pieces
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight uppercase">
            Field Notes & Blogs
          </h1>
          <p className="text-muted-foreground text-xl font-light max-w-2xl">
            Latest reflections and insights from our network of change-makers
            and practitioners.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-20">
            <p className="text-muted-foreground text-lg italic text-center">
              We are currently brewing our first set of thought pieces. <br />{" "}
              Stay tuned!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <GlassCard
                key={blog.id}
                className="group hover:border-primary/40 transition-all flex flex-col h-full !p-0 overflow-hidden"
              >
                {blog.imageUrl && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                )}
                <div className="p-8 flex flex-col flex-1 gap-4">
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                    {blog.authorName && (
                      <>
                        <span className="w-1 h-1 bg-border rounded-full" />
                        <div className="flex items-center gap-1.5">
                          <User size={14} />
                          {blog.authorName}
                        </div>
                      </>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight leading-snug group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-muted-foreground font-light leading-relaxed line-clamp-4">
                    {blog.content}
                  </p>
                  <div className="mt-auto pt-6 border-t border-border/40">
                    <button className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
                      Read More <span className="text-lg">ΓåÆ</span>
                    </button>
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

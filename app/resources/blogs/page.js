"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Newspaper, User, Clock, Loader2, ArrowRight } from "lucide-react";
import { fetchApi } from "../../../lib/api";
import { GlassCard } from "../../components/ui/GlassCard";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true);
      try {
        const response = await fetchApi(`/v1/blogs?page=${page}&limit=6`);
        if (response.ok) {
          const result = await response.json();
          if (result && result.data) {
            setBlogs(result.data);
            setTotalPages(result.meta.totalPages);
          }
        }
      } catch (err) {
        console.error("Failed to load blogs", err);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
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
                    <Image
                      src={blog.imageUrl}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
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
                    <Link
                      href={`/resources/blogs/${blog.id}`}
                      className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 group/link"
                    >
                      Read More{" "}
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

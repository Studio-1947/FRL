"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  User,
  Clock,
  Loader2,
  ArrowLeft,
  Share2,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi } from "../../../../lib/api";
import { GlassCard } from "../../../components/ui/GlassCard";
import { Button } from "../../../components/ui/Button";

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const response = await fetchApi(`/v1/blogs/${id}`);
        if (response.ok) {
          const data = await response.json();
          setBlog(data);
        }
      } catch (err) {
        console.error("Failed to load blog", err);
      } finally {
        setLoading(false);
      }
    };
    loadBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold uppercase tracking-tighter">
          Blog Not Found
        </h1>
        <Link href="/resources/blogs">
          <Button variant="outline">Back to Thought Pieces</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground py-24 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Back Link */}
        <Link
          href="/resources/blogs"
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} /> Back to Thought Pieces
        </Link>

        {/* Content Header */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 self-start px-4 py-2 rounded-full border border-primary/10">
            <Clock size={14} />
            {new Date(blog.createdAt).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight uppercase leading-[0.9] italic">
            {blog.title}
          </h1>

          {blog.authorName && (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <User size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold uppercase tracking-widest text-foreground">
                  {blog.authorName}
                </span>
                <span className="text-xs text-muted-foreground">
                  Contributor
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Hero Image */}
        {blog.imageUrl && (
          <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden border border-border/40">
            <Image
              src={blog.imageUrl}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <div className="text-muted-foreground leading-relaxed font-light text-xl whitespace-pre-wrap">
            {blog.content}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between py-10 border-t border-border/40 mt-10">
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full px-6"
            >
              <Share2 size={18} /> Share
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-muted-foreground"
            >
              <MessageSquare size={18} /> Join Discussion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

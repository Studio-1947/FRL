"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { fetchApi } from "@/lib/api";
import CreatePost from "../components/feed/CreatePost";
import PostCard from "../components/feed/PostCard";
import { Loader2, Sparkles } from "lucide-react";
import Header from "../components/Header";

import { GlassCard } from "../components/ui/GlassCard";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadingMore],
  );

  const loadPosts = async (pageNum, isInitial = false) => {
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await fetchApi(
        `/v1/posts/feed?page=${pageNum}&limit=10`,
      );
      if (response.ok) {
        const result = await response.json();
        const newPosts = result.data || [];

        if (isInitial) {
          setPosts(newPosts);
        } else {
          setPosts((prev) => [...prev, ...newPosts]);
        }

        setHasMore(pageNum < (result.meta?.totalPages || 1));
      }
    } catch (error) {
      console.error("Failed to load feed:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadPosts(page, page === 1);
  }, [page]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto pt-10 md:pt-16 px-6 lg:px-12 flex flex-col items-center">
        {/* Feed Header */}
        <div className="w-full max-w-[650px] mb-12 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter text-foreground leading-none uppercase">
              Community Feed
            </h1>
            <Sparkles className="text-primary w-8 h-8 opacity-80" />
          </div>
          <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-md">
            Capture moments and share what&apos;s on your mind with the FRL
            ecosystem.
          </p>
        </div>

        {/* Content Area */}
        <div className="w-full max-w-[650px] pb-20">
          <CreatePost onPostCreated={handlePostCreated} />

          <div className="space-y-8 mt-10">
            {posts.map((post, index) => {
              if (posts.length === index + 1) {
                return (
                  <div ref={lastPostElementRef} key={post.id}>
                    <PostCard post={post} />
                  </div>
                );
              } else {
                return <PostCard key={post.id} post={post} />;
              }
            })}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-base font-semibold text-muted-foreground animate-pulse">
                Tailoring your feed...
              </p>
            </div>
          )}

          {loadingMore && (
            <div className="flex justify-center py-10">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="text-center py-20 text-muted-foreground font-bold tracking-tight text-lg">
              You&apos;ve discovered the whole story! ✨
            </div>
          )}

          {!loading && posts.length === 0 && (
            <GlassCard className="!p-16 text-center shadow-xl border-primary/5">
              <div className="text-6xl mb-6 opacity-60">🌱</div>
              <h3 className="text-2xl font-bold uppercase tracking-tight mb-3">
                Feed is looking quiet
              </h3>
              <p className="text-muted-foreground text-lg font-light">
                Be the first to share something amazing today.
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}

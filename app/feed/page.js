"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { fetchApi } from "@/lib/api";
import CreatePost from "../components/feed/CreatePost";
import PostCard from "../components/feed/PostCard";
import { Loader2, Sparkles } from "lucide-react";
import Header from "../components/Header";

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
    // Add new post to top of feed
    // We might want to ensure the metadata is complete or re-fetch head
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#081B23]">
      <div className="max-w-[1200px] mx-auto pt-10 px-4 md:px-8 flex flex-col items-center">
        {/* Feed Header */}
        <div className="w-full max-w-[600px] mb-8 flex flex-col gap-2">
          <h1 className="text-4xl font-black text-[#0F313D] dark:text-white flex items-center gap-3">
            Feed <Sparkles className="text-[#1C5B6F] fill-current" />
          </h1>
          <p className="text-muted-foreground font-medium">
            Capture moments and share what's on your mind.
          </p>
        </div>

        {/* Content Area */}
        <div className="w-full max-w-[600px]">
          <CreatePost onPostCreated={handlePostCreated} />

          <div className="space-y-6">
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
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-12 h-12 text-[#1C5B6F] animate-spin" />
              <p className="text-sm font-medium text-muted-foreground">
                Tailoring your feed...
              </p>
            </div>
          )}

          {loadingMore && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-[#1C5B6F] animate-spin" />
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="text-center py-12 text-muted-foreground font-medium">
              You've seen all the latest updates! ✨
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="bg-card border border-border rounded-3xl p-12 text-center shadow-sm">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-bold mb-2">
                Feed is looking a bit quiet
              </h3>
              <p className="text-muted-foreground">
                Be the first to share something amazing!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

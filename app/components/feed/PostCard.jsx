"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

export default function PostCard({ post }) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);

  const toggleLike = async () => {
    const originalLiked = isLiked;
    const originalCount = likesCount;

    // Optimistic UI
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      const response = await fetchApi(`/v1/posts/${post.id}/like`, {
        method: isLiked ? "DELETE" : "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to update like");
      }
    } catch (error) {
      console.error("Error liking post:", error);
      setIsLiked(originalLiked);
      setLikesCount(originalCount);
      toast.error("Failed to update like");
    }
  };

  const avatarUrl =
    post.userAvatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(post.userName || "U")}`;

  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden mb-6 shadow-sm transition-all duration-300 hover:shadow-md group">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted border border-border">
            <Image
              src={avatarUrl}
              alt={post.userName || "User"}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-foreground leading-tight">
              {post.userName || "Anonymous"}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </span>
              {post.userExpertise && (
                <>
                  <span className="text-[10px] text-muted-foreground">•</span>
                  <span className="text-[10px] px-2 py-0.5 bg-[#1C5B6F]/10 text-[#1C5B6F] rounded-full font-medium">
                    {post.userExpertise}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div className="relative w-full aspect-square bg-muted">
          <Image
            src={post.imageUrl}
            alt="Post content"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>
      )}

      {/* Actions */}
      <div className="p-3 flex items-center gap-4 border-t border-border mt-2">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-2 p-2 rounded-full transition-all active:scale-90 ${
            isLiked
              ? "text-rose-500 bg-rose-50 dark:bg-rose-500/10"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
          <span className="text-sm font-semibold">{likesCount}</span>
        </button>

        <button className="flex items-center gap-2 p-2 rounded-full transition-all hover:bg-muted text-muted-foreground">
          <MessageCircle className="w-6 h-6" />
          <span className="text-sm font-semibold">0</span>
        </button>

        <button className="p-2 ml-auto rounded-full transition-all hover:bg-muted text-muted-foreground">
          <Share2 className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

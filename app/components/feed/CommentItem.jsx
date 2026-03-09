"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MessageSquare, Trash2, CornerDownRight, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

export default function CommentItem({
  comment,
  postId,
  onCommentAdded,
  onDelete,
  currentUserId,
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetchApi(`/v1/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({
          content: replyContent,
          parentId: comment.id,
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        onCommentAdded(newComment);
        setReplyContent("");
        setIsReplying(false);
        toast.success("Reply posted!");
      }
    } catch (error) {
      console.error("Failed to post reply:", error);
      toast.error("Failed to post reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  const avatarUrl =
    comment.userAvatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(comment.userName || "User")}`;

  return (
    <div className="flex flex-col gap-3 group/comment">
      <div className="flex gap-3">
        <div className="shrink-0 pt-1">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-muted relative">
            <Image
              src={avatarUrl}
              alt={comment.userName}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1">
          <div className="bg-[#F8F9FA] dark:bg-[#0F313D]/40 p-3 rounded-2xl rounded-tl-none border border-border/50">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold text-foreground">
                {comment.userName}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">
                {formatDistanceToNow(new Date(comment.createdAt))} ago
              </span>
            </div>
            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {comment.content}
            </p>
          </div>

          <div className="flex items-center gap-4 pl-1">
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-[11px] font-bold text-muted-foreground hover:text-[#1C5B6F] transition-colors flex items-center gap-1"
            >
              Reply
            </button>
            {currentUserId === comment.userId && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-[11px] font-bold text-muted-foreground hover:text-destructive transition-colors"
              >
                Delete
              </button>
            )}
          </div>

          {isReplying && (
            <form
              onSubmit={handleReply}
              className="mt-2 flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200"
            >
              <input
                autoFocus
                type="text"
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="flex-1 bg-background border border-border rounded-xl px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#1C5B6F]/20 focus:border-[#1C5B6F] transition-all"
              />
              <button
                type="submit"
                disabled={isSubmitting || !replyContent.trim()}
                className="bg-[#1C5B6F] text-white p-2 rounded-xl hover:bg-[#154655] transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-6 border-l-2 border-border/50 flex flex-col gap-4 mt-1">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onCommentAdded={onCommentAdded}
              onDelete={onDelete}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

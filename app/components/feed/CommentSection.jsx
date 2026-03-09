"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Send, MessageCircle } from "lucide-react";
import { fetchApi } from "@/lib/api";
import CommentItem from "./CommentItem";
import { toast } from "sonner";

export default function CommentSection({ postId, currentUserId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await fetchApi(`/v1/posts/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetchApi(`/v1/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({
          content: newComment,
        }),
      });

      if (response.ok) {
        const createdComment = await response.json();
        // Since it's a top-level comment, we can either re-fetch or manually add
        // Re-fetching is safer for tree structure
        fetchComments();
        setNewComment("");
        toast.success("Comment posted!");
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      const response = await fetchApi(
        `/v1/posts/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        fetchComments();
        toast.success("Comment deleted");
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="pt-6 mt-4 border-t border-border animate-in fade-in duration-500">
      <h4 className="text-sm font-black text-foreground mb-6 flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-[#1C5B6F]" />
        Discussion
      </h4>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 bg-muted/30 border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1C5B6F]/20 focus:border-[#1C5B6F] transition-all"
        />
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          className="bg-[#1C5B6F] text-white px-5 rounded-2xl font-bold text-sm hover:bg-[#154655] transition-all disabled:opacity-50 active:scale-95 flex items-center gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Post
        </button>
      </form>

      {/* List of comments */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 text-[#1C5B6F] animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-sm text-muted-foreground font-medium italic">
            No comments yet. Start the conversation!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onCommentAdded={fetchComments}
              onDelete={handleDelete}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

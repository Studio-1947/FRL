"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Send, Loader2, X } from "lucide-react";
import { Button } from "../ui/Button";
import { toast } from "sonner";
import { fetchApi } from "@/lib/api";

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) {
        formData.append("file", image);
      }

      const response = await fetchApi("/v1/posts", {
        method: "POST",
        body: formData, // fetchApi might need adjustment for FormData or handle it
      });

      if (response.ok) {
        toast.success("Post shared successfully!");
        setContent("");
        removeImage();
        const newPost = await response.json();
        onPostCreated(newPost);
      } else {
        toast.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 mb-8 shadow-sm transition-all duration-300 hover:shadow-md">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind today?"
          className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none placeholder:text-muted-foreground/60 min-h-[100px]"
          disabled={isSubmitting}
        />

        {imagePreview && (
          <div className="relative mt-4 rounded-2xl overflow-hidden aspect-video bg-muted group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <div className="flex gap-2">
            <label className="cursor-pointer p-2 hover:bg-muted rounded-full transition-colors group">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={isSubmitting}
              />
              <ImageIcon className="w-6 h-6 text-[#1C5B6F] group-hover:scale-110 transition-transform" />
            </label>
          </div>

          <Button
            type="submit"
            disabled={(!content.trim() && !image) || isSubmitting}
            className="rounded-full px-6 py-2 bg-[#1C5B6F] hover:bg-[#154655] text-white flex items-center gap-2 transition-all active:scale-95"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Post</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchApi } from "../../lib/api";
import { useAuth } from "../../app/context/AuthContext";
import { MapPin, Star, Settings, Loader2, Camera, Trash2 } from "lucide-react";
import SecuritySection from "../components/settings/SecuritySection";
import { GlassCard } from "../components/ui/GlassCard";
import { Button } from "../components/ui/Button";
import { toast } from "sonner";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = React.useRef(null);
  const { refreshUser } = useAuth();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetchApi("/v1/users/profile");
        if (!response.ok) {
          throw new Error("Failed to load profile");
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
        toast.error(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large. Please select a file smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      await uploadProfilePicture(base64String);
    };
    reader.readAsDataURL(file);
  };

  const uploadProfilePicture = async (base64String) => {
    setUploading(true);
    try {
      const response = await fetchApi("/v1/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatarUrl: base64String }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile picture");
      }

      const updatedUser = await response.json();
      setProfile(updatedUser);
      refreshUser();
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeProfilePicture = async () => {
    if (!confirm("Are you sure you want to remove your profile picture?"))
      return;

    setUploading(true);
    try {
      const response = await fetchApi("/v1/users/profile/avatar", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove profile picture");
      }

      const updatedUser = await response.json();
      setProfile(updatedUser);
      refreshUser();
      toast.success("Profile picture removed!");
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-6">
        <Loader2
          className="w-16 h-16 text-primary animate-spin"
          strokeWidth={1.5}
        />
        <p className="text-base font-bold text-muted-foreground animate-pulse tracking-tight">
          Crafting your profile...
        </p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-6">
        <h2 className="text-3xl font-extrabold tracking-tight">
          Something went wrong
        </h2>
        <p className="text-muted-foreground text-lg">
          {error || "Profile not found"}
        </p>
        <Link href="/">
          <Button variant="primary">Return Home</Button>
        </Link>
      </div>
    );
  }

  const badgeString = profile.values || profile.expertise || "";
  const badges = badgeString
    .split(/#|\s+/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  const imageUrl =
    profile.avatarUrl ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.name)}`;

  return (
    <div className="min-h-screen bg-background py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            My Profile
          </h1>
          <Link href="/settings">
            <Button variant="outline" size="lg" className="gap-3">
              <Settings size={20} />
              <span>Personalize</span>
            </Button>
          </Link>
        </div>

        <GlassCard className="relative overflow-hidden shadow-2xl p-8 sm:p-16 mb-12">
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
            <div
              className="w-48 h-48 md:w-64 md:h-64 rounded-[2.5rem] overflow-hidden bg-muted flex-shrink-0 shadow-xl relative group cursor-pointer border-2 border-primary/5"
              onClick={handleImageClick}
            >
              <Image
                src={imageUrl}
                alt={profile.name}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              {profile.avatarUrl && !uploading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeProfilePicture();
                  }}
                  className="absolute top-4 right-4 p-3 bg-red-500/80 hover:bg-red-500 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md shadow-lg z-10"
                  title="Remove Photo"
                >
                  <Trash2 size={20} />
                </button>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/40 backdrop-blur-sm text-foreground">
                <div className="flex flex-col items-center">
                  <Camera size={40} />
                  <span className="text-xs font-black mt-2 uppercase tracking-widest">
                    Update Photo
                  </span>
                </div>
              </div>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 text-primary">
                  <Loader2 className="w-12 h-12 animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1 w-full pt-4">
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight">
                {profile.name}
              </h2>
              <div className="text-xl text-primary/80 font-bold mb-6 italic">
                {profile.role}
              </div>

              <div className="flex items-center justify-center md:justify-start gap-3 text-muted-foreground mb-8">
                <MapPin className="w-6 h-6 text-primary" />
                <span className="font-semibold text-lg">
                  {profile.geographicalSpread || "Global Citizen"}
                </span>
              </div>

              {badges.length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  {badges.map((badge, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-primary/5 px-5 py-2 rounded-full text-sm font-bold border border-primary/10 shadow-sm"
                    >
                      <Star className="w-4 h-4 text-primary" />
                      <span className="text-foreground/80 lowercase italic">
                        {badge}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Professional Profile",
              content: profile.professionalProfile,
            },
            { title: "Interventions", content: profile.interventions },
            { title: "Problem Scope", content: profile.problem },
            { title: "System Change", content: profile.systemChange },
            { title: "What I Have in Abundance", content: profile.abundance },
            { title: "Help Needed", content: profile.helpNeeded },
          ]
            .filter((item) => item.content)
            .map((item, idx) => (
              <GlassCard
                key={idx}
                className="p-10 flex flex-col gap-5 border-primary/5 hover:border-primary/20 transition-all duration-500"
              >
                <h3 className="text-2xl font-extrabold text-foreground tracking-tight">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium whitespace-pre-wrap text-[17px]">
                  {item.content}
                </p>
              </GlassCard>
            ))}
        </div>

        <div className="mt-16">
          <SecuritySection />
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}

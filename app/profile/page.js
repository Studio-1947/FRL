"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchApi } from "../../lib/api";
import { MapPin, Star, Settings } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetchApi("/v1/users/profile");
        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to load profile");
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-12 h-12 border-4 border-[#8b654b] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <h2 className="text-2xl font-bold mb-4">Error loading profile</h2>
        <p className="text-muted-foreground mb-6">
          {error || "Profile not found"}
        </p>
        <Link href="/">
          <button className="bg-[#1C5B6F] text-white px-6 py-2 rounded-xl">
            Go Home
          </button>
        </Link>
      </div>
    );
  }

  const badgeString = profile.values || profile.expertise || "";
  const badges = badgeString
    .split(/#|\s+/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);
  const imageUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.name)}`;

  return (
    <div className="min-h-screen bg-background py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-[#0F313D] dark:text-white">
            My Profile
          </h1>
          <Link href="/settings">
            <button className="flex items-center gap-2 bg-[#8b654b] hover:bg-[#72533c] text-white px-5 py-2.5 rounded-full transition-colors font-medium shadow-sm">
              <Settings size={18} />
              Edit Profile
            </button>
          </Link>
        </div>

        <div className="bg-card text-card-foreground rounded-[2rem] overflow-hidden border border-border shadow-lg p-8 sm:p-12 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden bg-muted flex-shrink-0 mx-auto md:mx-0 shadow-md relative">
              <Image
                src={imageUrl}
                alt={profile.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 w-full text-center md:text-left">
              <h2 className="text-3xl font-bold text-[#6d4c3d] dark:text-[#dfc3b4] mb-2">
                {profile.name}
              </h2>
              <div className="text-lg text-muted-foreground mb-4 italic">
                {profile.role}
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-6">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">
                  {profile.geographicalSpread || "Location unknown"}
                </span>
              </div>

              {badges.length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-2.5 mb-8">
                  {badges.map((badge, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 bg-[#f6f4f0] dark:bg-slate-800 px-4 py-1.5 rounded-full text-sm"
                    >
                      <Star className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-semibold text-[#5a463a] dark:text-gray-300">
                        {badge}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {profile.professionalProfile && (
            <div className="bg-card p-8 rounded-3xl border border-border shadow-md">
              <h3 className="text-xl font-bold text-[#0F313D] dark:text-white mb-4">
                Professional Profile
              </h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {profile.professionalProfile}
              </p>
            </div>
          )}

          {profile.interventions && (
            <div className="bg-card p-8 rounded-3xl border border-border shadow-md">
              <h3 className="text-xl font-bold text-[#0F313D] dark:text-white mb-4">
                Interventions
              </h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {profile.interventions}
              </p>
            </div>
          )}

          {profile.problem && (
            <div className="bg-card p-8 rounded-3xl border border-border shadow-md">
              <h3 className="text-xl font-bold text-[#0F313D] dark:text-white mb-4">
                Problem Scope
              </h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {profile.problem}
              </p>
            </div>
          )}

          {profile.systemChange && (
            <div className="bg-card p-8 rounded-3xl border border-border shadow-md">
              <h3 className="text-xl font-bold text-[#0F313D] dark:text-white mb-4">
                System Change
              </h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {profile.systemChange}
              </p>
            </div>
          )}

          {profile.abundance && (
            <div className="bg-card p-8 rounded-3xl border border-border shadow-md">
              <h3 className="text-xl font-bold text-[#0F313D] dark:text-white mb-4">
                What I Have in Abundance
              </h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {profile.abundance}
              </p>
            </div>
          )}

          {profile.helpNeeded && (
            <div className="bg-card p-8 rounded-3xl border border-border shadow-md">
              <h3 className="text-xl font-bold text-[#0F313D] dark:text-white mb-4">
                Help Needed
              </h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {profile.helpNeeded}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

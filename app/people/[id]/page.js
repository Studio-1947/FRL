"use client";
import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, Loader2 } from "lucide-react";
import { fetchApi } from "../../../lib/api";
import { toast } from "sonner";

export default function PersonProfile({ params }) {
  const { id } = use(params);
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPerson() {
      try {
        const response = await fetchApi(`/v1/users/people/${id}`);
        if (!response.ok) {
          throw new Error("Person not found");
        }
        const data = await response.json();
        setPerson(data);
      } catch (err) {
        toast.error(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchPerson();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 border-4 border-[#1C5B6F]/20 rounded-full"></div>
          <Loader2
            className="w-16 h-16 text-[#1C5B6F] animate-spin"
            strokeWidth={1.5}
          />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Getting profile details...
        </p>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-[#6d4c3d] dark:text-[#dfc3b4]">
            Person Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            The profile you are looking for might have been removed or moved.
          </p>
          <Link href="/people">
            <button className="bg-[#1C5B6F] text-white px-8 py-3 rounded-full font-bold hover:bg-[#154655] transition-colors shadow-md">
              Return to People Directory
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const badgeString = person.values || person.expertise || "";
  const badges = badgeString
    .split(/#|\s+/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  const imageUrl =
    person.image ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(person.name)}`;

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/people"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to People</span>
        </Link>

        <div className="bg-card text-card-foreground rounded-[2rem] overflow-hidden border border-border shadow-[0_4px_30px_rgba(0,0,0,0.06)] dark:shadow-none flex flex-col md:flex-row transition-all duration-300">
          {/* Image container */}
          <div className="w-full md:w-1/3 aspect-square md:aspect-auto md:min-h-[400px] relative bg-muted shrink-0 flex items-center justify-center overflow-hidden">
            <Image
              src={imageUrl}
              alt={`Profile image of ${person.name}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          </div>

          {/* Content container */}
          <div className="p-6 sm:p-8 md:p-12 flex flex-col flex-1 bg-card">
            <h1 className="text-[#6d4c3d] dark:text-[#dfc3b4] text-3xl sm:text-4xl md:text-5xl leading-tight font-extrabold mb-4 tracking-tight break-words">
              {person.name || "Unknown Person"}
            </h1>

            <div className="flex items-center text-muted-foreground mb-6 sm:mb-8 gap-2 shrink-0">
              <MapPin
                className="w-4 h-4 sm:w-5 sm:h-5 shrink-0"
                aria-hidden="true"
              />
              <span className="font-medium text-[15px] sm:text-lg">
                {person.geographicalSpread || "Location unknown"}
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-8">
              {badges.length > 0 ? (
                badges.map((badge, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 bg-[#f6f4f0] dark:bg-slate-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-transparent dark:border-slate-700 break-words"
                  >
                    <Star
                      className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] text-muted-foreground shrink-0"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <span className="text-[13px] sm:text-[14px] font-semibold text-[#5a463a] dark:text-gray-300">
                      {badge}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-[14px] text-muted-foreground italic">
                  No badges listed for this profile.
                </span>
              )}
            </div>

            <div className="prose prose-base sm:prose-lg dark:prose-invert max-w-none">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-[#0F313D] dark:text-white">
                About
              </h3>
              <p className="text-muted-foreground leading-[1.7] mb-6">
                {person.professionalProfile ||
                  person.bio ||
                  "No details provided for this person."}
              </p>

              {person.interventions && (
                <>
                  <h4 className="font-bold text-[#0F313D] dark:text-white mt-8 mb-2">
                    Interventions
                  </h4>
                  <p className="text-muted-foreground leading-[1.7] mb-6">
                    {person.interventions}
                  </p>
                </>
              )}

              {person.systemChange && (
                <>
                  <h4 className="font-bold text-[#0F313D] dark:text-white mt-8 mb-2">
                    System Change
                  </h4>
                  <p className="text-muted-foreground leading-[1.7] mb-6">
                    {person.systemChange}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

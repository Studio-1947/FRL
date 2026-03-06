"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Search,
  MapPin,
  Star,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { fetchApi } from "../../lib/api";
export default function PeoplePage() {
  const [people, setPeople] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalResults, setTotalResults] = React.useState(0);

  React.useEffect(() => {
    async function loadPeople() {
      setLoading(true);
      try {
        const response = await fetchApi(
          `/v1/users/people?page=${page}&limit=3`,
        );
        if (response.ok) {
          const result = await response.json();
          // Backend now returns { data, meta }
          setPeople(result.data || []);
          setTotalPages(result.meta?.totalPages || 1);
          setTotalResults(result.meta?.total || 0);
        }
      } catch (error) {
        console.error("Failed to load people:", error);
        toast.error("Failed to load people profiles.");
      } finally {
        setLoading(false);
      }
    }
    loadPeople();
  }, [page]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col items-center py-10 px-4 md:px-8">
      {/* Search Bar Section */}
      <div className="w-full max-w-[1200px] mb-8 md:mb-12">
        <div className="flex w-full items-center bg-card rounded-xl sm:rounded-2xl shadow-sm border border-border overflow-hidden h-[50px] sm:h-[60px] transition-colors duration-300 focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent">
          <label htmlFor="people-search" className="sr-only">
            Search People
          </label>
          <button className="flex items-center gap-1.5 sm:gap-2 bg-[#122e3b] dark:bg-slate-800 text-white px-4 sm:px-8 h-full hover:bg-[#0d212a] dark:hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#122e3b]">
            <span className="font-medium text-[14px] sm:text-[16px]">
              People
            </span>
            <ChevronDown
              className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300"
              aria-hidden="true"
            />
          </button>
          <div className="flex-1 flex items-center px-3 sm:px-6 h-full relative">
            <input
              id="people-search"
              type="text"
              placeholder="Search..."
              className="w-full h-full bg-transparent outline-none text-foreground placeholder-muted-foreground text-[14px] sm:text-[16px]"
            />
            <button
              className="text-muted-foreground hover:text-foreground transition-colors ml-1 sm:ml-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              aria-label="Submit search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
            </button>
          </div>
        </div>
      </div>

      {/* People Grid */}
      <div className="w-full max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-16 h-16 border-4 border-[#1C5B6F]/20 rounded-full"></div>
              <Loader2
                className="w-16 h-16 text-[#1C5B6F] animate-spin"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-sm font-medium text-muted-foreground animate-pulse">
              Finding people...
            </p>
          </div>
        ) : people.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-12">
            No profiles found
          </div>
        ) : (
          people.map((person) => {
            // Process badges from the 'values' or 'expertise' field
            const badgeString = person.values || person.expertise || "";
            const badges = badgeString
              .split(/#|\s+/)
              .map((b) => b.trim())
              .filter((b) => b.length > 0);

            // Create a DiceBear avatar if no image is present
            const imageUrl =
              person.avatarUrl ||
              person.image ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(person.name)}`;

            return (
              <div
                key={person.id}
                className="bg-card text-card-foreground rounded-[2rem] overflow-hidden border border-border shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-none flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:border-slate-600 group h-full focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-900"
              >
                {/* Image container */}
                <div className="w-full aspect-[4/3] p-4 pb-0 relative shrink-0">
                  <div className="w-full h-full relative rounded-t-[1.5rem] rounded-b-[0.5rem] overflow-hidden bg-muted flex items-center justify-center">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={`Profile image of ${person.name}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={person.id <= 3} // Priority load top rows
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col justify-center items-center text-muted-foreground gap-2">
                        <span className="text-4xl">🧑‍🏫</span>
                        <span className="text-sm font-medium">No Image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content container */}
                <div className="p-6 sm:p-8 flex flex-col flex-1 h-full">
                  <h2
                    className="text-[#6d4c3d] dark:text-[#dfc3b4] transition-colors text-[24px] sm:text-[28px] leading-tight font-extrabold mb-3 tracking-tight line-clamp-2"
                    title={person.name}
                  >
                    {person.name || "Unknown Person"}
                  </h2>

                  <div className="flex items-center text-muted-foreground mb-6 gap-2 transition-colors shrink-0">
                    <MapPin
                      className="w-4 h-4 text-muted-foreground shrink-0"
                      aria-hidden="true"
                    />
                    <span
                      className="font-medium text-[14px] sm:text-[15px] truncate"
                      title={person.location || "Location unknown"}
                    >
                      {person.location || "Location unknown"}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2.5 mb-6 shrink-0">
                    {badges && badges.length > 0 ? (
                      badges.slice(0, 4).map(
                        (
                          badge,
                          idx, // Cap badges at 4 for UI consistency
                        ) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 bg-[#f6f4f0] dark:bg-slate-800 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full transition-colors border border-transparent dark:border-slate-700 break-words max-w-full"
                          >
                            <Star
                              className="w-3 h-3 sm:w-[14px] sm:h-[14px] text-muted-foreground shrink-0"
                              strokeWidth={1.5}
                              aria-hidden="true"
                            />
                            <span className="text-[12px] sm:text-[13px] font-semibold text-[#5a463a] dark:text-gray-300 truncate">
                              {badge}
                            </span>
                          </div>
                        ),
                      )
                    ) : (
                      <span className="text-[13px] text-muted-foreground italic">
                        No badges available
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-[14px] leading-[1.6] mb-8 flex-1 transition-colors line-clamp-4">
                    {person.professionalProfile ||
                      person.bio ||
                      "No biography provided for this person."}
                  </p>

                  {/* Button */}
                  <Link
                    href={`/people/${person.id}`}
                    className="self-start mt-auto focus:outline-none focus:ring-2 focus:ring-[#8b654b] dark:focus:ring-[#dfc3b4] focus:ring-offset-2 rounded-full ring-offset-background"
                    aria-label={`Know more about ${person.name}`}
                  >
                    <button
                      tabIndex={-1}
                      className="bg-[#8b654b] dark:bg-[#9c7860] hover:bg-[#72533c] dark:hover:bg-[#b08b73] text-white font-medium py-[12px] sm:py-[14px] px-6 sm:px-7 rounded-full flex items-center justify-center gap-2 transition-all duration-300 text-[14px] sm:text-[15px] shadow-sm active:scale-95 group-hover:shadow-md w-full sm:w-auto"
                    >
                      Know More
                      <ArrowRight
                        className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] ml-1 group-hover:translate-x-1 transition-transform"
                        aria-hidden="true"
                      />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Pagination Section */}
      {!loading && people.length > 0 && (
        <div className="w-full max-w-[1200px] flex flex-col items-center gap-6 mt-4 pb-16">
          <div className="text-sm font-medium text-muted-foreground">
            Showing{" "}
            <span className="text-foreground">{(page - 1) * 3 + 1}</span> to{" "}
            <span className="text-foreground">
              {Math.min(page * 3, totalResults)}
            </span>{" "}
            of <span className="text-foreground">{totalResults}</span> people
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl bg-card border border-border text-foreground font-medium transition-all hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
            >
              Previous
            </button>

            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl font-bold transition-all ${
                    page === p
                      ? "bg-[#1C5B6F] text-white shadow-md scale-110"
                      : "bg-card border border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl bg-card border border-border text-foreground font-medium transition-all hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

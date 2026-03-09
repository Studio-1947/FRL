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
import { GlassCard } from "../components/ui/GlassCard";
import { Button } from "../components/ui/Button";

export default function PeoplePage() {
  const [people, setPeople] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalResults, setTotalResults] = React.useState(0);

  const ITEMS_PER_PAGE = 3;

  React.useEffect(() => {
    async function loadPeople() {
      setLoading(true);
      try {
        const response = await fetchApi(
          `/v1/users/people?page=${page}&limit=${ITEMS_PER_PAGE}`,
        );
        if (response.ok) {
          const result = await response.json();
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
    <div className="min-h-screen bg-background flex flex-col items-center py-20 px-6 md:px-12">
      {/* Header Section */}
      <div className="w-full max-w-7xl mb-16 flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="flex flex-col gap-4 text-left">
          <h1 className="text-4xl md:text-7xl font-semibold tracking-tighter text-foreground uppercase leading-[0.9]">
            Directory
          </h1>
          <p className="text-xl text-muted-foreground font-light max-w-xl leading-relaxed">
            Connecting change-makers from across the globe to build a thriving
            future.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:max-w-md">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search by name, role or expertise..."
              className="w-full bg-background border-2 border-border text-foreground px-6 py-5 pr-14 rounded-2xl text-lg font-bold transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none hover:border-primary/50 shadow-sm"
            />
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
        </div>
      </div>

      {/* People Grid */}
      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-32 gap-8">
            <Loader2
              className="w-16 h-16 text-primary animate-spin"
              strokeWidth={1.5}
            />
            <p className="text-xl font-extrabold text-muted-foreground animate-pulse tracking-tight uppercase">
              Curating profiles...
            </p>
          </div>
        ) : people.length === 0 ? (
          <div className="col-span-full py-32">
            <GlassCard className="text-center p-20 border-dashed">
              <p className="text-2xl font-bold text-muted-foreground">
                No matches found in our ecosystem.
              </p>
            </GlassCard>
          </div>
        ) : (
          people.map((person) => {
            const badgeString = person.values || person.expertise || "";
            const badges = badgeString
              .split(/#|\s+/)
              .map((b) => b.trim())
              .filter((b) => b.length > 0);

            const imageUrl =
              person.avatarUrl ||
              person.image ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(person.name)}`;

            return (
              <GlassCard
                key={person.id}
                className="!p-0 flex flex-col group h-full hover:-translate-y-2 transition-all duration-700 shadow-xl border-[1.5px] border-primary/30 hover:border-primary/50 hover:shadow-2xl"
              >
                {/* Image */}
                <div className="w-full aspect-[4/3] p-6 pb-0 shrink-0">
                  <div className="w-full h-full relative rounded-2xl overflow-hidden bg-muted">
                    <Image
                      src={imageUrl}
                      alt={person.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 pb-10 flex flex-col flex-1">
                  <h2 className="text-3xl font-semibold text-foreground mb-3 tracking-tighter group-hover:text-primary transition-colors line-clamp-2 uppercase leading-none">
                    {person.name}
                  </h2>

                  <div className="flex items-center text-muted-foreground mb-6 gap-2 shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="font-bold text-base truncate lowercase italic">
                      {person.location || "Earth"}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-8 shrink-0">
                    {badges.slice(0, 3).map((badge, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10"
                      >
                        <Star className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-black uppercase tracking-widest text-foreground/80">
                          {badge}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bio */}
                  <p className="text-muted-foreground text-base leading-relaxed mb-10 flex-1 line-clamp-3 font-light">
                    {person.professionalProfile ||
                      person.bio ||
                      "Crafting a better world through action."}
                  </p>

                  <Link href={`/people/${person.id}`} className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-center group/btn gap-3"
                    >
                      <span>View Profile</span>
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="w-full max-w-7xl flex flex-col items-center gap-10 border-t border-border pt-20">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-16 h-16 rounded-2xl border-2 border-border flex items-center justify-center transition-all hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              <ArrowRight className="rotate-180 w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center gap-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-14 h-14 rounded-2xl font-black text-lg transition-all ${
                    page === p
                      ? "bg-primary text-white scale-110 shadow-xl"
                      : "bg-background border-2 border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-16 h-16 rounded-2xl border-2 border-border flex items-center justify-center transition-all hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">
            Page {page} of {totalPages}
          </p>
        </div>
      )}
    </div>
  );
}

"use client";
import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, Loader2, ArrowRight } from "lucide-react";
import { fetchApi } from "../../../lib/api";
import { toast } from "sonner";
import { GlassCard } from "../../components/ui/GlassCard";
import { Button } from "../../components/ui/Button";

export default function PersonProfile({ params }) {
  const { id } = use(params);
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPerson() {
      try {
        const response = await fetchApi(`/v1/users/people/${id}`);
        if (!response.ok) throw new Error("Person not found");
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-8">
        <Loader2
          className="w-16 h-16 text-primary animate-spin"
          strokeWidth={1.5}
        />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
          Synchronizing Identity Profile...
        </p>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
        <GlassCard className="max-w-md text-center !p-12 border-dashed">
          <h1 className="text-3xl font-extrabold mb-4 uppercase tracking-tight">
            Void Path
          </h1>
          <p className="text-muted-foreground mb-10 font-medium">
            The requested profile exists outside our current directory.
          </p>
          <Link href="/people">
            <Button
              variant="primary"
              className="rounded-xl px-10 py-5 uppercase font-bold"
            >
              Return to Directory
            </Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

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
    <div className="min-h-screen bg-background py-20 px-6 md:px-12 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <Link
          href="/people"
          className="inline-flex items-center gap-3 text-muted-foreground hover:text-primary mb-12 transition-all group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">
            Exit to Directory
          </span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Visual Identity Section */}
          <div className="lg:w-1/3 w-full lg:sticky lg:top-32">
            <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-background grayscale hover:grayscale-0 transition-all duration-1000 group">
              <Image
                src={imageUrl}
                alt={person.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-[2s]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-60" />
            </div>

            {/* Interaction Button */}
            <div className="mt-10 flex flex-col gap-4">
              <Button
                variant="primary"
                className="w-full py-6 rounded-2xl text-xl font-extrabold uppercase shadow-xl hover:-translate-y-1 transition-all"
              >
                Connect Now
              </Button>
              <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">
                Member since{" "}
                {new Date(person.createdAt || Date.now()).getFullYear()}
              </p>
            </div>
          </div>

          {/* Narrative Section */}
          <div className="flex-1 flex flex-col gap-12">
            <header className="flex flex-col gap-4">
              <h1 className="text-5xl md:text-8xl font-semibold text-foreground tracking-tighter uppercase leading-[0.85]">
                {person.name}
              </h1>
              <div className="flex items-center text-primary font-black uppercase tracking-widest text-lg gap-2 italic">
                <MapPin className="w-6 h-6" />
                {person.geographicalSpread ||
                  person.location ||
                  "Global Citizen"}
              </div>
            </header>

            {/* Expertise Badges */}
            <div className="flex flex-wrap gap-3">
              {badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-primary/5 px-6 py-2 rounded-full border border-primary/10"
                >
                  <Star className="w-4 h-4 text-primary" strokeWidth={3} />
                  <span className="text-xs font-black uppercase tracking-widest text-foreground/80">
                    {badge}
                  </span>
                </div>
              ))}
            </div>

            <main className="flex flex-col gap-16 pt-8 border-t border-border">
              <section className="flex flex-col gap-6">
                <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-muted-foreground opacity-60">
                  Professional Narrative
                </h2>
                <p className="text-xl md:text-2xl text-foreground font-light leading-relaxed max-w-3xl italic">
                  &quot;
                  {person.professionalProfile ||
                    person.bio ||
                    "Crafting sustainable paradigms through collaborative action and systemic change."}
                  &quot;
                </p>
              </section>

              {person.interventions && (
                <section className="flex flex-col gap-6">
                  <h2 className="text-sm font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">
                    Critical Interventions
                  </h2>
                  <GlassCard className="!p-10 border-primary/5 bg-primary/[0.01]">
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                      {person.interventions}
                    </p>
                  </GlassCard>
                </section>
              )}

              {person.systemChange && (
                <section className="flex flex-col gap-6">
                  <h2 className="text-sm font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">
                    Systemic Vision
                  </h2>
                  <p className="text-lg text-foreground font-bold leading-relaxed border-l-4 border-primary pl-8 py-2">
                    {person.systemChange}
                  </p>
                </section>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

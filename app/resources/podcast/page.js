import React from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { Headphones, Radio } from "lucide-react";

// Add new podcast episodes here. Use the SoundCloud share link directly.
const episodes = [
  {
    id: 1,
    title: "Episode 1",
    description:
      "An introduction to the Forum For Responsible Living — what we stand for, why we exist, and the vision of a thriving, harmonious future.",
    soundcloudUrl:
      "https://soundcloud.com/dset-tldp/visible-and-invisible-walls-exploring-inequality",
    date: "2024",
  },
];

function buildEmbedUrl(url) {
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(
    url,
  )}&color=%230ea5e9&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=false`;
}

export const metadata = {
  title: "Podcast | FRL",
  description:
    "Listen to conversations from the Forum For Responsible Living community.",
};

export default function PodcastPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col">
      {/* Hero */}
      <section className="w-full py-20 md:py-28 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary">
            <Radio size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight uppercase">
            FRL Podcast
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-light max-w-2xl leading-relaxed">
            Conversations with thinkers, makers, and doers who are co-creating a
            harmonious and thriving future. Listen, reflect, and get inspired.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Headphones size={16} />
            <span>
              {episodes.length} episode{episodes.length !== 1 ? "s" : ""}{" "}
              available
            </span>
          </div>
        </div>
      </section>

      {/* Episodes */}
      <section className="w-full max-w-4xl mx-auto px-6 lg:px-12 py-16 flex flex-col gap-10">
        {episodes.map((episode, index) => (
          <GlassCard
            key={episode.id}
            className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-8 duration-700 border border-border/40"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Episode Header */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Episode {episode.id}
                </span>
                {episode.date && (
                  <span className="text-xs text-muted-foreground">
                    {episode.date}
                  </span>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                {episode.title}
              </h2>
              {episode.description && (
                <p className="text-muted-foreground text-sm md:text-base font-light leading-relaxed">
                  {episode.description}
                </p>
              )}
            </div>

            {/* SoundCloud Player */}
            <div className="w-full rounded-xl overflow-hidden">
              <iframe
                width="100%"
                height="166"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={buildEmbedUrl(episode.soundcloudUrl)}
                title={`FRL Podcast - ${episode.title}`}
                className="w-full block"
              />
            </div>

            {/* External Link */}
            <div className="flex items-center justify-end">
              <a
                href={episode.soundcloudUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 underline underline-offset-4"
              >
                Open in SoundCloud
              </a>
            </div>
          </GlassCard>
        ))}
      </section>

      {/* Footer CTA */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 text-center">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            More episodes coming soon.
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Subscribe on SoundCloud to stay updated with new conversations.
          </p>
        </div>
      </section>
    </div>
  );
}

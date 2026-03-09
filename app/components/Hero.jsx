import { ArrowRight, CircleUser, Play, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/Button";
import { GlassCard } from "./ui/GlassCard";

export default function Hero() {
  return (
    <div className="flex flex-col lg:flex-row gap-12 px-4 py-8 lg:py-16 items-center">
      {/* Left section: Text & Primary Action */}
      <div className="lg:w-1/2 flex flex-col gap-10 animate-fade-in">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-medium w-fit">
            <Sparkles size={16} />
            <span>Forum for Responsible Living</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-semibold leading-[0.95] tracking-tighter text-foreground uppercase">
            Co-creating a{" "}
            <span className="text-primary italic font-light opacity-90 lowercase">
              harmonious
            </span>{" "}
            thriving future
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed font-light">
            A safe space for members to explore how each of us can contribute
            towards healing ourselves, local communities, and ecosystems.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/login">
              <Button variant="primary" size="lg">
                <span>Join the Community</span>
                <CircleUser size={20} />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              <span>Watch Story</span>
              <Play size={18} fill="currentColor" />
            </Button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <GlassCard className="flex flex-col gap-4 !p-5 group">
            <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
              <span className="text-xl font-bold">01</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Notice Board</h3>
              <p className="text-sm text-muted-foreground">
                Stay updated with the latest from the FRL community.
              </p>
            </div>
          </GlassCard>
          <GlassCard className="flex flex-col gap-4 !p-5 group">
            <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
              <span className="text-xl font-bold">02</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Featured Members</h3>
              <p className="text-sm text-muted-foreground">
                Discover stories of change-makers across India.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Right section: Feature Spotlight */}
      <div className="lg:w-1/2 w-full">
        <GlassCard className="relative overflow-hidden !p-0 border-primary/5 shadow-2xl group">
          <div className="aspect-[4/3] relative bg-primary/5">
            {/* Using a placeholder-like div until actual images are refined */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-primary shadow-inner animate-pulse">
                <Play size={40} fill="currentColor" className="ml-1" />
              </div>
            </div>
          </div>
          <div className="p-6 md:p-10 flex flex-col gap-6 bg-background/40 backdrop-blur-md">
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Experience Life Balance
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Visualize all the important areas of your life at once. Become
                aware of how fulfilled you feel and begin your journey of
                personal and planetary well-being.
              </p>
            </div>
            <Link href="/life-balance">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <span>Explore Life Balance Tool</span>
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

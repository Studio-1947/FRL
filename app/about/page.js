import React from "react";
import Image from "next/image";
import { GlassCard } from "../components/ui/GlassCard";
import { Button } from "../components/ui/Button";

export default function AboutUsPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col">
      {/* Hero Section: Our Story */}
      <section className="relative w-full h-[600px] md:h-[700px] flex flex-col justify-end pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-us/1.png"
            alt="Our Story - Team Gathering"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Neutral overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white uppercase">
            Our Story
          </h1>
          <p className="text-white/90 text-base md:text-lg lg:text-xl max-w-4xl leading-relaxed font-light">
            At Forum For Responsible Living (FRL), We&apos;re Building A Vibrant
            Ecosystem Of Thinkers, Makers, And Doers Who Prioritise Purpose Over
            Prestige. FRL Is Not Just A Platform—It&apos;s A Movement. A
            Creative Commons Where Designers, Technologists, Researchers, And
            Visionaries Unite To Craft Ideas And Solutions That Enrich
            Communities, Revive Ecosystems, And Redefine The Meaning Of
            Progress. We&apos;re Here To Co-Create A World Whose Growth Is
            Measured Not By Wealth Alone, But By Collective Impact And
            Regenerative Outcomes.
          </p>
        </div>
      </section>

      {/* Content Section: Our Vision */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Text */}
          <div className="flex flex-col gap-4 order-2 lg:order-1 animate-in fade-in slide-in-from-left-8 duration-1000">
            <h2 className="text-primary text-3xl md:text-4xl font-semibold tracking-tight uppercase">
              Our Vision
            </h2>
            <p className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-light leading-tight">
              Co-Creating A Harmonious Thriving Future
            </p>
          </div>

          {/* Right Image */}
          <div className="relative order-1 lg:order-2 aspect-[4/3] w-full max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-1000">
            <GlassCard className="!p-0 overflow-hidden shadow-xl rounded-2xl w-full h-full border-none">
              <Image
                src="/about-us/2.png"
                alt="Our Vision - People Meeting"
                fill
                className="object-cover"
                loading="lazy"
              />
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Content Section: Our Goal */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-16 text-center animate-in fade-in duration-1000">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-primary text-3xl md:text-4xl font-semibold tracking-tight uppercase">
            Our Goal
          </h2>
          <p className="text-muted-foreground max-w-4xl text-lg md:text-xl lg:text-2xl font-light leading-relaxed">
            To Ensure That Each One Of Us Can Actively Contribute Towards
            Building A Thriving And Harmonious Future For The Planet.
          </p>
        </div>
      </section>

      {/* Safe Spaces */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Safe Spaces For Change-Makers
            </h3>
            <p className="text-muted-foreground text-lg font-light">
              Create Safe Spaces Where Socio-Ecological Change Makers Can
              Stretch Beyond Their Comfort Zones.
            </p>
          </div>
          <div className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <GlassCard className="!p-0 w-full h-full overflow-hidden rounded-2xl border-none shadow-lg">
              <Image
                src="/about-us/4.png"
                alt="Safe Spaces for Change-Makers"
                fill
                className="object-cover"
                loading="lazy"
              />
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Facilitate Co-Creation */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6 order-2 lg:order-1 animate-in fade-in slide-in-from-left-8 duration-1000">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Facilitate Co-Creation
            </h3>
            <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-md">
              Facilitate Formation Of Constellations Of Co-Creators Based On
              Shared Universal Values To Achieve Impacts We Cannot Imagine On
              Our Own
            </p>
          </div>
          <div className="relative order-1 lg:order-2 aspect-video lg:aspect-[4/3] w-full animate-in fade-in slide-in-from-right-8 duration-1000">
            <GlassCard className="!p-0 w-full h-full overflow-hidden rounded-2xl border-none shadow-lg">
              <Image
                src="/about-us/3.png"
                alt="Facilitate Co-Creation"
                fill
                className="object-cover"
                loading="lazy"
              />
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Re-Imagine */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-video lg:aspect-[4/3] w-full animate-in fade-in slide-in-from-left-8 duration-1000">
            <GlassCard className="!p-0 w-full h-full overflow-hidden rounded-2xl border-none shadow-lg">
              <Image
                src="/about-us/5.png"
                alt="Re-Imagine How We Organize Ourselves"
                fill
                className="object-cover"
                loading="lazy"
              />
            </GlassCard>
          </div>
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-1000">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Re-Imagine How We Organize Ourselves
            </h3>
            <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-md">
              Create An Organizationally And Financially Sustainable
              Un-Organization For FRL
            </p>
          </div>
        </div>
      </section>

      {/* Our Core Offering Section */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="flex flex-col items-center text-center mb-20 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h2 className="text-primary text-3xl md:text-4xl font-semibold tracking-tight uppercase">
            Our Core Offering
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Offering 1 */}
          <GlassCard className="!p-0 group flex flex-col h-full hover:shadow-2xl transition-all duration-300 border-none rounded-2xl overflow-hidden bg-white shadow-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="relative w-full h-[250px] overflow-hidden">
              <Image
                src="/about-us/6.png"
                alt="The Human Web"
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-6 flex flex-col gap-3">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                The Human Web
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-light">
                A Living Directory Of Value-Aligned Professionals And Grassroots
                Changemakers.
              </p>
            </div>
          </GlassCard>

          {/* Offering 2 */}
          <GlassCard className="!p-0 group flex flex-col h-full hover:shadow-2xl transition-all duration-300 border-none rounded-2xl overflow-hidden bg-white shadow-md animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            <div className="relative w-full h-[250px] overflow-hidden">
              <Image
                src="/about-us/7.png"
                alt="Creative Impact Studios"
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-6 flex flex-col gap-3">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                Creative Impact Studios
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-light">
                Collaborative Digital Spaces Where Teams Tackle Real-World
                Challenges—Designing Society, Economics And Environment.
              </p>
            </div>
          </GlassCard>

          {/* Offering 3 */}
          <GlassCard className="!p-0 group flex flex-col h-full hover:shadow-2xl transition-all duration-300 border-none rounded-2xl overflow-hidden bg-white shadow-md animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="relative w-full h-[250px] overflow-hidden">
              <Image
                src="/about-us/8.png"
                alt="Knowledge Commons"
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-6 flex flex-col gap-3">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                Knowledge Commons
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-light">
                Curated Multimedia Libraries Of Ideas, Playbooks, And Frameworks
                Covering Systems Thinking, Regenerative Practice And Social
                Innovation.
              </p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="w-full py-40 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-1" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="max-w-5xl mx-auto px-6 flex flex-col gap-12 items-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-semibold text-foreground tracking-tighter text-balance uppercase leading-[0.9]">
            Join The <span className="text-primary italic">Movement</span>.
          </h2>
          <p className="text-2xl md:text-3xl font-light text-muted-foreground max-w-3xl">
            Create not just for today, but for a thriving tomorrow.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="rounded-2xl px-12 py-8 text-xl h-auto shadow-2xl hover:shadow-primary/40"
          >
            Get Involved
          </Button>
        </div>
      </section>
    </div>
  );
}

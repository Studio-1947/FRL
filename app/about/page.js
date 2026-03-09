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
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80"
            alt="Our Story Background - Team gathering"
            fill
            className="object-cover object-center grayscale opacity-80"
            priority
          />
          {/* Neutral overlay to ensure text readability */}
          <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter text-foreground uppercase leading-[0.85]">
            Our Story
          </h1>
          <p className="text-foreground/90 text-lg md:text-xl lg:text-2xl max-w-5xl leading-relaxed font-light text-balance italic">
            At Forum For Responsible Living (FRL), we&apos;re building a vibrant
            ecosystem of thinkers, makers, and doers who prioritise purpose over
            prestige. FRL is not just a platform—it&apos;s a movement.
          </p>
        </div>
      </section>

      {/* Content Section: Our Vision */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Text */}
          <div className="flex flex-col gap-8 order-2 lg:order-1">
            <h2 className="text-primary text-4xl md:text-6xl font-semibold tracking-tighter uppercase leading-[0.9]">
              Our Vision
            </h2>
            <p className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-light leading-tight">
              Co-creating a{" "}
              <span className="text-foreground italic font-medium">
                harmonious
              </span>{" "}
              thrived future
            </p>
          </div>

          {/* Right Image */}
          <GlassCard className="!p-0 overflow-hidden shadow-2xl order-1 lg:order-2 aspect-square md:aspect-[4/3] lg:aspect-[4/5] rounded-[2.5rem]">
            <Image
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80"
              alt="Our Vision - People collaborating"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </GlassCard>
        </div>
      </section>

      {/* Content Section: Our Goal */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 md:py-32">
        <div className="flex flex-col items-center text-center mb-24 gap-6">
          <h2 className="text-primary text-4xl md:text-6xl font-semibold tracking-tighter uppercase leading-[0.9]">
            Our Goal
          </h2>
          <p className="text-muted-foreground max-w-4xl text-lg md:text-xl lg:text-2xl font-light leading-relaxed">
            To ensure that each one of us can actively contribute towards
            building a thriving and harmonious future for the planet.
          </p>
        </div>

        <div className="flex flex-col gap-32">
          {/* Safe Spaces */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
                Safe Spaces For Change-Makers
              </h3>
              <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-3xl">
                Create safe spaces where socio-ecological change makers can
                stretch beyond their comfort zones.
              </p>
            </div>
            <GlassCard className="!p-0 h-[300px] md:h-[400px] lg:h-[550px] overflow-hidden rounded-[2.5rem]">
              <Image
                src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80"
                alt="Safe Spaces for Change-Makers"
                fill
                className="object-cover opacity-90"
              />
            </GlassCard>
          </div>

          {/* Facilitate Co-Creation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6 order-2 lg:order-1 lg:max-w-md">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
                Facilitate Co-Creation
              </h3>
              <p className="text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
                Facilitate formation of constellations of co-creators based on
                shared universal values to achieve impacts we cannot imagine on
                our own.
              </p>
            </div>
            <GlassCard className="!p-0 aspect-square md:aspect-[4/3] lg:aspect-[4/5] overflow-hidden rounded-[2.5rem] order-1 lg:order-2">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
                alt="Facilitate Co-Creation"
                fill
                className="object-cover opacity-90"
              />
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Our Core Offering Section */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="flex flex-col items-center text-center mb-20 gap-4">
          <h2 className="text-primary text-4xl md:text-6xl font-semibold tracking-tighter uppercase leading-[0.9]">
            Our Core Offering
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Offering 1 */}
          <GlassCard className="!p-0 group flex flex-col h-full hover:-translate-y-2 transition-transform duration-500">
            <div className="relative w-full h-[250px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80"
                alt="The Human Web"
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
            </div>
            <div className="p-8 pb-10 flex flex-col gap-4 flex-grow">
              <h3 className="text-2xl font-bold tracking-tight">
                The Human Web
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed font-medium">
                A Living Directory Of Value-Aligned Professionals And Grassroots
                Changemakers.
              </p>
            </div>
          </GlassCard>

          {/* Offering 2 */}
          <GlassCard className="!p-0 group flex flex-col h-full hover:-translate-y-2 transition-transform duration-500">
            <div className="relative w-full h-[250px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80"
                alt="Creative Impact Studios"
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
            </div>
            <div className="p-8 pb-10 flex flex-col gap-4 flex-grow">
              <h3 className="text-2xl font-bold tracking-tight">
                Creative Impact Studios
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed font-medium">
                Collaborative Digital Spaces Where Teams Tackle Real-World
                Challenges.
              </p>
            </div>
          </GlassCard>

          {/* Offering 3 */}
          <GlassCard className="!p-0 group flex flex-col h-full hover:-translate-y-2 transition-transform duration-500">
            <div className="relative w-full h-[250px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
                alt="Knowledge Commons"
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
            </div>
            <div className="p-8 pb-10 flex flex-col gap-4 flex-grow">
              <h3 className="text-2xl font-bold tracking-tight">
                Knowledge Commons
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed font-medium">
                Curated Multimedia Libraries Of Ideas, Playbooks, And
                Frameworks.
              </p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="w-full py-24 text-center bg-primary/5 mt-16">
        <div className="max-w-4xl mx-auto px-6 flex flex-col gap-10 items-center">
          <p className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight text-balance">
            Join The Movement. Create Not Just For Today, But For A Thriving
            Tomorrow
          </p>
          <Button variant="primary" size="lg" className="rounded-2xl px-10">
            Get Involved
          </Button>
        </div>
      </section>
    </div>
  );
}

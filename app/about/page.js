import React from "react";
import Image from "next/image";

export default function AboutUsPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      {/* Hero Section: Our Story */}
      <section className="relative w-full h-[600px] md:h-[700px] flex flex-col justify-end pb-16 md:pb-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80"
            alt="Our Story Background - Team gathering"
            fill
            className="object-cover object-center grayscale opacity-80 mix-blend-multiply dark:mix-blend-normal"
            priority
          />
          {/* Dark overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70" />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Our Story
          </h1>
          <p className="text-white/90 text-[17px] md:text-xl lg:text-2xl max-w-5xl leading-relaxed md:leading-normal font-normal md:font-medium">
            At Forum For Responsible Living (FRL), we&apos;re building a vibrant
            ecosystem of thinkers, makers, and doers who prioritise purpose over
            prestige. FRL is not just a platform—it&apos;s a movement. A
            creative commons where designers, technologists, researchers, and
            visionaries unite to craft ideas and solutions that enrich
            communities, revive ecosystems, and redefine the meaning of
            progress. We&apos;re here to co-create a world where growth is
            measured not by wealth alone, but by collective impact and
            regenerative outcomes.
          </p>
        </div>
      </section>

      {/* Content Section: Our Vision */}
      <section className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Text */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            <h2 className="text-[#19667A] dark:text-[#38a8c4] text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Our Vision
            </h2>
            <p className="text-2xl md:text-3xl lg:text-4xl text-foreground/70 dark:text-white/70 font-normal md:font-medium leading-tight md:leading-snug">
              Co-creating a harmonious <br className="hidden md:block" />{" "}
              thriving future
            </p>
          </div>

          {/* Right Image */}
          <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl order-1 lg:order-2">
            <Image
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80"
              alt="Our Vision - People collaborating"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Content Section: Our Goal */}
      <section className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-20 md:py-32">
        <div className="flex flex-col items-center text-center mb-20 gap-4">
          <h2 className="text-[#19667A] dark:text-[#38a8c4] text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Our Goal
          </h2>
          <p className="text-foreground/70 dark:text-white/70 max-w-4xl text-lg md:text-xl lg:text-2xl font-normal md:font-medium">
            To ensure that each one of us can actively contribute towards
            building a thriving and harmonious future for the planet.
          </p>
        </div>

        <div className="flex flex-col gap-24">
          {/* Safe Spaces */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                Safe Spaces For Change-Makers
              </h3>
              <p className="text-foreground/70 dark:text-white/70 text-lg md:text-xl font-normal md:font-medium">
                Create safe spaces where socio-ecological change makers can
                stretch beyond their comfort zones.
              </p>
            </div>
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80"
                alt="Safe Spaces for Change-Makers"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Facilitate Co-Creation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="flex flex-col gap-4 order-2 lg:order-1 lg:max-w-md">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                Facilitate Co-Creation
              </h3>
              <p className="text-foreground/70 dark:text-white/70 text-lg md:text-xl font-normal md:font-medium leading-relaxed">
                Facilitate formation of constellations of co-creators based on
                shared universal values to achieve impacts we cannot imagine on
                our own.
              </p>
            </div>
            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl order-1 lg:order-2">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
                alt="Facilitate Co-Creation"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Re-Imagine How We Organize Ourselves */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl order-1">
              <Image
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80"
                alt="Re-Imagine Organization"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-4 order-2 lg:max-w-md">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                Re-Imagine How We Organize Ourselves
              </h3>
              <p className="text-foreground/70 dark:text-white/70 text-lg md:text-xl font-normal md:font-medium leading-relaxed">
                Create an organizationally and financially sustainable
                un-organization for FRL.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Core Offering Section */}
      <section className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-20 pb-10">
        <div className="flex flex-col items-center text-center mb-16 gap-4">
          <h2 className="text-[#19667A] dark:text-[#38a8c4] text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight">
            Our Core Offering
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="flex flex-col rounded-[2rem] overflow-hidden bg-[#F8F6F0] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="relative w-full h-[300px] md:h-64 lg:h-80">
              <Image
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80"
                alt="The Human Web"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-8 flex flex-col gap-4 flex-grow bg-[#Fcfbf8] dark:bg-zinc-900">
              <h3 className="text-2xl font-bold text-foreground tracking-tight">
                The Human Web
              </h3>
              <p className="text-foreground/70 dark:text-white/70 text-lg leading-relaxed font-medium">
                A Living Directory Of Value-Aligned Professionals And Grassroots
                Changemakers, Enabling Meaningful Collaborations Across Domains.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col rounded-[2rem] overflow-hidden bg-[#F8F6F0] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="relative w-full h-[300px] md:h-64 lg:h-80">
              <Image
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80"
                alt="Creative Impact Studios"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-8 flex flex-col gap-4 flex-grow bg-[#Fcfbf8] dark:bg-zinc-900">
              <h3 className="text-2xl font-bold text-foreground tracking-tight">
                Creative Impact Studios
              </h3>
              <p className="text-foreground/70 dark:text-white/70 text-lg leading-relaxed font-medium">
                Collaborative Digital Spaces Where Teams Tackle Real-World
                Challenges—Designing Socially, Culturally, And Ecologically
                Relevant Solutions.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col rounded-[2rem] overflow-hidden bg-[#F8F6F0] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="relative w-full h-[300px] md:h-64 lg:h-80">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
                alt="Knowledge Commons"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-8 flex flex-col gap-4 flex-grow bg-[#Fcfbf8] dark:bg-zinc-900">
              <h3 className="text-2xl font-bold text-foreground tracking-tight">
                Knowledge Commons
              </h3>
              <p className="text-foreground/70 dark:text-white/70 text-lg leading-relaxed font-medium">
                Curated Multimedia Libraries Of Ideas, Playbooks, And Frameworks
                Covering Systems Thinking, Ethical Design, Sustainable Tech, And
                Community-Building.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Looking Ahead Section */}
      <section className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-16 items-start text-foreground/70 dark:text-white/70">
          <div>
            <h2 className="text-[#19667A] dark:text-[#38a8c4] text-3xl md:text-4xl font-bold tracking-tight">
              Looking Ahead
            </h2>
          </div>
          <div>
            <p className="text-lg md:text-xl font-medium leading-relaxed">
              In a time marked by complexity and disruption, FRL is more than a
              platform—it&apos;s a compass. As conventional platforms chase
              metrics and scale, we focus on depth, integrity, and impact. Our
              journey is about redefining success, inspiring future leaders, and
              planting the seeds of regenerative change.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Text */}
      <section className="w-full py-16 text-center border-t border-zinc-200 dark:border-zinc-800 bg-[#Fcfbf8] dark:bg-zinc-950">
        <p className="text-2xl md:text-3xl font-medium text-foreground/80 dark:text-white/80 max-w-4xl mx-auto px-6 tracking-tight">
          Join The Movement. Create Not Just For Today, But For A Thriving
          Tomorrow
        </p>
      </section>
    </div>
  );
}

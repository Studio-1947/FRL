import React from "react";
import Image from "next/image";

export default function AboutUsPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col pt-24">
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
          <p className="text-white/90 text-lg md:text-xl lg:text-2xl max-w-5xl leading-relaxed md:leading-normal font-medium">
            At Forum For Responsible Living (FRL), We&apos;re Building A Vibrant
            Ecosystem Of Thinkers, Makers, And Doers Who Prioritise Purpose Over
            Prestige. FRL Is Not Just A Platform-It&apos;s A Movement. A
            Creative Commons Where Designers, Technologists, Researchers, And
            Visionaries Unite To Craft Ideas And Solutions That Enrich
            Communities, Revive Ecosystems, And Redefine The Meaning Of
            Progress. We&apos;re Here To Co-Create A World Where Growth Is
            Measured Not By Wealth Alone, But By Collective Impact And
            Regenerative Outcomes.
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
            <p className="text-2xl md:text-3xl lg:text-4xl text-foreground/70 dark:text-white/70 font-medium leading-tight md:leading-snug">
              Co-Creating A Harmonious <br className="hidden md:block" />{" "}
              Thriving Future
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
    </div>
  );
}

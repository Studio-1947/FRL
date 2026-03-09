"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";

export default function AuthLayout({ children }) {
  const { setTheme, theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header / Logo */}
      <div className="p-6 md:absolute md:top-6 md:left-6 z-20 flex justify-between items-center w-full md:w-auto">
        <Link href="/">
          <div className="relative w-[100px] h-[40px] sm:w-[120px] sm:h-[48px] grayscale opacity-80 hover:opacity-100 transition-opacity">
            <Image
              src="/Bluelog.svg"
              fill
              alt="FRL Logo"
              className="object-contain invert dark:invert-0"
            />
          </div>
        </Link>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="md:hidden relative text-foreground p-3 rounded-full hover:bg-muted transition-all flex items-center justify-center h-12 w-12 border border-border/50"
        >
          <Sun className="absolute h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
      </div>

      {/* Desktop theme toggle */}
      <div className="hidden md:flex absolute top-8 right-8 z-20">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative text-foreground p-3 rounded-full hover:bg-muted transition-all flex items-center justify-center h-12 w-12 border border-border/50 bg-background/50 backdrop-blur-sm shadow-sm"
        >
          <Sun className="absolute h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
      </div>

      {/* Left Pane (Illustration) */}
      <div className="hidden md:flex md:w-1/2 justify-center items-center p-12 lg:p-24 relative z-10">
        <div className="w-full max-w-lg relative aspect-square transition-all duration-1000 animate-in fade-in slide-in-from-left-8">
          <Image
            src="/left-regs.svg"
            alt="Authentication Illustration"
            fill
            className="object-contain grayscale opacity-60 drop-shadow-2xl brightness-90 contrast-125"
          />
        </div>
      </div>

      {/* Right Pane (Form Container) */}
      <div className="flex-1 flex justify-center items-center p-6 sm:p-10 md:p-16 relative z-10">
        <div className="w-full max-w-[550px] animate-in fade-in slide-in-from-right-8 duration-700 delay-150 fill-mode-forwards">
          <GlassCard className="!p-8 md:!p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-primary/10">
            {children}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

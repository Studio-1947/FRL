"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function AuthLayout({ children }) {
  const { setTheme, theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Top Left Header / Logo (Absolute for larger screens, static for mobile) */}
      <div className="p-4 md:absolute md:top-4 md:left-4 z-10 flex justify-between items-center w-full md:w-auto">
        <Link href="/">
          <Image
            src="/Bluelog.svg"
            width={120}
            height={48}
            alt="FRL Logo"
            className="object-contain invert dark:invert-0 cursor-pointer"
          />
        </Link>
        {/* Mobile theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="md:hidden relative text-slate-900 dark:text-white p-2 rounded-full hover:bg-muted transition-all flex items-center justify-center h-10 w-10"
        >
          <Sun className="absolute h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.5rem] w-[1.5rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
      </div>

      {/* Absolute theme toggle for desktop */}
      <div className="hidden md:flex absolute top-6 right-6 z-10">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative text-slate-900 dark:text-white p-2 rounded-full hover:bg-muted transition-all flex items-center justify-center h-10 w-10"
        >
          <Sun className="absolute h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.5rem] w-[1.5rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
      </div>

      {/* Left Pane (Illustration) */}
      <div className="hidden md:flex md:w-1/2 justify-center items-center p-8 lg:p-16 relative">
        <div className="w-full max-w-lg relative aspect-square">
          {/* Used the user requested SVG for the registration and login context */}
          <Image
            src="/left-regs.svg"
            alt="Authentication Illustration"
            fill
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Right Pane (Form Container) */}
      <div className="flex-1 flex justify-center items-center p-4 sm:p-8 md:p-12 lg:p-16">
        <div className="w-full max-w-[600px] bg-white dark:bg-[#19667A] transition-colors duration-300 rounded-3xl p-6 md:p-10 shadow-2xl border border-gray-100 dark:border-white/10 relative overflow-hidden">
          {/* Subtle background glow effect for modern feel */}
          <div className="absolute top-0 right-0 -m-20 w-40 h-40 bg-primary/5 dark:bg-[#EEFCFD]/5 rounded-full blur-3xl pointer-events-none" />
          {children}
        </div>
      </div>
    </div>
  );
}

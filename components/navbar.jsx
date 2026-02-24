"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const { setTheme, theme } = useTheme();

  return (
    <nav className="w-full flex items-center justify-between p-4 border-b bg-background text-foreground">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-xl tracking-tight">
          FRL
        </Link>
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          <Link href="/contents" className="hover:underline">
            Contents
          </Link>
          <Link href="/resources" className="hover:underline">
            Resources
          </Link>
          <Link href="/about" className="hover:underline">
            About Us
          </Link>
          <Link href="/people" className="hover:underline">
            People
          </Link>
        </div>
      </div>
      <div>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
          aria-label="Toggle theme"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon
            className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 top-4 right-4 md:top-auto md:right-auto md:relative md:top-0 hover:z-10"
            style={{ position: "absolute", top: "1rem", right: "1rem" }}
          />
          <span className="sr-only">Toggle theme</span>
        </button>
      </div>
    </nav>
  );
}

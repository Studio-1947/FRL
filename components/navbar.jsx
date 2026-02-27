"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();

  return (
    <nav className="w-full flex items-center justify-between p-4 px-8 border-b bg-background text-foreground">
      <div className="flex items-center gap-12">
        <Link
          href="/"
          className="font-bold text-xl tracking-tight flex items-center gap-2"
        >
          {/* FRL Logo placeholder matching the design roughly */}
          <div className="w-8 h-8 md:w-10 md:h-10 border-2 rounded-full border-gray-800 dark:border-gray-200 flex items-center justify-center transition-colors">
            <span className="text-xs">↻</span>
          </div>
          <div className="flex flex-col leading-none text-xs md:text-sm font-bold tracking-widest text-[#1e2f3a] dark:text-foreground transition-colors">
            <span>FORUM FOR</span>
            <span>RESPONSIBLE</span>
            <span>LIVING</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-[13px] font-bold tracking-wide text-muted-foreground">
          <Link
            href="/resources"
            className={`hover:text-foreground transition-colors py-2 ${pathname === "/resources" ? "text-foreground border-b-[3px] border-[#6b8b80]" : ""}`}
          >
            RESOURCES
          </Link>
          <Link
            href="/people"
            className={`hover:text-foreground transition-colors py-2 ${pathname === "/people" ? "text-foreground border-b-[3px] border-[#6b8b80]" : ""}`}
          >
            PEOPLE
          </Link>
          <Link
            href="/about"
            className={`hover:text-foreground transition-colors py-2 ${pathname === "/about" ? "text-foreground border-b-[3px] border-[#6b8b80]" : ""}`}
          >
            ABOUT US
          </Link>
          <Link
            href="/impact"
            className={`hover:text-foreground transition-colors py-2 ${pathname === "/impact" ? "text-foreground border-b-[3px] border-[#6b8b80]" : ""}`}
          >
            IMPACT
          </Link>
          <Link
            href="/knowledge"
            className={`hover:text-foreground transition-colors py-2 ${pathname === "/knowledge" ? "text-foreground border-b-[3px] border-[#6b8b80]" : ""}`}
          >
            KNOWLEDGE SYSTEM
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
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

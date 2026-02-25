"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#F6F5F0] dark:bg-[#19667A] transition-colors duration-300 py-10 px-6 lg:px-12 border-t border-transparent dark:border-white/10 mt-auto">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <Image
            src="/Bluelog.svg"
            width={100}
            height={40}
            alt="FRL Logo"
            className="object-contain invert dark:invert-0"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center text-sm font-medium text-foreground dark:text-white transition-colors duration-300">
          <Link href="/resources" className="hover:underline">
            Resources
          </Link>
          <Link href="/about-us" className="hover:underline">
            About Us
          </Link>
          <Link href="/feed" className="hover:underline">
            Impact
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
        </div>

        <div className="text-sm text-muted-foreground dark:text-white/70 transition-colors duration-300">
          © {new Date().getFullYear()} Forum for Responsible Living. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}

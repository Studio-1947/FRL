"use client";

import React from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#19667A] text-white transition-colors duration-300 py-16 px-6 lg:px-24 border-t border-transparent mt-auto">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16">
        {/* Left Side - Logo */}
        <div className="flex items-center gap-4">
          <RefreshCw className="w-10 h-10 stroke-[2] opacity-90" />
          <div className="flex flex-col font-bold text-[13px] tracking-[0.15em] leading-[1.15]">
            <span>FORUM FOR</span>
            <span>RESPONSIBLE</span>
            <span>LIVING</span>
          </div>
        </div>

        {/* Right Side - Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-16 lg:gap-32 w-full lg:w-auto">
          {/* Column 1 */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-sm tracking-wider uppercase mb-2">
              Company
            </h3>
            <Link
              href="/about"
              className="text-[13px] opacity-80 hover:opacity-100 transition-opacity"
            >
              About Us
            </Link>
            <Link
              href="/careers"
              className="text-[13px] opacity-80 hover:opacity-100 transition-opacity"
            >
              Careers
            </Link>
            <Link
              href="/contact"
              className="text-[13px] opacity-80 hover:opacity-100 transition-opacity"
            >
              Contact
            </Link>
            <Link
              href="/blog"
              className="text-[13px] opacity-80 hover:opacity-100 transition-opacity"
            >
              Blog
            </Link>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-sm tracking-wider uppercase mb-2">
              Resources
            </h3>
            <Link
              href="/tools"
              className="text-[13px] opacity-80 hover:opacity-100 transition-opacity"
            >
              Tools
            </Link>
            <Link
              href="/guidelines"
              className="text-[13px] opacity-80 hover:opacity-100 transition-opacity"
            >
              Guidelines
            </Link>
            <Link
              href="/research"
              className="text-[13px] opacity-80 hover:opacity-100 transition-opacity"
            >
              Research
            </Link>
            <Link
              href="/events"
              className="text-[13px] opacity-80 hover:opacity-100 transition-opacity"
            >
              Events
            </Link>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-4 mt-4 md:mt-0">
            <h3 className="font-bold text-sm tracking-wider uppercase mb-2">
              Legal
            </h3>
            <Link
              href="/privacy"
              className="text-[13px] opacity-80 hover:opacity-100 transition-opacity"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[13px] opacity-80 hover:opacity-100 transition-opacity"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-[13px] opacity-80 hover:opacity-100 transition-opacity"
            >
              Cookie Policy
            </Link>
            <Link
              href="/accessibility"
              className="text-[13px] opacity-80 hover:opacity-100 transition-opacity"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-white/20 text-xs opacity-60 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <span>
          © {new Date().getFullYear()} Forum for Responsible Living. All rights
          reserved.
        </span>
      </div>
    </footer>
  );
}

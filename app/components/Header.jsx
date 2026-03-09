// Refined palette integration

"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { CircleUser, Moon, Sun, LogOut, ChevronDown } from "lucide-react";
import { Button } from "./ui/Button";
import { useAuth } from "@/app/context/AuthContext";

const navGroups = [
  {
    title: "About",
    links: [
      { title: "Our Story", link: "/about" },
      { title: "Impact", link: "/about" },
    ],
  },
  {
    title: "Community",
    links: [
      { title: "Feed", link: "/feed" },
      { title: "People", link: "/people" },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { title: "Resources", link: "/resources" },
      { title: "Knowledge System", link: "/resources" },
    ],
  },
  {
    title: "Personal Space",
    link: "/personal-space",
  },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setTheme, theme } = useTheme();
  const { isAuthenticated, logout, isLoggingOut, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 py-4 px-6 sm:px-12 flex justify-between items-center glass border-none !rounded-none backdrop-blur-xl bg-background/60 shadow-none">
      {/* Logo */}
      <Link
        href="/"
        className="cursor-pointer flex justify-center items-center shrink-0"
      >
        <Image
          src="/Bluelog.svg"
          width={110}
          height={44}
          alt="nav_logo"
          className="transition-all duration-300 hover:scale-105 object-contain invert dark:invert-0 w-[90px] sm:w-[110px]"
        />
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex flex-1 justify-center px-8">
        <ul className="flex items-center gap-6 xl:gap-10">
          {navGroups.map((group, i) => (
            <li key={i} className="group relative py-2">
              {group.links ? (
                <>
                  <button className="flex items-center gap-1.5 text-[14px] font-semibold tracking-tight text-foreground/70 group-hover:text-primary transition-all duration-300 whitespace-nowrap">
                    {group.title}
                    <svg
                      className="w-3.5 h-3.5 opacity-50 group-hover:rotate-180 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                    <div className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-2 min-w-[200px]">
                      {group.links.map((link, j) => (
                        <Link
                          key={j}
                          href={link.link}
                          className="block px-4 py-2.5 text-[13px] font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                        >
                          {link.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={group.link}
                  className="text-[14px] font-semibold tracking-tight text-foreground/70 hover:text-primary transition-all duration-300 whitespace-nowrap"
                >
                  {group.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Actions */}
      <div className="hidden lg:flex items-center gap-3 shrink-0">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-foreground p-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center h-10 w-10 border border-border/50"
          aria-label="Toggle theme"
        >
          <Sun className="absolute h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>

        {isAuthenticated ? (
          <div className="relative group/user py-2">
            <button className="flex items-center gap-2 px-3 py-1.5 glass glass-hover border-border/50 rounded-xl transition-all">
              {user?.avatarUrl ? (
                <div className="w-7 h-7 rounded-lg overflow-hidden border border-border/50 shadow-inner">
                  <Image
                    src={user.avatarUrl}
                    alt="Profile"
                    width={28}
                    height={28}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <CircleUser size={18} />
                </div>
              )}
              <span className="text-[13px] font-semibold tracking-tight">
                Account
              </span>
              <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover/user:rotate-180 transition-transform" />
            </button>

            <div className="absolute top-full right-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover/user:opacity-100 group-hover/user:translate-y-0 group-hover/user:pointer-events-auto transition-all duration-300 z-50">
              <div className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-2 min-w-[180px]">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                >
                  <CircleUser size={16} />
                  Profile
                </Link>
                <div className="h-px bg-border my-1 mx-2" />
                <button
                  onClick={logout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                >
                  <LogOut size={16} />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link href="/login">
            <Button
              variant="primary"
              size="default"
              className="rounded-xl px-6"
            >
              Login
            </Button>
          </Link>
        )}
      </div>

      {/* below this section's ui is still being developed  */}
      {/* Hamburger for mobile */}
      <div
        className="lg:hidden flex flex-col gap-1.5 cursor-pointer p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div
          className={`w-6 h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 ease-in-out ${
            isMenuOpen ? "rotate-45 translate-y-[8px]" : ""
          }`}
        ></div>
        <div
          className={`w-6 h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 ease-in-out ${
            isMenuOpen ? "opacity-0" : ""
          }`}
        ></div>
        <div
          className={`w-6 h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 ease-in-out ${
            isMenuOpen ? "-rotate-45 -translate-y-[8px]" : ""
          }`}
        ></div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`absolute top-[72px] left-0 w-full bg-background z-50 px-6 lg:hidden transition-all duration-500 ease-in-out overflow-hidden border-b border-border shadow-2xl ${
          isMenuOpen
            ? "max-h-[100vh] pb-12 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col gap-2 pt-4">
          {navGroups.map((group, i) => (
            <li key={i}>
              {group.links ? (
                <div className="flex flex-col gap-1 py-2">
                  <span className="px-4 text-[12px] font-bold text-muted-foreground uppercase tracking-widest">
                    {group.title}
                  </span>
                  <div className="flex flex-col gap-1 mt-2">
                    {group.links.map((link, j) => (
                      <Link
                        key={j}
                        href={link.link}
                        className="block px-6 py-4 text-lg font-semibold text-foreground hover:text-primary transition-colors rounded-2xl hover:bg-primary/5"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={group.link}
                  className="block px-4 py-5 text-2xl font-semibold text-foreground hover:text-primary transition-colors border-b border-border/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {group.title}
                </Link>
              )}
            </li>
          ))}
          <li className="mt-2">
            {isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <Link
                  href="/profile"
                  className="flex gap-4 items-center w-full py-5 border-b border-border/50 text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center border border-border">
                    {user?.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <CircleUser size={24} />
                    )}
                  </div>
                  <div className="font-semibold text-lg tracking-tight uppercase">
                    My Profile
                  </div>
                </Link>
                <button
                  className="flex gap-4 items-center w-full py-6 text-red-500 font-semibold hover:bg-red-500/5 transition-colors rounded-full px-2"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  disabled={isLoggingOut}
                >
                  <LogOut size={24} />
                  <div className="text-lg tracking-tight uppercase">
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </div>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex gap-4 items-center w-full py-8 border-b border-border/50 text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                  <CircleUser size={28} />
                </div>
                <div className="font-semibold text-lg tracking-tight uppercase">
                  Login to FRL
                </div>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;

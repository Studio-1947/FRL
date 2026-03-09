// Refined palette integration

"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { CircleUser, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "./ui/Button";
import { useAuth } from "@/app/context/AuthContext";

const navLinks = [
  {
    title: "RESOURCES",
    link: "/resources",
  },
  {
    title: "PEOPLE",
    link: "/people",
  },
  {
    title: "FEED",
    link: "/feed",
  },
  {
    title: "ABOUT US",
    link: "/about",
  },
  {
    title: "IMPACT",
    link: "/about",
  },
  {
    title: "KNOWLEDGE SYSTEM",
    link: "/resources",
  },
  {
    title: "PERSONAL SPACE",
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
        <ul className="flex items-center gap-8 xl:gap-12">
          {navLinks.map((navLink, i) => (
            <li key={i}>
              <Link
                href={navLink.link}
                className="group relative inline-block text-[12px] font-bold tracking-[0.2em] uppercase text-foreground/70 hover:text-primary transition-all duration-300 whitespace-nowrap"
              >
                <span className="relative z-10 transition-transform duration-300">
                  {navLink.title}
                </span>
                <span className="absolute left-0 -bottom-1 h-[1px] w-full scale-x-0 transition-transform duration-500 group-hover:scale-x-100 bg-primary/30 rounded-full" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Login and Theme Toggle */}
      <div className="hidden lg:flex items-center gap-3 xl:gap-5 shrink-0">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative text-foreground p-2 rounded-full hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center h-10 w-10 border border-transparent hover:border-primary/10"
          aria-label="Toggle theme"
        >
          <Sun className="absolute h-[1.3rem] w-[1.3rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.3rem] w-[1.3rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </button>

        {isAuthenticated ? (
          <div className="flex gap-3 xl:gap-4">
            <Link href="/profile">
              <Button variant="outline" size="default">
                {user?.avatarUrl ? (
                  <div className="w-5 h-5 rounded-full overflow-hidden mr-2 border border-slate-200 dark:border-white/20">
                    <Image
                      src={user.avatarUrl}
                      alt="Profile"
                      width={20}
                      height={20}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <CircleUser size={18} className="mr-2" />
                )}
                <div className="font-bold text-[13px] tracking-tight">
                  Profile
                </div>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="default"
              className="text-red-500 hover:text-red-600 border-red-100 dark:border-red-900/30"
              onClick={logout}
              loading={isLoggingOut}
            >
              <LogOut size={16} className="mr-2" />
              <div className="font-bold text-[13px] tracking-tight">Logout</div>
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="outline" size="default">
              <CircleUser size={18} className="mr-2" />
              <div>Login</div>
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
        className={`absolute top-[72px] left-0 w-full bg-background/95 backdrop-blur-2xl z-50 px-6 lg:hidden transition-all duration-500 ease-in-out overflow-hidden border-b border-border shadow-2xl ${
          isMenuOpen
            ? "max-h-[100vh] pb-12 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col gap-4">
          {navLinks.map((navLink, i) => (
            <li key={i}>
              <Link
                href={navLink.link}
                className="block text-xl font-semibold py-5 border-b border-border/50 text-foreground hover:text-primary transition-colors tracking-tight"
                onClick={() => setIsMenuOpen(false)}
              >
                {navLink.title}
              </Link>
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

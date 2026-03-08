// #205a6a as hover effect color
// #0f313d as hover effect for button text
// #EEFCFD as hover effect for button bg

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
    <header className="relative z-50 py-3 sm:py-4 px-4 sm:px-8 flex justify-between items-center bg-white/10 dark:bg-[#081B23]/30 backdrop-blur-md border-b border-white/5 shadow-sm">
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
          className="transition-all duration-300 hover:scale-105 object-contain invert dark:invert-0"
        />
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex flex-1 justify-center px-8">
        <ul className="flex items-center gap-6 xl:gap-10">
          {navLinks.map((navLink, i) => (
            <li key={i}>
              <Link
                href={navLink.link}
                className="group relative inline-block text-[13px] font-bold tracking-wider text-slate-900 dark:text-gray-200 hover:text-[#205a6a] dark:hover:text-white transition-colors duration-200 whitespace-nowrap"
              >
                <span className="relative z-10 transition-transform duration-300 group-hover:scale-101">
                  {navLink.title}
                </span>
                <span className="absolute left-0 -bottom-1 h-[2px] w-full scale-x-0 transition-transform duration-300 group-hover:scale-x-100 bg-[#205a6a] " />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Login and Theme Toggle */}
      <div className="hidden lg:flex items-center gap-3 xl:gap-5 shrink-0">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative text-slate-900 dark:text-gray-300 p-2 rounded-full hover:bg-[#EEFCFD] hover:text-[#0f313d] dark:hover:bg-white/10 dark:hover:text-white transition-all flex items-center justify-center h-10 w-10 border border-transparent hover:border-slate-200 dark:hover:border-white/10"
          aria-label="Toggle theme"
        >
          <Sun className="absolute h-[1.3rem] w-[1.3rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.3rem] w-[1.3rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </button>

        {isAuthenticated ? (
          <div className="flex gap-3 xl:gap-4">
            <Link href="/profile">
              <Button
                variant="outline"
                className="px-4 py-2 h-10 rounded-xl border-slate-200 dark:border-white/10 bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
              >
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
              className="px-4 py-2 h-10 rounded-xl border-red-100 dark:border-red-900/30 text-red-500 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 transition-all"
              onClick={logout}
              loading={isLoggingOut}
            >
              <LogOut size={16} className="mr-2" />
              <div className="font-bold text-[13px] tracking-tight">Logout</div>
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button
              variant="outline"
              className="px-6 py-2 h-10 rounded-xl font-bold text-[13px] tracking-tight border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10"
            >
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
        className={`absolute top-[72px] left-0 w-full bg-white/80 dark:bg-[#0F313D]/90 backdrop-blur-xl z-50 px-6 lg:hidden transition-all duration-500 ease-in-out overflow-hidden border-b border-slate-200 dark:border-white/10 shadow-xl ${
          isMenuOpen
            ? "max-h-[80vh] pb-8 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col gap-4">
          {navLinks.map((navLink, i) => (
            <li key={i}>
              <Link
                href={navLink.link}
                className="block text-lg font-bold py-4 border-b border-slate-100 dark:border-white/10 text-slate-900 dark:text-white hover:text-[#205a6a] dark:hover:text-[#6BE3DF] transition-colors"
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
                  className="flex gap-4 items-center w-full py-4 border-b border-slate-100 dark:border-white/10 text-slate-900 dark:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 dark:bg-white/10 flex items-center justify-center border border-slate-200 dark:border-white/20">
                    {user?.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    ) : (
                      <CircleUser size={24} />
                    )}
                  </div>
                  <div className="font-bold text-lg">MY PROFILE</div>
                </Link>
                <button
                  className="flex gap-4 items-center w-full py-5 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors rounded-xl px-2"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  disabled={isLoggingOut}
                >
                  <LogOut size={24} />
                  <div className="text-lg">
                    {isLoggingOut ? "LOGGING OUT..." : "LOGOUT"}
                  </div>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex gap-4 items-center w-full py-6 border-b border-slate-100 dark:border-white/10 text-slate-900 dark:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-10 h-10 rounded-full bg-[#1C5B6F] text-white flex items-center justify-center shadow-lg">
                  <CircleUser size={24} />
                </div>
                <div className="font-bold text-lg">LOGIN TO FRL</div>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;

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
    <header className="relative z-50 py-4 px-2 flex justify-between items-center xl:py-2">
      {/* Logo */}
      <Link
        href="/"
        className="cursor-pointer flex justify-center items-center"
      >
        <Image
          src="/Bluelog.svg"
          width={100}
          height={40}
          alt="nav_logo"
          className="transition-all duration-300 hover:scale-105 object-contain invert dark:invert-0"
        />
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex">
        <ul className="flex gap-12">
          {navLinks.map((navLink, i) => (
            <li key={i}>
              <Link
                href={navLink.link}
                className="group relative inline-block text-lg font-medium text-slate-900 dark:text-white"
              >
                <span className="relative z-10 inline-block transition-transform duration-300 group-hover:scale-105">
                  {navLink.title}
                </span>
                <span className="absolute left-0 -bottom-1 h-[2px] w-full scale-x-0 transition-transform duration-300 group-hover:scale-x-100 bg-[#205a6a] " />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Login and Theme Toggle */}
      <div className="hidden lg:flex items-center gap-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative text-slate-900 dark:text-white p-2 rounded-full hover:bg-[#EEFCFD] hover:text-[#0f313d] transition-all flex items-center justify-center h-10 w-10"
          aria-label="Toggle theme"
        >
          <Sun className="absolute h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.5rem] w-[1.5rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </button>

        {isAuthenticated ? (
          <div className="flex gap-4">
            <Link href="/profile">
              <Button
                variant="outline"
                className="px-5 py-[0.9375rem] overflow-hidden"
              >
                {user?.avatarUrl ? (
                  <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                    <Image
                      src={user.avatarUrl}
                      alt="Profile"
                      width={24}
                      height={24}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <CircleUser size={22} className="mr-2" />
                )}
                <div className="font-medium text-[15px]">Profile</div>
              </Button>
            </Link>
            <Button
              variant="outline"
              className="px-5 py-[0.9375rem] border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              onClick={logout}
              loading={isLoggingOut}
            >
              <LogOut size={20} className="mr-2" />
              <div className="font-medium text-[15px]">Logout</div>
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="outline" className="px-7 py-[0.9375rem]">
              <CircleUser size={22} />
              <div className="font-medium text-[15px] ml-2">Login</div>
            </Button>
          </Link>
        )}
      </div>

      {/* below this section's ui is still being developed  */}
      {/* Hamburger for mobile */}
      <div
        className="lg:hidden flex flex-col gap-1 cursor-pointer"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div
          className={`w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
            isMenuOpen ? "rotate-45 translate-y-[6px]" : ""
          }`}
        ></div>
        <div
          className={`w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
            isMenuOpen ? "opacity-0" : ""
          }`}
        ></div>
        <div
          className={`w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
            isMenuOpen ? "-rotate-45 -translate-y-[6px]" : ""
          }`}
        ></div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`absolute top-[80px] left-0 w-full bg-[#0F313D] z-10 px-5 lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen
            ? "max-h-[500px] pb-4 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col gap-4">
          {navLinks.map((navLink, i) => (
            <li key={i}>
              <Link
                href={navLink.link}
                className="block text-lg font-medium py-2 border-b border-white/20"
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
                  className="flex gap-2 items-center w-full py-2 border-b border-white/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {user?.avatarUrl ? (
                    <div className="w-5 h-5 rounded-full overflow-hidden">
                      <Image
                        src={user.avatarUrl}
                        alt="Profile"
                        width={20}
                        height={20}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <CircleUser size={20} />
                  )}
                  <div className="font-medium text-lg text-white">PROFILE</div>
                </Link>
                <button
                  className="flex gap-2 items-center w-full py-2 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  disabled={isLoggingOut}
                >
                  <LogOut size={20} />
                  <div className="font-medium text-lg">
                    {isLoggingOut ? "LOGGING OUT..." : "LOGOUT"}
                  </div>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex gap-2 items-center w-full py-2 border-b border-white/20"
                onClick={() => setIsMenuOpen(false)}
              >
                <CircleUser size={20} />
                <div className="font-medium text-lg text-white">LOGIN</div>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;

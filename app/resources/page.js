"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Mic,
  Calendar,
  Bookmark,
  Newspaper,
  Film,
  BookOpen,
} from "lucide-react";

export default function ResourcesPage() {
  const resources = [
    {
      title: "Podcasts",
      icon: <Mic className="w-6 h-6 text-[#2D201B] dark:text-[#EEFCFD]" />,
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.",
      link: "/resources/podcasts",
    },
    {
      title: "Events",
      icon: <Calendar className="w-6 h-6 text-[#2D201B] dark:text-[#EEFCFD]" />,
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.",
      link: "/resources/events",
    },
    {
      title: "Notice Board",
      icon: <Bookmark className="w-6 h-6 text-[#2D201B] dark:text-[#EEFCFD]" />,
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.",
      link: "/resources/notice-board",
    },
    {
      title: "Blogs",
      icon: (
        <Newspaper className="w-6 h-6 text-[#2D201B] dark:text-[#EEFCFD]" />
      ),
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.",
      link: "/resources/blogs",
    },
    {
      title: "Films",
      icon: <Film className="w-6 h-6 text-[#2D201B] dark:text-[#EEFCFD]" />,
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.",
      link: "/resources/films",
    },
    {
      title: "Publications",
      icon: <BookOpen className="w-6 h-6 text-[#2D201B] dark:text-[#EEFCFD]" />,
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.",
      link: "/resources/publications",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F313D] text-foreground dark:text-white transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 w-full items-center">
          {/* Left Hero Area */}
          <div className="lg:w-5/12 flex flex-col justify-center">
            <h1 className="font-bold text-4xl lg:text-[45px] xl:text-[54px] xl:leading-[1.1] text-foreground dark:text-white mb-6 transition-colors duration-300">
              Explore Your Life Balance Wheel
            </h1>
            <p className="text-xl lg:text-[22px] font-medium leading-[1.4] text-muted-foreground dark:text-white/80 mb-10 transition-colors duration-300">
              Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Ut Et
              Massa Mi. Aliquam In Hendrerit Urna.
            </p>
            <div>
              <Link
                href="/life-balance"
                className="inline-flex items-center gap-2 group text-[#0F313D] dark:text-[#EEFCFD] font-semibold text-lg transition-colors duration-300"
              >
                <span>Explore Now</span>
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
          </div>

          {/* Right Resource Grid */}
          <div className="lg:w-7/12 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {resources.map((res, i) => (
                <div
                  key={i}
                  className="bg-[#F6F5F0] dark:bg-[#19667A] transition-all duration-300 rounded-[2rem] p-8 flex border border-transparent dark:border-white/10 shadow-sm hover:shadow-lg dark:shadow-none hover:-translate-y-1"
                >
                  <div className="flex flex-col h-full w-full">
                    {/* Top half: Icon and Title aligned correctly */}
                    <div className="flex flex-col gap-6 w-full">
                      <div className="flex items-center gap-6">
                        <div className="flex-shrink-0">{res.icon}</div>
                        <h3 className="font-bold text-2xl text-[#2D201B] dark:text-white transition-colors duration-300">
                          {res.title}
                        </h3>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground dark:text-white/70 transition-colors duration-300 pl-[3rem]">
                        {res.desc}
                      </p>
                    </div>

                    {/* Bottom half: Link aligned horizontally in the center of the description text column */}
                    <div className="mt-8 flex justify-center w-full">
                      <Link
                        href={res.link}
                        className="inline-flex pl-[3rem] items-center gap-2 group text-[#2D201B] dark:text-[#EEFCFD] font-semibold text-base transition-colors duration-300"
                      >
                        <span className="group-hover:underline underline-offset-4">
                          Read More
                        </span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

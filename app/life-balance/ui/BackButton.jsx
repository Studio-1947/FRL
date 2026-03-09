"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import React from "react";

const BackButton = ({ slideIndex, setSlideIndex }) => {
  const router = useRouter();
  const gotToPreviousScreen = () => {
    if (slideIndex === 0) {
      router.push("/");
    } else if (slideIndex > 0 && slideIndex <= 11) {
      setSlideIndex((prev) => prev - 1);
    }
  };

  const totalCount = 8;
  const questionCount = slideIndex - 2;

  return (
    <div className="flex justify-between z-10">
      <button
        className="w-14 h-14 lg:h-20 lg:w-20 bg-background border border-border rounded-full flex justify-center items-center hover:bg-muted transition-all duration-300 cursor-pointer hover:scale-105 shadow-sm group"
        onClick={gotToPreviousScreen}
      >
        <ChevronLeft className="text-foreground h-8 w-8 transition-colors duration-300 group-hover:-translate-x-1" />
      </button>
      {slideIndex >= 3 && slideIndex <= 10 && (
        <div className="flex justify-center items-center">
          <div className="flex gap-4">
            <div className="text-foreground transition-colors duration-300 font-bold tracking-tight text-lg">
              Step {questionCount}/{totalCount}
            </div>
            <div className="flex gap-2 justify-center items-center">
              {Array.from({ length: totalCount }, (_, index) => {
                const step = index + 1;
                const isCompleted = step < questionCount;
                const isCurrent = step === questionCount;

                return (
                  <div
                    key={index}
                    className={`flex-1 h-3 w-3 rounded-full transition-all duration-500 ${
                      isCompleted || isCurrent
                        ? "bg-primary scale-110 shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                        : "bg-primary/20"
                    }`}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackButton;

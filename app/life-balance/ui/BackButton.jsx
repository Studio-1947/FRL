"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import React from "react";

const BackButton = ({ slideIndex, setSlideIndex }) => {
  // let [count, setCount] = useState(1)
  const router = useRouter();
  const gotToPreviousScreen = () => {
    // If on the first slide, go to /resource
    if (slideIndex === 0) {
      router.push("/");
      // If on the first slide, go to /resource
    } else if (slideIndex > 0 && slideIndex <= 11) {
      setSlideIndex((prev) => prev - 1);
    }
  };

  const totalCount = 8;
  const questionCount = slideIndex - 2;

  return (
    <>
      <div className="flex justify-between z-10">
        <button
          className="w-[3.125rem] h-[3.125rem]  lg:h-[5rem] lg:w-[5rem] bg-[#EEFCFD] rounded-full flex justify-center items-center hover:bg-[#D9F5F7] transition-all duration-200 cursor-pointer hover:scale-105"
          onClick={gotToPreviousScreen}
        >
          <ChevronLeft className="text-[#0F313D] h-8 w-8 " />
        </button>
        {slideIndex >= 3 && slideIndex <= 10 && (
          <div className="flex justify-center items-center">
            <div className="flex gap-3">
              <div className="text-white">
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
                      className={`flex-1 h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                        isCompleted
                          ? "bg-[#6BE3DF]" // Completed step
                          : isCurrent
                            ? "bg-[#6BE3DF]" // Current step
                            : "bg-[#0F313D]" // Incomplete
                      }`}
                    ></div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BackButton;

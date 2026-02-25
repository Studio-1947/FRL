"use client";
import { ArrowRight, ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { countries } from "./slidesData";

const FormSlide = ({ header, setSlideIndex, fromDataCallBack }) => {
  const [location, setLocation] = useState("");
  const [pinCode, setPinCode] = useState("");

  const submitForm = (e) => {
    e.preventDefault();
    fromDataCallBack(location, pinCode);
    setSlideIndex();
  };

  return (
    <>
      <div className="flex justify-center items-center content-center text-center lg:w-1/2 ">
        <div className="bg-primary/10 dark:bg-[#F6F5F0] w-[15.625rem] h-[15.625rem] lg:w-[30.75rem] lg:h-[30.75rem] rounded-full transition-colors duration-300" />
      </div>
      <form
        className="flex flex-col justify-between gap-5 h-full lg:w-1/2 lg:justify-center lg:items-start lg:gap-7 capitalize"
        onSubmit={submitForm}
      >
        <div className="font-semibold text-3xl  lg:text-5xl lg:font-bold text-foreground dark:text-white transition-colors duration-300">
          {header}
        </div>

        <div className="flex flex-col justify-center  gap-4 w-full">
          <div class="inline-block relative w-full">
            <select
              class="block appearance-none w-full bg-background dark:bg-[#19667A] border-[2px] border-input dark:border-[#EEFCFD] text-foreground dark:text-white px-[1.375rem] py-[1.5rem] pr-8  shadow leading-tight focus:outline-none focus:shadow-outline capitalize rounded-3xl text-base font-medium lg:text-xl transition-colors duration-300"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option
                className="bg-background dark:bg-[#0F313D] text-foreground dark:text-white"
                value=""
                disabled
              >
                Select your country
              </option>
              {countries.map((country, index) => (
                <option
                  key={index}
                  className="bg-background dark:bg-[#0F313D] text-foreground dark:text-white"
                  value={country}
                >
                  {country}
                </option>
              ))}
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-muted-foreground dark:text-[#EEFCFD] transition-colors duration-300">
              <ChevronDown />
            </div>
          </div>
          <div>
            <div class="inline-block relative w-full">
              <input
                class="block appearance-none  bg-transparent border-input dark:border-[#EEFCFD] border-[2px] text-foreground dark:text-white px-[1.375rem] py-[1.5rem] pr-8  shadow leading-tight focus:outline-none focus:shadow-outline capitalize rounded-3xl text-base font-medium w-full lg:text-xl transition-colors duration-300"
                type="number"
                placeholder="PIN / ZIP Code"
                onChange={(e) => setPinCode(e.target.value)}
                value={pinCode}
              />
            </div>
          </div>
        </div>

        {/* next button */}
        <div className="flex items-baseline justify-end lg:justify-start lg:items-start">
          <Button
            variant="primary"
            size="lg"
            className="px-[1.75rem] py-[0.75rem] lg:text-xl"
          >
            Next
            <ArrowRight className="w-[1.5rem] h-[1.3rem]" />
          </Button>
        </div>
      </form>
    </>
  );
};

export default FormSlide;

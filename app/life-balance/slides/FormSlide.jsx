"use client";
import { ArrowRight, ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
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
        <div className="bg-[#F6F5F0] w-[15.625rem] h-[15.625rem] lg:w-[30.75rem] lg:h-[30.75rem] rounded-full" />
      </div>
      <form
        className="flex flex-col justify-between gap-5 h-full lg:w-1/2 lg:justify-center lg:items-start lg:gap-7 capitalize"
        onSubmit={submitForm}
      >
        <div className="font-semibold text-3xl  lg:text-5xl lg:font-bold text-white">
          {header}
        </div>

        <div className="flex flex-col justify-center  gap-4 w-full">
          <div class="inline-block relative w-full">
            <select
              class="block appearance-none w-full bg-[#19667A] border-[2px] border-[#EEFCFD]  px-[1.375rem] py-[1.5rem] pr-8  shadow leading-tight focus:outline-none focus:shadow-outline capitalize rounded-3xl text-base font-medium lg:text-xl"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option className="bg-[#0F313D]" value="" disabled>
                Select your country
              </option>
              {countries.map((country, index) => (
                <option key={index} className="bg-[#0F313D]" value={country}>
                  {country}
                </option>
              ))}
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-[#EEFCFD]">
              <ChevronDown />
            </div>
          </div>
          <div>
            <div class="inline-block relative w-full">
              <input
                class="block appearance-none  bg-transparent border-[#EEFCFD] border-[2px] px-[1.375rem] py-[1.5rem] pr-8  shadow leading-tight focus:outline-none focus:shadow-outline capitalize rounded-3xl text-base font-medium w-full lg:text-xl"
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
          <button className="flex justify-center items-center gap-[0.6rem] font-medium text-base text-[#2D201B] bg-[#F6F5F0] rounded-3xl px-[1.75rem] py-[0.75rem] lg:text-xl cursor-pointer transition-all">
            Next
            <ArrowRight className="w-[1.5rem] h-[1.3rem]" />
          </button>
        </div>
      </form>
    </>
  );
};

export default FormSlide;

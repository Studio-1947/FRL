"use client";
import { ArrowRight, ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { countries } from "./slidesData";
import { GlassCard } from "@/app/components/ui/GlassCard";

const FormSlide = ({ header, setSlideIndex, fromDataCallBack }) => {
  const [location, setLocation] = useState("");
  const [pinCode, setPinCode] = useState("");

  const submitForm = (e) => {
    e.preventDefault();
    fromDataCallBack(location, pinCode);
    setSlideIndex();
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 pt-10 lg:pt-0 max-w-7xl mx-auto lg:min-h-screen h-full lg:mt-[-60px]">
      <div className="flex justify-center items-center lg:w-1/2 relative">
        <div className="relative w-64 h-64 lg:w-[450px] lg:h-[450px]">
          <GlassCard className="absolute inset-0 rounded-full flex items-center justify-center border-primary/20 shadow-2xl animate-pulse duration-[4000ms]">
            <div className="w-1/2 h-1/2 bg-primary/10 rounded-full blur-2xl" />
          </GlassCard>
          <div className="absolute inset-4 rounded-full border-2 border-dashed border-primary/10 animate-spin-slow" />
        </div>
      </div>

      <form
        className="flex flex-col justify-center gap-10 h-full lg:w-1/2 lg:items-start"
        onSubmit={submitForm}
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground uppercase">
          {header}
        </h2>

        <div className="flex flex-col gap-6 w-full max-w-md">
          <div className="relative group">
            <select
              className="appearance-none w-full bg-background border-2 border-border text-foreground px-6 py-5 pr-12 rounded-2xl text-lg font-bold transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none hover:border-primary/50 cursor-pointer"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            >
              <option value="" disabled>
                Select your country
              </option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors pointer-events-none" />
          </div>

          <div className="relative">
            <input
              className="w-full bg-background border-2 border-border text-foreground px-6 py-5 rounded-2xl text-lg font-bold transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none hover:border-primary/50"
              type="text"
              placeholder="PIN / ZIP Code"
              onChange={(e) => setPinCode(e.target.value)}
              value={pinCode}
              required
            />
          </div>
        </div>

        <div className="flex justify-center lg:justify-start">
          <Button
            variant="primary"
            size="lg"
            className="px-10 py-5 text-lg lg:text-xl rounded-2xl group shadow-xl"
            type="submit"
          >
            Continue
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormSlide;

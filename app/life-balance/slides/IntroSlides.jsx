import { ArrowRight } from "lucide-react";
import React from "react";
import BalanceImage from "./BalanceImage";
import { Button } from "@/app/components/ui/Button";

// count starts at 1
// 1 is about
// 2 is instructions
// 3 is zip code
// 4 to 11 is question
const IntroSlides = ({ header, paragraph, setSlideIndex, image }) => {
  return (
    <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-12 pt-10 lg:pt-0 max-w-7xl mx-auto lg:min-h-screen h-full lg:mt-[-60px]">
      <div className="flex justify-center items-center lg:w-1/2 overflow-visible min-h-0 relative">
        <BalanceImage image={image} />
      </div>

      <div className="flex flex-col justify-center flex-1 lg:w-1/2 gap-10 min-h-0">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tight text-center lg:text-left text-foreground uppercase">
            {header}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-center lg:text-left text-muted-foreground font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
            {paragraph}
          </p>
        </div>

        <div className="flex justify-center lg:justify-start">
          <Button
            variant="primary"
            size="lg"
            className="px-10 py-5 text-lg lg:text-xl rounded-2xl group shadow-xl"
            onClick={setSlideIndex}
          >
            Explore Now
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntroSlides;

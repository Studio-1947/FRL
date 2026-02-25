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
    <div className="flex flex-col lg:flex-row-reverse items-between justify-between gap-8 pt-10 lg:pt-0 max-w-[1200px] mx-auto lg:min-h-screen h-full lg:mt-[-60px]">
      <div className="flex justify-center items-center lg:w-1/2 overflow-visible min-h-0">
        <BalanceImage image={image} />
      </div>

      <div className="flex flex-col justify-between flex-1 lg:w-1/2 lg:justify-center lg:gap-7 min-h-0">
        <div className="capitalize">
          <div className="font-semibold text-3xl pb-2 lg:text-5xl lg:font-bold text-center lg:text-left text-foreground dark:text-white transition-colors duration-300">
            {header}
          </div>
          <p className="font-medium text-base lg:text-xl text-center lg:text-left text-muted-foreground dark:text-white transition-colors duration-300">
            {paragraph}
          </p>
        </div>

        <div className="flex items-baseline justify-end lg:justify-start lg:items-start">
          <Button
            variant="primary"
            size="lg"
            className="px-[1.75rem] py-[0.75rem] lg:text-xl"
            onClick={setSlideIndex}
          >
            Explore Now
            <ArrowRight className="w-[1.5rem] h-[1.3rem]" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntroSlides;

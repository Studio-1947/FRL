"use client";
import React, { useState } from "react";
import PointTracker from "../ui/PointTracker";
import { ArrowRight } from "lucide-react";
import Circle from "../ui/Circle";
import { Button } from "@/app/components/ui/Button";
import { GlassCard } from "@/app/components/ui/GlassCard";

const QuestionSlides = ({
  header,
  setSlideIndex,
  answerCollector,
  slideIndex,
}) => {
  const [currentAnswer, setCurrentAnswer] = useState(1);
  const savingAndGoingToNextQuestion = (e) => {
    e.preventDefault();
    answerCollector(currentAnswer);
    setSlideIndex();
  };

  return (
    <div className="flex flex-col justify-between gap-12 lg:flex-row-reverse lg:items-center lg:h-full max-w-7xl mx-auto w-full">
      {/* Circle section - right side on large screens */}
      <div className="flex justify-center items-center text-center lg:w-1/2 relative">
        <div className="w-[70vw] max-w-[18rem] aspect-square lg:w-[35rem] lg:max-w-none rounded-full relative">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="relative z-10 w-full h-full">
            <Circle stage={slideIndex} />
          </div>
        </div>
      </div>

      {/* Content section - left side on large screens */}
      <div className="lg:w-1/2 flex flex-col justify-center gap-10">
        <form
          id="question-form"
          onSubmit={savingAndGoingToNextQuestion}
          className="flex flex-col gap-10"
        >
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground uppercase leading-tight">
              {header}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-light mb-4">
              Rate your level of satisfaction on a scale of 1 - 10
            </p>
          </div>

          <GlassCard className="!p-8 lg:!p-10 shadow-xl border-primary/10">
            <div className="w-full">
              <PointTracker onChange={setCurrentAnswer} />
            </div>
          </GlassCard>

          {/* Desktop Next button */}
          <div className="hidden lg:flex justify-start">
            <Button
              variant="primary"
              size="lg"
              className="px-10 py-5 text-lg lg:text-xl rounded-2xl group shadow-xl"
            >
              Next Component
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </form>
      </div>

      {/* Mobile: sticky bottom Next button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-xl border-t border-border z-50 flex justify-end">
        <Button
          form="question-form"
          type="submit"
          variant="primary"
          size="lg"
          className="px-10 py-5 rounded-2xl shadow-2xl"
        >
          Next
          <ArrowRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default QuestionSlides;

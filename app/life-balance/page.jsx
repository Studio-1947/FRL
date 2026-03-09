"use client";
import React, { useState } from "react";
import BalanceImage from "./slides/BalanceImage";
import BackButton from "./ui/BackButton";
import slidesData from "./slides/slidesData";
import IntroSlides from "./slides/IntroSlides";
import FormSlide from "./slides/FormSlide";
import QuestionSlides from "./slides/QuestionSlides";
import Results from "./wheel/Results";
import DarkVeil from "./ui/src/components/DarkVeil";

const LifeBalancePage = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [formValues, setFormVales] = useState({ location: "", pinCode: "" });
  const [answers, setAnswers] = useState([]);

  const currentSlide = slidesData[slideIndex];
  const isResults = slideIndex >= slidesData.length;

  const fromData = (location, pinCode) => {
    setFormVales({ location, pinCode });
  };

  const answerCollector = (ans) => {
    setAnswers((prev) => [...prev, ans]);
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground relative flex flex-col overflow-x-hidden">
      {/* DarkVeil Background Animation */}
      <DarkVeil
        hueShift={47}
        noiseIntensity={0.03}
        scanlineIntensity={0.1}
        speed={0.2}
        scanlineFrequency={400}
        warpAmount={0.2}
        resolutionScale={1}
      />

      {/* Subtle Background Decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-8 md:py-12 flex flex-col flex-1">
        {/* Navigation */}
        <div className="mb-10 lg:mb-16">
          <BackButton setSlideIndex={setSlideIndex} slideIndex={slideIndex} />
        </div>

        <main className="flex-1 flex flex-col justify-center min-h-0">
          {!isResults && currentSlide && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-forwards">
              {currentSlide.type === "intro" && (
                <IntroSlides
                  header={currentSlide.header}
                  paragraph={currentSlide.paragraph}
                  setSlideIndex={() => setSlideIndex(slideIndex + 1)}
                  image={currentSlide.image}
                />
              )}
              {currentSlide.type === "form" && (
                <FormSlide
                  header={currentSlide.header}
                  setSlideIndex={() => setSlideIndex(slideIndex + 1)}
                  fromDataCallBack={fromData}
                />
              )}
              {currentSlide.type === "question" && (
                <QuestionSlides
                  header={currentSlide.question}
                  setSlideIndex={() => setSlideIndex(slideIndex + 1)}
                  answerCollector={answerCollector}
                  slideIndex={slideIndex}
                />
              )}
            </div>
          )}

          {isResults && (
            <div className="animate-in fade-in zoom-in-95 duration-1000 ease-out fill-mode-forwards">
              <Results answers={answers} formValues={formValues} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LifeBalancePage;

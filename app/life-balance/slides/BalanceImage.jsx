"use client";
import Image from "next/image";
import React from "react";
import dynamic from "next/dynamic";

// Lottie player can reference window/document; load only on client
const Lottie = dynamic(() => import("@lottielab/lottie-player/react"), {
  ssr: false,
});

const BalanceImage = ({ image }) => {
  return (
    // <div className="relative w-48 md:w-[20rem] md:h-[20rem] lg:w-[37.5rem] h-full lg:h-[37.5rem] aspect-square overflow-visible lg:px-0">
    //   <div className="absolute z-10 bg-[#19667A] p-10 bottom-0 right-[-100px] py-7 px-25" />

    //   <div className="sm:scale-[2] scale-[1.8] md: origin-center object-center w-full h-100 pt-30 pl-10">
    //     <Lottie
    //       src={image}
    //       autoplay
    //       loop
    //       style={{ width: "100%", height: "100%" }}
    //     />
    //   </div>
    // </div>

    <div className="relative w-48 md:w-[20rem] md:h-[20rem] lg:w-[37.5rem] lg:h-[37.5rem] aspect-square overflow-hidden lg:px-0">
      {/* Responsive watermark cover — scales with viewport, stays fixed to BR */}
      <div
        className="absolute z-10 pointer-events-none bg-black rounded"
        style={{
          // keep a small, responsive margin from the edges
          right: "clamp(0px, 1.5vw, 0px)",
          bottom: "clamp(0px, 1.5vw, 0px)",
          // size scales with container/viewport but stays within sensible bounds
          width: "clamp(64px, 12vw, 180px)",
          height: "clamp(20px, 3vw, 72px)",
        }}
      />

      {/* Lottie area — centered & scaled; keep overflow clipped by parent */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="scale-[1.8] sm:scale-[2] md:scale-[2] lg:scale-[1.6] xl:scale-[1.4]">
          <Lottie
            src={image}
            autoplay
            loop
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default BalanceImage;

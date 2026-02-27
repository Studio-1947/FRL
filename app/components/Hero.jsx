import { ArrowRight, CircleUser, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/Button";

export default function Hero() {
  return (
    <div className="flex  flex-col  lg:flex-row gap-8 px-3">
      {/* first section */}
      <div className="lg:w-1/2 flex flex-col gap-8 ">
        {/* card */}
        <div className="flex flex-col sm:flex-row gap-5 pb-4 w-full">
          <div className="w-full sm:w-[200px] shrink-0 rounded-xl inline-flex flex-col justify-start items-start overflow-hidden transition-all duration-300 hover:scale-105 shadow-2xl">
            <Image
              className="object-cover h-32 relative"
              src="/Hero/hero_card.webp"
              alt="hero image card"
              width={400}
              height={50}
            />
            <div className="self-stretch p-2.5 flex flex-col justify-start items-start gap-2 bg-stone-100">
              <div className="size- px-3 py-1.5 bg-[#EAE5D7] rounded-3xl flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                <div className="justify-start text-[#5C4537] text-xs font-medium ">
                  Notice Board
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start">
                <div className="self-stretch p-[5px] flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                  <div className="self-stretch justify-start text-[#70543E] text-lg  capitalize tracking-wide font-semibold">
                    Featured Member
                  </div>
                </div>
                <div className="self-stretch p-[5px] flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                  <div className="self-stretch justify-start text-[#9C8056] text-xs font-medium hover:text-[#5C4537] cursor-pointer transition-all duration-300 hover:scale-105">
                    Click here to know more
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-[200px] shrink-0 rounded-xl inline-flex flex-col justify-start items-start overflow-hidden transition-all duration-300 hover:scale-105 shadow-2xl">
            <Image
              className="object-cover h-32 relative"
              src="/Hero/hero_card2.webp"
              alt="hero image card"
              width={400}
              height={50}
            />
            <div className="self-stretch p-2.5 flex flex-col justify-start items-start gap-2 bg-stone-100">
              <div className="size- px-3 py-1.5 bg-[#EAE5D7] rounded-3xl flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                <div className="justify-start text-[#5C4537] text-xs font-medium ">
                  Notice Board
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start">
                <div className="self-stretch p-[5px] flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                  <div className="self-stretch justify-start text-[#70543E] text-lg  capitalize tracking-wide font-semibold">
                    What's new in FRL
                  </div>
                </div>
                <div className="self-stretch p-[5px] flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                  <div className="self-stretch justify-start text-[#9C8056] text-xs font-medium hover:text-[#5C4537] cursor-pointer transition-all duration-300 hover:scale-105">
                    Click here to know more
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* text section */}
        <div className="text-foreground dark:text-white">
          <h1 className="text-3xl font-bold capitalize pb-2">
            Co-creating a harmonious thriving future
          </h1>
          <p className="text-base mb-2">
            The Forum for Responsible Living (FRL) is a safe space for members
            to explore how each of us can contribute towards healing ourselves,
            local communities and ecosystems.
          </p>
          <p>
            Explore FRL supports members to explore fresh perspectives on
            themselves and the systems that influence social, ecological and
            economic (SEE) challenges that concern them the most – helping them
            to emerge as change-makers who are systems aware & guided by
            universal values.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="primary" size="lg">
            <div className="">Login</div>
            <CircleUser size={22} />
          </Button>
          <Button variant="outline" size="lg">
            <div>Play Video</div>
            <Play size={22} />
          </Button>
        </div>
      </div>
      {/* second section */}
      <div className="lg:w-1/2 flex flex-col gap-[1.25rem] rounded-2xl bg-[rgba(246,246,246,0.05)] pb-5">
        {/* image goes here */}
        <div className="rounded-t-2xl overflow-hidden">
          <div className="self-stretch h-[290px] relative bg-[#ffffff] opacity-[0.1] " />
        </div>
        {/* second heading */}
        <div className="px-5 text-foreground dark:text-white">
          <h2 className="text-3xl font-bold capitalize ">
            Experience Life balance Tool
          </h2>
          <p className="text-base pt-2">
            No matter where we are from and what we do, there are universal
            values that we share. This magical reality can help us to co-create
            ecosystems of knowledge. One way to begin is to consciously
            prioritize personal & planetary well-being. Change begins with you,
            visualize all the important areas of your life at once, and become
            aware of how fulfilled you feel in each area.
          </p>
        </div>
        <div className="px-5 ">
          <Link href="/life-balance">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <div className="">Explore Now</div>
              <ArrowRight size={22} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

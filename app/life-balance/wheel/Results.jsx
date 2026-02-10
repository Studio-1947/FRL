"use client";
import React, { useMemo, useRef, useState } from "react";
import BalanceWheel from "./BalanceWheel";
import { Download, Share2 } from "lucide-react";

// Maps the ordered answers array to the BalanceWheel formData contract
const toFormData = (answers = []) => {
  const safe = (i, def = 5) => {
    const v = Number(answers[i]);
    return Number.isFinite(v) ? v : def;
  };
  return {
    health: safe(0),
    recreation: safe(1),
    relationships: safe(2),
    romance: safe(3),
    finance: safe(4),
    environment: safe(5),
    career: safe(6),
    spiritual: safe(7),
  };
};

const Results = ({ answers, formValues }) => {
  const graphRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const formData = useMemo(() => toFormData(answers), [answers]);

  // Display date in dd/mm/yyyy
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const displayDate = `${dd}/${mm}/${yyyy}`;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      const date = `${dd}/${mm}/${yyyy}`;
      const mod = await import("./generateBalanceWheelImage");
      await mod.generateBalanceWheelImage(graphRef.current, date);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "My Life Balance Wheel",
      text: "Check out my Life Balance Wheel snapshot. How balanced are you feeling today?",
      url: typeof window !== "undefined" ? window.location.href : undefined,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard && shareData.url) {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard");
      } else {
        alert("Sharing not supported on this device.");
      }
    } catch (e) {
      // Swallow user-cancel
    }
  };

  return (
    <div className="w-full h-full overflow-hidden flex flex-col lg:flex-row-reverse items-stretch gap-6 lg:gap-10">
      {/* Wheel section */}
      <div className="flex justify-center lg:justify-end items-center lg:w-1/2 flex-shrink-0 overflow-visible">
        <div className="relative w-full max-w-[90vw] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] aspect-square">
          <BalanceWheel formData={formData} graphRef={graphRef} />
        </div>
      </div>

      {/* Text + actions */}
      <div className="flex flex-col gap-4 flex-1 justify-start lg:justify-center lg:items-start overflow-hidden">
        <div className="capitalize">
          <div className="font-bold text-4xl md:text-5xl pb-2 text-white">
            Your Life Balance Wheel
          </div>
          <div className="text-white font-semibold tracking-wide text-2xl md:text-4xl">
            On {displayDate}
          </div>
        </div>

        {/* Supporting text */}
        <p className="font-medium text-base md:text-lg text-white/90 max-w-[36rem]">
          This is your current life balance wheel. Scores may shift hourly,
          daily, or weekly. Don’t seek ultimate truth — just notice how you feel
          right now.
        </p>

        {/* Optional location line */}
        {Boolean(formValues?.location || formValues?.pinCode) && (
          <p className="text-white/70 text-sm lg:text-base">
            Country: {formValues?.location || "-"} | ZIP:{" "}
            {formValues?.pinCode || "-"}
          </p>
        )}

        <div className="flex gap-3 pt-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 font-medium text-base text-[#2D201B] bg-[#F6F5F0] rounded-full px-5 py-3 lg:text-lg hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 transition-all"
            aria-label="Download"
          >
            <span>{downloading ? "Preparing..." : "Download"}</span>
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 font-medium text-base text-[#EEFCFD] border border-[#EEFCFD]/40 rounded-full px-5 py-3 lg:text-lg hover:scale-105 transition-all"
            aria-label="Share"
          >
            <span>Share</span>
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Footer credit */}
        <p className="mt-6 text-[11px] leading-snug text-white/70 max-w-[36rem]">
          The Life Balance Wheel Tool has been developed by the Academy of
          Leadership Coaching & NLP (ALCN). To know more about this work please
          visit
          <span className="px-1 underline decoration-white/50 underline-offset-2">
            https://nlp-leadership-coaching.com/
          </span>
        </p>
      </div>
    </div>
  );
};

export default Results;

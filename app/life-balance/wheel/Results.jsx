"use client";
import React, { useMemo, useRef, useState } from "react";
import BalanceWheel from "./BalanceWheel";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { GlassCard } from "@/app/components/ui/GlassCard";

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

import { toast } from "sonner";

import Modal from "@/app/components/ui/Modal";

const Results = ({ answers, formValues }) => {
  const graphRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const formData = useMemo(() => toFormData(answers), [answers]);

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const displayDate = `${dd}/${mm}/${yyyy}`;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const mod = await import("./generateBalanceWheelImage");
      await mod.generateBalanceWheelImage(graphRef.current, displayDate);
    } catch (err) {
      console.error("Download failed:", err);
      setModalState({
        isOpen: true,
        title: "Download Error",
        message:
          "We encountered an issue while generating your wheel image. Please try again or take a screenshot.",
        type: "error",
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "My Life Balance Wheel | FRL",
      text: "Explore my current state of balance. How are you feeling today?",
      url: typeof window !== "undefined" ? window.location.href : undefined,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard && shareData.url) {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard");
      }
    } catch (e) {
      setModalState({
        isOpen: true,
        title: "Sharing Failed",
        message:
          "We couldn't share the link automatically. You can copy the URL from your browser address bar.",
        type: "info",
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row-reverse items-center justify-center gap-12 lg:gap-20 max-w-7xl mx-auto px-4">
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        showCancel={false}
        confirmText="Understood"
      />
      {/* Wheel section */}
      <div className="flex justify-center items-center lg:w-1/2 relative">
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] animate-pulse" />
        <div className="relative z-10 w-full max-w-[500px] lg:max-w-none aspect-square">
          <BalanceWheel formData={formData} graphRef={graphRef} />
        </div>
      </div>

      {/* Text + actions */}
      <div className="flex flex-col gap-10 flex-1 lg:items-start text-center lg:text-left">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-semibold tracking-tighter text-foreground uppercase leading-[0.9]">
            Your Life Balance
          </h1>
          <div className="text-primary font-bold tracking-[0.2em] text-lg md:text-xl uppercase italic">
            Snapshot: {displayDate}
          </div>
        </div>

        <GlassCard className="p-8 lg:p-10 border-primary/10 shadow-2xl">
          <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-xl italic">
            "Balance is not something you find, it's something you create."
          </p>
          <div className="mt-8 pt-8 border-t border-border/50 flex flex-col gap-2">
            <p className="text-base font-semibold text-foreground">
              Location Summary
            </p>
            <p className="text-muted-foreground">
              {formValues?.location || "Global"}{" "}
              {formValues?.pinCode ? `| ${formValues.pinCode}` : ""}
            </p>
          </div>
        </GlassCard>

        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
          <Button
            variant="primary"
            onClick={handleDownload}
            disabled={downloading}
            size="lg"
          >
            {downloading ? "Processing..." : "Download PDF"}
            <Download className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="outline" onClick={handleShare} size="lg">
            Share
            <Share2 className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Footer credit */}
        <p className="text-xs text-muted-foreground font-medium mt-auto max-w-md opacity-60">
          The Life Balance Wheel Tool has been developed by the Academy of
          Leadership Coaching & NLP (ALCN).
        </p>
      </div>
    </div>
  );
};

export default Results;

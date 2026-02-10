"use client";
/**
 * BalanceWheel.jsx
 * Renders a “Life Balance Wheel” by loading a base SVG (balancewheel.svg),
 * removing any pre-existing plotted layers, and overlaying user scores (0–10)
 * as points + a polygon. Exposes a ref for capture and an onDownload hook.
 *
 * Requirements:
 * - Put your base SVG at: /public/assets/balancewheel.svg (same-origin)
 * - Provide `formData` object with numeric fields (0–10). See transform below.
 */

import { useEffect, useState, useRef, useMemo } from "react";
// import html2canvas from "html2canvas";

/** -----------------------------------------------------------
 * DATA CONTRACT
 * You ONLY need raw scores (0–10) from your form:
 *
 * const formData = {
 *   health: 7,
 *   recreation: 4,
 *   relationships: 6,
 *   romance: 5,
 *   finance: 3,
 *   environment: 8,
 *   career: 6,
 *   spiritual: 9,
 * }
 *
 * `transformFormDataToChartData(formData)` will convert this into
 * the shape CustomBalanceWheel expects.
 * ---------------------------------------------------------- */

/**
 * Convert your form’s raw numeric scores (0–10) into chart points.
 * @param {Object} formData Raw scores from the form (see contract above)
 * @returns {Array<{subject:string,value:number,valuePercent:number,fullMark:number}>}
 */
const transformFormDataToChartData = (formData) => {
  if (!formData) return [];

  // Coerce to integers within [0,10] to protect the viz
  const clamp = (n) => Math.max(0, Math.min(10, Number.isFinite(+n) ? +n : 5));

  return [
    {
      subject: "HEALTH",
      value: clamp(formData.health),
      valuePercent: clamp(formData.health) * 10,
      fullMark: 100,
    },
    {
      subject: "RECREATION & FUN",
      value: clamp(formData.recreation),
      valuePercent: clamp(formData.recreation) * 10,
      fullMark: 100,
    },
    {
      subject: "FRIENDS & FAMILY",
      value: clamp(formData.relationships),
      valuePercent: clamp(formData.relationships) * 10,
      fullMark: 100,
    },
    {
      subject: "ROMANCE",
      value: clamp(formData.romance),
      valuePercent: clamp(formData.romance) * 10,
      fullMark: 100,
    },
    {
      subject: "FINANCES",
      value: clamp(formData.finance),
      valuePercent: clamp(formData.finance) * 10,
      fullMark: 100,
    },
    {
      subject: "PHYSICAL ENVIRONMENT",
      value: clamp(formData.environment),
      valuePercent: clamp(formData.environment) * 10,
      fullMark: 100,
    },
    {
      subject: "WORK / CAREER",
      value: clamp(formData.career),
      valuePercent: clamp(formData.career) * 10,
      fullMark: 100,
    },
    {
      subject: "SPIRITUAL & EMOTION",
      value: clamp(formData.spiritual),
      valuePercent: clamp(formData.spiritual) * 10,
      fullMark: 100,
    },
  ];
};

/**
 * Custom SVG Wheel renderer.
 * Loads the static /assets/balancewheel.svg and overlays data geometry.
 *
 * @param {{data: Array<{subject:string,value:number}>}} props
 */
const CustomBalanceWheel = ({ data }) => {
  const [svgContent, setSvgContent] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // (1) Responsive detection
  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Stable angle spec for 8 segments (degrees clockwise, 0 at top)
  // Keep labels EXACTLY matching transform() subjects.
  const angleSpec = useMemo(
    () => [
      { name: "SPIRITUAL & EMOTION", angle: 0 },
      { name: "HEALTH", angle: 45 },
      { name: "RECREATION & FUN", angle: 90 },
      { name: "FRIENDS & FAMILY", angle: 135 },
      { name: "ROMANCE", angle: 180 },
      { name: "FINANCES", angle: 225 },
      { name: "PHYSICAL ENVIRONMENT", angle: 270 },
      { name: "WORK / CAREER", angle: 315 },
    ],
    [],
  );

  // Build map for quick lookup
  const angleByName = useMemo(() => {
    const m = new Map();
    angleSpec.forEach((a) => m.set(a.name, a.angle));
    return m;
  }, [angleSpec]);

  // (2) Fetch, clean, and overlay data
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/assets/Life balance Graph.svg", {
          cache: "force-cache",
        });
        if (!res.ok) throw new Error(`SVG fetch failed: ${res.status}`);
        const svgText = await res.text();

        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svgElement = svgDoc.querySelector("svg");
        if (!svgElement) throw new Error("No <svg> root found");

        // Make the SVG fully responsive
        svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svgElement.setAttribute("width", "100%");
        svgElement.setAttribute("height", "100%");

        // If your base file can contain previous plots, strip them safely.
        // Safer strategy: only remove elements inside a known overlay layer id if present.
        // Fallback: remove typical plotted shapes by color.
        // If you can, add <g id="data-overlay"></g> in the base SVG and only reset that node.
        const overlayId = "data-overlay";
        let overlay = svgElement.querySelector(`#${overlayId}`);
        if (overlay) {
          overlay.innerHTML = "";
        } else {
          overlay = svgDoc.createElementNS("http://www.w3.org/2000/svg", "g");
          overlay.setAttribute("id", overlayId);
          svgElement.appendChild(overlay);
        }

        // Compute geometry
        const centerX = 441; // Adjust to your base SVG center
        const centerY = 437; // Adjust to your base SVG center
        const baseRadius = 100; // Inner radius offset
        const step = 30; // Pixels per score step

        // (a) Project scores to points and ensure stable polygon order (by angle)
        const points = data
          .map((item) => {
            const angleDeg = angleByName.get(item.subject);
            if (angleDeg === undefined) return null;
            // SVG y-axis goes down; subtract 90° to start at top
            const angleRad = ((angleDeg - 90) * Math.PI) / 180;
            const r = baseRadius + item.value * step;
            return {
              subject: item.subject,
              value: item.value,
              angleDeg,
              x: centerX + r * Math.cos(angleRad),
              y: centerY + r * Math.sin(angleRad),
            };
          })
          .filter(Boolean)
          .sort((a, b) => a.angleDeg - b.angleDeg); // maintain ring order

        if (points.length) {
          // (b) Polygon path
          const d =
            points
              .map(
                (p, i) =>
                  `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`,
              )
              .join(" ") + " Z";

          const area = svgDoc.createElementNS(
            "http://www.w3.org/2000/svg",
            "path",
          );
          area.setAttribute("d", d);
          area.setAttribute("fill", "#78DDE8");
          area.setAttribute("fill-opacity", "0.3");
          area.setAttribute("stroke", "#78DDE8");
          area.setAttribute("stroke-width", "3");
          overlay.appendChild(area);

          // (c) Radial connectors
          points.forEach((p) => {
            const line = svgDoc.createElementNS(
              "http://www.w3.org/2000/svg",
              "line",
            );
            line.setAttribute("x1", centerX);
            line.setAttribute("y1", centerY);
            line.setAttribute("x2", p.x);
            line.setAttribute("y2", p.y);
            line.setAttribute("stroke", "#78DDE8");
            line.setAttribute("stroke-width", "1");
            line.setAttribute("stroke-opacity", "0.5");
            overlay.appendChild(line);
          });

          // (d) Point markers + value
          points.forEach((p) => {
            const circle = svgDoc.createElementNS(
              "http://www.w3.org/2000/svg",
              "circle",
            );
            circle.setAttribute("cx", p.x);
            circle.setAttribute("cy", p.y);
            circle.setAttribute("r", isMobile ? "8" : "12");
            circle.setAttribute("fill", "#78DDE8");
            circle.setAttribute("stroke", "#FFFFFF");
            circle.setAttribute("stroke-width", "2");
            overlay.appendChild(circle);

            const text = svgDoc.createElementNS(
              "http://www.w3.org/2000/svg",
              "text",
            );
            text.setAttribute("x", p.x);
            text.setAttribute("y", p.y);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dominant-baseline", "central");
            text.setAttribute("fill", "white");
            text.setAttribute("font-size", isMobile ? "10" : "12");
            text.setAttribute("font-weight", "bold");
            text.textContent = String(p.value);
            overlay.appendChild(text);
          });
        }

        // Serialize to mount
        const serializer = new XMLSerializer();
        setSvgContent(serializer.serializeToString(svgElement));
      } catch (err) {
        console.error("Error loading/building wheel SVG:", err);
        setSvgContent(null);
      }
    })();
  }, [data, isMobile, angleByName]);

  // Loading state
  if (!svgContent) {
    return (
      <div
        className="w-full h-full flex items-center justify-center bg-[#1A4A5C] rounded-full"
        role="status"
        aria-live="polite"
      >
        <p className="text-white">Loading balance wheel…</p>
      </div>
    );
  }

  // NOTE: We render the SVG markup directly. Because this is SVG you control
  // (from /public) + our own overlay, this is safe. Avoid passing user HTML.
  return (
    <div
      className="w-full h-full"
      aria-label="Life balance wheel chart"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

/**
 * BalanceWheel (shell) — prepares data, exposes a ref for capture, and
 * exposes a download callback via `onDownload`.
 *
 * @param {{
 *   formData: Object,
 *   onDownload?: (fn: () => void) => void,
 *   graphRef?: { current: HTMLElement | null }
 * }} props
 */
const BalanceWheel = ({ formData, onDownload, graphRef }) => {
  const [mounted, setMounted] = useState(false);
  const chartRef = useRef(null);

  // Compute chart data once per formData change
  const data = useMemo(
    () => transformFormDataToChartData(formData),
    [formData],
  );

  // Mount when we have form data
  useEffect(() => {
    if (formData) setMounted(true);
  }, [formData]);

  // Forward the ref to parent (for capture)
  useEffect(() => {
    if (graphRef) {
      graphRef.current = chartRef.current;
    }
  }, [graphRef, mounted]);

  // Download handler (simple “just the wheel” capture)
  const downloadChart = async () => {
    if (!chartRef.current) return;
    const { default: html2canvas } = await import("html2canvas"); // lazy, client-only

    // Force a dark background to avoid transparent artifacts
    const originalStyle = chartRef.current.getAttribute("style") || "";
    chartRef.current.setAttribute(
      "style",
      `${originalStyle}; background-color: #1A4A5C !important;`,
    );

    html2canvas(chartRef.current, {
      backgroundColor: "#1A4A5C",
      useCORS: true,
      scale: 2,
    })
      .then((canvas) => {
        const imageData = canvas.toDataURL("image/jpeg", 1.0);
        const link = document.createElement("a");
        link.download = "balance-wheel.jpg";
        link.href = imageData;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((e) => {
        console.error("Error generating chart image:", e);
        alert("Failed to download the chart. Please try again.");
      })
      .finally(() => {
        chartRef.current?.setAttribute("style", originalStyle);
      });
  };

  // Expose the download function outward
  useEffect(() => {
    if (typeof onDownload === "function") onDownload(downloadChart);
    if (typeof window !== "undefined") {
      window.downloadBalanceWheel = downloadChart;
      return () => {
        window.downloadBalanceWheel = null;
      };
    }
  }, [onDownload]);

  if (!mounted || !formData) {
    return (
      <div
        className="w-full h-full flex items-center justify-center p-4"
        role="status"
        aria-live="polite"
      >
        <div className="w-full max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] aspect-square flex items-center justify-center bg-[#1A4A5C] rounded-full">
          <p className="text-white">Loading balance wheel…</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center overflow-auto p-4"
      data-wheel-container="true"
    >
      <div
        ref={chartRef}
        className="relative w-full max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] aspect-square"
        data-balance-wheel="true"
      >
        <CustomBalanceWheel data={data} />
      </div>
    </div>
  );
};

export default BalanceWheel;

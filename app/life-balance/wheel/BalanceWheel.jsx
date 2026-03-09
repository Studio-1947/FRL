"use client";
import { useEffect, useState, useRef, useMemo } from "react";

const transformFormDataToChartData = (formData) => {
  if (!formData) return [];
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

const CustomBalanceWheel = ({ data }) => {
  const [svgContent, setSvgContent] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  const angleByName = useMemo(() => {
    const m = new Map();
    angleSpec.forEach((a) => m.set(a.name, a.angle));
    return m;
  }, [angleSpec]);

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

        svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svgElement.setAttribute("width", "100%");
        svgElement.setAttribute("height", "100%");

        const overlayId = "data-overlay";
        let overlay = svgElement.querySelector(`#${overlayId}`);
        if (overlay) overlay.innerHTML = "";
        else {
          overlay = svgDoc.createElementNS("http://www.w3.org/2000/svg", "g");
          overlay.setAttribute("id", overlayId);
          svgElement.appendChild(overlay);
        }

        const centerX = 441;
        const centerY = 437;
        const baseRadius = 100;
        const step = 30;

        const points = data
          .map((item) => {
            const angleDeg = angleByName.get(item.subject);
            if (angleDeg === undefined) return null;
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
          .sort((a, b) => a.angleDeg - b.angleDeg);

        if (points.length) {
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
          area.setAttribute("fill", "var(--primary)");
          area.setAttribute("fill-opacity", "0.2");
          area.setAttribute("stroke", "var(--primary)");
          area.setAttribute("stroke-width", "3");
          overlay.appendChild(area);

          points.forEach((p) => {
            const line = svgDoc.createElementNS(
              "http://www.w3.org/2000/svg",
              "line",
            );
            line.setAttribute("x1", centerX);
            line.setAttribute("y1", centerY);
            line.setAttribute("x2", p.x);
            line.setAttribute("y2", p.y);
            line.setAttribute("stroke", "var(--primary)");
            line.setAttribute("stroke-width", "1");
            line.setAttribute("stroke-opacity", "0.2");
            overlay.appendChild(line);
          });

          points.forEach((p) => {
            const circle = svgDoc.createElementNS(
              "http://www.w3.org/2000/svg",
              "circle",
            );
            circle.setAttribute("cx", p.x);
            circle.setAttribute("cy", p.y);
            circle.setAttribute("r", isMobile ? "10" : "14");
            circle.setAttribute("fill", "var(--primary)");
            circle.setAttribute("stroke", "var(--background)");
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
            text.setAttribute("fill", "var(--primary-foreground)");
            text.setAttribute("font-size", isMobile ? "10" : "12");
            text.setAttribute("font-weight", "bold");
            text.textContent = String(p.value);
            overlay.appendChild(text);
          });
        }

        const serializer = new XMLSerializer();
        setSvgContent(serializer.serializeToString(svgElement));
      } catch (err) {
        console.error("Error loading/building wheel SVG:", err);
        setSvgContent(null);
      }
    })();
  }, [data, isMobile, angleByName]);

  if (!svgContent) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-muted-foreground animate-pulse">
          Loading wheel analytics…
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full"
      aria-label="Life balance wheel chart"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

const BalanceWheel = ({ formData, onDownload, graphRef }) => {
  const [mounted, setMounted] = useState(false);
  const chartRef = useRef(null);

  const data = useMemo(
    () => transformFormDataToChartData(formData),
    [formData],
  );

  useEffect(() => {
    if (formData) setMounted(true);
  }, [formData]);

  useEffect(() => {
    if (graphRef) graphRef.current = chartRef.current;
  }, [graphRef, mounted]);

  const downloadChart = async () => {
    if (!chartRef.current) return;
    const { default: html2canvas } = await import("html2canvas");
    html2canvas(chartRef.current, {
      backgroundColor: "#FFFFFF",
      useCORS: true,
      scale: 2,
    }).then((canvas) => {
      const imageData = canvas.toDataURL("image/jpeg", 1.0);
      const link = document.createElement("a");
      link.download = "balance-wheel.jpg";
      link.href = imageData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  useEffect(() => {
    if (typeof onDownload === "function") onDownload(downloadChart);
  }, [onDownload]);

  if (!mounted || !formData) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 bg-muted/20 rounded-full animate-pulse">
        <p className="text-muted-foreground font-bold">Initializing...</p>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center p-2"
      data-wheel-container="true"
    >
      <div
        ref={chartRef}
        className="relative w-full h-full"
        data-balance-wheel="true"
      >
        <CustomBalanceWheel data={data} />
      </div>
    </div>
  );
};

export default BalanceWheel;

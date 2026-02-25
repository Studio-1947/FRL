"use client";

import { useState, useRef, useLayoutEffect } from "react";

/**
 * PointTracker: A slider component with a tooltip and custom ticks.
 *
 * @param {object} props - Component props.
 * @param {number} props.initialValue - Starting value of the slider (default: 1).
 * @param {number} props.min - Minimum slider value (default: 1).
 * @param {number} props.max - Maximum slider value (default: 10).
 */
const PointTracker = ({ initialValue = 1, min = 1, max = 10, onChange }) => {
  const [value, setValue] = useState(initialValue); // Slider value

  const takePointToParent = (e) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    if (onChange) onChange(newValue);
  };

  // Refs for elements we need to position or update
  const sliderRef = useRef(null);
  const tooltipRef = useRef(null);
  const ticksRef = useRef(null);

  // Dynamically update tooltip position, tick padding, and track padding
  useLayoutEffect(() => {
    const slider = sliderRef.current;
    const tooltip = tooltipRef.current;
    const ticks = ticksRef.current;
    const track = slider?.parentElement?.querySelector(".custom-track");

    if (!slider || !tooltip || !ticks || !track) return;

    // Get the slider thumb size from CSS variable (default fallback: 20px)
    const thumbSize =
      parseFloat(getComputedStyle(slider).getPropertyValue("--thumb-size")) ||
      20;

    // Add horizontal padding to tick container so the first and last tick match thumb edges
    ticks.style.paddingLeft = `${thumbSize / 2}px`;
    ticks.style.paddingRight = `${thumbSize / 2}px`;

    // Also set left/right spacing on the custom track to match the ticks
    track.style.left = `${thumbSize / 2}px`;
    track.style.right = `${thumbSize / 2}px`;

    // Calculate percentage position of current value between min and max
    const percent = (value - min) / (max - min);
    const sliderWidth = slider.offsetWidth;

    // Position the tooltip centered above the slider thumb
    const thumbCenter = percent * (sliderWidth - thumbSize) + thumbSize / 2;
    tooltip.style.left = `calc(${thumbCenter}px - ${
      tooltip.offsetWidth / 2
    }px)`;
  }, [value, min, max]);

  return (
    <div className="w-full max-w-lg flex items-center justify-center gap-4 px-6 py-6">
      {/* Minimum value label */}
      <span className="font-semibold text-foreground dark:text-white transition-colors duration-300">
        {min}
      </span>

      <div className="relative w-full flex items-center">
        {/* Custom visual track behind the input */}
        <div className="custom-track absolute top-1/2 h-[2px] bg-primary/20 dark:bg-[#A3C2CA] transition-colors duration-300 -translate-y-1/2 z-0 pointer-events-none" />

        {/* Tooltip that shows current value */}
        <div
          ref={tooltipRef}
          className="absolute bg-popover text-popover-foreground dark:bg-white dark:text-[#1C6671] border border-border dark:border-transparent font-bold text-sm px-2 py-0.5 rounded shadow-lg -top-5 z-20 transition-colors duration-300"
        >
          <span className="relative z-10">{value}</span>
          {/* Tooltip triangle below the box */}
          <div className="absolute w-3 h-3 bg-popover border-r border-b border-border dark:border-transparent dark:bg-white -bottom-0.5 left-1/2 -translate-x-1/2 rotate-45 transition-colors duration-300" />
        </div>

        {/* Slider input */}
        <input
          ref={sliderRef}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={takePointToParent}
          className="w-full slider-custom relative z-10"
        />

        {/* Tick marks below the slider */}
        <div
          ref={ticksRef}
          className="absolute flex justify-between items-center w-full pointer-events-none z-20"
        >
          {Array.from({ length: max - min + 1 }).map((_, index) =>
            index === 0 ? (
              // First tick (arrow)
              <div
                key={index}
                className="w-0 h-2 border-y-[5px] border-y-transparent border-l-[12px] border-r-primary/20 dark:border-r-[#A3C2CA] transition-colors duration-300"
              />
            ) : index === max - min ? (
              // Last tick (circle)
              <div
                key={index}
                className="w-2.5 h-2.5 bg-primary/20 dark:bg-[#A3C2CA] rounded-full transition-colors duration-300"
              />
            ) : (
              // Middle ticks (thin vertical lines)
              <div
                key={index}
                className="h-[8px] w-[0.8px] bg-primary/20 dark:bg-[#A3C2CA] rounded-full transition-colors duration-300"
              />
            ),
          )}
        </div>
      </div>

      {/* Maximum value label */}
      <span className="font-semibold text-foreground dark:text-white transition-colors duration-300">
        {max}
      </span>
    </div>
  );
};

export default PointTracker;

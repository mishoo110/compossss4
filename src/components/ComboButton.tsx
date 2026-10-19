import React, { useRef } from 'react';
import { motion, useAnimation } from 'motion/react';

interface ComboButtonProps {
  combo: number;
  timerProgress: number; // 0 to 1
  isTimerActive: boolean;
  onTap: (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
}

export const ComboButton: React.FC<ComboButtonProps> = ({
  combo,
  timerProgress,
  isTimerActive,
  onTap,
}) => {
  // Animation control specifically for the "Combo" inner circle jitter
  const comboJitterControls = useAnimation();
  const ringRef = useRef<SVGSVGElement>(null);

  // Geometry dimensions
  const ringSize = 250;
  const strokeWidth = 9;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Progress countdown: sweeps when active
  const strokeDashoffset = circumference * (1 - (isTimerActive ? timerProgress : 1));

  // Small top circle diameter (numbers circle)
  const badgeSize = 68;
  // Main center circle diameter
  const innerSize = 196;

  const handleClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // Subtle snappy tremor/jitter on the Combo circle ONLY (numbers remain completely steady)
    comboJitterControls.start({
      x: [0, -3, 3, -2, 2, -1, 1, 0],
      y: [0, 2, -2, 1.5, -1.5, 0.5, 0],
      scale: [1, 0.95, 1.02, 0.98, 1],
      transition: { duration: 0.13, ease: 'easeInOut' },
    });
    onTap(e);
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-center select-none touch-manipulation cursor-pointer"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Combo: ${combo}`}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleClick(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }}
    >
      {/* 
        1. Top Number Circle:
        - Completely steady (no shake/vibration on click)
        - Separated from the outer ring line with a clear gap (منفصلة عن الخط)
      */}
      <div
        className="flex items-center justify-center rounded-full pointer-events-none mb-4.5"
        style={{
          width: badgeSize,
          height: badgeSize,
          backgroundColor: '#fa2855', // Pure flat solid red without shadow/illusion
        }}
      >
        <span 
          className="font-combo italic font-black text-3xl sm:text-4xl text-white tracking-tight select-none tabular-nums"
        >
          {combo}
        </span>
      </div>

      {/* 
        2. Ring & Main Combo Container
      */}
      <div 
        className="relative flex items-center justify-center"
        style={{
          width: ringSize,
          height: ringSize,
        }}
      >
        {/* Outer Circular Timer Ring */}
        <svg
          ref={ringRef}
          width={ringSize}
          height={ringSize}
          viewBox={`0 0 ${ringSize} ${ringSize}`}
          className="absolute inset-0 -rotate-90 pointer-events-none"
        >
          {/* Background track (Dark ring) */}
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            stroke="#0a0a0c"
            strokeWidth={strokeWidth}
          />

          {/* Active Pink/Red Progress Stroke */}
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            stroke="#fa2855"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-75 ease-linear"
          />
        </svg>

        {/* 
          3. Center Main Circle ("Combo" button body):
          - Only this element has the subtle jitter/tremor (رعشة خفيفة) when tapped!
          - Pure flat red color without inner shadow or sheen
        */}
        <motion.div 
          animate={comboJitterControls}
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: innerSize,
            height: innerSize,
            backgroundColor: '#fa2855', // Pure flat solid color matching the video
          }}
        >
          {/* Text: "Combo" in bold italic white sans-serif font */}
          <span 
            className="font-combo italic font-extrabold text-4xl sm:text-5xl text-white tracking-normal select-none"
          >
            Combo
          </span>
        </motion.div>
      </div>
    </div>
  );
};

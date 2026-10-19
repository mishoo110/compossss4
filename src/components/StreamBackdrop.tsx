import React, { useEffect, useState } from 'react';
import type { BackgroundTheme } from '../types/combo';

interface StreamBackdropProps {
  theme: BackgroundTheme;
}

interface FloatingStreamHeart {
  id: number;
  x: number;
  color: string;
  size: number;
  duration: number;
}

const HEART_COLORS = ['#ff2b54', '#ff758c', '#ff5400', '#ffd166', '#a55eea', '#26de81'];

export const StreamBackdrop: React.FC<StreamBackdropProps> = ({ theme }) => {
  const [streamHearts, setStreamHearts] = useState<FloatingStreamHeart[]>([]);

  // Periodically generate floating stream hearts in livestream mode
  useEffect(() => {
    if (theme !== 'livestream') {
      setStreamHearts([]);
      return;
    }

    const interval = setInterval(() => {
      const newHeart: FloatingStreamHeart = {
        id: Date.now() + Math.random(),
        x: Math.random() * 80 + 10, // 10% to 90%
        color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
        size: Math.floor(Math.random() * 16) + 18,
        duration: Math.random() * 2 + 2.5,
      };

      setStreamHearts((prev) => [...prev.slice(-15), newHeart]);
    }, 450);

    return () => clearInterval(interval);
  }, [theme]);

  if (theme === 'checkerboard') {
    return <div className="absolute inset-0 checkerboard-pattern" />;
  }

  if (theme === 'checkerboard-light') {
    return <div className="absolute inset-0 checkerboard-light" />;
  }

  if (theme === 'checkerboard-dark') {
    return <div className="absolute inset-0 checkerboard-dark" />;
  }

  if (theme === 'dark-studio') {
    return (
      <div className="absolute inset-0 bg-[#0d0f14] overflow-hidden">
        {/* Subtle radial lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
      </div>
    );
  }

  if (theme === 'clean') {
    return (
      <div className="absolute inset-0 bg-slate-100 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-400/5 rounded-full blur-[100px] pointer-events-none" />
      </div>
    );
  }

  // Livestream theme (simulating a dynamic TikTok / Live Broadcast screen)
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-[#121624] to-[#0a0d16] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-rose-600/15 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Simulated Live Stream UI elements on the side */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-white/80 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold text-white tracking-wider">LIVE</span>
          <span className="text-white/60">·</span>
          <span>14.2K مشاهد</span>
        </div>
        <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-rose-300 font-semibold">
          🔥 معركة التحدي (PK Battle)
        </div>
      </div>

      {/* Floating livestream hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {streamHearts.map((h) => (
          <div
            key={h.id}
            style={{
              position: 'absolute',
              left: `${h.x}%`,
              bottom: '-20px',
              color: h.color,
              fontSize: `${h.size}px`,
              animation: `floatUp ${h.duration}s ease-in forwards`,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.6) rotate(0deg);
            opacity: 0.9;
          }
          50% {
            transform: translateY(-40vh) scale(1.1) rotate(15deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-85vh) scale(0.8) rotate(-15deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

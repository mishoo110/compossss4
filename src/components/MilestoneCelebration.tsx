import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface MilestoneCelebrationProps {
  milestone: {
    combo: number;
    title: string;
    sub: string;
  } | null;
}

export const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({ milestone }) => {
  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          key={milestone.combo}
          initial={{ opacity: 0, scale: 0.5, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.2, y: -30 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="absolute top-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center"
        >
          <div className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 text-white px-6 py-2.5 rounded-2xl shadow-[0_10px_30px_rgba(238,37,75,0.6)] border-2 border-white/40 flex flex-col items-center gap-0.5">
            <span className="font-combo italic font-black text-2xl md:text-3xl tracking-wider uppercase drop-shadow">
              {milestone.title}
            </span>
            <span className="text-xs md:text-sm font-bold text-amber-200">
              {milestone.sub}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

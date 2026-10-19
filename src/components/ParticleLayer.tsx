import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { FloatingParticle } from '../types/combo';

interface ParticleLayerProps {
  particles: FloatingParticle[];
}

export const ParticleLayer: React.FC<ParticleLayerProps> = ({ particles }) => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              opacity: 1,
              scale: 0.6,
              x: p.x,
              y: p.y,
            }}
            animate={{
              opacity: 0,
              scale: 1.4,
              x: p.x + (Math.random() - 0.5) * 60,
              y: p.y - 80 - Math.random() * 40,
              rotate: p.rotation,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 select-none"
          >
            {p.type === 'plus' && (
              <span className="font-combo font-extrabold text-2xl md:text-3xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] stroke-white">
                {p.text || '+1'}
              </span>
            )}
            {p.type === 'heart' && (
              <span className="text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                ❤️
              </span>
            )}
            {p.type === 'star' && (
              <span className="text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                ✨
              </span>
            )}
            {p.type === 'fire' && (
              <span className="text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                🔥
              </span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

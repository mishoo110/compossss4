import React from 'react';
import { Flame, Trophy, Zap, MousePointerClick } from 'lucide-react';
import type { ComboStatsData } from '../types/combo';

interface ComboStatsProps {
  stats: ComboStatsData;
}

export const ComboStats: React.FC<ComboStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl w-full mx-auto px-4 z-10">
      {/* Current Combo */}
      <div className="bg-black/45 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
          <Flame className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-medium text-white/70">الكومبو الحالي</div>
          <div className="text-xl font-bold font-combo text-white tabular-nums truncate">
            {stats.currentCombo}
          </div>
        </div>
      </div>

      {/* Highest Combo Record */}
      <div className="bg-black/45 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <Trophy className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-medium text-white/70">أعلى رقم قياسي</div>
          <div className="text-xl font-bold font-combo text-amber-300 tabular-nums truncate">
            {stats.maxCombo}
          </div>
        </div>
      </div>

      {/* Clicks Per Second (CPS) */}
      <div className="bg-black/45 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-medium text-white/70">السرعة (نقرة/ث)</div>
          <div className="text-xl font-bold font-combo text-cyan-300 tabular-nums truncate">
            {stats.currentCps.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Total Clicks */}
      <div className="bg-black/45 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <MousePointerClick className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-medium text-white/70">إجمالي النقرات</div>
          <div className="text-xl font-bold font-combo text-emerald-300 tabular-nums truncate">
            {stats.totalClicks}
          </div>
        </div>
      </div>
    </div>
  );
};

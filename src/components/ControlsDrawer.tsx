import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Clock, 
  Infinity as InfinityIcon, 
  Sparkles, 
  Play, 
  Square,
  Palette
} from 'lucide-react';
import type { ComboSettings, BackgroundTheme } from '../types/combo';

interface ControlsProps {
  settings: ComboSettings;
  onUpdateSettings: (newSettings: Partial<ComboSettings>) => void;
  onReset: () => void;
  isAutoTapping: boolean;
  onToggleAutoTap: () => void;
}

const THEME_OPTIONS: { id: BackgroundTheme; label: string }[] = [
  { id: 'checkerboard', label: 'مربعات شفافة (الصورة الأصلية)' },
  { id: 'livestream', label: 'بث مباشر (Live Stream)' },
  { id: 'dark-studio', label: 'ستوديو مظلم (Dark)' },
  { id: 'checkerboard-dark', label: 'مربعات داكنة' },
  { id: 'clean', label: 'أبيض بسيط (Light)' },
];

export const ControlsDrawer: React.FC<ControlsProps> = ({
  settings,
  onUpdateSettings,
  onReset,
  isAutoTapping,
  onToggleAutoTap,
}) => {
  return (
    <div className="max-w-xl w-full mx-auto px-4 z-10 flex flex-col gap-3">
      {/* Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg text-white">
        {/* Sound Toggle */}
        <button
          onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            settings.soundEnabled 
              ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30' 
              : 'bg-white/5 text-white/50 hover:bg-white/10'
          }`}
          title={settings.soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
        >
          {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{settings.soundEnabled ? 'الصوت مفعّل' : 'مكتوم'}</span>
        </button>

        {/* Timer Mode Toggle */}
        <button
          onClick={() => 
            onUpdateSettings({ 
              timerMode: settings.timerMode === 'countdown' ? 'infinite' : 'countdown' 
            })
          }
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            settings.timerMode === 'countdown'
              ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
              : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'
          }`}
          title="تغيير نمط المؤقت"
        >
          {settings.timerMode === 'countdown' ? (
            <>
              <Clock className="w-4 h-4" />
              <span>مؤقت تنازلي (3 ثوانٍ)</span>
            </>
          ) : (
            <>
              <InfinityIcon className="w-4 h-4" />
              <span>مستمر (بدون مؤقت)</span>
            </>
          )}
        </button>

        {/* Auto-Tap Test Button */}
        <button
          onClick={onToggleAutoTap}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            isAutoTapping
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
          }`}
          title="تشغيل النقر التلقائي السريع"
        >
          {isAutoTapping ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isAutoTapping ? 'إيقاف النقر' : 'نقر تلقائي'}</span>
        </button>

        {/* Reset Combo Button */}
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-rose-500/20 text-white/70 hover:text-rose-300 transition-all cursor-pointer"
          title="إعادة ضبط العداد إلى 1"
        >
          <RotateCcw className="w-4 h-4" />
          <span>تصفير العداد</span>
        </button>
      </div>

      {/* Background Selector & Instructions */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-xs text-white/70">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-rose-400" />
          <span className="font-semibold text-white/90">خلفية الشاشة:</span>
          <select
            value={settings.theme}
            onChange={(e) => onUpdateSettings({ theme: e.target.value as BackgroundTheme })}
            className="bg-zinc-800 text-white text-xs px-2.5 py-1.5 rounded-lg border border-white/15 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
          >
            {THEME_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id} className="bg-zinc-900 text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-white/60">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>يمكنك أيضاً الضغط على زر <strong className="text-white">مسافة (Space)</strong> في الكيبورد!</span>
        </div>
      </div>
    </div>
  );
};

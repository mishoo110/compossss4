export type BackgroundTheme = 'checkerboard' | 'checkerboard-light' | 'checkerboard-dark' | 'livestream' | 'dark-studio' | 'clean';

export interface FloatingParticle {
  id: string;
  x: number;
  y: number;
  type: 'plus' | 'heart' | 'star' | 'fire';
  text?: string;
  color?: string;
  rotation: number;
}

export interface ComboStatsData {
  currentCombo: number;
  maxCombo: number;
  totalClicks: number;
  currentCps: number;
  peakCps: number;
}

export interface ComboSettings {
  soundEnabled: boolean;
  timerMode: 'countdown' | 'infinite';
  timerDurationSeconds: number; // e.g. 3 seconds
  haptics: boolean;
  theme: BackgroundTheme;
  autoTapSpeed: number; // taps per sec when auto-tapping
}

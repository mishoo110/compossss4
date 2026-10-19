import React, { useState } from 'react';
import { ComboCanvas, type ChromaMode } from './components/ComboCanvas';
import { Download, RotateCcw, CheckCircle2, Video, Sparkles } from 'lucide-react';

export default function App() {
  const [chromaMode, setChromaMode] = useState<ChromaMode>('green');
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [finalScore, setFinalScore] = useState<number>(1);
  const [sessionKey, setSessionKey] = useState<number>(0);
  const [recordedMode, setRecordedMode] = useState<ChromaMode>('green');

  // Called when progress ring finishes its sweep and combo disappears
  const handleFinish = (blob: Blob, score: number, mode: ChromaMode) => {
    setFinalScore(score);
    setRecordedMode(mode);
    if (blob && blob.size > 0) {
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    }
    setIsFinished(true);
  };

  // Restart / New recording
  const handleRestart = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl(null);
    }
    setIsFinished(false);
    setSessionKey((prev) => prev + 1);
  };

  // Download the recorded video file
  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `combo_${finalScore}_${recordedMode}_chroma.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getBackgroundStyle = () => {
    if (chromaMode === 'green') return '#00ff00';
    if (chromaMode === 'black') return '#000000';
    return '#111318'; // dark backdrop for transparent mode preview
  };

  return (
    <div 
      className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-hidden select-none transition-colors duration-200"
      style={{ backgroundColor: getBackgroundStyle() }}
    >
      {/* Top Bar: Chroma Mode Selector (Discreet & Clean) */}
      {!isFinished && (
        <header className="relative z-20 w-full pt-4 px-4 flex items-center justify-center">
          <div className="flex items-center gap-1.5 p-1 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
            <button
              onClick={() => setChromaMode('green')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                chromaMode === 'green'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black/30" />
              <span>كروما خضراء لـ CapCut</span>
            </button>

            <button
              onClick={() => setChromaMode('transparent')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                chromaMode === 'transparent'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 border border-black/30" />
              <span>خلفية شفافة (Alpha)</span>
            </button>

            <button
              onClick={() => setChromaMode('black')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                chromaMode === 'black'
                  ? 'bg-zinc-800 text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-black border border-white/40" />
              <span>كروما سوداء</span>
            </button>
          </div>
        </header>
      )}

      {/* Main Center Stage: Live Combo Button on chosen Chroma */}
      {!isFinished ? (
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center">
          <ComboCanvas 
            key={`${sessionKey}-${chromaMode}`} 
            chromaMode={chromaMode} 
            onFinish={handleFinish} 
          />
        </main>
      ) : (
        /* Finished State: The Combo has disappeared, Download Screen appears */
        <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-md w-full mx-auto text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-black/85 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-2xl w-full flex flex-col items-center">
            {/* Success icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mb-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-black text-white mb-1">
              تم تسجيل فيديو الكومبو بنجاح!
            </h2>
            <p className="text-xs text-zinc-400 mb-4">
              الرقم المحقق: <strong className="text-rose-400 font-combo text-lg font-bold">{finalScore}</strong>
              <span className="mx-2 text-zinc-600">·</span>
              نوع الكروما: <strong className="text-emerald-400 font-semibold">{recordedMode === 'green' ? 'كروما خضراء' : recordedMode === 'transparent' ? 'شفافة' : 'سوداء'}</strong>
            </p>

            {/* Video Preview */}
            {videoUrl && (
              <div 
                className="w-48 h-56 rounded-2xl overflow-hidden border border-white/20 mb-4 shadow-2xl flex items-center justify-center"
                style={{ 
                  backgroundColor: recordedMode === 'green' ? '#00ff00' : recordedMode === 'black' ? '#000000' : '#1a1d24' 
                }}
              >
                <video
                  src={videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Download Button */}
            {videoUrl && (
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white bg-[#fa2855] hover:bg-[#e0204a] active:scale-98 transition-all shadow-[0_4px_20px_rgba(250,40,85,0.4)] cursor-pointer mb-3"
              >
                <Download className="w-5 h-5" />
                <span>تحميل فيديو الكومبو (.webm)</span>
              </button>
            )}

            {/* CapCut Quick Tip */}
            <div className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-right text-[11px] text-zinc-300 mb-4 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>طريقة الاستخدام في كاب كات (CapCut):</span>
              </div>
              <p className="text-zinc-400">
                أضف الفيديو كـ <strong>Overlay (تراكب)</strong> ➔ اضغط <strong>Cutout (اقتطاع)</strong> ➔ اختر <strong>Chroma Key (مفتاح الكروما)</strong> ➔ حدد اللون الأخضر واضبط الكثافة (Intensity) بين <strong>10 و 15</strong> لتفريغ ناصع ونظيف بدون أي أثر أسود!
              </p>
            </div>

            {/* Start New Combo Button */}
            <button
              onClick={handleRestart}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:text-white transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تسجيل كومبو جديد</span>
            </button>
          </div>
        </main>
      )}

      {/* Footer spacer */}
      <footer className="h-4" />
    </div>
  );
}

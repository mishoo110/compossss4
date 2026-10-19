import React, { useRef, useEffect, useState, useCallback } from 'react';

export type ChromaMode = 'green' | 'transparent' | 'black';

interface ComboCanvasProps {
  chromaMode: ChromaMode;
  onFinish: (videoBlob: Blob, finalCount: number, mode: ChromaMode) => void;
}

export const ComboCanvas: React.FC<ComboCanvasProps> = ({ chromaMode, onFinish }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // hasStarted tracks whether the first tap has occurred
  // "عاوز صفحه البدء تكون من اول الكوبو مفيش رقم لم ادوس يظهر الرقم وكل ما ادوس يكمل"
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const hasStartedRef = useRef<boolean>(false);

  const [combo, setCombo] = useState<number>(0);
  const comboRef = useRef<number>(0);
  comboRef.current = combo;

  const isTimerActiveRef = useRef<boolean>(false);
  const lastTapTimeRef = useRef<number>(Date.now());
  const timerDurationMs = 3000; // 3 seconds timer countdown

  // Jitter state for "Combo" text & inner circle only
  const isJitteringRef = useRef<boolean>(false);
  const jitterEndTimeRef = useRef<number>(0);

  // MediaRecorder refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const isRecordingRef = useRef<boolean>(false);
  const hasFinishedRef = useRef<boolean>(false);

  // Setup MediaRecorder from canvas stream
  const startRecording = useCallback(() => {
    if (isRecordingRef.current || !canvasRef.current) return;
    try {
      const stream = canvasRef.current.captureStream(60); // 60 FPS
      let mimeType = 'video/webm;codecs=vp9';
      if (typeof MediaRecorder !== 'undefined') {
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/mp4';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
              mimeType = '';
            }
          }
        }
        const options = mimeType ? { mimeType } : undefined;
        const recorder = new MediaRecorder(stream, options);

        recordedChunksRef.current = [];
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blobType = mimeType || 'video/webm';
          const completeBlob = new Blob(recordedChunksRef.current, { type: blobType });
          onFinish(completeBlob, comboRef.current, chromaMode);
        };

        recorder.start(100);
        mediaRecorderRef.current = recorder;
        isRecordingRef.current = true;
      }
    } catch (err) {
      console.warn('MediaRecorder not available or failed:', err);
    }
  }, [onFinish, chromaMode]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      const emptyBlob = new Blob([], { type: 'video/webm' });
      onFinish(emptyBlob, comboRef.current, chromaMode);
    }
    isRecordingRef.current = false;
  }, [onFinish, chromaMode]);

  // Tap handler
  const handleTap = useCallback(() => {
    if (hasFinishedRef.current) return;

    if (!hasStartedRef.current) {
      // First click: Start with 1, show top number circle, begin recording
      hasStartedRef.current = true;
      setHasStarted(true);
      setCombo(1);
      comboRef.current = 1;
      startRecording();
    } else {
      // Subsequent clicks: Continue 2, 3, 4, 5...
      setCombo((prev) => {
        const next = prev + 1;
        comboRef.current = next;
        return next;
      });
    }

    lastTapTimeRef.current = Date.now();
    isTimerActiveRef.current = true;

    // Subtle jitter on "Combo" text & inner circle only
    isJitteringRef.current = true;
    jitterEndTimeRef.current = Date.now() + 130;
  }, [startRecording]);

  // Main Canvas Render Loop (60 FPS)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas resolution (2x for crisp rendering on high-DPI screens)
    const W = 600;
    const H = 760;
    canvas.width = W;
    canvas.height = H;

    let animId: number;

    const render = () => {
      const now = Date.now();

      // 1. Clear background based on chosen Chroma mode (Green / Transparent / Black)
      if (chromaMode === 'green') {
        // Pure Chroma Green (#00FF00) - 100% clean cutout in CapCut with 0 black halo
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(0, 0, W, H);
      } else if (chromaMode === 'transparent') {
        // Transparent Alpha (no background at all)
        ctx.clearRect(0, 0, W, H);
      } else {
        // Pure Black
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, W, H);
      }

      // 2. Jitter offset for "Combo" circle only
      let jX = 0;
      let jY = 0;
      if (isJitteringRef.current) {
        if (now < jitterEndTimeRef.current) {
          jX = (Math.random() - 0.5) * 8;
          jY = (Math.random() - 0.5) * 6;
        } else {
          isJitteringRef.current = false;
        }
      }

      // 3. Calculate timer countdown progress
      let progress = 1;
      if (isTimerActiveRef.current) {
        const elapsed = now - lastTapTimeRef.current;
        progress = Math.max(0, 1 - elapsed / timerDurationMs);

        // When progress hits 0 (reaches the end of the ring sweep)
        if (progress <= 0 && !hasFinishedRef.current) {
          hasFinishedRef.current = true;
          isTimerActiveRef.current = false;
          // Stop recording and trigger disappear
          stopRecording();
          return;
        }
      }

      // ----------------------------------------------------
      // DRAW 1: Top Number Circle
      // ONLY shown once user has clicked (لم ادوس يظهر الرقم)
      // ----------------------------------------------------
      if (hasStartedRef.current && comboRef.current > 0) {
        const topBadgeX = W / 2;
        const topBadgeY = 90;
        const topBadgeRadius = 66;

        ctx.save();
        ctx.beginPath();
        ctx.arc(topBadgeX, topBadgeY, topBadgeRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#fa2855'; // Pure flat red
        ctx.fill();

        // Draw number inside top circle
        ctx.fillStyle = '#ffffff';
        ctx.font = 'italic 900 66px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(comboRef.current.toString(), topBadgeX, topBadgeY + 4);
        ctx.restore();
      }

      // ----------------------------------------------------
      // DRAW 2: Outer Circular Timer Ring
      // Sweeps from the right side clockwise
      // ----------------------------------------------------
      const ringCenterX = W / 2;
      const ringCenterY = 470;
      const ringRadius = 236;
      const ringStrokeWidth = 18;

      // Dark background track of ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(ringCenterX, ringCenterY, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = '#0a0a0c';
      ctx.lineWidth = ringStrokeWidth;
      ctx.stroke();

      // Active Pink/Red Progress Arc (sweeps clockwise starting from right)
      if (progress > 0) {
        ctx.beginPath();
        if (!isTimerActiveRef.current) {
          // Full complete circle before tapping
          ctx.arc(ringCenterX, ringCenterY, ringRadius, 0, Math.PI * 2, false);
        } else {
          // Sweeps clockwise starting from the right:
          const startAngle = -Math.PI / 2 + (1 - progress) * (Math.PI * 2);
          const endAngle = -Math.PI / 2 + Math.PI * 2;
          ctx.arc(ringCenterX, ringCenterY, ringRadius, startAngle, endAngle, false);
        }
        ctx.strokeStyle = '#fa2855';
        ctx.lineWidth = ringStrokeWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
      ctx.restore();

      // ----------------------------------------------------
      // DRAW 3: Center Main Circle ("Combo") with subtle Jitter
      // ----------------------------------------------------
      const comboCenterX = ringCenterX + jX;
      const comboCenterY = ringCenterY + jY;
      const comboRadius = 188;

      ctx.save();
      ctx.beginPath();
      ctx.arc(comboCenterX, comboCenterY, comboRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#fa2855'; // Pure flat red without inner shadow
      ctx.fill();

      // Text: "Combo"
      ctx.fillStyle = '#ffffff';
      ctx.font = 'italic 900 88px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Combo', comboCenterX, comboCenterY + 4);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [stopRecording, chromaMode]);

  // Keyboard shortcut: Spacebar or Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTap]);

  return (
    <div 
      className="relative flex items-center justify-center cursor-pointer select-none"
      onClick={handleTap}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: 300,
          height: 380,
          backgroundColor: chromaMode === 'green' ? '#00ff00' : chromaMode === 'black' ? '#000000' : 'transparent',
        }}
        className="touch-manipulation rounded-xl"
      />
    </div>
  );
};

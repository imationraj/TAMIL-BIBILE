import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 5000; // 5 seconds display as requested
    const intervalTime = 50;
    const increment = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 200);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      id="splash-screen-container"
      onClick={onComplete}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a111e] text-slate-100 px-6 cursor-pointer select-none overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none -top-12 animate-pulse" />
      <div className="absolute w-80 h-80 rounded-full bg-amber-400/5 blur-2xl pointer-events-none" />

      {/* Main Content Card matching the image */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        {/* Glowing Amber Cross */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Radial amber glow around the cross */}
          <div className="absolute w-32 h-32 rounded-full bg-amber-500/30 blur-2xl" />
          <div className="absolute w-20 h-20 rounded-full bg-amber-400/40 blur-xl" />

          {/* Bold Rounded Cross Shape */}
          <svg
            className="w-24 h-28 text-[#f7b036] drop-shadow-[0_0_25px_rgba(247,176,54,0.7)]"
            viewBox="0 0 100 120"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Vertical beam */}
            <rect x="36" y="6" width="28" height="108" rx="14" />
            {/* Horizontal beam */}
            <rect x="8" y="34" width="84" height="28" rx="14" />
          </svg>
        </div>

        {/* English Title */}
        <h1
          id="splash-title-en"
          className="text-xl sm:text-2xl font-black tracking-wider text-[#f7b036] uppercase mb-2 font-['Plus_Jakarta_Sans',sans-serif]"
        >
          JESUS CHRIST'S LOVING MINISTRY
        </h1>

        {/* Tamil Subtitle */}
        <p
          id="splash-title-ta"
          className="text-base sm:text-lg text-slate-200 font-medium tracking-normal mb-1.5 opacity-90"
        >
          இயேசு கிறிஸ்துவின் அன்பின் ஊழியம்
        </p>

        {/* Author Credit */}
        <p
          id="splash-author"
          className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-slate-400 uppercase mb-8"
        >
          BY P. PETHURAJ
        </p>

        {/* Loading Progress Bar matching the screenshot */}
        <div className="w-56 sm:w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden relative shadow-inner mb-6">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-emerald-300 rounded-full transition-all duration-75 ease-out shadow-[0_0_10px_rgba(52,211,153,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Subtle Skip Prompt */}
        <button
          id="splash-skip-button"
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className="text-xs text-slate-400 hover:text-amber-300 transition-colors py-1.5 px-4 rounded-full border border-slate-700/60 bg-slate-800/40 hover:bg-slate-800 backdrop-blur-sm"
        >
          தொடங்க தட்டவும் (Tap to start)
        </button>
      </div>

      {/* Footer subtle brand */}
      <div className="absolute bottom-6 text-center text-[11px] text-slate-500">
        Tamil Bible Reading Tracker • Offline Ready
      </div>
    </div>
  );
};

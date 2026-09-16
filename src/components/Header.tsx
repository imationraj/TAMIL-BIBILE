import React from 'react';
import { ViewMode } from '../types';
import { Flame, BookOpen, Calendar, BarChart3, Info, Home, BookMarked, Trophy } from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  currentStreak: number;
  todayVersesRead: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  currentStreak,
  todayVersesRead
}) => {
  const navItems: { id: ViewMode; labelTa: string; labelEn: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', labelTa: 'முகப்பு', labelEn: 'Home', icon: Home },
    { id: 'books', labelTa: 'புத்தகங்கள்', labelEn: 'Books', icon: BookOpen },
    { id: 'bible', labelTa: 'வேதாகமம்', labelEn: 'Bible', icon: BookMarked },
    { id: 'plans', labelTa: 'திட்டம்', labelEn: 'Plans', icon: Calendar },
    { id: 'reports', labelTa: 'தரவரிசை (Top 25)', labelEn: 'Rank & Report', icon: Trophy },
    { id: 'about', labelTa: 'ஊழியம்', labelEn: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 transition-all">
      {/* Top Main Branding Bar */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5">
        <div className="flex flex-col sm:relative sm:flex-row sm:items-center sm:justify-center">
          {/* Centered Big Heading */}
          <div className="w-full text-center flex flex-col items-center justify-center py-0.5">
            <button
              id="header-brand-button"
              onClick={() => onNavigate('dashboard')}
              className="inline-flex flex-col items-center justify-center focus:outline-none group text-center cursor-pointer"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.4)] group-hover:scale-105 transition-transform flex-shrink-0">
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <rect x="10" y="2" width="4" height="20" rx="1.5" />
                    <rect x="4" y="6" width="16" height="4" rx="1.5" />
                  </svg>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-wide leading-tight group-hover:text-amber-400 transition-colors">
                  Tamil Bible Reading
                </h1>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-300 tracking-normal mt-0.5 font-['Mukta_Malar',sans-serif]">
                தமிழ் பைபிள் தின வாசிப்பு
              </p>
              <p className="text-xs sm:text-sm font-bold text-amber-400 tracking-normal mt-0.5 font-['Mukta_Malar',sans-serif]">
                இயேசு கிறிஸ்துவின் அன்பின் ஊழியம்
              </p>
            </button>
          </div>

          {/* Badges: Today Verses & Streak */}
          <div className="flex items-center justify-center sm:justify-end gap-2 mt-1 sm:mt-0 sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2">
            {/* Today's reading count badge */}
            <div
              id="header-today-badge"
              title="இன்று வாசித்த வசனங்கள்"
              className="flex items-center gap-1 bg-slate-800/90 border border-slate-700/80 rounded-full px-2.5 py-1 text-xs text-slate-200 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-emerald-400">{todayVersesRead}</span>
              <span className="text-[11px] text-slate-400">வசனம்</span>
            </div>

            {/* Streak badge */}
            <div
              id="header-streak-badge"
              title={`தொடர் வாசிப்பு: ${currentStreak} நாட்கள்`}
              className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/40 rounded-full px-2.5 py-1 text-xs text-amber-400 font-bold shadow-sm"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{currentStreak}</span>
              <span className="text-[10px] text-amber-300/90">நாள்</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Tabs */}
      <nav className="hidden sm:block border-t border-slate-800/60 bg-slate-950/40">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || 
              (item.id === 'books' && (currentView === 'chapters' || currentView === 'verses'));

            return (
              <button
                key={item.id}
                id={`nav-desktop-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
                  isActive
                    ? 'border-amber-400 text-amber-400 bg-slate-800/60'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.labelTa}</span>
                <span className="text-[10px] opacity-70">({item.labelEn})</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar (Fixed at bottom for easy thumb access) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/98 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 shadow-2xl safe-area-bottom">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || 
              (item.id === 'books' && (currentView === 'chapters' || currentView === 'verses'));

            return (
              <button
                key={item.id}
                id={`nav-mobile-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all min-w-[56px] ${
                  isActive
                    ? 'text-amber-400 font-bold bg-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'scale-110 text-amber-400' : ''}`} />
                <span className="text-[10px] leading-tight tracking-tight">{item.labelTa}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

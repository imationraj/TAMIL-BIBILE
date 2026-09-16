import React, { useState } from 'react';
import { BibleProgressStats, ReadingState, UserProfile } from '../types';
import { BIBLE_BOOKS, TOTAL_BIBLE_CHAPTERS, TOTAL_BIBLE_VERSES, OT_CHAPTERS_COUNT, NT_CHAPTERS_COUNT, OT_VERSES_COUNT, NT_VERSES_COUNT } from '../data/bibleData';
import { BarChart3, Flame, Award, BookOpen, CheckCircle2, TrendingUp, Calendar, Trophy, Sparkles } from 'lucide-react';
import { LeaderboardTable } from './LeaderboardTable';

interface ReportsScreenProps {
  state: ReadingState;
  stats: BibleProgressStats;
  userProfile: UserProfile;
  onEditProfile: () => void;
  initialTab?: 'analytics' | 'leaderboard';
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({ 
  state, 
  stats,
  userProfile,
  onEditProfile,
  initialTab = 'leaderboard'
}) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'analytics'>(initialTab);

  // Bible categories
  const categories = [
    { id: 'Pentateuch', nameTa: 'மோசேயின் ஆகமங்கள்', nameEn: 'Law / Pentateuch', testament: 'OT', count: 5 },
    { id: 'Historical', nameTa: 'வரலாற்று நூல்கள்', nameEn: 'Historical Books', testament: 'OT', count: 12 },
    { id: 'Poetry', nameTa: 'ஞான நூல்கள் / சங்கீதங்கள்', nameEn: 'Poetry & Wisdom', testament: 'OT', count: 5 },
    { id: 'MajorProphets', nameTa: 'பெரிய தீர்க்கதரிசிகள்', nameEn: 'Major Prophets', testament: 'OT', count: 5 },
    { id: 'MinorProphets', nameTa: 'சிறிய தீர்க்கதரிசிகள்', nameEn: 'Minor Prophets', testament: 'OT', count: 12 },
    { id: 'Gospels', nameTa: 'சுவிசேஷங்கள்', nameEn: 'The Gospels', testament: 'NT', count: 4 },
    { id: 'Acts', nameTa: 'வரலாறு (அப்போஸ்தலர்)', nameEn: 'Acts of Apostles', testament: 'NT', count: 1 },
    { id: 'Pauline', nameTa: 'பவுலின் நிருபங்கள்', nameEn: 'Pauline Epistles', testament: 'NT', count: 14 },
    { id: 'General', nameTa: 'பொதுவான நிருபங்கள்', nameEn: 'General Epistles', testament: 'NT', count: 7 },
    { id: 'Revelation', nameTa: 'தீர்க்கதரிசனம் (வெளிப்படுத்தல்)', nameEn: 'Prophecy / Revelation', testament: 'NT', count: 1 },
  ];

  // Calculate progress for each category
  const categoryStats = categories.map(cat => {
    const books = BIBLE_BOOKS.filter(b => b.category === cat.id);
    const totalVersesInCat = books.reduce((s, b) => s + b.totalVerses, 0);
    const totalChaptersInCat = books.reduce((s, b) => s + b.chaptersCount, 0);

    let versesReadInCat = 0;
    let chaptersDoneInCat = 0;

    books.forEach(b => {
      for (let c = 1; c <= b.chaptersCount; c++) {
        const totalInChap = b.chapterVerses[c - 1] || 25;
        const isChapMarked = !!state.readChapters[`${b.id}_${c}`];
        let vRead = 0;
        for (let v = 1; v <= totalInChap; v++) {
          if (state.readVerses[`${b.id}_${c}_${v}`] || isChapMarked) {
            vRead++;
          }
        }
        versesReadInCat += vRead;
        if (isChapMarked || vRead === totalInChap) {
          chaptersDoneInCat++;
        }
      }
    });

    const percent = totalVersesInCat > 0 ? Math.round((versesReadInCat / totalVersesInCat) * 100) : 0;

    return {
      ...cat,
      totalVerses: totalVersesInCat,
      versesRead: versesReadInCat,
      totalChapters: totalChaptersInCat,
      chaptersDone: chaptersDoneInCat,
      percent
    };
  });

  // Count fully completed books
  let completedBooksCount = 0;
  BIBLE_BOOKS.forEach(b => {
    let allDone = true;
    for (let c = 1; c <= b.chaptersCount; c++) {
      const isChapMarked = !!state.readChapters[`${b.id}_${c}`];
      if (!isChapMarked) {
        allDone = false;
        break;
      }
    }
    if (allDone) completedBooksCount++;
  });

  // Calculate past 7 days activity
  const past7Days: { dateStr: string; label: string; count: number }[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    const dayLabels = ['ஞா', 'திங்', 'செவ்', 'புதன்', 'வியா', 'வெள்', 'சனி'];
    past7Days.push({
      dateStr,
      label: dayLabels[d.getDay()],
      count: state.dailyActivity[dateStr] || 0
    });
  }

  const max7DayCount = Math.max(10, ...past7Days.map(d => d.count));

  // Estimated reading pace & completion
  const totalActiveDays = Object.keys(state.dailyActivity).filter(k => (state.dailyActivity[k] || 0) > 0).length;
  const remainingVerses = TOTAL_BIBLE_VERSES - stats.totalVersesRead;
  const remainingChapters = TOTAL_BIBLE_CHAPTERS - stats.totalChaptersRead;

  return (
    <div id="reports-screen-container" className="space-y-6 pb-24 sm:pb-12 max-w-5xl mx-auto px-3 sm:px-6 pt-4">
      {/* Top Main Navigation Tabs */}
      <div className="flex items-center justify-center sm:justify-start gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl shadow-lg">
        <button
          id="btn-tab-leaderboard"
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>🏆 உலக தரவரிசை (Top 25)</span>
        </button>

        <button
          id="btn-tab-analytics"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>📊 வேத பகுப்பாய்வு (Analytics)</span>
        </button>
      </div>

      {/* TAB 1: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <LeaderboardTable
          userProfile={userProfile}
          stats={stats}
          onEditProfile={onEditProfile}
        />
      )}

      {/* TAB 2: DETAILED ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Title Header */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
              <span>வேத வாசிப்பு அறிக்கைகள்</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Accurate Totals
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              உண்மையான 66 வேத புத்தகங்கள், 1,189 அதிகாரங்கள், 31,102 வசனங்களின் விரிவான பகுப்பாய்வு
            </p>
          </div>

      {/* BIG ACCURATE TOTALS BANNER */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-800 to-amber-950/30 border border-amber-500/40 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200">முழு வேதாகம வாசிப்பு சதவீதம்</div>
              <div className="text-xs text-slate-400">Bible-Wide Verified Progress</div>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            {stats.percentVerses}%
          </div>
        </div>

        {/* Big visual progress bar */}
        <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
            style={{ width: `${Math.max(1, stats.percentVerses)}%` }}
          />
        </div>

        {/* 3 Pillars: Verses, Chapters, Books */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-700/60 text-center">
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block font-medium">வசனங்கள் (Verses)</span>
            <span className="text-base sm:text-xl font-black text-slate-100 mt-0.5 block">
              {stats.totalVersesRead.toLocaleString()}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400">
              / {TOTAL_BIBLE_VERSES.toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block font-medium">அதிகாரங்கள் (Chapters)</span>
            <span className="text-base sm:text-xl font-black text-slate-100 mt-0.5 block">
              {stats.totalChaptersRead.toLocaleString()}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400">
              / {TOTAL_BIBLE_CHAPTERS.toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block font-medium">புத்தகங்கள் (Books)</span>
            <span className="text-base sm:text-xl font-black text-slate-100 mt-0.5 block">
              {completedBooksCount}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400">
              / 66 புத்தகங்கள்
            </span>
          </div>
        </div>
      </div>

      {/* OLD TESTAMENT vs NEW TESTAMENT SPLIT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Old Testament Card */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-semibold text-amber-400">39 புத்தகங்கள் • 929 அதிகாரங்கள்</span>
              <h3 className="text-lg font-bold text-slate-100">பழைய ஏற்பாடு (Old Testament)</h3>
            </div>
            <div className="text-xl font-extrabold text-amber-400">
              {stats.otPercent}%
            </div>
          </div>

          <div className="w-full h-2.5 bg-slate-700/60 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.otPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>வாசித்த வசனங்கள்: <strong className="text-amber-400">{stats.otVersesRead.toLocaleString()}</strong></span>
            <span>மொத்தம்: {OT_VERSES_COUNT.toLocaleString()}</span>
          </div>
        </div>

        {/* New Testament Card */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-semibold text-emerald-400">27 புத்தகங்கள் • 260 அதிகாரங்கள்</span>
              <h3 className="text-lg font-bold text-slate-100">புதிய ஏற்பாடு (New Testament)</h3>
            </div>
            <div className="text-xl font-extrabold text-emerald-400">
              {stats.ntPercent}%
            </div>
          </div>

          <div className="w-full h-2.5 bg-slate-700/60 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.ntPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>வாசித்த வசனங்கள்: <strong className="text-emerald-400">{stats.ntVersesRead.toLocaleString()}</strong></span>
            <span>மொத்தம்: {NT_VERSES_COUNT.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 7-DAY READING ACTIVITY HEATMAP / BAR */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-200">
              கடந்த 7 நாட்களின் வாசிப்பு செயல்பாடு (Weekly Activity)
            </h3>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-amber-400">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>தொடர் வாசிப்பு: {stats.currentStreak} நாள்</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 items-end h-28 pt-2">
          {past7Days.map((day, idx) => {
            const heightPercent = Math.max(8, Math.round((day.count / max7DayCount) * 100));
            const isToday = idx === 6;

            return (
              <div key={day.dateStr} className="flex flex-col items-center gap-1 h-full justify-end">
                <span className="text-[10px] text-slate-400 font-medium">
                  {day.count > 0 ? day.count : '-'}
                </span>
                <div className="w-full max-w-[36px] bg-slate-700/40 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      day.count > 0 
                        ? (isToday ? 'bg-amber-400' : 'bg-emerald-500')
                        : 'bg-transparent'
                    }`}
                    style={{ height: day.count > 0 ? `${heightPercent}%` : '0%' }}
                  />
                </div>
                <span className={`text-[11px] font-semibold ${isToday ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CATEGORY-WISE DETAILED BREAKDOWN */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-slate-200 mb-3">
          பிரிவு வாரியாக வாசிப்பு நிலை (Category-Wise Breakdown)
        </h3>

        <div className="space-y-3">
          {categoryStats.map(cat => (
            <div key={cat.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5 flex-wrap gap-1">
                <div>
                  <span className="font-bold text-slate-200">{cat.nameTa}</span>
                  <span className="text-slate-400 text-[11px] ml-1.5">({cat.nameEn})</span>
                </div>
                <div className="text-amber-400 font-bold">
                  {cat.versesRead} / {cat.totalVerses} ({cat.percent}%)
                </div>
              </div>

              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-1">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    cat.percent === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${cat.percent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>{cat.count} புத்தகங்கள் • {cat.totalChapters} அதிகாரங்கள்</span>
                <span>{cat.chaptersDone} / {cat.totalChapters} அதிகாரங்கள் முடிந்தது</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Insights */}
      <div className="rounded-xl bg-slate-800/50 border border-slate-700/60 p-4 text-xs text-slate-300 space-y-1.5">
        <div className="font-bold text-slate-200 mb-1">முக்கிய குறிப்புகள் (Summary Insights):</div>
        <div>• இன்னும் வாசிக்க வேண்டியவை: <strong>{remainingVerses.toLocaleString()} வசனங்கள்</strong> ({remainingChapters} அதிகாரங்கள்)</div>
        <div>• நீங்கள் வேதத்தை வாசித்து பதிவு செய்த மொத்த நாட்கள்: <strong>{totalActiveDays} நாட்கள்</strong></div>
        <div>• உங்கள் அதிகபட்ச தொடர் வாசிப்பு: <strong>{stats.bestStreak} நாட்கள்</strong></div>
      </div>
        </div>
      )}
    </div>
  );
};

import React, { useMemo } from 'react';
import { BibleProgressStats, PlanType, ReadingState, ViewMode, UserProfile } from '../types';
import { BIBLE_BOOKS, TOTAL_BIBLE_CHAPTERS, TOTAL_BIBLE_VERSES } from '../data/bibleData';
import { 
  getDailyTenVersesPassage, 
  getDailyOneChapterPassage, 
  YEARLY_BIBLE_PLAN, 
  SIX_MONTHS_BIBLE_PLAN, 
  THREE_MONTHS_BIBLE_PLAN, 
  getCurrentDayOfYear 
} from '../data/readingPlans';
import { getGlobalLeaderboard } from '../data/leaderboardData';
import { getTodayVersePromise } from '../data/dailyVerses';
import { 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Calendar, 
  Award, 
  Sparkles, 
  Compass, 
  Trophy, 
  Crown, 
  Edit3, 
  User, 
  MapPin, 
  ChevronRight 
} from 'lucide-react';

interface DashboardProps {
  state: ReadingState;
  stats: BibleProgressStats;
  userProfile: UserProfile;
  onEditProfile: () => void;
  onNavigate: (view: ViewMode) => void;
  onSelectBook: (bookId: number) => void;
  onOpenPassage: (bookId: number, chapter: number, startVerse?: number) => void;
  onSetActivePlan: (plan: PlanType) => void;
  onQuickMarkTodayPlan: () => void;
  onOpenBible?: (bookId: number, chapter: number, verse?: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  state,
  stats,
  userProfile,
  onEditProfile,
  onNavigate,
  onSelectBook,
  onOpenPassage,
  onSetActivePlan,
  onQuickMarkTodayPlan,
  onOpenBible
}) => {
  // Current date formatted in Tamil
  const today = new Date();
  const tamilDays = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];
  const tamilMonths = ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'];
  const formattedTamilDate = `${tamilDays[today.getDay()]}, ${today.getDate()} ${tamilMonths[today.getMonth()]} ${today.getFullYear()}`;

  // Global leaderboard calculation for current user standing
  const { top25, currentUserRank, currentUserEntry } = useMemo(() => {
    return getGlobalLeaderboard(userProfile, stats);
  }, [userProfile, stats]);

  // Get current active plan passage
  let todayPassageTitleTa = '';
  let todayPassageTitleEn = '';
  let todayBookId = 1;
  let todayChapter = 1;
  let todayStartVerse: number | undefined = undefined;

  if (state.activePlan === 'ten_verses') {
    const p = getDailyTenVersesPassage(state.tenVersesDay);
    todayPassageTitleTa = p.labelTa;
    todayPassageTitleEn = p.labelEn;
    todayBookId = p.bookId;
    todayChapter = p.chapter;
    todayStartVerse = p.startVerse;
  } else if (state.activePlan === 'one_chapter') {
    const p = getDailyOneChapterPassage(state.oneChapterDay);
    todayPassageTitleTa = p.labelTa;
    todayPassageTitleEn = p.labelEn;
    todayBookId = p.bookId;
    todayChapter = p.chapter;
    todayStartVerse = 1;
  } else if (state.activePlan === 'six_months_plan') {
    const day = Math.min(180, Math.max(1, state.sixMonthsPlanDay || 1));
    const dayPlan = SIX_MONTHS_BIBLE_PLAN[day - 1] || SIX_MONTHS_BIBLE_PLAN[0];
    todayPassageTitleTa = dayPlan.titleTa;
    todayPassageTitleEn = dayPlan.titleEn;
    const firstPassage = dayPlan.passages[0];
    if (firstPassage) {
      todayBookId = firstPassage.bookId;
      todayChapter = firstPassage.startChapter;
      todayStartVerse = 1;
    }
  } else if (state.activePlan === 'three_months_plan') {
    const day = Math.min(90, Math.max(1, state.threeMonthsPlanDay || 1));
    const dayPlan = THREE_MONTHS_BIBLE_PLAN[day - 1] || THREE_MONTHS_BIBLE_PLAN[0];
    todayPassageTitleTa = dayPlan.titleTa;
    todayPassageTitleEn = dayPlan.titleEn;
    const firstPassage = dayPlan.passages[0];
    if (firstPassage) {
      todayBookId = firstPassage.bookId;
      todayChapter = firstPassage.startChapter;
      todayStartVerse = 1;
    }
  } else {
    // Yearly plan
    const day = state.yearlyPlanDay || getCurrentDayOfYear();
    const dayPlan = YEARLY_BIBLE_PLAN[day - 1] || YEARLY_BIBLE_PLAN[0];
    todayPassageTitleTa = dayPlan.titleTa;
    todayPassageTitleEn = dayPlan.titleEn;
    const firstPassage = dayPlan.passages[0];
    if (firstPassage) {
      todayBookId = firstPassage.bookId;
      todayChapter = firstPassage.startChapter;
      todayStartVerse = 1;
    }
  }

  // Check if today's passage or chapter is read
  const isTodayChapterMarked = !!state.readChapters[`${todayBookId}_${todayChapter}`];

  // Today's Promise Verse
  const todayPromise = getTodayVersePromise();

  // Last read book object
  const lastReadBook = state.lastRead 
    ? BIBLE_BOOKS.find(b => b.id === state.lastRead!.bookId) 
    : BIBLE_BOOKS[0];

  return (
    <div id="dashboard-container" className="space-y-6 pb-24 sm:pb-12 max-w-5xl mx-auto px-3 sm:px-6 pt-4">
      {/* Sleek Compact Header Bar with Date, Center Daily Verse, and Profile */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:px-5 sm:py-3 shadow-md">
        {/* Left: Today's Tamil Date */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 whitespace-nowrap">
            {formattedTamilDate}
          </span>
          <span className="text-xs text-slate-400 hidden xl:inline">• அன்றாட வேத தியானம்</span>
        </div>

        {/* Center Gap: Daily Bible Verse (தினசரி வேதாகம வசனம்) */}
        <div 
          id="dashboard-daily-verse-center"
          className="flex-1 mx-0 md:mx-3 py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-amber-500/10 border border-amber-500/30 flex items-center justify-center text-center gap-2 min-w-0 shadow-sm"
          title={`இன்றைய வேத வசனம்: ${todayPromise.referenceTa}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 animate-pulse" />
          <p className="text-xs text-amber-200 font-medium truncate">
            <span className="text-slate-300 italic font-['Mukta_Malar',sans-serif]">"{todayPromise.text}"</span>
            <span className="text-amber-400 font-bold ml-1.5 whitespace-nowrap">— {todayPromise.referenceTa}</span>
          </p>
        </div>

        {/* Right: Believer Profile & Global Rank Chip */}
        <div className="flex items-center justify-between md:justify-end gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">{userProfile.avatar || '📖'}</span>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-100">{userProfile.username}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  தரம் #{currentUserRank}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {currentUserEntry.score.toLocaleString()} pts • {userProfile.location}
              </div>
            </div>
          </div>

          <button
            id="btn-edit-profile-dash"
            onClick={onEditProfile}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-all"
            title="பெயரை மாற்ற (Edit Profile)"
          >
            <Edit3 className="w-3 h-3" />
            <span>பெயர் மாற்று</span>
          </button>
        </div>
      </div>

      {/* TODAY'S READING PLAN CARD (High Priority - Direct Open) */}
      <div
        id="today-reading-plan-card"
        className="rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-500/50 p-5 sm:p-6 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>இன்றைய வாசிப்பு (Today's Reading)</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-amber-400">
                {state.activePlan === 'ten_verses' && 'திட்டம்: தினமும் 10 வசனங்கள் (நாள் ' + state.tenVersesDay + ')'}
                {state.activePlan === 'one_chapter' && 'திட்டம்: தினமும் 1 அதிகாரம் (நாள் ' + state.oneChapterDay + ')'}
                {state.activePlan === 'yearly_plan' && 'திட்டம்: முழு பைபிள் 1 வருடம் (நாள் ' + state.yearlyPlanDay + ' / 365)'}
                {state.activePlan === 'six_months_plan' && 'திட்டம்: முழு பைபிள் 6 மாதங்கள் (நாள் ' + (state.sixMonthsPlanDay || 1) + ' / 180)'}
                {state.activePlan === 'three_months_plan' && 'திட்டம்: முழு பைபிள் 3 மாதங்கள் (நாள் ' + (state.threeMonthsPlanDay || 1) + ' / 90)'}
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-['Mukta_Malar',sans-serif]">
              {todayPassageTitleTa}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
              {todayPassageTitleEn}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center flex-wrap gap-2.5 pt-2 sm:pt-0">
            {/* DIRECT READ BIBLE BUTTON (Tamil Old Version O.V.) */}
            {onOpenBible && (
              <button
                id="btn-direct-read-bible"
                onClick={() => onOpenBible(todayBookId, todayChapter, todayStartVerse)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-3 rounded-xl shadow-lg shadow-amber-500/25 transition-all active:scale-95 text-xs sm:text-sm min-h-[44px]"
                title="தமிழ் பழைய பதிப்பு (O.V.) வேதாகமத்தில் வாசிக்க"
              >
                <BookOpen className="w-4 h-4" />
                <span>வேதாகமத்தில் வாசிக்க (Read O.V.)</span>
              </button>
            )}

            {/* DIRECT OPEN CHECKLIST BUTTON */}
            <button
              id="btn-direct-open-passage"
              onClick={() => onOpenPassage(todayBookId, todayChapter, todayStartVerse)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-3 rounded-xl border border-slate-700 transition-all active:scale-95 text-xs sm:text-sm min-h-[44px]"
            >
              <span>சரிபார்ப்பு பட்டியல்</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Quick Mark Finished */}
            <button
              id="btn-quick-mark-plan"
              onClick={onQuickMarkTodayPlan}
              className={`flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-xl border font-semibold text-xs sm:text-sm transition-all min-h-[44px] ${
                isTodayChapterMarked
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isTodayChapterMarked ? 'முடிக்கப்பட்டது' : 'வாசித்து முடித்தேன்'}</span>
            </button>
          </div>
        </div>

        {/* Plan Switcher Bar - Exact 5 plans order: 10 Verses, 1 Chapter, 3 Months, 6 Months, 1 Year */}
        <div className="mt-4 pt-4 border-t border-slate-700/60">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-300">திட்டத்தைத் தேர்வு செய்க (Quick Switch Plan):</span>
            <button
              onClick={() => onNavigate('plans')}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-0.5"
            >
              <span>அனைத்து திட்டங்கள்</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {/* 1. 10 வசனங்கள் */}
            <button
              id="btn-plan-ten-verses"
              onClick={() => onSetActivePlan('ten_verses')}
              className={`p-2 rounded-xl text-xs font-bold transition-all text-center border ${
                state.activePlan === 'ten_verses'
                  ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md ring-1 ring-amber-400/50'
                  : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="text-[10px] opacity-75">திட்டம் 1</div>
              <div>10 வசனங்கள்</div>
            </button>

            {/* 2. 1 அதிகாரம் */}
            <button
              id="btn-plan-one-chapter"
              onClick={() => onSetActivePlan('one_chapter')}
              className={`p-2 rounded-xl text-xs font-bold transition-all text-center border ${
                state.activePlan === 'one_chapter'
                  ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md ring-1 ring-amber-400/50'
                  : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="text-[10px] opacity-75">திட்டம் 2</div>
              <div>1 அதிகாரம்</div>
            </button>

            {/* 3. 3 மாதங்கள் */}
            <button
              id="btn-plan-three-months"
              onClick={() => onSetActivePlan('three_months_plan')}
              className={`p-2 rounded-xl text-xs font-bold transition-all text-center border ${
                state.activePlan === 'three_months_plan'
                  ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md ring-1 ring-amber-400/50'
                  : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="text-[10px] opacity-75">திட்டம் 3</div>
              <div>3 மாதங்கள்</div>
            </button>

            {/* 4. 6 மாதங்கள் */}
            <button
              id="btn-plan-six-months"
              onClick={() => onSetActivePlan('six_months_plan')}
              className={`p-2 rounded-xl text-xs font-bold transition-all text-center border ${
                state.activePlan === 'six_months_plan'
                  ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md ring-1 ring-amber-400/50'
                  : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="text-[10px] opacity-75">திட்டம் 4</div>
              <div>6 மாதங்கள்</div>
            </button>

            {/* 5. 1 வருடம் */}
            <button
              id="btn-plan-yearly"
              onClick={() => onSetActivePlan('yearly_plan')}
              className={`p-2 rounded-xl text-xs font-bold transition-all text-center border col-span-2 sm:col-span-1 ${
                state.activePlan === 'yearly_plan'
                  ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md ring-1 ring-amber-400/50'
                  : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="text-[10px] opacity-75">திட்டம் 5</div>
              <div>1 வருடம் (365)</div>
            </button>
          </div>
        </div>
      </div>

      {/* METRICS & STREAK CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Streak */}
        <div className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">தொடர் வாசிப்பு</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-100 flex items-baseline gap-1">
              <span>{stats.currentStreak}</span>
              <span className="text-xs font-medium text-slate-400">நாட்கள்</span>
            </div>
            <div className="text-[11px] text-amber-400 mt-1">
              அதிகபட்சம்: {stats.bestStreak} நாட்கள்
            </div>
          </div>
        </div>

        {/* Metric 2: Today's Verses */}
        <div className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">இன்று வாசித்தவை</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-100 flex items-baseline gap-1">
              <span className="text-emerald-400">{stats.todayVersesRead}</span>
              <span className="text-xs font-medium text-slate-400">வசனங்கள்</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              தினசரி இலக்கு: 10+ வசனங்கள்
            </div>
          </div>
        </div>

        {/* Metric 3: Total Verses Progress (Accurate 31,102) */}
        <div className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">முழு வேத வசனங்கள்</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-100 flex items-baseline gap-1">
              <span>{stats.percentVerses}%</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {stats.totalVersesRead.toLocaleString()} / {TOTAL_BIBLE_VERSES.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Metric 4: Total Chapters Completed (Accurate 1,189) */}
        <div className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">அதிகாரங்கள்</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-100 flex items-baseline gap-1">
              <span>{stats.totalChaptersRead}</span>
              <span className="text-xs font-medium text-slate-400">/ {TOTAL_BIBLE_CHAPTERS}</span>
            </div>
            <div className="text-[11px] text-purple-400 mt-1">
              {stats.percentChapters}% நிறைவு
            </div>
          </div>
        </div>
      </div>

      {/* OVERALL BIBLE PROGRESS BARS */}
      <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-200">
            வேதாகம வாசிப்பு நிலை (Bible Progress)
          </h3>
          <button
            onClick={() => onNavigate('reports')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>முழு அறிக்கை பார்க்க</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Old Testament Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-300">பழைய ஏற்பாடு (Old Testament - 39 புத்தகங்கள்)</span>
            <span className="text-amber-400 font-bold">{stats.otVersesRead} / 23,145 ({stats.otPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-700/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, stats.otPercent)}%` }}
            />
          </div>
        </div>

        {/* New Testament Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-300">புதிய ஏற்பாடு (New Testament - 27 புத்தகங்கள்)</span>
            <span className="text-emerald-400 font-bold">{stats.ntVersesRead} / 7,957 ({stats.ntPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-700/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, stats.ntPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* QUICK RESUME & SHORTCUT ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Resume Last Read */}
        {lastReadBook && (
          <div className="rounded-xl bg-slate-800/70 border border-slate-700/80 p-4 flex items-center justify-between hover:border-slate-600 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">கடைசியாக வாசித்தது</span>
                <span className="text-base font-bold text-slate-100">
                  {lastReadBook.nameTa} ({lastReadBook.nameEn}) {state.lastRead?.chapter ? `அதி. ${state.lastRead.chapter}` : ''}
                </span>
              </div>
            </div>
            <button
              id="btn-resume-last-read"
              onClick={() => onOpenPassage(lastReadBook.id, state.lastRead?.chapter || 1, state.lastRead?.verse || 1)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <span>தொடர்க</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 66 Books Directory Quick Link */}
        <div className="rounded-xl bg-slate-800/70 border border-slate-700/80 p-4 flex items-center justify-between hover:border-slate-600 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">முழு வேத நூல் பட்டியல்</span>
              <span className="text-base font-bold text-slate-100">
                66 புத்தகங்கள் (Tamil + English)
              </span>
            </div>
          </div>
          <button
            id="btn-goto-all-books"
            onClick={() => onNavigate('books')}
            className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md active:scale-95"
          >
            <span>திறக்க</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* QUICK JUMP TO POPULAR BOOKS */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            வேத புத்தகங்கள் விரைவுத் தேர்வு (Quick Jump)
          </h3>
          <button
            onClick={() => onNavigate('books')}
            className="text-xs font-semibold text-amber-400 hover:underline"
          >
            அனைத்தும் (66)
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 1, nameTa: 'ஆதியாகமம்', nameEn: 'Genesis' },
            { id: 19, nameTa: 'சங்கீதம்', nameEn: 'Psalms' },
            { id: 20, nameTa: 'நீதிமொழிகள்', nameEn: 'Proverbs' },
            { id: 40, nameTa: 'மத்தேயு', nameEn: 'Matthew' },
            { id: 43, nameTa: 'யோவான்', nameEn: 'John' },
            { id: 45, nameTa: 'ரோமர்', nameEn: 'Romans' },
            { id: 44, nameTa: 'அப்போஸ்தலர்', nameEn: 'Acts' },
            { id: 66, nameTa: 'வெளிப்படுத்தின விசேஷம்', nameEn: 'Revelation' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectBook(item.id)}
              className="p-3 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 hover:border-amber-500/40 rounded-xl text-left transition-all group"
            >
              <div className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-amber-400 truncate">
                {item.nameTa}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {item.nameEn}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

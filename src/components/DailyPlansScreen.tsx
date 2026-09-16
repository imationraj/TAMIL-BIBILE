import React, { useState } from 'react';
import { PlanType, ReadingState } from '../types';
import { BIBLE_BOOKS, TOTAL_BIBLE_CHAPTERS, TOTAL_BIBLE_VERSES } from '../data/bibleData';
import { 
  getDailyTenVersesPassage, 
  getDailyOneChapterPassage, 
  YEARLY_BIBLE_PLAN, 
  SIX_MONTHS_BIBLE_PLAN,
  THREE_MONTHS_BIBLE_PLAN,
  getCurrentDayOfYear 
} from '../data/readingPlans';
import { Calendar, CheckCircle2, ArrowRight, BookOpen, Clock, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface DailyPlansScreenProps {
  state: ReadingState;
  onSetActivePlan: (plan: PlanType) => void;
  onSetPlanDay: (plan: PlanType, newDay: number) => void;
  onOpenPassage: (bookId: number, chapter: number, startVerse?: number) => void;
  onMarkPassageComplete: (bookId: number, chapter: number, startVerse?: number, endVerse?: number) => void;
  onMarkChaptersBatch: (chaptersToMark: { bookId: number; chapter: number }[], markRead: boolean) => void;
}

export const DailyPlansScreen: React.FC<DailyPlansScreenProps> = ({
  state,
  onSetActivePlan,
  onSetPlanDay,
  onOpenPassage,
  onMarkPassageComplete,
  onMarkChaptersBatch
}) => {
  const currentDayOfYear = getCurrentDayOfYear();

  // State for browsing days in each plan
  const [selectedPlanTab, setSelectedPlanTab] = useState<PlanType>(state.activePlan || 'yearly_plan');

  // Daily 10 Verses details
  const tenVersesPassage = getDailyTenVersesPassage(state.tenVersesDay);
  let tenVersesReadCount = 0;
  if (tenVersesPassage.startVerse && tenVersesPassage.endVerse) {
    for (let v = tenVersesPassage.startVerse; v <= tenVersesPassage.endVerse; v++) {
      if (state.readVerses[`${tenVersesPassage.bookId}_${tenVersesPassage.chapter}_${v}`] || state.readChapters[`${tenVersesPassage.bookId}_${tenVersesPassage.chapter}`]) {
        tenVersesReadCount++;
      }
    }
  }
  const isTenVersesFullyRead = tenVersesReadCount >= tenVersesPassage.totalVersesInPassage;

  // Daily 1 Chapter details
  const oneChapterPassage = getDailyOneChapterPassage(state.oneChapterDay);
  const isOneChapterDone = !!state.readChapters[`${oneChapterPassage.bookId}_${oneChapterPassage.chapter}`];

  // Yearly 365 Days Plan details
  const yearlyDay = state.yearlyPlanDay || currentDayOfYear;
  const yearlyDayPlan = YEARLY_BIBLE_PLAN[yearlyDay - 1] || YEARLY_BIBLE_PLAN[0];

  const allYearlyDayChapters: { bookId: number; chapter: number }[] = [];
  yearlyDayPlan.passages.forEach(p => {
    for (let c = p.startChapter; c <= p.endChapter; c++) {
      allYearlyDayChapters.push({ bookId: p.bookId, chapter: c });
    }
  });

  const yearlyDayCompletedCount = allYearlyDayChapters.filter(ch => 
    !!state.readChapters[`${ch.bookId}_${ch.chapter}`]
  ).length;
  const isYearlyDayFullyDone = yearlyDayCompletedCount === allYearlyDayChapters.length;

  // 6 Months Plan details (180 Days)
  const sixMonthsDay = Math.min(180, Math.max(1, state.sixMonthsPlanDay || 1));
  const sixMonthsDayPlan = SIX_MONTHS_BIBLE_PLAN[sixMonthsDay - 1] || SIX_MONTHS_BIBLE_PLAN[0];
  const allSixMonthsDayChapters: { bookId: number; chapter: number }[] = [];
  sixMonthsDayPlan.passages.forEach(p => {
    for (let c = p.startChapter; c <= p.endChapter; c++) {
      allSixMonthsDayChapters.push({ bookId: p.bookId, chapter: c });
    }
  });
  const sixMonthsDayCompletedCount = allSixMonthsDayChapters.filter(ch => 
    !!state.readChapters[`${ch.bookId}_${ch.chapter}`]
  ).length;
  const isSixMonthsDayFullyDone = sixMonthsDayCompletedCount === allSixMonthsDayChapters.length;

  // 3 Months Plan details (90 Days)
  const threeMonthsDay = Math.min(90, Math.max(1, state.threeMonthsPlanDay || 1));
  const threeMonthsDayPlan = THREE_MONTHS_BIBLE_PLAN[threeMonthsDay - 1] || THREE_MONTHS_BIBLE_PLAN[0];
  const allThreeMonthsDayChapters: { bookId: number; chapter: number }[] = [];
  threeMonthsDayPlan.passages.forEach(p => {
    for (let c = p.startChapter; c <= p.endChapter; c++) {
      allThreeMonthsDayChapters.push({ bookId: p.bookId, chapter: c });
    }
  });
  const threeMonthsDayCompletedCount = allThreeMonthsDayChapters.filter(ch => 
    !!state.readChapters[`${ch.bookId}_${ch.chapter}`]
  ).length;
  const isThreeMonthsDayFullyDone = threeMonthsDayCompletedCount === allThreeMonthsDayChapters.length;

  return (
    <div id="daily-plans-screen" className="space-y-6 pb-24 sm:pb-12 max-w-5xl mx-auto px-3 sm:px-6 pt-4">
      {/* Title & Introduction */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
          <span>வேத வாசிப்புத் திட்டங்கள்</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Daily Reading Plan
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          உங்கள் விருப்பத்திற்கேற்ப திட்டத்தைத் தேர்வு செய்து, தினமும் இறைவார்த்தையை வாசியுங்கள்
        </p>
      </div>

      {/* Plan Selector 5 Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {/* Tab 1: 10 Verses */}
        <button
          id="tab-plan-ten-verses"
          onClick={() => {
            setSelectedPlanTab('ten_verses');
            onSetActivePlan('ten_verses');
          }}
          className={`p-3 sm:p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
            selectedPlanTab === 'ten_verses'
              ? 'bg-amber-500/10 border-amber-500 text-amber-400 ring-1 ring-amber-500/30'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
          }`}
        >
          {state.activePlan === 'ten_verses' && (
            <span className="absolute top-2 right-2 text-[9px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-full">
              செயலில்
            </span>
          )}
          <div className="text-xs sm:text-sm font-bold text-slate-100 mb-0.5">
            10 வசனங்கள்
          </div>
          <div className="text-[11px] text-slate-400">
            தினமும் 10 வசனங்கள்
          </div>
        </button>

        {/* Tab 2: 1 Chapter */}
        <button
          id="tab-plan-one-chapter"
          onClick={() => {
            setSelectedPlanTab('one_chapter');
            onSetActivePlan('one_chapter');
          }}
          className={`p-3 sm:p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
            selectedPlanTab === 'one_chapter'
              ? 'bg-amber-500/10 border-amber-500 text-amber-400 ring-1 ring-amber-500/30'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
          }`}
        >
          {state.activePlan === 'one_chapter' && (
            <span className="absolute top-2 right-2 text-[9px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-full">
              செயலில்
            </span>
          )}
          <div className="text-xs sm:text-sm font-bold text-slate-100 mb-0.5">
            1 அதிகாரம்
          </div>
          <div className="text-[11px] text-slate-400">
            தினமும் 1 அதிகாரம்
          </div>
        </button>

        {/* Tab 3: 3 Months Plan */}
        <button
          id="tab-plan-three-months"
          onClick={() => {
            setSelectedPlanTab('three_months_plan');
            onSetActivePlan('three_months_plan');
          }}
          className={`p-3 sm:p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
            selectedPlanTab === 'three_months_plan'
              ? 'bg-amber-500/10 border-amber-500 text-amber-400 ring-1 ring-amber-500/30'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
          }`}
        >
          {state.activePlan === 'three_months_plan' && (
            <span className="absolute top-2 right-2 text-[9px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-full">
              செயலில்
            </span>
          )}
          <div className="text-xs sm:text-sm font-bold text-slate-100 mb-0.5">
            3 மாதங்கள்
          </div>
          <div className="text-[11px] text-slate-400">
            90 நாள் (~13-14 அதி.)
          </div>
        </button>

        {/* Tab 4: 6 Months Plan */}
        <button
          id="tab-plan-six-months"
          onClick={() => {
            setSelectedPlanTab('six_months_plan');
            onSetActivePlan('six_months_plan');
          }}
          className={`p-3 sm:p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
            selectedPlanTab === 'six_months_plan'
              ? 'bg-amber-500/10 border-amber-500 text-amber-400 ring-1 ring-amber-500/30'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
          }`}
        >
          {state.activePlan === 'six_months_plan' && (
            <span className="absolute top-2 right-2 text-[9px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-full">
              செயலில்
            </span>
          )}
          <div className="text-xs sm:text-sm font-bold text-slate-100 mb-0.5">
            6 மாதங்கள்
          </div>
          <div className="text-[11px] text-slate-400">
            180 நாள் (~6-7 அதி.)
          </div>
        </button>

        {/* Tab 5: Yearly Plan (1 Year) */}
        <button
          id="tab-plan-yearly"
          onClick={() => {
            setSelectedPlanTab('yearly_plan');
            onSetActivePlan('yearly_plan');
          }}
          className={`p-3 sm:p-4 rounded-xl border text-left transition-all relative overflow-hidden col-span-2 sm:col-span-1 ${
            selectedPlanTab === 'yearly_plan'
              ? 'bg-amber-500/10 border-amber-500 text-amber-400 ring-1 ring-amber-500/30'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
          }`}
        >
          {state.activePlan === 'yearly_plan' && (
            <span className="absolute top-2 right-2 text-[9px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-full">
              செயலில்
            </span>
          )}
          <div className="text-xs sm:text-sm font-bold text-slate-100 mb-0.5">
            1 வருடம்
          </div>
          <div className="text-[11px] text-slate-400">
            365 நாள் (~3-4 அதி.)
          </div>
        </button>
      </div>

      {/* PLAN 1 CONTENT: தினமும் 10 வசனங்கள் */}
      {selectedPlanTab === 'ten_verses' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 p-5 sm:p-6 shadow-xl">
            {/* Day Selector Bar */}
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-700/80 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">நாள் தெரிவு:</span>
                <button
                  onClick={() => onSetPlanDay('ten_verses', Math.max(1, state.tenVersesDay - 1))}
                  disabled={state.tenVersesDay <= 1}
                  className="p-1.5 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-base font-bold text-amber-400 px-2">
                  நாள் {state.tenVersesDay}
                </span>
                <button
                  onClick={() => onSetPlanDay('ten_verses', state.tenVersesDay + 1)}
                  className="p-1.5 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => onSetPlanDay('ten_verses', 1)}
                className="text-xs text-slate-400 hover:text-amber-400 underline"
              >
                முதல் நாளுக்குச் செல் (Day 1)
              </button>
            </div>

            {/* Passage Display */}
            <div className="py-4">
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                இன்று படிக்க வேண்டிய வசனங்கள் (Today's Assigned Verses):
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-['Mukta_Malar',sans-serif]">
                {tenVersesPassage.labelTa}
              </h3>
              <p className="text-sm text-slate-300">
                {tenVersesPassage.labelEn} ({tenVersesPassage.totalVersesInPassage} வசனங்கள்)
              </p>

              {/* Progress */}
              <div className="mt-3 flex items-center gap-3">
                <div className="text-xs text-slate-400">
                  வாசிப்பு: <span className="text-emerald-400 font-bold">{tenVersesReadCount} / {tenVersesPassage.totalVersesInPassage}</span> வசனங்கள்
                </div>
                {isTenVersesFullyRead && (
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>நிறைவடைந்தது</span>
                  </span>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS (Direct Open passage as requested!) */}
            <div className="pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row gap-3">
              {/* High priority direct open button */}
              <button
                id="btn-plan-open-ten-verses"
                onClick={() => onOpenPassage(tenVersesPassage.bookId, tenVersesPassage.chapter, tenVersesPassage.startVerse)}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg transition-all active:scale-95 text-sm sm:text-base"
              >
                <BookOpen className="w-4 h-4" />
                <span>இன்று படிக்க வேண்டிய passage நேரடியாக திறக்கவும்</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-mark-ten-verses-done"
                onClick={() => {
                  onMarkPassageComplete(
                    tenVersesPassage.bookId, 
                    tenVersesPassage.chapter, 
                    tenVersesPassage.startVerse, 
                    tenVersesPassage.endVerse
                  );
                }}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border font-bold text-sm transition-all ${
                  isTenVersesFullyRead
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isTenVersesFullyRead ? 'முடிந்தது என குறிக்கப்பட்டது' : '10 வசனங்களையும் முடித்தேன்'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PLAN 2 CONTENT: தினமும் 1 அதிகாரம் */}
      {selectedPlanTab === 'one_chapter' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 p-5 sm:p-6 shadow-xl">
            {/* Day Selector Bar */}
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-700/80 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">நாள்:</span>
                <button
                  onClick={() => onSetPlanDay('one_chapter', Math.max(1, state.oneChapterDay - 1))}
                  disabled={state.oneChapterDay <= 1}
                  className="p-1.5 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-base font-bold text-amber-400 px-2">
                  நாள் {state.oneChapterDay} / 1189
                </span>
                <button
                  onClick={() => onSetPlanDay('one_chapter', Math.min(1189, state.oneChapterDay + 1))}
                  disabled={state.oneChapterDay >= 1189}
                  className="p-1.5 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-slate-400">
                மொத்த அதிகாரங்கள்: 1,189
              </div>
            </div>

            {/* Passage Display */}
            <div className="py-4">
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                இன்றைய அதிகாரம் (Today's Chapter):
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-['Mukta_Malar',sans-serif]">
                {oneChapterPassage.labelTa}
              </h3>
              <p className="text-sm text-slate-300">
                {oneChapterPassage.labelEn} ({oneChapterPassage.totalVersesInPassage} வசனங்கள்)
              </p>

              {/* Status */}
              <div className="mt-3">
                {isOneChapterDone ? (
                  <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>இந்த அதிகாரம் முழுதும் வாசிக்கப்பட்டது</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">
                    இன்னும் வாசிக்கப்படவில்லை
                  </span>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS (Direct Open!) */}
            <div className="pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row gap-3">
              <button
                id="btn-plan-open-one-chapter"
                onClick={() => onOpenPassage(oneChapterPassage.bookId, oneChapterPassage.chapter)}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg transition-all active:scale-95 text-sm sm:text-base"
              >
                <BookOpen className="w-4 h-4" />
                <span>இன்று படிக்க வேண்டிய passage நேரடியாக திறக்கவும்</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-mark-one-chapter-done"
                onClick={() => {
                  onMarkChaptersBatch([{ bookId: oneChapterPassage.bookId, chapter: oneChapterPassage.chapter }], !isOneChapterDone);
                }}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border font-bold text-sm transition-all ${
                  isOneChapterDone
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isOneChapterDone ? 'முடிந்தது' : 'அதிகாரம் முழுதும் முடித்தேன்'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PLAN 3 CONTENT: முழு Bible yearly plan (1 Year Bible Plan - 365 Days) */}
      {selectedPlanTab === 'yearly_plan' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 p-5 sm:p-6 shadow-xl">
            {/* Day Selector Bar */}
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-700/80 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">நாள் தெரிவு:</span>
                <button
                  onClick={() => onSetPlanDay('yearly_plan', Math.max(1, yearlyDay - 1))}
                  disabled={yearlyDay <= 1}
                  className="p-1.5 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-base font-bold text-amber-400 px-2">
                  நாள் {yearlyDay} / 365
                </span>
                <button
                  onClick={() => onSetPlanDay('yearly_plan', Math.min(365, yearlyDay + 1))}
                  disabled={yearlyDay >= 365}
                  className="p-1.5 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Jump to current day of year */}
              <button
                onClick={() => onSetPlanDay('yearly_plan', currentDayOfYear)}
                className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 hover:bg-amber-500/30"
              >
                இன்றைய நாளுக்குச் செல் (நாள் {currentDayOfYear})
              </button>
            </div>

            {/* Passage Display */}
            <div className="py-4">
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                இன்று படிக்க வேண்டிய பகுதிகள் (Today's Bible Passages):
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-['Mukta_Malar',sans-serif]">
                {yearlyDayPlan.titleTa}
              </h3>
              <p className="text-sm text-slate-300">
                {yearlyDayPlan.titleEn}
              </p>

              {/* Day's Chapters Breakdown */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allYearlyDayChapters.map((ch, idx) => {
                  const b = BIBLE_BOOKS.find(book => book.id === ch.bookId);
                  const isDone = !!state.readChapters[`${ch.bookId}_${ch.chapter}`];

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isDone
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                          : 'bg-slate-800/80 border-slate-700 text-slate-200'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold">
                          {b?.nameTa} அதிகாரம் {ch.chapter}
                        </div>
                        <div className="text-xs text-slate-400">
                          {b?.nameEn} Chapter {ch.chapter}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Direct Open this chapter */}
                        <button
                          onClick={() => onOpenPassage(ch.bookId, ch.chapter)}
                          className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold rounded-lg border border-amber-500/40 flex items-center gap-1"
                        >
                          <span>திறக்க</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row gap-3">
              {/* High priority direct open button (opens the first passage of the day) */}
              <button
                id="btn-plan-open-yearly"
                onClick={() => {
                  const first = allYearlyDayChapters[0];
                  if (first) onOpenPassage(first.bookId, first.chapter);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg transition-all active:scale-95 text-sm sm:text-base"
              >
                <BookOpen className="w-4 h-4" />
                <span>இன்று படிக்க வேண்டிய passage நேரடியாக திறக்கவும்</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Complete all chapters of the day */}
              <button
                id="btn-mark-yearly-day-all-done"
                onClick={() => onMarkChaptersBatch(allYearlyDayChapters, !isYearlyDayFullyDone)}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border font-bold text-sm transition-all ${
                  isYearlyDayFullyDone
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isYearlyDayFullyDone ? 'அனைத்தும் முடிந்தது' : 'இன்றைய அதிகாரங்கள் அனைத்தையும் முடித்தேன்'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* PLAN 4 CONTENT: முழு பைபிள் (6 மாதங்கள் - 180 நாட்கள்) */}
      {selectedPlanTab === 'six_months_plan' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 p-5 sm:p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    நாள் {sixMonthsDay} / 180
                  </span>
                  <span className="text-xs text-slate-400">
                    (முழு பைபிள் 6 மாத திட்டம்)
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-amber-400 font-['Mukta_Malar',sans-serif]">
                  {sixMonthsDayPlan.titleTa}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  {sixMonthsDayPlan.titleEn}
                </p>
              </div>

              {/* Day navigator */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <button
                  onClick={() => onSetPlanDay('six_months_plan', Math.max(1, sixMonthsDay - 1))}
                  disabled={sixMonthsDay <= 1}
                  className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-slate-200 border border-slate-700 transition-all"
                  title="முந்தைய நாள்"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="px-3 py-1.5 bg-slate-950 rounded-lg text-xs font-mono font-bold text-slate-300 border border-slate-800">
                  {sixMonthsDay} / 180
                </div>
                <button
                  onClick={() => onSetPlanDay('six_months_plan', Math.min(180, sixMonthsDay + 1))}
                  disabled={sixMonthsDay >= 180}
                  className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-slate-200 border border-slate-700 transition-all"
                  title="அடுத்த நாள்"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List of Chapters for the day */}
            <div className="my-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  இன்றைய வாசிப்பு அதிகாரங்கள் ({sixMonthsDayCompletedCount}/{allSixMonthsDayChapters.length} முடிந்தது)
                </span>
                <span className="text-xs text-amber-400 font-bold">
                  {Math.round((sixMonthsDayCompletedCount / allSixMonthsDayChapters.length) * 100)}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {allSixMonthsDayChapters.map((ch, idx) => {
                  const isDone = !!state.readChapters[`${ch.bookId}_${ch.chapter}`];
                  const b = BIBLE_BOOKS.find(x => x.id === ch.bookId);

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isDone
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                          : 'bg-slate-800/80 border-slate-700 text-slate-200'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold">
                          {b?.nameTa} அதிகாரம் {ch.chapter}
                        </div>
                        <div className="text-xs text-slate-400">
                          {b?.nameEn} Chapter {ch.chapter}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenPassage(ch.bookId, ch.chapter)}
                          className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold rounded-lg border border-amber-500/40 flex items-center gap-1"
                        >
                          <span>திறக்க</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row gap-3">
              <button
                id="btn-plan-open-six-months"
                onClick={() => {
                  const first = allSixMonthsDayChapters[0];
                  if (first) onOpenPassage(first.bookId, first.chapter);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg transition-all active:scale-95 text-sm sm:text-base"
              >
                <BookOpen className="w-4 h-4" />
                <span>இன்று படிக்க வேண்டிய passage நேரடியாக திறக்கவும்</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-mark-six-months-day-all-done"
                onClick={() => onMarkChaptersBatch(allSixMonthsDayChapters, !isSixMonthsDayFullyDone)}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border font-bold text-sm transition-all ${
                  isSixMonthsDayFullyDone
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isSixMonthsDayFullyDone ? 'அனைத்தும் முடிந்தது' : 'இன்றைய அதிகாரங்கள் அனைத்தையும் முடித்தேன்'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PLAN 5 CONTENT: முழு பைபிள் (3 மாதங்கள் - 90 நாட்கள்) */}
      {selectedPlanTab === 'three_months_plan' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 p-5 sm:p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    நாள் {threeMonthsDay} / 90
                  </span>
                  <span className="text-xs text-slate-400">
                    (முழு பைபிள் 3 மாத தீவிர திட்டம்)
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-amber-400 font-['Mukta_Malar',sans-serif]">
                  {threeMonthsDayPlan.titleTa}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  {threeMonthsDayPlan.titleEn}
                </p>
              </div>

              {/* Day navigator */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <button
                  onClick={() => onSetPlanDay('three_months_plan', Math.max(1, threeMonthsDay - 1))}
                  disabled={threeMonthsDay <= 1}
                  className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-slate-200 border border-slate-700 transition-all"
                  title="முந்தைய நாள்"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="px-3 py-1.5 bg-slate-950 rounded-lg text-xs font-mono font-bold text-slate-300 border border-slate-800">
                  {threeMonthsDay} / 90
                </div>
                <button
                  onClick={() => onSetPlanDay('three_months_plan', Math.min(90, threeMonthsDay + 1))}
                  disabled={threeMonthsDay >= 90}
                  className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-slate-200 border border-slate-700 transition-all"
                  title="அடுத்த நாள்"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List of Chapters for the day */}
            <div className="my-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  இன்றைய வாசிப்பு அதிகாரங்கள் ({threeMonthsDayCompletedCount}/{allThreeMonthsDayChapters.length} முடிந்தது)
                </span>
                <span className="text-xs text-amber-400 font-bold">
                  {Math.round((threeMonthsDayCompletedCount / allThreeMonthsDayChapters.length) * 100)}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                {allThreeMonthsDayChapters.map((ch, idx) => {
                  const isDone = !!state.readChapters[`${ch.bookId}_${ch.chapter}`];
                  const b = BIBLE_BOOKS.find(x => x.id === ch.bookId);

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isDone
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                          : 'bg-slate-800/80 border-slate-700 text-slate-200'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold">
                          {b?.nameTa} அதிகாரம் {ch.chapter}
                        </div>
                        <div className="text-xs text-slate-400">
                          {b?.nameEn} Chapter {ch.chapter}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenPassage(ch.bookId, ch.chapter)}
                          className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold rounded-lg border border-amber-500/40 flex items-center gap-1"
                        >
                          <span>திறக்க</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row gap-3">
              <button
                id="btn-plan-open-three-months"
                onClick={() => {
                  const first = allThreeMonthsDayChapters[0];
                  if (first) onOpenPassage(first.bookId, first.chapter);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg transition-all active:scale-95 text-sm sm:text-base"
              >
                <BookOpen className="w-4 h-4" />
                <span>இன்று படிக்க வேண்டிய passage நேரடியாக திறக்கவும்</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-mark-three-months-day-all-done"
                onClick={() => onMarkChaptersBatch(allThreeMonthsDayChapters, !isThreeMonthsDayFullyDone)}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border font-bold text-sm transition-all ${
                  isThreeMonthsDayFullyDone
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isThreeMonthsDayFullyDone ? 'அனைத்தும் முடிந்தது' : 'இன்றைய அதிகாரங்கள் அனைத்தையும் முடித்தேன்'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

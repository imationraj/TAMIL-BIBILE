import React from 'react';
import { BIBLE_BOOKS, BibleBook } from '../data/bibleData';
import { ReadingState } from '../types';
import { ArrowLeft, CheckCircle2, ChevronRight, Check, BookOpen } from 'lucide-react';

interface ChapterScreenProps {
  bookId: number;
  state: ReadingState;
  onBack: () => void;
  onSelectChapter: (chapterNumber: number) => void;
  onToggleWholeChapter: (bookId: number, chapterNumber: number) => void;
  onMarkAllBookChapters: (bookId: number, markRead: boolean) => void;
  onReadBibleChapter?: (bookId: number, chapterNumber: number) => void;
}

export const ChapterScreen: React.FC<ChapterScreenProps> = ({
  bookId,
  state,
  onBack,
  onSelectChapter,
  onToggleWholeChapter,
  onMarkAllBookChapters,
  onReadBibleChapter
}) => {
  const book = BIBLE_BOOKS.find(b => b.id === bookId) || BIBLE_BOOKS[0];

  // Calculate book level statistics
  let totalVersesRead = 0;
  let completedChaptersCount = 0;

  for (let c = 1; c <= book.chaptersCount; c++) {
    const totalInChap = book.chapterVerses[c - 1] || 25;
    const isChapterMarked = !!state.readChapters[`${book.id}_${c}`];
    let chapVerses = 0;

    for (let v = 1; v <= totalInChap; v++) {
      if (state.readVerses[`${book.id}_${c}_${v}`] || isChapterMarked) {
        chapVerses++;
      }
    }
    totalVersesRead += chapVerses;
    if (isChapterMarked || chapVerses === totalInChap) {
      completedChaptersCount++;
    }
  }

  const bookPercent = Math.round((totalVersesRead / book.totalVerses) * 100);
  const isBookFullyRead = completedChaptersCount === book.chaptersCount;

  // Array of chapters: [1, 2, 3, ..., book.chaptersCount]
  const chapters = Array.from({ length: book.chaptersCount }, (_, i) => i + 1);

  return (
    <div id="chapters-screen-container" className="space-y-4 pb-24 sm:pb-12 max-w-5xl mx-auto px-3 sm:px-6 pt-4">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button
          id="btn-back-to-books"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 py-2 px-3 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-600 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>புத்தகங்கள் பட்டியல்</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Direct Read Bible Button */}
          {onReadBibleChapter && (
            <button
              id="btn-read-bible-from-chapters"
              onClick={() => onReadBibleChapter(book.id, 1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 py-1.5 px-3 rounded-lg shadow-sm transition-all active:scale-95"
              title="வேதாகமத்தை நேரடியாக வாசிக்கவும்"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>வேதாகமத்தை வாசிக்க</span>
            </button>
          )}

          {/* Quick Book Mark All */}
          <button
            id="btn-toggle-entire-book"
            onClick={() => onMarkAllBookChapters(book.id, !isBookFullyRead)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
              isBookFullyRead
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-amber-500/50'
            }`}
          >
            {isBookFullyRead ? 'முழுவதும் முடிந்தது ✓' : 'முழுதும் குறிக்க'}
          </button>
        </div>
      </div>

      {/* Book Info Header Card */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-800 via-slate-800/90 to-slate-900 border border-slate-700 p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded bg-slate-700/60 text-slate-300 font-medium">
                {book.testament === 'OT' ? 'பழைய ஏற்பாடு' : 'புதிய ஏற்பாடு'} • {book.categoryTa}
              </span>
            </div>
            {/* Tamil + English format as requested */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-2 flex-wrap">
              <span>{book.nameTa}</span>
              <span className="text-lg sm:text-xl font-normal text-amber-400">
                ({book.nameEn})
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              மொத்தம்: {book.chaptersCount} அதிகாரங்கள் • {book.totalVerses} வசனங்கள்
            </p>
          </div>

          {/* Book Progress Pill */}
          <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3 sm:text-right min-w-[140px]">
            <div className="text-xs text-slate-400">வாசிப்பு நிலை</div>
            <div className="text-xl font-bold text-amber-400 flex sm:justify-end items-baseline gap-1">
              <span>{bookPercent}%</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {completedChaptersCount} / {book.chaptersCount} அதிகாரங்கள்
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden mt-4">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isBookFullyRead ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{ width: `${bookPercent}%` }}
          />
        </div>
      </div>

      {/* Screen 1 Title: அதிகாரங்கள்: 1, 2, 3, 4… */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-bold text-slate-200 flex items-center gap-2">
          <span>அதிகாரங்கள் (Chapters):</span>
          <span className="text-xs font-normal text-slate-400">
            அதிகாரத்தைத் தட்டி வசனங்களைப் பார்க்கவும்
          </span>
        </h2>
      </div>

      {/* Chapters Grid: 1, 2, 3, 4… (Responsive grid designed for 320px, 402px and wider) */}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
        {chapters.map((chapterNum) => {
          const totalInChap = book.chapterVerses[chapterNum - 1] || 25;
          const isChapterMarked = !!state.readChapters[`${book.id}_${chapterNum}`];

          // Count verses read in this chapter
          let chapVersesRead = 0;
          for (let v = 1; v <= totalInChap; v++) {
            if (state.readVerses[`${book.id}_${chapterNum}_${v}`] || isChapterMarked) {
              chapVersesRead++;
            }
          }

          const isFullyDone = isChapterMarked || chapVersesRead === totalInChap;
          const isPartiallyDone = !isFullyDone && chapVersesRead > 0;

          return (
            <div
              key={chapterNum}
              id={`chapter-card-${chapterNum}`}
              className={`rounded-xl border transition-all flex flex-col justify-between overflow-hidden relative ${
                isFullyDone
                  ? 'bg-emerald-950/30 border-emerald-500/60 shadow-sm'
                  : isPartiallyDone
                  ? 'bg-slate-800/90 border-amber-500/60 shadow-sm'
                  : 'bg-slate-800/60 border-slate-700/70 hover:border-slate-600 hover:bg-slate-800'
              }`}
            >
              {/* Top Chapter Clickable Section - opens Screen 2 on click, Bible reader on double click */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => onSelectChapter(chapterNum)}
                onDoubleClick={() => onReadBibleChapter && onReadBibleChapter(book.id, chapterNum)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectChapter(chapterNum);
                  }
                }}
                className="p-3 text-left w-full focus:outline-none focus:ring-1 focus:ring-amber-500/50 group flex-1 cursor-pointer"
                title="வசன சரிபார்ப்புக்கு கிளிக் செய்யவும் • வேதாகமத்தை நேரடியாக வாசிக்க டபுள் கிளிக் (Double click) செய்யவும்"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-amber-400 transition-colors">
                    அதிகாரம்
                  </span>
                  <div className="flex items-center gap-1">
                    {onReadBibleChapter && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onReadBibleChapter(book.id, chapterNum);
                        }}
                        title="வேதாகமத்தில் வாசிக்க"
                        className="p-1 rounded hover:bg-slate-700 text-amber-400/80 hover:text-amber-300 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isFullyDone && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                </div>

                <div className="text-2xl font-black text-slate-100 group-hover:text-amber-400 transition-colors">
                  {chapterNum}
                </div>

                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>{chapVersesRead} / {totalInChap} வசனங்கள்</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Bottom Quick-Toggle Bar: Mark chapter as completed directly */}
              <button
                id={`btn-quick-toggle-chapter-${chapterNum}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWholeChapter(book.id, chapterNum);
                }}
                title={isFullyDone ? 'முடிக்கப்பட்டது என நீக்கு' : 'முழு அதிகாரத்தையும் முடித்ததாக குறி'}
                className={`w-full py-1.5 px-2 text-[11px] font-semibold border-t flex items-center justify-center gap-1 transition-colors ${
                  isFullyDone
                    ? 'bg-emerald-600/30 border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/40'
                    : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Check className="w-3 h-3" />
                <span>{isFullyDone ? 'முழுதும் முடிந்தது' : 'முழுதும் குறிக்க'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

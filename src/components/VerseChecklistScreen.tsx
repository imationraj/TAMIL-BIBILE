import React from 'react';
import { BIBLE_BOOKS, BibleBook } from '../data/bibleData';
import { ReadingState } from '../types';
import { ArrowLeft, Check, CheckCheck, X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface VerseChecklistScreenProps {
  bookId: number;
  chapterNumber: number;
  highlightStartVerse?: number;
  state: ReadingState;
  onBackToChapters: () => void;
  onNavigateChapter: (newChapter: number) => void;
  onToggleVerse: (bookId: number, chapterNumber: number, verseNumber: number) => void;
  onSelectAllVersesInChapter: (bookId: number, chapterNumber: number, selectAll: boolean) => void;
  onOpenBibleReader?: (bookId: number, chapterNumber: number, verseNumber?: number) => void;
}

export const VerseChecklistScreen: React.FC<VerseChecklistScreenProps> = ({
  bookId,
  chapterNumber,
  highlightStartVerse,
  state,
  onBackToChapters,
  onNavigateChapter,
  onToggleVerse,
  onSelectAllVersesInChapter,
  onOpenBibleReader
}) => {
  const book = BIBLE_BOOKS.find(b => b.id === bookId) || BIBLE_BOOKS[0];
  const totalVersesInChapter = book.chapterVerses[chapterNumber - 1] || 25;
  const isWholeChapterMarked = !!state.readChapters[`${book.id}_${chapterNumber}`];

  // Count marked verses in this chapter
  let markedVersesCount = 0;
  for (let v = 1; v <= totalVersesInChapter; v++) {
    if (state.readVerses[`${book.id}_${chapterNumber}_${v}`] || isWholeChapterMarked) {
      markedVersesCount++;
    }
  }

  const isAllMarked = isWholeChapterMarked || markedVersesCount === totalVersesInChapter;
  const chapterPercent = Math.round((markedVersesCount / totalVersesInChapter) * 100);

  // Array of verse numbers: [1, 2, 3, ..., totalVersesInChapter]
  const verseNumbers = Array.from({ length: totalVersesInChapter }, (_, i) => i + 1);

  return (
    <div id="verse-checklist-screen" className="space-y-4 pb-24 sm:pb-12 max-w-5xl mx-auto px-3 sm:px-6 pt-4">
      {/* Navigation Breadcrumb & Back */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button
          id="btn-back-to-chapters"
          onClick={onBackToChapters}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 py-2 px-3 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-600 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{book.nameTa} அதிகாரங்கள்</span>
        </button>

        {/* Previous & Next Chapter Quick Navigation + Bible Reader Button */}
        <div className="flex items-center gap-2">
          {onOpenBibleReader && (
            <button
              id="btn-open-bible-reader-from-checklist"
              onClick={() => onOpenBibleReader(book.id, chapterNumber, 1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 py-2 px-3 rounded-lg shadow-sm transition-all active:scale-95"
              title="வேதாகமத்தை நேரடியாக வாசிக்கவும் (Tamil Bible O.V.)"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>வேதாகமத்தில் வாசிக்க</span>
            </button>
          )}

          <div className="flex items-center gap-1">
            <button
              id="btn-prev-chapter"
              disabled={chapterNumber <= 1}
              onClick={() => onNavigateChapter(chapterNumber - 1)}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-slate-100 disabled:opacity-40 disabled:pointer-events-none text-xs flex items-center gap-1"
              title="முந்தைய அதிகாரம்"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden xs:inline">முந்தையது</span>
            </button>

            <span className="text-xs font-bold px-2 text-slate-300">
              {chapterNumber} / {book.chaptersCount}
            </span>

            <button
              id="btn-next-chapter"
              disabled={chapterNumber >= book.chaptersCount}
              onClick={() => onNavigateChapter(chapterNumber + 1)}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-slate-100 disabled:opacity-40 disabled:pointer-events-none text-xs flex items-center gap-1"
              title="அடுத்த அதிகாரம்"
            >
              <span className="hidden xs:inline">அடுத்தது</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chapter Details Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-800 via-slate-800/90 to-slate-900 border border-slate-700 p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-amber-400 font-semibold mb-1">
              வசன சரிபார்ப்புப் பட்டியல் (Verse Checklist)
            </div>
            {/* Tamil + English title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-2 flex-wrap">
              <span>{book.nameTa}</span>
              <span className="text-amber-400 font-normal">({book.nameEn})</span>
              <span className="text-xl sm:text-2xl text-slate-300">
                - அதிகாரம் {chapterNumber}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              இந்த அதிகாரத்தில் மொத்தம் <span className="text-amber-400 font-bold">{totalVersesInChapter}</span> வசனங்கள் உள்ளன.
            </p>
          </div>

          {/* Chapter Status Box */}
          <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3 sm:text-right min-w-[150px]">
            <div className="text-xs text-slate-400">இந்த அதிகாரத்தின் நிலை</div>
            <div className="text-xl font-bold text-emerald-400 flex sm:justify-end items-baseline gap-1">
              <span>{markedVersesCount}</span>
              <span className="text-xs font-normal text-slate-400">/ {totalVersesInChapter} ({chapterPercent}%)</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {isAllMarked ? '✓ முழுதும் முடிந்தது' : `${totalVersesInChapter - markedVersesCount} வசனங்கள் மீதம்`}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden mt-4">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isAllMarked ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{ width: `${chapterPercent}%` }}
          />
        </div>
      </div>

      {/* Action Bar: Select All / Deselect All */}
      <div className="flex items-center justify-between gap-2 p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl flex-wrap">
        <div className="text-xs text-slate-300 font-medium">
          <span>வசனத்தை வாசித்ததாக குறிக்க கிளிக் செய்க • உரையை வாசிக்க </span>
          <span className="text-amber-400 font-bold">டபுள் கிளிக் (Double Click)</span>
          <span> செய்க</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-select-all-verses"
            onClick={() => onSelectAllVersesInChapter(book.id, chapterNumber, true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all active:scale-95"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>அனைத்தும் தேர்வு செய்</span>
          </button>

          <button
            id="btn-deselect-all-verses"
            onClick={() => onSelectAllVersesInChapter(book.id, chapterNumber, false)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-all active:scale-95"
          >
            <X className="w-3.5 h-3.5" />
            <span>அனைத்தும் நீக்கு</span>
          </button>
        </div>
      </div>

      {/* Screen 2: வசனங்கள்: 1, 2, 3, 4… (Verse checklist grid) */}
      <div className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-2.5">
        {verseNumbers.map((vNum) => {
          const isRead = !!state.readVerses[`${book.id}_${chapterNumber}_${vNum}`] || isWholeChapterMarked;
          const isHighlighted = highlightStartVerse !== undefined && vNum >= highlightStartVerse && vNum <= highlightStartVerse + 9;

          return (
            <button
              key={vNum}
              id={`verse-btn-${vNum}`}
              onClick={() => onToggleVerse(book.id, chapterNumber, vNum)}
              onDoubleClick={() => onOpenBibleReader && onOpenBibleReader(book.id, chapterNumber, vNum)}
              title={`வசனம் ${vNum}: குறிக்க ஒருமுறை கிளிக் • வேதாகமத்தில் வாசிக்க டபுள் கிளிக் (Double Click)`}
              className={`min-h-[48px] sm:min-h-[52px] rounded-xl font-bold flex flex-col items-center justify-center p-1.5 transition-all relative border active:scale-95 select-none ${
                isRead
                  ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-900/30'
                  : isHighlighted
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-400 text-amber-300 ring-2 ring-amber-400/40'
                  : 'bg-slate-800 hover:bg-slate-700/90 border-slate-700 text-slate-200 hover:border-slate-600'
              }`}
            >
              {/* Verse Number */}
              <span className="text-base sm:text-lg leading-none font-black">
                {vNum}
              </span>

              {/* Sub status */}
              <span className="text-[9px] mt-0.5 leading-none flex items-center gap-0.5 font-medium opacity-90">
                {isRead ? (
                  <>
                    <Check className="w-2.5 h-2.5" />
                    <span>முடிந்தது</span>
                  </>
                ) : (
                  <span>வசனம்</span>
                )}
              </span>

              {/* Highlight badge if part of today's target */}
              {isHighlighted && !isRead && (
                <span className="absolute -top-1.5 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-900 animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Chapter Navigation Shortcuts */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          disabled={chapterNumber <= 1}
          onClick={() => onNavigateChapter(chapterNumber - 1)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 text-xs sm:text-sm font-semibold disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>முந்தைய அதிகாரம் ({chapterNumber > 1 ? chapterNumber - 1 : 1})</span>
        </button>

        <button
          disabled={chapterNumber >= book.chaptersCount}
          onClick={() => onNavigateChapter(chapterNumber + 1)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold disabled:opacity-40 disabled:pointer-events-none shadow-md"
        >
          <span>அடுத்த அதிகாரம் ({chapterNumber < book.chaptersCount ? chapterNumber + 1 : book.chaptersCount})</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

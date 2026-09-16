import React, { useState, useMemo, useRef, useEffect } from 'react';
import { BIBLE_BOOKS, BibleBook } from '../data/bibleData';
import { ReadingState } from '../types';
import { getBookProgress } from '../utils/storage';
import { Search, ChevronRight, CheckCircle2, X, Sparkles, BookOpen } from 'lucide-react';

interface BooksListProps {
  state: ReadingState;
  onSelectBook: (bookId: number) => void;
  onOpenBible?: (bookId: number, chapter: number) => void;
}

export const BooksList: React.FC<BooksListProps> = ({ state, onSelectBook, onOpenBible }) => {
  const [filterTestament, setFilterTestament] = useState<'ALL' | 'OT' | 'NT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut '/' to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter books based on testament and search query
  const filteredBooks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return BIBLE_BOOKS.filter(book => {
      // Filter testament
      if (filterTestament === 'OT' && book.testament !== 'OT') return false;
      if (filterTestament === 'NT' && book.testament !== 'NT') return false;

      // Filter search query
      if (q) {
        const matchesTa = book.nameTa.toLowerCase().includes(q);
        const matchesEn = book.nameEn.toLowerCase().includes(q);
        const matchesCat = book.categoryTa.toLowerCase().includes(q);
        const matchesId = String(book.id) === q;
        return matchesTa || matchesEn || matchesCat || matchesId;
      }
      return true;
    });
  }, [filterTestament, searchQuery]);

  // Handle Enter key to select first result immediately
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredBooks.length > 0) {
      e.preventDefault();
      onSelectBook(filteredBooks[0].id);
    }
  };

  return (
    <div id="books-list-container" className="space-y-4 pb-24 sm:pb-12 max-w-5xl mx-auto px-3 sm:px-6 pt-4">
      {/* Header with Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
            <span>66 வேத புத்தகங்கள்</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {filteredBooks.length} / 66
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            தமிழ் மற்றும் ஆங்கிலப் பெயர்களில் புத்தகங்களைத் தேடி அதிகாரங்களை வாசியுங்கள்
          </p>
        </div>
      </div>

      {/* GLOBAL SEARCH BAR */}
      <div className="relative group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-amber-400">
          <Search className="w-4 h-4" />
        </div>

        <input
          ref={searchInputRef}
          id="books-global-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="புத்தகத்தின் தமிழ் அல்லது ஆங்கிலப் பெயரைத் தேடுங்கள்... (எ.கா: ஆதியாகமம், Genesis, யோவான், John)"
          className="w-full bg-slate-800/95 border-2 border-slate-700/80 hover:border-slate-600 focus:border-amber-500 rounded-2xl pl-10 pr-24 py-3 text-sm sm:text-base text-slate-100 placeholder:text-slate-400 focus:outline-none transition-all shadow-inner focus:ring-2 focus:ring-amber-500/20"
        />

        {/* Right side controls: Clear button & Match count badge */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {searchQuery && (
            <button
              id="btn-clear-search"
              onClick={() => {
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              className="p-1 rounded-full bg-slate-700/80 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
              title="தேடலை அழிக்க (Clear)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="hidden sm:flex items-center text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700/80">
            {searchQuery ? `${filteredBooks.length} முடிவுகள்` : 'விரைவு விசை: /'}
          </div>
        </div>
      </div>

      {/* Filter Tabs: All, OT, NT */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          id="btn-filter-all"
          onClick={() => setFilterTestament('ALL')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            filterTestament === 'ALL'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          அனைத்தும் (66)
        </button>
        <button
          id="btn-filter-ot"
          onClick={() => setFilterTestament('OT')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            filterTestament === 'OT'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          பழைய ஏற்பாடு (39)
        </button>
        <button
          id="btn-filter-nt"
          onClick={() => setFilterTestament('NT')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            filterTestament === 'NT'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          புதிய ஏற்பாடு (27)
        </button>

        {/* Quick hint if results found with Enter shortcut */}
        {searchQuery && filteredBooks.length > 0 && (
          <span className="hidden md:inline-block text-[11px] text-amber-400/90 ml-auto whitespace-nowrap">
            முதல் புத்தகத்தை உடனே திறக்க <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono">Enter</kbd> அழுத்தவும்
          </span>
        )}
      </div>

      {/* Books Grid - Mobile friendly */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
        {filteredBooks.map((book: BibleBook) => {
          const progress = getBookProgress(book.id, state);
          const isCompleted = progress.chaptersRead === book.chaptersCount;

          return (
            <div
              key={book.id}
              id={`book-item-${book.id}`}
              role="button"
              tabIndex={0}
              onClick={() => onSelectBook(book.id)}
              onDoubleClick={() => onOpenBible && onOpenBible(book.id, 1)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectBook(book.id);
                }
              }}
              title="அதிகாரங்களை பார்க்க கிளிக் செய்க • வேதாகமத்தை வாசிக்க டபுள் கிளிக் (Double Click) செய்க"
              className={`p-3.5 rounded-xl border text-left transition-all group flex flex-col justify-between relative overflow-hidden cursor-pointer active:scale-[0.99] focus:outline-none focus:ring-1 focus:ring-amber-500/50 ${
                isCompleted
                  ? 'bg-slate-800/90 border-emerald-500/50 hover:border-emerald-400'
                  : 'bg-slate-800/70 border-slate-700/70 hover:border-amber-500/60 hover:bg-slate-800'
              }`}
            >
              {/* Subtle top indicator */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  {/* Category Tag */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-900/60 text-slate-400 border border-slate-700/50">
                      {book.testament === 'OT' ? 'பழைய ஏற்பாடு' : 'புதிய ஏற்பாடு'} • {book.categoryTa}
                    </span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>முடிந்தது</span>
                      </span>
                    )}
                  </div>

                  {/* Tamil + English format: ஆதியாகமம் (Genesis) */}
                  <div className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-amber-400 transition-colors flex items-center gap-1.5 flex-wrap">
                    <span>{book.nameTa}</span>
                    <span className="text-xs sm:text-sm font-normal text-slate-400">
                      ({book.nameEn})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-400 group-hover:text-amber-400 transition-colors pt-1">
                  {onOpenBible && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenBible(book.id, 1);
                      }}
                      title="வேதாகமத்தில் நேரடியாக வாசிக்க"
                      className="p-1 rounded hover:bg-slate-700 text-amber-400/80 hover:text-amber-300 transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                    </button>
                  )}
                  <span className="text-xs font-semibold">{progress.percent}%</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Counts & Progress bar */}
              <div className="mt-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                  <span>{book.chaptersCount} அதிகாரங்கள் • {book.totalVerses} வசனங்கள்</span>
                  <span>{progress.chaptersRead} / {book.chaptersCount} அதி. ({progress.versesRead} வசனம்)</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zero results state with clear button */}
      {filteredBooks.length === 0 && (
        <div className="text-center py-12 px-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-slate-400">
          <BookOpen className="w-10 h-10 mx-auto text-slate-500 mb-3 opacity-60" />
          <p className="text-base font-semibold text-slate-200">
            "{searchQuery}" என்ற பெயரில் புத்தகம் எதுவும் கிடைக்கவில்லை
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            தமிழ் அல்லது ஆங்கிலத்தில் புத்தகத்தின் பெயரைச் சரியாக தட்டச்சு செய்யவும். (உதாரணம்: ஆதியாகமம், Genesis, மத்தேயு, Matthew, சங்கீதம், Psalms)
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30 transition-all"
          >
            தேடலை நீக்குக (Clear Search)
          </button>
        </div>
      )}
    </div>
  );
};

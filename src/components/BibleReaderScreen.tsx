import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BIBLE_BOOKS } from '../data/bibleData';
import { ReadingState } from '../types';
import { 
  getChapterVerses, 
  BibleVerse, 
  AVAILABLE_VERSIONS, 
  copyVerseToClipboard, 
  shareVerse, 
  speakTamilVerse, 
  stopSpeaking 
} from '../services/bibleService';
import { calculateBibleStats } from '../utils/storage';
import { 
  getDailyTenVersesPassage, 
  getDailyOneChapterPassage, 
  YEARLY_BIBLE_PLAN, 
  SIX_MONTHS_BIBLE_PLAN,
  THREE_MONTHS_BIBLE_PLAN,
  getCurrentDayOfYear 
} from '../data/readingPlans';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Check, 
  CheckCheck, 
  Copy, 
  Share2, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2,
  Target,
  Calendar,
  Compass,
  ArrowRight
} from 'lucide-react';

interface BibleReaderScreenProps {
  initialBookId?: number;
  initialChapter?: number;
  initialVerse?: number;
  state: ReadingState;
  onToggleVerse: (bookId: number, chapterNumber: number, verseNumber: number) => void;
  onToggleWholeChapter: (bookId: number, chapterNumber: number) => void;
  onBackToBooks?: () => void;
  onOpenChecklist?: (bookId: number, chapterNumber: number) => void;
}

export const BibleReaderScreen: React.FC<BibleReaderScreenProps> = ({
  initialBookId = 1,
  initialChapter = 1,
  initialVerse,
  state,
  onToggleVerse,
  onToggleWholeChapter,
  onBackToBooks,
  onOpenChecklist
}) => {
  const [selectedBookId, setSelectedBookId] = useState<number>(initialBookId);
  const [selectedChapter, setSelectedChapter] = useState<number>(initialChapter);
  const [selectedVersion, setSelectedVersion] = useState<string>('TBSI'); // Tamil Old Version (O.V. / Union Version)
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Audio speech tracking
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingVerseNumber, setSpeakingVerseNumber] = useState<number | null>(null);

  // Toast notification for copy
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Chapter search filter
  const [verseFilter, setVerseFilter] = useState<string>('');

  // Reader typography preferences
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');

  // Book data
  const currentBook = useMemo(() => {
    return BIBLE_BOOKS.find(b => b.id === selectedBookId) || BIBLE_BOOKS[0];
  }, [selectedBookId]);

  // Ref to highlighted verse element
  const verseElementsRef = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Sync initial props if changed
  useEffect(() => {
    if (initialBookId) setSelectedBookId(initialBookId);
    if (initialChapter) setSelectedChapter(initialChapter);
  }, [initialBookId, initialChapter]);

  // Load chapter verses
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);
    stopSpeaking();
    setIsSpeaking(false);
    setSpeakingVerseNumber(null);

    getChapterVerses(selectedBookId, selectedChapter, selectedVersion)
      .then((data) => {
        if (!isCancelled) {
          if (data.length > 0) {
            setVerses(data);
          } else {
            // Generate fallback structure with chapter total verses
            const totalInChap = currentBook.chapterVerses[selectedChapter - 1] || 25;
            const fallbackList: BibleVerse[] = Array.from({ length: totalInChap }, (_, i) => ({
              verse: i + 1,
              text: `${currentBook.nameTa} அதிகாரம் ${selectedChapter}, வசனம் ${i + 1}. (இணைய இணைப்பு உள்ளபோது முழுமையான வேத உரை உடனடியாக தோன்றும்)`
            }));
            setVerses(fallbackList);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setError('வசனங்களை ஏற்றுவதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.');
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      stopSpeaking();
    };
  }, [selectedBookId, selectedChapter, selectedVersion, currentBook]);

  // Scroll to initial verse if provided
  useEffect(() => {
    if (initialVerse && !loading && verses.length > 0) {
      setTimeout(() => {
        const el = verseElementsRef.current[initialVerse];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [initialVerse, loading, verses]);

  // Is whole chapter marked as read in tracker
  const isWholeChapterMarked = !!state.readChapters[`${selectedBookId}_${selectedChapter}`];

  // Count how many verses read in this chapter
  const versesReadInChapter = useMemo(() => {
    return verses.filter(v => 
      isWholeChapterMarked || !!state.readVerses[`${selectedBookId}_${selectedChapter}_${v.verse}`]
    ).length;
  }, [verses, state.readVerses, state.readChapters, selectedBookId, selectedChapter, isWholeChapterMarked]);

  const chapterTotalVerses = verses.length > 0 ? verses.length : (currentBook.chapterVerses[selectedChapter - 1] || 25);
  const chapterBalance = Math.max(0, chapterTotalVerses - versesReadInChapter);

  // Overall Bible reading stats & total balance
  const stats = useMemo(() => calculateBibleStats(state), [state]);
  const totalBibleVersesBalance = Math.max(0, 31102 - stats.totalVersesRead);
  const totalBibleChaptersBalance = Math.max(0, 1189 - stats.totalChaptersRead);

  // Reading Plan details
  const currentDayOfYear = useMemo(() => getCurrentDayOfYear(), []);

  // 1. Ten Verses Plan details:
  const tenVersesPassage = useMemo(() => getDailyTenVersesPassage(state.tenVersesDay), [state.tenVersesDay]);
  let tenVersesReadCount = 0;
  if (tenVersesPassage.startVerse && tenVersesPassage.endVerse) {
    for (let v = tenVersesPassage.startVerse; v <= tenVersesPassage.endVerse; v++) {
      if (state.readVerses[`${tenVersesPassage.bookId}_${tenVersesPassage.chapter}_${v}`] || state.readChapters[`${tenVersesPassage.bookId}_${tenVersesPassage.chapter}`]) {
        tenVersesReadCount++;
      }
    }
  }
  const tenVersesBalance = Math.max(0, tenVersesPassage.totalVersesInPassage - tenVersesReadCount);
  const isViewingTenVersesPassage = selectedBookId === tenVersesPassage.bookId && selectedChapter === tenVersesPassage.chapter;

  // 2. One Chapter Plan details:
  const oneChapterPassage = useMemo(() => getDailyOneChapterPassage(state.oneChapterDay), [state.oneChapterDay]);
  const isOneChapterDone = !!state.readChapters[`${oneChapterPassage.bookId}_${oneChapterPassage.chapter}`];
  const isViewingOneChapterPassage = selectedBookId === oneChapterPassage.bookId && selectedChapter === oneChapterPassage.chapter;

  // 3. Yearly Plan details:
  const yearlyDay = state.yearlyPlanDay || currentDayOfYear;
  const yearlyDayPlan = YEARLY_BIBLE_PLAN[yearlyDay - 1] || YEARLY_BIBLE_PLAN[0];
  const allYearlyDayChapters = useMemo(() => {
    const list: { bookId: number; chapter: number; label: string }[] = [];
    yearlyDayPlan.passages.forEach(p => {
      for (let c = p.startChapter; c <= p.endChapter; c++) {
        list.push({ bookId: p.bookId, chapter: c, label: `${p.bookNameTa} ${c}` });
      }
    });
    return list;
  }, [yearlyDayPlan]);

  const yearlyDayCompletedCount = allYearlyDayChapters.filter(ch => 
    !!state.readChapters[`${ch.bookId}_${ch.chapter}`]
  ).length;
  const yearlyBalance = Math.max(0, allYearlyDayChapters.length - yearlyDayCompletedCount);
  const isViewingYearlyChapter = allYearlyDayChapters.some(ch => ch.bookId === selectedBookId && ch.chapter === selectedChapter);

  // 4. Six Months Plan details:
  const sixMonthsDay = Math.min(180, Math.max(1, state.sixMonthsPlanDay || 1));
  const sixMonthsDayPlan = SIX_MONTHS_BIBLE_PLAN[sixMonthsDay - 1] || SIX_MONTHS_BIBLE_PLAN[0];
  const allSixMonthsDayChapters = useMemo(() => {
    const list: { bookId: number; chapter: number; label: string }[] = [];
    sixMonthsDayPlan.passages.forEach(p => {
      for (let c = p.startChapter; c <= p.endChapter; c++) {
        list.push({ bookId: p.bookId, chapter: c, label: `${p.bookNameTa} ${c}` });
      }
    });
    return list;
  }, [sixMonthsDayPlan]);
  const sixMonthsDayCompletedCount = allSixMonthsDayChapters.filter(ch => 
    !!state.readChapters[`${ch.bookId}_${ch.chapter}`]
  ).length;
  const sixMonthsBalance = Math.max(0, allSixMonthsDayChapters.length - sixMonthsDayCompletedCount);
  const isViewingSixMonthsChapter = allSixMonthsDayChapters.some(ch => ch.bookId === selectedBookId && ch.chapter === selectedChapter);

  // 5. Three Months Plan details:
  const threeMonthsDay = Math.min(90, Math.max(1, state.threeMonthsPlanDay || 1));
  const threeMonthsDayPlan = THREE_MONTHS_BIBLE_PLAN[threeMonthsDay - 1] || THREE_MONTHS_BIBLE_PLAN[0];
  const allThreeMonthsDayChapters = useMemo(() => {
    const list: { bookId: number; chapter: number; label: string }[] = [];
    threeMonthsDayPlan.passages.forEach(p => {
      for (let c = p.startChapter; c <= p.endChapter; c++) {
        list.push({ bookId: p.bookId, chapter: c, label: `${p.bookNameTa} ${c}` });
      }
    });
    return list;
  }, [threeMonthsDayPlan]);
  const threeMonthsDayCompletedCount = allThreeMonthsDayChapters.filter(ch => 
    !!state.readChapters[`${ch.bookId}_${ch.chapter}`]
  ).length;
  const threeMonthsBalance = Math.max(0, allThreeMonthsDayChapters.length - threeMonthsDayCompletedCount);
  const isViewingThreeMonthsChapter = allThreeMonthsDayChapters.some(ch => ch.bookId === selectedBookId && ch.chapter === selectedChapter);

  // Is the current chapter in today's active plan passage?
  const isCurrentChapterInActivePlan = 
    state.activePlan === 'ten_verses' ? isViewingTenVersesPassage :
    state.activePlan === 'one_chapter' ? isViewingOneChapterPassage :
    state.activePlan === 'six_months_plan' ? isViewingSixMonthsChapter :
    state.activePlan === 'three_months_plan' ? isViewingThreeMonthsChapter :
    isViewingYearlyChapter;

  // Jump to today's active plan chapter
  const handleJumpToTodayPlan = () => {
    if (state.activePlan === 'ten_verses') {
      setSelectedBookId(tenVersesPassage.bookId);
      setSelectedChapter(tenVersesPassage.chapter);
    } else if (state.activePlan === 'one_chapter') {
      setSelectedBookId(oneChapterPassage.bookId);
      setSelectedChapter(oneChapterPassage.chapter);
    } else if (state.activePlan === 'six_months_plan') {
      const nextUnread = allSixMonthsDayChapters.find(ch => !state.readChapters[`${ch.bookId}_${ch.chapter}`]) || allSixMonthsDayChapters[0];
      if (nextUnread) {
        setSelectedBookId(nextUnread.bookId);
        setSelectedChapter(nextUnread.chapter);
      }
    } else if (state.activePlan === 'three_months_plan') {
      const nextUnread = allThreeMonthsDayChapters.find(ch => !state.readChapters[`${ch.bookId}_${ch.chapter}`]) || allThreeMonthsDayChapters[0];
      if (nextUnread) {
        setSelectedBookId(nextUnread.bookId);
        setSelectedChapter(nextUnread.chapter);
      }
    } else {
      // yearly plan: jump to first uncompleted chapter or first chapter
      const nextUnread = allYearlyDayChapters.find(ch => !state.readChapters[`${ch.bookId}_${ch.chapter}`]) || allYearlyDayChapters[0];
      if (nextUnread) {
        setSelectedBookId(nextUnread.bookId);
        setSelectedChapter(nextUnread.chapter);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered verses
  const displayedVerses = useMemo(() => {
    if (!verseFilter.trim()) return verses;
    const q = verseFilter.toLowerCase().trim();
    return verses.filter(v => 
      String(v.verse) === q || v.text.toLowerCase().includes(q)
    );
  }, [verses, verseFilter]);

  // DIRECT VERSE TOGGLE (No popup!)
  const handleVerseClick = (verse: BibleVerse) => {
    onToggleVerse(selectedBookId, selectedChapter, verse.verse);
  };

  // Copy single verse
  const handleCopyVerse = async (verse: BibleVerse, e: React.MouseEvent) => {
    e.stopPropagation();
    const ref = `${currentBook.nameTa} ${selectedChapter}:${verse.verse} (${currentBook.nameEn} ${selectedChapter}:${verse.verse})`;
    const fullText = `${ref} - "${verse.text}" (பரிசுத்த வேதாகமம் - Tamil O.V.)`;
    const success = await copyVerseToClipboard(fullText);
    if (success) {
      setCopiedToast(`வசனம் ${verse.verse} நகலெடுக்கப்பட்டது!`);
      setTimeout(() => setCopiedToast(null), 2000);
    }
  };

  // Speak single verse
  const handleSpeakVerse = (verse: BibleVerse, e: React.MouseEvent) => {
    e.stopPropagation();
    if (speakingVerseNumber === verse.verse && isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      setSpeakingVerseNumber(null);
    } else {
      stopSpeaking();
      speakTamilVerse(verse.text);
      setIsSpeaking(true);
      setSpeakingVerseNumber(verse.verse);
    }
  };

  // Share single verse via WhatsApp
  const handleShareVerse = (verse: BibleVerse, e: React.MouseEvent) => {
    e.stopPropagation();
    const ref = `${currentBook.nameTa} ${selectedChapter}:${verse.verse}`;
    shareVerse(ref, verse.text);
  };

  return (
    <div id="bible-reader-screen" className="pb-28 sm:pb-16 max-w-5xl mx-auto px-3 sm:px-6 pt-3 space-y-4">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 text-xs sm:text-sm animate-bounce">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* Top Header & Version Info */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl space-y-3">
        {/* Version Badge & Info */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>வேதாகமம் வாசிப்பு (Bible Reader)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  O.V. / Union Version
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                தமிழ் பழைய பதிப்பு (Tamil Older Version Bible - B.S.I.)
              </div>
            </div>
          </div>

          {/* Version Selector Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-slate-400 hidden sm:inline">மொழிபெயர்ப்பு:</label>
            <select
              id="bible-version-select"
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs font-semibold text-amber-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {AVAILABLE_VERSIONS.map(v => (
                <option key={v.code} value={v.code}>
                  {v.nameTa} ({v.nameEn})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Book & Chapter Pickers Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
          {/* Book Selector */}
          <div className="sm:col-span-6">
            <label className="text-[10px] text-slate-400 font-medium block mb-1">
              புத்தகம் (Book):
            </label>
            <select
              id="bible-reader-book-select"
              value={selectedBookId}
              onChange={(e) => {
                setSelectedBookId(Number(e.target.value));
                setSelectedChapter(1);
              }}
              className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-amber-500 rounded-xl px-3 py-2 text-sm font-bold text-slate-100 focus:outline-none cursor-pointer"
            >
              <optgroup label="பழைய ஏற்பாடு (Old Testament - 39)">
                {BIBLE_BOOKS.filter(b => b.testament === 'OT').map(b => (
                  <option key={b.id} value={b.id}>
                    {b.id}. {b.nameTa} ({b.nameEn})
                  </option>
                ))}
              </optgroup>
              <optgroup label="புதிய ஏற்பாடு (New Testament - 27)">
                {BIBLE_BOOKS.filter(b => b.testament === 'NT').map(b => (
                  <option key={b.id} value={b.id}>
                    {b.id}. {b.nameTa} ({b.nameEn})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Chapter Selector */}
          <div className="sm:col-span-3">
            <label className="text-[10px] text-slate-400 font-medium block mb-1">
              அதிகாரம் (Chapter):
            </label>
            <div className="flex items-center gap-1">
              <button
                disabled={selectedChapter <= 1}
                onClick={() => {
                  setSelectedChapter(prev => Math.max(1, prev - 1));
                }}
                className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none"
                title="முந்தைய அதிகாரம்"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <select
                id="bible-reader-chapter-select"
                value={selectedChapter}
                onChange={(e) => {
                  setSelectedChapter(Number(e.target.value));
                }}
                className="flex-1 bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-amber-500 rounded-xl px-2.5 py-2 text-sm font-bold text-slate-100 focus:outline-none text-center cursor-pointer"
              >
                {Array.from({ length: currentBook.chaptersCount }, (_, i) => i + 1).map(c => (
                  <option key={c} value={c}>
                    அதிகாரம் {c} / {currentBook.chaptersCount}
                  </option>
                ))}
              </select>

              <button
                disabled={selectedChapter >= currentBook.chaptersCount}
                onClick={() => {
                  setSelectedChapter(prev => Math.min(currentBook.chaptersCount, prev + 1));
                }}
                className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none"
                title="அடுத்த அதிகாரம்"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Font Size & Checklist button */}
          <div className="sm:col-span-3 flex items-center justify-end gap-2 pt-4 sm:pt-0">
            {/* Font sizing */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-0.5">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 text-xs rounded-lg transition-colors ${fontSize === 'normal' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                title="சிறிய எழுத்து"
              >
                அ
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${fontSize === 'large' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                title="நடுத்தர எழுத்து"
              >
                அ+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${fontSize === 'xlarge' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                title="பெரிய எழுத்து"
              >
                அ++
              </button>
            </div>

            {/* Open Verse Checklist */}
            {onOpenChecklist && (
              <button
                id="btn-open-verse-checklist-from-reader"
                onClick={() => onOpenChecklist(selectedBookId, selectedChapter)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                title="வசன சரிபார்ப்பு பட்டியல்"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden xs:inline">சரிபார்ப்பு</span>
              </button>
            )}
          </div>
        </div>

        {/* Search within chapter */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={verseFilter}
              onChange={(e) => setVerseFilter(e.target.value)}
              placeholder="அதிகாரத்தில் தேடுங்கள் (எ.கா: தேவன், 1)..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
            {verseFilter && (
              <button
                onClick={() => setVerseFilter('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* READING PLAN SYNC & BALANCE TRACKER (Integrated Directly with Bible Reading) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-amber-500/30 rounded-2xl p-3.5 sm:p-4 shadow-xl space-y-3">
        {/* Banner Title & Active Plan Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <span>வாசிப்புத் திட்ட நிலை & மீதம்</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Plan Synced ✓
                </span>
              </span>
              <span className="text-[11px] text-slate-400">
                மொபைலில் வாசிக்கும் போதே டிக் செய்தால் திட்டத்தில் உடனே சேர்க்கப்படும்
              </span>
            </div>
          </div>

          {/* Badge if current chapter is today's reading */}
          {isCurrentChapterInActivePlan ? (
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>இன்றைய திட்டப் பகுதி</span>
            </span>
          ) : (
            <button
              id="btn-jump-to-today-plan"
              onClick={handleJumpToTodayPlan}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1 transition-all"
              title="இன்றைய திட்டப் பகுதிக்கு செல்ல"
            >
              <span>இன்றைய திட்ட பகுதிக்குச் செல்</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* 3 Metric Progress & Balance Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: Current Chapter Balance */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3">
            <div className="text-[11px] font-medium text-slate-400">
              இந்த அதிகாரம் ({currentBook.nameTa} {selectedChapter})
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-black text-slate-100">
                {versesReadInChapter} / {chapterTotalVerses}
              </span>
              <span className={`text-xs font-bold ${chapterBalance === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {chapterBalance === 0 ? 'அதிகாரம் முடிந்தது ✓' : `மீதம்: ${chapterBalance} வசனங்கள்`}
              </span>
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full bg-slate-700/70 h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${chapterTotalVerses > 0 ? (versesReadInChapter / chapterTotalVerses) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Card 2: Today's Active Plan Target & Balance */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3">
            <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
              <span>
                {state.activePlan === 'ten_verses' ? 'தினசரி 10 வசன திட்டம்' :
                 state.activePlan === 'one_chapter' ? 'தினசரி 1 அதிகாரம்' : 
                 state.activePlan === 'six_months_plan' ? 'முழு பைபிள் (6 மாதம்)' :
                 state.activePlan === 'three_months_plan' ? 'முழு பைபிள் (3 மாதம்)' : 'வருட வாசிப்புத் திட்டம்'}
              </span>
              <span className="text-[10px] text-amber-400">
                {state.activePlan === 'ten_verses' ? `நாள் ${state.tenVersesDay}` :
                 state.activePlan === 'one_chapter' ? `நாள் ${state.oneChapterDay}` : 
                 state.activePlan === 'six_months_plan' ? `நாள் ${sixMonthsDay} / 180` :
                 state.activePlan === 'three_months_plan' ? `நாள் ${threeMonthsDay} / 90` : `நாள் ${yearlyDay} / 365`}
              </span>
            </div>

            {state.activePlan === 'ten_verses' && (
              <>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-lg font-black text-slate-100">
                    {tenVersesReadCount} / {tenVersesPassage.totalVersesInPassage}
                  </span>
                  <span className={`text-xs font-bold ${tenVersesBalance === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {tenVersesBalance === 0 ? 'இன்று முடிந்தது ✓' : `மீதம்: ${tenVersesBalance} வசனங்கள்`}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  இலக்கு: {tenVersesPassage.labelTa}
                </div>
              </>
            )}

            {state.activePlan === 'one_chapter' && (
              <>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-lg font-black text-slate-100">
                    {isOneChapterDone ? '1 / 1' : '0 / 1'}
                  </span>
                  <span className={`text-xs font-bold ${isOneChapterDone ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isOneChapterDone ? 'இன்று முடிந்தது ✓' : 'மீதம்: 1 அதிகாரம்'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  இலக்கு: {oneChapterPassage.labelTa}
                </div>
              </>
            )}

            {state.activePlan === 'six_months_plan' && (
              <>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-lg font-black text-slate-100">
                    {sixMonthsDayCompletedCount} / {allSixMonthsDayChapters.length}
                  </span>
                  <span className={`text-xs font-bold ${sixMonthsBalance === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {sixMonthsBalance === 0 ? 'இன்று முடிந்தது ✓' : `மீதம்: ${sixMonthsBalance} அதிகாரம்`}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  இலக்கு: {sixMonthsDayPlan.titleTa}
                </div>
              </>
            )}

            {state.activePlan === 'three_months_plan' && (
              <>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-lg font-black text-slate-100">
                    {threeMonthsDayCompletedCount} / {allThreeMonthsDayChapters.length}
                  </span>
                  <span className={`text-xs font-bold ${threeMonthsBalance === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {threeMonthsBalance === 0 ? 'இன்று முடிந்தது ✓' : `மீதம்: ${threeMonthsBalance} அதிகாரம்`}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  இலக்கு: {threeMonthsDayPlan.titleTa}
                </div>
              </>
            )}

            {state.activePlan === 'yearly_plan' && (
              <>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-lg font-black text-slate-100">
                    {yearlyDayCompletedCount} / {allYearlyDayChapters.length}
                  </span>
                  <span className={`text-xs font-bold ${yearlyBalance === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {yearlyBalance === 0 ? 'இன்று முடிந்தது ✓' : `மீதம்: ${yearlyBalance} அதிகாரம்`}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  இலக்கு: {yearlyDayPlan.passages.map(p => `${p.bookNameTa} ${p.startChapter}${p.endChapter > p.startChapter ? `-${p.endChapter}` : ''}`).join(', ')}
                </div>
              </>
            )}
          </div>

          {/* Card 3: Full Bible Total Progress & Remaining Balance */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3">
            <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
              <span>முழு வேதாகம வாசிப்பு</span>
              <span className="text-[10px] text-emerald-400 font-bold">{stats.percentVerses}%</span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-black text-slate-100">
                {stats.totalVersesRead.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-amber-300">
                மொத்த மீதம்: {totalBibleVersesBalance.toLocaleString()}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
              <span>அதிகாரங்கள்: {stats.totalChaptersRead} / 1,189</span>
              <span>மீதம்: {totalBibleChaptersBalance} அத்.</span>
            </div>
          </div>
        </div>

        {/* Quick Chapter Toggle Action Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          <div className="text-xs text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>வசனத்தின் மேல் தட்டினால் <strong>உடனே டிக் (Tick)</strong> ஆகும். எந்த பாப்-அப்பும் வராது!</span>
          </div>

          <button
            id="btn-toggle-reader-whole-chapter"
            onClick={() => onToggleWholeChapter(selectedBookId, selectedChapter)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              isWholeChapterMarked || versesReadInChapter === verses.length && verses.length > 0
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-600 hover:bg-slate-700'
            }`}
          >
            <CheckCheck className="w-4 h-4" />
            <span>
              {isWholeChapterMarked ? 'முழு அதிகாரமும் முடிந்தது ✓ (நீக்க கிளிக்)' : 'இந்த முழு அதிகாரத்தையும் குறிக்க'}
            </span>
          </button>
        </div>
      </div>

      {/* Verses Container */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-xl relative min-h-[360px]">
        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mb-3" />
            <p className="text-sm font-semibold text-slate-200">
              {currentBook.nameTa} {selectedChapter} - வேதாகம வசனங்கள் ஏற்றப்படுகின்றன...
            </p>
            <p className="text-xs text-slate-500 mt-1">Tamil Old Version (O.V. / Union Version)</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="text-center py-16 px-4">
            <p className="text-sm font-semibold text-rose-300">{error}</p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                getChapterVerses(selectedBookId, selectedChapter, selectedVersion).then(data => {
                  setVerses(data);
                  setLoading(false);
                });
              }}
              className="mt-3 px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
            >
              மீண்டும் முயற்சிக்க (Retry)
            </button>
          </div>
        )}

        {/* Scripture Content */}
        {!loading && !error && (
          <div className="space-y-4">
            {/* Chapter Heading */}
            <div className="text-center pb-4 border-b border-slate-800">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center justify-center gap-2">
                <span>{currentBook.nameTa}</span>
                <span className="text-amber-400">அதிகாரம் {selectedChapter}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {currentBook.nameEn} {selectedChapter} • {currentBook.testament === 'OT' ? 'பழைய ஏற்பாடு' : 'புதிய ஏற்பாடு'} • {selectedVersion === 'TBSI' ? 'Tamil Old Version (O.V.)' : selectedVersion}
              </p>
            </div>

            {/* Verses Flow */}
            <div className={`space-y-2.5 ${
              fontSize === 'normal' ? 'text-sm sm:text-base leading-relaxed' :
              fontSize === 'large' ? 'text-base sm:text-lg leading-loose' :
              'text-lg sm:text-xl leading-loose font-medium'
            }`}>
              {displayedVerses.map((verse) => {
                const isRead = isWholeChapterMarked || !!state.readVerses[`${selectedBookId}_${selectedChapter}_${verse.verse}`];
                const isThisSpeaking = speakingVerseNumber === verse.verse && isSpeaking;

                return (
                  <div
                    key={verse.verse}
                    ref={(el) => {
                      verseElementsRef.current[verse.verse] = el;
                    }}
                    id={`bible-verse-${verse.verse}`}
                    onClick={() => handleVerseClick(verse)}
                    title={isRead ? 'வாசிக்கப்பட்டது ✓ (டிக் நீக்க தட்டவும்)' : 'வாசித்ததாக குறிக்க தட்டவும்'}
                    className={`group p-3 sm:p-4 rounded-xl border transition-all cursor-pointer relative select-text ${
                      isRead
                        ? 'bg-emerald-950/20 border-emerald-500/40 hover:bg-emerald-950/30'
                        : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Verse Tick / Check Indicator */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleVerse(selectedBookId, selectedChapter, verse.verse);
                        }}
                        title={isRead ? 'வாசிக்கப்பட்டது ✓' : 'வாசித்ததாகக் குறிக்க'}
                        className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                          isRead
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 scale-105'
                            : 'bg-slate-800 text-amber-400 border border-slate-700 group-hover:border-amber-500/60'
                        }`}
                      >
                        {isRead ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <span>{verse.verse}</span>
                        )}
                      </button>

                      {/* Verse Text Content */}
                      <div className="flex-1 text-slate-100 pr-1">
                        <span className="font-semibold text-amber-400/80 mr-1.5 text-xs font-mono select-none">
                          {verse.verse}.
                        </span>
                        <span className={isRead ? 'text-slate-200' : 'text-slate-100'}>
                          {verse.text}
                        </span>
                      </div>

                      {/* Inline Action Buttons on Right (Copy, Listen, Share - NO POPUP) */}
                      <div 
                        className="flex items-center gap-1 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Audio Speak */}
                        <button
                          onClick={(e) => handleSpeakVerse(verse, e)}
                          title={isThisSpeaking ? 'நிறுத்து' : 'வசனத்தைக் கேள் (Audio)'}
                          className={`p-1.5 rounded-lg text-xs transition-colors ${
                            isThisSpeaking 
                              ? 'bg-amber-500 text-slate-950 font-bold animate-pulse' 
                              : 'bg-slate-800/90 text-slate-300 hover:text-amber-300 hover:bg-slate-700 border border-slate-700/60'
                          }`}
                        >
                          {isThisSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>

                        {/* Copy */}
                        <button
                          onClick={(e) => handleCopyVerse(verse, e)}
                          title="வசனத்தை நகலெடு (Copy)"
                          className="p-1.5 rounded-lg bg-slate-800/90 text-slate-300 hover:text-slate-100 hover:bg-slate-700 border border-slate-700/60 text-xs transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* WhatsApp Share */}
                        <button
                          onClick={(e) => handleShareVerse(verse, e)}
                          title="வாட்ஸ்அப்பில் பகிர (Share)"
                          className="p-1.5 rounded-lg bg-emerald-950/50 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/60 border border-emerald-500/30 text-xs transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {displayedVerses.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <p className="text-sm">"{verseFilter}" என்ற சொல் இந்த அதிகாரத்தில் காணப்படவில்லை.</p>
                <button
                  onClick={() => setVerseFilter('')}
                  className="mt-2 text-xs text-amber-400 underline"
                >
                  தேடலை நீக்கு
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bottom Chapter Navigation & Quick Mark Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-800">
          <button
            disabled={selectedChapter <= 1}
            onClick={() => {
              setSelectedChapter(prev => Math.max(1, prev - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>முந்தைய அதிகாரம் ({selectedChapter > 1 ? selectedChapter - 1 : 1})</span>
          </button>

          <div className="text-xs font-bold text-slate-400 text-center">
            {currentBook.nameTa} - அதிகாரம் {selectedChapter} / {currentBook.chaptersCount}
          </div>

          <button
            disabled={selectedChapter >= currentBook.chaptersCount}
            onClick={() => {
              setSelectedChapter(prev => Math.min(currentBook.chaptersCount, prev + 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold disabled:opacity-30 disabled:pointer-events-none transition-all shadow-md"
          >
            <span>அடுத்த அதிகாரம் ({selectedChapter < currentBook.chaptersCount ? selectedChapter + 1 : currentBook.chaptersCount})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

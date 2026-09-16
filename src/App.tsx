import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ViewMode, PlanType, ReadingState, UserProfile } from './types';
import { BIBLE_BOOKS } from './data/bibleData';
import { 
  loadReadingState, 
  saveReadingState, 
  calculateBibleStats, 
  getTodayDateString, 
  getDefaultReadingState 
} from './utils/storage';
import { loadUserProfile, saveUserProfile } from './utils/userProfile';
import { 
  getDailyTenVersesPassage, 
  getDailyOneChapterPassage, 
  YEARLY_BIBLE_PLAN, 
  SIX_MONTHS_BIBLE_PLAN,
  THREE_MONTHS_BIBLE_PLAN,
  getCurrentDayOfYear 
} from './data/readingPlans';

// Components
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { BooksList } from './components/BooksList';
import { ChapterScreen } from './components/ChapterScreen';
import { VerseChecklistScreen } from './components/VerseChecklistScreen';
import { DailyPlansScreen } from './components/DailyPlansScreen';
import { ReportsScreen } from './components/ReportsScreen';
import { AboutUsScreen } from './components/AboutUsScreen';
import { BibleReaderScreen } from './components/BibleReaderScreen';
import { EditProfileModal } from './components/EditProfileModal';
import { syncLeaderboardWithServer } from './services/leaderboardSync';

export default function App() {
  // Splash Screen display state (5 seconds display as requested)
  const [showSplash, setShowSplash] = useState(true);

  // Application reading state persisted in localStorage
  const [state, setState] = useState<ReadingState>(() => loadReadingState());

  // User Profile for Global Leaderboard (editable up to 12 chars)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => loadUserProfile());
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Current view and navigation state
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [selectedBookId, setSelectedBookId] = useState<number>(1);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [highlightStartVerse, setHighlightStartVerse] = useState<number | undefined>(undefined);
  const [readerInitialVerse, setReaderInitialVerse] = useState<number | undefined>(undefined);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveReadingState(state);
  }, [state]);

  // Compute accurate Bible and Streak statistics
  const stats = useMemo(() => calculateBibleStats(state), [state]);

  // Synchronize reading progress with live multi-user server
  useEffect(() => {
    const timer = setTimeout(() => {
      syncLeaderboardWithServer(userProfile, stats).catch((e) =>
        console.warn('Sync failed:', e)
      );
    }, 1200);
    return () => clearTimeout(timer);
  }, [userProfile, stats]);

  // Handle navigation
  const handleNavigate = useCallback((view: ViewMode) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // When user clicks a book from BooksList
  const handleSelectBook = useCallback((bookId: number) => {
    setSelectedBookId(bookId);
    setCurrentView('chapters');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // When user clicks a chapter from ChapterScreen (Screen 1 -> Screen 2)
  const handleSelectChapter = useCallback((chapterNumber: number) => {
    setSelectedChapter(chapterNumber);
    setHighlightStartVerse(undefined);
    setCurrentView('verses');

    // Update lastRead
    setState(prev => ({
      ...prev,
      lastRead: {
        bookId: selectedBookId,
        chapter: chapterNumber,
        verse: 1,
        timestamp: Date.now()
      }
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedBookId]);

  // Direct open passage (As requested: "இன்று படிக்க வேண்டிய passage நேரடியாக open ஆகும்")
  const handleOpenPassage = useCallback((bookId: number, chapter: number, startVerse?: number) => {
    setSelectedBookId(bookId);
    setSelectedChapter(chapter);
    setHighlightStartVerse(startVerse);
    setCurrentView('verses');

    // Update last read position
    setState(prev => ({
      ...prev,
      lastRead: {
        bookId,
        chapter,
        verse: startVerse || 1,
        timestamp: Date.now()
      }
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Directly open Bible Reader for a specific book, chapter, and optional verse
  const handleOpenBible = useCallback((bookId: number, chapter: number, verse?: number) => {
    setSelectedBookId(bookId);
    setSelectedChapter(chapter);
    setReaderInitialVerse(verse);
    setCurrentView('bible');
    setState(prev => ({
      ...prev,
      lastRead: {
        bookId,
        chapter,
        verse: verse || 1,
        timestamp: Date.now()
      }
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Toggle single verse checkbox
  const handleToggleVerse = useCallback((bookId: number, chapterNumber: number, verseNumber: number) => {
    const key = `${bookId}_${chapterNumber}_${verseNumber}`;
    const todayStr = getTodayDateString();

    setState(prev => {
      const isCurrentlyRead = !!prev.readVerses[key];
      const newReadVerses = { ...prev.readVerses };
      const newDailyActivity = { ...prev.dailyActivity };

      if (isCurrentlyRead) {
        delete newReadVerses[key];
        newDailyActivity[todayStr] = Math.max(0, (newDailyActivity[todayStr] || 1) - 1);
      } else {
        newReadVerses[key] = true;
        newDailyActivity[todayStr] = (newDailyActivity[todayStr] || 0) + 1;
      }

      return {
        ...prev,
        readVerses: newReadVerses,
        dailyActivity: newDailyActivity,
        lastRead: {
          bookId,
          chapter: chapterNumber,
          verse: verseNumber,
          timestamp: Date.now()
        }
      };
    });
  }, []);

  // Select all verses or deselect all verses in a chapter
  const handleSelectAllVersesInChapter = useCallback((bookId: number, chapterNumber: number, selectAll: boolean) => {
    const book = BIBLE_BOOKS.find(b => b.id === bookId);
    if (!book) return;
    const totalInChap = book.chapterVerses[chapterNumber - 1] || 25;
    const todayStr = getTodayDateString();

    setState(prev => {
      const newReadVerses = { ...prev.readVerses };
      const newReadChapters = { ...prev.readChapters };
      const newDailyActivity = { ...prev.dailyActivity };

      let addedVerses = 0;

      for (let v = 1; v <= totalInChap; v++) {
        const vKey = `${bookId}_${chapterNumber}_${v}`;
        if (selectAll) {
          if (!newReadVerses[vKey]) {
            newReadVerses[vKey] = true;
            addedVerses++;
          }
        } else {
          if (newReadVerses[vKey]) {
            delete newReadVerses[vKey];
            addedVerses--;
          }
        }
      }

      if (selectAll) {
        newReadChapters[`${bookId}_${chapterNumber}`] = true;
      } else {
        delete newReadChapters[`${bookId}_${chapterNumber}`];
      }

      newDailyActivity[todayStr] = Math.max(0, (newDailyActivity[todayStr] || 0) + addedVerses);

      return {
        ...prev,
        readVerses: newReadVerses,
        readChapters: newReadChapters,
        dailyActivity: newDailyActivity
      };
    });
  }, []);

  // Toggle entire chapter marked status
  const handleToggleWholeChapter = useCallback((bookId: number, chapterNumber: number) => {
    const book = BIBLE_BOOKS.find(b => b.id === bookId);
    if (!book) return;
    const totalInChap = book.chapterVerses[chapterNumber - 1] || 25;
    const chapterKey = `${bookId}_${chapterNumber}`;
    const todayStr = getTodayDateString();

    setState(prev => {
      const isCurrentlyMarked = !!prev.readChapters[chapterKey];
      const newReadChapters = { ...prev.readChapters };
      const newReadVerses = { ...prev.readVerses };
      const newDailyActivity = { ...prev.dailyActivity };

      if (isCurrentlyMarked) {
        delete newReadChapters[chapterKey];
        // Deselect verses as well
        for (let v = 1; v <= totalInChap; v++) {
          delete newReadVerses[`${bookId}_${chapterNumber}_${v}`];
        }
        newDailyActivity[todayStr] = Math.max(0, (newDailyActivity[todayStr] || totalInChap) - totalInChap);
      } else {
        newReadChapters[chapterKey] = true;
        // Select all verses
        for (let v = 1; v <= totalInChap; v++) {
          newReadVerses[`${bookId}_${chapterNumber}_${v}`] = true;
        }
        newDailyActivity[todayStr] = (newDailyActivity[todayStr] || 0) + totalInChap;
      }

      return {
        ...prev,
        readChapters: newReadChapters,
        readVerses: newReadVerses,
        dailyActivity: newDailyActivity
      };
    });
  }, []);

  // Mark all chapters of a book
  const handleMarkAllBookChapters = useCallback((bookId: number, markRead: boolean) => {
    const book = BIBLE_BOOKS.find(b => b.id === bookId);
    if (!book) return;
    const todayStr = getTodayDateString();

    setState(prev => {
      const newReadChapters = { ...prev.readChapters };
      const newReadVerses = { ...prev.readVerses };
      const newDailyActivity = { ...prev.dailyActivity };

      let addedVerses = 0;

      for (let c = 1; c <= book.chaptersCount; c++) {
        const chapKey = `${bookId}_${c}`;
        const totalInChap = book.chapterVerses[c - 1] || 25;

        if (markRead) {
          newReadChapters[chapKey] = true;
          for (let v = 1; v <= totalInChap; v++) {
            if (!newReadVerses[`${bookId}_${c}_${v}`]) {
              newReadVerses[`${bookId}_${c}_${v}`] = true;
              addedVerses++;
            }
          }
        } else {
          delete newReadChapters[chapKey];
          for (let v = 1; v <= totalInChap; v++) {
            if (newReadVerses[`${bookId}_${c}_${v}`]) {
              delete newReadVerses[`${bookId}_${c}_${v}`];
              addedVerses--;
            }
          }
        }
      }

      newDailyActivity[todayStr] = Math.max(0, (newDailyActivity[todayStr] || 0) + addedVerses);

      return {
        ...prev,
        readChapters: newReadChapters,
        readVerses: newReadVerses,
        dailyActivity: newDailyActivity
      };
    });
  }, []);

  // Set active plan type
  const handleSetActivePlan = useCallback((plan: PlanType) => {
    setState(prev => ({ ...prev, activePlan: plan }));
  }, []);

  // Set plan day
  const handleSetPlanDay = useCallback((plan: PlanType, newDay: number) => {
    setState(prev => {
      if (plan === 'ten_verses') return { ...prev, tenVersesDay: newDay };
      if (plan === 'one_chapter') return { ...prev, oneChapterDay: newDay };
      if (plan === 'six_months_plan') return { ...prev, sixMonthsPlanDay: newDay };
      if (plan === 'three_months_plan') return { ...prev, threeMonthsPlanDay: newDay };
      return { ...prev, yearlyPlanDay: newDay };
    });
  }, []);

  // Mark passage complete for 10-verses plan
  const handleMarkPassageComplete = useCallback((bookId: number, chapter: number, startVerse = 1, endVerse = 10) => {
    const todayStr = getTodayDateString();
    setState(prev => {
      const newReadVerses = { ...prev.readVerses };
      const newDailyActivity = { ...prev.dailyActivity };
      let added = 0;

      for (let v = startVerse; v <= endVerse; v++) {
        const key = `${bookId}_${chapter}_${v}`;
        if (!newReadVerses[key]) {
          newReadVerses[key] = true;
          added++;
        }
      }

      newDailyActivity[todayStr] = (newDailyActivity[todayStr] || 0) + added;

      return {
        ...prev,
        readVerses: newReadVerses,
        dailyActivity: newDailyActivity,
        // Advance to next day automatically
        tenVersesDay: prev.tenVersesDay + 1
      };
    });
  }, []);

  // Batch mark chapters for daily plan
  const handleMarkChaptersBatch = useCallback((chaptersToMark: { bookId: number; chapter: number }[], markRead: boolean) => {
    const todayStr = getTodayDateString();
    setState(prev => {
      const newReadChapters = { ...prev.readChapters };
      const newReadVerses = { ...prev.readVerses };
      const newDailyActivity = { ...prev.dailyActivity };
      let added = 0;

      chaptersToMark.forEach(ch => {
        const chapKey = `${ch.bookId}_${ch.chapter}`;
        const book = BIBLE_BOOKS.find(b => b.id === ch.bookId);
        const totalInChap = book?.chapterVerses[ch.chapter - 1] || 25;

        if (markRead) {
          newReadChapters[chapKey] = true;
          for (let v = 1; v <= totalInChap; v++) {
            if (!newReadVerses[`${ch.bookId}_${ch.chapter}_${v}`]) {
              newReadVerses[`${ch.bookId}_${ch.chapter}_${v}`] = true;
              added++;
            }
          }
        } else {
          delete newReadChapters[chapKey];
          for (let v = 1; v <= totalInChap; v++) {
            if (newReadVerses[`${ch.bookId}_${ch.chapter}_${v}`]) {
              delete newReadVerses[`${ch.bookId}_${ch.chapter}_${v}`];
              added--;
            }
          }
        }
      });

      newDailyActivity[todayStr] = Math.max(0, (newDailyActivity[todayStr] || 0) + added);

      return {
        ...prev,
        readChapters: newReadChapters,
        readVerses: newReadVerses,
        dailyActivity: newDailyActivity
      };
    });
  }, []);

  // Quick mark today's plan passage from dashboard
  const handleQuickMarkTodayPlan = useCallback(() => {
    if (state.activePlan === 'ten_verses') {
      const p = getDailyTenVersesPassage(state.tenVersesDay);
      handleMarkPassageComplete(p.bookId, p.chapter, p.startVerse, p.endVerse);
    } else if (state.activePlan === 'one_chapter') {
      const p = getDailyOneChapterPassage(state.oneChapterDay);
      handleToggleWholeChapter(p.bookId, p.chapter);
    } else if (state.activePlan === 'six_months_plan') {
      const day = Math.min(180, Math.max(1, state.sixMonthsPlanDay || 1));
      const planDay = SIX_MONTHS_BIBLE_PLAN[day - 1] || SIX_MONTHS_BIBLE_PLAN[0];
      const chapters: { bookId: number; chapter: number }[] = [];
      planDay.passages.forEach(p => {
        for (let c = p.startChapter; c <= p.endChapter; c++) {
          chapters.push({ bookId: p.bookId, chapter: c });
        }
      });
      handleMarkChaptersBatch(chapters, true);
    } else if (state.activePlan === 'three_months_plan') {
      const day = Math.min(90, Math.max(1, state.threeMonthsPlanDay || 1));
      const planDay = THREE_MONTHS_BIBLE_PLAN[day - 1] || THREE_MONTHS_BIBLE_PLAN[0];
      const chapters: { bookId: number; chapter: number }[] = [];
      planDay.passages.forEach(p => {
        for (let c = p.startChapter; c <= p.endChapter; c++) {
          chapters.push({ bookId: p.bookId, chapter: c });
        }
      });
      handleMarkChaptersBatch(chapters, true);
    } else {
      const day = state.yearlyPlanDay || getCurrentDayOfYear();
      const planDay = YEARLY_BIBLE_PLAN[day - 1] || YEARLY_BIBLE_PLAN[0];
      const chapters: { bookId: number; chapter: number }[] = [];
      planDay.passages.forEach(p => {
        for (let c = p.startChapter; c <= p.endChapter; c++) {
          chapters.push({ bookId: p.bookId, chapter: c });
        }
      });
      handleMarkChaptersBatch(chapters, true);
    }
  }, [state.activePlan, state.tenVersesDay, state.oneChapterDay, state.yearlyPlanDay, state.sixMonthsPlanDay, state.threeMonthsPlanDay, handleMarkPassageComplete, handleToggleWholeChapter, handleMarkChaptersBatch]);

  // Restore state from JSON backup
  const handleRestoreState = useCallback((newState: ReadingState) => {
    setState(newState);
  }, []);

  // Reset all state to clean default
  const handleResetAllData = useCallback(() => {
    const fresh = getDefaultReadingState();
    setState(fresh);
    saveReadingState(fresh);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Mukta_Malar','Plus_Jakarta_Sans',sans-serif] selection:bg-amber-500 selection:text-slate-950">
      {/* 5-SECOND WELCOME / SPLASH SCREEN */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {/* Main Top Header Navigation */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        currentStreak={stats.currentStreak}
        todayVersesRead={stats.todayVersesRead}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'dashboard' && (
          <Dashboard
            state={state}
            stats={stats}
            userProfile={userProfile}
            onEditProfile={() => setIsEditProfileOpen(true)}
            onNavigate={handleNavigate}
            onSelectBook={handleSelectBook}
            onOpenPassage={handleOpenPassage}
            onSetActivePlan={handleSetActivePlan}
            onQuickMarkTodayPlan={handleQuickMarkTodayPlan}
            onOpenBible={handleOpenBible}
          />
        )}

        {currentView === 'books' && (
          <BooksList
            state={state}
            onSelectBook={handleSelectBook}
            onOpenBible={handleOpenBible}
          />
        )}

        {currentView === 'chapters' && (
          <ChapterScreen
            bookId={selectedBookId}
            state={state}
            onBack={() => handleNavigate('books')}
            onSelectChapter={handleSelectChapter}
            onToggleWholeChapter={handleToggleWholeChapter}
            onMarkAllBookChapters={handleMarkAllBookChapters}
            onReadBibleChapter={handleOpenBible}
          />
        )}

        {currentView === 'verses' && (
          <VerseChecklistScreen
            bookId={selectedBookId}
            chapterNumber={selectedChapter}
            highlightStartVerse={highlightStartVerse}
            state={state}
            onBackToChapters={() => setCurrentView('chapters')}
            onNavigateChapter={(newChap) => {
              setSelectedChapter(newChap);
              setHighlightStartVerse(undefined);
            }}
            onToggleVerse={handleToggleVerse}
            onSelectAllVersesInChapter={handleSelectAllVersesInChapter}
            onOpenBibleReader={handleOpenBible}
          />
        )}

        {currentView === 'bible' && (
          <BibleReaderScreen
            initialBookId={selectedBookId}
            initialChapter={selectedChapter}
            initialVerse={readerInitialVerse}
            state={state}
            onToggleVerse={handleToggleVerse}
            onToggleWholeChapter={handleToggleWholeChapter}
            onBackToBooks={() => setCurrentView('books')}
            onOpenChecklist={(bId, cNum) => {
              setSelectedBookId(bId);
              setSelectedChapter(cNum);
              setCurrentView('verses');
            }}
          />
        )}

        {currentView === 'plans' && (
          <DailyPlansScreen
            state={state}
            onSetActivePlan={handleSetActivePlan}
            onSetPlanDay={handleSetPlanDay}
            onOpenPassage={handleOpenPassage}
            onMarkPassageComplete={handleMarkPassageComplete}
            onMarkChaptersBatch={handleMarkChaptersBatch}
          />
        )}

        {currentView === 'reports' && (
          <ReportsScreen
            state={state}
            stats={stats}
            userProfile={userProfile}
            onEditProfile={() => setIsEditProfileOpen(true)}
          />
        )}

        {currentView === 'about' && (
          <AboutUsScreen
            state={state}
            onRestoreState={handleRestoreState}
            onResetAllData={handleResetAllData}
            onReplaySplash={() => setShowSplash(true)}
          />
        )}
      </main>

      {/* Profile Edit Modal */}
      <EditProfileModal
        profile={userProfile}
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={(updated) => setUserProfile(updated)}
      />
    </div>
  );
}

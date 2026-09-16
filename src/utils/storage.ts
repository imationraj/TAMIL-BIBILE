import { BIBLE_BOOKS, TOTAL_BIBLE_CHAPTERS, TOTAL_BIBLE_VERSES, OT_VERSES_COUNT, NT_VERSES_COUNT } from '../data/bibleData';
import { getCurrentDayOfYear } from '../data/readingPlans';
import { ReadingState, BibleProgressStats } from '../types';

const STORAGE_KEY = 'tamil_bible_reading_progress_v1';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDefaultReadingState(): ReadingState {
  const currentDay = getCurrentDayOfYear();
  return {
    readVerses: {},
    readChapters: {},
    dailyActivity: {},
    activePlan: 'yearly_plan',
    tenVersesDay: 1,
    oneChapterDay: 1,
    yearlyPlanDay: currentDay,
    sixMonthsPlanDay: 1,
    threeMonthsPlanDay: 1,
    lastRead: {
      bookId: 1,
      chapter: 1,
      verse: 1,
      timestamp: Date.now()
    },
    bookmarks: []
  };
}

export function loadReadingState(): ReadingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultReadingState();
    const parsed = JSON.parse(raw);
    return {
      ...getDefaultReadingState(),
      ...parsed
    };
  } catch (err) {
    console.error('Error loading reading state from localStorage:', err);
    return getDefaultReadingState();
  }
}

export function saveReadingState(state: ReadingState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Error saving reading state to localStorage:', err);
  }
}

// Calculate streak in consecutive active days
export function calculateStreaks(dailyActivity: Record<string, number>): { currentStreak: number; bestStreak: number } {
  const dates = Object.keys(dailyActivity)
    .filter(d => (dailyActivity[d] || 0) > 0)
    .sort();

  if (dates.length === 0) return { currentStreak: 0, bestStreak: 0 };

  const dateSet = new Set(dates);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check today or yesterday as start of current streak
  let currentStreak = 0;
  let checkDate = new Date(today);

  // Format date helper
  const formatDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const todayStr = formatDate(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  // If read today, streak counts from today backwards; if not read today, check if read yesterday
  if (dateSet.has(todayStr)) {
    checkDate = new Date(today);
  } else if (dateSet.has(yesterdayStr)) {
    checkDate = new Date(yesterday);
  } else {
    currentStreak = 0;
  }

  if (dateSet.has(todayStr) || dateSet.has(yesterdayStr)) {
    while (true) {
      const dStr = formatDate(checkDate);
      if (dateSet.has(dStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate best all-time streak
  let bestStreak = 0;
  let runningStreak = 0;
  let prevTime: number | null = null;

  for (const dateStr of dates) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const currTime = new Date(y, m - 1, d).getTime();

    if (prevTime === null) {
      runningStreak = 1;
    } else {
      const diffDays = Math.round((currTime - prevTime) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        runningStreak++;
      } else if (diffDays > 1) {
        runningStreak = 1;
      }
    }
    prevTime = currTime;
    if (runningStreak > bestStreak) {
      bestStreak = runningStreak;
    }
  }

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak)
  };
}

// Compute accurate Bible totals and user reading stats
export function calculateBibleStats(state: ReadingState): BibleProgressStats {
  const { readVerses, readChapters, dailyActivity } = state;

  let totalVersesRead = 0;
  let otVersesRead = 0;
  let ntVersesRead = 0;
  let totalChaptersRead = 0;

  for (const book of BIBLE_BOOKS) {
    let bookVersesRead = 0;

    for (let c = 1; c <= book.chaptersCount; c++) {
      const totalInChap = book.chapterVerses[c - 1] || 25;
      const chapterKey = `${book.id}_${c}`;
      const isChapterMarked = !!readChapters[chapterKey];

      // Count individually read verses in this chapter
      let readCountInChap = 0;
      for (let v = 1; v <= totalInChap; v++) {
        if (readVerses[`${book.id}_${c}_${v}`] || isChapterMarked) {
          readCountInChap++;
        }
      }

      bookVersesRead += readCountInChap;

      if (isChapterMarked || readCountInChap === totalInChap) {
        totalChaptersRead++;
      }
    }

    totalVersesRead += bookVersesRead;
    if (book.testament === 'OT') {
      otVersesRead += bookVersesRead;
    } else {
      ntVersesRead += bookVersesRead;
    }
  }

  const streaks = calculateStreaks(dailyActivity);
  const todayStr = getTodayDateString();
  const todayVersesRead = dailyActivity[todayStr] || 0;

  return {
    totalVersesRead,
    totalVersesInBible: TOTAL_BIBLE_VERSES,
    percentVerses: Number(((totalVersesRead / TOTAL_BIBLE_VERSES) * 100).toFixed(2)),

    totalChaptersRead,
    totalChaptersInBible: TOTAL_BIBLE_CHAPTERS,
    percentChapters: Number(((totalChaptersRead / TOTAL_BIBLE_CHAPTERS) * 100).toFixed(2)),

    otVersesRead,
    otTotalVerses: OT_VERSES_COUNT,
    otPercent: Number(((otVersesRead / OT_VERSES_COUNT) * 100).toFixed(2)),

    ntVersesRead,
    ntTotalVerses: NT_VERSES_COUNT,
    ntPercent: Number(((ntVersesRead / NT_VERSES_COUNT) * 100).toFixed(2)),

    currentStreak: streaks.currentStreak,
    bestStreak: streaks.bestStreak,
    todayVersesRead
  };
}

// Calculate stats for an individual book
export function getBookProgress(bookId: number, state: ReadingState) {
  const book = BIBLE_BOOKS.find(b => b.id === bookId);
  if (!book) return { versesRead: 0, chaptersRead: 0, percent: 0 };

  let versesRead = 0;
  let chaptersRead = 0;

  for (let c = 1; c <= book.chaptersCount; c++) {
    const totalInChap = book.chapterVerses[c - 1] || 25;
    const isChapterMarked = !!state.readChapters[`${book.id}_${c}`];
    let chapVerses = 0;

    for (let v = 1; v <= totalInChap; v++) {
      if (state.readVerses[`${book.id}_${c}_${v}`] || isChapterMarked) {
        chapVerses++;
      }
    }
    versesRead += chapVerses;
    if (isChapterMarked || chapVerses === totalInChap) {
      chaptersRead++;
    }
  }

  const percent = book.totalVerses > 0 ? Math.round((versesRead / book.totalVerses) * 100) : 0;
  return { versesRead, chaptersRead, percent };
}

// Export data to a downloadable JSON string
export function exportBackupData(state: ReadingState): string {
  return JSON.stringify({
    version: '1.0',
    app: 'Tamil Bible Reading Tracker',
    exportedAt: new Date().toISOString(),
    state
  }, null, 2);
}

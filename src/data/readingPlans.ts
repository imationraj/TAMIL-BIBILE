import { BIBLE_BOOKS, BibleBook } from './bibleData';

export interface DailyPassage {
  day: number;
  bookId: number;
  bookNameTa: string;
  bookNameEn: string;
  chapter: number;
  startVerse?: number;
  endVerse?: number;
  labelTa: string;
  labelEn: string;
  totalVersesInPassage: number;
}

export interface YearlyPlanDay {
  day: number;
  titleTa: string;
  titleEn: string;
  passages: {
    bookId: number;
    bookNameTa: string;
    bookNameEn: string;
    startChapter: number;
    endChapter: number;
  }[];
}

// Generate sequential daily 10-verses reading plan segments
export function getDailyTenVersesPassage(dayNumber: number): DailyPassage {
  // Day is 1-indexed. Total verses: 31,102.
  // 10 verses per day -> total 3,111 days (~8.5 years)
  const safeDay = Math.max(1, dayNumber);
  const targetStartGlobalVerse = (safeDay - 1) * 10 + 1;
  const targetEndGlobalVerse = Math.min(31102, safeDay * 10);

  let currentGlobalVerse = 0;

  for (const book of BIBLE_BOOKS) {
    for (let chapIdx = 0; chapIdx < book.chapterVerses.length; chapIdx++) {
      const chapterNum = chapIdx + 1;
      const versesInChap = book.chapterVerses[chapIdx];
      const chapStartGlobal = currentGlobalVerse + 1;
      const chapEndGlobal = currentGlobalVerse + versesInChap;

      if (targetStartGlobalVerse <= chapEndGlobal && targetEndGlobalVerse >= chapStartGlobal) {
        // Found the starting chapter for this day's 10 verses!
        const startVerse = Math.max(1, targetStartGlobalVerse - currentGlobalVerse);
        const endVerse = Math.min(versesInChap, targetEndGlobalVerse - currentGlobalVerse);

        return {
          day: safeDay,
          bookId: book.id,
          bookNameTa: book.nameTa,
          bookNameEn: book.nameEn,
          chapter: chapterNum,
          startVerse,
          endVerse,
          labelTa: `${book.nameTa} ${chapterNum}:${startVerse}-${endVerse}`,
          labelEn: `${book.nameEn} ${chapterNum}:${startVerse}-${endVerse}`,
          totalVersesInPassage: Math.max(1, endVerse - startVerse + 1)
        };
      }
      currentGlobalVerse += versesInChap;
    }
  }

  // Fallback
  return {
    day: 1,
    bookId: 1,
    bookNameTa: 'ஆதியாகமம்',
    bookNameEn: 'Genesis',
    chapter: 1,
    startVerse: 1,
    endVerse: 10,
    labelTa: 'ஆதியாகமம் 1:1-10',
    labelEn: 'Genesis 1:1-10',
    totalVersesInPassage: 10
  };
}

// Generate daily 1-chapter reading plan
export function getDailyOneChapterPassage(dayNumber: number): DailyPassage {
  // Day 1 to 1189
  const safeDay = ((Math.max(1, dayNumber) - 1) % 1189) + 1;
  let accumulatedChapters = 0;

  for (const book of BIBLE_BOOKS) {
    if (accumulatedChapters + book.chaptersCount >= safeDay) {
      const chapterNum = safeDay - accumulatedChapters;
      const versesCount = book.chapterVerses[chapterNum - 1] || 25;
      return {
        day: safeDay,
        bookId: book.id,
        bookNameTa: book.nameTa,
        bookNameEn: book.nameEn,
        chapter: chapterNum,
        startVerse: 1,
        endVerse: versesCount,
        labelTa: `${book.nameTa} அதிகாரம் ${chapterNum}`,
        labelEn: `${book.nameEn} Chapter ${chapterNum}`,
        totalVersesInPassage: versesCount
      };
    }
    accumulatedChapters += book.chaptersCount;
  }

  return {
    day: 1,
    bookId: 1,
    bookNameTa: 'ஆதியாகமம்',
    bookNameEn: 'Genesis',
    chapter: 1,
    startVerse: 1,
    endVerse: 31,
    labelTa: 'ஆதியாகமம் அதிகாரம் 1',
    labelEn: 'Genesis Chapter 1',
    totalVersesInPassage: 31
  };
}

// Flat list of all 1,189 chapters in sequence
interface FlatChapter {
  bookId: number;
  bookNameTa: string;
  bookNameEn: string;
  chapter: number;
}

const ALL_FLAT_CHAPTERS: FlatChapter[] = [];
BIBLE_BOOKS.forEach(book => {
  for (let c = 1; c <= book.chaptersCount; c++) {
    ALL_FLAT_CHAPTERS.push({
      bookId: book.id,
      bookNameTa: book.nameTa,
      bookNameEn: book.nameEn,
      chapter: c
    });
  }
});

// Generate 365 Days Yearly Bible Reading Plan (covers all 1,189 chapters)
// ~3.26 chapters per day (some 3, some 4)
export const YEARLY_BIBLE_PLAN: YearlyPlanDay[] = (() => {
  const plan: YearlyPlanDay[] = [];
  const totalChapters = ALL_FLAT_CHAPTERS.length; // 1189
  let currentIndex = 0;

  for (let day = 1; day <= 365; day++) {
    // Distribute 1189 chapters evenly across 365 days
    const nextIndex = Math.min(totalChapters, Math.round((day / 365) * totalChapters));
    const dayChapters = ALL_FLAT_CHAPTERS.slice(currentIndex, nextIndex);
    currentIndex = nextIndex;

    // Group consecutive chapters by book
    const groupedPassages: YearlyPlanDay['passages'] = [];
    dayChapters.forEach(item => {
      const lastGroup = groupedPassages[groupedPassages.length - 1];
      if (lastGroup && lastGroup.bookId === item.bookId && lastGroup.endChapter + 1 === item.chapter) {
        lastGroup.endChapter = item.chapter;
      } else {
        groupedPassages.push({
          bookId: item.bookId,
          bookNameTa: item.bookNameTa,
          bookNameEn: item.bookNameEn,
          startChapter: item.chapter,
          endChapter: item.chapter
        });
      }
    });

    const titleTa = groupedPassages.map(p => 
      p.startChapter === p.endChapter 
        ? `${p.bookNameTa} ${p.startChapter}`
        : `${p.bookNameTa} ${p.startChapter}-${p.endChapter}`
    ).join(', ');

    const titleEn = groupedPassages.map(p => 
      p.startChapter === p.endChapter 
        ? `${p.bookNameEn} ${p.startChapter}`
        : `${p.bookNameEn} ${p.startChapter}-${p.endChapter}`
    ).join(', ');

    plan.push({
      day,
      titleTa: titleTa || 'வேத வாசிப்பு',
      titleEn: titleEn || 'Bible Reading',
      passages: groupedPassages
    });
  }

  return plan;
})();

// Helper to generate N-days Bible reading plan covering all 1,189 chapters
function generateDaysPlan(totalDays: number): YearlyPlanDay[] {
  const plan: YearlyPlanDay[] = [];
  const totalChapters = ALL_FLAT_CHAPTERS.length; // 1189
  let currentIndex = 0;

  for (let day = 1; day <= totalDays; day++) {
    const nextIndex = Math.min(totalChapters, Math.round((day / totalDays) * totalChapters));
    const dayChapters = ALL_FLAT_CHAPTERS.slice(currentIndex, nextIndex);
    currentIndex = nextIndex;

    const groupedPassages: YearlyPlanDay['passages'] = [];
    dayChapters.forEach(item => {
      const lastGroup = groupedPassages[groupedPassages.length - 1];
      if (lastGroup && lastGroup.bookId === item.bookId && lastGroup.endChapter + 1 === item.chapter) {
        lastGroup.endChapter = item.chapter;
      } else {
        groupedPassages.push({
          bookId: item.bookId,
          bookNameTa: item.bookNameTa,
          bookNameEn: item.bookNameEn,
          startChapter: item.chapter,
          endChapter: item.chapter
        });
      }
    });

    const titleTa = groupedPassages.map(p => 
      p.startChapter === p.endChapter 
        ? `${p.bookNameTa} ${p.startChapter}`
        : `${p.bookNameTa} ${p.startChapter}-${p.endChapter}`
    ).join(', ');

    const titleEn = groupedPassages.map(p => 
      p.startChapter === p.endChapter 
        ? `${p.bookNameEn} ${p.startChapter}`
        : `${p.bookNameEn} ${p.startChapter}-${p.endChapter}`
    ).join(', ');

    plan.push({
      day,
      titleTa: titleTa || 'வேத வாசிப்பு',
      titleEn: titleEn || 'Bible Reading',
      passages: groupedPassages
    });
  }

  return plan;
}

// Generate 6 Months Bible Reading Plan (180 Days, ~6.6 chapters per day)
export const SIX_MONTHS_BIBLE_PLAN: YearlyPlanDay[] = generateDaysPlan(180);

// Generate 3 Months Bible Reading Plan (90 Days, ~13.2 chapters per day)
export const THREE_MONTHS_BIBLE_PLAN: YearlyPlanDay[] = generateDaysPlan(90);

// Helper to get day of the year (1 to 365/366)
export function getCurrentDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.min(365, Math.max(1, Math.floor(diff / oneDay)));
}

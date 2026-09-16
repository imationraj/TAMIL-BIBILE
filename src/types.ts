export type ViewMode = 
  | 'dashboard' 
  | 'books' 
  | 'bible'
  | 'chapters' 
  | 'verses' 
  | 'plans' 
  | 'reports' 
  | 'about';

export type PlanType = 'ten_verses' | 'one_chapter' | 'yearly_plan' | 'six_months_plan' | 'three_months_plan';

export interface ReadingState {
  // Key format: `${bookId}_${chapterNum}_${verseNum}` -> boolean
  readVerses: Record<string, boolean>;
  // Key format: `${bookId}_${chapterNum}` -> boolean (for entire chapter quick toggle)
  readChapters: Record<string, boolean>;
  // Daily activity tracker: 'YYYY-MM-DD' -> count of verses read on that day
  dailyActivity: Record<string, number>;
  // Active plan configuration
  activePlan: PlanType;
  // Day tracking
  tenVersesDay: number;
  oneChapterDay: number;
  yearlyPlanDay: number;
  sixMonthsPlanDay: number;
  threeMonthsPlanDay: number;
  // Last read position
  lastRead: {
    bookId: number;
    chapter: number;
    verse?: number;
    timestamp: number;
  } | null;
  // Bookmarks
  bookmarks: Array<{
    id: string;
    bookId: number;
    chapter: number;
    verse?: number;
    note?: string;
    createdAt: string;
  }>;
}

export interface BibleProgressStats {
  totalVersesRead: number;
  totalVersesInBible: number;
  percentVerses: number;
  
  totalChaptersRead: number;
  totalChaptersInBible: number;
  percentChapters: number;

  otVersesRead: number;
  otTotalVerses: number;
  otPercent: number;

  ntVersesRead: number;
  ntTotalVerses: number;
  ntPercent: number;

  currentStreak: number;
  bestStreak: number;
  todayVersesRead: number;
}

export interface UserProfile {
  id: string;
  username: string; // up to 12 chars
  location: string;
  avatar: string; // emoji icon
  joinedAt: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  location: string;
  chaptersRead: number;
  versesRead: number;
  streakDays: number;
  score: number;
  badge: string;
  avatar: string;
  isCurrentUser: boolean;
}

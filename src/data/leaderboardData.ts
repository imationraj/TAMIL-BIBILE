import { LeaderboardEntry, UserProfile, BibleProgressStats } from '../types';

export interface SeedBeliever {
  id: string;
  username: string;
  location: string;
  chaptersRead: number;
  versesRead: number;
  streakDays: number;
  avatar: string;
  badge: string;
}

// 30 realistic global Tamil Bible readers
export const SEED_LEADERBOARD_USERS: SeedBeliever[] = [
  {
    id: 'seed_1',
    username: 'சாமுவேல்_M',
    location: 'சென்னை',
    chaptersRead: 1189,
    versesRead: 31102,
    streakDays: 185,
    avatar: '👑',
    badge: 'முழு வேதாகமம்'
  },
  {
    id: 'seed_2',
    username: 'யோசுவா_J',
    location: 'துபாய்',
    chaptersRead: 1045,
    versesRead: 27800,
    streakDays: 140,
    avatar: '🏆',
    badge: 'வேத மாவீரர்'
  },
  {
    id: 'seed_3',
    username: 'எஸ்தர்_TN',
    location: 'திருநெல்வேலி',
    chaptersRead: 890,
    versesRead: 23600,
    streakDays: 115,
    avatar: '⭐',
    badge: 'சுடரொளி'
  },
  {
    id: 'seed_4',
    username: 'டேனியல்_G',
    location: 'மதுரை',
    chaptersRead: 780,
    versesRead: 20450,
    streakDays: 95,
    avatar: '🛡️',
    badge: 'விசுவாச வீரன்'
  },
  {
    id: 'seed_5',
    username: 'ரூத்_அன்பு',
    location: 'சிங்கப்பூர்',
    chaptersRead: 650,
    versesRead: 17200,
    streakDays: 82,
    avatar: '🌾',
    badge: 'உண்மையுள்ளவர்'
  },
  {
    id: 'seed_6',
    username: 'பவுல்ராஜ்',
    location: 'கோயம்புத்தூர்',
    chaptersRead: 540,
    versesRead: 14600,
    streakDays: 70,
    avatar: '⚔️',
    badge: 'நற்செய்தியாளர்'
  },
  {
    id: 'seed_7',
    username: 'மரியாள்_S',
    location: 'பெங்களூரு',
    chaptersRead: 460,
    versesRead: 12400,
    streakDays: 61,
    avatar: '🕯️',
    badge: 'விழித்திருப்பவர்'
  },
  {
    id: 'seed_8',
    username: 'யோவான்_T',
    location: 'லண்டன்',
    chaptersRead: 390,
    versesRead: 10500,
    streakDays: 52,
    avatar: '🕊️',
    badge: 'அன்பின் சீடர்'
  },
  {
    id: 'seed_9',
    username: 'எலிசபெத்_R',
    location: 'திருச்சி',
    chaptersRead: 320,
    versesRead: 8650,
    streakDays: 44,
    avatar: '📖',
    badge: 'வேத வாசிப்பாளர்'
  },
  {
    id: 'seed_10',
    username: 'பீட்டர்_K',
    location: 'மலேசியா',
    chaptersRead: 275,
    versesRead: 7420,
    streakDays: 38,
    avatar: '⚓',
    badge: 'உறுதியானவர்'
  },
  {
    id: 'seed_11',
    username: 'திமோத்தேயு',
    location: 'சேலம்',
    chaptersRead: 220,
    versesRead: 5950,
    streakDays: 32,
    avatar: '🌟',
    badge: 'இள விசுவாசி'
  },
  {
    id: 'seed_12',
    username: 'பிரிஸ்கில்லா',
    location: 'கனடா',
    chaptersRead: 180,
    versesRead: 4900,
    streakDays: 28,
    avatar: '🤝',
    badge: 'ஊழிய தோழி'
  },
  {
    id: 'seed_13',
    username: 'சீலா_M',
    location: 'நாகர்கோவில்',
    chaptersRead: 145,
    versesRead: 3980,
    streakDays: 24,
    avatar: '🎵',
    badge: 'துதிப்பவர்'
  },
  {
    id: 'seed_14',
    username: 'பிலிப்பு_D',
    location: 'தஞ்சாவூர்',
    chaptersRead: 115,
    versesRead: 3200,
    streakDays: 20,
    avatar: '🚶',
    badge: 'வழிநடத்துபவர்'
  },
  {
    id: 'seed_15',
    username: 'பர்னபா_S',
    location: 'ஈரோடு',
    chaptersRead: 90,
    versesRead: 2520,
    streakDays: 17,
    avatar: '🤲',
    badge: 'தேற்றுபவர்'
  },
  {
    id: 'seed_16',
    username: 'லீதியாள்_K',
    location: 'வேலூர்',
    chaptersRead: 70,
    versesRead: 1980,
    streakDays: 14,
    avatar: '💜',
    badge: 'பக்தி விருத்தி'
  },
  {
    id: 'seed_17',
    username: 'தீத்து_R',
    location: 'திண்டுக்கல்',
    chaptersRead: 52,
    versesRead: 1510,
    streakDays: 12,
    avatar: '📋',
    badge: 'ஒழுங்கமைப்பாளர்'
  },
  {
    id: 'seed_18',
    username: 'அன்னா_S',
    location: 'விருதுநகர்',
    chaptersRead: 38,
    versesRead: 1150,
    streakDays: 10,
    avatar: '🧎',
    badge: 'ஜெப வீரன்'
  },
  {
    id: 'seed_19',
    username: 'ஸ்தேவான்_P',
    location: 'விழுப்புரம்',
    chaptersRead: 26,
    versesRead: 830,
    streakDays: 8,
    avatar: '💎',
    badge: 'தியாகி'
  },
  {
    id: 'seed_20',
    username: 'அந்திரேயா_M',
    location: 'புதுச்சேரி',
    chaptersRead: 18,
    versesRead: 590,
    streakDays: 6,
    avatar: '🎣',
    badge: 'சீடன்'
  },
  {
    id: 'seed_21',
    username: 'நத்தானியேல்',
    location: 'கன்னியாகுமரி',
    chaptersRead: 12,
    versesRead: 420,
    streakDays: 5,
    avatar: '🌿',
    badge: 'கபடற்றவர்'
  },
  {
    id: 'seed_22',
    username: 'மார்த்தாள்_J',
    location: 'தூத்துக்குடி',
    chaptersRead: 8,
    versesRead: 290,
    streakDays: 4,
    avatar: '🧺',
    badge: 'சுறுசுறுப்பு'
  },
  {
    id: 'seed_23',
    username: 'பிலேமோன்',
    location: 'கரூர்',
    chaptersRead: 5,
    versesRead: 190,
    streakDays: 3,
    avatar: '❤️',
    badge: 'தயவுள்ளவர்'
  },
  {
    id: 'seed_24',
    username: 'கெப்ஸிபா',
    location: 'தென்காசி',
    chaptersRead: 3,
    versesRead: 115,
    streakDays: 2,
    avatar: '🌸',
    badge: 'பிரியமானவர்'
  },
  {
    id: 'seed_25',
    username: 'எபனேசர்',
    location: 'நாமக்கல்',
    chaptersRead: 2,
    versesRead: 75,
    streakDays: 1,
    avatar: '🪨',
    badge: 'உதவி பெற்றவர்'
  },
  {
    id: 'seed_26',
    username: 'தாவீது_K',
    location: 'திருப்பூர்',
    chaptersRead: 1,
    versesRead: 35,
    streakDays: 1,
    avatar: '🏹',
    badge: 'ஆராதனை'
  }
];

export function getUserBadge(chaptersRead: number): string {
  if (chaptersRead >= 1189) return 'முழு வேதாகமம்';
  if (chaptersRead >= 800) return 'வேத மாவீரர்';
  if (chaptersRead >= 400) return 'சுடரொளி';
  if (chaptersRead >= 150) return 'நற்செய்தியாளர்';
  if (chaptersRead >= 50) return 'வேத வாசிப்பாளர்';
  if (chaptersRead >= 1) return 'தொடங்கியவர்';
  return 'புதிய விசுவாசி';
}

export function calculateScore(versesRead: number, chaptersRead: number, streakDays: number): number {
  return (versesRead * 1) + (chaptersRead * 25) + (streakDays * 50);
}

export type LeaderboardSortField = 'score' | 'chapters' | 'verses' | 'streak';
export type LeaderboardDisplayMode = 'all' | 'fresh'; // 'all' = includes sample global participants, 'fresh' = real active users only

const LEADERBOARD_MODE_KEY = 'tamil_bible_leaderboard_mode_v1';

export function getLeaderboardMode(): LeaderboardDisplayMode {
  try {
    const saved = localStorage.getItem(LEADERBOARD_MODE_KEY);
    if (saved === 'fresh' || saved === 'all') return saved;
  } catch (e) {
    // ignore
  }
  return 'fresh'; // Default to fresh/clean for new app as requested!
}

export function setLeaderboardMode(mode: LeaderboardDisplayMode): void {
  try {
    localStorage.setItem(LEADERBOARD_MODE_KEY, mode);
  } catch (e) {
    // ignore
  }
}

export function getGlobalLeaderboard(
  userProfile: UserProfile,
  stats: BibleProgressStats,
  sortBy: LeaderboardSortField = 'score',
  modeOverride?: LeaderboardDisplayMode,
  serverUsers?: LeaderboardEntry[]
): {
  top25: LeaderboardEntry[];
  currentUserRank: number;
  currentUserEntry: LeaderboardEntry;
  totalParticipants: number;
  mode: LeaderboardDisplayMode;
} {
  const currentMode = modeOverride || getLeaderboardMode();

  // Compute current user dynamic entry
  const currentUserScore = calculateScore(stats.totalVersesRead, stats.totalChaptersRead, stats.currentStreak);
  const currentUserBadge = getUserBadge(stats.totalChaptersRead);

  const currentUserItem: LeaderboardEntry = {
    id: 'current_user',
    rank: 0,
    username: userProfile.username,
    location: userProfile.location ? userProfile.location : '—',
    chaptersRead: stats.totalChaptersRead,
    versesRead: stats.totalVersesRead,
    streakDays: stats.currentStreak,
    score: currentUserScore,
    badge: currentUserBadge,
    avatar: userProfile.avatar || '📖',
    isCurrentUser: true
  };

  // Base list depending on mode
  let allItems: LeaderboardEntry[] = [];

  if (serverUsers && serverUsers.length > 0) {
    // If we have live server users (real friends across devices)
    let foundCurrent = false;
    allItems = serverUsers.map(su => {
      const isCurrent = su.isCurrentUser || (su.username.trim().toLowerCase() === userProfile.username.trim().toLowerCase());
      if (isCurrent) foundCurrent = true;
      return {
        ...su,
        isCurrentUser: isCurrent,
        // sync latest local stats if current user
        chaptersRead: isCurrent ? Math.max(su.chaptersRead, stats.totalChaptersRead) : su.chaptersRead,
        versesRead: isCurrent ? Math.max(su.versesRead, stats.totalVersesRead) : su.versesRead,
        streakDays: isCurrent ? Math.max(su.streakDays, stats.currentStreak) : su.streakDays,
        score: isCurrent ? Math.max(su.score, currentUserScore) : su.score,
        username: isCurrent ? userProfile.username : su.username,
        location: isCurrent && userProfile.location ? userProfile.location : su.location,
        avatar: isCurrent ? userProfile.avatar : su.avatar,
      };
    });

    if (!foundCurrent) {
      allItems.push(currentUserItem);
    }

    if (currentMode === 'all') {
      SEED_LEADERBOARD_USERS.forEach((seed) => {
        // avoid duplicating if username matches
        if (!allItems.some(item => item.username.trim().toLowerCase() === seed.username.trim().toLowerCase())) {
          const score = calculateScore(seed.versesRead, seed.chaptersRead, seed.streakDays);
          allItems.push({
            id: seed.id,
            rank: 0,
            username: seed.username,
            location: seed.location,
            chaptersRead: seed.chaptersRead,
            versesRead: seed.versesRead,
            streakDays: seed.streakDays,
            score,
            badge: seed.badge,
            avatar: seed.avatar,
            isCurrentUser: false
          });
        }
      });
    }
  } else {
    // Fallback when server is not loaded yet
    if (currentMode === 'all') {
      SEED_LEADERBOARD_USERS.forEach((seed) => {
        const score = calculateScore(seed.versesRead, seed.chaptersRead, seed.streakDays);
        allItems.push({
          id: seed.id,
          rank: 0,
          username: seed.username,
          location: seed.location,
          chaptersRead: seed.chaptersRead,
          versesRead: seed.versesRead,
          streakDays: seed.streakDays,
          score,
          badge: seed.badge,
          avatar: seed.avatar,
          isCurrentUser: false
        });
      });
    }

    // Add current user
    allItems.push(currentUserItem);
  }

  // Sort based on chosen field
  allItems.sort((a, b) => {
    if (sortBy === 'chapters') {
      if (b.chaptersRead !== a.chaptersRead) return b.chaptersRead - a.chaptersRead;
      return b.versesRead - a.versesRead;
    }
    if (sortBy === 'verses') {
      if (b.versesRead !== a.versesRead) return b.versesRead - a.versesRead;
      return b.chaptersRead - a.chaptersRead;
    }
    if (sortBy === 'streak') {
      if (b.streakDays !== a.streakDays) return b.streakDays - a.streakDays;
      return b.score - a.score;
    }
    // Default 'score'
    if (b.score !== a.score) return b.score - a.score;
    if (b.chaptersRead !== a.chaptersRead) return b.chaptersRead - a.chaptersRead;
    return b.versesRead - a.versesRead;
  });

  // Assign ranks
  allItems.forEach((item, index) => {
    item.rank = index + 1;
  });

  // Find current user's entry and rank
  const userEntry = allItems.find(item => item.isCurrentUser) || currentUserItem;
  const currentUserRank = userEntry.rank;

  // Take Top 25
  const top25 = allItems.slice(0, 25);

  return {
    top25,
    currentUserRank,
    currentUserEntry: userEntry,
    totalParticipants: allItems.length,
    mode: currentMode
  };
}

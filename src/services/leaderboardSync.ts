import { BibleProgressStats, LeaderboardEntry, UserProfile } from '../types';
import { calculateScore, getUserBadge } from '../data/leaderboardData';

const DEVICE_USER_ID_KEY = 'tamil_bible_device_id_v2';

export function getOrCreateDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_USER_ID_KEY);
    if (!id) {
      id = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem(DEVICE_USER_ID_KEY, id);
    }
    return id;
  } catch {
    return 'user_' + Date.now();
  }
}

export interface ServerSyncResult {
  success: boolean;
  users: LeaderboardEntry[];
  currentUserRank: number;
  currentUserEntry: LeaderboardEntry;
  totalParticipants: number;
}

export async function syncLeaderboardWithServer(
  userProfile: UserProfile,
  stats: BibleProgressStats
): Promise<LeaderboardEntry[]> {
  const deviceId = getOrCreateDeviceId();
  try {
    const res = await fetch('/api/leaderboard/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: deviceId,
        username: userProfile.username || 'விசுவாசி',
        location: userProfile.location || '',
        chaptersRead: stats.totalChaptersRead,
        versesRead: stats.totalVersesRead,
        streakDays: stats.currentStreak,
        avatar: userProfile.avatar || '📖',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.users && Array.isArray(data.users)) {
        return data.users.map((u: any) => ({
          id: u.id,
          rank: u.rank,
          username: u.username,
          location: u.location || '—',
          chaptersRead: u.chaptersRead,
          versesRead: u.versesRead,
          streakDays: u.streakDays,
          score: u.score,
          badge: u.badge || getUserBadge(u.chaptersRead),
          avatar: u.avatar || '📖',
          isCurrentUser: u.id === deviceId,
        }));
      }
    }
  } catch (err) {
    console.warn('Leaderboard server sync offline or unavailable:', err);
  }
  return [];
}

export async function fetchServerLeaderboard(): Promise<LeaderboardEntry[]> {
  const deviceId = getOrCreateDeviceId();
  try {
    const res = await fetch('/api/leaderboard');
    if (res.ok) {
      const data = await res.json();
      if (data.users && Array.isArray(data.users)) {
        return data.users.map((u: any) => ({
          id: u.id,
          rank: u.rank,
          username: u.username,
          location: u.location || '—',
          chaptersRead: u.chaptersRead,
          versesRead: u.versesRead,
          streakDays: u.streakDays,
          score: u.score,
          badge: u.badge || getUserBadge(u.chaptersRead),
          avatar: u.avatar || '📖',
          isCurrentUser: u.id === deviceId,
        }));
      }
    }
  } catch (err) {
    console.warn('Could not fetch server leaderboard:', err);
  }
  return [];
}

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { BibleProgressStats, UserProfile, LeaderboardEntry } from '../types';
import { 
  getGlobalLeaderboard, 
  LeaderboardSortField, 
  getLeaderboardMode, 
  setLeaderboardMode, 
  LeaderboardDisplayMode 
} from '../data/leaderboardData';
import { 
  syncLeaderboardWithServer, 
  fetchServerLeaderboard 
} from '../services/leaderboardSync';
import { 
  Trophy, 
  Flame, 
  Crown, 
  Medal, 
  Edit3, 
  MapPin, 
  Sparkles, 
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Users,
  RotateCcw,
  Sparkle,
  RefreshCw,
  Radio,
  Globe
} from 'lucide-react';

interface LeaderboardTableProps {
  userProfile: UserProfile;
  stats: BibleProgressStats;
  onEditProfile: () => void;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  userProfile,
  stats,
  onEditProfile
}) => {
  const [sortField, setSortField] = useState<LeaderboardSortField>('score');
  const [displayMode, setDisplayMode] = useState<LeaderboardDisplayMode>(getLeaderboardMode());
  const [serverUsers, setServerUsers] = useState<LeaderboardEntry[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  const refreshLeaderboard = useCallback(async () => {
    setIsSyncing(true);
    try {
      // First sync current user's profile and progress with the live server
      const synced = await syncLeaderboardWithServer(userProfile, stats);
      if (synced && synced.length > 0) {
        setServerUsers(synced);
      } else {
        // fallback fetch
        const fetched = await fetchServerLeaderboard();
        if (fetched && fetched.length > 0) {
          setServerUsers(fetched);
        }
      }
      const now = new Date();
      setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.warn('Leaderboard sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [userProfile, stats]);

  // Sync on mount and every 10 seconds for real-time friend updates
  useEffect(() => {
    refreshLeaderboard();
    const interval = setInterval(() => {
      fetchServerLeaderboard().then((users) => {
        if (users && users.length > 0) {
          setServerUsers(users);
        }
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [refreshLeaderboard]);

  const handleModeChange = (mode: LeaderboardDisplayMode) => {
    setDisplayMode(mode);
    setLeaderboardMode(mode);
  };

  const { top25, currentUserRank, currentUserEntry, totalParticipants } = useMemo(() => {
    return getGlobalLeaderboard(userProfile, stats, sortField, displayMode, serverUsers);
  }, [userProfile, stats, sortField, displayMode, serverUsers]);

  // Top 3 Podium winners
  const top1 = top25[0];
  const top2 = top25[1];
  const top3 = top25[2];

  const isUserInTop25 = currentUserRank <= 25;

  return (
    <div id="leaderboard-container" className="space-y-6">
      {/* Leaderboard Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>உலகளாவிய விசுவாசிகள் வேத வாசிப்பு தரவரிசை (Top 25)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
              <span>முன்னிலை விசுவாசிகள் பட்டியல்</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              உலகமெங்கும் உள்ள விசுவாசிகளுடன் இணைந்து உற்சாகமாய் வேதாகமத்தை வாசியுங்கள். அதிகாரம் மற்றும் வசனங்களை வாசிக்கும்போது உங்கள் புள்ளிகள் தானாக உயரும்!
            </p>
          </div>

          {/* Current User Standing Card */}
          <div className="bg-slate-800/90 border border-amber-500/40 rounded-2xl p-3.5 sm:p-4 shadow-lg flex items-center justify-between sm:justify-start gap-3.5 flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
              {userProfile.avatar || '📖'}
            </div>
            <div>
              <div className="text-[11px] text-amber-400 font-bold flex items-center gap-1.5">
                <span>⭐ உங்கள் சுயவிவரம் (You)</span>
                <button
                  id="btn-edit-profile-header"
                  onClick={onEditProfile}
                  className="hover:text-amber-200 transition-colors p-0.5"
                  title="பெயரை மாற்ற கிளிக் செய்யவும்"
                >
                  <Edit3 className="w-3 h-3 text-amber-400" />
                </button>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-100 truncate max-w-[130px] sm:max-w-[160px]">
                {userProfile.username}
              </div>
              <div className="flex items-center gap-2 text-xs mt-0.5">
                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[11px]">
                  தரம் #{currentUserRank}
                </span>
                <span className="text-slate-300 font-semibold font-mono text-[11px]">
                  {currentUserEntry.score.toLocaleString()} pts
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Multi-user Server Status & Sorting Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-bold">நேரலை சர்வர் ஒத்திசைவு (Live Sync):</span>
              <span className="text-emerald-400 font-extrabold">{totalParticipants} விசுவாசிகள்</span>
            </div>
            {lastSyncTime && (
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                ({lastSyncTime} புதுப்பிக்கப்பட்டது)
              </span>
            )}
            <button
              id="btn-refresh-leaderboard"
              onClick={refreshLeaderboard}
              disabled={isSyncing}
              className="px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/25 active:scale-95 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="நண்பர்களின் புதிய புள்ளிகளை உடனடியாகப் புதுப்பிக்க கிளிக் செய்க"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : 'text-amber-400'}`} />
              <span>{isSyncing ? 'இணைகிறது...' : 'நண்பர்களைப் புதுப்பி'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Mode Switcher: Fresh App vs Global Showcase */}
            <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-xl p-0.5 text-xs">
              <button
                type="button"
                id="btn-mode-fresh"
                onClick={() => handleModeChange('fresh')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  displayMode === 'fresh'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="நண்பர்கள் மற்றும் நேரடி விசுவாசிகள் மட்டும்"
              >
                ✨ நண்பர்கள் / நேரடி (Live Friends)
              </button>
              <button
                type="button"
                id="btn-mode-all"
                onClick={() => handleModeChange('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  displayMode === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="உலகளாவிய மாதிரி விசுவாசிகள் பட்டியல்"
              >
                🌍 மாதிரி விசுவாசிகள் (Global Demo)
              </button>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 rounded-xl p-1">
              <button
                id="sort-btn-score"
                onClick={() => setSortField('score')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  sortField === 'score'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-700'
                }`}
              >
                🏆 மொத்த புள்ளிகள்
              </button>
              <button
                id="sort-btn-chapters"
                onClick={() => setSortField('chapters')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  sortField === 'chapters'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-700'
                }`}
              >
                📖 அதிகாரங்கள்
              </button>
              <button
                id="sort-btn-verses"
                onClick={() => setSortField('verses')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  sortField === 'verses'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-700'
                }`}
              >
                ✨ வசனங்கள்
              </button>
              <button
                id="sort-btn-streak"
                onClick={() => setSortField('streak')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  sortField === 'streak'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-700'
                }`}
              >
                🔥 தொடர் வாசிப்பு
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Podium Cards for Top Winners */}
      {top1 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          {/* 2nd Place (if exists) */}
          {top2 ? (
            <div className="order-2 sm:order-1 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 flex flex-col items-center text-center relative overflow-hidden shadow-lg hover:border-slate-600 transition-all">
              <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center font-black text-sm mb-2 shadow">
                🥈 2
              </div>
              <div className="text-3xl mb-1">{top2.avatar}</div>
              <div className={`text-base font-bold truncate max-w-full ${top2.isCurrentUser ? 'text-amber-400 font-black' : 'text-slate-100'}`}>
                {top2.username} {top2.isCurrentUser && '(நீங்கள்)'}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                <span>{top2.location}</span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-800 w-full grid grid-cols-2 gap-1 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">அதிகாரம்</span>
                  <span className="font-extrabold text-slate-200">{top2.chaptersRead}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">புள்ளிகள்</span>
                  <span className="font-extrabold text-amber-300 font-mono">{top2.score.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden sm:block order-2 sm:order-1" />
          )}

          {/* 1st Place (Gold Podium - Center) */}
          <div className="order-1 sm:order-2 bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-900 border-2 border-amber-500/60 rounded-3xl p-5 flex flex-col items-center text-center relative overflow-hidden shadow-2xl shadow-amber-500/10 sm:-translate-y-2">
            <div className="absolute top-2 right-2">
              <Crown className="w-6 h-6 text-amber-400 fill-amber-400 animate-bounce" />
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black text-base mb-2 shadow-lg">
              🥇 1
            </div>
            <div className="text-4xl mb-1.5">{top1.avatar}</div>
            <div className={`text-lg font-black truncate max-w-full ${top1.isCurrentUser ? 'text-amber-400' : 'text-slate-100'}`}>
              {top1.username} {top1.isCurrentUser && '(நீங்கள்)'}
            </div>
            <div className="text-xs text-amber-300/80 font-medium flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{top1.location}</span>
            </div>
            <div className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 mt-2">
              {top1.badge}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 w-full grid grid-cols-2 gap-1 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">அதிகாரம்</span>
                <span className="font-black text-slate-100">{top1.chaptersRead}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">புள்ளிகள்</span>
                <span className="font-black text-amber-400 font-mono">{top1.score.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 3rd Place (if exists) */}
          {top3 ? (
            <div className="order-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 flex flex-col items-center text-center relative overflow-hidden shadow-lg hover:border-slate-600 transition-all">
              <div className="w-8 h-8 rounded-full bg-amber-900/60 text-amber-300 flex items-center justify-center font-black text-sm mb-2 shadow">
                🥉 3
              </div>
              <div className="text-3xl mb-1">{top3.avatar}</div>
              <div className={`text-base font-bold truncate max-w-full ${top3.isCurrentUser ? 'text-amber-400 font-black' : 'text-slate-100'}`}>
                {top3.username} {top3.isCurrentUser && '(நீங்கள்)'}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                <span>{top3.location}</span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-800 w-full grid grid-cols-2 gap-1 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">அதிகாரம்</span>
                  <span className="font-extrabold text-slate-200">{top3.chaptersRead}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">புள்ளிகள்</span>
                  <span className="font-extrabold text-amber-300 font-mono">{top3.score.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden sm:block order-3" />
          )}
        </div>
      )}

      {/* TOP 25 TABLE LIST */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-3.5 sm:p-6 shadow-xl space-y-2">
        <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="flex items-center gap-3">
            <span>தரம் / விசுவாசி</span>
          </div>
          <div className="flex items-center gap-6 sm:gap-12">
            <span className="text-right">அதிகாரம் & வசனம்</span>
            <span className="text-right w-20 sm:w-24">புள்ளிகள் (Score)</span>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {top25.map((entry) => {
            const isMe = entry.isCurrentUser;

            return (
              <div
                key={entry.id}
                id={`leaderboard-row-${entry.rank}`}
                className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all ${
                  isMe
                    ? 'bg-gradient-to-r from-amber-500/20 via-slate-800 to-slate-800 border-2 border-amber-400 shadow-xl shadow-amber-500/10 scale-[1.01]'
                    : 'bg-slate-800/50 border-slate-800/80 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Left: Rank & Believer details */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {/* Rank Badge */}
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm flex-shrink-0 ${
                      entry.rank === 1
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                        : entry.rank === 2
                        ? 'bg-slate-300 text-slate-950'
                        : entry.rank === 3
                        ? 'bg-amber-700 text-amber-100'
                        : isMe
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                  </div>

                  {/* Avatar */}
                  <div className="text-xl sm:text-2xl flex-shrink-0">
                    {entry.avatar}
                  </div>

                  {/* Name & City */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-xs sm:text-sm truncate ${isMe ? 'font-black text-amber-300 text-sm sm:text-base' : 'font-bold text-slate-100'}`}>
                        {entry.username}
                      </span>
                      {isMe && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 font-black tracking-wide flex items-center gap-0.5">
                          ⭐ நீங்கள்
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{entry.location}</span>
                      </span>
                      <span>•</span>
                      <span className="text-amber-400/90 font-medium">
                        🔥 {entry.streakDays} நாள் தொடர்
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Scores & Counts */}
                <div className="flex items-center gap-4 sm:gap-8 flex-shrink-0">
                  {/* Chapter & Verses */}
                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-extrabold text-slate-200">
                      அத். {String(entry.chaptersRead).padStart(3, '0')}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-400 font-mono">
                      வச. {entry.versesRead.toLocaleString()}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right w-20 sm:w-24">
                    <div className="text-xs sm:text-base font-black text-amber-400 font-mono">
                      {entry.score.toLocaleString()}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-semibold">
                      pts
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* If Current User is Not in Top 25, Show Sticky Bottom Standing Card */}
        {!isUserInTop25 && (
          <div className="pt-4 border-t border-slate-800">
            <div className="bg-gradient-to-r from-emerald-500/20 via-slate-850 to-slate-850 border-2 border-emerald-500/60 rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm">
                  #{currentUserRank}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-slate-100 flex items-center gap-1.5">
                    <span>உங்கள் தற்போதைய உலகளாவிய நிலை (Your Position)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      ⭐ {userProfile.username}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    அதிகாரங்கள்: <strong className="text-emerald-400">{stats.totalChaptersRead}</strong> • வசனங்கள்: <strong className="text-emerald-400">{stats.totalVersesRead}</strong> • புள்ளிகள்: <strong className="text-amber-400 font-mono">{currentUserEntry.score} pts</strong>
                  </div>
                </div>
              </div>

              <div className="text-right sm:text-right">
                <span className="text-xs text-amber-300 font-semibold block">
                  Top 25-ல் இணைய இன்னும் சில வசனங்களை வாசியுங்கள்!
                </span>
                <span className="text-[11px] text-slate-400">
                  ஒவ்வொரு வசனமும் புள்ளிகளை கூட்டும்
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

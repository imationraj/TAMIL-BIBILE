import { UserProfile } from '../types';

const USER_PROFILE_KEY = 'tamil_bible_user_profile_v1';

const DEFAULT_RANDOM_NAMES = [
  'விசுவாசி_77',
  'யோசுவா_12',
  'தாவீது_07',
  'சாமுவேல்_15',
  'எஸ்தர்_09',
  'பவுல்_21',
  'தானியேல்_18',
  'ரூத்_03',
  'கிருபை_88',
  'சீயோன்_10',
  'யோவான்_14',
  'எலிசா_05'
];

export const POPULAR_SUGGESTED_CITIES = [
  'சென்னை',
  'மதுரை',
  'திருநெல்வேலி',
  'கோயம்புத்தூர்',
  'திருச்சி',
  'சேலம்',
  'தூத்துக்குடி',
  'கன்னியாகுமரி',
  'ஈரோடு',
  'வேலூர்',
  'திண்டுக்கல்',
  'தஞ்சாவூர்',
  'நாகர்கோவில்',
  'பெங்களூரு',
  'சிங்கப்பூர்',
  'துபாய்',
  'மலேசியா',
  'கொழும்பு',
  'லண்டன்'
];

const DEFAULT_AVATARS = ['📖', '👑', '🕊️', '⚔️', '⭐', '🛡️', '✝️', '🕯️', '🌾', '⚓'];

export function generateDefaultUserProfile(): UserProfile {
  const randomNameIndex = Math.floor(Math.random() * DEFAULT_RANDOM_NAMES.length);
  const randomAvatarIndex = Math.floor(Math.random() * DEFAULT_AVATARS.length);

  return {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    username: DEFAULT_RANDOM_NAMES[randomNameIndex],
    location: '', // Blank by default so users can type their own city freely
    avatar: DEFAULT_AVATARS[randomAvatarIndex],
    joinedAt: new Date().toISOString()
  };
}

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    if (!raw) {
      const generated = generateDefaultUserProfile();
      saveUserProfile(generated);
      return generated;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.username) {
      const generated = generateDefaultUserProfile();
      saveUserProfile(generated);
      return generated;
    }
    return {
      ...parsed,
      location: parsed.location !== undefined ? parsed.location : ''
    };
  } catch (err) {
    console.error('Error loading user profile:', err);
    return generateDefaultUserProfile();
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    // Sanitize username to max 12 characters as requested
    const cleanUsername = (profile.username || 'விசுவாசி').trim().slice(0, 12);
    const cleanLocation = (profile.location || '').trim().slice(0, 25);
    const updated = {
      ...profile,
      username: cleanUsername || 'விசுவாசி_1',
      location: cleanLocation
    };
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving user profile:', err);
  }
}

export const AVAILABLE_AVATARS = DEFAULT_AVATARS;
export const AVAILABLE_LOCATIONS = POPULAR_SUGGESTED_CITIES;

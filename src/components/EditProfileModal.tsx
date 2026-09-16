import React, { useState } from 'react';
import { UserProfile } from '../types';
import { AVAILABLE_AVATARS, AVAILABLE_LOCATIONS, saveUserProfile } from '../utils/userProfile';
import { User, MapPin, X, Check, Sparkles } from 'lucide-react';

interface EditProfileModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProfile: UserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave
}) => {
  const [username, setUsername] = useState<string>(profile.username);
  const [location, setLocation] = useState<string>(profile.location || '');
  const [avatar, setAvatar] = useState<string>(profile.avatar || '📖');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      setError('தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்');
      return;
    }
    if (trimmed.length > 12) {
      setError('பெயர் அதிகபட்சம் 12 எழுத்துக்கள் மட்டுமே இருக்க வேண்டும்');
      return;
    }

    const cleanLocation = location.trim().slice(0, 25);

    const updated: UserProfile = {
      ...profile,
      username: trimmed,
      location: cleanLocation,
      avatar
    };

    saveUserProfile(updated);
    onSave(updated);
    onClose();
  };

  return (
    <div 
      id="edit-profile-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div 
        id="edit-profile-modal-card"
        className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-lg">
              {avatar}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                <span>விசுவாசி சுயவிவரம் (Profile)</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h2>
              <p className="text-[11px] text-slate-400">
                உலக தரவரிசையில் காட்டப்படும் உங்கள் பெயர்
              </p>
            </div>
          </div>

          <button
            id="btn-close-edit-profile"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Preview Card */}
        <div className="bg-gradient-to-r from-amber-500/10 via-slate-800 to-slate-850 border border-amber-500/30 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-amber-500/40 flex items-center justify-center text-2xl shadow-md">
            {avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-amber-400 font-semibold flex items-center gap-1">
              <span>நேரலை முன்னோட்டம் (Live Preview)</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                ⭐ நீங்கள்
              </span>
            </div>
            <div className="text-base font-extrabold text-slate-100 truncate">
              {username.trim() || 'உங்கள் பெயர்'}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-500" />
              <span>{location.trim() || 'ஊர் குறிப்பிடப்படவில்லை (No city)'}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>உங்கள் பெயர் / புனைப்பெயர் (Username):</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {username.length} / 12 எழுத்துக்கள்
              </span>
            </div>
            <input
              type="text"
              id="input-edit-username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value.slice(0, 12));
                setError(null);
              }}
              placeholder="எ.கா: P. PETHURAJ, யோசுவா_12"
              maxLength={12}
              className="w-full bg-slate-800/90 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-100 focus:outline-none"
              autoFocus
            />
            {error && (
              <p className="text-rose-400 text-xs mt-1">{error}</p>
            )}
          </div>

          {/* Location Input (Free Text so anyone can type any city without restriction) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>உங்கள் ஊர் / நகரம் (City / Location):</span>
              </label>
              <span className="text-[10px] text-slate-400">
                சுயமாக தட்டச்சு செய்யலாம் (Open Typing)
              </span>
            </div>
            
            <div className="relative">
              <input
                type="text"
                id="input-edit-location"
                list="location-suggestions-list"
                value={location}
                onChange={(e) => setLocation(e.target.value.slice(0, 25))}
                placeholder="எ.கா: உங்கள் ஊர் பெயர் (சென்னை, மதுரை, ஈரோடு...)"
                maxLength={25}
                className="w-full bg-slate-800/90 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
              <datalist id="location-suggestions-list">
                {AVAILABLE_LOCATIONS.map(loc => (
                  <option key={loc} value={loc} />
                ))}
              </datalist>
            </div>

            {/* Quick Suggested Cities Chips */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-slate-400">விரைவு தெரிவு:</span>
              {AVAILABLE_LOCATIONS.slice(0, 6).map(city => (
                <button
                  type="button"
                  key={city}
                  onClick={() => setLocation(city)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-all ${
                    location === city
                      ? 'bg-amber-500/25 border-amber-400 text-amber-300 font-bold'
                      : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {city}
                </button>
              ))}
              {location && (
                <button
                  type="button"
                  onClick={() => setLocation('')}
                  className="text-[10px] px-1.5 py-0.5 text-slate-400 hover:text-rose-400 underline"
                >
                  அழி (Clear)
                </button>
              )}
            </div>
          </div>

          {/* Avatar Icon Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              சின்னம் (Spiritual Avatar):
            </label>
            <div className="grid grid-cols-5 gap-2">
              {AVAILABLE_AVATARS.map(item => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setAvatar(item)}
                  className={`p-2.5 rounded-xl border text-xl flex items-center justify-center transition-all ${
                    avatar === item
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 scale-105 shadow-md'
                      : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              ரத்து (Cancel)
            </button>
            <button
              type="submit"
              id="btn-save-profile"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/25 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>சேமி (Save Profile)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

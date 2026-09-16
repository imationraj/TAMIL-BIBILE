import React, { useState } from 'react';
import { ReadingState } from '../types';
import { exportBackupData } from '../utils/storage';
import { Phone, MessageSquare, Mail, Download, Upload, RotateCcw, Play, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

interface AboutUsScreenProps {
  state: ReadingState;
  onRestoreState: (newState: ReadingState) => void;
  onResetAllData: () => void;
  onReplaySplash: () => void;
}

export const AboutUsScreen: React.FC<AboutUsScreenProps> = ({
  state,
  onRestoreState,
  onResetAllData,
  onReplaySplash
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Contact configurations
  const whatsappNumber = '+919840041759';
  const cleanNumber = '919840041759';
  const emailAddress = 'pethuelraj@gmail.com';
  const defaultMsg = encodeURIComponent('வணக்கம் அய்யா, Tamil Bible Reading ஆப் குறித்து தொடர்பு கொள்கிறேன்.');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${defaultMsg}`;
  const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent('Tamil Bible Reading Tracker - இயேசு கிறிஸ்துவின் அன்பின் ஊழியம்')}`;

  // Handle Export Backup
  const handleExport = () => {
    try {
      const dataStr = exportBackupData(state);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tamil_bible_reading_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setStatusMessage('காப்புப்பிரதி (Backup) வெற்றிகரமாக பதிவிறக்கப்பட்டது!');
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      console.error(err);
      setStatusMessage('காப்புப்பிரதி எடுப்பதில் பிழை ஏற்பட்டது.');
    }
  };

  // Handle Import Backup
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed && (parsed.state || parsed.readVerses)) {
          const importedState = parsed.state || parsed;
          onRestoreState(importedState);
          setStatusMessage('தரவு வெற்றிகரமாக மீட்டமைக்கப்பட்டது!');
          setTimeout(() => setStatusMessage(null), 4000);
        } else {
          setStatusMessage('செல்லுபடியாகாத கோப்பு வடிவம்.');
        }
      } catch (err) {
        console.error(err);
        setStatusMessage('கோப்பைப் படிப்பதில் பிழை ஏற்பட்டது.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div id="about-us-screen-container" className="space-y-6 pb-24 sm:pb-12 max-w-4xl mx-auto px-3 sm:px-6 pt-4">
      {/* Ministry Header Card matching image identity */}
      <div className="rounded-2xl bg-gradient-to-b from-[#0a111e] to-slate-900 border-2 border-amber-500/40 p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Amber Cross */}
        <div className="relative z-10 flex justify-center mb-4">
          <div className="w-16 h-18 text-[#f7b036] drop-shadow-[0_0_20px_rgba(247,176,54,0.6)]">
            <svg viewBox="0 0 100 120" fill="currentColor" className="w-16 h-18 mx-auto">
              <rect x="36" y="6" width="28" height="108" rx="14" />
              <rect x="8" y="34" width="84" height="28" rx="14" />
            </svg>
          </div>
        </div>

        {/* English Ministry Name */}
        <h1 className="text-xl sm:text-2xl font-black text-[#f7b036] tracking-wider uppercase mb-1 font-['Plus_Jakarta_Sans',sans-serif]">
          JESUS CHRIST'S LOVING MINISTRY
        </h1>

        {/* Tamil Ministry Name */}
        <p className="text-base sm:text-lg text-slate-100 font-medium mb-1">
          இயேசு கிறிஸ்துவின் அன்பின் ஊழியம்
        </p>

        {/* Founder / Author */}
        <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase mb-5">
          BY P. PETHURAJ
        </p>

        {/* Replay Splash Screen Button */}
        <button
          id="btn-replay-splash"
          onClick={onReplaySplash}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-amber-300 transition-all hover:scale-105 active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>அறிமுகத் திரையைக் காண்க (Play Welcome Screen)</span>
        </button>
      </div>

      {/* CONTACT INFORMATION: WHATSAPP & EMAIL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* WHATSAPP CONTACT CARD */}
        <div className="rounded-2xl bg-slate-800/80 border border-emerald-500/40 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-start gap-3.5 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                வாட்ஸ்அப் தொடர்பு (WhatsApp Contact)
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mt-0.5">
                {whatsappNumber}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                ஜெப விண்ணப்பங்கள், ஆலோசனைகள் மற்றும் கருத்துக்களுக்கு தொடர்பு கொள்ளவும்.
              </p>
            </div>
          </div>

          {/* Direct WhatsApp Button */}
          <a
            id="btn-whatsapp-contact"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-emerald-900/40 transition-all active:scale-95 text-sm w-full min-h-[44px]"
          >
            <Phone className="w-4 h-4" />
            <span>வாட்ஸ்அப்பில் செய்தி அனுப்ப</span>
          </a>
        </div>

        {/* EMAIL CONTACT CARD */}
        <div className="rounded-2xl bg-slate-800/80 border border-amber-500/40 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-start gap-3.5 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                மின்னஞ்சல் தொடர்பு (Email Contact)
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mt-0.5 break-all">
                {emailAddress}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                ஜெப விண்ணப்பங்கள், ஆலோசனைகள் மற்றும் கருத்துக்களை மின்னஞ்சல் வழியாகவும் அனுப்பலாம்.
              </p>
            </div>
          </div>

          {/* Direct Email Button */}
          <a
            id="btn-email-contact"
            href={mailtoUrl}
            className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg shadow-amber-900/40 transition-all active:scale-95 text-sm w-full min-h-[44px]"
          >
            <Mail className="w-4 h-4" />
            <span>மின்னஞ்சல் அனுப்ப (Send Email)</span>
          </a>
        </div>
      </div>

      {/* MINISTRY VISION & APP PURPOSE */}
      <div className="rounded-2xl bg-slate-800/70 border border-slate-700/80 p-5 sm:p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
          <Heart className="w-4 h-4 text-amber-400" />
          <span>ஊழியத்தின் நோக்கம் (Ministry Purpose)</span>
        </h3>

        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
          <p>
            தேவனுடைய பரிசுத்த வேத வாக்கியங்களை ஒவ்வொரு விசுவாசியும் தினமும் தவறாமல் வாசித்து, வசனத்தின் ஆழங்களை அறியச் செய்வதே இந்த செயலியின் தலையாய நோக்கமாகும்.
          </p>
          <p>
            இச்செயலியில் உள்ள 66 புத்தகங்கள், 1,189 அதிகாரங்கள், மற்றும் 31,102 வசனங்கள் அனைத்தும் துல்லியமாக கணக்கிடப்பட்டு உங்களுக்கு வழங்கப்பட்டுள்ளன.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-200 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% ஆஃப்லைன் (Offline) செயல்பாடு</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-200 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>தமிழ் மற்றும் ஆங்கில பெயர்கள் (Bilingual)</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-200 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>தினசரி 10 வசனங்கள் / 1 அதிகாரம் / வருட திட்டம்</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-200 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>துல்லியமான 31,102 வசனங்கள் & தொடர் வாசிப்பு (Streak)</span>
          </div>
        </div>
      </div>

      {/* DATA BACKUP & RESTORE SECTION */}
      <div className="rounded-2xl bg-slate-800/70 border border-slate-700/80 p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>வாசிப்புத் தரவு சேமிப்பு & மீட்டமைப்பு (Backup & Restore)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            உங்கள் வாசிப்பு முன்னேற்றம் உங்கள் சாதனத்திலேயே (Device-Only) பாதுகாப்பாக சேமிக்கப்படுகிறது. சாதனம் மாறும்போது காப்புப்பிரதி எடுத்து மீட்டமைத்துக் கொள்ளலாம்.
          </p>
        </div>

        {statusMessage && (
          <div className="p-3 bg-amber-500/15 border border-amber-500/40 rounded-xl text-xs font-semibold text-amber-300">
            {statusMessage}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {/* Download Standalone HTML for Website */}
          <a
            id="btn-download-standalone-html"
            href="/tamil_bible_tracker.html"
            download="tamil_bible_tracker.html"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>வலைத்தளத்திற்கான HTML கோப்பை பதிவிறக்க (Download HTML)</span>
          </a>

          {/* Export button */}
          <button
            id="btn-export-backup"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>வாசிப்பு காப்புப்பிரதி (Export Backup JSON)</span>
          </button>

          {/* Import button */}
          <label
            htmlFor="import-backup-file"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>மீட்டமை (Import Backup)</span>
            <input
              id="import-backup-file"
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          {/* Reset button */}
          <button
            id="btn-reset-data-trigger"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-800/60 text-red-300 text-xs font-semibold transition-all active:scale-95 ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>தரவை அழிக்க (Reset Data)</span>
          </button>
        </div>

        {/* Reset Confirmation Dialog */}
        {showResetConfirm && (
          <div className="p-4 bg-red-950/60 border border-red-800 rounded-xl space-y-2 mt-2">
            <p className="text-xs font-bold text-red-200">
              எச்சரிக்கை: உங்கள் அனைத்து வாசிப்பு பதிவுகளும் நிரந்தரமாக அழிக்கப்படும். தொடர விரும்புகிறீர்களா?
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                id="btn-confirm-reset"
                onClick={() => {
                  onResetAllData();
                  setShowResetConfirm(false);
                  setStatusMessage('அனைத்து வாசிப்புத் தரவுகளும் ஆரம்ப நிலைக்கு மீட்டமைக்கப்பட்டன.');
                  setTimeout(() => setStatusMessage(null), 4000);
                }}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg"
              >
                ஆம், அழிக்கவும்
              </button>
              <button
                id="btn-cancel-reset"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-lg"
              >
                ரத்து செய்
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Version Info */}
      <div className="text-center text-xs text-slate-500 py-4">
        <div>Tamil Bible Reading Tracker • Version 2.0 (Accurate Bible Totals)</div>
        <div className="mt-1">Dedicated with prayers by P. Pethuraj • Jesus Christ's Loving Ministry</div>
      </div>
    </div>
  );
};

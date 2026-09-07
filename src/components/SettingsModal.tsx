import React, { useState } from 'react';
import { X, Sliders, Globe, Shield, Download, Trash2, CheckCircle2, Moon, Sun, Bell } from 'lucide-react';
import { UserProfile, Language, Jurisdiction } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onUpdateUser: (updatedUser: UserProfile) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  jurisdiction: Jurisdiction;
  setJurisdiction: (jur: Jurisdiction) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  onClearAllHistory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  language,
  setLanguage,
  jurisdiction,
  setJurisdiction,
  isDarkMode,
  setIsDarkMode,
  onClearAllHistory
}) => {
  const [autoCitations, setAutoCitations] = useState(user?.preferences?.autoCitations ?? true);
  const [tkdlAlerts, setTkdlAlerts] = useState(user?.preferences?.tkdlAlerts ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (user) {
      const updated: UserProfile = {
        ...user,
        preferences: {
          defaultJurisdiction: jurisdiction,
          preferredLanguage: language,
          autoCitations,
          tkdlAlerts
        }
      };
      onUpdateUser(updated);
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleExportData = () => {
    const rawSessions = localStorage.getItem('ipsakti_saved_sessions') || '[]';
    const blob = new Blob([rawSessions], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ipsakti-consultations-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      id="settings-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="settings-modal-dialog"
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#042423] border border-slate-200 dark:border-[#134e4a] p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#134e4a]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-[#021f1e] text-[#0d9488] border border-teal-200/60 dark:border-[#134e4a]">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'hi' ? 'सेटिंग्स व प्राथमिकताएं' : 'Settings & Preferences'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'hi' ? 'आईपी परामर्श एवं इंटरफ़ेस विन्यास' : 'Customize IP engine & consultation defaults'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#021f1e] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Setting Groups */}
        <div className="space-y-4 text-xs">
          {/* Default Jurisdiction */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-teal-600" />
                {language === 'hi' ? 'डिफ़ॉल्ट क्षेत्राधिकार' : 'Default Regulatory Jurisdiction'}
              </span>
              <span className="text-[10px] text-slate-400">Statutory scope</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setJurisdiction('india')}
                className={`p-2 rounded-lg text-left transition-all border ${
                  jurisdiction === 'india'
                    ? 'bg-teal-50 dark:bg-[#042f2e] border-[#0d9488] text-teal-950 dark:text-teal-200 font-bold'
                    : 'bg-white dark:bg-[#031c1b] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span className="block text-[11px]">🇮🇳 India</span>
                <span className="block text-[9px] text-slate-400">Sec 3(p), NBA, D&C Act</span>
              </button>
              <button
                type="button"
                onClick={() => setJurisdiction('international')}
                className={`p-2 rounded-lg text-left transition-all border ${
                  jurisdiction === 'international'
                    ? 'bg-teal-50 dark:bg-[#042f2e] border-[#0d9488] text-teal-950 dark:text-teal-200 font-bold'
                    : 'bg-white dark:bg-[#031c1b] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span className="block text-[11px]">🌐 PCT Global</span>
                <span className="block text-[9px] text-slate-400">WIPO, US FDA, Nagoya</span>
              </button>
            </div>
          </div>

          {/* Language & Theme Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a] space-y-1.5">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                {language === 'hi' ? 'भाषा' : 'Language'}
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`flex-1 py-1 rounded text-[11px] font-bold border transition-colors ${
                    language === 'en'
                      ? 'bg-[#042f2e] text-white border-transparent'
                      : 'bg-white dark:bg-[#031c1b] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`flex-1 py-1 rounded text-[11px] font-bold border transition-colors ${
                    language === 'hi'
                      ? 'bg-[#042f2e] text-white border-transparent'
                      : 'bg-white dark:bg-[#031c1b] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a] space-y-1.5">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                {language === 'hi' ? 'थीम' : 'Theme Mode'}
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsDarkMode(false)}
                  className={`flex-1 py-1 rounded text-[11px] font-bold flex items-center justify-center gap-1 border transition-colors ${
                    !isDarkMode
                      ? 'bg-[#042f2e] text-white border-transparent'
                      : 'bg-white dark:bg-[#031c1b] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Sun className="w-3 h-3 text-amber-500" />
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setIsDarkMode(true)}
                  className={`flex-1 py-1 rounded text-[11px] font-bold flex items-center justify-center gap-1 border transition-colors ${
                    isDarkMode
                      ? 'bg-[#042f2e] text-white border-transparent'
                      : 'bg-white dark:bg-[#031c1b] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Moon className="w-3 h-3 text-teal-300" />
                  Dark
                </button>
              </div>
            </div>
          </div>

          {/* Engine Toggles */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a] space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  {language === 'hi' ? 'स्वचालित वैधानिक उद्धरण (Citations)' : 'Auto Statutory Citations'}
                </span>
                <span className="text-[10px] text-slate-500">
                  Tag replies with Section 3(p), NBA Form 3, and Schedule T
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoCitations}
                onChange={(e) => setAutoCitations(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200/70 dark:border-white/10">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  {language === 'hi' ? 'TKDL पूर्व कला टकराव चेतावनियाँ' : 'TKDL Conflict Alerts'}
                </span>
                <span className="text-[10px] text-slate-500">
                  Highlight high-risk formulation similarities automatically
                </span>
              </div>
              <input
                type="checkbox"
                checked={tkdlAlerts}
                onChange={(e) => setTkdlAlerts(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Data Management: Export & Clear */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a] flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                {language === 'hi' ? 'परामर्श डेटा निर्यात' : 'Export Consultation History'}
              </span>
              <span className="text-[10px] text-slate-500">
                Download JSON of all past questions and statutory replies
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportData}
                className="p-2 rounded-lg bg-white dark:bg-[#042f2e] border border-slate-200 dark:border-white/10 hover:border-teal-500 text-slate-700 dark:text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
                title="Download JSON"
              >
                <Download className="w-3.5 h-3.5 text-teal-600" />
                <span>Export</span>
              </button>
              {isConfirmingClear ? (
                <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 px-2 py-1 rounded-lg animate-fade-in">
                  <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300">
                    {language === 'hi' ? 'सभी हटाएं?' : 'Clear all?'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClearAllHistory();
                      setIsConfirmingClear(false);
                    }}
                    className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] shadow-xs cursor-pointer transition-colors"
                  >
                    {language === 'hi' ? 'हाँ' : 'Yes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingClear(false)}
                    className="px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] cursor-pointer transition-colors"
                  >
                    {language === 'hi' ? 'रद्द' : 'Cancel'}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingClear(true)}
                  className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-1.5 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
                  title="Clear All History"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-[#134e4a]">
          {savedSuccess ? (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Preferences Saved!
            </span>
          ) : <span />}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#021f1e] font-medium transition-colors"
            >
              {language === 'hi' ? 'बंद करें' : 'Close'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs rounded-xl bg-[#042f2e] hover:bg-[#134e4a] dark:bg-[#0d9488] dark:hover:bg-[#14b8a6] text-white font-bold transition-all shadow-xs"
            >
              {language === 'hi' ? 'सहेजें' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

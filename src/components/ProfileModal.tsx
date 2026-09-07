import React, { useState } from 'react';
import { X, User, Building, Mail, Calendar, ShieldCheck, Award, FileText, CheckCircle } from 'lucide-react';
import { UserProfile, Language } from '../types';
import { AyurvedaLogo } from './AyurvedaLogo';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onSwitchAccount?: () => void;
  language: Language;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onSwitchAccount,
  language
}) => {
  const [name, setName] = useState(user.name);
  const [organization, setOrganization] = useState(user.organization || '');
  const [role, setRole] = useState(user.role);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name,
      organization,
      role
    };
    onUpdateUser(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div 
      id="profile-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="profile-modal-dialog"
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#042423] border border-slate-200 dark:border-[#134e4a] p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#134e4a]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#042f2e] to-[#0d9488] text-white flex items-center justify-center font-bold text-lg border-2 border-white/20 shadow-md">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'hi' ? 'मेरी प्रोफ़ाइल' : 'My Profile'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user.email}
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

        {/* Verification & Badges */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a]">
            <Award className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block">
              {language === 'hi' ? 'सत्यापित इकाई' : 'Verified'}
            </span>
            <span className="text-[9px] text-slate-500">AYUSH Member</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a]">
            <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400 mx-auto mb-1" />
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block">
              {user.savedConsultationsCount || 0}
            </span>
            <span className="text-[9px] text-slate-500">Saved IP Chats</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block">
              Rule 24C
            </span>
            <span className="text-[9px] text-slate-500">Fast-track Patent</span>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'hi' ? 'नाम' : 'Full Name'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'hi' ? 'भूमिका' : 'Role / Sector'}
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'hi' ? 'कंपनी / संगठन' : 'Organization'}
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a] flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Member Since: <strong className="text-slate-700 dark:text-slate-300">{user.joinedDate}</strong>
            </span>
            {onSwitchAccount && (
              <button
                type="button"
                onClick={onSwitchAccount}
                className="text-teal-700 dark:text-teal-400 font-bold hover:underline cursor-pointer"
              >
                Log in with another account &rarr;
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            {isSaved ? (
              <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                {language === 'hi' ? 'सफलतापूर्वक सहेजा गया' : 'Profile updated!'}
              </span>
            ) : <span />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#021f1e] font-medium transition-colors"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#042f2e] hover:bg-[#134e4a] dark:bg-[#0d9488] dark:hover:bg-[#14b8a6] text-white font-bold transition-all shadow-xs"
              >
                {language === 'hi' ? 'परिवर्तन सहेजें' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

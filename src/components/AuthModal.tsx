import React, { useState } from 'react';
import { X, Lock, Mail, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { UserProfile, Language } from '../types';
import { AyurvedaLogo } from './AyurvedaLogo';
import { signInWithGoogle, loginWithEmail, registerWithEmail } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  language: Language;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  language,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  React.useEffect(() => {
    if (isOpen && initialMode) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);
  
  // Clean, completely empty state with NO pre-filled values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('AYUSH Startup Founder');
  const [organization, setOrganization] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleContinueWithGoogle = async () => {
    setError(null);
    setLoading(true);

    try {
      // Attempt native Firebase Google popup with select_account prompt
      const res = await signInWithGoogle();
      if (res && res.user) {
        const userEmail = res.user.email || 'user@example.com';
        const userName = res.user.displayName || userEmail.split('@')[0].replace(/[._]/g, ' ');

        const loggedUser: UserProfile = {
          id: res.user.uid || `google-${Date.now()}`,
          name: userName,
          email: userEmail,
          role: 'AYUSH Innovator & Researcher',
          organization: 'Ayurvedic Enterprise',
          avatar: res.user.photoURL || 'https://lh3.googleusercontent.com/a/default-user=s96-c',
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          savedConsultationsCount: 1,
          preferences: {
            defaultJurisdiction: 'india',
            preferredLanguage: language,
            autoCitations: true,
            tkdlAlerts: true
          }
        };

        onLogin(loggedUser);
        onClose();
        return;
      }
    } catch (err: any) {
      console.warn("Firebase Google popup error:", err);
      if (err?.code === 'auth/configuration-not-found') {
        setError(
          'Google Sign-in is not yet enabled in your Firebase Console for project "sih-auth-ip-shakti". In your open tab "sih auth ip shakti", go to Authentication > Sign-in method, click Google, and toggle Enable. Alternatively, use the Email & Password form below.'
        );
      } else if (err?.code === 'auth/popup-closed-by-user') {
        setError('The Google sign-in window was closed. Please try clicking "Continue with Google" again, or use Email/Password below.');
      } else if (err?.code === 'auth/unauthorized-domain') {
        setError('This app domain is not yet added to your Firebase Authorized Domains list. Please use the Email & Password form below.');
      } else {
        setError(err?.message || 'Google authentication encountered an issue. Please try again or use Email/Password below.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        if (!email.trim() || !password.trim()) {
          setError(language === 'hi' ? 'कृपया ईमेल और पासवर्ड दर्ज करें' : 'Please enter both email and password');
          setLoading(false);
          return;
        }

        const res = await loginWithEmail(email.trim(), password.trim());
        const loggedUser: UserProfile = {
          id: res.user.uid || `user-${Date.now()}`,
          name: res.user.displayName || email.split('@')[0].replace(/[._]/g, ' ').toUpperCase(),
          email: email.trim(),
          role: 'AYUSH Practitioner / Founder',
          organization: 'AYUSH Innovations',
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          savedConsultationsCount: 1,
          preferences: {
            defaultJurisdiction: 'india',
            preferredLanguage: language,
            autoCitations: true,
            tkdlAlerts: true
          }
        };
        onLogin(loggedUser);
        onClose();
      } else {
        if (!name.trim() || !email.trim() || !password.trim()) {
          setError(language === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें' : 'Please complete all required fields');
          setLoading(false);
          return;
        }

        const res = await registerWithEmail(email.trim(), password.trim(), name.trim());
        const newUser: UserProfile = {
          id: res.user.uid || `user-${Date.now()}`,
          name: name.trim(),
          email: email.trim(),
          role: role,
          organization: organization.trim() || 'Ayurvedic Enterprise',
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          savedConsultationsCount: 0,
          preferences: {
            defaultJurisdiction: 'india',
            preferredLanguage: language,
            autoCitations: true,
            tkdlAlerts: true
          }
        };
        onLogin(newUser);
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      id="auth-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="auth-modal-dialog"
        className="w-full max-w-md rounded-2xl bg-white dark:bg-[#042423] border border-slate-200 dark:border-[#134e4a] p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Logo & Close */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#134e4a]">
          <div className="flex items-center gap-2.5">
            <AyurvedaLogo size={32} />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {mode === 'signin' 
                  ? (language === 'hi' ? 'खाते में प्रवेश करें' : 'Sign in to IP-SAKTI') 
                  : (language === 'hi' ? 'नया खाता बनाएँ' : 'Create an Account')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'hi' ? 'आयुष बौद्धिक संपदा सुरक्षित सत्र' : 'Secure AYUSH IP & Consultation Vault'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#021f1e] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Clean Continue with Google (NO email input, NO continue text box) */}
        <div className="space-y-3">
          <button
            id="google-signin-btn"
            type="button"
            disabled={loading}
            onClick={handleContinueWithGoogle}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-[#134e4a] bg-white dark:bg-[#021f1e] hover:bg-slate-50 dark:hover:bg-[#032e2a] text-slate-800 dark:text-slate-100 font-semibold text-xs flex items-center justify-center gap-2.5 shadow-xs transition-all cursor-pointer"
          >
            {/* Google SVG */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{loading ? 'Opening Google Account Chooser...' : (language === 'hi' ? 'गूगल से जारी रखें' : 'Continue with Google')}</span>
          </button>

          {/* Yellow Line: Exactly requested prompt */}
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Please select which Google account you would like to continue with.</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold block mb-0.5">Authentication Note:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="relative flex items-center justify-center my-1">
          <div className="border-t border-slate-200 dark:border-[#134e4a] w-full" />
          <span className="bg-white dark:bg-[#042423] px-3 text-[10px] uppercase font-bold text-slate-400">
            {language === 'hi' ? 'या ईमेल द्वारा' : 'Or with Email'}
          </span>
        </div>

        {/* Section 2: Regular Registration / Sign In */}
        <div className="space-y-3">
          {/* Tab Switch */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-[#021f1e] p-1 border border-slate-200 dark:border-[#134e4a]">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-[#042f2e] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {language === 'hi' ? 'लॉग इन' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#042f2e] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {language === 'hi' ? 'नया पंजीकरण' : 'Sign Up'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2.5">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'पूरा नाम' : 'Full Name'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'hi' ? 'भूमिका' : 'Role'}
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-2 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
                    >
                      <option value="AYUSH Startup Founder">AYUSH Startup Founder</option>
                      <option value="Ayurvedic Formulator">Ayurvedic Formulator</option>
                      <option value="Botanical Cultivator">Botanical Cultivator</option>
                      <option value="IP Attorney / Counsel">IP Attorney / Counsel</option>
                      <option value="R&D Researcher">R&D Researcher</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'hi' ? 'संस्था' : 'Organization'}
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Organization Name"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'hi' ? 'ईमेल पता' : 'Email Address'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'hi' ? 'पासवर्ड' : 'Password'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#042f2e] hover:bg-[#134e4a] dark:bg-[#0d9488] dark:hover:bg-[#14b8a6] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span>
                {loading 
                  ? (language === 'hi' ? 'प्रतीक्षा करें...' : 'Authenticating...') 
                  : (mode === 'signin' 
                      ? (language === 'hi' ? 'प्रवेश करें' : 'Sign In') 
                      : (language === 'hi' ? 'खाता पंजीकृत करें' : 'Create Account'))}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

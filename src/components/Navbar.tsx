import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquareText, 
  History, 
  Sun, 
  Moon, 
  User, 
  Sliders, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X, 
  ChevronDown, 
  AlertTriangle,
  Scale,
  Package,
  Globe,
  Home,
  Shield
} from 'lucide-react';
import { ActiveTab, Language, UserProfile } from '../types';
import { AyurvedaLogo } from './AyurvedaLogo';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  onToggleLanguage: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  user: UserProfile | null;
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onLogout: () => void;
  savedSessionsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  onToggleLanguage,
  isDarkMode,
  onToggleTheme,
  user,
  onOpenLogin,
  onOpenSignUp,
  onOpenProfile,
  onOpenSettings,
  onOpenHistory,
  onLogout,
  savedSessionsCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const isHindi = language === 'hi';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full sticky top-0 z-40 flex flex-col shadow-md">
      
      {/* 1. Top Government Administrative Bar (Navy Slate - matching e-aushadhi.gov.in official portal) */}
      <div 
        id="top-gov-admin-bar"
        className="w-full bg-[#0E241B] dark:bg-[#07140E] text-[#C8E6C9] text-[10pt] sm:text-[11pt] border-b border-[#1F3F30] px-3 sm:px-6 lg:px-8 py-1.5"
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
          {/* Left: Emblem & Ministry text */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Indian Flag subtle tricolor strip */}
            <div className="flex flex-col w-3.5 h-2.5 rounded-[1px] overflow-hidden shrink-0 border border-white/20">
              <div className="bg-[#FF9933] h-1/3 w-full" />
              <div className="bg-[#FFFFFF] h-1/3 w-full" />
              <div className="bg-[#128807] h-1/3 w-full" />
            </div>
            <span className="font-bold text-white tracking-wide whitespace-nowrap">
              {isHindi ? 'भारत सरकार' : 'GOVERNMENT OF INDIA'}
            </span>
            <span className="text-white/40 hidden sm:inline">|</span>
            <span className="text-[#A5D6A7] font-medium hidden sm:inline truncate max-w-[280px]">
              {isHindi ? 'आयुष मंत्रालय' : 'MINISTRY OF AYUSH'}
            </span>
          </div>

          {/* Right: Accessibility, Theme converter & Language switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-white">
            
            {/* Language Switcher Button */}
            <button
              id="topbar-language-toggle-btn"
              onClick={onToggleLanguage}
              aria-label="Switch language between English and Hindi"
              className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-[10pt] sm:text-[11pt] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap border border-white/20"
              title={isHindi ? 'Switch to English' : 'हिन्दी में बदलें'}
            >
              <Globe className="w-3.5 h-3.5 text-[#A5D6A7] shrink-0" />
              <span>{isHindi ? 'English' : 'हिन्दी'}</span>
            </button>

            {/* Dark / Light Theme Switcher */}
            <button
              id="topbar-theme-toggle-btn"
              onClick={onToggleTheme}
              aria-label="Toggle Light and Dark Mode"
              className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-[10pt] sm:text-[11pt] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap border border-white/20"
              title={isDarkMode ? (isHindi ? 'लाइट मोड चालू करें' : 'Switch to Light Mode') : (isHindi ? 'डार्क मोड चालू करें' : 'Switch to Dark Mode')}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>{isHindi ? 'लाइट' : 'Light'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                  <span>{isHindi ? 'डार्क' : 'Dark'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Statutory Red Warning Disclaimer Banner */}
      <div 
        id="header-red-warning-banner"
        className="w-full bg-[#C62828] dark:bg-[#B71C1C] text-white font-bold text-[11pt] sm:text-[12pt] px-4 py-1 flex items-center justify-center gap-2 text-center shadow-xs"
        role="alert"
      >
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-200" />
        <span className="leading-tight truncate">
          {isHindi 
            ? 'यह पोर्टल केवल विनियामक व कानूनी सूचनात्मक है। कानूनी सलाह नहीं है। किसी योग्य पेटेंट विशेषज्ञ से परामर्श लें।'
            : 'Statutory Notice: For informational & compliance guidance only. Not legal advice. Consult a human IP practitioner.'}
        </span>
      </div>

      {/* 3. Main Navigation Bar (Clean White in light mode, Deep Forest in dark mode) */}
      <div 
        id="app-top-navbar" 
        className="w-full bg-white dark:bg-[#12281E] text-[#1B5E20] dark:text-[#E8F5E9] min-h-[64px] flex items-center border-b border-[#C8E6C9] dark:border-[#1F3F30] px-3 sm:px-6 lg:px-8 transition-colors"
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button 
              id="brand-logo-button"
              onClick={() => setActiveTab('home')}
              className="group flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
            >
              <AyurvedaLogo size={38} />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[16pt] sm:text-[18pt] font-bold tracking-tight text-[#1B5E20] dark:text-white leading-tight whitespace-nowrap">
                    {isHindi ? 'आईपी-शक्ति' : 'IP-SAKTI'} <span className="text-[#2E7D32] dark:text-[#4CAF50] font-normal">{isHindi ? 'सहायक' : 'Sahayak'}</span>
                  </span>
                </div>
                <p className="hidden md:block text-[10.5pt] text-[#4E7D59] dark:text-[#A5D6A7] font-semibold leading-none whitespace-nowrap">
                  {isHindi ? 'आयुर्वेद बौद्धिक संपदा एवं रोगी सुरक्षा पोर्टल' : 'Ayurveda Intellectual Property & Patient Safety'}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Menu */}
          <nav id="navbar-nav-menu" className="hidden lg:flex items-center gap-4 xl:gap-6 text-[13pt] font-bold shrink-0">
            
            <button
              id="nav-tab-home"
              onClick={() => setActiveTab('home')}
              className={`transition-all py-1.5 px-2 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'home'
                  ? 'bg-[#E8F5E9] dark:bg-[#1A382B] text-[#1B5E20] dark:text-white font-black'
                  : 'text-[#2E7D32] dark:text-[#C8E6C9] hover:bg-[#E8F5E9]/60 dark:hover:bg-[#1A382B]/60'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>{isHindi ? 'होम' : 'Home'}</span>
            </button>

            <button
              id="nav-tab-products"
              onClick={() => setActiveTab('products')}
              className={`transition-all py-1.5 px-2 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-[#E8F5E9] dark:bg-[#1A382B] text-[#1B5E20] dark:text-white font-black'
                  : 'text-[#2E7D32] dark:text-[#C8E6C9] hover:bg-[#E8F5E9]/60 dark:hover:bg-[#1A382B]/60'
              }`}
            >
              <Package className="w-4 h-4 shrink-0" />
              <span>{isHindi ? 'स्वीकृत उत्पाद (6)' : 'Approved Products (6)'}</span>
            </button>

            <button
              id="nav-tab-laws"
              onClick={() => setActiveTab('laws')}
              className={`transition-all py-1.5 px-2 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'laws'
                  ? 'bg-[#E8F5E9] dark:bg-[#1A382B] text-[#1B5E20] dark:text-white font-black'
                  : 'text-[#2E7D32] dark:text-[#C8E6C9] hover:bg-[#E8F5E9]/60 dark:hover:bg-[#1A382B]/60'
              }`}
            >
              <Scale className="w-4 h-4 shrink-0" />
              <span>{isHindi ? 'प्रत्यक्ष कानून' : 'Direct Laws'}</span>
            </button>

            <button
              id="nav-tab-chat"
              onClick={() => setActiveTab('chat')}
              className={`transition-all py-1.5 px-2 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'chat'
                  ? 'bg-[#E8F5E9] dark:bg-[#1A382B] text-[#1B5E20] dark:text-white font-black'
                  : 'text-[#2E7D32] dark:text-[#C8E6C9] hover:bg-[#E8F5E9]/60 dark:hover:bg-[#1A382B]/60'
              }`}
            >
              <MessageSquareText className="w-4 h-4 shrink-0" />
              <span>{isHindi ? 'एआई सहायक' : 'AI Assistant'}</span>
            </button>

            <button
              id="nav-tab-history"
              onClick={onOpenHistory}
              className="text-[#2E7D32] dark:text-[#C8E6C9] hover:bg-[#E8F5E9]/60 dark:hover:bg-[#1A382B]/60 transition-all py-1.5 px-2 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              title={isHindi ? 'सुरक्षित इतिहास देखें' : 'View saved consultation history'}
            >
              <History className="w-4 h-4 text-[#2E7D32] dark:text-[#A5D6A7] shrink-0" />
              <span>{isHindi ? 'इतिहास' : 'History'}</span>
              {savedSessionsCount > 0 && (
                <span className="text-[10pt] font-bold px-1.5 py-0.2 rounded-full bg-[#2E7D32] text-white">
                  {savedSessionsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Controls: Sign In & Sign Up (firmly anchored, never slide off) */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <div className="relative shrink-0" ref={userDropdownRef}>
                <button
                  id="user-profile-menu-button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg bg-[#E8F5E9] dark:bg-[#1A382B] hover:bg-[#C8E6C9] text-[#1B5E20] dark:text-white text-[12pt] sm:text-[13pt] font-bold border border-[#A5D6A7] dark:border-[#2E5C46] transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <div className="w-6 h-6 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-[10pt]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate text-left">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#A5D6A7]" />
                </button>

                {userDropdownOpen && (
                  <div 
                    id="user-profile-dropdown"
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#12281E] border border-[#C8E6C9] dark:border-[#1F3F30] p-2 shadow-2xl z-50 text-[#1B5E20] dark:text-[#E8F5E9]"
                  >
                    <div className="px-3 py-2 border-b border-[#C8E6C9] dark:border-[#1F3F30]">
                      <p className="text-[13pt] font-bold text-[#1B5E20] dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[11pt] text-[#2E7D32] dark:text-[#A5D6A7] truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-1 space-y-0.5 text-[12pt] font-bold">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenProfile();
                        }}
                        className="w-full px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-[#E8F5E9] dark:hover:bg-[#1A382B] text-left transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4 text-[#2E7D32] dark:text-[#A5D6A7]" />
                        <span>{isHindi ? 'मेरी प्रोफ़ाइल' : 'My Profile'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenSettings();
                        }}
                        className="w-full px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-[#E8F5E9] dark:hover:bg-[#1A382B] text-left transition-colors cursor-pointer"
                      >
                        <Sliders className="w-4 h-4 text-[#2E7D32] dark:text-[#A5D6A7]" />
                        <span>{isHindi ? 'सेटिंग्स' : 'Settings'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-700 dark:text-red-400 text-left transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{isHindi ? 'लॉग आउट' : 'Log Out'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                {/* Official Government Portal Styled "Sign In" Button */}
                <button
                  id="login-button"
                  onClick={onOpenLogin}
                  className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-[#374151] hover:bg-[#1F2937] text-white text-[11pt] sm:text-[12pt] font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 border border-gray-600"
                  title={isHindi ? 'खाते में लॉगिन करें' : 'Log in to your account'}
                >
                  <LogIn className="w-3.5 h-3.5 text-gray-200 shrink-0" />
                  <span>{isHindi ? 'लॉगिन' : 'Sign In'}</span>
                </button>

                {/* Official Government Portal Styled "Sign Up" Button */}
                <button
                  id="signup-button"
                  onClick={onOpenSignUp}
                  className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-[11pt] sm:text-[12pt] font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 border border-[#1B5E20]"
                  title={isHindi ? 'नया खाता बनाएँ' : 'Create a new account'}
                >
                  <UserPlus className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>{isHindi ? 'साइन अप' : 'Sign Up'}</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Button (<lg) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-[#E8F5E9] dark:bg-[#1A382B] text-[#1B5E20] dark:text-[#E8F5E9] hover:bg-[#C8E6C9] cursor-pointer shrink-0 ml-1 border border-[#C8E6C9] dark:border-[#2E5C46]"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#12281E] border-b border-[#C8E6C9] dark:border-[#1F3F30] p-4 space-y-2 text-[#1B5E20] dark:text-[#E8F5E9] shadow-xl">
          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className={`w-full p-2.5 rounded-xl text-left text-[13pt] font-bold flex items-center gap-2 ${
              activeTab === 'home' 
                ? 'bg-[#2E7D32] text-white' 
                : 'hover:bg-[#E8F5E9] dark:hover:bg-[#1A382B]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>{isHindi ? 'होम' : 'Home'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('products'); setMobileMenuOpen(false); }}
            className={`w-full p-2.5 rounded-xl text-left text-[13pt] font-bold flex items-center gap-2 ${
              activeTab === 'products' 
                ? 'bg-[#2E7D32] text-white' 
                : 'hover:bg-[#E8F5E9] dark:hover:bg-[#1A382B]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{isHindi ? 'स्वीकृत उत्पाद (6 कानूनी मानक)' : 'Approved Products (6 Formulations)'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('laws'); setMobileMenuOpen(false); }}
            className={`w-full p-2.5 rounded-xl text-left text-[13pt] font-bold flex items-center gap-2 ${
              activeTab === 'laws' 
                ? 'bg-[#2E7D32] text-white' 
                : 'hover:bg-[#E8F5E9] dark:hover:bg-[#1A382B]'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{isHindi ? 'प्रत्यक्ष कानून डैशबोर्ड' : 'Direct Laws Dashboard'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('chat'); setMobileMenuOpen(false); }}
            className={`w-full p-2.5 rounded-xl text-left text-[13pt] font-bold flex items-center gap-2 ${
              activeTab === 'chat' 
                ? 'bg-[#2E7D32] text-white' 
                : 'hover:bg-[#E8F5E9] dark:hover:bg-[#1A382B]'
            }`}
          >
            <MessageSquareText className="w-4 h-4" />
            <span>{isHindi ? 'एआई कानूनी सहायक' : 'AI Legal Assistant'}</span>
          </button>

          <button
            onClick={() => { onOpenHistory(); setMobileMenuOpen(false); }}
            className="w-full p-2.5 rounded-xl text-left text-[13pt] font-bold hover:bg-[#E8F5E9] dark:hover:bg-[#1A382B] flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span>{isHindi ? 'सुरक्षित इतिहास' : 'Saved History'}</span>
            </div>
            {savedSessionsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#2E7D32] text-white font-bold text-[10pt]">
                {savedSessionsCount}
              </span>
            )}
          </button>
        </div>
      )}

    </header>
  );
};

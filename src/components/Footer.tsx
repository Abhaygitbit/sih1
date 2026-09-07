import React from 'react';
import { Leaf, ShieldCheck, Award, AlertTriangle } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  language: Language;
  onOpenResources: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onOpenResources }) => {
  const isHindi = language === 'hi';

  return (
    <footer 
      id="app-footer"
      className="w-full mt-auto border-t border-[#C8E6C9] dark:border-[#1F3F30] bg-white dark:bg-[#12281E] text-[13pt] text-[#2E7D32] dark:text-[#A5D6A7] shadow-xs"
    >
      {/* Subtle Statutory Note inside footer (Clean, non-clashing with top red banner) */}
      <div className="w-full bg-[#E8F5E9] dark:bg-[#0A1A12] border-b border-[#C8E6C9] dark:border-[#1F3F30] py-2 px-4 text-center">
        <p className="text-[11pt] sm:text-[12pt] font-semibold text-[#1B5E20] dark:text-[#E8F5E9] flex items-center justify-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />
          <span>
            {isHindi 
              ? 'अस्वीकरण: यह मंच केवल सूचनात्मक एवं शैक्षणिक उद्देश्यों के लिए है। वास्तविक पेटेंट या निर्माण हेतु योग्य आयुष कानूनी विशेषज्ञ से परामर्श लें।'
              : 'Disclaimer: This platform provides regulatory information only. Not a substitute for licensed legal, patent, or clinical counsel.'}
          </span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Branding note */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#E8F5E9] dark:bg-[#1A382B] text-[#2E7D32] dark:text-[#4CAF50] flex items-center justify-center border border-[#A5D6A7] dark:border-[#2E5C46] shrink-0">
            <Leaf className="w-4 h-4" />
          </div>
          <p className="font-bold text-[#1B5E20] dark:text-white text-[13pt] sm:text-[14pt]">
            {isHindi 
              ? 'आयुष स्टार्टअप्स, वैद्यों एवं उत्पादकों के लिए निर्मित'
              : 'Made for AYUSH startups, Ayurvedic physicians & cultivators'}
          </p>
        </div>

        {/* Regulatory Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[12pt] sm:text-[13pt] font-semibold text-[#2E7D32] dark:text-[#A5D6A7]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50] shrink-0" />
            <span>TKDL IPC Catalog</span>
          </span>
          <span className="text-[#C8E6C9] dark:text-[#1F3F30] hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#D97706] shrink-0" />
            <span>NBA ABS Form 3</span>
          </span>
          <span className="text-[#C8E6C9] dark:text-[#1F3F30] hidden sm:inline">•</span>
          <button 
            onClick={onOpenResources}
            className="text-[#1B5E20] dark:text-[#E8F5E9] hover:text-[#2E7D32] dark:hover:text-[#4CAF50] underline font-bold cursor-pointer"
          >
            {isHindi ? 'कानूनी संसाधन एवं पोर्टल' : 'Statutory Resources & Portals'}
          </button>
        </div>

        {/* System info */}
        <div className="text-[11pt] sm:text-[12pt] text-[#2E7D32] dark:text-[#A5D6A7] text-center sm:text-right">
          <span>IP-SAKTI Sahayak • Ayurvedic IP &amp; Patient Safety</span>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { 
  Globe, 
  MapPin, 
  ShieldAlert, 
  Scale, 
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Jurisdiction, Language } from '../types';
import { UI_TRANSLATIONS } from '../data/ayurvedaData';

interface JurisdictionSidebarProps {
  jurisdiction: Jurisdiction;
  setJurisdiction: (j: Jurisdiction) => void;
  language: Language;
  onSelectPrompt: (prompt: string) => void;
}

export const JurisdictionSidebar: React.FC<JurisdictionSidebarProps> = ({
  jurisdiction,
  setJurisdiction,
  language,
  onSelectPrompt
}) => {
  const isIndia = jurisdiction === 'india';
  const t = UI_TRANSLATIONS[language];

  return (
    <aside 
      id="left-jurisdiction-sidebar"
      className="w-full lg:w-72 shrink-0 flex flex-col gap-4 p-4 sm:p-5 bg-white dark:bg-[#042423] rounded-2xl border border-slate-200 dark:border-[#134e4a] shadow-xs"
    >
      {/* Big "Jurisdiction" Toggle Switch: India (left, highlighted) vs International (right) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-[#0d9488] dark:text-[#14b8a6]" />
            <span>{t.jurisdictionLabel}</span>
          </h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isIndia
              ? 'bg-teal-50 dark:bg-[#021f1e] text-teal-800 dark:text-[#14b8a6] border-teal-200 dark:border-teal-800'
              : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
          }`}>
            {isIndia ? '🇮🇳 India Focus' : '🌐 PCT Global'}
          </span>
        </div>

        {/* The Big Toggle Button: India (left, highlighted) vs International (right) */}
        <div 
          id="jurisdiction-big-toggle"
          className="flex p-1 bg-slate-100 dark:bg-[#021f1e] rounded-xl border border-slate-200 dark:border-[#134e4a]"
          role="group"
          aria-label="Select Legal Jurisdiction"
        >
          {/* India Button (Left, highlighted by default) */}
          <button
            id="jurisdiction-btn-india"
            type="button"
            onClick={() => setJurisdiction('india')}
            className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isIndia
                ? 'bg-[#0d9488] text-white shadow-sm font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="text-sm">🇮🇳</span>
            <span>{language === 'en' ? 'India' : 'भारत'}</span>
          </button>

          {/* International Button (Right) */}
          <button
            id="jurisdiction-btn-international"
            type="button"
            onClick={() => setJurisdiction('international')}
            className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              !isIndia
                ? 'bg-[#0d9488] text-white shadow-sm font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'International' : 'अंतर्राष्ट्रीय'}</span>
          </button>
        </div>
      </div>

      {/* Active Jurisdiction Focus Card */}
      <div className={`p-3.5 rounded-xl border transition-all ${
        isIndia 
          ? 'bg-teal-50/70 dark:bg-[#021f1e]/80 border-teal-200 dark:border-teal-800'
          : 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800'
      }`}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <ShieldAlert className={`w-4 h-4 shrink-0 ${isIndia ? 'text-teal-700 dark:text-[#14b8a6]' : 'text-indigo-600 dark:text-indigo-400'}`} />
          <span className={`text-xs font-bold ${isIndia ? 'text-teal-900 dark:text-white' : 'text-indigo-900 dark:text-white'}`}>
            {isIndia 
              ? (language === 'en' ? 'Indian Statutory Domain' : 'भारतीय वैधानिक व्यवस्था')
              : (language === 'en' ? 'International PCT & WIPO Domain' : 'अंतर्राष्ट्रीय पीसीटी व विप्रो व्यवस्था')
            }
          </span>
        </div>
        <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
          {isIndia 
            ? (language === 'en' 
                ? 'Answers are grounded in Indian Patents Act 1970 (Section 3(p), 3(e), 3(d)), National Biodiversity Authority (NBA) Form 3 approvals, and TKDL prior art protection.' 
                : 'उत्तर भारतीय पेटेंट अधिनियम 1970 (धारा 3(p), 3(e)), राष्ट्रीय जैव विविधता प्राधिकरण (NBA) फॉर्म 3 और टीकेडीएल पूर्व कला पर केंद्रित हैं।')
            : (language === 'en'
                ? 'Answers focus on WIPO PCT Chapter I/II filings, USPTO 35 U.S.C. 101/102 prior art challenges by TKDL, EPO Article 54, and Nagoya Protocol cross-border ABS.'
                : 'उत्तर WIPO PCT फाइलिंग, USPTO, EPO तथा नागोया प्रोटोकॉल सीमा पार आनुवंशिक ABS अनुपालन पर केंद्रित हैं।')
          }
        </p>
      </div>

      {/* Quick Questions for this Jurisdiction */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#0d9488]" />
          <span>{language === 'en' ? 'Quick Jurisdiction Prompts' : 'त्वरित प्रश्न'}</span>
        </p>

        <div className="space-y-1.5">
          {isIndia ? (
            <>
              <button
                onClick={() => onSelectPrompt(
                  language === 'en'
                    ? 'How do I overcome Section 3(p) for an Ayurvedic formulation under Indian Patent law?'
                    : 'भारतीय पेटेंट कानून में आयुर्वेदिक फॉर्मूलेशन के लिए धारा 3(p) की आपत्ति कैसे दूर करें?'
                )}
                className="w-full text-left p-2.5 rounded-lg bg-slate-50 dark:bg-[#021f1e] hover:bg-teal-50 dark:hover:bg-[#032e2a] border border-slate-200 dark:border-[#134e4a] text-xs text-slate-700 dark:text-slate-200 hover:text-[#0d9488] transition-colors cursor-pointer"
              >
                <span className="font-semibold block">Sec 3(p) TK Objection</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Overcoming traditional knowledge bar</span>
              </button>

              <button
                onClick={() => onSelectPrompt(
                  language === 'en'
                    ? 'What is the exact process and timing to file NBA Form 3 with the National Biodiversity Authority before patent grant?'
                    : 'पेटेंट अनुदान से पहले राष्ट्रीय जैव विविधता प्राधिकरण (NBA) से फॉर्म 3 की समयसीमा क्या है?'
                )}
                className="w-full text-left p-2.5 rounded-lg bg-slate-50 dark:bg-[#021f1e] hover:bg-teal-50 dark:hover:bg-[#032e2a] border border-slate-200 dark:border-[#134e4a] text-xs text-slate-700 dark:text-slate-200 hover:text-[#0d9488] transition-colors cursor-pointer"
              >
                <span className="font-semibold block">NBA Form 3 Approval</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Mandatory biodiversity clearance</span>
              </button>

              <button
                onClick={() => onSelectPrompt(
                  language === 'en'
                    ? 'What scientific evidence is required under Section 3(e) to prove true synergy instead of mere admixture?'
                    : 'धारा 3(e) के तहत मात्र मिश्रण के स्थान पर वास्तविक तालमेल (Synergy) सिद्ध करने के लिए क्या प्रमाण चाहिए?'
                )}
                className="w-full text-left p-2.5 rounded-lg bg-slate-50 dark:bg-[#021f1e] hover:bg-teal-50 dark:hover:bg-[#032e2a] border border-slate-200 dark:border-[#134e4a] text-xs text-slate-700 dark:text-slate-200 hover:text-[#0d9488] transition-colors cursor-pointer"
              >
                <span className="font-semibold block">Section 3(e) Synergy Data</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Combination Index CI &lt; 0.8 data</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onSelectPrompt(
                  language === 'en'
                    ? 'How can I file a PCT international patent application for an Ayurvedic innovation while complying with Indian NBA rules?'
                    : 'भारतीय एनबीए नियमों का पालन करते हुए आयुर्वेदिक नवाचार पर पीसीटी अंतर्राष्ट्रीय पेटेंट कैसे दाखिल करें?'
                )}
                className="w-full text-left p-2.5 rounded-lg bg-slate-50 dark:bg-[#021f1e] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-[#134e4a] text-xs text-slate-700 dark:text-slate-200 hover:text-[#0d9488] transition-colors cursor-pointer"
              >
                <span className="font-semibold block">PCT International Strategy</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">WIPO Chapter I/II timelines</span>
              </button>

              <button
                onClick={() => onSelectPrompt(
                  language === 'en'
                    ? 'How does the Traditional Knowledge Digital Library (TKDL) block foreign patents on Indian herbs at USPTO and EPO?'
                    : 'टीकेडीएल (TKDL) यूएस एवं यूरोप में भारतीय जड़ी-बूटियों पर विदेशी पेटेंट को कैसे रोकता है?'
                )}
                className="w-full text-left p-2.5 rounded-lg bg-slate-50 dark:bg-[#021f1e] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-[#134e4a] text-xs text-slate-700 dark:text-slate-200 hover:text-[#0d9488] transition-colors cursor-pointer"
              >
                <span className="font-semibold block">TKDL Foreign Prior Art</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">USPTO &amp; EPO access pacts</span>
              </button>

              <button
                onClick={() => onSelectPrompt(
                  language === 'en'
                    ? 'What are the cross-border Nagoya Protocol ABS obligations when exporting Indian botanical extracts for global clinical trials?'
                    : 'वैश्विक नैदानिक परीक्षणों के लिए भारतीय वनस्पति अर्क निर्यात करने पर नागोया प्रोटोकॉल के नियम क्या हैं?'
                )}
                className="w-full text-left p-2.5 rounded-lg bg-slate-50 dark:bg-[#021f1e] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-[#134e4a] text-xs text-slate-700 dark:text-slate-200 hover:text-[#0d9488] transition-colors cursor-pointer"
              >
                <span className="font-semibold block">Nagoya Protocol &amp; ABS</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">PIC &amp; MAT agreements</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Red Warning Reminder */}
      <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-center">
        <p className="text-[10px] text-red-700 dark:text-red-300 font-bold flex items-center justify-center gap-1">
          <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" />
          <span>Information only. Not legal advice.</span>
        </p>
      </div>
    </aside>
  );
};

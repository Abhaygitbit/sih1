import React from 'react';
import { 
  X, 
  BookOpen, 
  ExternalLink, 
  FileText, 
  ShieldCheck, 
  Download, 
  Landmark, 
  Sparkles,
  Leaf
} from 'lucide-react';
import { Language } from '../types';

interface ResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ResourcesModal: React.FC<ResourcesModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  const isHindi = language === 'hi';

  const resources = [
    {
      title: isHindi ? 'पारंपरिक ज्ञान डिजिटल लाइब्रेरी (TKDL)' : 'Traditional Knowledge Digital Library (TKDL)',
      org: 'CSIR & Ministry of AYUSH',
      desc: isHindi 
        ? '4.5 लाख से अधिक शास्त्रीय योगों का डिजिटाइज्ड ज्ञानकोष, जो विदेशी पेटेंट कार्यालयों को पूर्व कला (Prior Art) प्रस्तुत करता है।'
        : 'World-first digital catalog of over 450,000 classical formulations translated into 5 international languages, preventing misappropriation at USPTO, EPO, and JPO.',
      link: 'https://www.tkdl.res.in',
      tag: 'Prior Art Defense'
    },
    {
      title: isHindi ? 'राष्ट्रीय जैव विविधता प्राधिकरण (NBA) पोर्टल' : 'National Biodiversity Authority (NBA)',
      org: 'Ministry of Environment, Forest & Climate Change',
      desc: isHindi
        ? 'भारतीय जैविक संसाधनों के उपयोग पर बौद्धिक संपदा (फॉर्म 3) और वाणिज्यिक पहुंच (फॉर्म 1) हेतु वैधानिक पोर्टल।'
        : 'Statutory body enforcing the Biological Diversity Act, 2002. Form 3 mandatory prior approval for patent applications in India and overseas.',
      link: 'http://nbaindia.org',
      tag: 'ABS Form 1 / 3'
    },
    {
      title: isHindi ? 'पेटेंट, डिजाइन और व्यापार चिह्न महानियंत्रक (CGPDTM)' : 'Controller General of Patents, Designs and Trade Marks (CGPDTM)',
      org: 'DPIIT, Ministry of Commerce and Industry',
      desc: isHindi
        ? 'भारतीय पेटेंट कार्यालय के पारंपरिक ज्ञान व औषधीय आविष्कारों की जांच हेतु आधिकारिक दिशानिर्देश।'
        : 'Official guidelines for examination of patent applications relating to Traditional Knowledge and Biological Material under Section 3(p).',
      link: 'https://ipindia.gov.in',
      tag: 'Patent Guidelines'
    },
    {
      title: isHindi ? 'आयुष मंत्रालय (Ministry of AYUSH)' : 'Ministry of AYUSH Portal',
      org: 'Government of India',
      desc: isHindi
        ? 'आयुष औषधियों, गुड मैन्युफैक्चरिंग प्रैक्टिसेज (GMP) और अनुसूची T हेतु नियामक नीतियां।'
        : 'Apex central ministry governing Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Sowa-Rigpa regulatory compliance and AYUSH startup grants.',
      link: 'https://ayush.gov.in',
      tag: 'AYUSH Policies'
    },
    {
      title: isHindi ? 'भौगोलिक उपदर्शन रजिस्ट्री (GI Registry)' : 'Geographical Indications (GI) Registry',
      org: 'Intellectual Property India',
      desc: isHindi
        ? 'क्षेत्रीय आयुर्वेदिक फसलों (जैसे कश्मीरी केसर, नवारा चावल) के कृषक समूहों के लिए GI सुरक्षा।'
        : 'Registration and legal protection of Geographical Indications relating to unique medicinal cultivars, agricultural produce, and natural heritage.',
      link: 'https://ipindia.gov.in/gi.htm',
      tag: 'GI Protection'
    },
    {
      title: isHindi ? 'एफएसएसएआई - आयुर्वेद आहार विनियम 2022' : 'FSSAI - Ayurveda Aahara Regulations 2022',
      org: 'Food Safety and Standards Authority of India',
      desc: isHindi
        ? 'आयुर्वेदिक खाद्य पूरक और न्यूट्रास्युटिकल उत्पादों के विपणन व लेबलिंग के विशेष नियम।'
        : 'Comprehensive regulatory standards for foods prepared in accordance with the recipes in authoritative books of Ayurveda under FSSAI.',
      link: 'https://fssai.gov.in',
      tag: 'Nutraceuticals'
    }
  ];

  return (
    <div 
      id="resources-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="resources-modal-content"
        className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#042423] border border-slate-200 dark:border-[#134e4a] p-5 sm:p-6 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#134e4a]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#042f2e] text-[#5eead4] shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                {isHindi ? 'आयुष बौद्धिक संपदा आधिकारिक संसाधन' : 'Official AYUSH IP & Regulatory Resources'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHindi ? 'सत्यापित सरकारी पोर्टल एवं वैधानिक दिशानिर्देश' : 'Verified government portals, statutory acts, and compliance filings'}
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

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {resources.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a] hover:bg-white dark:hover:bg-[#032e2a] hover:border-teal-500/40 transition-all group flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0d9488] dark:text-teal-300 bg-teal-50 dark:bg-[#042f2e] px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                    {item.tag}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0d9488] transition-colors" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-[#0d9488] mt-1">
                  {item.title}
                </h4>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  {item.org}
                </span>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">
                  {item.desc}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Advisory Box */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <Leaf className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {isHindi
              ? 'अनुस्मारक: भारतीय पेटेंट कार्यालय के दिशानिर्देशों के अनुसार, चरक व सुश्रुत संहिता में वर्णित किसी भी शास्त्रीय योग को सीधे पेटेंट नहीं किया जा सकता। नवीन निष्कर्षण प्रक्रियाओं या सिद्ध सिनर्जिस्टिक फॉर्मूलेशन पर ही ध्यान केंद्रित करें।'
              : 'Guidance Reminder: Section 3(p) prohibits patenting of traditional herbal knowledge. To secure strong IP, draft claims focused on novel extraction parameters, validated synergistic combinations (Sec 3(e)), or nanotechnology carrier systems.'}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#042f2e] hover:bg-[#134e4a] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            {isHindi ? 'बंद करें' : 'Close Vault'}
          </button>
        </div>
      </div>
    </div>
  );
};

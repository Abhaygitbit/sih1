import React from 'react';
import { 
  Package, 
  Scale, 
  Bot, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Flame,
  FileText
} from 'lucide-react';
import { AyurvedicHeroSlider } from './AyurvedicHeroSlider';
import { Language } from '../types';

interface AyurvedicHomeViewProps {
  onOpenChat: (initialQuery?: string) => void;
  onNavigateTab: (tab: 'products' | 'laws' | 'chat') => void;
  language?: Language;
}

export const AyurvedicHomeView: React.FC<AyurvedicHomeViewProps> = ({
  onOpenChat,
  onNavigateTab,
  language = 'en'
}) => {
  const isHindi = language === 'hi';

  const quickPillars = [
    {
      id: 'pillar-products',
      titleEn: 'Approved Formulations Showcase',
      titleHi: 'स्वीकृत फॉर्मूलेशन शोकेस (6 मानक)',
      descEn: 'Explore 6 legally validated Ayurvedic products compliant with Schedule T GMP, Section 3(p), and Rule 158B clinical safety.',
      descHi: 'शेड्यूल टी जीएमपी, धारा 3(p), और नियम 158B सुरक्षा साक्ष्य के पूर्ण अनुपालन वाले 6 प्रमाणित उत्पाद देखें।',
      icon: <Package className="w-6 h-6 text-[#2E7D32] dark:text-[#4CAF50]" />,
      actionTextEn: 'Explore 6 Products',
      actionTextHi: '6 उत्पाद देखें',
      badgeEn: 'Rule 158B & Schedule T',
      badgeHi: 'नियम 158B व जीएमपी',
      target: 'products' as const
    },
    {
      id: 'pillar-laws',
      titleEn: 'Direct Laws Statutory Repository',
      titleHi: 'प्रत्यक्ष कानून एवं नियमावली पोर्टल',
      descEn: 'Direct access to Drugs & Cosmetics Act, Rule 158B, Patents Act Section 3(p), NBA Form 3, and FSSAI Ayush Aahar regulations.',
      descHi: 'ड्रग्स एंड कॉस्मेटिक्स एक्ट, नियम 158B, पेटेंट धारा 3(p), एनबीए फॉर्म 3, और आयुष आहार नियमों का सीधा अध्ययन।',
      icon: <Scale className="w-6 h-6 text-[#1B5E20] dark:text-[#81C784]" />,
      actionTextEn: 'Access Direct Laws',
      actionTextHi: 'कानून पोर्टल खोलें',
      badgeEn: 'Indian Statutory Codes',
      badgeHi: 'भारतीय कानूनी संहिताएं',
      target: 'laws' as const
    },
    {
      id: 'pillar-ai',
      titleEn: 'AI Legal & IP Sahayak',
      titleHi: 'एआई कानूनी एवं बौद्धिक संपदा सहायक',
      descEn: 'Instant query engine providing statutory prior-art defense, Section 3(p) objections analysis, and patient safety checks.',
      descHi: 'धारा 3(p) आपत्तियों, टीकेडीएल पूर्व कला बचाव, और रोगी सुरक्षा नियमों पर तुरंत प्रामाणिक उत्तर देने वाला एआई।',
      icon: <Bot className="w-6 h-6 text-[#2E7D32] dark:text-[#4CAF50]" />,
      actionTextEn: 'Start Consultation',
      actionTextHi: 'परामर्श शुरू करें',
      badgeEn: '24/7 Regulatory Guidance',
      badgeHi: '24/7 विनियामक सहायता',
      target: 'chat' as const
    },
    {
      id: 'pillar-safety',
      titleEn: 'TKDL & Patient Safety Registry',
      titleHi: 'टीकेडीएल एवं रोगी सुरक्षा रजिस्ट्री',
      descEn: 'Over 4.5 lakh classical formulations documented to prevent bio-piracy and ensure zero heavy metal adulteration in medicines.',
      descHi: 'जैव-चोरी रोकने और औषधियों में शून्य भारी धातु व कीटनाशक अवशेष सुनिश्चित करने के लिए 4.5 लाख+ शास्त्रीय योग।',
      icon: <ShieldCheck className="w-6 h-6 text-[#1B5E20] dark:text-[#81C784]" />,
      actionTextEn: 'Verify Compliance',
      actionTextHi: 'अनुपालन जांचें',
      badgeEn: 'CSIR & Ministry of AYUSH',
      badgeHi: 'सीएसआईआर व आयुष मंत्रालय',
      target: 'laws' as const
    }
  ];

  const quickProductHighlights = [
    {
      nameEn: 'Triphala-Daruharidra Netra Bindu',
      nameHi: 'त्रिफला-दारुहरिद्रा नेत्र बिंदु',
      typeEn: 'Sterile Ophthalmic Solution',
      typeHi: 'जीवाणुरहित नेत्र ड्रॉप',
      ruleEn: 'Schedule M / Schedule T GMP & Rule 158B',
      ruleHi: 'शेड्यूल एम / टी जीएमपी एवं नियम 158B',
      statusEn: 'Sterile & Verified',
      statusHi: 'जीवाणुरहित प्रमाणित'
    },
    {
      nameEn: 'Amalaki-Guduchi Rasayana Vati',
      nameHi: 'आमलकी-गुडूची रसायन वटी',
      typeEn: 'Classical Rejuvenator Tablet',
      typeHi: 'शास्त्रीय पुनर्योवन वटी',
      ruleEn: 'Section 3(p) Safe (Open TKDL Prior Art)',
      ruleHi: 'धारा 3(p) सुरक्षित (टीकेडीएल खुला पूर्व ज्ञान)',
      statusEn: 'Classical Heritage',
      statusHi: 'शास्त्रीय विरासत'
    },
    {
      nameEn: 'Cold-Pressed Nimba Taila Capsules',
      nameHi: 'कोल्ड-प्रेस्ड निम्ब तैल कैप्सूल',
      typeEn: 'Proprietary ASU Softgel',
      typeHi: 'स्वामित्व एएसयू सॉफ्टजेल',
      ruleEn: 'NBA Form 3 ABS Approval Required',
      ruleHi: 'एनबीए फॉर्म 3 एबीएस स्वीकृति अनिवार्य',
      statusEn: 'Proprietary Form',
      statusHi: 'स्वामित्व स्वरूप'
    },
    {
      nameEn: 'Standardized Haridra Curcumin Granules',
      nameHi: 'मानकीकृत हरिद्रा करक्यूमिन ग्रैन्यूल्स',
      typeEn: 'Enhanced Bioavailability Extract',
      typeHi: 'संवर्धित जैव-उपलब्धता अर्क',
      ruleEn: 'US Patent 5,401,504 Revocation Defense',
      ruleHi: 'यूएस पेटेंट 5,401,504 निरस्तीकरण बचाव',
      statusEn: 'TKDL Defended',
      statusHi: 'टीकेडीएल रक्षित'
    }
  ];

  return (
    <div id="ayurvedic-home-view" className="w-full space-y-8 pb-16">
      
      {/* Official Government Announcement Ticker Bar (matching e-aushadhi.gov.in marquee) */}
      <div 
        id="official-announcement-ticker"
        className="w-full bg-[#E8F5E9] dark:bg-[#12281E] border border-[#C8E6C9] dark:border-[#1F3F30] rounded-xl px-4 py-2.5 flex items-center gap-3 overflow-hidden shadow-xs text-[12pt] sm:text-[13pt]"
      >
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#2E7D32] text-white font-bold text-[11pt] uppercase shrink-0">
          <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>{isHindi ? 'अधिसूचना' : 'Latest Notice'}</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap w-full">
          <p className="text-[#1B5E20] dark:text-[#E8F5E9] font-semibold truncate">
            {isHindi
              ? '📢 आयुष निर्माताओं से अनुरोध: अपनी सभी औषधियों का शेड्यूल टी जीएमपी, सीएसआईआर-टीकेडीएल 4.5 लाख योगों और नियम 158B के तहत सत्यापन अवश्य करें।'
              : '📢 Notice to AYUSH Stakeholders: All formulations must verify compliance with Schedule T GMP, CSIR-TKDL 4.5 Lakh classical records, and Rule 158B safety proofs.'}
          </p>
        </div>
        <button
          onClick={() => onNavigateTab('laws')}
          className="text-[#2E7D32] dark:text-[#A5D6A7] font-bold hover:underline shrink-0 flex items-center gap-1 text-[11pt] sm:text-[12pt] cursor-pointer"
        >
          <span>{isHindi ? 'विवरण' : 'Details'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Premium Ayurvedic Hero Sliding Carousel (with 3 high-res photographic slides) */}
      <AyurvedicHeroSlider 
        onNavigateTab={onNavigateTab}
        language={language}
      />

      {/* 4 Statutory Metrics Counter Bar */}
      <section 
        id="home-statutory-metrics"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-[13pt]"
      >
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#12281E] border border-[#C8E6C9] dark:border-[#1F3F30] shadow-xs">
          <span className="block text-[20pt] sm:text-[24pt] font-bold text-[#1B5E20] dark:text-white leading-tight">
            {isHindi ? '4.5 लाख+' : '4.5 Lakh+'}
          </span>
          <span className="text-[#2E7D32] dark:text-[#A5D6A7] font-semibold text-[12pt] sm:text-[13pt] block mt-1">
            {isHindi ? 'टीकेडीएल पूर्व ज्ञान योग' : 'TKDL Prior Art Records'}
          </span>
          <span className="text-[10pt] sm:text-[11pt] text-[#4E7D59] dark:text-[#81C784] block mt-0.5">
            {isHindi ? 'बायोपायरेसी से संरक्षित' : 'Protected Against Bio-Piracy'}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#12281E] border border-[#C8E6C9] dark:border-[#1F3F30] shadow-xs">
          <span className="block text-[20pt] sm:text-[24pt] font-bold text-[#1B5E20] dark:text-white leading-tight">
            {isHindi ? 'धारा 3(p)' : 'Section 3(p)'}
          </span>
          <span className="text-[#2E7D32] dark:text-[#A5D6A7] font-semibold text-[12pt] sm:text-[13pt] block mt-1">
            {isHindi ? 'पारंपरिक ज्ञान पेटेंट रोक' : 'Traditional Knowledge Bar'}
          </span>
          <span className="text-[10pt] sm:text-[11pt] text-[#4E7D59] dark:text-[#81C784] block mt-0.5">
            {isHindi ? 'भारतीय पेटेंट अधिनियम' : 'Indian Patents Act 1970'}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#12281E] border border-[#C8E6C9] dark:border-[#1F3F30] shadow-xs">
          <span className="block text-[20pt] sm:text-[24pt] font-bold text-[#1B5E20] dark:text-white leading-tight">
            {isHindi ? 'नियम 158B' : 'Rule 158B'}
          </span>
          <span className="text-[#2E7D32] dark:text-[#A5D6A7] font-semibold text-[12pt] sm:text-[13pt] block mt-1">
            {isHindi ? 'सुरक्षा व प्रभावकारिता साक्ष्य' : 'Proof of Safety & Efficacy'}
          </span>
          <span className="text-[10pt] sm:text-[11pt] text-[#4E7D59] dark:text-[#81C784] block mt-0.5">
            {isHindi ? 'ड्रग्स एंड कॉस्मेटिक्स रूल्स' : 'D&C Rules Mandate'}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#12281E] border border-[#C8E6C9] dark:border-[#1F3F30] shadow-xs">
          <span className="block text-[20pt] sm:text-[24pt] font-bold text-[#1B5E20] dark:text-white leading-tight">
            {isHindi ? 'NBA फॉर्म 3' : 'NBA Form 3'}
          </span>
          <span className="text-[#2E7D32] dark:text-[#A5D6A7] font-semibold text-[12pt] sm:text-[13pt] block mt-1">
            {isHindi ? 'जैव-संसाधन ABS अनुमति' : 'Biological Resource ABS'}
          </span>
          <span className="text-[10pt] sm:text-[11pt] text-[#4E7D59] dark:text-[#81C784] block mt-0.5">
            {isHindi ? 'जैव विविधता अधिनियम 2002' : 'Biodiversity Act Compliance'}
          </span>
        </div>
      </section>

      {/* 4 Core Gateway Pillars (Clean, focused portals rather than overwhelming home with entire law texts) */}
      <section id="home-gateway-pillars" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[12pt] font-bold text-[#2E7D32] dark:text-[#A5D6A7]">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{isHindi ? 'प्रमुख सेवा द्वार' : 'Core Regulatory Gateways'}</span>
            </div>
            <h2 className="text-[20pt] sm:text-[24pt] font-bold text-[#1B5E20] dark:text-white leading-tight">
              {isHindi ? 'आयुर्वेद विनियामक एवं पेटेंट सेवाएं' : 'Ayurveda Regulatory & IP Services'}
            </h2>
          </div>
          <p className="text-[12pt] text-[#2E7D32] dark:text-[#A5D6A7]">
            {isHindi ? 'प्रत्येक खंड के लिए सीधा प्रवेश द्वार' : 'Dedicated access points for each functional domain'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickPillars.map((pillar) => (
            <div
              key={pillar.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#12281E] border border-[#C8E6C9] dark:border-[#1F3F30] hover:border-[#2E7D32] dark:hover:border-[#4CAF50] transition-all shadow-xs flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="p-3 rounded-xl bg-[#E8F5E9] dark:bg-[#1A382B] group-hover:bg-[#C8E6C9] dark:group-hover:bg-[#2E5C46] transition-colors">
                    {pillar.icon}
                  </div>
                  <span className="text-[11pt] font-bold px-2.5 py-1 rounded-full bg-[#E8F5E9] dark:bg-[#1A382B] text-[#2E7D32] dark:text-[#A5D6A7] border border-[#C8E6C9] dark:border-[#2E5C46]">
                    {isHindi ? pillar.badgeHi : pillar.badgeEn}
                  </span>
                </div>

                <h3 className="text-[16pt] font-bold text-[#1B5E20] dark:text-white group-hover:text-[#2E7D32] dark:group-hover:text-[#81C784] transition-colors">
                  {isHindi ? pillar.titleHi : pillar.titleEn}
                </h3>

                <p className="text-[13pt] text-[#2E7D32] dark:text-[#C8E6C9] leading-relaxed">
                  {isHindi ? pillar.descHi : pillar.descEn}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-[#C8E6C9]/60 dark:border-[#1F3F30]">
                <button
                  onClick={() => {
                    if (pillar.target === 'chat') {
                      onOpenChat();
                    } else {
                      onNavigateTab(pillar.target);
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#1F5C3E] dark:hover:bg-[#154a19] text-white font-bold text-[13pt] flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <span>{isHindi ? pillar.actionTextHi : pillar.actionTextEn}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Formulation Highlights (Preview strip with clean direct tab switch) */}
      <section 
        id="home-formulations-preview"
        className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#12281E] border border-[#C8E6C9] dark:border-[#1F3F30] shadow-xs space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[12pt] font-bold text-[#2E7D32] dark:text-[#A5D6A7]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isHindi ? 'मानक आयुर्वेदिक औषधियां' : 'Benchmark Herbal Formulations'}</span>
            </div>
            <h3 className="text-[18pt] sm:text-[20pt] font-bold text-[#1B5E20] dark:text-white leading-tight">
              {isHindi ? 'स्वीकृत उत्पाद त्वरित समीक्षा' : 'Approved Formulations Quick Preview'}
            </h3>
          </div>

          <button
            onClick={() => onNavigateTab('products')}
            className="px-4 py-2 rounded-xl bg-[#E8F5E9] dark:bg-[#1A382B] hover:bg-[#C8E6C9] text-[#1B5E20] dark:text-[#A5D6A7] font-bold text-[12pt] sm:text-[13pt] flex items-center gap-1.5 border border-[#A5D6A7] dark:border-[#2E5C46] transition-all cursor-pointer w-fit"
          >
            <span>{isHindi ? 'सभी 6 उत्पाद देखें' : 'View All 6 Approved Products'}</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Cards Preview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickProductHighlights.map((prod, i) => (
            <div 
              key={i}
              className="p-4 rounded-xl bg-[#F8FAF9] dark:bg-[#0A1A12] border border-[#C8E6C9] dark:border-[#1F3F30] space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="inline-block text-[10pt] font-bold px-2 py-0.5 rounded-md bg-[#E8F5E9] dark:bg-[#1A382B] text-[#2E7D32] dark:text-[#A5D6A7] mb-1.5">
                  {isHindi ? prod.statusHi : prod.statusEn}
                </span>
                <h4 className="text-[13pt] font-bold text-[#1B5E20] dark:text-white leading-snug">
                  {isHindi ? prod.nameHi : prod.nameEn}
                </h4>
                <p className="text-[11pt] text-[#4E7D59] dark:text-[#A5D6A7] mt-0.5">
                  {isHindi ? prod.typeHi : prod.typeEn}
                </p>
              </div>

              <div className="pt-2 border-t border-[#C8E6C9]/40 dark:border-[#1F3F30]">
                <p className="text-[10pt] font-semibold text-[#1B5E20] dark:text-[#C8E6C9]">
                  ⚖️ {isHindi ? prod.ruleHi : prod.ruleEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* User Manual & Help Portal Section (inspired by e-aushadhi.gov.in User Manual) */}
      <section 
        id="home-user-manual-section"
        className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#12281E] border border-[#C8E6C9] dark:border-[#1F3F30] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] dark:bg-[#1A382B] text-[#2E7D32] dark:text-[#A5D6A7] text-[11pt] font-bold">
            <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{isHindi ? 'सहायता एवं उपयोग निर्देशिका' : 'User Manual & Regulatory Assistance'}</span>
          </div>
          <h3 className="text-[18pt] sm:text-[20pt] font-bold text-[#1B5E20] dark:text-white leading-tight">
            {isHindi ? 'क्या आपको पेटेंट खोज या लाइसेंसिंग में सहायता चाहिए?' : 'Need Guidance on Filing, Prior Art, or Licensing?'}
          </h3>
          <p className="text-[13pt] text-[#2E7D32] dark:text-[#C8E6C9] max-w-2xl leading-relaxed">
            {isHindi
              ? 'आईपी-शक्ति सहायक भारतीय आयुष विनियामक प्रणाली, टीकेडीएल वर्गीकरण, और रोगी सुरक्षा नियमों के अनुसार स्वतः मार्गदर्शन प्रदान करता है।'
              : 'IP-SAKTI Sahayak provides automated statutory guidance aligned with Indian AYUSH regulations, TKDL classifications, and Schedule T GMP compliance.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={() => onNavigateTab('laws')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#E8F5E9] dark:bg-[#1A382B] hover:bg-[#C8E6C9] text-[#1B5E20] dark:text-[#A5D6A7] font-bold text-[13pt] flex items-center justify-center gap-2 border border-[#A5D6A7] dark:border-[#2E5C46] transition-all cursor-pointer whitespace-nowrap"
          >
            <FileText className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
            <span>{isHindi ? 'कानूनी नियम पढ़ें' : 'Read Direct Laws'}</span>
          </button>

          <button
            onClick={() => onOpenChat()}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#1F5C3E] text-white font-bold text-[13pt] flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Bot className="w-4 h-4 text-white" />
            <span>{isHindi ? 'एआई सहायक से पूछें' : 'Ask AI Sahayak'}</span>
          </button>
        </div>
      </section>

    </div>
  );
};

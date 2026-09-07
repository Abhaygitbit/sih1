import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Package, 
  Scale, 
  Bot, 
  Sparkles,
  Pause,
  Play
} from 'lucide-react';
import { Language } from '../types';

import slideImg1 from '../assets/images/ayurvedic_products_slider_1788788320940.jpg';
import slideImg2 from '../assets/images/ayush_conference_slider_1788788339821.jpg';
import slideImg3 from '../assets/images/herbal_testing_slider_1788788359815.jpg';

interface AyurvedicHeroSliderProps {
  onNavigateTab: (tab: 'products' | 'laws' | 'chat') => void;
  language?: Language;
}

interface SlideItem {
  id: string;
  image: string;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  badgeEn: string;
  badgeHi: string;
  primaryAction: {
    labelEn: string;
    labelHi: string;
    targetTab: 'products' | 'laws' | 'chat';
    icon: React.ReactNode;
  };
  secondaryAction?: {
    labelEn: string;
    labelHi: string;
    targetTab: 'products' | 'laws' | 'chat';
    icon: React.ReactNode;
  };
}

export const AyurvedicHeroSlider: React.FC<AyurvedicHeroSliderProps> = ({
  onNavigateTab,
  language = 'en'
}) => {
  const isHindi = language === 'hi';

  const slides: SlideItem[] = [
    {
      id: 'slide-products',
      image: slideImg1,
      titleEn: 'Welcome to IP-SAKTI Sahayak',
      titleHi: 'आईपी-शक्ति सहायक में आपका स्वागत है',
      subtitleEn: 'Standardized Ayurvedic Formulations Adhering Strictly to Schedule T GMP, Section 3(p), and Rule 158B Clinical Safety',
      subtitleHi: 'शेड्यूल टी जीएमपी, धारा 3(p) पारंपरिक ज्ञान, और नियम 158B नैदानिक सुरक्षा मानकों के पूर्ण अनुपालन वाले प्रामाणिक आयुर्वेदिक उत्पाद',
      badgeEn: '6 Validated Formulations • Patient Safe',
      badgeHi: '6 प्रमाणित शास्त्रीय एवं स्वामित्व फॉर्मूलेशन • रोगी सुरक्षित',
      primaryAction: {
        labelEn: 'Explore 6 Approved Products',
        labelHi: '6 स्वीकृत उत्पाद देखें',
        targetTab: 'products',
        icon: <Package className="w-5 h-5 shrink-0" />
      },
      secondaryAction: {
        labelEn: 'Consult AI Sahayak',
        labelHi: 'एआई सहायक परामर्श',
        targetTab: 'chat',
        icon: <Bot className="w-5 h-5 shrink-0" />
      }
    },
    {
      id: 'slide-conference',
      image: slideImg2,
      titleEn: 'National AYUSH Regulatory & Patent Framework',
      titleHi: 'राष्ट्रीय आयुष विनियामक एवं पेटेंट संरक्षण ढांचा',
      subtitleEn: 'Empowering Ayurvedic Physicians, Cultivators & Manufacturers with Transparent IP Governance and NBA Form 3 Clearances',
      subtitleHi: 'पारदर्शी बौद्धिक संपदा मार्गदर्शन, टीकेडीएल पूर्व ज्ञान सत्यापन और एनबीए फॉर्म 3 जैव-संसाधन अनुमति',
      badgeEn: 'Ministry of AYUSH • CSIR-TKDL Portal',
      badgeHi: 'आयुष मंत्रालय • सीएसआईआर-टीकेडीएल पोर्टल',
      primaryAction: {
        labelEn: 'View Acts & Rules Repository',
        labelHi: 'कानून एवं नियमावली देखें',
        targetTab: 'laws',
        icon: <Scale className="w-5 h-5 shrink-0" />
      },
      secondaryAction: {
        labelEn: 'Verify Prior Art in AI',
        labelHi: 'एआई में पूर्व कला जांचें',
        targetTab: 'chat',
        icon: <Bot className="w-5 h-5 shrink-0" />
      }
    },
    {
      id: 'slide-lab-testing',
      image: slideImg3,
      titleEn: 'Uncompromising Patient Safety & Quality Testing',
      titleHi: 'समझौता-रहित रोगी सुरक्षा एवं गुणवत्ता मानकीकरण',
      subtitleEn: 'Classical Formulations Tested for Zero Heavy Metals, Pesticide Residues, and Phytochemical Monographs in NABL Laboratories',
      subtitleHi: 'शेड्यूल ई(1) शोधन, शून्य भारी धातुएं और एनएबीएल मान्यता प्राप्त प्रयोगशालाओं द्वारा सत्यापित आयुर्वेदिक औषधियां',
      badgeEn: 'Schedule T GMP • NABL Lab Verified',
      badgeHi: 'शेड्यूल टी जीएमपी • एनएबीएल लैब परीक्षित',
      primaryAction: {
        labelEn: 'Inspect Safety Mandates',
        labelHi: 'सुरक्षा नियम देखें',
        targetTab: 'laws',
        icon: <ShieldCheck className="w-5 h-5 shrink-0" />
      },
      secondaryAction: {
        labelEn: 'Ask AI About Safety',
        labelHi: 'सुरक्षा पर एआई से पूछें',
        targetTab: 'chat',
        icon: <Bot className="w-5 h-5 shrink-0" />
      }
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [isPlaying, nextSlide]);

  const activeSlide = slides[currentIdx];

  return (
    <div 
      id="ayurvedic-hero-carousel"
      className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-xl border border-[#C8E6C9] dark:border-[#1F3F30] bg-[#0A1A12] text-white select-none"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Slide Images & Transitions */}
      <div className="relative w-full h-[380px] sm:h-[440px] md:h-[500px] lg:h-[540px]">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIdx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={isHindi ? slide.titleHi : slide.titleEn}
              className="w-full h-full object-cover object-center"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />

            {/* Gradient Overlays for High Legibility & Government Portal Sophistication */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35" />
            <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/70" />
          </div>
        ))}

        {/* Slide Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-10 md:p-14 max-w-4xl space-y-4">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B5E20]/90 backdrop-blur-md text-white text-[12pt] sm:text-[13pt] font-bold border border-[#A5D6A7]/40 shadow-md w-fit">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{isHindi ? activeSlide.badgeHi : activeSlide.badgeEn}</span>
          </div>

          {/* Title */}
          <h1 className="text-[22pt] sm:text-[28pt] md:text-[36pt] font-bold tracking-tight text-white leading-tight drop-shadow-md">
            {isHindi ? activeSlide.titleHi : activeSlide.titleEn}
          </h1>

          {/* Subtitle */}
          <p className="text-[13pt] sm:text-[15pt] md:text-[16pt] text-[#E8F5E9] leading-relaxed max-w-2xl drop-shadow-sm font-normal">
            {isHindi ? activeSlide.subtitleHi : activeSlide.subtitleEn}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab(activeSlide.primaryAction.targetTab)}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-[13pt] sm:text-[14pt] flex items-center gap-2 shadow-lg transition-all cursor-pointer border border-white/20 whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
            >
              {activeSlide.primaryAction.icon}
              <span>{isHindi ? activeSlide.primaryAction.labelHi : activeSlide.primaryAction.labelEn}</span>
            </button>

            {activeSlide.secondaryAction && (
              <button
                onClick={() => onNavigateTab(activeSlide.secondaryAction!.targetTab)}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-[13pt] sm:text-[14pt] flex items-center gap-2 shadow-md transition-all cursor-pointer border border-white/30 whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
              >
                {activeSlide.secondaryAction.icon}
                <span>{isHindi ? activeSlide.secondaryAction.labelHi : activeSlide.secondaryAction.labelEn}</span>
              </button>
            )}
          </div>
        </div>

        {/* Left Arrow Button */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-all border border-white/20 cursor-pointer shadow-lg hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-all border border-white/20 cursor-pointer shadow-lg hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* Bottom Bar: Indicators & Pause/Play */}
        <div className="absolute bottom-4 right-4 sm:right-8 z-30 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="p-1 text-white/80 hover:text-white cursor-pointer transition-colors"
            title={isPlaying ? 'Pause auto-sliding' : 'Resume auto-sliding'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-1.5 ml-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 transition-all rounded-full cursor-pointer ${
                  idx === currentIdx
                    ? 'w-7 bg-[#4CAF50]'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

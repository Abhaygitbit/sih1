import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, X, MessageSquareText } from 'lucide-react';
import { Language } from '../types';

interface FloatingRobotProps {
  language: Language;
  onOpenChat: (initialPrompt?: string) => void;
}

export const FloatingRobot: React.FC<FloatingRobotProps> = ({ language, onOpenChat }) => {
  const [showBubble, setShowBubble] = useState(true);
  const [promptIdx, setPromptIdx] = useState(0);

  const prompts = [
    { title: 'Need legal help? 🌿', subtitle: 'Ask about Section 3(p), TKDL, or NBA Form 3' },
    { title: 'Ayurveda IP Question? 📜', subtitle: 'Learn how to patent synergistic formulations' },
    { title: 'Ask Sahayak AI 🤖', subtitle: 'Get instant compliance & prior art guidance' }
  ];

  // Trigger speech bubble popup every 10 seconds
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setShowBubble(false);
    }, 5000);

    const interval = setInterval(() => {
      setPromptIdx((prev) => (prev + 1) % prompts.length);
      setShowBubble(true);

      const hideTimer = setTimeout(() => {
        setShowBubble(false);
      }, 5000);

      return () => clearTimeout(hideTimer);
    }, 10000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [prompts.length]);

  const currentPrompt = prompts[promptIdx] || prompts[0];

  return (
    <aside 
      id="floating-robot-container"
      aria-label="Ayurveda AI Assistant"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto"
    >
      {/* Speech Bubble appearing every 10 seconds */}
      {showBubble && (
        <div 
          id="floating-robot-speech-bubble"
          onClick={() => onOpenChat()}
          className="mb-3 w-72 sm:w-80 bg-white text-[#1B5E20] p-4 rounded-2xl shadow-xl border border-[#A5D6A7] cursor-pointer transform transition-all duration-300 hover:scale-105 relative"
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowBubble(false);
            }}
            className="absolute top-2.5 right-2.5 p-1 text-[#2E7D32] hover:text-[#1B5E20] transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0 border border-[#A5D6A7]">
              <Sparkles className="w-5 h-5 text-[#D97706]" />
            </div>
            <div className="pr-4">
              <h4 className="text-[14pt] font-bold text-[#1B5E20] flex items-center gap-1.5 leading-tight">
                <span>{currentPrompt.title}</span>
              </h4>
              <p className="text-[13pt] text-[#2E7D32] leading-snug mt-1">
                {currentPrompt.subtitle}
              </p>
              <span className="inline-flex items-center gap-1.5 text-[12pt] font-bold text-[#2E7D32] mt-2">
                <span>Click to consult</span>
                <MessageSquareText className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Chat bubble tail */}
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-[#A5D6A7] transform rotate-45" />
        </div>
      )}

      {/* Floating Robot Avatar Button */}
      <div className="relative group">
        <button
          id="floating-robot-trigger-btn"
          onClick={() => onOpenChat()}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white p-2.5 shadow-xl flex items-center justify-center border-2 border-white transition-all duration-300 transform group-hover:scale-110 active:scale-95 cursor-pointer"
          title="Chat with IP-SAKTI Sahayak"
        >
          <div className="relative flex flex-col items-center justify-center">
            {/* Antenna beacon */}
            <div className="w-1.5 h-2 bg-amber-300 rounded-full mb-0.5" />
            
            {/* Robot Face */}
            <div className="w-8 h-7 bg-[#1B5E20] rounded-lg border border-[#C8E6C9] flex flex-col items-center justify-center p-1 relative shadow-inner">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
              </div>
              <div className="w-3.5 h-0.5 bg-emerald-200 rounded-full mt-1" />
            </div>

            {/* Botanical badge */}
            <div className="absolute -top-2 -right-1 text-xs">
              🌿
            </div>
          </div>

          {/* Active status indicator dot */}
          <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#81C784] border-2 border-white flex items-center justify-center" />
        </button>
      </div>
    </aside>
  );
};

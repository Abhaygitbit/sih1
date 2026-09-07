import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  ExternalLink,
  Bot,
  CornerDownLeft,
  Loader2,
  FileCheck,
  UserCheck
} from 'lucide-react';
import { ChatMessage, ClassificationState, Jurisdiction, Language, UserProfile } from '../types';
import { SAMPLE_PROMPTS, UI_TRANSLATIONS } from '../data/ayurvedaData';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isStreaming: boolean;
  jurisdiction: Jurisdiction;
  language: Language;
  onClearChat: () => void;
  classificationContext?: ClassificationState;
  user?: UserProfile | null;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  isStreaming,
  jurisdiction,
  language,
  onClearChat,
  classificationContext,
  user
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const isAuthenticated = !!user;
  
  // Scoped scroll container ref - prevents entire outer page from jumping or scrolling upside
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const t = UI_TRANSLATIONS[language];

  // Safely scroll only the chat messages container, NEVER scrolling the outer browser window
  const scrollToBottom = (smooth = true) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [messages, isStreaming]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!inputText.trim() || isStreaming) return;
    const textToSend = inputText.trim();
    setInputText('');
    onSendMessage(textToSend);
  };

  // Prevent outer page jump on Enter press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit();
    }
  };

  const handlePromptClick = (promptText: string) => {
    onSendMessage(promptText);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeech = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`_]/g, ''));
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 1.0;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <main 
      id="main-chat-window-container"
      className="w-full flex flex-col h-[470px] sm:h-[490px] md:h-[500px] rounded-2xl bg-[#f8fafc] dark:bg-[#021a19] border border-slate-200 dark:border-[#134e4a] shadow-xs overflow-hidden relative"
    >
      {/* Simple, Minimal Chat Header without Sign In button */}
      <div className="px-4 py-2 sm:py-2.5 bg-white dark:bg-[#0A1A12] border-b border-slate-200 dark:border-[#2E7D32]/40 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
            IP-SAKTI Sahayak
          </span>
          <span className="text-xs text-slate-400 font-normal hidden sm:inline">
            • AI Assistant
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-[#12281E] border border-emerald-200 dark:border-[#2E7D32]/50 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
              <UserCheck className="w-3.5 h-3.5 text-[#1B5E20] dark:text-[#81C784]" />
              <span className="truncate max-w-[120px] sm:max-w-[180px] font-semibold">{user.name}</span>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'hi' ? 'खुला परामर्श' : 'Open Access'}</span>
            </span>
          )}

          {messages.length > 0 && (
            <button
              id="clear-chat-history-btn"
              onClick={onClearChat}
              title={t.clearChat}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-xs flex items-center gap-1 cursor-pointer ml-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">{t.clearChat}</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div 
        id="chat-messages-scroll-area"
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 overscroll-contain"
      >
        {/* Simple Warm Greeting (exact required greeting text) */}
        {messages.length === 0 && (
          <section 
            id="welcome-greeting-banner"
            aria-label="Welcome greeting"
            className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0D2218] border border-slate-200 dark:border-[#2E7D32]/40 text-left relative overflow-hidden shadow-xs space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-[#12281E] text-[#1B5E20] dark:text-[#81C784] text-xs font-semibold border border-emerald-200/70 dark:border-[#2E7D32]/50">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'en' ? 'Ayurveda Intellectual Property AI' : 'आयुर्वेद बौद्धिक संपदा एआई'}</span>
            </div>

            {/* Exact required greeting text */}
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
              {language === 'en' ? (
                <>
                  Welcome to <strong className="text-[#1B5E20] dark:text-[#81C784]">IP-SAKTI Sahayak!</strong> I am your AI assistant for Ayurveda Intellectual Property guidance. Ask me anything about <span className="bg-emerald-50 dark:bg-[#12281E] text-[#1B5E20] dark:text-[#81C784] px-1 py-0.5 rounded font-medium border border-emerald-200/50 dark:border-[#2E7D32]/50">patents</span>, <span className="bg-emerald-50 dark:bg-[#12281E] text-[#1B5E20] dark:text-[#81C784] px-1 py-0.5 rounded font-medium border border-emerald-200/50 dark:border-[#2E7D32]/50">GI</span>, <span className="bg-emerald-50 dark:bg-[#12281E] text-[#1B5E20] dark:text-[#81C784] px-1 py-0.5 rounded font-medium border border-emerald-200/50 dark:border-[#2E7D32]/50">ABS</span>, <span className="bg-emerald-50 dark:bg-[#12281E] text-[#1B5E20] dark:text-[#81C784] px-1 py-0.5 rounded font-medium border border-emerald-200/50 dark:border-[#2E7D32]/50">TKDL</span>, <span className="bg-emerald-50 dark:bg-[#12281E] text-[#1B5E20] dark:text-[#81C784] px-1 py-0.5 rounded font-medium border border-emerald-200/50 dark:border-[#2E7D32]/50">Drugs &amp; Cosmetics Act</span>, etc.
                </>
              ) : (
                'आईपी-शक्ति सहायक में आपका स्वागत है! मैं आयुर्वेद बौद्धिक संपदा मार्गदर्शन के लिए आपका एआई सहायक हूँ। मुझसे पेटेंट, जीआई, एबीएस, टीकेडीएल, ड्रग्स एंड कॉस्मेटिक्स एक्ट आदि के बारे में कुछ भी पूछें।'
              )}
            </p>

            {/* Quick Prompts */}
            <div className="pt-1 space-y-2">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t.quickQuestions}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SAMPLE_PROMPTS.slice(0, 4).map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handlePromptClick(language === 'hi' ? prompt.hi : prompt.en)}
                    className="p-2.5 text-left rounded-xl bg-slate-50 dark:bg-[#0A1A12] border border-slate-200 dark:border-[#2E7D32]/30 hover:border-[#1B5E20] dark:hover:border-emerald-500/60 hover:shadow-xs transition-all group flex items-start justify-between gap-2 cursor-pointer"
                  >
                    <div>
                      <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-[#1B5E20] dark:text-[#81C784] mb-0.5">
                        {prompt.topic}
                      </span>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#1B5E20] dark:group-hover:text-[#81C784] transition-colors leading-snug">
                        {language === 'hi' ? prompt.hi : prompt.en}
                      </p>
                    </div>
                    <CornerDownLeft className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-[#1B5E20] dark:group-hover:text-[#81C784] shrink-0 mt-1 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Render Chat Messages (Bubbles) */}
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          const isLastAssistantMessage = !isUser && index === messages.length - 1 && isStreaming;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5 animate-fade-in`}
            >
              <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {isUser ? 'You' : 'IP-SAKTI Sahayak'}
                </span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Bubble: USER IS NOW PROFESSIONAL WHITE BG (CHANGED FROM GREEN PER USER PROMPT) */}
              <div
                className={`max-w-[90%] sm:max-w-[82%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-white dark:bg-[#093533] text-slate-900 dark:text-slate-100 rounded-tr-xs border border-slate-200 dark:border-teal-800 font-normal'
                    : 'bg-white dark:bg-[#042f2e] text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200 dark:border-[#134e4a]'
                }`}
              >
                {/* Content formatting */}
                <div className="space-y-2 leading-relaxed">
                  {isUser ? (
                    <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                  ) : (
                    <div className="markdown-body max-w-none text-xs sm:text-sm">
                      <Markdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ children }) => (
                            <h2 className="text-sm sm:text-base font-bold text-teal-800 dark:text-teal-300 mt-3 mb-2 flex items-center gap-1.5 border-b border-teal-100 dark:border-[#134e4a] pb-1">
                              {children}
                            </h2>
                          ),
                          h2: ({ children }) => (
                            <h3 className="text-xs sm:text-sm font-bold text-[#0d9488] dark:text-[#14b8a6] mt-3 mb-1.5 flex items-center gap-1.5">
                              {children}
                            </h3>
                          ),
                          h3: ({ children }) => (
                            <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 mt-2 mb-1">
                              {children}
                            </h4>
                          ),
                          p: ({ children }) => (
                            <p className="my-1.5 text-slate-700 dark:text-slate-200 leading-relaxed">{children}</p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-5 my-1.5 space-y-1 text-slate-700 dark:text-slate-200">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-5 my-1.5 space-y-1 text-slate-700 dark:text-slate-200">{children}</ol>
                          ),
                          li: ({ children }) => (
                            <li className="leading-relaxed">{children}</li>
                          ),
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-3 rounded-xl border border-slate-200 dark:border-[#134e4a] shadow-xs">
                              <table className="w-full text-left text-xs border-collapse bg-white dark:bg-[#021f1e]">
                                {children}
                              </table>
                            </div>
                          ),
                          thead: ({ children }) => (
                            <thead className="bg-teal-50 dark:bg-[#0a3b37] border-b border-slate-200 dark:border-[#134e4a] text-teal-950 dark:text-teal-200 font-bold">
                              {children}
                            </thead>
                          ),
                          tbody: ({ children }) => (
                            <tbody className="divide-y divide-slate-100 dark:divide-[#0f3d3a]">{children}</tbody>
                          ),
                          tr: ({ children }) => (
                            <tr className="hover:bg-slate-50/80 dark:hover:bg-[#062c29]/60 transition-colors">{children}</tr>
                          ),
                          th: ({ children }) => (
                            <th className="px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{children}</th>
                          ),
                          td: ({ children }) => (
                            <td className="px-3 py-2 text-xs text-slate-700 dark:text-slate-300 align-top">{children}</td>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-bold text-slate-900 dark:text-white">{children}</strong>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-teal-500 pl-3 my-2 italic text-slate-600 dark:text-slate-300 bg-teal-50/40 dark:bg-[#021f1e] py-1 rounded-r-lg">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {msg.content}
                      </Markdown>
                    </div>
                  )}
                  {/* Blinking streaming cursor */}
                  {isLastAssistantMessage && (
                    <span className="inline-block w-2 h-4 bg-[#0d9488] dark:bg-[#14b8a6] animate-pulse ml-1 align-middle" />
                  )}
                </div>

                {/* Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#134e4a] space-y-1.5">
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0d9488]" />
                      <span>{t.statutoryReferences}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((cite, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-[#021f1e] text-teal-900 dark:text-teal-200 text-[10px] font-semibold border border-teal-200 dark:border-[#134e4a] flex items-center gap-1"
                        >
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          {cite}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assistant message action buttons */}
                {!isUser && msg.content && (
                  <div className="mt-3 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-[#134e4a] text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-[10px]">
                      <ShieldCheck className="w-3 h-3 text-[#0d9488]" />
                      Verified Statutory Corpus
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeech(msg.id, msg.content)}
                        className="p-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                        title={speakingId === msg.id ? 'Stop reading' : 'Read aloud'}
                      >
                        {speakingId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[10px] text-emerald-600 font-semibold">Copied</span>
                          </>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading spinner */}
        {isStreaming && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
          <div className="flex items-start gap-2.5 text-left animate-pulse">
            <div className="w-7 h-7 rounded-full bg-[#042f2e] dark:bg-[#0d9488] text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-[#042f2e] border border-slate-200 dark:border-[#134e4a] rounded-2xl rounded-tl-xs px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#0d9488]" />
              <span className="text-xs text-slate-500 dark:text-slate-300 font-medium">
                {language === 'en' ? 'Analyzing statutory provisions...' : 'विश्लेषण प्रगति पर है...'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form Bar */}
      <div className="p-2.5 sm:p-3 bg-white dark:bg-[#042f2e] border-t border-slate-200 dark:border-[#134e4a] shrink-0">
        <form onSubmit={handleSubmit} className="space-y-1.5">
          <div className="relative">
            <textarea
              ref={inputRef}
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === 'en' ? 'Ask about Section 3(p) patentability, TKDL prior art, or NBA Form 3...' : t.chatPlaceholder}
              disabled={isStreaming}
              className="w-full pl-3.5 pr-11 py-2.5 bg-slate-50 dark:bg-[#021a19] border border-slate-200 dark:border-[#134e4a] rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] resize-none min-h-[44px] max-h-24 transition-all"
            />

            <button
              id="send-message-button"
              type="submit"
              disabled={!inputText.trim() || isStreaming}
              className="absolute right-2 top-2 p-2 bg-[#042f2e] dark:bg-[#0d9488] text-white rounded-lg hover:bg-[#134e4a] dark:hover:bg-[#0f766e] transition-colors disabled:opacity-40 flex items-center justify-center cursor-pointer shadow-xs"
              title="Send message (Enter)"
            >
              {isStreaming ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Send className="w-3.5 h-3.5 text-white" />
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap gap-2.5">
              <button 
                type="button" 
                onClick={() => onSendMessage('Explain Section 3(p) of Indian Patents Act for Ayurvedic formulations.')}
                className="text-[10px] text-slate-400 hover:text-[#0d9488] font-medium transition-colors cursor-pointer"
              >
                # Sec 3(p) Patent Bar
              </button>
              <button 
                type="button" 
                onClick={() => onSendMessage('How does TKDL prior art prevent grant of foreign patent claims on Indian herbs?')}
                className="text-[10px] text-slate-400 hover:text-[#0d9488] font-medium transition-colors cursor-pointer"
              >
                # TKDL Defense
              </button>
              <button 
                type="button" 
                onClick={() => onSendMessage('When is NBA Form 3 mandatory for Ayurvedic patent applicants?')}
                className="text-[10px] text-slate-400 hover:text-[#0d9488] font-medium transition-colors cursor-pointer"
              >
                # NBA Form 3 Clearance
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

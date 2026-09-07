import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ChatWindow } from './components/ChatWindow';
import { AyurvedicHomeView } from './components/AyurvedicHomeView';
import { AyurvedicProductsSection } from './components/AyurvedicProductsSection';
import { DirectLawsDashboard } from './components/DirectLawsDashboard';
import { FloatingRobot } from './components/FloatingRobot';
import { Footer } from './components/Footer';
import { ResourcesModal } from './components/ResourcesModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { HistoryModal } from './components/HistoryModal';
import { AyurvedaBackground } from './components/AyurvedaBackground';
import { 
  ActiveTab, 
  ChatMessage, 
  ClassificationState, 
  Jurisdiction, 
  Language, 
  UserProfile, 
  ChatSession 
} from './types';

// Default guest user profile template
const DEFAULT_USER: UserProfile = {
  id: 'user-guest-01',
  name: 'Vaidya Ananya',
  email: 'ananya@ayushinnovations.in',
  role: 'Ayurvedic Formulator & Founder',
  organization: 'AyurSakti Naturals Pvt Ltd',
  joinedDate: 'Jan 2024',
  savedConsultationsCount: 3,
  preferences: {
    defaultJurisdiction: 'india',
    preferredLanguage: 'en',
    autoCitations: true,
    tkdlAlerts: true
  }
};

export default function App() {
  // Theme & Language State - Light / Dark Theme toggle with persistent storage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ipsakti_theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    try {
      localStorage.setItem('ipsakti_theme', isDarkMode ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [isDarkMode]);

  const [language, setLanguage] = useState<Language>('en');
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('india');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Modals state
  const [isResourcesOpen, setIsResourcesOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  const handleOpenLogin = () => {
    setAuthInitialMode('signin');
    setIsAuthOpen(true);
  };

  const handleOpenSignUp = () => {
    setAuthInitialMode('signup');
    setIsAuthOpen(true);
  };

  // User Profile & Authentication state
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('ipsakti_auth_user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch {
          return null;
        }
      }
      return null;
    }
    return null;
  });

  // Product Classification Matrix State
  const [classification, setClassification] = useState<ClassificationState>({
    category: 'proprietary',
    ingredientSource: 'cultivated_indian',
    noveltyClaim: 'novel_ratio_synergy',
    commercialTarget: 'domestic_asu'
  });

  // Chat Sessions & History State
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ipsakti_saved_sessions');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    return `session-${Date.now()}`;
  });

  // Current active conversation messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  // Sync dark mode class on HTML root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ipsakti_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ipsakti_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist sessions to localStorage reliably
  useEffect(() => {
    try {
      if (sessions.length > 0) {
        localStorage.setItem('ipsakti_saved_sessions', JSON.stringify(sessions));
      } else {
        localStorage.removeItem('ipsakti_saved_sessions');
      }
    } catch (e) {
      console.error('Failed to sync sessions to localStorage:', e);
    }
  }, [sessions]);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('ipsakti_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ipsakti_auth_user');
    }
  }, [user]);

  // Save/Update current session when messages change
  useEffect(() => {
    if (messages.length === 0) return;

    setSessions(prevSessions => {
      const existingIdx = prevSessions.findIndex(s => s.id === currentSessionId);
      const firstUserMsg = messages.find(m => m.role === 'user');
      const title = firstUserMsg 
        ? firstUserMsg.content.slice(0, 42) + (firstUserMsg.content.length > 42 ? '...' : '')
        : 'Ayurveda IP Consultation';

      const updatedSession: ChatSession = {
        id: currentSessionId,
        title,
        createdAt: existingIdx >= 0 ? prevSessions[existingIdx].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages,
        jurisdiction
      };

      if (existingIdx >= 0) {
        const copy = [...prevSessions];
        copy[existingIdx] = updatedSession;
        return copy;
      } else {
        return [updatedSession, ...prevSessions];
      }
    });
  }, [messages, currentSessionId, jurisdiction]);

  const handleUpdateUser = (updated: UserProfile) => {
    setUser(updated);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ipsakti_auth_user');
  };

  // Session switching & history management
  const handleSelectSession = (sessionId: string) => {
    const found = sessions.find(s => s.id === sessionId);
    if (found) {
      setCurrentSessionId(found.id);
      setMessages(found.messages);
      setJurisdiction(found.jurisdiction);
      setActiveTab('chat');
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    const updated = sessions.filter(s => s.id !== sessionId);
    setSessions(updated);
    try {
      if (updated.length > 0) {
        localStorage.setItem('ipsakti_saved_sessions', JSON.stringify(updated));
      } else {
        localStorage.removeItem('ipsakti_saved_sessions');
      }
    } catch {
      // ignore
    }

    // If the active session is deleted, switch to the next available session or create a clean slate
    if (currentSessionId === sessionId) {
      if (updated.length > 0) {
        const next = updated[0];
        setCurrentSessionId(next.id);
        setMessages(next.messages);
        setJurisdiction(next.jurisdiction);
      } else {
        handleNewSession();
      }
    }
  };

  const handleNewSession = () => {
    const newId = `session-${Date.now()}`;
    setCurrentSessionId(newId);
    setMessages([]);
  };

  const handleClearAllHistory = () => {
    setSessions([]);
    try {
      localStorage.removeItem('ipsakti_saved_sessions');
    } catch {
      // ignore
    }
    handleNewSession();
  };

  // Navigate to chat and optionally ask an initial prompt
  const handleOpenChatWithPrompt = (initialPrompt?: string) => {
    setActiveTab('chat');
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  };

  // Main chat streaming handler
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isStreaming) return;

    // Ensure we are in chat view
    if (activeTab !== 'chat') {
      setActiveTab('chat');
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp,
      jurisdiction
    };

    const newAssistantId = `assistant-${Date.now()}`;
    const initialAssistantMessage: ChatMessage = {
      id: newAssistantId,
      role: 'assistant',
      content: '',
      timestamp,
      jurisdiction,
      source: 'groq'
    };

    setMessages(prev => [...prev, newUserMessage, initialAssistantMessage]);
    setIsStreaming(true);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          jurisdiction,
          language,
          context: classification
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
      let detectedSource: 'groq' | 'gemini' | 'knowledge-engine' = 'groq';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.source) {
                if (data.source.includes('gemini')) detectedSource = 'gemini';
                else if (data.source.includes('groq')) detectedSource = 'groq';
                else detectedSource = 'knowledge-engine';
              }
              if (data.chunk) {
                // Ensure chunk is a string
                const chunkStr = typeof data.chunk === 'string' ? data.chunk : String(data.chunk);
                accumulatedText += chunkStr;
                setMessages(prev =>
                  prev.map(m =>
                    m.id === newAssistantId
                      ? { ...m, content: accumulatedText, source: detectedSource }
                      : m
                  )
                );
              }
              if (data.done) {
                break;
              }
            } catch {
              // Ignore malformed partial chunks in event stream
            }
          }
        }
      }

      if (!accumulatedText.trim()) {
        throw new Error("Empty streaming response");
      }
    } catch (streamError) {
      console.warn("Streaming connection failed, running client statutory fallback:", streamError);
      
      const fallbackText = generateClientFallback(userText, jurisdiction, language, classification);
      const words = fallbackText.split(/(\s+)/);
      let animatedText = '';

      for (const word of words) {
        animatedText += word;
        setMessages(prev =>
          prev.map(m =>
            m.id === newAssistantId
              ? { 
                  ...m, 
                  content: animatedText,
                  source: 'knowledge-engine'
                }
              : m
          )
        );
        await new Promise(res => setTimeout(res, 12));
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== currentSessionId);
      try {
        if (updated.length > 0) {
          localStorage.setItem('ipsakti_saved_sessions', JSON.stringify(updated));
        } else {
          localStorage.removeItem('ipsakti_saved_sessions');
        }
      } catch {
        // ignore
      }
      return updated;
    });
    setCurrentSessionId(`session-${Date.now()}`);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-[#0A1A12] text-[#E8F5E9]' : 'bg-[#E8F5E9] text-[#1B5E20]'} font-calibri transition-colors duration-200 selection:bg-[#2E7D32] selection:text-white relative`}>
      {/* Background leaf pattern */}
      <AyurvedaBackground />

      {/* Top Navbar with Warning Banner, Logo, Navigation Tabs, Language & Real Light/Dark Theme Converter, Login & Sign Up */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        onToggleLanguage={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(prev => !prev)}
        user={user}
        onOpenLogin={handleOpenLogin}
        onOpenSignUp={handleOpenSignUp}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onLogout={handleLogout}
        savedSessionsCount={sessions.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 relative z-10">
        
        {/* 1. HOME VIEW: Dedicated Ayurvedic Dashboard */}
        {activeTab === 'home' && (
          <AyurvedicHomeView
            onOpenChat={handleOpenChatWithPrompt}
            onNavigateTab={(tab) => setActiveTab(tab)}
            language={language}
          />
        )}

        {/* 2. APPROVED PRODUCTS VIEW: 6 Validated Safe Products */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <AyurvedicProductsSection 
              onAskAI={handleOpenChatWithPrompt} 
              language={language}
            />
          </div>
        )}

        {/* 3. DIRECT LAWS DASHBOARD */}
        {activeTab === 'laws' && (
          <div className="space-y-6">
            <DirectLawsDashboard 
              onAskAI={handleOpenChatWithPrompt} 
              language={language}
            />
          </div>
        )}

        {/* 4. AI CHAT WORKSPACE (Clean, centered, reduced dimensions) */}
        {activeTab === 'chat' && (
          <div className="max-w-[660px] mx-auto w-full px-2 sm:px-0">
            <ChatWindow
              messages={messages}
              onSendMessage={handleSendMessage}
              isStreaming={isStreaming}
              jurisdiction={jurisdiction}
              language={language}
              onClearChat={handleClearChat}
              classificationContext={classification}
              user={user}
            />
          </div>
        )}

      </main>

      {/* Floating Robot with prompts */}
      <FloatingRobot 
        language={language} 
        onOpenChat={handleOpenChatWithPrompt} 
      />

      {/* Resources & Portals Modal */}
      <ResourcesModal
        isOpen={isResourcesOpen}
        onClose={() => setIsResourcesOpen(false)}
        language={language}
      />

      {/* Authentication Modal with Login / Sign Up initial mode */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleUpdateUser}
        language={language}
        initialMode={authInitialMode}
      />

      {/* My Profile Modal */}
      {user && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={user}
          onUpdateUser={handleUpdateUser}
          onSwitchAccount={() => {
            setIsProfileOpen(false);
            setIsAuthOpen(true);
          }}
          language={language}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
        language={language}
        setLanguage={setLanguage}
        jurisdiction={jurisdiction}
        setJurisdiction={setJurisdiction}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onClearAllHistory={handleClearAllHistory}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onNewSession={handleNewSession}
        onClearAllHistory={handleClearAllHistory}
        language={language}
      />

      {/* Footer with statutory notice */}
      <Footer 
        language={language} 
        onOpenResources={() => setIsResourcesOpen(true)} 
      />
    </div>
  );
}

// Client fallback expert generator for immediate resilience
function generateClientFallback(
  query: string, 
  jurisdiction: Jurisdiction, 
  language: Language,
  classification: ClassificationState
): string {
  const isHindi = language === 'hi';
  const q = query.toLowerCase();

  // BOTANICAL & DIETARY QUERIES (e.g. Neem, Ashwagandha, Tulsi, herbs)
  if (q.includes('neem')) {
    const isEatingSpecific = q.includes('eat') || q.includes('consum') || q.includes('chew') || q.includes('drink') || q.includes('food');
    if (isHindi) {
      if (isEatingSpecific) {
        return `### क्या नीम खाना स्वास्थ्य के लिए लाभकारी है? (आयुर्वेदिक दृष्टिकोण):

1. **आयुर्वेदिक गुणधर्म**:
   - **रस (Taste)**: तिक्त (कड़वा) और कषाय (कसैला)।
   - **वीर्य (Potency)**: **शीत (ठंडा)** – *नीम की तासीर शीतल होती है*।
   - **दोष प्रभाव**: पित्त और कफ दोष को शांत करता है; अत्यधिक सेवन से वात बढ़ता है।

2. **प्रमुख स्वास्थ्य लाभ**:
   - **रक्तशोधक**: रक्त को शुद्ध कर त्वचा विकारों (मुंहासे, दाद, एक्जिमा) को ठीक करता है।
   - **कृमिघ्न**: आंतों के हानिकारक कीड़ों और संक्रमणों को समाप्त करता है।
   - **यकृत एवं मधुमेह सहयोग**: लिवर डिटॉक्स में मदद करता है तथा रक्त शर्करा को नियंत्रित रखता है।

3. **सेवन विधि एवं मात्रा**:
   - सुबह खाली पेट 2-4 कोमल (ताजी) पत्तियां गुनगुने पानी के साथ चबाएं।
   - वसंत ऋतु (चैत्र मास) में 15–21 दिन का सेवन साल भर संक्रमण से सुरक्षा देता है।

4. **सावधानियां**:
   - गर्भवती महिलाओं या गर्भधारण की योजना बना रहे लोगों को इसका सेवन नहीं करना चाहिए।
   - लंबे समय तक अत्यधिक मात्रा में न लें।

5. **बौद्धिक संपदा (IP) संदर्भ**:
   - यह ज्ञान चरक संहिता में दर्ज सार्वजनिक पारंपरिक ज्ञान (TKDL) है, इसलिए नीम के प्राकृतिक गुणों को धारा 3(p) के तहत पेटेंट नहीं कराया जा सकता।

⚠️ *Disclaimer: This is information only. Not medical advice. Consult an Ayurvedic doctor.*`;
      }

      return `## 🌿 नीम (*Azadirachta indica*) – शास्त्रीय आयुर्वेदिक एवं वानस्पतिक विश्लेषण

### 1. वानस्पतिक पहचान
- **वानस्पतिक नाम**: *Azadirachta indica* (मेलीएसी कुल)
- **शास्त्रीय संस्कृत नाम**: **निम्ब** (आरोग्य प्रदाता), **अरिष्ट** (अविनाशी/रोगहर्ता), **पिचुमर्द** (कुष्ठनाशक)
- **सामान्य नाम**: नीम, कड़वा नीम, इंडियन लायलेक

---

### 2. शास्त्रीय द्रव्यगुण सिद्धांत (चरक एवं सुश्रुत संहिता)
| गुणधर्म | शास्त्रीय विवरण |
| :--- | :--- |
| **रस (Taste)** | **तिक्त** (कड़वा) एवं **कषाय** (कसैला) |
| **गुण (Qualities)** | **लघु** (पचाने में हल्का) एवं **रूक्ष** (शुष्क) |
| **वीर्य (Potency)** | **शीत (ठंडा)** *(नीम की तासीर शीतल होती है)* |
| **विपाक (Post-Digestive)** | **कटु** (तीखा) |
| **दोष प्रभाव** | **पित्त और कफ शामक**; अत्यधिक सेवन से वातवर्धक |
| **प्रभाव** | **कृमिघ्न** (कीटाणुनाशक) एवं **विषघ्न** (डिटॉक्सिफाइंग) |

---

### 3. प्रमुख औषधीय लाभ
- **रक्तशोधक**: रक्त की अशुद्धियों को दूर कर त्वचा विकारों (मुंहासे, सोरायसिस, एक्जिमा) में सर्वोत्तम।
- **कृमिघ्न एवं व्रणरोपण**: आंतों के हानिकारक परजीवियों को नष्ट करता है तथा घावों को शीघ्र भरता है।
- **प्रमेहहर**: इंसुलिन संवेदनशीलता में सुधार कर रक्त शर्करा को संतुलित करता है।

---

### 4. बौद्धिक संपदा (IPR) एवं टीकेडीएल (TKDL)
- **धारा 3(p)**: नीम के गुण सदियों से *चरक संहिता* में दर्ज हैं और टीकेडीएल में संरक्षित हैं, अतः पारंपरिक उपयोगों पर कोई एकाधिकार नहीं मिल सकता।
- **ऐतिहासिक ईपीओ मामला**: सीएसआईआर ने प्राचीन संस्कृत प्रमाणों के आधार पर यूरोपीय पेटेंट कार्यालय में डब्ल्यू.आर. ग्रेस के नीम पेटेंट को रद्द कराया था।

⚠️ *Disclaimer: यह केवल सूचनात्मक सामग्री है। चिकित्सीय सलाह हेतु आयुर्वेदाचार्य से संपर्क करें।*`;
    }

    if (isEatingSpecific) {
      return `### Is Neem Healthy to Eat? (Classical Ayurvedic & Pharmacological Guidance):

Yes, consuming neem (*Azadirachta indica*) in controlled amounts offers proven therapeutic benefits in classical Ayurveda and modern phytotherapy:

1. **Ayurvedic Profile**:
   - **Rasa (Taste)**: *Tikta* (bitter) & *Kashaya* (astringent).
   - **Virya (Potency)**: **Sheeta (cooling)**.
   - **Vipaka**: *Katu* (pungent).
   - **Dosha Action**: Powerful pacifier of **Pitta and Kapha**; may aggravate **Vata** if taken in excess.

2. **Core Health Benefits**:
   - **Raktashodhaka (Blood Purifier)**: Flushes deep metabolic toxins (*Ama*), promoting clear skin and combating acne, eczema, and rashes.
   - **Krimighna (Antimicrobial & Anti-parasitic)**: Rich in bioactive azadirachtin and nimbin to eliminate gut parasites and harmful bacteria.
   - **Glycemic & Liver Detox**: Stimulates hepatic bile production and enhances cellular insulin sensitivity.

3. **Recommended Consumption & Dosage**:
   - **Fresh Leaves**: Chew **2 to 4 small, tender young leaves** in the morning on an empty stomach with warm water.
   - **Spring Cleansing (*Chaitra* Month)**: Traditionally consumed for 15–21 days during seasonal transition to strengthen immunity.
   - **Leaf Juice (*Swarasa*)**: 5–10 ml diluted in water for limited 2-week courses.

4. **Crucial Precautions**:
   - **Pregnancy**: Strictly contraindicated during pregnancy or when trying to conceive (proven anti-fertility and abortifacient actions).
   - **High Vata**: Individuals with severe dryness or underweight status should avoid regular intake.
   - **Avoid Long-term Overuse**: Do not consume continuously for months without medical supervision.

5. **Intellectual Property (IP) & TKDL Note**:
   - Because Neem's health benefits are documented in classical texts (*Charaka Samhita*, *Bhavaprakasha*), these therapeutic uses are in the public domain and **cannot be patented** under Section 3(p) of the Indian Patents Act.

⚠️ *Disclaimer: This is information only. Not medical or clinical prescription. Consult a certified Ayurvedic physician.*`;
    }

    return `## 🌿 Neem (*Azadirachta indica*) – Classical Ayurvedic & Botanical Overview

### 1. Botanical Identity
- **Botanical Name**: *Azadirachta indica* (A. Juss)
- **Family**: Meliaceae (Mahogany family)
- **Classical Sanskrit Names**: **Nimba** (bestower of health), **Arishta** (indestructible / relieves afflictions), **Pichumarda** (destroyer of dermatosis)
- **Common Names**: Neem, Indian Lilac, Margosa tree

---

### 2. Classical Ayurvedic Pharmacology (Dravyaguna)
| Attribute | Classical Property (*Charaka & Sushruta Samhita*) |
| :--- | :--- |
| **Rasa (Taste)** | **Tikta** (Bitter) & **Kashaya** (Astringent) |
| **Guna (Qualities)** | **Laghu** (Light to digest), **Ruksha** (Dry) |
| **Virya (Potency)** | **Sheeta (Cooling)** *(Note: Neem is cooling in nature, pacifying internal heat)* |
| **Vipaka (Post-Digestive)** | **Katu** (Pungent) |
| **Dosha Karma** | **Pacifies Pitta and Kapha**; aggravates Vata in excess |
| **Prabhava (Special Action)** | **Krimighna** (Antiparasitic / Antimicrobial) & **Vishaghna** (Antitoxic) |

---

### 3. Major Therapeutic Actions
- **Raktashodhaka (Blood Purifier)**: Foremost Ayurvedic therapeutic for eliminating accumulated metabolic toxins (*Ama*) and treating dermatological conditions (*Kushtha* - eczema, acne, psoriasis).
- **Krimighna & Vrana Shodhana**: Cleanses septic ulcers, infected wounds, and eliminates pathogenic intestinal flora.
- **Kandughna (Anti-pruritic)**: Relieves skin itching, urticaria, and burning sensations.
- **Pramehahara (Glycemic Support)**: Enhances insulin sensitivity and assists in healthy glucose metabolism.

---

### 4. Active Phytochemistry
Neem contains over 140 bio-active limonoids and triterpenes:
- **Azadirachtin**: World-renowned natural biodegradable bio-insecticide and anti-feedant.
- **Nimbin & Nimbidin**: Potent anti-inflammatory, antipyretic, and antihistaminic agents.
- **Gedunin & Mahmoodin**: Active antifungal, antibacterial, and antimalarial principles.

---

### 5. Intellectual Property (IPR) & TKDL Landmark Precedent
- **Section 3(p) Indian Patents Act**: Traditional medicinal uses of Neem are documented in classical Sanskrit treatises and protected by the **Traditional Knowledge Digital Library (TKDL)**. Natural plant parts and conventional extracts cannot be patented.
- **Historic EPO Patent Revocation (WR Grace Case)**: In 1995, the European Patent Office granted a patent to W.R. Grace for neem oil's fungicidal properties. India (via CSIR) challenged the patent with classical Ayurvedic texts proving prior art. In May 2000, the EPO revoked the patent in its entirety.

⚠️ *Disclaimer: This information is for educational and IP research purposes. It is not clinical or legal advice.*`;
  }

  // INTERNATIONAL RESPONSES
  if (jurisdiction === 'international') {
    if (isHindi) {
      return `### अंतर्राष्ट्रीय पेटेंट (PCT) एवं वैश्विक ABS अनुपालन:

1. **WIPO PCT फाइलिंग रणनीति**:
   - भारतीय प्राथमिकता आवेदन की तारीख से 12 महीने के भीतर WIPO के माध्यम से PCT अंतर्राष्ट्रीय आवेदन दाखिल करें।
   - 30-31 महीनों में USPTO (अमेरिका) एवं EPO (यूरोप) के राष्ट्रीय चरण (National Phase) में प्रवेश करें।

2. **पारंपरिक ज्ञान डिजिटल लाइब्रेरी (TKDL) विदेशी सुरक्षा**:
   - CSIR-TKDL के USPTO व EPO के साथ समझौते हैं, जिससे विदेशी पेटेंट कार्यालय नीम, हल्दी, अश्वगंधा आदि पर दिए जाने वाले पेटेंट दावों को स्वतः निरस्त कर देते हैं।

3. **नागोया प्रोटोकॉल एवं सीमा पार ABS**:
   - जैविक संसाधनों के विदेशी वाणिज्यिक उपयोग से पूर्व पूर्व-सूचित सहमति (PIC) व परस्पर सहमत शर्तें (MAT) अनिवार्य हैं।
   - **कानूनी चेतावनी**: भारतीय जैविक विविधता अधिनियम की धारा 6 के तहत, भारतीय पौधे पर आधारित किसी भी विदेशी पेटेंट से पहले राष्ट्रीय जैव विविधता प्राधिकरण (NBA) से **फॉर्म 3 अनुमोदन** अनिवार्य है।

⚠️ *Disclaimer: This is information only. Not legal advice. Consult a human IP practitioner.*`;
    }

    return `### International Patent (PCT) & Global ABS Compliance:

1. **PCT Filing Strategy for Ayurvedic Formulations**:
   - **Timing**: File a Patent Cooperation Treaty (PCT) application within 12 months of your Indian priority date.
   - **National Phase**: Enter target jurisdictions (USPTO, EPO, JPO) within 30-31 months.
   - **Overcoming Prior Art**: Foreign examiners use TKDL database to issue 35 U.S.C. 102/103 rejections against raw botanical combinations. Focus claims on:
     * Novel drug delivery formulations (liposomal/phytosomal).
     * Standardized marker fractions (minimum 4 bioactive compounds).
     * Statistically validated non-obvious synergy with molecular mechanisms.

2. **TKDL Defense Against Global Biopiracy**:
   - Access agreements with USPTO, EPO, and WIPO allow patent examiners to identify classical Indian texts and reject improper patent claims.

3. **Nagoya Protocol & NBA Form 3 Mandate**:
   - Cross-border export of Indian botanical materials requires Prior Informed Consent (PIC) and Mutually Agreed Terms (MAT).
   - **Critical Mandate**: Section 6 of India's Biological Diversity Act requires inventors to secure **NBA Form 3 approval** prior to obtaining any patent outside India.

⚠️ *Disclaimer: This is information only. Not legal advice. Consult a human IP practitioner.*`;
  }

  // INDIAN RESPONSES
  if (q.includes('patent') || q.includes('3(p)') || q.includes('3(e)') || q.includes('synergy') || q.includes('ashwagandha') || q.includes('curcumin')) {
    if (isHindi) {
      return `### भारतीय पेटेंट अधिनियम, 1970 और धारा 3(p) विश्लेषण:

1. **धारा 3(p) का प्रतिबंध (पारंपरिक ज्ञान)**:
   - पारंपरिक रूप से ज्ञात जड़ी-बूटियों (जैसे अश्वगंधा, हल्दी, त्रिफला) का सीधा सम्मिश्रण पेटेंट योग्य नहीं है।

2. **पेटेंट प्राप्त करने के मान्य रास्ते**:
   - **धारा 3(e) - गैर-स्पष्ट तालमेल (Synergy)**: सिद्ध करें कि दोनों जड़ी-बूटियां मिलकर आश्चर्यजनक चिकित्सीय तालमेल (Combination Index CI < 0.8) देती हैं।
   - **उपन्यास वितरण प्रणाली (NDDS - धारा 3(d))**: नैनो-फॉर्मूलेशन या फाइटोसोम द्वारा जैव-उपलब्धता में 3x से अधिक की वृद्धि प्रमाणित करें।
   - **नवीन निष्कर्षण तकनीक**: सुपरक्रिटिकल CO2 निष्कर्षण या पृथक्कृत अंशों की प्रक्रिया पर पेटेंट लें।

3. **राष्ट्रीय जैव विविधता प्राधिकरण (NBA) फॉर्म 3**:
   - पेटेंट जारी होने से पहले भारतीय जैविक संसाधनों पर आधारित नवाचार के लिए NBA फॉर्म 3 अनुमोदन लेना अनिवार्य है।

⚠️ *Disclaimer: This is information only. Not legal advice. Consult a human IP practitioner.*`;
    }

    return `### Indian Patents Act (Section 3(p), 3(e) & 3(d)) Guidance:

1. **Section 3(p) Statutory Bar (Traditional Knowledge)**:
   - Section 3(p) strictly prevents patenting of inventions that are traditionally known or represent mere aggregations of known botanical properties (e.g. Ashwagandha + Curcumin).

2. **Pathways to Patent Eligibility**:
   - **Section 3(e) Synergism**: Present statistical pharmacology showing a validated Combination Index (CI < 0.8) demonstrating genuine therapeutic synergy over individual components.
   - **Section 3(d) Novel Drug Delivery (NDDS)**: Encapsulate extracts in lipid nanoparticles or phytosomes to demonstrate a 3x-5x enhancement in oral bioavailability.
   - **Novel Extraction Processes**: Claim the proprietary supercritical fluid fractionation process rather than the botanical mixture itself.

3. **Mandatory National Biodiversity Authority (NBA) Clearance**:
   - File **NBA Form 3** under Section 6 of the Biological Diversity Act, 2002 prior to patent grant.

⚠️ *Disclaimer: This is information only. Not legal advice. Consult a human IP practitioner.*`;
  }

  if (q.includes('abs') || q.includes('nba') || q.includes('biodiversity') || q.includes('form 3') || q.includes('form 1')) {
    return `### National Biodiversity Authority (NBA) & ABS Compliance:

1. **Biological Diversity Act 2002 & 2023 Amendment**:
   - Any commercial utilization of Indian bio-resources requires ABS compliance to protect local community rights.

2. **Key NBA Filings**:
   - **Form 1**: For foreign entities or Indian entities with foreign equity accessing Indian bio-resources.
   - **Form 3**: Mandatory for ANY entity applying for a patent (in India or abroad) based on Indian biological material. Must be granted before patent issuance.
   - **State Biodiversity Board (SBB)**: Advance intimation required for Indian manufacturers.

3. **Benefit Sharing Obligation**:
   - 0.1% to 0.5% of ex-factory gross sales value deposited into the National Biodiversity Fund.

⚠️ *Disclaimer: This is information only. Not legal advice. Consult a human IP practitioner.*`;
  }

  // Default Guidance
  return `### Ayurvedic Intellectual Property & ABS Guidance:

1. **Traditional Knowledge Digital Library (TKDL)**:
   - 4.5+ lakh classical formulations are documented as prior art. Overcome TKDL challenges via novel delivery systems (NDDS) or standardized synergistic extracts.

2. **NBA Form 3 Approval**:
   - Required before any patent grant for innovations derived from Indian biological flora.

3. **Drugs & Cosmetics Act Compliance**:
   - Classical formulations comply with Schedule I texts; proprietary formulations require Rule 158B safety/stability documentation.

⚠️ *Disclaimer: This is information only. Not legal advice. Consult a human IP practitioner.*`;
}

import React, { useState } from 'react';
import { X, History, MessageSquare, Trash2, Plus, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { ChatSession, Language } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewSession: () => void;
  onClearAllHistory?: () => void;
  language: Language;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onNewSession,
  onClearAllHistory,
  language
}) => {
  // Inline confirmation states without relying on blocked window.confirm
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isConfirmingClearAll, setIsConfirmingClearAll] = useState<boolean>(false);

  if (!isOpen) return null;

  const isHindi = language === 'hi';

  const handleConfirmDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    onDeleteSession(sessionId);
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteId(null);
  };

  const handleConfirmClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClearAllHistory) {
      onClearAllHistory();
    } else {
      sessions.forEach(s => onDeleteSession(s.id));
    }
    setIsConfirmingClearAll(false);
  };

  return (
    <div 
      id="history-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="history-modal-dialog"
        className="w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-[#0A1A12] border border-slate-200 dark:border-[#2E7D32]/50 p-6 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#2E7D32]/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-[#12281E] text-[#1B5E20] dark:text-[#81C784] border border-emerald-200/60 dark:border-[#2E7D32]/50">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isHindi ? 'परामर्श सत्र इतिहास' : 'Consultation History'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-emerald-200/60">
                {isHindi 
                  ? `${sessions.length} सहेजे गए परामर्श सत्र` 
                  : `${sessions.length} saved intellectual property consultations`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {sessions.length > 0 && (
              <>
                {isConfirmingClearAll ? (
                  <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 px-2 py-1 rounded-xl">
                    <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300">
                      {isHindi ? 'सभी हटाएं?' : 'Clear all?'}
                    </span>
                    <button
                      type="button"
                      onClick={handleConfirmClearAll}
                      className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] shadow-xs cursor-pointer transition-colors"
                    >
                      {isHindi ? 'हाँ' : 'Yes'}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsConfirmingClearAll(false);
                      }}
                      className="px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] cursor-pointer transition-colors"
                    >
                      {isHindi ? 'रद्द' : 'Cancel'}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsConfirmingClearAll(true);
                      setConfirmDeleteId(null);
                    }}
                    className="px-2.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title={isHindi ? 'सभी सत्र हटाएं' : 'Clear all consultation history'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{isHindi ? 'सभी साफ़ करें' : 'Clear All'}</span>
                  </button>
                )}
              </>
            )}

            <button
              type="button"
              onClick={() => {
                onNewSession();
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#1B5E20] hover:bg-[#2E7D32] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isHindi ? 'नया सत्र' : 'New Chat'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#12281E] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs max-h-[50vh]">
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 dark:text-slate-500 space-y-3">
              <MessageSquare className="w-10 h-10 mx-auto opacity-40 text-[#2E7D32]" />
              <p className="text-xs">
                {isHindi 
                  ? 'कोई पूर्व परामर्श सत्र नहीं मिला। अपनी पहली पूछताछ शुरू करें!' 
                  : 'No saved consultation history yet. Ask a question to begin!'}
              </p>
            </div>
          ) : (
            sessions.map((session) => {
              const isCurrent = session.id === currentSessionId;
              const isDeletingThis = confirmDeleteId === session.id;

              return (
                <div
                  key={session.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 group ${
                    isCurrent
                      ? 'bg-emerald-50/80 dark:bg-[#12281E] border-[#2E7D32] shadow-xs'
                      : 'bg-slate-50 dark:bg-[#0D2218] border-slate-200 dark:border-[#2E7D32]/30 hover:border-emerald-500/60'
                  }`}
                >
                  <div 
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => {
                      onSelectSession(session.id);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-[#12281E] text-slate-700 dark:text-emerald-300 border border-slate-200 dark:border-white/10">
                        {session.jurisdiction === 'india' ? '🇮🇳 Indian IP' : '🌐 PCT Global'}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.updatedAt ? new Date(session.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Active
                        </span>
                      )}
                    </div>

                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 truncate text-xs group-hover:text-[#1B5E20] dark:group-hover:text-[#81C784] transition-colors">
                      {session.title || (isHindi ? 'आयुर्वेद पेटेंट परामर्श' : 'Ayurveda Formulation IP Review')}
                    </h4>

                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {session.messages.length} {isHindi ? 'संदेश' : 'messages in dialogue'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isDeletingThis ? (
                      /* Inline Deletion Confirmation - 100% reliable inside iframes */
                      <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 px-2 py-1 rounded-lg animate-fade-in">
                        <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
                        <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300">
                          {isHindi ? 'हटाएं?' : 'Delete?'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleConfirmDelete(e, session.id)}
                          className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] shadow-xs cursor-pointer transition-colors"
                        >
                          {isHindi ? 'हाँ' : 'Yes'}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelDelete}
                          className="px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] cursor-pointer transition-colors"
                        >
                          {isHindi ? 'रद्द' : 'Cancel'}
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectSession(session.id);
                            onClose();
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#12281E] border border-slate-200 dark:border-white/10 hover:border-[#1B5E20] dark:hover:border-emerald-500 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                          title={isHindi ? 'सत्र खोलें' : 'Open session'}
                        >
                          <span>{isHindi ? 'खोलें' : 'Open'}</span>
                          <ArrowRight className="w-3 h-3 text-[#1B5E20] dark:text-[#81C784]" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(session.id);
                            setIsConfirmingClearAll(false);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title={isHindi ? 'यह सत्र हटाएं' : 'Delete session'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-200 dark:border-[#2E7D32]/40 flex items-center justify-between text-[11px] text-slate-500 dark:text-emerald-200/50">
          <span>{isHindi ? 'सभी परामर्श रिकॉर्ड आपके ब्राउज़र में सुरक्षित रहते हैं' : 'All consultation records remain locally in your browser'}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#12281E] text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-[#1B5E20] transition-colors cursor-pointer"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

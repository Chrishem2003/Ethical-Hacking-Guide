import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, RefreshCw, X, ShieldAlert, Code, Check, Copy } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface CyberMentorProps {
  activeChapterTitle: string;
  activeSnippet?: string;
  onClose?: () => void;
  onSendToTerminal?: (cmd: string) => void;
}

export const CyberMentor: React.FC<CyberMentorProps> = ({
  activeChapterTitle,
  activeSnippet,
  onClose,
  onSendToTerminal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `👋 Hey, I am **Chrishem's AI Cyber Mentor**! 
I am here to guide your penetration testing training, explain any command flag, dissect payloads, and review your methodology.

Currently studying: **${activeChapterTitle || 'The Complete Ethical Hacker'}**.
What offensive security question can I solve for you right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-5).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          chapterTitle: activeChapterTitle,
          contextCode: activeSnippet || '',
          conversationHistory: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status: ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || 'No reply received from mentor.';

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error('Mentor chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `⚠️ **Connection Notice:** Unable to reach the remote AI mentor service (${err?.message || 'Network error'}).\n\n*Quick Tip from Chrishem:* For reliable offline command syntax, visit **Appendix A: Command Cheat Sheets** in the sidebar.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    `Explain the key concepts of ${activeChapterTitle.split(':')[0] || 'this chapter'}`,
    'How do I execute an Nmap scan without triggering firewall blocks?',
    'What are the legal steps required before beginning a freelance penetration test?',
    'Explain how Kerberoasting works in Active Directory',
  ];

  return (
    <div className="flex flex-col h-full bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-950 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-neutral-100">Chrishem AI Mentor</h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                LIVE TUTOR
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 truncate max-w-[220px]">
              Trained on 24 Offensive Security Chapters
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() =>
              setMessages([
                {
                  id: 'reset',
                  role: 'model',
                  text: `Session reset. Ready for your questions on **${activeChapterTitle}**!`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
            title="Reset Conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
              title="Close Mentor Panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-3 py-2 bg-neutral-950/60 border-b border-neutral-800/80 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
        <span className="text-neutral-500 text-[11px] whitespace-nowrap flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-emerald-400" /> Prompts:
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-2.5 py-1 rounded bg-neutral-800/70 hover:bg-neutral-700/80 border border-neutral-700/40 text-neutral-300 text-xs whitespace-nowrap transition-colors"
          >
            {p.length > 35 ? p.substring(0, 35) + '...' : p}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div key={m.id} className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs ${
                  isUser
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-800 border border-neutral-700 text-emerald-400'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-950/90 border border-neutral-800 text-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1 text-[11px] text-neutral-400">
                  <span className="font-semibold text-neutral-300">
                    {isUser ? 'You (Student Pentester)' : 'Chrishem Mentor'}
                  </span>
                  <span>{m.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap font-sans space-y-2">
                  {m.text}
                </div>

                {!isUser && (
                  <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center justify-end gap-2 text-xs">
                    <button
                      onClick={() => handleCopy(m.text, m.id)}
                      className="text-neutral-400 hover:text-neutral-200 flex items-center gap-1 text-[11px]"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-neutral-400 italic pl-10">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Chrishem AI Mentor is analyzing payload & drafting technical response...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-3 bg-neutral-950 border-t border-neutral-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a technical question or ask to explain an exploit..."
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600 text-white font-medium text-sm flex items-center gap-1.5 transition-all shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <p className="text-[10px] text-neutral-500 text-center mt-2">
          Strictly authorized educational guidance • Adheres to CFAA & Responsible Disclosure principles.
        </p>
      </div>
    </div>
  );
};

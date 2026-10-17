import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Terminal,
  BookOpen,
  FileCode,
  FileCheck,
  Flame,
  Wrench,
  Bot,
  Award,
  Zap,
  ArrowRight,
  Sparkles,
  Command,
  X,
  Keyboard,
  Shield
} from 'lucide-react';
import { HACKFORGE_CURRICULUM, Lesson } from '../data/curriculumData';
import { CHEAT_SHEET_COMMANDS, CheatSheetCommand } from '../data/cheatSheetData';
import { sound } from '../utils/soundEffects';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (lesson: Lesson) => void;
  onOpenTerminal: () => void;
  onOpenMentor: () => void;
  onOpenTools: () => void;
  onOpenCheatSheet: () => void;
  onOpenBonusVault: () => void;
  onOpenBadges: () => void;
  onOpenCertificate: () => void;
  onOpenMonetization: () => void;
  onOpenUpgrade: () => void;
  onSendToTerminal: (cmd: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectLesson,
  onOpenTerminal,
  onOpenMentor,
  onOpenTools,
  onOpenCheatSheet,
  onOpenBonusVault,
  onOpenBadges,
  onOpenCertificate,
  onOpenMonetization,
  onOpenUpgrade,
  onSendToTerminal,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      sound.playClick();
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Quick Action Items
  const quickActions = [
    {
      id: 'act-terminal',
      title: 'Launch Kali Sandbox Terminal',
      category: 'Action',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      run: () => {
        onOpenTerminal();
        onClose();
      },
    },
    {
      id: 'act-mentor',
      title: 'Ask AI Cyber Mentor',
      category: 'Action',
      icon: <Bot className="w-4 h-4 text-sky-400" />,
      run: () => {
        onOpenMentor();
        onClose();
      },
    },
    {
      id: 'act-tools',
      title: 'Open Field Tools (Subnet, CVSS, Shells)',
      category: 'Tools',
      icon: <Wrench className="w-4 h-4 text-emerald-400" />,
      run: () => {
        onOpenTools();
        onClose();
      },
    },
    {
      id: 'act-cheatsheet',
      title: 'Offensive Security Command Cheat Sheet (100+)',
      category: 'Reference',
      icon: <FileCode className="w-4 h-4 text-amber-400" />,
      run: () => {
        onOpenCheatSheet();
        onClose();
      },
    },
    {
      id: 'act-vault',
      title: 'Bonus Vault (ROE, Pentest Report, 90-Day Plan)',
      category: 'Deliverables',
      icon: <FileCheck className="w-4 h-4 text-sky-400" />,
      run: () => {
        onOpenBonusVault();
        onClose();
      },
    },
    {
      id: 'act-monetization',
      title: 'The Complete E-Book & Storefront Hub',
      category: 'Product',
      icon: <BookOpen className="w-4 h-4 text-emerald-400" />,
      run: () => {
        onOpenMonetization();
        onClose();
      },
    },
    {
      id: 'act-badges',
      title: 'View Operator Rank & Badges',
      category: 'Progress',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
      run: () => {
        onOpenBadges();
        onClose();
      },
    },
    {
      id: 'act-certificate',
      title: 'Certificate of Practical Cyber Defense',
      category: 'Certification',
      icon: <Award className="w-4 h-4 text-sky-400" />,
      run: () => {
        onOpenCertificate();
        onClose();
      },
    },
  ];

  // Matching Lessons
  const matchingLessons = HACKFORGE_CURRICULUM.filter(
    (l) =>
      l.title.toLowerCase().includes(normalizedQuery) ||
      l.module.toLowerCase().includes(normalizedQuery) ||
      l.partTitle.toLowerCase().includes(normalizedQuery)
  ).slice(0, 5);

  // Matching Cheat Sheet Commands
  const matchingCommands = CHEAT_SHEET_COMMANDS.filter(
    (c) =>
      c.command.toLowerCase().includes(normalizedQuery) ||
      c.description.toLowerCase().includes(normalizedQuery) ||
      c.category.toLowerCase().includes(normalizedQuery)
  ).slice(0, 4);

  // Filtered Quick Actions
  const matchingActions = quickActions.filter(
    (a) =>
      a.title.toLowerCase().includes(normalizedQuery) ||
      a.category.toLowerCase().includes(normalizedQuery)
  );

  // Total results flat array for keyboard navigation
  const flatResults: {
    type: 'action' | 'lesson' | 'command';
    data: any;
  }[] = [
    ...matchingActions.map((a) => ({ type: 'action' as const, data: a })),
    ...matchingLessons.map((l) => ({ type: 'lesson' as const, data: l })),
    ...matchingCommands.map((c) => ({ type: 'command' as const, data: c })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, flatResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatResults.length) % Math.max(1, flatResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = flatResults[selectedIndex];
      if (selected) {
        executeItem(selected);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const executeItem = (item: { type: 'action' | 'lesson' | 'command'; data: any }) => {
    sound.playCommandRun();
    if (item.type === 'action') {
      item.data.run();
    } else if (item.type === 'lesson') {
      onSelectLesson(item.data);
      onClose();
    } else if (item.type === 'command') {
      onSendToTerminal(item.data.command);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-800 gap-3 bg-neutral-900/60">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, lesson title, tool, or shortcut... (Cmd+K)"
            className="w-full bg-transparent text-sm sm:text-base text-neutral-100 placeholder-neutral-500 focus:outline-none font-mono"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-500 border border-neutral-800 px-1.5 py-0.5 rounded">
              <span className="text-[10px]">ESC</span>
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4">
          {flatResults.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 font-mono text-xs">
              No matching commands or lessons found for "{query}"
            </div>
          ) : (
            <>
              {/* Quick Actions Group */}
              {matchingActions.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase text-neutral-500 tracking-wider">
                    Quick Actions & Modals
                  </div>
                  <div className="space-y-1 mt-1">
                    {matchingActions.map((action) => {
                      const idx = flatResults.findIndex(
                        (r) => r.type === 'action' && r.data.id === action.id
                      );
                      const isSelected = selectedIndex === idx;
                      return (
                        <div
                          key={action.id}
                          onClick={() => executeItem({ type: 'action', data: action })}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs font-mono transition-colors ${
                            isSelected
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                              : 'text-neutral-300 hover:bg-neutral-900 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {action.icon}
                            <span className="font-medium">{action.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-neutral-500 bg-neutral-900 px-1.5 py-0.5 rounded">
                              {action.category}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Lessons Group */}
              {matchingLessons.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase text-neutral-500 tracking-wider">
                    Curriculum Lessons
                  </div>
                  <div className="space-y-1 mt-1">
                    {matchingLessons.map((lesson) => {
                      const idx = flatResults.findIndex(
                        (r) => r.type === 'lesson' && r.data.slug === lesson.slug
                      );
                      const isSelected = selectedIndex === idx;
                      return (
                        <div
                          key={lesson.slug}
                          onClick={() => executeItem({ type: 'lesson', data: lesson })}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs font-mono transition-colors ${
                            isSelected
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                              : 'text-neutral-300 hover:bg-neutral-900 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                            <div className="truncate">
                              <span className="text-neutral-200 font-semibold truncate">
                                {lesson.title}
                              </span>
                              <span className="text-[10px] text-neutral-500 ml-2">
                                {lesson.module}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {lesson.is_pro && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                                PRO
                              </span>
                            )}
                            <span className="text-[10px] text-neutral-500">
                              {lesson.durationMinutes}m
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cheat Sheet Commands Group */}
              {matchingCommands.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase text-neutral-500 tracking-wider">
                    Offensive Commands (Click to Send to Lab)
                  </div>
                  <div className="space-y-1 mt-1">
                    {matchingCommands.map((cmd) => {
                      const idx = flatResults.findIndex(
                        (r) => r.type === 'command' && r.data.id === cmd.id
                      );
                      const isSelected = selectedIndex === idx;
                      return (
                        <div
                          key={cmd.id}
                          onClick={() => executeItem({ type: 'command', data: cmd })}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs font-mono transition-colors ${
                            isSelected
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                              : 'text-neutral-300 hover:bg-neutral-900 border border-transparent'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <div className="text-emerald-400 font-bold truncate">
                              $ {cmd.command}
                            </div>
                            <div className="text-[10px] text-neutral-400 truncate">
                              {cmd.description}
                            </div>
                          </div>
                          <span className="text-[10px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded shrink-0">
                            Send to Lab ↵
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 bg-neutral-900/40 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-emerald-500/80">HACKFORGE Command Center</span>
        </div>
      </div>
    </div>
  );
};

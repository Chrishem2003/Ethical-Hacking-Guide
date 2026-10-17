import React, { useState } from 'react';
import {
  BOOK_METADATA,
  BOOK_PARTS,
  CHAPTERS,
  APPENDICES,
  Chapter,
  Appendix
} from '../data/bookData';
import {
  Shield,
  Terminal,
  BookOpen,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Bookmark,
  Award,
  Sparkles,
  Bot,
  DollarSign,
  FileText,
  Lock,
  Layers,
  Zap,
  Menu,
  X
} from 'lucide-react';

interface NavigationSidebarProps {
  currentChapterId: string;
  currentAppendixId: string | null;
  onSelectChapter: (id: string) => void;
  onSelectAppendix: (id: string) => void;
  completedChapterIds: string[];
  bookmarkedChapterIds: string[];
  userXP: number;
  onOpenTerminal: () => void;
  onOpenMentor: () => void;
  onOpenMonetization: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  currentChapterId,
  currentAppendixId,
  onSelectChapter,
  onSelectAppendix,
  completedChapterIds,
  bookmarkedChapterIds,
  userXP,
  onOpenTerminal,
  onOpenMentor,
  onOpenMonetization,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedParts, setExpandedParts] = useState<Record<string, boolean>>({
    'part-0': true,
    'part-1': true,
    'part-2': true,
    'part-3': true,
    'part-4': true,
    appendices: true,
  });

  const togglePart = (partId: string) => {
    setExpandedParts((prev) => ({ ...prev, [partId]: !prev[partId] }));
  };

  // Filter chapters by search query
  const filteredChapters = CHAPTERS.filter(
    (ch) =>
      ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.keyLearningPoints.some((pt) => pt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const percentComplete = Math.round((completedChapterIds.length / CHAPTERS.length) * 100);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-80 bg-neutral-950 border-r border-neutral-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-bold text-emerald-400">CHRISHEM</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300">
                  ACADEMY
                </span>
              </div>
              <div className="text-xs font-bold text-neutral-200 tracking-tight truncate max-w-[170px]">
                The Complete Ethical Hacker
              </div>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress & XP Widget */}
        <div className="p-3.5 bg-neutral-900/60 border-b border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>{userXP} XP Earned</span>
            </span>
            <span className="text-emerald-400 font-semibold">{percentComplete}% Done</span>
          </div>

          <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${percentComplete}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
            <span>{completedChapterIds.length} of 24 Labs Finished</span>
            <span>{bookmarkedChapterIds.length} Saved</span>
          </div>
        </div>

        {/* Quick Tool Navigation Buttons */}
        <div className="p-3 border-b border-neutral-800 grid grid-cols-3 gap-1.5 text-xs font-mono">
          <button
            onClick={onOpenTerminal}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/40 text-neutral-300 flex flex-col items-center gap-1 transition-all"
            title="Open Kali Virtual Terminal"
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px]">Terminal</span>
          </button>

          <button
            onClick={onOpenMentor}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-sky-500/40 text-neutral-300 flex flex-col items-center gap-1 transition-all"
            title="Open AI Cyber Mentor"
          >
            <Bot className="w-4 h-4 text-sky-400" />
            <span className="text-[10px]">AI Mentor</span>
          </button>

          <button
            onClick={onOpenMonetization}
            className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 flex flex-col items-center gap-1 transition-all"
            title="Sell, Export & Certify"
          >
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-bold">Monetize</span>
          </button>
        </div>

        {/* Search Field */}
        <div className="p-3 border-b border-neutral-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 24 chapters & tools..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-neutral-500 hover:text-neutral-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Curriculum Tree */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4 text-xs font-sans">
          {searchQuery ? (
            /* Search Results View */
            <div className="space-y-1">
              <div className="text-[11px] font-mono text-neutral-500 px-2 py-1">
                {filteredChapters.length} matching chapters found:
              </div>
              {filteredChapters.map((ch) => {
                const isSelected = currentChapterId === ch.id && !currentAppendixId;
                const isDone = completedChapterIds.includes(ch.id);
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      onSelectChapter(ch.id);
                      onCloseMobile();
                    }}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start gap-2 ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold'
                        : 'border-transparent hover:bg-neutral-900 text-neutral-300'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-md bg-neutral-900 flex items-center justify-center text-[10px] font-mono text-neutral-400 shrink-0">
                      {ch.chapterNumber}
                    </span>
                    <div className="truncate flex-1">
                      <div className="truncate">{ch.title}</div>
                      <div className="text-[10px] text-neutral-500 truncate">{ch.subtitle}</div>
                    </div>
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          ) : (
            /* Standard Grouped Parts View */
            <>
              {BOOK_PARTS.map((part) => {
                const isExpanded = expandedParts[part.id] ?? true;
                const partChapters = CHAPTERS.filter((c) => part.chapterIds.includes(c.id));

                return (
                  <div key={part.id} className="space-y-1">
                    {/* Part Header Accordion Button */}
                    <button
                      onClick={() => togglePart(part.id)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 text-left truncate">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                          PART {part.partNumber}
                        </span>
                        <span className="text-neutral-300 font-semibold text-xs truncate">
                          {part.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[10px] text-neutral-500 font-mono">{part.weeksSpan}</span>
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                        )}
                      </div>
                    </button>

                    {/* Chapters List */}
                    {isExpanded && (
                      <div className="pl-2 space-y-0.5 border-l border-neutral-900 ml-2">
                        {partChapters.map((ch) => {
                          const isSelected = currentChapterId === ch.id && !currentAppendixId;
                          const isDone = completedChapterIds.includes(ch.id);
                          const isSaved = bookmarkedChapterIds.includes(ch.id);

                          return (
                            <button
                              key={ch.id}
                              onClick={() => {
                                onSelectChapter(ch.id);
                                onCloseMobile();
                              }}
                              className={`w-full text-left px-2.5 py-2 rounded-lg transition-all flex items-center justify-between gap-2 ${
                                isSelected
                                  ? 'bg-emerald-950/70 border border-emerald-500/60 text-emerald-200 font-semibold shadow-sm'
                                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 border border-transparent'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="text-[11px] font-mono text-neutral-500 shrink-0">
                                  {ch.chapterNumber === 0 ? '0' : ch.chapterNumber}.
                                </span>
                                <span className="truncate text-xs">{ch.title}</span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                {isSaved && <Bookmark className="w-3 h-3 text-amber-400 fill-current" />}
                                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Appendices Group */}
              <div className="pt-2 border-t border-neutral-900 space-y-1">
                <button
                  onClick={() => togglePart('appendices')}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[11px] font-mono font-bold text-amber-400 uppercase">
                      APPENDICES & CHEATS
                    </span>
                  </div>
                  {expandedParts['appendices'] ? (
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                  )}
                </button>

                {expandedParts['appendices'] && (
                  <div className="pl-2 space-y-0.5 border-l border-neutral-900 ml-2">
                    {APPENDICES.map((app) => {
                      const isSelected = currentAppendixId === app.id;
                      return (
                        <button
                          key={app.id}
                          onClick={() => {
                            onSelectAppendix(app.id);
                            onCloseMobile();
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-lg transition-all flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'bg-amber-950/60 border border-amber-500/60 text-amber-200 font-semibold'
                              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-[11px] font-mono text-amber-400 font-bold shrink-0">
                              App {app.letter}:
                            </span>
                            <span className="truncate text-xs">{app.title}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-neutral-800 text-[11px] text-neutral-500 text-center font-mono">
          Author: <span className="text-neutral-300 font-semibold">{BOOK_METADATA.author}</span> • {BOOK_METADATA.edition}
        </div>
      </aside>
    </>
  );
};

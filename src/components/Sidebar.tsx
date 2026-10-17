import React, { useState } from 'react';
import { CURRICULUM_MODULES, Lesson } from '../data/curriculumData';
import {
  Shield,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronRight,
  Search,
  X,
  Sparkles,
  Terminal,
  BookOpen,
  Award
} from 'lucide-react';

interface SidebarProps {
  currentLessonSlug: string;
  onSelectLesson: (lesson: Lesson) => void;
  completedSlugs: string[];
  isPro: boolean;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onTriggerUpgrade: (lessonTitle?: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentLessonSlug,
  onSelectLesson,
  completedSlugs,
  isPro,
  isOpenMobile,
  onCloseMobile,
  onTriggerUpgrade,
}) => {
  const [search, setSearch] = useState('');
  const [collapsedParts, setCollapsedParts] = useState<Record<string, boolean>>({});

  const togglePart = (partId: string) => {
    setCollapsedParts((prev) => ({ ...prev, [partId]: !prev[partId] }));
  };

  const totalLessons = CURRICULUM_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const percentComplete = Math.round((completedSlugs.length / totalLessons) * 100);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-80 bg-neutral-950 border-r border-neutral-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              CURRICULUM ENGINE
            </span>
            <h2 className="text-sm font-bold text-neutral-100">Zero to Professional</h2>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="p-3.5 bg-neutral-900/60 border-b border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400">Course Progress</span>
            <span className="text-emerald-400 font-bold">{percentComplete}% Complete</span>
          </div>

          <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${percentComplete}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
            <span>{completedSlugs.length} of {totalLessons} Lessons Mastered</span>
            <span>{isPro ? 'Pro Access Active' : 'Free Tier'}</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-neutral-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lessons, tools & CVEs..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2 text-neutral-500 hover:text-neutral-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Modules Tree */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4 text-xs font-sans">
          {CURRICULUM_MODULES.map((group) => {
            const isCollapsed = collapsedParts[group.id] || false;
            const isGroupLocked = group.is_pro && !isPro;

            // Filter lessons if searching
            const filteredLessons = group.lessons.filter(
              (l) =>
                !search ||
                l.title.toLowerCase().includes(search.toLowerCase()) ||
                l.module.toLowerCase().includes(search.toLowerCase())
            );

            if (search && filteredLessons.length === 0) return null;

            return (
              <div key={group.id} className="space-y-1">
                {/* Part Header Accordion */}
                <button
                  onClick={() => togglePart(group.id)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 transition-colors"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase ${
                        group.is_pro ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      PART {group.partNumber}
                    </span>
                    <span className="text-neutral-300 font-semibold text-xs truncate">
                      {group.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {group.is_pro && !isPro && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-800/60 text-[10px] text-amber-300 font-mono flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> PRO
                      </span>
                    )}
                    {isCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                    )}
                  </div>
                </button>

                {/* Lessons inside Part */}
                {!isCollapsed && (
                  <div className="pl-2 space-y-0.5 border-l border-neutral-900 ml-2">
                    {filteredLessons.map((lesson) => {
                      const isSelected = currentLessonSlug === lesson.slug;
                      const isDone = completedSlugs.includes(lesson.slug);
                      const isLocked = lesson.is_pro && !isPro;

                      return (
                        <button
                          key={lesson.slug}
                          onClick={() => {
                            if (isLocked) {
                              onTriggerUpgrade(lesson.title);
                            } else {
                              onSelectLesson(lesson);
                              onCloseMobile();
                            }
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-lg transition-all flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'bg-emerald-950/70 border border-emerald-500/60 text-emerald-200 font-semibold shadow-sm'
                              : isLocked
                              ? 'text-neutral-500 hover:text-neutral-400 hover:bg-neutral-900/60 border border-transparent'
                              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-[11px] font-mono text-neutral-500 shrink-0">
                              {lesson.order}.
                            </span>
                            <span className="truncate text-xs">{lesson.title}</span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {isLocked ? (
                              <Lock className="w-3.5 h-3.5 text-neutral-600" />
                            ) : isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <span className="text-[10px] text-neutral-600 font-mono">
                                {lesson.durationMinutes}m
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer credentials */}
        <div className="p-3 border-t border-neutral-800 text-[11px] text-neutral-500 text-center font-mono">
          HACKFORGE • Chief Instructor: <span className="text-neutral-300 font-semibold">Chrishem</span>
        </div>
      </aside>
    </>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { HACKFORGE_CURRICULUM, Lesson } from './data/curriculumData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LessonPlayer } from './components/LessonPlayer';
import { LabTerminal } from './components/LabTerminal';
import { LemonSqueezyModal } from './components/LemonSqueezyModal';
import { CertificateModal } from './components/CertificateModal';
import { CyberMentor } from './components/CyberMentor';
import { ToolsModal } from './components/ToolsModal';
import { BadgesModal } from './components/BadgesModal';
import { SalesAndMonetizationHub } from './components/SalesAndMonetizationHub';
import { CheatSheetModal } from './components/CheatSheetModal';
import { BonusVaultModal } from './components/BonusVaultModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { CommandPalette } from './components/CommandPalette';
import { sound } from './utils/soundEffects';
import {
  Terminal as TerminalIcon,
  X,
  BookOpen
} from 'lucide-react';

export default function App() {
  const [currentLesson, setCurrentLesson] = useState<Lesson>(HACKFORGE_CURRICULUM[0]);

  // Persisted state
  const [completedLessonSlugs, setCompletedLessonSlugs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hackforge_completed_slugs');
      return saved ? JSON.parse(saved) : ['lab-setup-kali-parrot'];
    } catch {
      return ['lab-setup-kali-parrot'];
    }
  });

  const [isPro, setIsPro] = useState<boolean>(() => {
    try {
      return localStorage.getItem('hackforge_is_pro') === 'true';
    } catch {
      return false;
    }
  });

  const [userXP, setUserXP] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('hackforge_user_xp');
      return saved ? parseInt(saved, 10) : 250;
    } catch {
      return 250;
    }
  });

  // Modals & Panels
  const [isTerminalModalOpen, setIsTerminalModalOpen] = useState(false);
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isMonetizationOpen, setIsMonetizationOpen] = useState(false);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [isBonusVaultOpen, setIsBonusVaultOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [lockedLessonAttempt, setLockedLessonAttempt] = useState<string>('');
  const [injectedCommand, setInjectedCommand] = useState<string>('');

  // LocalStorage sync
  useEffect(() => {
    try {
      localStorage.setItem('hackforge_completed_slugs', JSON.stringify(completedLessonSlugs));
    } catch (e) {
      console.warn(e);
    }
  }, [completedLessonSlugs]);

  useEffect(() => {
    try {
      localStorage.setItem('hackforge_is_pro', isPro ? 'true' : 'false');
    } catch (e) {
      console.warn(e);
    }
  }, [isPro]);

  useEffect(() => {
    try {
      localStorage.setItem('hackforge_user_xp', userXP.toString());
    } catch (e) {
      console.warn(e);
    }
  }, [userXP]);

  const currentIndex = HACKFORGE_CURRICULUM.findIndex((l) => l.slug === currentLesson.slug);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < HACKFORGE_CURRICULUM.length - 1;

  const handleSelectLesson = (lesson: Lesson) => {
    if (lesson.is_pro && !isPro) {
      setLockedLessonAttempt(lesson.title);
      setIsUpgradeModalOpen(true);
      return;
    }
    setCurrentLesson(lesson);
  };

  const handlePassLesson = () => {
    if (!completedLessonSlugs.includes(currentLesson.slug)) {
      setCompletedLessonSlugs((prev) => [...prev, currentLesson.slug]);
      setUserXP((prev) => prev + 250);
    }
  };

  const handleFlagCaptured = (flag: string) => {
    setUserXP((prev) => prev + 150);
    try {
      const saved = localStorage.getItem('hackforge_captured_flags');
      const flags = saved ? JSON.parse(saved) : [];
      if (!flags.includes(flag)) {
        localStorage.setItem('hackforge_captured_flags', JSON.stringify([...flags, flag]));
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleTriggerUpgrade = (lessonTitle?: string) => {
    setLockedLessonAttempt(lessonTitle || '');
    setIsUpgradeModalOpen(true);
  };

  const handleUpgradeSuccess = () => {
    setIsPro(true);
  };

  const handleNavigateNext = useCallback(() => {
    if (hasNext) {
      const nextLesson = HACKFORGE_CURRICULUM[currentIndex + 1];
      if (nextLesson.is_pro && !isPro) {
        setLockedLessonAttempt(nextLesson.title);
        setIsUpgradeModalOpen(true);
      } else {
        setCurrentLesson(nextLesson);
      }
    }
  }, [currentIndex, hasNext, isPro]);

  const handleNavigatePrev = useCallback(() => {
    if (hasPrev) {
      setCurrentLesson(HACKFORGE_CURRICULUM[currentIndex - 1]);
    }
  }, [currentIndex, hasPrev]);

  const handleSendToTerminal = (cmd: string) => {
    setInjectedCommand(cmd);
    setIsTerminalModalOpen(true);
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global Command Palette trigger (Cmd+K / Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Ignore if user is currently typing inside an input, textarea, or contentEditable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.classList.contains('xterm-helper-textarea'))
      ) {
        return;
      }

      if (e.key === 'Escape') {
        setIsTerminalModalOpen(false);
        setIsMentorOpen(false);
        setIsUpgradeModalOpen(false);
        setIsCertificateModalOpen(false);
        setIsToolsModalOpen(false);
        setIsBadgesModalOpen(false);
        setIsMonetizationOpen(false);
        setIsCheatSheetOpen(false);
        setIsBonusVaultOpen(false);
        setIsShortcutsOpen(false);
        setIsCommandPaletteOpen(false);
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 't') {
        e.preventDefault();
        setIsTerminalModalOpen((prev) => !prev);
      } else if (key === 'm') {
        e.preventDefault();
        setIsMentorOpen((prev) => !prev);
      } else if (key === 'f') {
        e.preventDefault();
        setIsToolsModalOpen((prev) => !prev);
      } else if (key === 'c') {
        e.preventDefault();
        setIsCheatSheetOpen((prev) => !prev);
      } else if (key === 'v') {
        e.preventDefault();
        setIsBonusVaultOpen((prev) => !prev);
      } else if (key === 'b') {
        e.preventDefault();
        setIsBadgesModalOpen((prev) => !prev);
      } else if (key === 'e') {
        e.preventDefault();
        setIsMonetizationOpen((prev) => !prev);
      } else if (key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (key === 'j' || e.key === 'ArrowRight') {
        handleNavigateNext();
      } else if (key === 'k' || e.key === 'ArrowLeft') {
        handleNavigatePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNavigateNext, handleNavigatePrev]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#08090d] text-neutral-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentLessonSlug={currentLesson.slug}
        onSelectLesson={handleSelectLesson}
        completedSlugs={completedLessonSlugs}
        isPro={isPro}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
        onTriggerUpgrade={handleTriggerUpgrade}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          isPro={isPro}
          userXP={userXP}
          completedCount={completedLessonSlugs.length}
          totalLessons={HACKFORGE_CURRICULUM.length}
          activeLessonTitle={currentLesson.title}
          onOpenTerminal={() => setIsTerminalModalOpen(true)}
          onOpenMentor={() => setIsMentorOpen(true)}
          onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
          onOpenCertificate={() => setIsCertificateModalOpen(true)}
          onOpenTools={() => setIsToolsModalOpen(true)}
          onOpenBadges={() => setIsBadgesModalOpen(true)}
          onOpenMonetization={() => setIsMonetizationOpen(true)}
          onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
          onOpenBonusVault={() => setIsBonusVaultOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onToggleMobileMenu={() => setIsOpenMobile(true)}
        />

        {/* Lesson Player View */}
        <main className="flex-1 flex overflow-hidden">
          <LessonPlayer
            lesson={currentLesson}
            isCompleted={completedLessonSlugs.includes(currentLesson.slug)}
            onPassLesson={handlePassLesson}
            onNavigateNext={handleNavigateNext}
            onNavigatePrev={handleNavigatePrev}
            hasNext={hasNext}
            hasPrev={hasPrev}
            onTriggerUpgrade={handleTriggerUpgrade}
            isPro={isPro}
            onOpenTools={() => setIsToolsModalOpen(true)}
            onSendToTerminal={handleSendToTerminal}
            onFlagCaptured={handleFlagCaptured}
          />
        </main>
      </div>

      {/* Standalone Fullscreen Lab Terminal Modal */}
      {isTerminalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-5xl h-[90vh] bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-neutral-200">
                  HACKFORGE LAB CONTAINER TERMINAL (ttyd / WebSocket Proxy)
                </span>
              </div>
              <button
                onClick={() => {
                  setIsTerminalModalOpen(false);
                  setInjectedCommand('');
                }}
                className="px-2.5 py-1 text-xs font-mono rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              >
                Close (ESC)
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-2">
              <LabTerminal
                labImage={currentLesson.lab_image}
                lessonTitle={currentLesson.title}
                presetCommand={injectedCommand}
                onFlagCaptured={handleFlagCaptured}
              />
            </div>
          </div>
        </div>
      )}

      {/* AI Cyber Mentor Drawer */}
      {isMentorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full sm:max-w-md h-full sm:h-[90vh] bg-neutral-950 sm:rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden flex flex-col">
            <CyberMentor
              activeChapterTitle={currentLesson.title}
              activeSnippet={currentLesson.content_md}
              onClose={() => setIsMentorOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Lemon Squeezy Pro Upgrade Modal */}
      <LemonSqueezyModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
        lockedLessonTitle={lockedLessonAttempt}
      />

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        completedCount={completedLessonSlugs.length}
        totalCount={HACKFORGE_CURRICULUM.length}
      />

      {/* Field Tools Suite Modal */}
      <ToolsModal
        isOpen={isToolsModalOpen}
        onClose={() => setIsToolsModalOpen(false)}
      />

      {/* Operator Rank & Badges Modal */}
      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        userXP={userXP}
        completedSlugs={completedLessonSlugs}
      />

      {/* Weaponized Cheat Sheet Modal */}
      <CheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
        onSendToTerminal={handleSendToTerminal}
      />

      {/* Bonus Resource Vault & Client Templates Modal */}
      <BonusVaultModal
        isOpen={isBonusVaultOpen}
        onClose={() => setIsBonusVaultOpen(false)}
        isPro={isPro}
        onTriggerUpgrade={() => handleTriggerUpgrade('Bonus Engagement Templates')}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Universal Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectLesson={handleSelectLesson}
        onOpenTerminal={() => setIsTerminalModalOpen(true)}
        onOpenMentor={() => setIsMentorOpen(true)}
        onOpenTools={() => setIsToolsModalOpen(true)}
        onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
        onOpenBonusVault={() => setIsBonusVaultOpen(true)}
        onOpenBadges={() => setIsBadgesModalOpen(true)}
        onOpenCertificate={() => setIsCertificateModalOpen(true)}
        onOpenMonetization={() => setIsMonetizationOpen(true)}
        onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
        onSendToTerminal={handleSendToTerminal}
      />

      {/* Complete E-Book, PDF Export & Monetization Hub Modal */}
      {isMonetizationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-5xl h-[92vh] bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-3.5 bg-neutral-900 border-b border-neutral-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-100">
                    The Complete Ethical Hacker — Publication & Monetization Suite
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400">
                    By Chrishem • Digital Product Storefront, PDF Exporter & Passive Income Toolkit
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsMonetizationOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SalesAndMonetizationHub
                userXP={userXP}
                completedChapters={completedLessonSlugs}
                onClose={() => setIsMonetizationOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

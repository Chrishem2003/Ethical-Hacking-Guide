import React from 'react';
import {
  Shield,
  Terminal,
  Bot,
  Zap,
  Award,
  Menu,
  Sparkles,
  Flame,
  Wrench,
  BookOpen,
  FileCode,
  FileCheck,
  Keyboard,
  Search,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface NavbarProps {
  isPro: boolean;
  userXP: number;
  completedCount: number;
  totalLessons: number;
  activeLessonTitle: string;
  onOpenTerminal: () => void;
  onOpenMentor: () => void;
  onOpenUpgrade: () => void;
  onOpenCertificate: () => void;
  onOpenTools: () => void;
  onOpenBadges: () => void;
  onOpenMonetization: () => void;
  onOpenCheatSheet: () => void;
  onOpenBonusVault: () => void;
  onOpenShortcuts: () => void;
  onOpenCommandPalette: () => void;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isPro,
  userXP,
  completedCount,
  totalLessons,
  activeLessonTitle,
  onOpenTerminal,
  onOpenMentor,
  onOpenUpgrade,
  onOpenCertificate,
  onOpenTools,
  onOpenBadges,
  onOpenMonetization,
  onOpenCheatSheet,
  onOpenBonusVault,
  onOpenShortcuts,
  onOpenCommandPalette,
  onToggleMobileMenu,
}) => {
  const [audioEnabled, setAudioEnabled] = React.useState(() => sound.getAudioEnabled());

  const handleToggleAudio = () => {
    const nextState = !audioEnabled;
    sound.setAudioEnabled(nextState);
    setAudioEnabled(nextState);
    if (nextState) {
      sound.playSuccess();
    }
  };
  return (
    <header className="h-14 px-3 sm:px-6 bg-neutral-950/90 border-b border-neutral-800 backdrop-blur-md flex items-center justify-between shrink-0 z-30">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 lg:hidden"
          title="Open Course Syllabus"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold tracking-wider text-neutral-100 font-mono">
                HACKFORGE
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400">
                by Chrishem
              </span>
            </div>
          </div>
        </div>

        <div className="hidden 2xl:flex items-center gap-2 pl-4 border-l border-neutral-800 text-xs font-mono text-neutral-400 truncate max-w-xs">
          <span className="truncate">{activeLessonTitle}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
        {/* Universal Search & Command Palette */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 font-mono text-neutral-300 hover:text-neutral-100 transition-colors cursor-pointer"
          title="Open Command Palette & Universal Search [Cmd+K]"
        >
          <Search className="w-3.5 h-3.5 text-neutral-400" />
          <span className="hidden xl:inline text-neutral-400">Search...</span>
          <span className="text-[10px] bg-neutral-800 px-1 py-0.2 rounded text-neutral-500 font-mono">
            ⌘K
          </span>
        </button>

        {/* E-Book & Product Monetization Hub */}
        <button
          onClick={onOpenMonetization}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          title="Open Complete E-Book, PDF Export & Monetization Hub [HotKey: E]"
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">E-Book & Store</span>
        </button>

        {/* Cheat Sheet Quick Button */}
        <button
          onClick={onOpenCheatSheet}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 font-mono text-neutral-300 hover:text-neutral-100 transition-colors cursor-pointer"
          title="Offensive Security Command Cheat Sheet (100+ commands) [HotKey: C]"
        >
          <FileCode className="w-3.5 h-3.5 text-amber-400" />
          <span>Cheat Sheet</span>
        </button>

        {/* Bonus Vault Button */}
        <button
          onClick={onOpenBonusVault}
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 font-mono text-neutral-300 hover:text-neutral-100 transition-colors cursor-pointer"
          title="Download Rules of Engagement & Client Templates [HotKey: V]"
        >
          <FileCheck className="w-3.5 h-3.5 text-sky-400" />
          <span>Bonus Vault</span>
        </button>

        {/* XP / Operator Rank Counter */}
        <button
          onClick={onOpenBadges}
          className="flex items-center gap-1.5 px-2 py-1 sm:px-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 font-mono text-neutral-300 transition-colors cursor-pointer"
          title="View Operator Rank & Badges [HotKey: B]"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
          <span>{userXP} XP</span>
        </button>

        {/* Field Tools Button */}
        <button
          onClick={onOpenTools}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-mono transition-colors"
          title="Open CVSS, Reverse Shell, Hash & Subnet Tools [HotKey: F]"
        >
          <Wrench className="w-3.5 h-3.5 text-emerald-400" />
          <span>Field Tools</span>
        </button>

        {/* Certificate Button */}
        <button
          onClick={onOpenCertificate}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-mono transition-colors"
          title="View Certificate of Completion"
        >
          <Award className="w-3.5 h-3.5 text-sky-400" />
          <span>Certificate</span>
        </button>

        {/* AI Mentor Button */}
        <button
          onClick={onOpenMentor}
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-mono transition-colors"
          title="Open AI Security Mentor [HotKey: M]"
        >
          <Bot className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">AI Mentor</span>
        </button>

        {/* Terminal Quick Button */}
        <button
          onClick={onOpenTerminal}
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-mono transition-colors"
          title="Open Kali Lab Sandbox [HotKey: T]"
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Lab Terminal</span>
        </button>

        {/* Audio FX Mute / Unmute Toggle */}
        <button
          onClick={handleToggleAudio}
          className={`p-1.5 rounded-lg border transition-colors ${
            audioEnabled
              ? 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-emerald-400 hover:text-emerald-300'
              : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-500 hover:text-neutral-300'
          }`}
          title={audioEnabled ? 'Sound FX Enabled (Click to Mute)' : 'Sound FX Muted (Click to Unmute)'}
        >
          {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Shortcuts Key icon */}
        <button
          onClick={onOpenShortcuts}
          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
          title="View Keyboard Shortcuts [HotKey: ?]"
        >
          <Keyboard className="w-3.5 h-3.5" />
        </button>

        {/* Pro Status or Upgrade Button */}
        {isPro ? (
          <div className="flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span className="hidden sm:inline">PRO ACTIVE</span>
            <span className="sm:hidden">PRO</span>
          </div>
        ) : (
          <button
            onClick={onOpenUpgrade}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs tracking-wide shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Upgrade ($49)</span>
            <span className="sm:hidden">PRO</span>
          </button>
        )}
      </div>
    </header>
  );
};

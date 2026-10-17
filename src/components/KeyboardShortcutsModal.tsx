import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const SHORTCUTS = [
    { key: '⌘K / Ctrl+K', description: 'Open Universal Command Palette & Quick Search' },
    { key: 'T', description: 'Open Fullscreen Kali Lab Terminal' },
    { key: 'M', description: 'Open AI Cyber Mentor Assistant' },
    { key: 'F', description: 'Open Offensive Security Field Tools (CVSS, Reverse Shells, Subnets)' },
    { key: 'C', description: 'Open Weaponized Command Cheat Sheet (100+ commands)' },
    { key: 'B', description: 'Open Operator Rank, Badges & XP Matrix' },
    { key: 'V', description: 'Open Bonus Resource Vault & Client Templates' },
    { key: 'E', description: 'Open E-Book Publication & Monetization Store' },
    { key: 'J / →', description: 'Navigate to Next Lesson' },
    { key: 'K / ←', description: 'Navigate to Previous Lesson' },
    { key: '? / /', description: 'Show this Keyboard Shortcuts cheat sheet' },
    { key: 'ESC', description: 'Close any open drawer, modal, or overlay' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-neutral-100 font-bold">
            <Keyboard className="w-4 h-4 text-emerald-400" />
            <span>Keyboard Shortcuts & Hotkeys</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="p-5 divide-y divide-neutral-900 space-y-2">
          {SHORTCUTS.map((s) => (
            <div key={s.key} className="flex items-center justify-between py-1.5 pt-2">
              <span className="text-neutral-300 font-sans">{s.description}</span>
              <kbd className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-emerald-400 font-bold shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-3 bg-neutral-900/60 border-t border-neutral-800 text-[11px] text-neutral-500 text-center">
          Press any hotkey anywhere in the workspace for instant access.
        </div>
      </div>
    </div>
  );
};

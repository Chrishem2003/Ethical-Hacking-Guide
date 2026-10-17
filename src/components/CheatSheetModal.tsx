import React, { useState } from 'react';
import {
  CHEAT_SHEET_CATEGORIES,
  CHEAT_SHEET_COMMANDS,
  CheatSheetCommand,
} from '../data/cheatSheetData';
import {
  X,
  Search,
  Copy,
  Check,
  Terminal,
  Bookmark,
  FileCode,
  Sparkles,
} from 'lucide-react';

interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToTerminal?: (cmd: string) => void;
}

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({
  isOpen,
  onClose,
  onSendToTerminal,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCommands = CHEAT_SHEET_COMMANDS.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      item.command.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.flagsExplained?.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-5xl h-[90vh] bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  HACKFORGE WEAPONIZED REFERENCE
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400">
                  {filteredCommands.length} Commands
                </span>
              </div>
              <h2 className="text-base font-bold text-neutral-100">
                Offensive Security Command & Syntax Cheat Sheet
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 bg-neutral-900/50 border-b border-neutral-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 100+ commands, flags, tools (e.g. nmap, privesc, hashcat, kerberoast)..."
              className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 font-mono text-xs focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 text-xs font-mono"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
            {CHEAT_SHEET_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white font-semibold shadow'
                    : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Command List Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 font-mono text-xs">
              No commands matched &quot;{search}&quot;. Try searching for &quot;nmap&quot;, &quot;privesc&quot;, or &quot;ssh&quot;.
            </div>
          ) : (
            filteredCommands.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 space-y-2.5 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1 flex-1 min-w-[240px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-neutral-800 text-emerald-400">
                        {item.category.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-200 font-medium">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {onSendToTerminal && (
                      <button
                        onClick={() => {
                          onSendToTerminal(item.command);
                          onClose();
                        }}
                        className="px-2.5 py-1 text-xs font-mono rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1 transition-colors"
                        title="Send to Lab Sandbox Terminal"
                      >
                        <Terminal className="w-3 h-3 text-emerald-400" />
                        <span className="hidden sm:inline">Run in Lab</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleCopy(item.command, item.id)}
                      className="px-2.5 py-1 text-xs font-mono rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 flex items-center gap-1 transition-colors"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Code Box */}
                <div className="p-2.5 rounded-lg bg-black font-mono text-xs text-emerald-300 select-all overflow-x-auto border border-neutral-950">
                  {item.command}
                </div>

                {/* Flags Breakdown */}
                {item.flagsExplained && (
                  <div className="text-[11px] font-mono text-neutral-500 leading-relaxed border-t border-neutral-800/60 pt-2">
                    <span className="text-neutral-400 font-semibold">Flags breakdown:</span> {item.flagsExplained}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

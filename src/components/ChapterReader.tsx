import React, { useState } from 'react';
import { Chapter, Appendix } from '../data/bookData';
import { AudioNarrationPlayer } from './AudioNarrationPlayer';
import {
  Copy,
  Check,
  Play,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Clock,
  Sparkles,
  Terminal,
  Shield,
  AlertTriangle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Type
} from 'lucide-react';

interface ChapterReaderProps {
  chapter: Chapter | null;
  appendix: Appendix | null;
  isCompleted: boolean;
  isBookmarked: boolean;
  onToggleComplete: () => void;
  onToggleBookmark: () => void;
  onOpenQuiz: () => void;
  onSendToTerminal: (command: string) => void;
  onNavigateNext: () => void;
  onNavigatePrev: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const ChapterReader: React.FC<ChapterReaderProps> = ({
  chapter,
  appendix,
  isCompleted,
  isBookmarked,
  onToggleComplete,
  onToggleBookmark,
  onOpenQuiz,
  onSendToTerminal,
  onNavigateNext,
  onNavigatePrev,
  hasPrev,
  hasNext,
}) => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const fontSizeClass =
    fontSize === 'xl' ? 'text-lg sm:text-xl' : fontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base';

  // If viewing an Appendix
  if (appendix) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 max-w-4xl mx-auto space-y-8 select-text">
        <div className="space-y-3 border-b border-neutral-800 pb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              Appendix {appendix.letter}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight">
            {appendix.title}
          </h1>
          <p className="text-neutral-400 text-sm leading-relaxed">{appendix.description}</p>
        </div>

        {/* Appendix Cheat Sheet Categories if available */}
        {appendix.cheatData ? (
          <div className="space-y-8">
            {appendix.cheatData.map((cat, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-lg font-bold text-neutral-200 border-l-2 border-emerald-500 pl-3">
                  {cat.category}
                </h3>
                <div className="space-y-3">
                  {cat.commands.map((cmd, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2 group hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <code className="text-xs sm:text-sm font-mono text-emerald-400 font-semibold break-all">
                          {cmd.syntax}
                        </code>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => onSendToTerminal(cmd.syntax)}
                            className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono flex items-center gap-1 transition-colors"
                            title="Run in Kali Simulator"
                          >
                            <Terminal className="w-3 h-3 text-emerald-400" />
                            <span className="hidden sm:inline">Simulate</span>
                          </button>
                          <button
                            onClick={() => handleCopyCode(cmd.syntax, `app-${idx}-${cIdx}`)}
                            className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors"
                            title="Copy Syntax"
                          >
                            {copiedSnippet === `app-${idx}-${cIdx}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-400">{cmd.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 whitespace-pre-wrap font-sans text-sm text-neutral-200 leading-relaxed">
            {appendix.content}
          </div>
        )}
      </div>
    );
  }

  // If no chapter selected
  if (!chapter) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center text-neutral-400">
        Select a chapter from the syllabus on the left to begin reading.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 max-w-4xl mx-auto space-y-8 select-text">
      {/* Chapter Header Card */}
      <div className="space-y-4 border-b border-neutral-800 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-semibold uppercase">{chapter.partTitle}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              {chapter.durationMinutes} min read
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Font size picker */}
            <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-0.5 text-xs font-mono rounded ${
                  fontSize === 'normal' ? 'bg-neutral-800 text-neutral-100' : 'text-neutral-500'
                }`}
                title="Default text size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-0.5 text-xs font-mono rounded ${
                  fontSize === 'large' ? 'bg-neutral-800 text-neutral-100' : 'text-neutral-500'
                }`}
                title="Large text size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xl')}
                className={`px-2 py-0.5 text-xs font-mono rounded ${
                  fontSize === 'xl' ? 'bg-neutral-800 text-neutral-100' : 'text-neutral-500'
                }`}
                title="Extra large text size"
              >
                A++
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={onToggleBookmark}
              className={`p-2 rounded-lg border transition-colors ${
                isBookmarked
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Chapter'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Mark complete toggle */}
            <button
              onClick={onToggleComplete}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
                isCompleted
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">{isCompleted ? 'Completed' : 'Mark Complete'}</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight leading-tight">
            Chapter {chapter.chapterNumber}: {chapter.title}
          </h1>
          <p className="text-base sm:text-lg text-emerald-400 font-medium">{chapter.subtitle}</p>
        </div>

        {/* Audio Narration Bar */}
        <div className="pt-2">
          <AudioNarrationPlayer
            title={chapter.title}
            textToRead={`${chapter.overview} Key learning objectives: ${chapter.keyLearningPoints.join('. ')}`}
            chapterNumber={chapter.chapterNumber}
          />
        </div>
      </div>

      {/* Chapter Overview & Objectives */}
      <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-4">
        <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Chapter Overview
        </h3>
        <p className={`${fontSizeClass} text-neutral-300 leading-relaxed`}>{chapter.overview}</p>

        <div className="pt-3 border-t border-neutral-800/80">
          <h4 className="text-xs font-mono font-semibold text-neutral-400 mb-2">Key Learning Objectives:</h4>
          <ul className="space-y-1.5 text-xs sm:text-sm text-neutral-300">
            {chapter.keyLearningPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Chapter Content Sections */}
      <div className="space-y-8">
        {chapter.sections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 border-l-3 border-emerald-500 pl-3">
              {sec.title}
            </h2>

            <div className={`${fontSizeClass} text-neutral-300 leading-relaxed whitespace-pre-line space-y-4`}>
              {sec.content}
            </div>

            {/* Callout box */}
            {sec.callout && (
              <div
                className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed flex items-start gap-3 ${
                  sec.callout.type === 'tip'
                    ? 'bg-sky-950/30 border-sky-800/60 text-sky-200'
                    : sec.callout.type === 'warning'
                    ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                    : sec.callout.type === 'legal'
                    ? 'bg-red-950/30 border-red-800/60 text-red-200'
                    : 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                }`}
              >
                {sec.callout.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                ) : sec.callout.type === 'legal' ? (
                  <Shield className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                ) : (
                  <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold uppercase tracking-wider block text-[11px] mb-1 font-mono">
                    {sec.callout.type === 'legal'
                      ? 'Legal & Ethical Notice'
                      : sec.callout.type === 'warning'
                      ? 'Warning & OPSEC Precaution'
                      : 'Pro Tip from Chrishem'}
                  </span>
                  {sec.callout.text}
                </div>
              </div>
            )}

            {/* Code Snippets */}
            {sec.codeSnippets &&
              sec.codeSnippets.map((snip, snIdx) => (
                <div
                  key={snIdx}
                  className="rounded-xl bg-[#090b10] border border-neutral-800 overflow-hidden shadow-lg"
                >
                  <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/90 border-b border-neutral-800 text-xs font-mono">
                    <span className="text-neutral-400">{snip.filename || `${snip.language} snippet`}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSendToTerminal(snip.code.split('\n')[0].replace(/^#.*/, ''))}
                        className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1 transition-colors"
                        title="Send snippet to Terminal Simulator"
                      >
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Send to Kali</span>
                      </button>
                      <button
                        onClick={() => handleCopyCode(snip.code, `snip-${sIdx}-${snIdx}`)}
                        className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1 transition-colors"
                        title="Copy code"
                      >
                        {copiedSnippet === `snip-${sIdx}-${snIdx}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <pre className="p-4 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
                    {snip.code}
                  </pre>
                  {snip.explanation && (
                    <div className="px-4 py-2 bg-neutral-950 text-neutral-400 text-xs border-t border-neutral-800/80">
                      💡 {snip.explanation}
                    </div>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Hands-On Lab Walkthrough Box */}
      <div className="p-6 rounded-2xl bg-neutral-900 border-2 border-emerald-500/40 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
              Hands-On Practical Lab
            </span>
            <h3 className="text-xl font-bold text-neutral-100">{chapter.handsOnLab.labTitle}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Terminal className="w-5 h-5" />
          </div>
        </div>

        <div className="text-xs sm:text-sm text-neutral-300">
          <strong className="text-neutral-100 font-semibold">Objective: </strong>
          {chapter.handsOnLab.objective}
        </div>

        {/* Steps */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono font-semibold text-neutral-400 uppercase">Preparation Steps:</h4>
          <ol className="list-decimal list-inside space-y-1 text-xs text-neutral-300 pl-1">
            {chapter.handsOnLab.setupSteps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>

        {/* Lab Commands */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-mono font-semibold text-neutral-400 uppercase">Executable Lab Commands:</h4>
          {chapter.handsOnLab.commands.map((cmd, cIdx) => (
            <div key={cIdx} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-neutral-400 font-medium">{cmd.desc}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSendToTerminal(cmd.cmd.split('\n')[0])}
                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono flex items-center gap-1 shadow-sm transition-all"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run in Simulator</span>
                  </button>
                  <button
                    onClick={() => handleCopyCode(cmd.cmd, `lab-${cIdx}`)}
                    className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors"
                  >
                    {copiedSnippet === `lab-${cIdx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <pre className="p-3 rounded-lg bg-neutral-900 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre">
                {cmd.cmd}
              </pre>
              {cmd.sampleOutput && (
                <div className="text-[11px] font-mono text-neutral-400 bg-neutral-900/60 p-2.5 rounded border border-neutral-800/80">
                  <div className="text-neutral-500 mb-1 text-[10px] uppercase font-bold">Sample Expected Output:</div>
                  <pre className="whitespace-pre overflow-x-auto">{cmd.sampleOutput}</pre>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-xs text-emerald-300">
          <strong className="font-semibold">Expected Lab Outcome: </strong>
          {chapter.handsOnLab.expectedOutcome}
        </div>
      </div>

      {/* Verified External Videos & Official Platform Links */}
      {chapter.verifiedVideos && chapter.verifiedVideos.length > 0 && (
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 text-red-400 fill-current" /> Verified Video Resources & Walkthroughs
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {chapter.verifiedVideos.map((vid, vIdx) => (
              <a
                key={vIdx}
                href={vid.url}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-neutral-700 transition-all flex items-start justify-between group"
              >
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-neutral-200 group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {vid.title}
                  </div>
                  <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                    <span>{vid.platform}</span>
                    {vid.duration && <span>• {vid.duration}</span>}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300 shrink-0 ml-2 mt-0.5" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Quiz & Badge Action Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-neutral-900 to-neutral-950 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs font-mono text-emerald-400 font-semibold uppercase">
            Test Your Knowledge • Earn {chapter.badgeName} Badge
          </div>
          <div className="text-lg font-bold text-neutral-100">
            Ready to validate what you learned in Chapter {chapter.chapterNumber}?
          </div>
          <p className="text-xs text-neutral-400">
            Take the 2-question technical knowledge check to claim +{chapter.xpReward} XP.
          </p>
        </div>

        <button
          onClick={onOpenQuiz}
          className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Start Knowledge Check</span>
        </button>
      </div>

      {/* Bottom Chapter Navigation Bar */}
      <div className="flex items-center justify-between pt-6 border-t border-neutral-800">
        <button
          onClick={onNavigatePrev}
          disabled={!hasPrev}
          className="px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-20 text-neutral-300 text-xs font-medium flex items-center gap-2 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Chapter</span>
        </button>

        <button
          onClick={onNavigateNext}
          disabled={!hasNext}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <span>Next Chapter</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

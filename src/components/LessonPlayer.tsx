import React, { useState } from 'react';
import { Lesson } from '../data/curriculumData';
import { VideoEmbed } from './VideoEmbed';
import { LabTerminal } from './LabTerminal';
import { QuizCard } from './QuizCard';
import { AudioNarrationPlayer } from './AudioNarrationPlayer';
import { MethodologyNotebook } from './tools/MethodologyNotebook';
import {
  BookOpen,
  Terminal,
  HelpCircle,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lock,
  Clock,
  ShieldAlert,
  Play,
  FileEdit,
  Wrench
} from 'lucide-react';
import { TargetMachineControl } from './TargetMachineControl';
import { sound } from '../utils/soundEffects';

interface LessonPlayerProps {
  lesson: Lesson;
  isCompleted: boolean;
  onPassLesson: () => void;
  onNavigateNext: () => void;
  onNavigatePrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  onTriggerUpgrade: (lessonTitle?: string) => void;
  isPro: boolean;
  onOpenTools: () => void;
  onSendToTerminal?: (cmd: string) => void;
  onFlagCaptured?: (flag: string) => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lesson,
  isCompleted,
  onPassLesson,
  onNavigateNext,
  onNavigatePrev,
  hasNext,
  hasPrev,
  onTriggerUpgrade,
  isPro,
  onOpenTools,
  onSendToTerminal,
  onFlagCaptured,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'terminal' | 'quiz' | 'notes'>('content');
  const [activePresetCmd, setActivePresetCmd] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    sound.playClick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTabChange = (tab: 'content' | 'terminal' | 'quiz' | 'notes') => {
    setActiveTab(tab);
    sound.playClick();
  };

  const handleRunInLab = (cmd: string) => {
    setActivePresetCmd(cmd);
    setActiveTab('terminal');
    sound.playCommandRun();
    if (onSendToTerminal) {
      onSendToTerminal(cmd);
    }
  };

  // Render markdown with styled blocks
  const renderFormattedMarkdown = (markdown: string) => {
    const lines = markdown.split('\n');
    const elements: React.ReactNode[] = [];
    let currentCodeBlock: string[] = [];
    let inCode = false;
    let codeLanguage = '';

    lines.forEach((line, index) => {
      if (line.startsWith('```') && !inCode) {
        inCode = true;
        codeLanguage = line.replace('```', '').trim();
        currentCodeBlock = [];
        return;
      }

      if (line.startsWith('```') && inCode) {
        inCode = false;
        const codeContent = currentCodeBlock.join('\n');
        const blockId = `code-${index}`;

        // Don't render the raw quiz json block in the text body because QuizCard handles it!
        if (codeLanguage === 'quiz') {
          return;
        }

        elements.push(
          <div
            key={blockId}
            className="my-4 rounded-xl bg-[#090b10] border border-neutral-800 overflow-hidden shadow-lg"
          >
            <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800 text-xs font-mono">
              <span className="text-neutral-400">{codeLanguage || 'bash'}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRunInLab(codeContent.split('\n')[0].replace(/^#.*/, ''))}
                  className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1 transition-colors"
                  title="Run command in Lab Terminal"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Run in Lab</span>
                </button>
                <button
                  onClick={() => handleCopy(codeContent, blockId)}
                  className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1 transition-colors"
                  title="Copy snippet"
                >
                  {copiedId === blockId ? (
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
              {codeContent}
            </pre>
          </div>
        );
        return;
      }

      if (inCode) {
        currentCodeBlock.push(line);
        return;
      }

      if (line.startsWith('> ⚠️')) {
        elements.push(
          <div
            key={`warning-${index}`}
            className="p-4 my-4 rounded-xl bg-amber-950/30 border border-amber-800/60 text-amber-200 text-xs sm:text-sm font-mono flex items-start gap-3"
          >
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>{line.replace('> ', '')}</div>
          </div>
        );
        return;
      }

      if (line.startsWith('## ')) {
        elements.push(
          <h2
            key={`h2-${index}`}
            className="text-lg sm:text-xl font-bold text-neutral-100 mt-6 mb-3 border-l-3 border-emerald-500 pl-3"
          >
            {line.replace('## ', '')}
          </h2>
        );
        return;
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h3
            key={`h3-${index}`}
            className="text-sm sm:text-base font-semibold text-neutral-200 mt-4 mb-2"
          >
            {line.replace('### ', '')}
          </h3>
        );
        return;
      }

      if (line.startsWith('- ')) {
        elements.push(
          <li key={`li-${index}`} className="text-xs sm:text-sm text-neutral-300 ml-4 list-disc my-1">
            {line.replace('- ', '')}
          </li>
        );
        return;
      }

      if (line.trim().length > 0) {
        elements.push(
          <p key={`p-${index}`} className="text-xs sm:text-sm text-neutral-300 leading-relaxed my-2.5">
            {line}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 max-w-5xl mx-auto space-y-6 select-text">
      {/* Lesson Header */}
      <div className="space-y-4 border-b border-neutral-800 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold uppercase">{lesson.partTitle}</span>
            <span>•</span>
            <span className="text-neutral-400">{lesson.module}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-neutral-500">
              <Clock className="w-3.5 h-3.5" />
              {lesson.durationMinutes} mins
            </span>
            {lesson.lab_image && (
              <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-emerald-400 font-mono text-[11px]">
                Target: {lesson.lab_image}
              </span>
            )}
            <button
              onClick={onOpenTools}
              className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-mono flex items-center gap-1 transition-colors"
              title="Open CVSS, Reverse Shell & Hash tools"
            >
              <Wrench className="w-3 h-3 text-emerald-400" />
              <span>Field Tools</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight leading-tight">
          {lesson.title}
        </h1>

        {/* Audio Narration Player */}
        <div className="pt-1">
          <AudioNarrationPlayer
            title={lesson.title}
            textToRead={lesson.content_md}
            chapterNumber={lesson.order}
          />
        </div>

        {/* Lesson View Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-800/80">
          <button
            onClick={() => handleTabChange('content')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'content'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Theory & Walkthrough</span>
          </button>

          <button
            onClick={() => handleTabChange('terminal')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'terminal'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Live Lab Terminal</span>
          </button>

          <button
            onClick={() => handleTabChange('quiz')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'quiz'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Knowledge Gate ({lesson.quiz.length} MCQ)</span>
          </button>

          <button
            onClick={() => handleTabChange('notes')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'notes'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Methodology Notes</span>
          </button>
        </div>
      </div>

      {/* Video Briefing Embed */}
      {lesson.video_url && activeTab === 'content' && (
        <VideoEmbed url={lesson.video_url} title={lesson.title} />
      )}

      {/* Target Machine Control Center (rendered when lab_image exists or when on terminal tab) */}
      {(lesson.lab_image || activeTab === 'terminal') && (
        <TargetMachineControl
          labImage={lesson.lab_image}
          lessonTitle={lesson.title}
          onSendToTerminal={handleRunInLab}
          onFlagCaptured={onFlagCaptured}
        />
      )}

      {/* TAB 1: CONTENT & THEORY */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-lg">
            {renderFormattedMarkdown(lesson.content_md)}
          </div>

          {/* Quick trigger to open lab terminal */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-950 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-neutral-100">Ready to test these commands?</div>
              <div className="text-xs text-neutral-400">
                Launch the isolated container sandbox to practice hands-on.
              </div>
            </div>
            <button
              onClick={() => handleTabChange('terminal')}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Launch Lab Terminal</span>
            </button>
          </div>

          {/* Quiz Card at bottom of content */}
          <QuizCard
            quiz={lesson.quiz}
            lessonTitle={lesson.title}
            isCompleted={isCompleted}
            onPassLesson={onPassLesson}
          />
        </div>
      )}

      {/* TAB 2: LIVE TERMINAL LAB */}
      {activeTab === 'terminal' && (
        <div className="h-[620px] w-full">
          <LabTerminal
            labImage={lesson.lab_image}
            lessonTitle={lesson.title}
            presetCommand={activePresetCmd}
            onFlagCaptured={onFlagCaptured}
          />
        </div>
      )}

      {/* TAB 3: QUIZ CARD */}
      {activeTab === 'quiz' && (
        <QuizCard
          quiz={lesson.quiz}
          lessonTitle={lesson.title}
          isCompleted={isCompleted}
          onPassLesson={onPassLesson}
        />
      )}

      {/* TAB 4: METHODOLOGY NOTES */}
      {activeTab === 'notes' && (
        <MethodologyNotebook
          lessonSlug={lesson.slug}
          lessonTitle={lesson.title}
        />
      )}

      {/* Next/Prev Lesson Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-neutral-800">
        <button
          onClick={onNavigatePrev}
          disabled={!hasPrev}
          className="px-4 py-2 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-20 text-neutral-300 text-xs font-medium flex items-center gap-2 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Lesson</span>
        </button>

        <button
          onClick={onNavigateNext}
          disabled={!hasNext}
          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <span>Next Lesson</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

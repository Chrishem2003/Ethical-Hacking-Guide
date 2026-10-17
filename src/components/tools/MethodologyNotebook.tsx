import React, { useState, useEffect } from 'react';
import { FileEdit, Save, Download, Check, Sparkles, Trash2 } from 'lucide-react';

interface MethodologyNotebookProps {
  lessonSlug: string;
  lessonTitle: string;
}

export const MethodologyNotebook: React.FC<MethodologyNotebookProps> = ({
  lessonSlug,
  lessonTitle,
}) => {
  const [noteContent, setNoteContent] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`hackforge_note_${lessonSlug}`);
      if (stored) {
        setNoteContent(stored);
      } else {
        setNoteContent(
          `# Pentest Notes: ${lessonTitle}\nDate: ${new Date().toLocaleDateString()}\n\n## 1. Discovered Services & Ports\n- \n\n## 2. Exploitation Proof of Concept\n- \n\n## 3. Remediation Action Items\n- \n`
        );
      }
    } catch {
      // fallback
    }
  }, [lessonSlug, lessonTitle]);

  const handleSave = () => {
    try {
      localStorage.setItem(`hackforge_note_${lessonSlug}`, noteContent);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleExport = () => {
    const blob = new Blob([noteContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pentest_notes_${lessonSlug}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-2">
          <FileEdit className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            Methodology Lab Notebook
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleSave}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-colors"
          >
            {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Saved locally' : 'Save Notes'}</span>
          </button>
          <button
            onClick={handleExport}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export (.md)</span>
          </button>
        </div>
      </div>

      <textarea
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        rows={12}
        placeholder="Record target IPs, credential hashes, and command outputs for this lesson..."
        className="w-full bg-[#090b10] border border-neutral-800 rounded-xl p-4 font-mono text-xs text-neutral-200 focus:outline-none focus:border-emerald-500 leading-relaxed resize-y"
      />
      <div className="text-[11px] text-neutral-500 flex items-center justify-between font-mono">
        <span>Automatically saved to local storage for this lesson.</span>
        <span>{noteContent.length} characters</span>
      </div>
    </div>
  );
};

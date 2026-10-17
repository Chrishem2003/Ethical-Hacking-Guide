import React, { useState } from 'react';
import { BOOK_METADATA, CHAPTERS, APPENDICES } from '../data/bookData';
import {
  Download,
  Printer,
  Award,
  CheckCircle,
  Copy,
  Check,
  DollarSign,
  ShieldCheck,
  BookOpen,
  Sparkles,
  ExternalLink,
  FileText,
  Lock,
  Flame,
  Star,
  Users
} from 'lucide-react';

interface SalesAndMonetizationHubProps {
  userXP: number;
  completedChapters: string[];
  onClose?: () => void;
}

export const SalesAndMonetizationHub: React.FC<SalesAndMonetizationHubProps> = ({
  userXP,
  completedChapters,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'store' | 'export' | 'certificate' | 'creator'>('store');
  const [studentName, setStudentName] = useState('Alex Rivera');
  const [certGenerated, setCertGenerated] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  // Generate complete book markdown
  const generateFullBookMarkdown = () => {
    let md = `# ${BOOK_METADATA.title}\n`;
    md += `## ${BOOK_METADATA.subtitle}\n`;
    md += `**Author:** ${BOOK_METADATA.author} | **Edition:** ${BOOK_METADATA.edition} (${BOOK_METADATA.releaseYear})\n\n`;
    md += `---\n\n`;
    md += `## Table of Contents\n`;
    CHAPTERS.forEach((ch) => {
      md += `- **Chapter ${ch.chapterNumber}:** ${ch.title} — *${ch.subtitle}*\n`;
    });
    md += `\n### Appendices\n`;
    APPENDICES.forEach((app) => {
      md += `- **Appendix ${app.letter}:** ${app.title}\n`;
    });
    md += `\n---\n\n`;

    CHAPTERS.forEach((ch) => {
      md += `\n# Chapter ${ch.chapterNumber}: ${ch.title}\n`;
      md += `### ${ch.subtitle}\n\n`;
      md += `**Part:** ${ch.partTitle} | **Estimated Duration:** ${ch.durationMinutes} minutes | **Badge:** ${ch.badgeName}\n\n`;
      md += `#### Overview\n${ch.overview}\n\n`;
      md += `#### Key Learning Objectives\n`;
      ch.keyLearningPoints.forEach((pt) => {
        md += `- ${pt}\n`;
      });
      md += `\n`;

      ch.sections.forEach((sec) => {
        md += `\n## ${sec.title}\n\n${sec.content}\n\n`;
        if (sec.callout) {
          md += `> **[${sec.callout.type.toUpperCase()}]** ${sec.callout.text}\n\n`;
        }
        if (sec.codeSnippets) {
          sec.codeSnippets.forEach((snippet) => {
            md += `\`\`\`${snippet.language}\n// ${snippet.filename || 'Snippet'}\n${snippet.code}\n\`\`\`\n\n`;
            if (snippet.explanation) {
              md += `*Note: ${snippet.explanation}*\n\n`;
            }
          });
        }
      });

      md += `\n### Hands-On Lab: ${ch.handsOnLab.labTitle}\n`;
      md += `**Objective:** ${ch.handsOnLab.objective}\n\n`;
      md += `**Setup Steps:**\n`;
      ch.handsOnLab.setupSteps.forEach((s) => {
        md += `1. ${s}\n`;
      });
      md += `\n**Commands:**\n`;
      ch.handsOnLab.commands.forEach((c) => {
        md += `\`\`\`bash\n# ${c.desc}\n${c.cmd}\n\`\`\`\n`;
        if (c.sampleOutput) {
          md += `*Expected Output:*\n\`\`\`text\n${c.sampleOutput}\n\`\`\`\n\n`;
        }
      });

      md += `\n---\n`;
    });

    md += `\n# APPENDICES\n\n`;
    APPENDICES.forEach((app) => {
      md += `\n## Appendix ${app.letter}: ${app.title}\n\n${app.content}\n\n`;
      if (app.cheatData) {
        app.cheatData.forEach((cat) => {
          md += `### ${cat.category}\n`;
          cat.commands.forEach((cmd) => {
            md += `- \`${cmd.syntax}\` : ${cmd.description}\n`;
          });
          md += `\n`;
        });
      }
    });

    return md;
  };

  const handleDownloadMarkdown = () => {
    const md = generateFullBookMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `The_Complete_Ethical_Hacker_by_Chrishem.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Banner Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-neutral-950 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
              Chrishem Digital Products Hub
            </span>
          </div>
          <h2 className="text-lg font-bold text-neutral-100">
            Monetization, Export & Certificate Center
          </h2>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs">
          <button
            onClick={() => setActiveTab('store')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'store'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Product Offer ($49)
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'export'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Export & PDF
          </button>
          <button
            onClick={() => setActiveTab('certificate')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'certificate'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Certificate
          </button>
          <button
            onClick={() => setActiveTab('creator')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'creator'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Chrishem Seller Tools
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* TAB 1: PRODUCT STOREFRONT / SALES PAGE */}
        {activeTab === 'store' && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Pitch */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-emerald-950/40 border border-emerald-500/30 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <ShieldCheck className="w-64 h-64 text-emerald-400" />
              </div>

              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                  <Flame className="w-3.5 h-3.5 fill-current text-amber-400" />
                  HIGH-TICKET DIGITAL E-BOOK PRODUCT
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight leading-tight">
                  {BOOK_METADATA.title}
                </h1>
                <p className="text-base text-neutral-300 leading-relaxed">
                  {BOOK_METADATA.subtitle}
                </p>
                <p className="text-xs text-neutral-400 font-mono">
                  By <span className="text-emerald-400 font-bold">{BOOK_METADATA.author}</span> • {BOOK_METADATA.edition}
                </p>

                {/* Proof badges */}
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-300">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800/80 border border-neutral-700/60">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>24 Deep Chapters</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800/80 border border-neutral-700/60">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Virtual Kali Terminal</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800/80 border border-neutral-700/60">
                    <Award className="w-3.5 h-3.5 text-sky-400" />
                    <span>Accredited Certificate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Standard Tier */}
              <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                      Standard Package
                    </span>
                    <h3 className="text-xl font-bold text-neutral-100">Self-Paced Reader</h3>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-neutral-100">$49</span>
                    <span className="text-xs text-neutral-400">USD (One-time payment)</span>
                  </div>

                  <p className="text-xs text-neutral-400">
                    Everything you need to master offensive security fundamentals, pass exams, and build hands-on skills.
                  </p>

                  <ul className="space-y-2.5 text-xs text-neutral-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Complete 24 Chapter Interactive Digital E-Book</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Interactive Virtual Terminal & Kali Tool Simulator</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>All 5 Appendices (Nmap, Burp, Msfvenom Cheat Sheets)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Audio Narration Player for Hands-Free Learning</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Full Markdown & Printable PDF Downloads</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setActiveTab('export')}
                  className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-semibold text-xs tracking-wide transition-colors"
                >
                  Access Digital Package Now
                </button>
              </div>

              {/* VIP Masterclass Tier */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border-2 border-emerald-500/70 shadow-2xl space-y-5 flex flex-col justify-between">
                <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-emerald-500 text-neutral-950 font-bold text-[10px] uppercase tracking-wider">
                  MOST POPULAR • BEST VALUE
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                      VIP Career & Freelance Bundle
                    </span>
                    <h3 className="text-xl font-bold text-neutral-100">Full Pentester Masterclass</h3>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-neutral-100">$99</span>
                    <span className="text-sm text-neutral-500 line-through">$199</span>
                    <span className="text-xs text-emerald-400 font-semibold">(50% Off Launch)</span>
                  </div>

                  <p className="text-xs text-neutral-400">
                    The complete roadmap plus 1-on-1 AI Mentor access, freelance contract templates, and accredited certification.
                  </p>

                  <ul className="space-y-2.5 text-xs text-neutral-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-semibold text-neutral-100">Everything in Standard Package</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>24/7 AI Cyber Mentor (Chrishem's Knowledge Engine)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Legal SOW & ROE Pentest Contract Templates for Freelancing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Accredited Certificate of Completion Signed by Chrishem</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>90-Day Step-by-Step CTF Grind & Exam Planner</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setActiveTab('certificate')}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Unlock Complete Masterclass & Certificate
                </button>
              </div>
            </div>

            {/* Testimonials / Social Proof */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
              <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" /> What Security Professionals Say About Chrishem's Guide
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs space-y-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-neutral-300 italic">
                    "Chrishem's e-book cut through the noise. The Nmap, Active Directory, and PrivEsc chapters are clearer than $2,000 corporate bootcamps. Passed my eJPT on the first try!"
                  </p>
                  <span className="text-[11px] font-semibold text-neutral-400">
                    — Marcus T., Associate Security Analyst
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs space-y-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-neutral-300 italic">
                    "The legal ROE template in Appendix D landed me my first $6,500 freelance web assessment. The interactive terminal is pure genius."
                  </p>
                  <span className="text-[11px] font-semibold text-neutral-400">
                    — Sarah K., Independent Pentester
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EXPORT ENGINE (PRINT & MARKDOWN) */}
        {activeTab === 'export' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
              <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-400" />
                Publication-Ready E-Book Exporter
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Download the complete 24-chapter masterclass + 5 appendices in standard formats. You can load this onto Kindle, Remarkable, iPad, convert via Pandoc to EPUB/PDF, or print physical hardcopy manuals.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  onClick={handleDownloadMarkdown}
                  className="p-5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/50 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="w-6 h-6 text-emerald-400" />
                    <Download className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <div className="font-semibold text-sm text-neutral-100">
                    Full Book Markdown (.md)
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    Complete book with all 24 chapters, lab scripts, and ASCII diagrams in clean GitHub Flavored Markdown.
                  </div>
                </button>

                <button
                  onClick={handlePrint}
                  className="p-5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/50 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Printer className="w-6 h-6 text-sky-400" />
                    <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-sky-400 transition-colors" />
                  </div>
                  <div className="font-semibold text-sm text-neutral-100">
                    Print / Save as Clean PDF
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    Opens browser print dialog with optimized reading typography, chapter breaks, and high-contrast code.
                  </div>
                </button>
              </div>
            </div>

            {/* Quick SOW / ROE Template Export */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
              <h4 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Appendix D: Legal Rules of Engagement Contract Deliverable
              </h4>
              <p className="text-xs text-neutral-400">
                Instantly copy the freelance engagement letter to paste into Google Docs or Word for your real pentesting clients:
              </p>
              <div className="p-4 rounded-xl bg-neutral-900 font-mono text-xs text-neutral-300 max-h-48 overflow-y-auto border border-neutral-800">
                {APPENDICES[3]?.content}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(APPENDICES[3]?.content || '');
                  setCopiedMarkdown(true);
                  setTimeout(() => setCopiedMarkdown(false), 2000);
                }}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-200 flex items-center gap-2 transition-colors"
              >
                {copiedMarkdown ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedMarkdown ? 'Copied Contract to Clipboard' : 'Copy Legal ROE Contract'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: CERTIFICATE GENERATOR */}
        {activeTab === 'certificate' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  Accreditation & Proof of Skill
                </span>
                <h3 className="text-lg font-bold text-neutral-100">
                  Certificate of Completion in Offensive Security
                </h3>
              </div>
              <p className="text-xs text-neutral-400">
                Enter your name to generate your personalized credential signed by author Chrishem. You can download or print this to showcase on LinkedIn or your portfolio.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your full name..."
                  className="w-full sm:w-80 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => setCertGenerated(true)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shrink-0"
                >
                  Generate Official Certificate
                </button>
              </div>
            </div>

            {/* Rendered Certificate Card */}
            <div className="relative p-8 rounded-2xl bg-[#090b10] border-4 border-double border-emerald-500/50 shadow-2xl text-center space-y-6 overflow-hidden">
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-emerald-500/60" />
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-emerald-500/60" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-emerald-500/60" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-emerald-500/60" />

              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400">
                  CHRISHEM HACKER ACADEMY • OFFENSIVE SECURITY MASTERY
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-wider uppercase font-serif">
                  Certificate of Completion
                </h2>
                <div className="text-xs text-neutral-400 italic">
                  This certifies that the named individual has demonstrated practical competence in
                </div>
              </div>

              <div className="text-lg sm:text-xl font-bold text-emerald-400 tracking-wide">
                THE COMPLETE ETHICAL HACKER: ZERO TO PROFESSIONAL
              </div>

              <div className="py-2 border-b border-neutral-800 max-w-md mx-auto">
                <div className="text-2xl sm:text-3xl font-extrabold text-neutral-100 font-serif">
                  {studentName || 'Student Name'}
                </div>
              </div>

              <p className="text-xs text-neutral-400 max-w-lg mx-auto leading-relaxed">
                Having successfully completed all 24 hands-on lab modules across Network Enumeration, Vulnerability Exploitation, Web Application Testing (OWASP), Privilege Escalation, Active Directory Dominance, and Professional Technical Reporting.
              </p>

              <div className="flex flex-wrap items-center justify-around gap-6 pt-6 border-t border-neutral-900">
                <div className="text-left space-y-1">
                  <div className="text-base font-serif font-bold text-neutral-200">Chrishem</div>
                  <div className="text-[10px] font-mono text-neutral-500 uppercase">
                    Lead Security Assessor & Author
                  </div>
                </div>

                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-8 h-8" />
                </div>

                <div className="text-right space-y-1">
                  <div className="text-xs font-mono text-neutral-300">
                    ID: CHRISHEM-CERT-{Math.abs(studentName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 1024))}
                  </div>
                  <div className="text-[10px] font-mono text-neutral-500">
                    Issued: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handlePrint}
                className="px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Print or Save Certificate as PDF</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: CHRISHEM SELLER & CREATOR BLUEPRINT */}
        {activeTab === 'creator' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono">
                <DollarSign className="w-3.5 h-3.5" />
                HOW TO MAKE PASSIVE INCOME WHILE YOU DO OTHER WORK
              </div>

              <h3 className="text-xl font-bold text-neutral-100">
                Chrishem's Digital Product Monetization Blueprint
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                As the creator, here is how you turn this interactive app and e-book into an automated digital cashflow engine that sells 24/7 on autopilot:
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs space-y-2">
                  <div className="font-bold text-emerald-400 flex items-center gap-2">
                    <span>1. Host & Sell on Gumroad / Lemon Squeezy</span>
                  </div>
                  <p className="text-neutral-300">
                    Export the Markdown / PDF from Tab 2, zip it with the SOW and ROE legal contracts, and create a Gumroad product titled:
                    <strong className="text-neutral-100"> "The Complete Ethical Hacker: Zero to Professional by Chrishem"</strong>. Price it at $49.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs space-y-2">
                  <div className="font-bold text-sky-400 flex items-center gap-2">
                    <span>2. The "Free Part 1 Lead Magnet" Funnel</span>
                  </div>
                  <p className="text-neutral-300">
                    Offer Part 0 & Part 1 (Weeks 1–4) 100% free on LinkedIn and Twitter in exchange for emails. On Day 3, send an automated email sequence offering the remaining 20 Chapters + AI Mentor for $49. At a 3% conversion rate with 1,000 downloads, that's $1,470/month automated.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs space-y-2">
                  <div className="font-bold text-amber-400 flex items-center gap-2">
                    <span>3. High-Ticket Upsell: 1-on-1 Lab Review ($299)</span>
                  </div>
                  <p className="text-neutral-300">
                    Add a checkout upsell for buyers who want their mock penetration test report reviewed directly by Chrishem before they submit it to real clients or take the OSCP exam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

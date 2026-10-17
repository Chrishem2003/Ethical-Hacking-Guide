import React, { useState } from 'react';
import {
  X,
  Printer,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedCount: number;
  totalCount: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  completedCount,
  totalCount,
}) => {
  const [studentName, setStudentName] = useState('Alex Rivera');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const certHash = Math.abs(
    studentName.split('').reduce((acc, c) => acc + c.charCodeAt(0) * 17, 4096)
  ).toString(16).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-950 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-neutral-200">
              HACKFORGE OFFICIAL ACCREDITED CERTIFICATE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-neutral-100">Certificate Credential Configuration</h3>
              <p className="text-xs text-neutral-400">
                Customize your legal name as it should appear on your verified professional credential.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your full name..."
                className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handlePrint}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Certificate View */}
          <div className="relative p-10 rounded-2xl bg-[#090b10] border-4 border-double border-emerald-500/50 shadow-2xl text-center space-y-6 select-text overflow-hidden">
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-emerald-500/60" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-emerald-500/60" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-emerald-500/60" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-emerald-500/60" />

            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-[0.35em] text-emerald-400 font-bold">
                HACKFORGE CYBERSECURITY ACADEMY
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-100 tracking-wider uppercase font-serif">
                Certificate of Practical Mastery
              </h2>
              <div className="text-xs text-neutral-400 italic">
                This certifies that the named candidate has demonstrated hands-on technical competence in
              </div>
            </div>

            <div className="text-xl sm:text-2xl font-bold text-emerald-400 tracking-wide font-mono">
              OFFENSIVE SECURITY & PENETRATION TESTING
            </div>

            <div className="py-2 border-b border-neutral-800 max-w-md mx-auto">
              <div className="text-3xl sm:text-4xl font-extrabold text-neutral-100 font-serif">
                {studentName || 'Student Name'}
              </div>
            </div>

            <p className="text-xs text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Having successfully passed rigorous laboratory examinations across Network Reconnaissance, Vulnerability Identification, Web Application Exploitation, Linux & Windows Privilege Escalation, Active Directory Domain Dominance, and Executive Reporting.
            </p>

            <div className="flex flex-wrap items-center justify-around gap-6 pt-6 border-t border-neutral-900">
              <div className="text-left space-y-1">
                <div className="text-base font-serif font-bold text-neutral-200">Chrishem</div>
                <div className="text-[10px] font-mono text-neutral-500 uppercase">
                  Lead Instructor & Security Assessor
                </div>
              </div>

              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-9 h-9" />
              </div>

              <div className="text-right space-y-1">
                <div className="text-xs font-mono text-neutral-300">
                  ID: HACKFORGE-CERT-{certHash}
                </div>
                <div className="text-[10px] font-mono text-neutral-500">
                  Issued: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

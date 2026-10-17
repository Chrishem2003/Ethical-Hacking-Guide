import React, { useState } from 'react';
import { ShieldAlert, Copy, Check, Info, Calculator, Sparkles } from 'lucide-react';

interface MetricOption {
  value: string;
  label: string;
  score: number;
}

export const CvssCalculator: React.FC = () => {
  const [copied, setCopied] = useState(false);

  // CVSS 3.1 Metrics State
  const [av, setAv] = useState<'N' | 'A' | 'L' | 'P'>('N'); // Attack Vector
  const [ac, setAc] = useState<'L' | 'H'>('L');             // Attack Complexity
  const [pr, setPr] = useState<'N' | 'L' | 'H'>('N');       // Privileges Required
  const [ui, setUi] = useState<'N' | 'R'>('N');             // User Interaction
  const [scope, setScope] = useState<'U' | 'C'>('U');       // Scope
  const [c, setC] = useState<'H' | 'L' | 'N'>('H');         // Confidentiality
  const [i, setI] = useState<'H' | 'L' | 'N'>('H');         // Integrity
  const [a, setA] = useState<'H' | 'L' | 'N'>('H');         // Availability

  // Metric weights
  const AV_WEIGHTS = { N: 0.85, A: 0.62, L: 0.55, P: 0.2 };
  const AC_WEIGHTS = { L: 0.77, H: 0.44 };
  const PR_WEIGHTS = {
    U: { N: 0.85, L: 0.62, H: 0.27 },
    C: { N: 0.85, L: 0.68, H: 0.5 },
  };
  const UI_WEIGHTS = { N: 0.85, R: 0.62 };
  const CIA_WEIGHTS = { H: 0.56, L: 0.22, N: 0 };

  // Calculate CVSS 3.1 Base Score
  const calculateScore = (): { score: number; severity: string; vector: string } => {
    const iss = 1 - (1 - CIA_WEIGHTS[c]) * (1 - CIA_WEIGHTS[i]) * (1 - CIA_WEIGHTS[a]);
    let impact = 0;
    if (scope === 'U') {
      impact = 6.42 * iss;
    } else {
      impact = 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15);
    }

    const exploitability =
      8.22 * AV_WEIGHTS[av] * AC_WEIGHTS[ac] * PR_WEIGHTS[scope][pr] * UI_WEIGHTS[ui];

    let baseScore = 0;
    if (impact <= 0) {
      baseScore = 0;
    } else if (scope === 'U') {
      baseScore = Math.min(Math.ceil((impact + exploitability) * 10) / 10, 10.0);
    } else {
      baseScore = Math.min(Math.ceil(1.08 * (impact + exploitability) * 10) / 10, 10.0);
    }

    let severity = 'None';
    if (baseScore >= 9.0) severity = 'Critical';
    else if (baseScore >= 7.0) severity = 'High';
    else if (baseScore >= 4.0) severity = 'Medium';
    else if (baseScore > 0) severity = 'Low';

    const vector = `CVSS:3.1/AV:${av}/AC:${ac}/PR:${pr}/UI:${ui}/S:${scope}/C:${c}/I:${i}/A:${a}`;
    return { score: baseScore, severity, vector };
  };

  const { score, severity, vector } = calculateScore();

  const handleCopyVector = () => {
    navigator.clipboard.writeText(`${vector} (Score: ${score} ${severity})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityBadgeColor = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'High':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'Low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-neutral-800 text-neutral-400 border-neutral-700';
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Interactive CVSS 3.1 Metric Calculator
            </span>
          </div>
          <h3 className="text-base font-bold text-neutral-100 mt-0.5">
            Real-Time Vulnerability Severity Scoring
          </h3>
        </div>

        {/* Live Score Display */}
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${getSeverityBadgeColor(severity)}`}>
            {severity.toUpperCase()} ({score})
          </div>
          <button
            onClick={handleCopyVector}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Vector' : 'Copy Vector'}</span>
          </button>
        </div>
      </div>

      {/* Vector Bar */}
      <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-xs text-emerald-300 flex items-center justify-between overflow-x-auto">
        <span className="truncate">{vector}</span>
        <span className="text-neutral-500 text-[11px] ml-2 shrink-0">CVSS v3.1 Base Metrics</span>
      </div>

      {/* Metrics Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Attack Vector */}
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
          <span className="font-mono text-neutral-400 font-semibold block text-[11px]">
            Attack Vector (AV)
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { val: 'N', label: 'Network (N)' },
              { val: 'A', label: 'Adjacent (A)' },
              { val: 'L', label: 'Local (L)' },
              { val: 'P', label: 'Physical (P)' },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setAv(opt.val as any)}
                className={`py-1.5 px-2 rounded-lg text-xs font-mono transition-all ${
                  av === opt.val
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Attack Complexity */}
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
          <span className="font-mono text-neutral-400 font-semibold block text-[11px]">
            Attack Complexity (AC)
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { val: 'L', label: 'Low (L)' },
              { val: 'H', label: 'High (H)' },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setAc(opt.val as any)}
                className={`py-1.5 px-2 rounded-lg text-xs font-mono transition-all ${
                  ac === opt.val
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Privileges Required */}
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
          <span className="font-mono text-neutral-400 font-semibold block text-[11px]">
            Privileges Required (PR)
          </span>
          <div className="grid grid-cols-3 gap-1">
            {[
              { val: 'N', label: 'None' },
              { val: 'L', label: 'Low' },
              { val: 'H', label: 'High' },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setPr(opt.val as any)}
                className={`py-1.5 px-1.5 rounded-lg text-xs font-mono transition-all ${
                  pr === opt.val
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scope */}
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
          <span className="font-mono text-neutral-400 font-semibold block text-[11px]">
            Scope (S)
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { val: 'U', label: 'Unchanged (U)' },
              { val: 'C', label: 'Changed (C)' },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setScope(opt.val as any)}
                className={`py-1.5 px-2 rounded-lg text-xs font-mono transition-all ${
                  scope === opt.val
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Confidentiality Impact */}
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
          <span className="font-mono text-neutral-400 font-semibold block text-[11px]">
            Confidentiality (C)
          </span>
          <div className="grid grid-cols-3 gap-1">
            {['H', 'L', 'N'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setC(lvl as any)}
                className={`py-1.5 px-2 rounded-lg text-xs font-mono transition-all ${
                  c === lvl ? 'bg-emerald-600 text-white font-bold' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {lvl === 'H' ? 'High' : lvl === 'L' ? 'Low' : 'None'}
              </button>
            ))}
          </div>
        </div>

        {/* Integrity Impact */}
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
          <span className="font-mono text-neutral-400 font-semibold block text-[11px]">
            Integrity (I)
          </span>
          <div className="grid grid-cols-3 gap-1">
            {['H', 'L', 'N'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setI(lvl as any)}
                className={`py-1.5 px-2 rounded-lg text-xs font-mono transition-all ${
                  i === lvl ? 'bg-emerald-600 text-white font-bold' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {lvl === 'H' ? 'High' : lvl === 'L' ? 'Low' : 'None'}
              </button>
            ))}
          </div>
        </div>

        {/* Availability Impact */}
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
          <span className="font-mono text-neutral-400 font-semibold block text-[11px]">
            Availability (A)
          </span>
          <div className="grid grid-cols-3 gap-1">
            {['H', 'L', 'N'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setA(lvl as any)}
                className={`py-1.5 px-2 rounded-lg text-xs font-mono transition-all ${
                  a === lvl ? 'bg-emerald-600 text-white font-bold' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {lvl === 'H' ? 'High' : lvl === 'L' ? 'Low' : 'None'}
              </button>
            ))}
          </div>
        </div>

        {/* User Interaction */}
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
          <span className="font-mono text-neutral-400 font-semibold block text-[11px]">
            User Interaction (UI)
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { val: 'N', label: 'None (N)' },
              { val: 'R', label: 'Required (R)' },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setUi(opt.val as any)}
                className={`py-1.5 px-2 rounded-lg text-xs font-mono transition-all ${
                  ui === opt.val
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

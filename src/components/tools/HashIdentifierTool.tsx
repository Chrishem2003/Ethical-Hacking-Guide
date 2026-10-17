import React, { useState } from 'react';
import { Key, Copy, Check, Sparkles, AlertCircle } from 'lucide-react';

export const HashIdentifierTool: React.FC = () => {
  const [hashInput, setHashInput] = useState('cc32e74277b0709e99eb020bf23a4a06');
  const [copied, setCopied] = useState(false);

  const identifyHash = (hash: string) => {
    const clean = hash.trim();
    const len = clean.length;

    if (clean.startsWith('$krb5tgs$')) {
      return {
        name: 'Kerberos 5 TGS-REP etype 23',
        hashcatMode: 13100,
        johnFormat: 'krb5tgs',
        notes: 'Active Directory Kerberoasting ticket hash',
      };
    }
    if (clean.startsWith('$2a$') || clean.startsWith('$2b$') || clean.startsWith('$2y$')) {
      return {
        name: 'bcrypt',
        hashcatMode: 3200,
        johnFormat: 'bcrypt',
        notes: 'Modern web password hash with adjustable work factor',
      };
    }
    if (clean.startsWith('$6$')) {
      return {
        name: 'SHA-512 crypt',
        hashcatMode: 1800,
        johnFormat: 'sha512crypt',
        notes: 'Standard Linux /etc/shadow user password hash',
      };
    }
    if (len === 32) {
      return {
        name: 'NTLM or MD5',
        hashcatMode: 1000,
        johnFormat: 'nt / raw-md5',
        notes: 'Windows SAM / Active Directory NTLM hash (or legacy MD5)',
      };
    }
    if (len === 40) {
      return {
        name: 'SHA-1',
        hashcatMode: 100,
        johnFormat: 'raw-sha1',
        notes: 'Legacy 160-bit cryptographic hash',
      };
    }
    if (len === 64) {
      return {
        name: 'SHA-256',
        hashcatMode: 1400,
        johnFormat: 'raw-sha256',
        notes: 'Standard 256-bit cryptographic digest',
      };
    }

    return {
      name: 'Custom / Unknown Hash',
      hashcatMode: 0,
      johnFormat: 'dynamic',
      notes: 'Check hash length and prefix markers',
    };
  };

  const detected = identifyHash(hashInput);
  const hashcatCmd = `hashcat -m ${detected.hashcatMode} -a 0 hash.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule`;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(hashcatCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Hash Identifier & Command Synthesizer
            </span>
          </div>
          <h3 className="text-base font-bold text-neutral-100 mt-0.5">
            Identify Algorithm & Generate Cracking Syntax
          </h3>
        </div>

        <button
          onClick={handleCopyCmd}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs font-mono flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Command!' : 'Copy Hashcat Command'}</span>
        </button>
      </div>

      <div>
        <label className="text-xs font-mono text-neutral-400 block mb-1.5">
          Paste Raw Hash String
        </label>
        <input
          type="text"
          value={hashInput}
          onChange={(e) => setHashInput(e.target.value)}
          placeholder="Paste hash (e.g. cc32e74277b0709e99eb020bf23a4a06)..."
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 font-mono text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Detected Info Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <span className="text-[10px] font-mono text-neutral-500 uppercase block">Algorithm</span>
          <span className="text-sm font-bold text-emerald-400 font-mono">{detected.name}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <span className="text-[10px] font-mono text-neutral-500 uppercase block">Hashcat Mode</span>
          <span className="text-sm font-bold text-amber-400 font-mono">-m {detected.hashcatMode}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <span className="text-[10px] font-mono text-neutral-500 uppercase block">John the Ripper</span>
          <span className="text-sm font-bold text-sky-400 font-mono">{detected.johnFormat}</span>
        </div>
      </div>

      {/* Generated Command */}
      <div className="rounded-xl bg-[#090b10] border border-neutral-800 overflow-hidden">
        <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800 text-xs font-mono text-neutral-400">
          Optimized Hashcat Cracking Command
        </div>
        <pre className="p-4 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap select-all">
          {hashcatCmd}
        </pre>
      </div>
    </div>
  );
};

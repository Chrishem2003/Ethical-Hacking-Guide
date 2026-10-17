import React, { useState, useEffect } from 'react';
import {
  Server,
  Activity,
  RotateCcw,
  Copy,
  Check,
  Shield,
  Flag,
  Wifi,
  Terminal,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface TargetMachineControlProps {
  labImage?: string | null;
  lessonTitle: string;
  onSendToTerminal?: (cmd: string) => void;
  onFlagCaptured?: (flag: string) => void;
}

export const TargetMachineControl: React.FC<TargetMachineControlProps> = ({
  labImage,
  lessonTitle,
  onSendToTerminal,
  onFlagCaptured,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [userFlagInput, setUserFlagInput] = useState('');
  const [rootFlagInput, setRootFlagInput] = useState('');
  const [userFlagSolved, setUserFlagSolved] = useState(false);
  const [rootFlagSolved, setRootFlagSolved] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Determine target profiles based on labImage
  const targetProfiles: Record<
    string,
    {
      ip: string;
      hostname: string;
      os: string;
      difficulty: 'Easy' | 'Medium' | 'Hard';
      ports: { port: number; proto: string; service: string; version: string }[];
      userFlag: string;
      rootFlag: string;
    }
  > = {
    'hackforge/metasploitable2': {
      ip: '10.10.110.45',
      hostname: 'metasploitable2.hackforge.lan',
      os: 'Ubuntu Linux 8.04 (Kernel 2.6.24-16)',
      difficulty: 'Easy',
      ports: [
        { port: 21, proto: 'tcp', service: 'ftp', version: 'vsftpd 2.3.4 (Backdoor)' },
        { port: 22, proto: 'tcp', service: 'ssh', version: 'OpenSSH 4.7p1' },
        { port: 80, proto: 'tcp', service: 'http', version: 'Apache 2.2.8 (PHP 5.2.4)' },
        { port: 139, proto: 'tcp', service: 'netbios-ssn', version: 'Samba 3.0.20-Debian' },
        { port: 445, proto: 'tcp', service: 'smb', version: 'Samba 3.0.20 (usermap_script)' },
        { port: 3306, proto: 'tcp', service: 'mysql', version: 'MySQL 5.0.51a' },
      ],
      userFlag: 'FLAG{user_recon_master_3020}',
      rootFlag: 'FLAG{root_usermap_script_owned}',
    },
    'hackforge/dvwa': {
      ip: '10.10.110.80',
      hostname: 'dvwa-vuln.hackforge.lan',
      os: 'Debian GNU/Linux 11 (Bullseye)',
      difficulty: 'Medium',
      ports: [
        { port: 80, proto: 'tcp', service: 'http', version: 'Apache 2.4.54 (DVWA v1.10)' },
        { port: 3306, proto: 'tcp', service: 'mysql', version: 'MariaDB 10.5.15' },
        { port: 8080, proto: 'tcp', service: 'http-proxy', version: 'Squid Proxy' },
      ],
      userFlag: 'FLAG{dvwa_sqli_bypass_bypass}',
      rootFlag: 'FLAG{dvwa_admin_rce_root_access}',
    },
    'hackforge/juice-shop': {
      ip: '10.10.110.120',
      hostname: 'juice-shop.hackforge.lan',
      os: 'Alpine Linux 3.16 (Node.js 18)',
      difficulty: 'Hard',
      ports: [
        { port: 3000, proto: 'tcp', service: 'http', version: 'OWASP Juice Shop v14.3.0' },
        { port: 9229, proto: 'tcp', service: 'node-inspect', version: 'V8 Debugger' },
      ],
      userFlag: 'FLAG{juice_jwt_forge_bender}',
      rootFlag: 'FLAG{juice_zero_day_scoreboard_pwned}',
    },
  };

  const defaultProfile = {
    ip: '10.10.110.10',
    hostname: 'sandbox-target.hackforge.lan',
    os: 'Debian Linux (Dockerized Alpine Kali)',
    difficulty: 'Easy' as const,
    ports: [
      { port: 22, proto: 'tcp', service: 'ssh', version: 'OpenSSH 8.9p1' },
      { port: 80, proto: 'tcp', service: 'http', version: 'Nginx 1.22' },
      { port: 443, proto: 'tcp', service: 'https', version: 'TLS 1.3' },
    ],
    userFlag: 'FLAG{hackforge_sandbox_user_9921}',
    rootFlag: 'FLAG{hackforge_sandbox_root_0099}',
  };

  const profile = (labImage && targetProfiles[labImage]) ? targetProfiles[labImage] : defaultProfile;

  // Restore flag solved state
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hackforge_captured_flags');
      if (saved) {
        const flags = JSON.parse(saved);
        if (flags.includes(profile.userFlag)) setUserFlagSolved(true);
        if (flags.includes(profile.rootFlag)) setRootFlagSolved(true);
      }
    } catch {
      // ignore
    }
  }, [profile]);

  const handleCopyIP = () => {
    navigator.clipboard.writeText(profile.ip);
    setIsCopied(true);
    sound.playClick();
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePing = () => {
    setIsPinging(true);
    setPingResult('PING ' + profile.ip + ' (56 data bytes)...');
    sound.playCommandRun();

    setTimeout(() => {
      setPingResult(`64 bytes from ${profile.ip}: icmp_seq=1 ttl=64 time=21.4 ms`);
      setIsPinging(false);
      sound.playClick();
    }, 600);
  };

  const handleReset = () => {
    setIsResetting(true);
    sound.playCommandRun();
    setTimeout(() => {
      setIsResetting(false);
      sound.playSuccess();
    }, 1500);
  };

  const handleSubmitFlag = (type: 'user' | 'root') => {
    const val = (type === 'user' ? userFlagInput : rootFlagInput).trim();
    const targetFlag = type === 'user' ? profile.userFlag : profile.rootFlag;

    if (val === targetFlag || val.toLowerCase() === targetFlag.toLowerCase()) {
      sound.playFlagCaptured();
      if (type === 'user') {
        setUserFlagSolved(true);
        setUserFlagInput('');
      } else {
        setRootFlagSolved(true);
        setRootFlagInput('');
      }
      if (onFlagCaptured) {
        onFlagCaptured(targetFlag);
      }
    } else {
      sound.playError();
      alert('Invalid Flag! Check your payload and inspect the target file system.');
    }
  };

  return (
    <div className="rounded-2xl bg-[#090b10] border border-neutral-800 overflow-hidden shadow-xl mb-6">
      {/* Target Machine Bar Header */}
      <div className="px-4 py-3 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-neutral-100">
                TARGET LAB MACHINE: {profile.hostname}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  profile.difficulty === 'Easy'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : profile.difficulty === 'Medium'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}
              >
                {profile.difficulty}
              </span>
            </div>
            <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2">
              <span>{profile.os}</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE (100% HEALTH)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors"
            title={isCollapsed ? 'Expand Target Controls' : 'Collapse Target Controls'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Target Details & Controls */}
      {!isCollapsed && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Quick Actions Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-neutral-900/50 border border-neutral-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-neutral-400">Target IP:</span>
              <code className="text-sm font-mono font-bold text-emerald-400 bg-neutral-950 px-2.5 py-1 rounded border border-emerald-500/30 select-all">
                {profile.ip}
              </code>
              <button
                onClick={handleCopyIP}
                className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono flex items-center gap-1 transition-colors"
                title="Copy Target IP"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy IP</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePing}
                disabled={isPinging}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50"
                title="Ping target IP"
              >
                <Wifi className="w-3.5 h-3.5 text-sky-400" />
                <span>{isPinging ? 'Pinging...' : 'ICMP Ping'}</span>
              </button>

              <button
                onClick={handleReset}
                disabled={isResetting}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50"
                title="Revert lab machine to pristine snapshot"
              >
                <RotateCcw className={`w-3.5 h-3.5 text-amber-400 ${isResetting ? 'animate-spin' : ''}`} />
                <span>{isResetting ? 'Restoring...' : 'Reset Machine'}</span>
              </button>

              {onSendToTerminal && (
                <button
                  onClick={() => onSendToTerminal(`nmap -sC -sV -Pn ${profile.ip}`)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                  title="Run Nmap scan against this target"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Scan in Lab</span>
                </button>
              )}
            </div>
          </div>

          {/* Ping Output Banner */}
          {pingResult && (
            <div className="px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-xs text-sky-400 flex items-center justify-between">
              <span>{pingResult}</span>
              <button
                onClick={() => setPingResult(null)}
                className="text-neutral-500 hover:text-neutral-300 text-[10px]"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Open Ports & Services Recon Table */}
          <div>
            <div className="text-xs font-mono text-neutral-400 mb-2 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Known Attack Surface & Discovered Ports</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {profile.ports.map((p) => (
                <div
                  key={p.port}
                  className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs font-mono flex items-center justify-between"
                >
                  <div>
                    <div className="text-emerald-400 font-bold">
                      {p.port}/{p.proto} <span className="text-neutral-300 font-normal uppercase">({p.service})</span>
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate max-w-[200px]">
                      {p.version}
                    </div>
                  </div>
                  {onSendToTerminal && (
                    <button
                      onClick={() =>
                        onSendToTerminal(
                          p.service === 'http' || p.service === 'http-proxy'
                            ? `curl -i http://${profile.ip}:${p.port}/`
                            : p.service === 'ftp'
                            ? `ftp ${profile.ip}`
                            : p.service === 'smb'
                            ? `smbclient -L //${profile.ip} -N`
                            : `nc -nv ${profile.ip} ${p.port}`
                        )
                      }
                      className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 text-[10px] transition-colors"
                      title={`Interact with port ${p.port}`}
                    >
                      Probe
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Target Capture The Flag Objectives */}
          <div className="pt-2 border-t border-neutral-800">
            <div className="text-xs font-mono text-neutral-400 mb-2.5 flex items-center gap-2">
              <Flag className="w-3.5 h-3.5 text-amber-400" />
              <span>Target Objectives & Flag Submissions (+150 XP each)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* User Flag Submission */}
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-neutral-200">1. User Flag (user.txt)</span>
                  {userFlagSolved ? (
                    <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-bold">
                      <Check className="w-3.5 h-3.5" /> SOLVED (+150 XP)
                    </span>
                  ) : (
                    <span className="text-amber-400 text-[11px]">Unsolved</span>
                  )}
                </div>
                {!userFlagSolved ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={userFlagInput}
                      onChange={(e) => setUserFlagInput(e.target.value)}
                      placeholder={profile.userFlag}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono text-emerald-400 placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => handleSubmitFlag('user')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] font-mono text-neutral-500">
                    Flag verified: <code className="text-emerald-400">{profile.userFlag}</code>
                  </div>
                )}
              </div>

              {/* Root Flag Submission */}
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-neutral-200">2. Root Flag (root.txt)</span>
                  {rootFlagSolved ? (
                    <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-bold">
                      <Check className="w-3.5 h-3.5" /> SOLVED (+150 XP)
                    </span>
                  ) : (
                    <span className="text-rose-400 text-[11px]">Unsolved</span>
                  )}
                </div>
                {!rootFlagSolved ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={rootFlagInput}
                      onChange={(e) => setRootFlagInput(e.target.value)}
                      placeholder={profile.rootFlag}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono text-emerald-400 placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => handleSubmitFlag('root')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] font-mono text-neutral-500">
                    Flag verified: <code className="text-emerald-400">{profile.rootFlag}</code>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

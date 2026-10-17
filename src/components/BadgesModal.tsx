import React from 'react';
import {
  X,
  Award,
  Shield,
  Sparkles,
  CheckCircle2,
  Lock,
  Flame,
  Star
} from 'lucide-react';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userXP: number;
  completedSlugs: string[];
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  userXP,
  completedSlugs,
}) => {
  if (!isOpen) return null;

  // Calculate Rank Level
  const getRank = (xp: number) => {
    if (xp >= 3500) return { title: 'Elite Red Team Operator', level: 5, nextXP: 5000, color: 'text-red-400' };
    if (xp >= 2000) return { title: 'Exploit Architect', level: 4, nextXP: 3500, color: 'text-amber-400' };
    if (xp >= 1000) return { title: 'Vulnerability Auditor', level: 3, nextXP: 2000, color: 'text-sky-400' };
    if (xp >= 500) return { title: 'Port Scout', level: 2, nextXP: 1000, color: 'text-emerald-400' };
    return { title: 'Script Apprentice', level: 1, nextXP: 500, color: 'text-neutral-400' };
  };

  const rank = getRank(userXP);

  const BADGES = [
    {
      id: 'b-1',
      title: 'Lab Architect',
      description: 'Configured Host-Only sandbox and verified isolated networking.',
      slugRequirement: 'lab-setup-kali-parrot',
      icon: '🛡️',
    },
    {
      id: 'b-2',
      title: 'Bash Samurai',
      description: 'Audited SUID binaries and spawned an elevated bash shell.',
      slugRequirement: 'linux-mastery-for-hackers',
      icon: '💻',
    },
    {
      id: 'b-3',
      title: 'Packet Whisperer',
      description: 'Dissected TCP 3-way handshake and captured cleartext frames.',
      slugRequirement: 'networking-wireshark-tcpip',
      icon: '📡',
    },
    {
      id: 'b-4',
      title: 'Nmap Master',
      description: 'Executed 65k port scans and identified vsftpd backdoor via NSE.',
      slugRequirement: 'nmap-scanning-enumeration',
      icon: '🎯',
    },
    {
      id: 'b-5',
      title: 'Hash Shatterer',
      description: 'Recovered NTLM plaintext password using GPU Hashcat mode 1000.',
      slugRequirement: 'password-attacks-hashcat',
      icon: '🔑',
    },
    {
      id: 'b-6',
      title: 'Web Exploit Specialist',
      description: 'Exploited UNION SQL injection and dumped database tables.',
      slugRequirement: 'web-hacking-sqli',
      icon: '🌐',
    },
    {
      id: 'b-7',
      title: 'Root & SYSTEM',
      description: 'Escalated privileges to root via GTFOBins sudo misconfigurations.',
      slugRequirement: 'linux-privilege-escalation-gtfobins',
      icon: '👑',
    },
    {
      id: 'b-8',
      title: 'Domain Administrator',
      description: 'Executed Kerberoasting against Active Directory SPN service accounts.',
      slugRequirement: 'active-directory-kerberoasting',
      icon: '🏢',
    },
    {
      id: 'b-9',
      title: 'Executive Reporter',
      description: 'Crafted publication-grade CVSS 3.1 finding report with PoC reproduction.',
      slugRequirement: 'professional-report-writing',
      icon: '📄',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-950 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Student Rank & Achievement Vault
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Rank Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-2xl shrink-0">
                ⭐
              </div>
              <div>
                <div className="text-xs font-mono text-neutral-400">CURRENT OPERATOR RANK</div>
                <div className={`text-xl font-extrabold ${rank.color}`}>
                  Level {rank.level}: {rank.title}
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  Total Experience: <span className="text-emerald-400 font-bold">{userXP} XP</span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-48 space-y-1.5 text-right font-mono text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Next Rank</span>
                <span>{rank.nextXP} XP</span>
              </div>
              <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (userXP / rank.nextXP) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Badges Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
              Unlocked Specialization Badges
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {BADGES.map((b) => {
                const isUnlocked = completedSlugs.includes(b.slugRequirement);
                return (
                  <div
                    key={b.id}
                    className={`p-4 rounded-xl border transition-all text-center space-y-2 ${
                      isUnlocked
                        ? 'bg-neutral-950 border-emerald-500/50 shadow-md shadow-emerald-950/20'
                        : 'bg-neutral-950/40 border-neutral-800/80 opacity-40'
                    }`}
                  >
                    <div className="text-3xl mx-auto">{b.icon}</div>
                    <div className="font-bold text-xs text-neutral-100 flex items-center justify-center gap-1">
                      <span>{b.title}</span>
                      {isUnlocked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Lock className="w-3 h-3 text-neutral-500" />
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-400 leading-tight">
                      {b.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

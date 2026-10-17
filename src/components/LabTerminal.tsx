import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import {
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  Clock,
  Cpu,
  ShieldCheck,
  Sparkles,
  Server,
  Layers,
  Flag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface LabTerminalProps {
  labImage?: string | null;
  lessonTitle: string;
  onCommandRun?: (cmd: string) => void;
  presetCommand?: string;
  onFlagCaptured?: (flag: string) => void;
}

interface SandboxTarget {
  id: string;
  name: string;
  ip: string;
  services: string[];
}

const TARGETS: SandboxTarget[] = [
  { id: 'meta2', name: 'Metasploitable 2 Target', ip: '192.168.56.102', services: ['FTP (21)', 'SSH (22)', 'HTTP (80)', 'SMB (445)'] },
  { id: 'dvwa', name: 'DVWA Web Application', ip: '192.168.56.103', services: ['Apache (80)', 'MySQL (3306)'] },
  { id: 'juiceshop', name: 'OWASP Juice Shop', ip: '192.168.56.104', services: ['NodeJS (3000)', 'REST API'] },
  { id: 'ad_dc', name: 'Windows AD DC (corp.local)', ip: '192.168.56.200', services: ['Kerberos (88)', 'LDAP (389)', 'SMB (445)'] },
];

const KNOWN_FLAGS: Record<string, string> = {
  'HACKFORGE{r00t_pr1v_3sc4l4t10n_m4st3r_2026}': 'Metasploitable 2 Root Flag (LinPEAS / SUID)',
  'HACKFORGE{3th1c4l_h4ck3r_us3r_fl4g}': 'Standard User Flag (SSH / Hydra)',
  'HACKFORGE{vsftpd_b4ckd00r_pwn3d_2026}': 'vsFTPd 2.3.4 Backdoor Exploitation Flag',
  'HACKFORGE{sqli_un10n_inj3ct10n_pwn}': 'DVWA SQL Injection Flag',
  'HACKFORGE{k3rb3r04st_spn_t1ck3t_cr4ck3d}': 'Active Directory Kerberoasting Flag',
};

// Simple Web Audio API Synthesizer for retro terminal chimes
const playChime = (type: 'success' | 'warn') => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    }
  } catch {
    // Audio context not allowed or not supported; ignore gracefully
  }
};

export const LabTerminal: React.FC<LabTerminalProps> = ({
  labImage = 'hackforge/metasploitable2',
  lessonTitle,
  onCommandRun,
  presetCommand,
  onFlagCaptured,
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermInstance = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  const [isRunning, setIsRunning] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 mins TTL
  const [selectedTarget, setSelectedTarget] = useState<SandboxTarget>(TARGETS[0]);
  const [inSubShell, setInSubShell] = useState<'bash' | 'msf' | 'meterpreter'>('bash');
  const [isRoot, setIsRoot] = useState(false);

  // CTF Flag submission
  const [flagInput, setFlagInput] = useState('');
  const [flagStatus, setFlagStatus] = useState<{ message: string; type: 'success' | 'error' | '' }>({
    message: '',
    type: '',
  });

  // TTL Countdown
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTTL = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const writePrompt = (term: Terminal, shellMode: 'bash' | 'msf' | 'meterpreter', rootActive: boolean = isRoot) => {
    if (shellMode === 'msf') {
      term.write('\x1b[31mmsf6\x1b[0m exploit(\x1b[33mvsftpd_234_backdoor\x1b[0m) > ');
    } else if (shellMode === 'meterpreter') {
      term.write('\x1b[36mmeterpreter\x1b[0m > ');
    } else if (rootActive) {
      term.write('\x1b[38;2;239;68;68mroot@hackforge\x1b[0m:\x1b[38;2;96;165;250m/root\x1b[0m# ');
    } else {
      term.write('\x1b[38;2;16;185;129mkali@hackforge\x1b[0m:\x1b[38;2;96;165;250m~\x1b[0m$ ');
    }
  };

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = flagInput.trim();
    if (!clean) return;

    if (KNOWN_FLAGS[clean]) {
      setFlagStatus({
        message: `🎯 Correct Flag! ${KNOWN_FLAGS[clean]} (+150 XP)`,
        type: 'success',
      });
      playChime('success');
      setFlagInput('');
      if (onFlagCaptured) {
        onFlagCaptured(clean);
      }
      if (xtermInstance.current) {
        xtermInstance.current.writeln(`\r\n\x1b[32m[+] CTF ENGINE: FLAG ACCEPTED: ${KNOWN_FLAGS[clean]} (+150 XP AWARDED)\x1b[0m`);
        writePrompt(xtermInstance.current, inSubShell);
      }
    } else {
      setFlagStatus({
        message: 'Invalid flag. Keep analyzing targets in the terminal!',
        type: 'error',
      });
      playChime('warn');
    }
  };

  const executeSimulatorCommand = (term: Terminal, command: string) => {
    const cmd = command.trim();
    term.writeln('');

    if (!cmd) {
      writePrompt(term, inSubShell);
      return;
    }

    const lower = cmd.toLowerCase();

    // MSF Sub-shell handler
    if (inSubShell === 'msf') {
      if (lower === 'exit' || lower === 'back') {
        setInSubShell('bash');
        term.writeln('[*] Exiting Metasploit Framework.');
        writePrompt(term, 'bash');
        return;
      }
      if (lower.startsWith('set rhosts') || lower.startsWith('set rhost')) {
        term.writeln(`RHOSTS => ${selectedTarget.ip}`);
        writePrompt(term, 'msf');
        return;
      }
      if (lower === 'exploit' || lower === 'run') {
        term.writeln(`[*] ${selectedTarget.ip}:21 - Banner: 220 (vsFTPd 2.3.4)`);
        term.writeln(`[*] ${selectedTarget.ip}:21 - USER: 331 Please specify the password.`);
        term.writeln(`[+] ${selectedTarget.ip}:21 - Backdoor service spawned! (Port 6200)`);
        term.writeln(`[*] Command shell session 1 opened (192.168.56.101:4444 -> ${selectedTarget.ip}:6200)`);
        term.writeln('\x1b[32m[+] SUCCESS: Spawning Meterpreter in-memory session...\x1b[0m');
        term.writeln('\x1b[33m[*] CTF HINT: Uncovered Flag: HACKFORGE{vsftpd_b4ckd00r_pwn3d_2026}\x1b[0m');
        setInSubShell('meterpreter');
        writePrompt(term, 'meterpreter');
        return;
      }
      term.writeln(`[msf6]: Option processed.`);
      writePrompt(term, 'msf');
      return;
    }

    // Meterpreter Sub-shell handler
    if (inSubShell === 'meterpreter') {
      if (lower === 'exit') {
        setInSubShell('bash');
        term.writeln('[*] Terminating Meterpreter session.');
        writePrompt(term, 'bash');
        return;
      }
      if (lower === 'sysinfo') {
        term.writeln('Computer        : metasploitable.localdomain');
        term.writeln('OS              : Linux 2.6.24-16-server (i686)');
        term.writeln('Architecture    : i686');
        term.writeln('Meterpreter     : x86/linux');
      } else if (lower === 'getuid') {
        term.writeln('\x1b[32mServer username: root\x1b[0m');
      } else if (lower === 'hashdump') {
        term.writeln('root:$6$aZ3/F.Hq$8y4tX92kLp6OqG2:0:0:root:/root:/bin/bash');
        term.writeln('msfadmin:$1$9WvG$wF9Jq5h1N7T3.xZ:1000:1000:msfadmin:/home/msfadmin:/bin/bash');
      } else if (lower.includes('cat') && (lower.includes('flag') || lower.includes('root'))) {
        term.writeln('\x1b[32mHACKFORGE{r00t_pr1v_3sc4l4t10n_m4st3r_2026}\x1b[0m');
      } else {
        term.writeln(`meterpreter: command '${cmd}' executed. Type 'sysinfo', 'getuid', or 'exit'.`);
      }
      writePrompt(term, 'meterpreter');
      return;
    }

    // Standard Bash commands
    if (lower === 'clear') {
      term.clear();
      writePrompt(term, 'bash');
      return;
    }

    if (lower === 'help') {
      term.writeln('\x1b[33m=== HACKFORGE SANDBOX TOOLKIT ===\x1b[0m');
      term.writeln('  nmap -sC -sV <target>      Intensive port & service version probe');
      term.writeln('  nmap --script vuln <ip>    Run NSE vulnerability detection scripts');
      term.writeln('  gobuster dir -u <url>      Brute-force hidden directories/files');
      term.writeln('  sqlmap -u <url> --dbs      Automated SQL injection assessment');
      term.writeln('  hydra -l user -P pass ...  Online service credential brute-forcing');
      term.writeln('  hashcat -m 1000 ...        GPU-accelerated hash cracking');
      term.writeln('  msfconsole                 Launch Metasploit Framework interactive console');
      term.writeln('  linpeas                    Run automated Linux Privilege Escalation triage');
      term.writeln('  /tmp/rootbash -p           Spawn elevated root shell via SUID binary');
      term.writeln('  cat /root/flag.txt         Read captured root challenge flag');
      term.writeln('  nikto -h <target>          Web server misconfiguration scanner');
      term.writeln('  clear                      Clear terminal display');
    } else if (lower === 'msfconsole') {
      term.writeln('\x1b[31m');
      term.writeln('  .:okOOOkdc\'           \'cdkOOOko:.');
      term.writeln(' .xOOOOOOOOOOOOc       cOOOOOOOOOOOOx.');
      term.writeln('        =[ metasploit v6.3.55-dev                          ]');
      term.writeln('+ -- --=[ 2420 exploits - 1245 auxiliary - 428 post       ]');
      term.writeln('+ -- --=[ 1465 payloads - 47 encoders - 13 nops           ]');
      term.writeln('\x1b[0m');
      term.writeln('[*] Loaded exploit/unix/ftp/vsftpd_234_backdoor');
      setInSubShell('msf');
      writePrompt(term, 'msf');
      return;
    } else if (lower.startsWith('nmap')) {
      if (lower.includes('vuln')) {
        term.writeln(`\x1b[32mNmap scan report for ${selectedTarget.name} (${selectedTarget.ip})\x1b[0m`);
        term.writeln('PORT    STATE SERVICE');
        term.writeln('21/tcp  open  ftp');
        term.writeln('| vsftpd-backdoor:');
        term.writeln('|   VULNERABLE: vsFTPd version 2.3.4 backdoor');
        term.writeln('|   State: VULNERABLE (Exploitable)');
        term.writeln('|_  IDs: BID:48539  CVE:CVE-2011-2523');
        term.writeln('80/tcp  open  http');
        term.writeln('|_http-csrf: False');
        term.writeln('445/tcp open  netbios-ssn');
        term.writeln('\x1b[32mNmap done: 1 IP scanned in 3.12 seconds\x1b[0m');
      } else {
        term.writeln(`Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-17 04:30 EST`);
        term.writeln(`Nmap scan report for ${selectedTarget.name} (${selectedTarget.ip})`);
        term.writeln('Host is up (0.00031s latency).');
        term.writeln('PORT     STATE SERVICE     VERSION');
        selectedTarget.services.forEach((s) => {
          const parts = s.split(' ');
          term.writeln(`${parts[1]?.replace(/[()]/g, '') || '80'}/tcp open  ${parts[0].toLowerCase()}      Service Banner Detected`);
        });
        term.writeln('\x1b[32mNmap done: 1 IP address (1 host up) scanned in 2.45 seconds\x1b[0m');
      }
    } else if (lower.startsWith('gobuster') || lower.startsWith('ffuf')) {
      term.writeln('===============================================================');
      term.writeln(`Gobuster v3.6 - URL: http://${selectedTarget.ip}`);
      term.writeln('Wordlist: /usr/share/wordlists/dirb/common.txt');
      term.writeln('===============================================================');
      term.writeln('/admin                (Status: 200) [Size: 1042]');
      term.writeln('/dvwa                 (Status: 302) [Size: 0] [--> login.php]');
      term.writeln('/phpmyadmin           (Status: 200) [Size: 312]');
      term.writeln('/uploads              (Status: 403) [Size: 326]');
      term.writeln('/robots.txt           (Status: 200) [Size: 45]');
      term.writeln('===============================================================');
      term.writeln('\x1b[32mFinished in 1.95s! Discovered 5 endpoints.\x1b[0m');
    } else if (lower.startsWith('hydra')) {
      term.writeln(`Hydra v9.5 (c) 2026 by THC - attacking ${selectedTarget.ip}:22`);
      term.writeln('[DATA] attacking ssh service with rockyou.txt');
      term.writeln(`\x1b[32m[22][ssh] host: ${selectedTarget.ip}   login: msfadmin   password: msfadmin\x1b[0m`);
      term.writeln('1 of 1 target completed, 1 valid credential found.');
      term.writeln('\x1b[33m[*] CTF HINT: Uncovered Flag: HACKFORGE{3th1c4l_h4ck3r_us3r_fl4g}\x1b[0m');
    } else if (lower.startsWith('sqlmap')) {
      term.writeln(`[*] testing connection to http://${selectedTarget.ip}/dvwa`);
      term.writeln('\x1b[32m[+] GET parameter \'id\' is vulnerable to UNION query injection!\x1b[0m');
      term.writeln('available databases [2]:');
      term.writeln('[*] dvwa');
      term.writeln('[*] information_schema');
      term.writeln('\x1b[33m[*] Dumped secret table: HACKFORGE{sqli_un10n_inj3ct10n_pwn}\x1b[0m');
    } else if (lower.startsWith('hashcat')) {
      term.writeln('hashcat (v6.2.6) starting in simulated GPU mode...');
      term.writeln('Hash.Mode: 1000 (NTLM) | rockyou.txt (14.3M words)');
      term.writeln('\x1b[32mcc32e74277b0709e99eb020bf23a4a06:password123\x1b[0m');
      term.writeln('Status: Cracked');
    } else if (lower.startsWith('linpeas')) {
      term.writeln('\x1b[33m[+] LINPEAS - Linux Privilege Escalation Awesome Script\x1b[0m');
      term.writeln('[*] SUID Binaries (Red/Yellow = 99% PrivEsc vector):');
      term.writeln('    \x1b[43;30m/tmp/rootbash\x1b[0m ................. [!] CRITICAL: SUID Bash found! Run: /tmp/rootbash -p');
      term.writeln('    /usr/bin/sudo ................... Sudo 1.9.15');
      term.writeln('[+] Linpeas finished! Found 1 instant root vector.');
    } else if (lower.includes('/tmp/rootbash') || lower === 'sudo su' || lower === 'su') {
      setIsRoot(true);
      term.writeln('\x1b[32m[+] Escalating privileges via SUID bit...\x1b[0m');
      term.writeln('\x1b[31m[#] SUCCESS: Spawning root shell (effective UID: 0)!\x1b[0m');
      writePrompt(term, 'bash', true);
      return;
    } else if (lower.includes('cat') && (lower.includes('flag') || lower.includes('/root'))) {
      if (isRoot) {
        term.writeln('\x1b[32mHACKFORGE{r00t_pr1v_3sc4l4t10n_m4st3r_2026}\x1b[0m');
      } else {
        term.writeln('cat: /root/flag.txt: Permission denied');
        term.writeln('\x1b[33m[Hint]: Audit SUID binaries with LinPEAS or check /tmp/rootbash -p to escalate!\x1b[0m');
      }
    } else if (lower.includes('cat') && lower.includes('user.txt')) {
      term.writeln('\x1b[32mHACKFORGE{3th1c4l_h4ck3r_us3r_fl4g}\x1b[0m');
    } else if (lower.startsWith('mimikatz')) {
      term.writeln('  .#####.   mimikatz 2.2.0 (x64) # LSASS Memory Dumper');
      term.writeln('  #\' * \'#   /* * * Vincent LE TOUX (vincent.letoux@gmail.com) */');
      term.writeln('mimikatz # privilege::debug');
      term.writeln('Privilege \'20\' OK');
      term.writeln('mimikatz # sekurlsa::logonpasswords');
      term.writeln('[*] Authentication Id : 0 ; 2938472 (00000000:002cd6a8)');
      term.writeln('    User Name         : Administrator');
      term.writeln('    Domain            : CORP');
      term.writeln('\x1b[32m    NTLM              : e19ccf75ee54e06b06a5907af13cef42\x1b[0m');
    } else if (lower.includes('getuserspns') || lower.includes('kerberoast')) {
      term.writeln('[*] Connecting to 192.168.56.200 (corp.local)...');
      term.writeln('[+] Found 1 Kerberoastable SPN account: MSSQLSvc/sql01.corp.local:1433');
      term.writeln('$krb5tgs$23$*MSSQLSvc$...$HACKFORGE{k3rb3r04st_spn_t1ck3t_cr4ck3d}');
    } else if (lower === 'whoami') {
      term.writeln(isRoot ? 'root' : 'kali');
    } else if (lower === 'id') {
      term.writeln(
        isRoot
          ? 'uid=0(root) gid=0(root) groups=0(root)'
          : 'uid=1000(kali) gid=1000(kali) groups=1000(kali),27(sudo),100(users)'
      );
    } else if (lower.startsWith('curl') || lower.startsWith('wget')) {
      term.writeln(`HTTP/1.1 200 OK\r\nServer: Apache/2.2.8 (Ubuntu)\r\nContent-Type: text/html\r\nContent-Length: 1204\r\n`);
      term.writeln('<html><body><h1>Metasploitable2 Test Web Server</h1></body></html>');
    } else {
      term.writeln(`\x1b[90m[hackforge-sandbox]: Command '${cmd}' executed on ${selectedTarget.name}.\x1b[0m`);
    }

    writePrompt(term, inSubShell);
  };

  // Initialize Terminal
  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: 13,
      theme: {
        background: '#090a0f',
        foreground: '#e2e8f0',
        cursor: '#10b981',
        selectionBackground: 'rgba(16, 185, 129, 0.3)',
        black: '#090a0f',
        red: '#ef4444',
        green: '#10b981',
        yellow: '#f59e0b',
        blue: '#3b82f6',
        magenta: '#d946ef',
        cyan: '#06b6d4',
        white: '#f8fafc',
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);

    try {
      fitAddon.fit();
    } catch (e) {
      console.warn(e);
    }

    xtermInstance.current = term;
    fitAddonRef.current = fitAddon;

    // Terminal Banner
    term.writeln('\x1b[38;2;16;185;129m╔══════════════════════════════════════════════════════════════════════════╗\x1b[0m');
    term.writeln('\x1b[38;2;16;185;129m║  HACKFORGE SANDBOX CONTAINER ENGINE • Kali/Parrot Security Environment   ║\x1b[0m');
    term.writeln('\x1b[38;2;16;185;129m║  Chief Instructor: Chrishem • Isolated Host-Only Network (vboxnet0)      ║\x1b[0m');
    term.writeln('\x1b[38;2;16;185;129m╚══════════════════════════════════════════════════════════════════════════╝\x1b[0m');
    term.writeln(`[*] Target: \x1b[33m${selectedTarget.name} (${selectedTarget.ip})\x1b[0m`);
    term.writeln(`[*] Lab Context: \x1b[36m${lessonTitle}\x1b[0m`);
    term.writeln(`[*] Type '\x1b[32mhelp\x1b[0m' to view tools or click any command below.`);
    writePrompt(term, 'bash');

    let currentInput = '';
    const onDataDisposable = term.onData((data) => {
      // Enter key
      if (data === '\r') {
        const cmd = currentInput;
        currentInput = '';
        executeSimulatorCommand(term, cmd);
        if (onCommandRun && cmd.trim()) {
          onCommandRun(cmd.trim());
        }
      }
      // Backspace
      else if (data === '\x7F') {
        if (currentInput.length > 0) {
          currentInput = currentInput.slice(0, -1);
          term.write('\b \b');
        }
      }
      // Printable characters
      else if (data >= ' ' && data <= '~') {
        currentInput += data;
        term.write(data);
      }
    });

    const handleResize = () => {
      try {
        fitAddon.fit();
      } catch (e) {
        console.warn(e);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      onDataDisposable.dispose();
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, [selectedTarget]);

  // Handle Preset Command injection
  useEffect(() => {
    if (presetCommand && xtermInstance.current) {
      const term = xtermInstance.current;
      term.writeln(presetCommand);
      executeSimulatorCommand(term, presetCommand);
      if (onCommandRun) {
        onCommandRun(presetCommand);
      }
    }
  }, [presetCommand]);

  const handleRestartContainer = () => {
    setTimeLeft(3600);
    setIsRunning(true);
    setIsRoot(false);
    setInSubShell('bash');
    if (xtermInstance.current) {
      xtermInstance.current.clear();
      xtermInstance.current.writeln('\x1b[33m[*] Rebuilding container sandbox from clean snapshot...\x1b[0m');
      xtermInstance.current.writeln('\x1b[32m[+] Container booted successfully (512MB RAM, 0.5 CPU isolated).\x1b[0m');
      writePrompt(xtermInstance.current, 'bash');
    }
  };

  const handleRunPreset = (cmd: string) => {
    if (xtermInstance.current) {
      xtermInstance.current.writeln(cmd);
      executeSimulatorCommand(xtermInstance.current, cmd);
      if (onCommandRun) {
        onCommandRun(cmd);
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl overflow-hidden font-mono">
      {/* Top Terminal Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-neutral-200">KALI SANDBOX</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400">
              512MB / 0.5 CPU
            </span>
          </div>

          <div className="flex items-center gap-1 text-neutral-400 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400 font-bold">{formatTTL(timeLeft)} TTL</span>
          </div>
        </div>

        {/* Target Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-neutral-300 text-xs">
            <Server className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline text-neutral-400">Target:</span>
            <select
              value={selectedTarget.id}
              onChange={(e) => {
                const found = TARGETS.find((t) => t.id === e.target.value);
                if (found) setSelectedTarget(found);
              }}
              className="bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-emerald-400 font-mono text-xs focus:outline-none cursor-pointer"
            >
              {TARGETS.map((t) => (
                <option key={t.id} value={t.id} className="bg-neutral-900 text-neutral-200">
                  {t.name} ({t.ip})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRestartContainer}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-mono transition-colors"
            title="Reset 60-min TTL and reboot container"
          >
            <RotateCcw className="w-3 h-3 text-emerald-400" />
            <span>Reboot</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="px-3 py-1.5 bg-neutral-950/80 border-b border-neutral-800/80 flex items-center gap-1.5 overflow-x-auto text-xs font-mono scrollbar-none">
        <span className="text-neutral-500 text-[11px] whitespace-nowrap flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-emerald-400" /> Quick Commands:
        </span>
        <button
          onClick={() => handleRunPreset(`nmap -sC -sV ${selectedTarget.ip}`)}
          className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs whitespace-nowrap"
        >
          nmap -sC -sV
        </button>
        <button
          onClick={() => handleRunPreset('msfconsole')}
          className="px-2 py-0.5 rounded bg-red-950/60 hover:bg-red-900/60 border border-red-800/60 text-red-300 text-xs whitespace-nowrap font-bold"
        >
          msfconsole
        </button>
        <button
          onClick={() => handleRunPreset(`gobuster dir -u http://${selectedTarget.ip} -w common.txt`)}
          className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs whitespace-nowrap"
        >
          gobuster
        </button>
        <button
          onClick={() => handleRunPreset(`hydra -l msfadmin -P rockyou.txt ${selectedTarget.ip} ssh`)}
          className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs whitespace-nowrap"
        >
          hydra ssh
        </button>
        <button
          onClick={() => handleRunPreset('linpeas')}
          className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs whitespace-nowrap"
        >
          linpeas privesc
        </button>
        <button
          onClick={() => handleRunPreset('/tmp/rootbash -p')}
          className="px-2 py-0.5 rounded bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/60 text-amber-300 text-xs whitespace-nowrap"
        >
          root shell (-p)
        </button>
        <button
          onClick={() => handleRunPreset('cat /root/flag.txt')}
          className="px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 text-xs whitespace-nowrap"
        >
          cat flag.txt
        </button>
      </div>

      {/* Terminal Canvas */}
      <div className="flex-1 w-full h-full relative overflow-hidden bg-[#090a0f]">
        <div ref={terminalRef} className="w-full h-full" />
      </div>

      {/* Bottom CTF Flag Submission Bar */}
      <div className="p-2.5 bg-neutral-900 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <form onSubmit={handleFlagSubmit} className="flex-1 flex items-center gap-2 min-w-[260px]">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold shrink-0">
            <Flag className="w-3.5 h-3.5 fill-current" />
            <span>Submit CTF Flag:</span>
          </div>
          <input
            type="text"
            value={flagInput}
            onChange={(e) => setFlagInput(e.target.value)}
            placeholder="HACKFORGE{...}"
            className="flex-1 px-3 py-1 bg-neutral-950 border border-neutral-800 rounded-lg text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold rounded-lg text-xs transition-colors shrink-0"
          >
            Claim (+150 XP)
          </button>
        </form>

        {flagStatus.message && (
          <div
            className={`text-xs font-mono px-2 py-0.5 rounded flex items-center gap-1 ${
              flagStatus.type === 'success'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                : 'bg-red-950 text-red-300 border border-red-500/40'
            }`}
          >
            {flagStatus.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
            )}
            <span>{flagStatus.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

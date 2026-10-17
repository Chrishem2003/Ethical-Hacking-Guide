import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RotateCcw, Copy, Check, Sparkles, Shield, ChevronRight } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'info';
  text: string;
}

interface CyberTerminalSimulatorProps {
  initialCommand?: string;
  activeChapterTitle?: string;
}

export const CyberTerminalSimulator: React.FC<CyberTerminalSimulatorProps> = ({
  initialCommand = '',
  activeChapterTitle = '',
}) => {
  const [inputVal, setInputVal] = useState(initialCommand);
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: 'banner',
      type: 'info',
      text: `================================================================
  CHRISHEM ETHICAL HACKER - VIRTUAL KALI LAB ENVIRONMENT (v2.6)
  Simulated Target: 192.168.56.102 (Metasploitable 2)
  Attacker Host:   192.168.56.101 (Kali Linux x86_64)
  Authorized Scope: HOST-ONLY LAB (ROE Signed by Chrishem)
================================================================
Type 'help' to view available offensive tools and scenarios.`,
    },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialCommand) {
      setInputVal(initialCommand);
    }
  }, [initialCommand]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCopyLogs = () => {
    const text = history.map((h) => (h.type === 'input' ? `kali@chrishem:~$ ${h.text}` : h.text)).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    // Record command
    const inputId = `in-${Date.now()}`;
    const newLines: TerminalLine[] = [{ id: inputId, type: 'input', text: trimmed }];

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const lower = trimmed.toLowerCase();

    // Command parser simulation
    if (lower === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    } else if (lower === 'help') {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: `Available Simulated Commands & Utilities:
  nmap [flags] <target>       - Network port scanner (-sC, -sV, -p-, vuln)
  gobuster dir -u <url> ...   - Web directory brute-forcer
  hydra [flags] <target>      - Online authentication brute-forcer
  hashcat -m <mode> ...       - GPU-accelerated hash cracker
  msfconsole                  - Metasploit Framework interactive console
  searchsploit <query>        - Search local Exploit-DB archive
  linpeas                     - Run automated Linux privilege escalation triage
  whoami / id / uname -a      - System enumeration commands
  cat <file>                  - Read simulated files (/etc/passwd, /etc/shadow)
  banner                      - Redisplay environment banner
  clear                       - Clear terminal screen

Or select one of the Guided Scenarios from the toolbar above!`,
      });
    } else if (lower === 'banner') {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'info',
        text: `CHRISHEM ETHICAL HACKING WORKBENCH - ACTIVE SESSION\nTarget Subnet: 192.168.56.0/24 | Sandbox Status: SAFE & ISOLATED`,
      });
    } else if (lower.startsWith('nmap')) {
      if (lower.includes('vuln')) {
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'success',
          text: `Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-17 04:30 EST
Nmap scan report for 192.168.56.102
Host is up (0.00042s latency).
PORT    STATE SERVICE
21/tcp  open  ftp
| vsftpd-backdoor:
|   VULNERABLE: vsFTPd version 2.3.4 backdoor
|   State: VULNERABLE (Exploitable)
|   IDs:  BID:48539  CVE:CVE-2011-2523
|_  Exploit results: Backdoor execution confirmed on port 6200!
80/tcp  open  http
|_http-csrf: Couldn't find any CSRF vulnerabilities.
| http-enum:
|   /dvwa/: Damn Vulnerable Web App
|   /phpmyadmin/: phpMyAdmin Directory
445/tcp open  netbios-ssn
|_smb-vuln-ms08-067: false

Nmap done: 1 IP address (1 host up) scanned in 4.12 seconds`,
        });
      } else if (lower.includes('-sc') || lower.includes('-sv') || lower.includes('-p')) {
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for 192.168.56.102
Host is up (0.00031s latency).
Not shown: 994 closed ports
PORT     STATE SERVICE     VERSION
21/tcp   open  ftp         vsftpd 2.3.4
22/tcp   open  ssh         OpenSSH 4.7p1 Debian 8ubuntu1 (protocol 2.0)
23/tcp   open  telnet      Linux telnetd
25/tcp   open  smtp        Postfix smtpd
80/tcp   open  http        Apache httpd 2.2.8 ((Ubuntu) DAV/2)
445/tcp  open  netbios-ssn Samba smbd 3.0.20-Debian
3306/tcp open  mysql       MySQL 5.0.51a-3ubuntu5
MAC Address: 08:00:27:12:34:56 (Oracle VirtualBox)
Service Info: Host: metasploitable.localdomain; OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 6.45 seconds`,
        });
      } else {
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `Starting Nmap 7.94
Nmap scan report for 192.168.56.102
Host is up (0.00021s latency).
PORT   STATE SERVICE
21/tcp open  ftp
22/tcp open  ssh
80/tcp open  http
Nmap done: 1 IP address scanned in 1.15 seconds`,
        });
      }
    } else if (lower.startsWith('gobuster') || lower.startsWith('ffuf')) {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: `===============================================================
Gobuster v3.6 - Chrishem Web Fuzzer
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.56.102
[+] Method:                  GET
[+] Threads:                 30
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Negative Status codes:   404
===============================================================
Starting gobuster dir...
===============================================================
/cgi-bin/             (Status: 403) [Size: 326]
/doc/                 (Status: 403) [Size: 322]
/dvwa                 (Status: 302) [Size: 0] [--> login.php]
/index.php            (Status: 200) [Size: 1120]
/mutillidae           (Status: 301) [Size: 338] [--> mutillidae/]
/phpMyAdmin           (Status: 200) [Size: 312]
/robots.txt           (Status: 200) [Size: 45]
/server-status        (Status: 403) [Size: 330]
/test                 (Status: 200) [Size: 15]
/twiki                (Status: 302) [Size: 0] [--> bin/view]
===============================================================
Finished in 2.84s! Found 10 directories/files.`,
      });
    } else if (lower.startsWith('hashcat')) {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'success',
        text: `hashcat (v6.2.6) starting in GPU simulation mode...
* Device #1: NVIDIA GeForce RTX (OpenCL 3.0)
* Initializing hash engine...
* Hashes parsed: 1 / 1 (100.00%)
* Target dictionary: /usr/share/wordlists/rockyou.txt (14,344,392 words)
* Rules: None

[s]tatus [p]ause [b]ypass [c]heckpoint [q]uit => 

cc32e74277b0709e99eb020bf23a4a06:password123

Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 1000 (NTLM)
Hash.Target......: cc32e74277b0709e99eb020bf23a4a06
Time.Started.....: Sat Oct 17 04:32:00 2026 (0 sec)
Speed.#1.........: 1,842.1 MH/s
Recovered........: 1/1 (100.00%) Digests, 1/1 (100.00%) Salts
Progress.........: 128450/14344392 (0.89%)
Approaching complete shutdown...`,
      });
    } else if (lower.startsWith('hydra')) {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'success',
        text: `Hydra v9.5 (c) 2026 by van Hauser / THC & David Bombal - Please use legally!
[DATA] max 4 tasks per target, 1 target, 14344392 passwords in dictionary
[ATTACK] attacking ssh://192.168.56.102:22/
[22][ssh] host: 192.168.56.102   login: msfadmin   password: msfadmin
[STATUS] attack finished for 192.168.56.102 (server completed)
1 of 1 target successfully completed, 1 valid password found.`,
      });
    } else if (lower.startsWith('msfconsole')) {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'info',
        text: `
      .:okOOOkdc'           'cdkOOOko:.
    .xOOOOOOOOOOOOc       cOOOOOOOOOOOOx.
   :OOOOOOOOOOOOOOOk:   :kOOOOOOOOOOOOOOO:
  'OOOOOOOOOkkkkOOOOO: :OOOOOOOOOOOOOOOOOO'
  oOOOOOOOO.    .oOOOO:OOOOo.    .OOOOOOOOo
  dOOOOOOOO.      .cOOOOOc.      .OOOOOOOOd
  lOOOOOOOO.         ;d;         .OOOOOOOOl
  .OOOOOOOO.                     .OOOOOOOO.
   kOOOOOOO.                     .OOOOOOOk
    vOOOOOO.                     .OOOOOOv
     :OOOOO.                     .OOOOO:
       'kOO.                     .OOk'
         'o.                     .o'

       =[ metasploit v6.3.55-dev                          ]
+ -- --=[ 2420 exploits - 1245 auxiliary - 428 post       ]
+ -- --=[ 1465 payloads - 47 encoders - 13 nops           ]
+ -- --=[ Free educational sandbox mode                   ]

msf6 > use exploit/unix/ftp/vsftpd_234_backdoor
msf6 exploit(unix/ftp/vsftpd_234_backdoor) > set RHOSTS 192.168.56.102
RHOSTS => 192.168.56.102
msf6 exploit(unix/ftp/vsftpd_234_backdoor) > exploit

[*] 192.168.56.102:21 - Banner: 220 (vsFTPd 2.3.4)
[*] 192.168.56.102:21 - USER: 331 Please specify the password.
[+] 192.168.56.102:21 - Backdoor service spawned!
[*] Command shell session 1 opened (192.168.56.101:4444 -> 192.168.56.102:6200)

id
uid=0(root) gid=0(root) groups=0(root)
[!] YOU ARE ROOT! Target fully compromised.`,
      });
    } else if (lower.startsWith('searchsploit')) {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: `-------------------------------------------------------------------------------------------------------- ---------------------------------
 Exploit Title                                                                                          |  Path
-------------------------------------------------------------------------------------------------------- ---------------------------------
vsftpd 2.3.4 - Backdoor Command Execution                                                               | unix/remote/49757.py
vsftpd 2.3.4 - Backdoor Command Execution (Metasploit)                                                  | unix/remote/17491.rb
Apache + PHP < 5.3.12 / < 5.4.2 - cgi-bin Remote Code Execution                                          | php/remote/29290.c
Samba 3.0.20 < 3.0.25rc3 - 'Username' map script' Command Execution (Metasploit)                        | unix/remote/16320.rb
-------------------------------------------------------------------------------------------------------- ---------------------------------
Shellcodes: No Results
Papers: No Results`,
      });
    } else if (lower.startsWith('linpeas')) {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'info',
        text: `[+] ================================================================
[+]               LINPEAS - Linux Privilege Escalation
[+] ================================================================
[*] Current user: kali (uid=1000)
[*] OS: Linux 6.8.0-kali3-amd64
[*] SUID Binaries (Red/Yellow = 99% PrivEsc vector):
    /usr/bin/sudo .................................... Sudo version 1.9.15
    /tmp/rootbash ................................... [!] CRITICAL: SUID Bash found! Run: /tmp/rootbash -p
    /usr/bin/passwd .................................. Standard SUID
[*] Sudo rights:
    Matching Defaults entries for kali:
    User kali may run the following commands on this host:
        (ALL : ALL) ALL
[+] Linpeas finished! Found 1 instant root vector.`,
      });
    } else if (lower === 'whoami') {
      newLines.push({ id: `out-${Date.now()}`, type: 'output', text: 'kali' });
    } else if (lower === 'id') {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: 'uid=1000(kali) gid=1000(kali) groups=1000(kali),27(sudo),100(users)',
      });
    } else if (lower.startsWith('uname')) {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: 'Linux kali-chrishem 6.8.0-kali3-amd64 #1 SMP PREEMPT_DYNAMIC Kali 2026.1 x86_64 GNU/Linux',
      });
    } else if (lower.startsWith('cat /etc/passwd')) {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: `root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nkali:x:1000:1000:Chrishem Student,,,:/home/kali:/bin/bash\nmsfadmin:x:1001:1001:Metasploitable Admin,,,:/home/msfadmin:/bin/bash`,
      });
    } else if (lower.startsWith('cat /etc/shadow')) {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'error',
        text: 'cat: /etc/shadow: Permission denied (You must be root to view hashes!)',
      });
    } else {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: `[Executed in virtual environment]: Command '${trimmed}' completed.\nType 'help' for standard pentesting tool simulations (nmap, hydra, hashcat, msfconsole, gobuster).`,
      });
    }

    setHistory((prev) => [...prev, ...newLines]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex] || '');
      }
    }
  };

  const presetScenarios = [
    { label: 'Nmap -sC -sV Scan', cmd: 'nmap -sC -sV 192.168.56.102' },
    { label: 'Nmap --script vuln', cmd: 'nmap --script vuln 192.168.56.102' },
    { label: 'Gobuster Dir Fuzz', cmd: 'gobuster dir -u http://192.168.56.102 -w common.txt' },
    { label: 'Crack NTLM Hash', cmd: 'hashcat -m 1000 cc32e74277b0709e99eb020bf23a4a06 rockyou.txt' },
    { label: 'Metasploit Exploit', cmd: 'msfconsole' },
    { label: 'Linpeas PrivEsc', cmd: 'linpeas' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <div className="flex items-center gap-2 ml-3">
            <TerminalIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-medium text-neutral-300">
              kali@chrishem-lab:~ (Virtual Pentest Terminal)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeChapterTitle && (
            <span className="text-[11px] font-mono text-neutral-400 hidden md:inline-block truncate max-w-[200px]">
              Active: {activeChapterTitle}
            </span>
          )}
          <button
            onClick={handleCopyLogs}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            title="Copy Terminal Logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={() => setHistory([])}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            title="Reset Terminal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Preset Quick-Run Toolbar */}
      <div className="px-3 py-2 bg-neutral-900/60 border-b border-neutral-800/80 flex items-center gap-1.5 overflow-x-auto text-xs font-mono scrollbar-none">
        <span className="text-neutral-500 text-[11px] whitespace-nowrap flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-emerald-400" /> Quick Labs:
        </span>
        {presetScenarios.map((sc, idx) => (
          <button
            key={idx}
            onClick={() => executeCommand(sc.cmd)}
            className="px-2.5 py-1 rounded bg-neutral-800/80 hover:bg-emerald-950 hover:text-emerald-300 hover:border-emerald-700/60 border border-neutral-700/50 text-neutral-300 transition-all text-xs whitespace-nowrap flex items-center gap-1"
          >
            <Play className="w-2.5 h-2.5 text-emerald-400" />
            {sc.label}
          </button>
        ))}
      </div>

      {/* Output Console Screen */}
      <div
        className="flex-1 p-4 overflow-y-auto font-mono text-xs sm:text-sm text-neutral-200 space-y-2 select-text"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((line) => {
          if (line.type === 'input') {
            return (
              <div key={line.id} className="flex items-start gap-2 text-emerald-400">
                <span className="text-emerald-500 font-bold select-none">kali@chrishem:~$</span>
                <span className="text-neutral-100 font-semibold">{line.text}</span>
              </div>
            );
          }
          if (line.type === 'error') {
            return (
              <div key={line.id} className="text-red-400 whitespace-pre-wrap pl-2 border-l-2 border-red-500/50 py-0.5">
                {line.text}
              </div>
            );
          }
          if (line.type === 'success') {
            return (
              <div key={line.id} className="text-emerald-300 whitespace-pre-wrap pl-2 border-l-2 border-emerald-500/50 py-0.5 bg-emerald-950/10">
                {line.text}
              </div>
            );
          }
          if (line.type === 'info') {
            return (
              <div key={line.id} className="text-sky-300 whitespace-pre-wrap pl-2 border-l-2 border-sky-500/50 py-0.5">
                {line.text}
              </div>
            );
          }
          return (
            <div key={line.id} className="text-neutral-300 whitespace-pre-wrap leading-relaxed">
              {line.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Input Line */}
      <div className="p-3 bg-neutral-900 border-t border-neutral-800 flex items-center gap-2">
        <span className="text-emerald-400 font-mono text-xs sm:text-sm font-bold select-none whitespace-nowrap">
          kali@chrishem:~$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type an offensive command (e.g. nmap -sC -sV 192.168.56.102) or 'help'..."
          className="flex-1 bg-transparent text-neutral-100 font-mono text-xs sm:text-sm focus:outline-none placeholder:text-neutral-600"
          autoFocus
        />
        <button
          onClick={() => executeCommand(inputVal)}
          disabled={!inputVal.trim()}
          className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600 text-white font-mono text-xs flex items-center gap-1 transition-all"
        >
          <span>Run</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

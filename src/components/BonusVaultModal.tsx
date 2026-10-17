import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  FileCheck,
} from 'lucide-react';

interface BonusVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  onTriggerUpgrade: () => void;
}

interface TemplateDoc {
  id: string;
  title: string;
  filename: string;
  description: string;
  icon: string;
  content: string;
}

const TEMPLATES: TemplateDoc[] = [
  {
    id: 'roe',
    title: 'Rules of Engagement (ROE) Charter',
    filename: 'HACKFORGE_Rules_of_Engagement_Template.md',
    description: 'Standardized operational contract defining authorized testing windows, testing scopes, IP ranges, emergency contact protocols, and prohibited attack vectors.',
    icon: '🛡️',
    content: `# PENETRATION TESTING RULES OF ENGAGEMENT (ROE) CHARTER
Confidential & Privileged Document

---

## 1. PARTIES & AUTHORIZATION
- Assessor Organization: Hackforge Security Consulting / [Lead Pentester: Chrishem]
- Client Organization: [Client Company Legal Name]
- Primary Technical Point of Contact (24/7 Escalation): [Name, Phone, PGP Key]
- Assessor Lead Emergency Contact: [Name, Phone, Emergency Hotline]

## 2. SCOPE & IP RANGE SPECIFICATIONS
The testing activities are strictly confined to the following designated IP subnets and fully qualified domain names (FQDNs):

### Authorized In-Scope Assets
- Subnet 1: 192.168.10.0/24 (Internal Corporate LAN)
- Web Application: https://portal.client-domain.com
- API Endpoint: https://api.client-domain.com/v2

### Explicitly Out-of-Scope Assets (STRICTLY PROHIBITED)
- Any third-party SaaS providers (e.g. AWS console, Office 365, Salesforce).
- Production payment processing gateways (PCI DSS boundary).
- Production SCADA / OT building automation controllers.

## 3. TIMING & OPERATIONAL WINDOWS
- Authorized Testing Dates: [Start Date] through [End Date]
- Daily Testing Window: 20:00 EST to 04:00 EST (Off-peak maintenance window).
- Notification Protocol: Assessor shall email technical contacts 15 minutes prior to launching aggressive automated vulnerability scanners (e.g., Nessus, Nuclei).

## 4. PROHIBITED ACTIONS
1. Denial of Service (DoS / DDoS) attacks or intentional service disruption.
2. Physical building intrusions or lock picking unless explicitly stated in Addendum B.
3. Unsolicited destructive data modification, database truncation, or ransomware simulation without prior written executive consent.

## 5. EMERGENCY SUSPENSION PROCEDURE
In the event of unexpected business disruption or suspected true external malicious intrusion:
1. Client technical contact calls Assessor Hotline: [PHONE NUMBER].
2. Assessor immediately halts all scans, listener processes, and exploits.
3. Both parties convene on an emergency bridge within 15 minutes.

---

Authorized Client Signatory: _______________________  Date: ___________
Lead Assessor Signatory (Chrishem): _______________  Date: ___________
`,
  },
  {
    id: 'auth-letter',
    title: 'Penetration Testing Authorization & "Get Out of Jail Free" Letter',
    filename: 'HACKFORGE_Authorization_To_Test_Letter.md',
    description: 'Executive written consent document affirming compliance under CFAA (18 U.S.C. § 1030) and Computer Misuse Act. Essential carry document during red team engagements.',
    icon: '📜',
    content: `# EXECUTIVE AUTHORIZATION TO CONDUCT PENETRATION TESTING
TO WHOM IT MAY CONCERN / LAW ENFORCEMENT & SYSTEM ADMINISTRATORS

Date: [CURRENT DATE]
Engagement Reference ID: HF-ROE-2026-0429

Please be advised that [Lead Assessor Name / Chrishem] of Hackforge Cyber Security is under active legal contract with [Client Organization Name] to conduct authorized security assessments, penetration testing, and vulnerability audits against our computer systems and networks.

### 1. Legal Basis & CFAA Compliance
This letter certifies that all security probing, port scanning, exploitation attempts, and network traffic originating from the following authorized source IP addresses:
- Assessor Source IP 1: 198.51.100.42
- Assessor Source IP 2: 203.0.113.88

Are fully authorized by executive management. This activity does NOT constitute unauthorized access under:
- Computer Fraud and Abuse Act (CFAA), 18 U.S.C. § 1030.
- UK Computer Misuse Act 1990.
- Relevant national cybersecurity and unauthorized access legislation.

### 2. Immediate Verification Contact
If you observe suspicious traffic originating from the IPs above, or require immediate verification of this testing authorization, contact our CISO immediately:
- CISO Name: [CISO Full Name]
- Direct Mobile Phone: +1 (555) 019-2834
- Corporate Operations Center: +1 (555) 019-9999

Signed with full executive legal authority:
Chief Information Security Officer (CISO)
[Client Organization Name]
`,
  },
  {
    id: 'report-template',
    title: 'Executive Vulnerability Findings & Remediation Report',
    filename: 'HACKFORGE_Executive_Pentest_Report_Template.md',
    description: 'Publication-grade technical report template including executive summary, severity matrix, CVSS breakdown, proof-of-concept template, and remediation roadmaps.',
    icon: '📊',
    content: `# PENETRATION TESTING ASSESSMENT REPORT
Target Organization: [Client Enterprise Systems]
Assessment Lead: Chrishem (Hackforge Security Academy)
Classification: STRICTLY CONFIDENTIAL
Report Date: [Date of Final Delivery]

---

## 1. EXECUTIVE SUMMARY
Hackforge Security was retained by [Client Organization] to perform an intensive Black-Box Network and Web Application Penetration Test between [Start Date] and [End Date].

### Summary of Findings
During the assessment, our engineers identified a total of [X] vulnerabilities:
- Critical: 1 (Remote Code Execution via unauthenticated vsftpd backdoor)
- High: 2 (SQL Injection in customer lookup endpoint, Kerberoastable Domain Admin SPN)
- Medium: 4 (Missing CSP headers, Outdated Apache version, Insecure TLS ciphers)
- Low / Informational: 3 (Verbose server banners, robots.txt disclosure)

---

## 2. DETAILED FINDING: HF-01 (CRITICAL)
### Vulnerability Title: Unauthenticated Remote Code Execution via Backdoored FTP Daemon

- Severity: CRITICAL
- CVSS 3.1 Base Score: 9.8 (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
- Affected Host: 192.168.56.102:21 (vsFTPd v2.3.4)

### Description
The FTP service listening on TCP port 21 contains a known malicious backdoor inserted into the official upstream archive. When a username ending with :) is supplied, the daemon spawns an unauthenticated root command shell on TCP port 6200.

### Proof of Concept (PoC)
1. Netcat connection to port 21:
   nc -vn 192.168.56.102 21
   USER backdoor:)
   PASS password

2. Immediate backdoor shell access on port 6200:
   nc -vn 192.168.56.102 6200
   id
   uid=0(root) gid=0(root)

### Business Risk & Impact
An unauthenticated external attacker can achieve complete compromise of the underlying host, inspect memory contents, pivot deeper into internal Active Directory subnets, and exfiltrate corporate databases.

### Recommended Remediation
1. Immediately remove the backdoored vsftpd package.
2. Upgrade to a maintained package: apt-get install vsftpd or transition to SFTP over SSH.
3. Block external egress traffic on port 6200 via host firewall (ufw or iptables).
`,
  },
  {
    id: 'roadmap-90d',
    title: '90-Day OSCP & PNPT Practical Study Roadmap',
    filename: 'HACKFORGE_90_Day_OSCP_PNPT_Master_Schedule.md',
    description: 'Structured 12-week day-by-day training schedule balancing theory, hands-on CTF machines, active directory labs, and mock reporting days.',
    icon: '🎯',
    content: `# HACKFORGE 90-DAY OSCP & PNPT PRACTICAL STUDY ROADMAP
Engineered by Chrishem for Rapid Certification Readiness

---

## MONTH 1: Foundations & Core Tooling (Weeks 1–4)
- Week 1: Linux terminal fluency, file permissions, bash scripting, SUID enumeration.
- Week 2: Networking fundamentals, Wireshark packet capture, TCP 3-way handshake analysis.
- Week 3: Deep Nmap mastery: NSE scripting, timing templates, UDP scan triage.
- Week 4: Web enumeration: ffuf, gobuster, dirsearch, Nikto, and parameter fuzzing.
- Milestone: Complete 10 Beginner Linux machines on Proving Grounds Play.

## MONTH 2: Web Exploitation & Privilege Escalation (Weeks 5–8)
- Week 5: OWASP Top 10: SQL injection (manual + sqlmap), Command Injection, LFI/RFI.
- Week 6: Linux Privilege Escalation: Cron jobs, PATH hijacking, capabilities, wildcards.
- Week 7: Windows Privilege Escalation: Unquoted service paths, SeImpersonate, token stealing.
- Week 8: Password attacks: Hashcat GPU tuning, John the Ripper, Hydra online brute-forcing.
- Milestone: Solve 15 Intermediate Linux/Windows CTF machines without walk-through hints.

## MONTH 3: Active Directory, Pivoting & Exam Simulation (Weeks 9–12)
- Week 9: Active Directory enumeration: BloodHound-python, LDAP query filtering, PowerView.
- Week 10: AD Exploitation: Kerberoasting, AS-REP roasting, DCSync, Pass-the-Hash.
- Week 11: Network Pivoting: Chisel reverse tunnels, SSH port forwarding, Ligolo-ng.
- Week 12: Full 24-Hour Mock Exam Simulation: 3 standalone targets + 1 Active Directory set, followed by writing a full professional pentest report within 24 hours.
`,
  },
];

export const BonusVaultModal: React.FC<BonusVaultModalProps> = ({
  isOpen,
  onClose,
  isPro,
  onTriggerUpgrade,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<TemplateDoc>(TEMPLATES[0]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (doc: TemplateDoc) => {
    const blob = new Blob([doc.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', doc.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-5xl h-[92vh] bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  BONUS RESOURCE VAULT & DOWNLOADS
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400">
                  Ready-to-Use Client Documents
                </span>
              </div>
              <h2 className="text-base font-bold text-neutral-100">
                Professional Engagement Templates & Study Roadmaps
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Document List */}
          <div className="w-full md:w-80 bg-neutral-900/60 border-r border-neutral-800 p-3 space-y-2 overflow-y-auto">
            <div className="px-2 py-1 text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">
              Included Templates
            </div>
            {TEMPLATES.map((doc) => {
              const isSelected = selectedDoc.id === doc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`w-full text-left p-3 rounded-xl transition-all space-y-1 ${
                    isSelected
                      ? 'bg-emerald-950/80 border border-emerald-500/50 text-neutral-100 shadow'
                      : 'hover:bg-neutral-800/60 text-neutral-400 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-xs text-neutral-200">
                    <span>{doc.icon}</span>
                    <span className="truncate">{doc.title}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right: Preview & Download */}
          <div className="flex-1 flex flex-col overflow-hidden bg-neutral-950">
            {/* Action Bar */}
            <div className="p-4 bg-neutral-900/40 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-100">
                  {selectedDoc.title}
                </h3>
                <span className="text-xs font-mono text-neutral-400">
                  {selectedDoc.filename}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(selectedDoc.content)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={() => handleDownload(selectedDoc)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .MD File</span>
                </button>
              </div>
            </div>

            {/* Document Markdown Preview */}
            <div className="flex-1 overflow-y-auto p-6 font-mono text-xs text-neutral-300 leading-relaxed bg-[#090b10] select-text">
              <pre className="whitespace-pre-wrap font-sans">
                {selectedDoc.content}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

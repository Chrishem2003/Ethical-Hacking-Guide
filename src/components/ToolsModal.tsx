import React, { useState } from 'react';
import { CvssCalculator } from './tools/CvssCalculator';
import { ReverseShellForge } from './tools/ReverseShellForge';
import { HashIdentifierTool } from './tools/HashIdentifierTool';
import { SubnetCalculator } from './tools/SubnetCalculator';
import { PayloadEncoderTool } from './tools/PayloadEncoderTool';
import {
  X,
  Calculator,
  Zap,
  Key,
  Network,
  Wrench,
  Binary
} from 'lucide-react';

interface ToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'cvss' | 'revshell' | 'hash' | 'subnet' | 'encoder';
}

export const ToolsModal: React.FC<ToolsModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'cvss',
}) => {
  const [activeTab, setActiveTab] = useState<'cvss' | 'revshell' | 'hash' | 'subnet' | 'encoder'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-4xl h-[90vh] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 bg-neutral-950 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                HACKFORGE UTILITIES SUITE
              </span>
              <h3 className="text-sm font-bold text-neutral-100">
                Offensive Security Field Tools
              </h3>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs">
            <button
              onClick={() => setActiveTab('cvss')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'cvss' ? 'bg-emerald-600 text-white shadow' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>CVSS 3.1</span>
            </button>
            <button
              onClick={() => setActiveTab('revshell')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'revshell' ? 'bg-emerald-600 text-white shadow' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Reverse Shells</span>
            </button>
            <button
              onClick={() => setActiveTab('hash')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'hash' ? 'bg-emerald-600 text-white shadow' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Hash ID</span>
            </button>
            <button
              onClick={() => setActiveTab('subnet')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'subnet' ? 'bg-emerald-600 text-white shadow' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Subnetting</span>
            </button>
            <button
              onClick={() => setActiveTab('encoder')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'encoder' ? 'bg-emerald-600 text-white shadow' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Binary className="w-3.5 h-3.5" />
              <span>Encoder</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'cvss' && <CvssCalculator />}
          {activeTab === 'revshell' && <ReverseShellForge />}
          {activeTab === 'hash' && <HashIdentifierTool />}
          {activeTab === 'subnet' && <SubnetCalculator />}
          {activeTab === 'encoder' && <PayloadEncoderTool />}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  Sparkles,
  CreditCard,
  Flame,
  Award,
  Terminal,
  ArrowRight
} from 'lucide-react';

interface LemonSqueezyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
  lockedLessonTitle?: string;
}

export const LemonSqueezyModal: React.FC<LemonSqueezyModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess,
  lockedLessonTitle,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setIsProcessing(true);
    // Simulate Lemon Squeezy checkout redirect & webhook
    setTimeout(() => {
      setIsProcessing(false);
      onUpgradeSuccess();
      onClose();
    }, 1200);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'HACKFORGE' || clean === 'CHRISHEM' || clean === 'PRO' || clean === 'STUDENT') {
      setPromoMessage('✅ Promo voucher applied: 100% OFF Pro Access!');
      setTimeout(() => {
        onUpgradeSuccess();
        onClose();
      }, 900);
    } else {
      setPromoMessage('Invalid voucher code. Try "CHRISHEM" for instant test access.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-950 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Lemon Squeezy Checkout
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {lockedLessonTitle && (
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 flex items-center gap-3 text-xs text-amber-200">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-semibold text-amber-300">Pro Lesson Gated: </span>
                "{lockedLessonTitle}" requires an active HACKFORGE Pro membership.
              </div>
            </div>
          )}

          {/* Value Pitch */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <Flame className="w-3.5 h-3.5 fill-current text-amber-400" />
              ACCELERATE TO SIX-FIGURE OFFENSIVE SECURITY ROLES
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
              Unlock HACKFORGE Pro
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
              Get unrestricted access to Part 3 (Active Directory, Privilege Escalation) and Part 4 (Executive Reporting & Career), plus dedicated lab containers and accredited certification.
            </p>
          </div>

          {/* Pricing Highlight Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-neutral-950 to-neutral-900 border-2 border-emerald-500/60 shadow-xl space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-neutral-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-neutral-100">Lifetime Professional Pass</h3>
                <p className="text-xs text-neutral-400">One-time payment • Lifetime updates • All 24 Modules</p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-neutral-100">$49</span>
                  <span className="text-xs text-neutral-500 line-through">$149</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-semibold">67% OFF LAUNCH SPECIAL</span>
              </div>
            </div>

            {/* Included features */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Full Part 3 (Active Directory & Kerberoasting)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Full Part 4 (Executive Reports & CTF Plan)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dedicated 60-min TTL Lab Containers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24/7 AI Security Mentor (Chrishem Knowledge Engine)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Official Accredited Certificate Signed by Chrishem</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Production Pentest Scope & ROE Templates</span>
              </li>
            </ul>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {isProcessing ? 'Connecting to Lemon Squeezy...' : 'Unlock Lifetime Pro Now ($49)'}
              </span>
            </button>
          </div>

          {/* Promo Code Bypass for Testing / Free Vouchers */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <span className="text-[11px] font-mono text-neutral-400 uppercase">
              Have a creator voucher or reviewer key?
            </span>
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code (e.g. CHRISHEM)..."
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 uppercase font-mono focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 font-medium transition-colors"
              >
                Apply Voucher
              </button>
            </form>
            {promoMessage && (
              <div
                className={`text-xs ${
                  promoMessage.startsWith('✅') ? 'text-emerald-400 font-semibold' : 'text-amber-400'
                }`}
              >
                {promoMessage}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-neutral-950 border-t border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-between">
          <span>Encrypted 256-bit SSL Checkout via Lemon Squeezy</span>
          <span>14-day Money-back guarantee</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  ShieldCheck,
  X,
  Lock,
  Unlock,
  KeyRound,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { CyberButton } from './CyberButton.tsx';
import { playSuccessSound, playAlertSound } from '../utils/audio.ts';

interface MfaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MfaModal: React.FC<MfaModalProps> = ({ isOpen, onClose }) => {
  const [totpCode, setTotpCode] = useState('849 204');
  const [timeLeft, setTimeLeft] = useState(30);
  const [userEnteredCode, setUserEnteredCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<'idle' | 'success' | 'fail'>('idle');

  // TOTP 30-second cycle simulator
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = 30 - (now % 30);
      setTimeLeft(remaining);

      if (remaining === 30) {
        // Generate new 6 digit code
        const p1 = Math.floor(100 + Math.random() * 900);
        const p2 = Math.floor(100 + Math.random() * 900);
        setTotpCode(`${p1} ${p2}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = () => {
    const rawClean = totpCode.replace(/\s+/g, '');
    const userClean = userEnteredCode.replace(/\s+/g, '');

    if (userClean === rawClean) {
      playSuccessSound();
      setVerificationResult('success');
    } else {
      playAlertSound();
      setVerificationResult('fail');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl shadow-cyan-950/50 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
          aria-label="閉じる"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              DEFENSE LAB DEMO
            </div>
            <h3 className="text-xl font-black text-white">
              2要素認証 (TOTP) 体験シミュレータ
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          パスワードが万が一漏洩しても、手元の端末で30秒毎に変動するワンタイムパスワード（TOTP）や生体パスキーがあれば、攻撃者の不正ログインは完全に遮断されます。
        </p>

        {/* Mock Authenticator Device */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center mb-6">
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-center gap-1.5 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            認証アプリ (Google Authenticator / 1Password)
          </div>

          <div className="text-3xl md:text-4xl font-mono font-black text-cyan-400 tracking-widest my-2 select-all">
            {totpCode}
          </div>

          {/* Countdown timer circle/bar */}
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
            <span>コード更新まで:</span>
            <span className="font-bold text-cyan-300">{timeLeft}秒</span>
            <div className="w-24 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-cyan-400 transition-all duration-1000 ease-linear"
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Verification Test */}
        <div className="space-y-3 mb-6">
          <label htmlFor="mfa-verify-input" className="block text-xs font-mono text-slate-400 font-bold">
            端末のコードを入力して認証テスト:
          </label>
          <div className="flex gap-2">
            <input
              id="mfa-verify-input"
              type="text"
              value={userEnteredCode}
              onChange={(e) => setUserEnteredCode(e.target.value)}
              placeholder="例: 849204"
              maxLength={7}
              className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-400 text-white px-3 py-2.5 rounded-xl font-mono text-center tracking-widest outline-none text-base"
            />
            <CyberButton onClick={handleVerify} variant="primary">
              認証確認
            </CyberButton>
          </div>

          {verificationResult === 'success' && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>認証成功！パスワード＋物理所持要素により、ハッカーの侵入を阻止しました。</span>
            </div>
          )}

          {verificationResult === 'fail' && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>コード不一致！攻撃者は所持端末がないため、これ以上ログインできません。</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <CyberButton onClick={onClose} variant="secondary">
            閉じる
          </CyberButton>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState, useRef } from 'react';
import {
  Award,
  Zap,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Printer,
  Share2,
  Key,
  Mail,
  Smartphone,
  ExternalLink,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CyberButton } from './CyberButton.tsx';
import { calculateOverallEvaluation } from '../utils/securityLogic.ts';
import { playSuccessSound } from '../utils/audio.ts';

interface ResultModuleProps {
  scores: {
    password: number;
    phishing: number;
    defense: number;
  };
  onRestart: () => void;
  onNavigateToTab: (tab: 'password' | 'phishing' | 'defense') => void;
}

export const ResultModule: React.FC<ResultModuleProps> = ({
  scores,
  onRestart,
  onNavigateToTab,
}) => {
  const [agentName, setAgentName] = useState('Agent-Sentinel');
  const [isEditingName, setIsEditingName] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const evaluation = calculateOverallEvaluation(scores);

  useEffect(() => {
    if (evaluation.score >= 70) {
      playSuccessSound();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore confetti error
      }
    }
  }, [evaluation.score]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `【サイバーセキュリティ体験シミュレーター】私のセキュリティ総合評価は [Rank ${evaluation.rank}] ${evaluation.score}点でした！ #CyberSecurity #CyberShield`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="space-y-8 animate-in zoom-in duration-500 max-w-4xl mx-auto">
      {/* Official Certificate Card */}
      <div
        ref={certificateRef}
        className="bg-slate-900 border-2 border-cyan-500/40 rounded-3xl p-6 md:p-10 shadow-2xl shadow-cyan-950/40 relative overflow-hidden backdrop-blur-md"
      >
        {/* Futuristic Corner Ornaments */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-2xl" />

        {/* Certificate Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 text-cyan-400">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold tracking-widest text-cyan-400">
                CYBER DEFENSE CERTIFICATION
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                サイバーセキュリティ防衛能力 認定証
              </h2>
            </div>
          </div>

          {/* Agent ID & Name */}
          <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 block text-[10px]">OPERATIVE CODENAME:</span>
            {isEditingName ? (
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                autoFocus
                className="bg-slate-900 border border-cyan-400 text-white px-2 py-0.5 rounded outline-none font-bold text-xs"
              />
            ) : (
              <span
                onClick={() => setIsEditingName(true)}
                className="font-bold text-cyan-300 hover:text-white cursor-pointer underline decoration-dotted"
                title="クリックしてコードネームを変更"
              >
                {agentName} ✎
              </span>
            )}
          </div>
        </div>

        {/* Central Rank Badge */}
        <div className="py-8 text-center flex flex-col items-center justify-center relative">
          <div className="text-xs font-mono tracking-widest text-slate-400 uppercase mb-2">
            OVERALL DEFENSE CLEARANCE
          </div>

          <div
            className={`w-32 h-32 md:w-36 md:h-36 rounded-full flex flex-col items-center justify-center border-4 shadow-2xl relative my-3 ${
              evaluation.badgeBg
            } ${evaluation.rankColor} border-current`}
          >
            <div className="text-6xl md:text-7xl font-black font-mono tracking-tighter">
              {evaluation.rank}
            </div>
            <div className="text-[11px] font-mono tracking-wider font-extrabold uppercase mt-1">
              TIER {evaluation.rank}
            </div>
          </div>

          <div className={`text-2xl md:text-3xl font-black mt-2 ${evaluation.rankColor}`}>
            [{evaluation.rankTitle}]
          </div>

          <div className="text-sm font-mono text-cyan-400 font-bold mt-1">
            総合防衛スコア: {evaluation.score} / 100 PTS
          </div>

          <p className="text-slate-300 text-sm max-w-lg mt-3 leading-relaxed text-center">
            {evaluation.description}
          </p>
        </div>

        {/* Detailed Competency Breakdown */}
        <div className="space-y-4 bg-slate-950/70 p-6 rounded-2xl border border-slate-800 mb-8">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            防衛スキル別 監査レーダー
          </h3>

          {/* Module 1 */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                1. パスワード堅牢性 & エントロピー耐性 (35%)
              </span>
              <button
                type="button"
                onClick={() => onNavigateToTab('password')}
                className="text-cyan-400 hover:underline"
              >
                再検証 ↗
              </button>
              <span className="font-bold text-white">{scores.password} / 100</span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.max(scores.password, 2)}%` }}
              />
            </div>
          </div>

          {/* Module 2 */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                2. フィッシング詐欺 & 偽装ドメイン識別力 (35%)
              </span>
              <button
                type="button"
                onClick={() => onNavigateToTab('phishing')}
                className="text-cyan-400 hover:underline"
              >
                再検証 ↗
              </button>
              <span className="font-bold text-white">{scores.phishing} / 100</span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.max(scores.phishing, 2)}%` }}
              />
            </div>
          </div>

          {/* Module 3 */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                3. インシデント迎撃 & セキュリティ対抗策 (30%)
              </span>
              <button
                type="button"
                onClick={() => onNavigateToTab('defense')}
                className="text-cyan-400 hover:underline"
              >
                再検証 ↗
              </button>
              <span className="font-bold text-white">{scores.defense} / 100</span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.max(scores.defense, 2)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Personalized Action Plan (処方箋) */}
        <div className="bg-slate-950/90 border border-cyan-900/30 p-6 rounded-2xl mb-8">
          <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            明日から実践できる サイバー防衛アクションプラン 3選
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                1. パスワード管理ツール活用
              </div>
              <p className="text-slate-400 leading-relaxed">
                全サイトで16桁以上の異なる無作為パスワードを自動生成・一元管理し、使い回しによる数珠つなぎ被害を根絶します。
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                2. パスキー / 2要素認証を義務化
              </div>
              <p className="text-slate-400 leading-relaxed">
                Google, Apple, 銀行口座等でFIDO2生体認証（Passkey）またはAuthenticatorアプリをオンにし、パスワード漏洩時も防衛します。
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="font-bold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                3. メール内リンクを踏まない原則
              </div>
              <p className="text-slate-400 leading-relaxed">
                「アカウント異常」「至急確認」のメールが来てもリンクをクリックせず、公式アプリや保存済みブックマークから直接ログインします。
              </p>
            </div>
          </div>
        </div>

        {/* Certificate Card Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> 認定証を印刷 / PDF保存
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" /> {copiedLink ? '結果テキストをコピーしました！' : '診断結果をシェア'}
            </button>
          </div>

          <CyberButton onClick={onRestart} variant="primary" className="px-6 py-2.5">
            <RotateCcw className="w-4 h-4" /> 最初から再挑戦する
          </CyberButton>
        </div>
      </div>
    </div>
  );
};

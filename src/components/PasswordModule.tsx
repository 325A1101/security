import React, { useState, useEffect, useRef } from 'react';
import {
  Key,
  Lock,
  Unlock,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  ChevronRight,
  Cpu,
  ShieldCheck,
  Terminal,
  Zap,
  Sparkles
} from 'lucide-react';
import { CyberButton } from './CyberButton.tsx';
import {
  analyzePassword,
  generateSecurePassword,
  generatePassphrase,
  ATTACK_PROFILES,
  type PasswordAnalysis
} from '../utils/securityLogic.ts';
import { playSuccessSound, playLaserSound } from '../utils/audio.ts';

interface PasswordModuleProps {
  onComplete: (score: number) => void;
  initialScore?: number;
}

export const PasswordModule: React.FC<PasswordModuleProps> = ({ onComplete }) => {
  const [password, setPassword] = useState('Password123');
  const [showPassword, setShowPassword] = useState(true);
  const [analysis, setAnalysis] = useState<PasswordAnalysis>(() => analyzePassword('Password123'));
  const [copied, setCopied] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState('gpu_cluster');
  const [isSimulatingCrack, setIsSimulatingCrack] = useState(false);
  const [simCrackOutput, setSimCrackOutput] = useState<string[]>([]);
  const crackIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    setAnalysis(analyzePassword(password));
  }, [password]);

  // Brute-force visualizer simulator
  useEffect(() => {
    if (isSimulatingCrack) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      crackIntervalRef.current = window.setInterval(() => {
        const attempt = Array.from({ length: Math.min(password.length || 8, 16) }, () =>
          chars.charAt(Math.floor(Math.random() * chars.length))
        ).join('');
        const hash = Array.from({ length: 16 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        setSimCrackOutput(prev => [
          `[ATTACK_VECTOR] HASH:${hash} TEST: ${attempt}`,
          ...prev.slice(0, 5)
        ]);
      }, 70);
    } else {
      if (crackIntervalRef.current) clearInterval(crackIntervalRef.current);
    }
    return () => {
      if (crackIntervalRef.current) clearInterval(crackIntervalRef.current);
    };
  }, [isSimulatingCrack, password.length]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = (type: 'complex' | 'passphrase') => {
    playLaserSound();
    const newPwd = type === 'complex' ? generateSecurePassword(16, true) : generatePassphrase(4);
    setPassword(newPwd);
  };

  const selectedProfile = ATTACK_PROFILES.find(p => p.id === selectedProfileId) || ATTACK_PROFILES[1];
  const selectedProfileTime = analysis.timesByProfile.find(t => t.profileId === selectedProfileId)?.timeString || analysis.timeString;

  const handleComplete = () => {
    playSuccessSound();
    onComplete(analysis.score);
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      {/* Module Title Card */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 md:p-8 shadow-xl shadow-cyan-950/20 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1.5">
              <Key className="w-4 h-4" />
              <span>MISSION 01 : AUTHENTICATION DEFENSE LAB</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
              パスワード強度 & 総当たり攻撃シミュレーター
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
              GPUクラスタやボットネットによるブルートフォース（総当たり攻撃）に対して、入力されたパスワードが何秒耐えられるかをエントロピー理論に基づいてリアルタイム計算します。
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <span className="text-xs font-mono text-slate-400">現在の防御評価:</span>
            <span className={`text-base font-black px-3 py-1 rounded-full border ${analysis.barColor}/20 ${analysis.color} border-current`}>
              {analysis.levelText}
            </span>
          </div>
        </div>

        {/* Input Field with Quick Actions */}
        <div className="space-y-3 mb-6">
          <label htmlFor="target-password-input" className="block text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
            検証対象パスワードを入力または生成
          </label>
          <div className="relative">
            <input
              id="target-password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="検証したい文字列を入力（例: MySecr3t#Key2026）"
              className="w-full bg-slate-950/90 border-2 border-slate-700 focus:border-cyan-400 text-white p-4 pr-32 font-mono text-lg rounded-xl outline-none transition-all placeholder-slate-500 shadow-inner focus:ring-2 focus:ring-cyan-500/20"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors"
                title={showPassword ? '非表示にする' : '表示する'}
              >
                {showPassword ? <Unlock className="w-4 h-4 text-cyan-400" /> : <Lock className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="パスワードをコピー"
                className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors"
                title="クリップボードにコピー"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Generator presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
            <span className="text-slate-400">ワンクリック生成:</span>
            <button
              type="button"
              onClick={() => handleGenerate('complex')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              16文字 複雑ランダム
            </button>
            <button
              type="button"
              onClick={() => handleGenerate('passphrase')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              単語連結パスフレーズ (記憶可能)
            </button>
            <button
              type="button"
              onClick={() => setPassword('123456')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 text-rose-300 transition-all"
            >
              危険例: 123456
            </button>
            <button
              type="button"
              onClick={() => setPassword('password123')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 text-rose-300 transition-all"
            >
              危険例: password123
            </button>
          </div>
        </div>

        {/* Live Crack Time & Progress Bar */}
        <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl space-y-4 mb-6 shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono text-slate-400 block">選択した攻撃者環境での突破時間:</span>
              <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                {selectedProfile.nameJa} ({selectedProfile.speed.toLocaleString()} 回/秒)
              </span>
            </div>
            <div className="text-right">
              <span className={`text-2xl md:text-3xl font-black font-mono tracking-tight ${analysis.color}`}>
                {selectedProfileTime}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">エントロピー (情報量): <strong className="text-white">{analysis.entropyBits} bits</strong></span>
              <span className="text-slate-400">スコア: <strong className={analysis.color}>{analysis.score} / 100</strong></span>
            </div>
            <div className="h-3.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${analysis.barColor}`}
                style={{ width: `${Math.max(analysis.score, 4)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Attacker Profile Switcher */}
        <div className="mb-6">
          <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            攻撃者の演算リソース比較（ハードウェア別耐性）
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {ATTACK_PROFILES.map((profile) => {
              const profileTime = analysis.timesByProfile.find(t => t.profileId === profile.id)?.timeString || '';
              const isSelected = selectedProfileId === profile.id;
              return (
                <button
                  type="button"
                  key={profile.id}
                  onClick={() => setSelectedProfileId(profile.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400/80 ring-1 ring-cyan-400/40'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-200 truncate">{profile.nameJa}</div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">{profile.speed.toLocaleString()} 試行/秒</div>
                  <div className="text-xs font-mono font-black text-cyan-300 mt-2 truncate">
                    解読: {profileTime}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Strengths & Weaknesses Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-950/60 border border-emerald-900/30 p-4 rounded-xl">
            <h4 className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 mb-2.5">
              <ShieldCheck className="w-4 h-4" /> クリア済みの堅牢要素 ({analysis.strengths.length})
            </h4>
            {analysis.strengths.length === 0 ? (
              <p className="text-xs text-slate-500">まだ堅牢要素がありません。</p>
            ) : (
              <ul className="space-y-1.5 text-xs text-slate-300">
                {analysis.strengths.map((str, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-slate-950/60 border border-rose-900/30 p-4 rounded-xl">
            <h4 className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5 mb-2.5">
              <AlertTriangle className="w-4 h-4" /> 検出された脆弱性・改善点 ({analysis.weaknesses.length})
            </h4>
            {analysis.weaknesses.length === 0 ? (
              <p className="text-xs text-emerald-400">脆弱性は検出されませんでした！極めて堅牢です。</p>
            ) : (
              <ul className="space-y-1.5 text-xs text-rose-300">
                {analysis.weaknesses.map((weak, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Interactive Brute-Force Visualizer */}
        <div className="bg-black/80 border border-slate-800 rounded-xl p-4 font-mono text-xs mb-6">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              クラック試行ターミナル・シミュレータ
            </span>
            <button
              type="button"
              onClick={() => setIsSimulatingCrack(!isSimulatingCrack)}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all border ${
                isSimulatingCrack
                  ? 'bg-rose-900/50 border-rose-500 text-rose-300 animate-pulse'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-cyan-300'
              }`}
            >
              {isSimulatingCrack ? '■ 攻撃シミュレーション停止' : '▶ 総当たり攻撃を可視化'}
            </button>
          </div>
          <div className="h-20 overflow-hidden text-slate-400 space-y-1">
            {isSimulatingCrack ? (
              simCrackOutput.map((line, idx) => (
                <div key={idx} className="text-cyan-400/80 animate-in fade-in duration-100 truncate">
                  {line}
                </div>
              ))
            ) : (
              <div className="text-slate-600 flex items-center justify-center h-full">
                「総当たり攻撃を可視化」を押すと、ハッカー端末が毎秒何億通りもの文字列を突き合わせる様子を体験できます。
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            ※入力したパスワードは一切外部へ送信されず、すべてブラウザ内で安全に計算されます。
          </div>
          <CyberButton onClick={handleComplete} variant="primary" className="w-full sm:w-auto px-6 py-3">
            <span>スコア ({analysis.score}点) を記録してフィッシング検知へ</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </CyberButton>
        </div>
      </div>
    </div>
  );
};

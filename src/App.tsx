import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Key,
  Mail,
  Zap,
  Lock,
  Smartphone,
  ChevronRight,
  Award,
  Terminal,
  Activity,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { CyberHeader } from './components/CyberHeader.tsx';
import { CyberButton } from './components/CyberButton.tsx';
import { PasswordModule } from './components/PasswordModule.tsx';
import { PhishingModule } from './components/PhishingModule.tsx';
import { DefenseGameModule } from './components/DefenseGameModule.tsx';
import { ResultModule } from './components/ResultModule.tsx';
import { MfaModal } from './components/MfaModal.tsx';
import { playSuccessSound } from './utils/audio.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'password' | 'phishing' | 'defense' | 'result'>('dashboard');
  const [scores, setScores] = useState({
    password: 85,
    phishing: 100,
    defense: 80
  });
  const [completedSteps, setCompletedSteps] = useState({
    password: false,
    phishing: false,
    defense: false
  });
  const [isMfaModalOpen, setIsMfaModalOpen] = useState(false);

  // Check ?autostart=1 as instructed by ultra-mode verification specs
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setActiveTab('password');
    }
  }, []);

  const handlePasswordComplete = (score: number) => {
    setScores(prev => ({ ...prev, password: score }));
    setCompletedSteps(prev => ({ ...prev, password: true }));
    setActiveTab('phishing');
  };

  const handlePhishingComplete = (score: number) => {
    setScores(prev => ({ ...prev, phishing: score }));
    setCompletedSteps(prev => ({ ...prev, phishing: true }));
    setActiveTab('defense');
  };

  const handleDefenseComplete = (score: number) => {
    setScores(prev => ({ ...prev, defense: score }));
    setCompletedSteps(prev => ({ ...prev, defense: true }));
    setActiveTab('result');
  };

  const handleRestart = () => {
    setCompletedSteps({
      password: false,
      phishing: false,
      defense: false
    });
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation Header */}
      <CyberHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        scores={scores}
        completedSteps={completedSteps}
      />

      {/* Main Mission Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8">
        {/* Dashboard / Mission Command Center */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10 animate-in fade-in zoom-in duration-500 py-4">
            {/* Hero Launchpad */}
            <div className="text-center max-w-3xl mx-auto space-y-6 pt-4 pb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                CYBER RESILIENCE DRILL PLATFORM
              </div>

              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                体験して学ぶ、<br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 inline-block">
                  実践型サイバーセキュリティ防衛訓練
                </span>
              </h2>

              <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                パスワード突破の危険性、巧妙化する標的型フィッシング詐欺の見極め、そしてランサムウェア等のインシデント迎撃をシミュレーターで体験。組織と自分を守る実践知を身につけましょう。
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <CyberButton
                  onClick={() => {
                    playSuccessSound();
                    setActiveTab('password');
                  }}
                  variant="primary"
                  className="text-base py-3.5 px-8 shadow-xl shadow-cyan-500/20"
                >
                  <Zap className="w-5 h-5" /> 全訓練ミッションを開始
                </CyberButton>

                <CyberButton
                  onClick={() => setIsMfaModalOpen(true)}
                  variant="secondary"
                  className="text-sm py-3.5 px-6"
                >
                  <Smartphone className="w-4 h-4 text-cyan-400" /> 2要素認証 (TOTP) 体験ラボ
                </CyberButton>
              </div>
            </div>

            {/* Three Mission Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mission 1 */}
              <div
                onClick={() => setActiveTab('password')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActiveTab('password')}
                className="group p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all duration-300 shadow-lg cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform mb-4">
                    <Key className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1">
                    MISSION 01
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    パスワード要塞化 & エントロピー検証
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    GPUクラスタによる毎秒1000億回の総当たり攻撃に対して、パスワードが何秒で破られるかを可視化検証します。
                  </p>
                </div>
                <div className="flex items-center text-xs font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>シミュレーターを起動</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              {/* Mission 2 */}
              <div
                onClick={() => setActiveTab('phishing')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActiveTab('phishing')}
                className="group p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all duration-300 shadow-lg cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform mb-4">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mb-1">
                    MISSION 02
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    不審メール検知 & フィッシング・スキャナー
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    通販なりすましやCEO詐欺（BEC）メールから、偽ドメインや心理的誘導などの危険箇所を特定・摘発します。
                  </p>
                </div>
                <div className="flex items-center text-xs font-mono text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>メールを監査する</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              {/* Mission 3 */}
              <div
                onClick={() => setActiveTab('defense')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActiveTab('defense')}
                className="group p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all duration-300 shadow-lg cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1">
                    MISSION 03
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                    サイバーインシデント迎撃防衛戦
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    ランサムウェア、DDoS、SQLインジェクション等の攻撃に対し、適切なカウンターメジャーを展開して迎撃します。
                  </p>
                </div>
                <div className="flex items-center text-xs font-mono text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>迎撃作戦を開始</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>

            {/* Live Security Stats HUD */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-slate-400">THREAT INTELLIGENCE FEED:</div>
                  <div className="text-slate-200">IPA情報セキュリティ10大脅威 2026年最新基準に準拠</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <span>暗号化: <strong className="text-emerald-400">TLS 1.3</strong></span>
                <span>認証方式: <strong className="text-cyan-400">FIDO2 / TOTP</strong></span>
                <span>監査状態: <strong className="text-cyan-400">READY</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Password */}
        {activeTab === 'password' && (
          <PasswordModule onComplete={handlePasswordComplete} initialScore={scores.password} />
        )}

        {/* Tab 2: Phishing */}
        {activeTab === 'phishing' && (
          <PhishingModule onComplete={handlePhishingComplete} initialScore={scores.phishing} />
        )}

        {/* Tab 3: Incident Defense Game */}
        {activeTab === 'defense' && (
          <DefenseGameModule onComplete={handleDefenseComplete} initialScore={scores.defense} />
        )}

        {/* Tab 4: Results & Official Certificate */}
        {activeTab === 'result' && (
          <ResultModule
            scores={scores}
            onRestart={handleRestart}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Interactive 2FA Modal */}
      <MfaModal isOpen={isMfaModalOpen} onClose={() => setIsMfaModalOpen(false)} />

      {/* Footer */}
      <footer className="w-full bg-slate-950 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>ブラウザ完結型シミュレータ（入力データは端末外へ送信されません）</span>
          </div>
          <div className="text-slate-500">
            CyberShield Security Education Lab &copy; 2026
          </div>
        </div>
      </footer>
    </div>
  );
}

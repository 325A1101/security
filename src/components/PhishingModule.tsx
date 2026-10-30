import React, { useState } from 'react';
import {
  Mail,
  ShieldAlert,
  AlertTriangle,
  ChevronRight,
  Terminal,
  Search,
  Eye,
  CheckCircle2,
  FileSearch,
  ExternalLink,
  MessageSquareWarning
} from 'lucide-react';
import { CyberButton } from './CyberButton.tsx';
import { playSuccessSound, playAlertSound } from '../utils/audio.ts';

interface PhishingScenario {
  id: string;
  category: string;
  title: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  bodyRenderer: (
    onSpotClick: (id: number) => void,
    foundIds: number[]
  ) => React.ReactNode;
  hotspots: {
    id: number;
    title: string;
    reason: string;
    technique: string;
  }[];
  spfStatus: 'PASS' | 'FAIL' | 'SOFTFAIL';
  dkimStatus: 'PASS' | 'FAIL';
  dmarcStatus: 'PASS' | 'FAIL';
}

const SCENARIOS: PhishingScenario[] = [
  {
    id: 'amazon',
    category: 'Eコマース偽装・アカウント乗っ取り',
    title: 'ケースA: 大手通販サイトの異常アクセス通知',
    senderName: 'Amazonセキュリティチーム',
    senderEmail: 'security@amozon-support.co',
    subject: '【緊急】アカウント異常アクセスの検知と機能停止のお知らせ',
    spfStatus: 'FAIL',
    dkimStatus: 'FAIL',
    dmarcStatus: 'FAIL',
    hotspots: [
      {
        id: 1,
        title: 'タイポスクワッティング送信元ドメイン',
        reason: '公式「amazon.co.jp」ではなく「amozon-support.co」という酷似した別ドメインが使われています。',
        technique: 'タイポスクワッティング (Typo Squatting)'
      },
      {
        id: 2,
        title: '時間制限による心理的パニックの誘発',
        reason: '「24時間以内に確認しないと永久凍結」と恐怖を煽り、冷静な確認手順を省かせる典型的な手口です。',
        technique: '社会的心理誘導 (Social Engineering / Fear Appeal)'
      },
      {
        id: 3,
        title: '非暗号化・無関係な偽フィッシングURL',
        reason: '安全な「https://」ではなく平文「http://」、さらに公式とは無縁の外部ドメイン（login-verify-amz.net）へ誘導しています。',
        technique: '偽ドメイン誘導 (Credential Harvesting Link)'
      }
    ],
    bodyRenderer: (onSpotClick, foundIds) => (
      <div className="space-y-4 text-sm leading-relaxed text-slate-200">
        <p>お客様各位</p>
        <p>平素より当サービスをご利用いただき誠にありがとうございます。</p>
        <p>
          本日、お客様のアカウントに対し、海外IPアドレスからの不審な連続ログイン試行を検知いたしました。
          セキュリティ保護のため、現在アカウントの一部決済機能を制限しております。
        </p>

        <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg">
          <span
            onClick={() => onSpotClick(2)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSpotClick(2)}
            className={`cursor-pointer px-2 py-1 rounded transition-all font-bold ${
              foundIds.includes(2)
                ? 'bg-rose-500 text-white ring-2 ring-rose-400'
                : 'hover:bg-rose-900/60 text-rose-300 underline decoration-rose-500/50'
            }`}
          >
            【警告】24時間以内にご本人様確認が取れない場合、アカウントおよび保有ポイントが永久凍結されます。
          </span>
        </div>

        <p>大変お手数をおかけいたしますが、以下のリンクより至急安全な本人確認を行ってください。</p>

        <div className="my-5 p-3 bg-slate-900 rounded-lg border border-slate-700">
          <span className="text-xs text-slate-400 block mb-1">本人確認ログインURL:</span>
          <span
            onClick={() => onSpotClick(3)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSpotClick(3)}
            className={`cursor-pointer inline-block break-all p-2 rounded transition-all text-xs font-mono ${
              foundIds.includes(3)
                ? 'bg-rose-500 text-white font-bold ring-2 ring-rose-400'
                : 'text-cyan-400 underline hover:bg-cyan-950/60 hover:text-cyan-200'
            }`}
          >
            http://login-verify-amz.net/auth/recover?session_id=849204&token=d92f8
          </span>
        </div>

        <p className="text-xs text-slate-400 border-t border-slate-800 pt-3">
          ※本メールは送信専用アドレスから配信されています。<br />
          Amazon カスタマーセキュリティ部
        </p>
      </div>
    )
  },
  {
    id: 'bec',
    category: 'ビジネスメール詐欺 (BEC)',
    title: 'ケースB: 社長・役員を騙る至急の送金・ギフトカード購入指令',
    senderName: '山田 太郎 (代表取締役CEO)',
    senderEmail: 'ceo-office@company-urayama-urgent.com',
    subject: '【極秘・至急対応】重要クライアント向け贈答品の代理手配について',
    spfStatus: 'FAIL',
    dkimStatus: 'FAIL',
    dmarcStatus: 'FAIL',
    hotspots: [
      {
        id: 1,
        title: '社内公式ドメインと異なる偽装フリー/取得ドメイン',
        reason: '社内正規ドメイン（@company.urayama.jp）ではなく、末尾に「-urgent.com」が付加された偽ドメインから送信されています。',
        technique: 'エグゼクティブなりすまし (Executive Spoofing)'
      },
      {
        id: 2,
        title: '正規の承認プロセスを回避させる口実',
        reason: '「会議中で電話に出られない」「誰にも口外せず」と正規の社内決裁や口頭確認を意図的に封じています。',
        technique: '社内決裁バイパス (Process Bypassing)'
      },
      {
        id: 3,
        title: '追跡困難な金券（電子マネー/ギフトカード）の購入指示',
        reason: '銀行振込ではなくコンビニで即時換金可能なギフトカードを購入させ、コードの写真を送らせるのは典型的な詐欺です。',
        technique: '不可逆マネー搾取 (Untraceable Value Transfer)'
      }
    ],
    bodyRenderer: (onSpotClick, foundIds) => (
      <div className="space-y-4 text-sm leading-relaxed text-slate-200">
        <p>お疲れ様です。山田です。</p>
        <p>
          突然の連絡で恐縮だが、現在重要な役員会議の最中で電話に出ることができない。
        </p>
        <p>
          急ぎで極秘の案件が発生した。
          <span
            onClick={() => onSpotClick(2)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSpotClick(2)}
            className={`cursor-pointer px-1.5 py-0.5 rounded transition-all font-semibold ${
              foundIds.includes(2)
                ? 'bg-rose-500 text-white ring-2 ring-rose-400'
                : 'hover:bg-rose-950/60 text-amber-300 underline decoration-amber-500/50'
            }`}
          >
            他言無用・社内秘の案件のため、他の社員には一切口外せず至急対応してほしい。
          </span>
        </p>
        <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">指示内容:</p>
          <span
            onClick={() => onSpotClick(3)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSpotClick(3)}
            className={`cursor-pointer inline-block p-1.5 rounded transition-all ${
              foundIds.includes(3)
                ? 'bg-rose-500 text-white font-bold ring-2 ring-rose-400'
                : 'text-rose-300 hover:bg-rose-950/60 underline'
            }`}
          >
            近隣のコンビニへ赴き、Apple Gift Card（5万円分×6枚＝計30万円）を購入の上、裏面のコードを削って鮮明に撮影し、このメールに返信で送ってくれ。
          </span>
        </div>
        <p>費用は後ほど経理部経由で立替精算する。急ぎ頼む。</p>
      </div>
    )
  }
];

interface PhishingModuleProps {
  onComplete: (score: number) => void;
  initialScore?: number;
}

export const PhishingModule: React.FC<PhishingModuleProps> = ({ onComplete }) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [foundByScenario, setFoundByScenario] = useState<{ [scenarioId: string]: number[] }>({
    amazon: [],
    bec: []
  });
  const [showHint, setShowHint] = useState(false);
  const [showHeaderAudit, setShowHeaderAudit] = useState(false);

  const currentScenario = SCENARIOS[selectedScenarioIndex];
  const currentFound = foundByScenario[currentScenario.id] || [];
  const isScenarioComplete = currentFound.length === currentScenario.hotspots.length;

  const handleSpotClick = (id: number) => {
    if (!currentFound.includes(id)) {
      const nextFound = [...currentFound, id];
      setFoundByScenario({
        ...foundByScenario,
        [currentScenario.id]: nextFound
      });
      playSuccessSound();
    } else {
      playAlertSound();
    }
  };

  // Total calculation across scenarios
  const totalHotspots = SCENARIOS.reduce((sum, s) => sum + s.hotspots.length, 0);
  const totalFoundCount = Object.values(foundByScenario).reduce((sum, list) => sum + list.length, 0);
  const calculatedScore = Math.min(100, Math.round((totalFoundCount / totalHotspots) * 100));

  const handleComplete = () => {
    playSuccessSound();
    onComplete(Math.max(calculatedScore, 40));
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 md:p-8 shadow-xl shadow-cyan-950/20 backdrop-blur-sm relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1.5">
              <Mail className="w-4 h-4" />
              <span>MISSION 02 : PHISHING & SOCIAL ENGINEERING RADAR</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
              不審メール検知 & フィッシング・スキャナー
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
              巧妙化するなりすましメールの本文やヘッダーを監査し、フィッシング詐欺特有の兆候（タイポスクワッティング、緊急性悪用、偽URL）を特定してください。
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
              <span className="text-[11px] font-mono text-slate-400 block">総合検知進捗:</span>
              <span className="text-sm font-mono font-black text-cyan-400">
                {totalFoundCount} / {totalHotspots} 検出 ({calculatedScore}点)
              </span>
            </div>
          </div>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {SCENARIOS.map((scenario, index) => {
            const isSelected = selectedScenarioIndex === index;
            const foundCount = foundByScenario[scenario.id]?.length || 0;
            const completed = foundCount === scenario.hotspots.length;

            return (
              <button
                type="button"
                key={scenario.id}
                onClick={() => {
                  setSelectedScenarioIndex(index);
                  setShowHint(false);
                }}
                className={`px-4 py-2.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-mono font-bold">
                  {completed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : index + 1}
                </div>
                <div>
                  <div className="text-xs font-bold">{scenario.title}</div>
                  <div className="text-[10px] font-mono text-slate-400">
                    特定: {foundCount} / {scenario.hotspots.length}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="bg-cyan-950/30 border border-cyan-800/40 p-4 rounded-xl flex items-start gap-3 mb-6">
          <Search className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            メール画面内の怪しい箇所（送信元アドレス、緊急性を煽る文言、誘導URLなど）を直接クリックして脅威を暴いてください。
            各シナリオに <strong>{currentScenario.hotspots.length}箇所</strong> の仕掛けが潜んでいます。
          </div>
        </div>

        {/* Email Client Mock UI */}
        <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl mb-6 relative">
          {/* Top Window Bar */}
          <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-xs font-mono text-slate-400 ml-2">Inbox &gt; Suspicious Mail Inspector</span>
            </div>

            <button
              type="button"
              onClick={() => setShowHeaderAudit(!showHeaderAudit)}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 transition-colors"
            >
              <FileSearch className="w-3.5 h-3.5" />
              {showHeaderAudit ? '本文表示へ' : 'メールヘッダー認証 (SPF/DKIM/DMARC) を解析'}
            </button>
          </div>

          {/* Email Header */}
          <div className="p-4 md:p-6 bg-slate-900/60 border-b border-slate-800 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center text-xs">
              <span className="w-20 text-slate-400 font-mono">差出人:</span>
              <span className="font-semibold text-white flex items-center gap-1 flex-wrap">
                {currentScenario.senderName} &lt;
                <span
                  onClick={() => handleSpotClick(1)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleSpotClick(1)}
                  className={`cursor-pointer px-1.5 py-0.5 rounded transition-all font-mono font-bold ${
                    currentFound.includes(1)
                      ? 'bg-rose-500 text-white ring-2 ring-rose-300'
                      : 'text-rose-400 hover:bg-rose-950/60 underline decoration-rose-500/40'
                  }`}
                  title="クリックして検証"
                >
                  {currentScenario.senderEmail}
                </span>
                &gt;
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center text-xs">
              <span className="w-20 text-slate-400 font-mono">件名:</span>
              <span className="font-bold text-white">{currentScenario.subject}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center text-xs">
              <span className="w-20 text-slate-400 font-mono">宛先:</span>
              <span className="text-slate-300 font-mono">user-account@urayama.ac.jp</span>
            </div>
          </div>

          {/* SPF / DKIM / DMARC Header Analyzer Panel */}
          {showHeaderAudit && (
            <div className="p-4 bg-black/90 border-b border-slate-800 font-mono text-xs animate-in slide-in-from-top-2 duration-200">
              <div className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> メール送信元ドメイン認証ログ (Raw Header Analysis)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="p-2.5 rounded bg-slate-900 border border-rose-900/40">
                  <span className="text-slate-400 block text-[10px]">SPF (送信元IP検証):</span>
                  <span className="text-rose-400 font-black">FAIL (不正IPからの送信)</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-rose-900/40">
                  <span className="text-slate-400 block text-[10px]">DKIM (電子署名改ざん検証):</span>
                  <span className="text-rose-400 font-black">FAIL (署名不一致 / 欠落)</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-rose-900/40">
                  <span className="text-slate-400 block text-[10px]">DMARC (統合ポリシー判定):</span>
                  <span className="text-rose-400 font-black">FAIL (REJECT / QUARANTINE)</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                ※正規のメールサーバー経由で送信されていないため、大手メールシステムでは通常スパム隔離されます。
              </p>
            </div>
          )}

          {/* Email Body */}
          <div className="p-6 md:p-8 bg-slate-950 select-none">
            {currentScenario.bodyRenderer(handleSpotClick, currentFound)}
          </div>
        </div>

        {/* Real-time Threat Analysis Log */}
        <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl mb-6">
          <h4 className="font-bold text-slate-200 text-xs font-mono uppercase tracking-wider mb-3 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            検知ログ & 脅威分析 ({currentFound.length} / {currentScenario.hotspots.length} 検出):
          </h4>

          {currentFound.length === 0 ? (
            <p className="text-xs text-slate-500 py-2">
              メール本文またはヘッダーの怪しい部分をクリックすると、ここに詳細な脅威分析が表示されます。
            </p>
          ) : (
            <div className="space-y-2.5">
              {currentFound.map((id) => {
                const hotspot = currentScenario.hotspots.find(h => h.id === id);
                if (!hotspot) return null;
                return (
                  <div
                    key={id}
                    className="p-3 rounded-lg bg-slate-900/90 border border-rose-800/40 flex items-start gap-3 animate-in slide-in-from-bottom-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{hotspot.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                          {hotspot.technique}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{hotspot.reason}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Navigation & Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline transition-colors"
            >
              {showHint ? 'ヒントを閉じる' : '💡 調査ヒントを表示'}
            </button>
            {isScenarioComplete && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> このシナリオの全脅威を特定完了！
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {selectedScenarioIndex < SCENARIOS.length - 1 ? (
              <CyberButton
                onClick={() => {
                  setSelectedScenarioIndex(selectedScenarioIndex + 1);
                  setShowHint(false);
                }}
                variant="secondary"
              >
                次のフィッシング事例へ <ChevronRight className="w-4 h-4" />
              </CyberButton>
            ) : null}

            <CyberButton onClick={handleComplete} variant="primary">
              <span>防衛戦 (ミッション3) へ進む</span>
              <ChevronRight className="w-4 h-4" />
            </CyberButton>
          </div>
        </div>

        {showHint && (
          <div className="mt-4 p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 animate-in fade-in">
            <strong>ヒント:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1 text-slate-300">
              <li>送信者アドレスのドメイン（@以降）が実在する公式ドメインと完全一致しているか注視しましょう。</li>
              <li>「24時間以内」「本日中」「他言無用」といった急迫性・秘密性を強要する文面は社会的詐術の常套句です。</li>
              <li>本文中リンクのプロトコル（httpかhttpsか）やドメイン名を確認してください。</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

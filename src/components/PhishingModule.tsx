import React, { useState } from 'react';
import {
  Mail,
  ShieldAlert,
  AlertTriangle,
  ChevronRight,
  Terminal,
  Search,
  CheckCircle2,
  FileSearch,
  ExternalLink,
  Archive,
  Trash2,
  Reply,
  MoreVertical,
  Star,
  Clock,
  ShieldCheck,
  User,
  Building,
  Info
} from 'lucide-react';
import { CyberButton } from './CyberButton.tsx';
import { playSuccessSound, playAlertSound } from '../utils/audio.ts';

interface PhishingScenario {
  id: string;
  category: string;
  title: string;
  senderName: string;
  senderEmail: string;
  senderInitial: string;
  senderInitialBg: string;
  dateStr: string;
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
    senderName: 'Amazon.co.jp カスタマーサービス',
    senderEmail: 'security@amozon-support.co',
    senderInitial: 'A',
    senderInitialBg: 'bg-[#ff9900] text-slate-950',
    dateStr: '本日 14:28 (12分前)',
    subject: '【重要】お客様のAmazonアカウントに対する異常なログイン試行を検知いたしました',
    spfStatus: 'FAIL',
    dkimStatus: 'FAIL',
    dmarcStatus: 'FAIL',
    hotspots: [
      {
        id: 1,
        title: 'タイポスクワッティング送信元ドメイン',
        reason: '公式の「amazon.co.jp」ではなく、「amozon-support.co」(aがoになっている) という巧妙な偽装ドメインです。',
        technique: 'タイポスクワッティング (Typo Squatting)'
      },
      {
        id: 2,
        title: '時間制限による心理的パニックの誘発',
        reason: '「24時間以内に確認しないと永久凍結」と極端な猶予制限を突きつけ、被害者に冷静な相談や確認をさせない心理工作です。',
        technique: '緊急性の悪用 (Fear Appeal / Social Engineering)'
      },
      {
        id: 3,
        title: '非暗号化・公式無関係の偽装フィッシングURL',
        reason: '公式URLとは無関係な「http://login-verify-amz.net/」へ誘導しています。正規サービスは必ず「https://www.amazon.co.jp/」です。',
        technique: '不正URL誘導 (Credential Harvesting Site)'
      }
    ],
    bodyRenderer: (onSpotClick, foundIds) => (
      <div className="bg-white text-slate-800 text-sm leading-relaxed p-6 md:p-8 space-y-5 font-sans">
        {/* Amazon-style header bar */}
        <div className="border-b-2 border-[#ff9900] pb-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-black text-xl tracking-tight text-slate-900 font-sans">
              amazon<span className="text-[#ff9900]">.co.jp</span>
            </span>
            <span className="text-xs text-slate-400 font-mono pl-2 border-l border-slate-300">
              セキュリティ通知センター
            </span>
          </div>
          <span className="text-xs text-slate-400">通知番号: AMZ-SEC-202611-094</span>
        </div>

        <div className="space-y-4 text-slate-700">
          <p className="font-semibold text-slate-900">
            山田 太郎 様 （またはお客様各位）
          </p>

          <p>
            いつも Amazon.co.jp をご利用いただき、誠にありがとうございます。
          </p>

          <p>
            当社の不正アクセス検知システムが、お客様のAmazonアカウントに対する通常とは異なる地域（ロシア・モスクワ近郊 IP: 185.220.101.4）からのサインイン試行を検知いたしました。
            お客様の個人情報およびご登録のクレジットカード情報を保護するため、現在一部の購入および会員機能を一時的に制限しております。
          </p>

          {/* Hotspot 2: Urgency manipulation */}
          <div
            onClick={() => onSpotClick(2)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSpotClick(2)}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
              foundIds.includes(2)
                ? 'bg-rose-100 border-rose-400 text-rose-900 ring-2 ring-rose-500 font-bold'
                : 'bg-amber-50/80 border-amber-300 text-amber-900 hover:bg-amber-100 hover:border-amber-400'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0 mt-0.5">⚠️</span>
              <div>
                <strong className="text-rose-700 font-bold">
                  【緊急対応のお願い】
                </strong>
                <span className="underline decoration-rose-400 decoration-1">
                  本メール受信後24時間以内にご本人様確認が完了しない場合、セキュリティ保護規定に基づきアカウントは永久凍結され、保有されているAmazonポイントやギフト残高も失効いたします。
                </span>
              </div>
            </div>
            {foundIds.includes(2) && (
              <div className="mt-2 text-xs text-rose-800 bg-rose-200/60 p-1.5 rounded flex items-center gap-1 font-bold">
                ✓ 脅威特定: 緊急性を煽って焦らせ、偽画面に誘導する手口
              </div>
            )}
          </div>

          <p>
            お手数をおかけいたしますが、以下のボタンまたはURLより直ちにログインし、登録情報およびセキュリティ設定の確認を行ってください。
          </p>

          {/* Hotspot 3: Fake link & button */}
          <div className="my-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-3">
            <div>
              <button
                type="button"
                onClick={() => onSpotClick(3)}
                className={`inline-block px-8 py-3.5 rounded-md font-bold text-sm shadow-md transition-all cursor-pointer ${
                  foundIds.includes(3)
                    ? 'bg-rose-600 text-white ring-4 ring-rose-300'
                    : 'bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 border border-[#fcd200]'
                }`}
              >
                今すぐアカウントを確認・更新する
              </button>
            </div>

            <div className="text-xs text-slate-500">
              ボタンが正しく表示されない場合は、下記URLをブラウザに直接コピー＆ペーストしてください:
            </div>

            <div
              onClick={() => onSpotClick(3)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSpotClick(3)}
              className={`p-2 rounded font-mono text-xs break-all cursor-pointer transition-all ${
                foundIds.includes(3)
                  ? 'bg-rose-100 text-rose-900 border border-rose-400 font-bold ring-2 ring-rose-400'
                  : 'text-blue-600 underline hover:bg-blue-50'
              }`}
            >
              http://login-verify-amz.net/auth/recover?session_id=849204&token=d92f8
            </div>

            {foundIds.includes(3) && (
              <div className="text-xs text-rose-800 font-bold bg-rose-100 p-1.5 rounded">
                ✓ 脅威特定: 公式と無関係なドメイン & 非暗号化(http)の偽サイト
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 pt-5 text-xs text-slate-500 space-y-1">
            <p>※本メールは送信専用のメールアドレスから配信されています。このメールに直接返信することはできません。</p>
            <p>※Amazon.co.jp では、Eメールでお客様のパスワードやクレジットカード番号全体の入力を求めることはありません。</p>
            <p className="pt-2 text-slate-400">© 2026 Amazon.com, Inc. or its affiliates. All rights reserved.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'bec',
    category: 'ビジネスメール詐欺 (BEC)',
    title: 'ケースB: 社長・役員を騙る至急の送金・ギフトカード購入指令',
    senderName: '山田 太郎 (代表取締役CEO)',
    senderEmail: 'ceo-office@company-urayama-urgent.com',
    senderInitial: '山',
    senderInitialBg: 'bg-blue-600 text-white',
    dateStr: '本日 11:15 (3時間前)',
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
      <div className="bg-white text-slate-800 text-sm leading-relaxed p-6 md:p-8 space-y-4 font-sans">
        <div className="space-y-4 text-slate-800">
          <p>お疲れ様です。山田です。</p>

          <p>
            突然の連絡ですまない。現在、都内の重要クライアントとの極秘役員会議に入っており、終日電話に出ることができない状況だ。
          </p>

          {/* Hotspot 2: bypassing rules */}
          <div
            onClick={() => onSpotClick(2)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSpotClick(2)}
            className={`p-3 rounded-lg border transition-all cursor-pointer ${
              foundIds.includes(2)
                ? 'bg-rose-100 border-rose-400 text-rose-900 ring-2 ring-rose-500 font-bold'
                : 'bg-slate-50 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
            }`}
          >
            <p>
              今夕の会談で先方トップにお渡しする特別な謝礼案件が発生した。
              <span className="font-semibold text-slate-900 underline decoration-amber-500">
                本件は極秘のM&amp;A提携交渉に絡むため、他言無用・社内秘とし、他の役員や総務・経理社員には一切口外せず、君一人で至急動いてほしい。
              </span>
            </p>
            {foundIds.includes(2) && (
              <div className="mt-2 text-xs text-rose-800 bg-rose-200/60 p-1.5 rounded font-bold">
                ✓ 脅威特定: 「他言無用」「会議で電話不可」で周囲への相談を封じる手口
              </div>
            )}
          </div>

          <p>
            至急、以下の手配を代行してくれないか。
          </p>

          {/* Hotspot 3: gift card request */}
          <div
            onClick={() => onSpotClick(3)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSpotClick(3)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              foundIds.includes(3)
                ? 'bg-rose-100 border-rose-400 text-rose-900 ring-2 ring-rose-500 font-bold'
                : 'bg-amber-50/60 border-amber-200 hover:bg-amber-100/70'
            }`}
          >
            <div className="font-bold text-slate-900 mb-1">【手配指示】</div>
            <p className="text-slate-800">
              会社の最寄りのコンビニへ直ちに向かい、
              <span className="font-bold text-rose-700 bg-rose-50 px-1 rounded">
                Apple Gift Card（5万円券×6枚＝合計30万円分）
              </span>
              を至急購入してほしい。
            </p>
            <p className="text-xs text-slate-600 mt-2">
              購入後、裏面のPINコード部分をコインで削り、コード番号が鮮明に写るようにスマートフォンのカメラで撮影して、このメールへ直接返信で添付送付すること。
            </p>
            {foundIds.includes(3) && (
              <div className="mt-2 text-xs text-rose-800 bg-rose-200/60 p-1.5 rounded font-bold">
                ✓ 脅威特定: 取り消し・追跡が不可能な電子ギフト券を要求する典型詐欺
              </div>
            )}
          </div>

          <p>
            購入費用は私が全額保証する。領収書を保管しておいてくれれば、明朝経理部に指示して立替経費として即日銀行口座へ精算振込させる。
          </p>

          <p className="font-bold text-slate-900 pt-2">
            会議が始まるため、1時間以内に完了を頼む。返信を待つ。
          </p>

          <div className="border-t border-slate-200 pt-4 text-xs text-slate-500 font-mono space-y-1">
            <p>--</p>
            <p className="font-bold text-slate-800">山田 太郎 (Taro Yamada)</p>
            <p>株式会社ウラヤマ 代表取締役CEO</p>
            <p className="text-slate-400 pt-1">Sent from my iPhone</p>
          </div>
        </div>
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
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1.5">
              <Mail className="w-4 h-4" />
              <span>MISSION 02 : PHISHING &amp; SOCIAL ENGINEERING RADAR</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
              不審メール検知 &amp; フィッシング・スキャナー
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
              実際のメールソフトで受信した本物のメール画面を再現しています。怪しい部分（送信元アドレス、心理的脅迫、偽URL）を直接クリックして詐欺の手口を暴いてください。
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
                className={`px-4 py-2.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
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

        {/* Guidance Prompt */}
        <div className="bg-blue-950/30 border border-blue-500/30 p-3.5 rounded-xl flex items-start gap-3 mb-6">
          <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            下の白背景のメール画面内で怪しい箇所をクリックしてください（送信者、本文、ボタン・URL等）。
            このメールには <strong>{currentScenario.hotspots.length}箇所</strong> のフィッシング特徴が隠されています。
          </div>
        </div>

        {/* Authentic White Email Client Container */}
        <div className="bg-slate-200 rounded-2xl overflow-hidden border border-slate-300 shadow-2xl mb-6">
          {/* Email Client Window Top Toolbar */}
          <div className="bg-slate-100 border-b border-slate-300 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              {/* Window dots */}
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              </div>

              {/* Realistic Email client action icons */}
              <div className="flex items-center gap-1 text-slate-600 pl-3 border-l border-slate-300">
                <button type="button" className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors" title="アーカイブ">
                  <Archive className="w-4 h-4" />
                </button>
                <button type="button" className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors" title="迷惑メール報告">
                  <ShieldAlert className="w-4 h-4" />
                </button>
                <button type="button" className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors" title="削除">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button type="button" className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors" title="返信">
                  <Reply className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                受信トレイ
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowHeaderAudit(!showHeaderAudit)}
              className="text-xs font-mono text-slate-700 hover:text-cyan-700 bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
            >
              <FileSearch className="w-3.5 h-3.5 text-blue-600" />
              {showHeaderAudit ? 'ヘッダー解析を閉じる' : 'メールヘッダー (SPF/DKIM) を検証'}
            </button>
          </div>

          {/* Email Subject Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
                {currentScenario.subject}
              </h3>
              <Star className="w-5 h-5 text-slate-300 hover:text-amber-400 cursor-pointer shrink-0" />
            </div>

            {/* Sender and recipient meta card */}
            <div className="flex items-start justify-between gap-3 pt-3 mt-3 border-t border-slate-100 flex-wrap">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${currentScenario.senderInitialBg}`}
                >
                  {currentScenario.senderInitial}
                </div>

                <div>
                  <div className="text-sm">
                    <span className="font-bold text-slate-900 mr-2">
                      {currentScenario.senderName}
                    </span>

                    {/* Hotspot 1: Sender address */}
                    <span
                      onClick={() => handleSpotClick(1)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleSpotClick(1)}
                      className={`inline-block px-1.5 py-0.5 rounded font-mono text-xs cursor-pointer transition-all ${
                        currentFound.includes(1)
                          ? 'bg-rose-100 text-rose-900 ring-2 ring-rose-500 font-bold border border-rose-300'
                          : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50 underline decoration-dotted'
                      }`}
                      title="送信元アドレスをクリックして検査"
                    >
                      &lt;{currentScenario.senderEmail}&gt;
                    </span>
                    {currentFound.includes(1) && (
                      <span className="ml-2 text-[11px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                        ✓ 偽装ドメイン特定
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>宛先: 自分 &lt;user-account@urayama.ac.jp&gt;</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{currentScenario.dateStr}</span>
              </div>
            </div>
          </div>

          {/* Collapsible SPF / DKIM / DMARC Header Analyzer */}
          {showHeaderAudit && (
            <div className="p-4 bg-slate-50 border-b border-slate-300 font-mono text-xs animate-in slide-in-from-top-2 duration-200 text-slate-800">
              <div className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-600" />
                受信メールヘッダー認証ログ (Authentication-Results Analysis)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="p-2.5 rounded bg-white border border-rose-300 shadow-sm">
                  <span className="text-slate-500 block text-[10px] font-bold">SPF (送信元IP認証):</span>
                  <span className="text-rose-600 font-black">FAIL (未承認IPからの送信)</span>
                </div>
                <div className="p-2.5 rounded bg-white border border-rose-300 shadow-sm">
                  <span className="text-slate-500 block text-[10px] font-bold">DKIM (電子署名改ざん検証):</span>
                  <span className="text-rose-600 font-black">FAIL (電子署名なし / 不一致)</span>
                </div>
                <div className="p-2.5 rounded bg-white border border-rose-300 shadow-sm">
                  <span className="text-slate-500 block text-[10px] font-bold">DMARC (統合ポリシー判定):</span>
                  <span className="text-rose-600 font-black">FAIL (p=reject ポリシー不合格)</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-2">
                ※正規のドメイン管理者が発行した電子署名が存在せず、送信元IPも公式メールサーバーとは全く一致していません。
              </p>
            </div>
          )}

          {/* Email Body - Genuine White Background */}
          <div className="bg-white select-none">
            {currentScenario.bodyRenderer(handleSpotClick, currentFound)}
          </div>
        </div>

        {/* Real-time Threat Analysis Log (Dark Cyber Feedback HUD) */}
        <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl mb-6">
          <h4 className="font-bold text-slate-200 text-xs font-mono uppercase tracking-wider mb-3 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            検知ログ &amp; 脅威分析 ({currentFound.length} / {currentScenario.hotspots.length} 検出):
          </h4>

          {currentFound.length === 0 ? (
            <p className="text-xs text-slate-500 py-2">
              メール画面内の怪しい部分（送信者メールアドレス、緊急性を煽る文言、ボタン・URLリンクなど）をクリックすると、ここに詳細な脅威分析が表示されます。
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
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline transition-colors cursor-pointer"
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

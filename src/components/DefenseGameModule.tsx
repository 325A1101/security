import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Zap,
  ChevronRight,
  RotateCcw,
  Activity,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Smartphone,
  DatabaseBackup,
  Code,
  Lock
} from 'lucide-react';
import { CyberButton } from './CyberButton.tsx';
import {
  THREATS,
  COUNTERMEASURES,
  type CyberThreat,
  type Countermeasure
} from '../utils/securityLogic.ts';
import { playSuccessSound, playAlertSound, playLaserSound } from '../utils/audio.ts';

interface DefenseGameModuleProps {
  onComplete: (score: number) => void;
  initialScore?: number;
}

export const DefenseGameModule: React.FC<DefenseGameModuleProps> = ({ onComplete }) => {
  const [currentThreatIndex, setCurrentThreatIndex] = useState(0);
  const [selectedCountermeasureId, setSelectedCountermeasureId] = useState<string | null>(null);
  const [history, setHistory] = useState<
    { threatId: string; countermeasureId: string; isCorrect: boolean }[]
  >([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const currentThreat = THREATS[currentThreatIndex];
  const isFinished = history.length === THREATS.length;

  const correctAnswersCount = history.filter(h => h.isCorrect).length;
  const currentScore = Math.round((correctAnswersCount / THREATS.length) * 100);

  const handleSelectCountermeasure = (id: string) => {
    if (hasSubmitted) return;
    setSelectedCountermeasureId(id);
  };

  const handleDeployCountermeasure = () => {
    if (!selectedCountermeasureId || hasSubmitted) return;

    const isCorrect = selectedCountermeasureId === currentThreat.correctCountermeasureId;
    if (isCorrect) {
      playSuccessSound();
    } else {
      playAlertSound();
    }

    setHasSubmitted(true);
    setHistory(prev => [
      ...prev,
      {
        threatId: currentThreat.id,
        countermeasureId: selectedCountermeasureId,
        isCorrect
      }
    ]);
  };

  const handleNextThreat = () => {
    playLaserSound();
    setHasSubmitted(false);
    setSelectedCountermeasureId(null);
    if (currentThreatIndex < THREATS.length - 1) {
      setCurrentThreatIndex(currentThreatIndex + 1);
    }
  };

  const handleRestart = () => {
    setCurrentThreatIndex(0);
    setSelectedCountermeasureId(null);
    setHistory([]);
    setHasSubmitted(false);
  };

  const handleCompleteMission = () => {
    playSuccessSound();
    onComplete(currentScore);
  };

  const getCountermeasureIcon = (name: string) => {
    switch (name) {
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-cyan-400" />;
      case 'DatabaseBackup':
        return <DatabaseBackup className="w-5 h-5 text-emerald-400" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-amber-400" />;
      case 'Code':
        return <Code className="w-5 h-5 text-purple-400" />;
      default:
        return <Lock className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 md:p-8 shadow-xl shadow-cyan-950/20 backdrop-blur-sm relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1.5">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>MISSION 03 : CYBER INCIDENT TACTICAL DEFENSE</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
              サイバー攻撃迎撃シミュレータ
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
              ランサムウェア、DDoS、不正ログインなどのリアルタイムなサイバー脅威が発生しました。状況を的確に分析し、最も効果的な防衛対策（カウンターメジャー）を展開して被害を阻止してください。
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
              <span className="text-[11px] font-mono text-slate-400 block">迎撃成功率:</span>
              <span className="text-sm font-mono font-black text-cyan-400">
                {correctAnswersCount} / {THREATS.length} 成功 ({currentScore}点)
              </span>
            </div>
          </div>
        </div>

        {/* Threat Progress Indicator */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {THREATS.map((threat, idx) => {
            const histItem = history[idx];
            const isCurrent = idx === currentThreatIndex && !isFinished;

            return (
              <div
                key={threat.id}
                className={`flex-1 min-w-[120px] p-2.5 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/30'
                    : histItem
                    ? histItem.isCorrect
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-800/60 text-rose-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-[10px] font-mono">THREAT 0{idx + 1}</div>
                <div className="text-xs font-bold truncate mt-0.5">
                  {histItem ? (
                    histItem.isCorrect ? '迎撃成功' : '防衛突破'
                  ) : (
                    threat.severity
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {!isFinished ? (
          <>
            {/* Active Incident Alert Box */}
            <div className="bg-slate-950 border-2 border-rose-500/40 rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-rose-900/60 border-b border-l border-rose-500/50 rounded-bl-xl text-xs font-mono font-black text-rose-300 flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                SEVERITY: {currentThreat.severity}
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
                <span>{currentThreat.category}</span>
              </div>

              <h3 className="text-xl md:text-2xl font-black text-white mb-3">
                {currentThreat.name}
              </h3>

              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-slate-200 text-sm leading-relaxed mb-4">
                {currentThreat.description}
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                インシデント対策室: 下記から配備すべき最も有効なセキュリティ防御策を選択してください。
              </div>
            </div>

            {/* Countermeasure Selection Cards */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
                防衛策（カウンターメジャー）を選択
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {COUNTERMEASURES.map((cm) => {
                  const isSelected = selectedCountermeasureId === cm.id;
                  const isSubmitted = hasSubmitted;
                  const isCorrect = cm.id === currentThreat.correctCountermeasureId;

                  let cardStyle = 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300';
                  if (isSelected && !isSubmitted) {
                    cardStyle = 'bg-cyan-950/50 border-cyan-400 ring-2 ring-cyan-400/40 text-white';
                  } else if (isSubmitted) {
                    if (isCorrect) {
                      cardStyle = 'bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/40 text-emerald-200';
                    } else if (isSelected && !isCorrect) {
                      cardStyle = 'bg-rose-950/50 border-rose-500 ring-2 ring-rose-500/40 text-rose-200';
                    } else {
                      cardStyle = 'opacity-40 border-slate-800';
                    }
                  }

                  return (
                    <button
                      type="button"
                      key={cm.id}
                      onClick={() => handleSelectCountermeasure(cm.id)}
                      disabled={isSubmitted}
                      className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${cardStyle}`}
                    >
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 shrink-0">
                        {getCountermeasureIcon(cm.iconName)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                          <span>{cm.name}</span>
                          {isSubmitted && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                          )}
                          {isSubmitted && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-400 inline" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {cm.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tactical Debrief Feedback */}
            {hasSubmitted && (
              <div
                className={`p-5 rounded-xl border mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  selectedCountermeasureId === currentThreat.correctCountermeasureId
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-100'
                    : 'bg-rose-950/40 border-rose-800/60 text-rose-100'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm mb-2">
                  {selectedCountermeasureId === currentThreat.correctCountermeasureId ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>【迎撃成功】最適な防衛策を展開し、脅威を完全に無力化しました！</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span>【防衛失敗】この対策では脅威の根本原因を防ぐことができません。</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3 rounded-lg border border-slate-800">
                  <strong className="text-cyan-300 block mb-1">💡 セキュリティ防衛理論:</strong>
                  {currentThreat.vectorExplanation}
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-400 font-mono">
                Threat {currentThreatIndex + 1} / {THREATS.length}
              </div>

              {!hasSubmitted ? (
                <CyberButton
                  onClick={handleDeployCountermeasure}
                  disabled={!selectedCountermeasureId}
                  variant="primary"
                  className="px-6 py-2.5"
                >
                  <Zap className="w-4 h-4" /> 防衛策を展開
                </CyberButton>
              ) : (
                <CyberButton onClick={handleNextThreat} variant="primary" className="px-6 py-2.5">
                  <span>次の脅威へ</span>
                  <ChevronRight className="w-4 h-4" />
                </CyberButton>
              )}
            </div>
          </>
        ) : (
          /* Finished Screen for Defense Mission */
          <div className="text-center py-8 animate-in zoom-in duration-300 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mx-auto text-cyan-400">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">全インシデント迎撃完了</h3>
              <p className="text-slate-400 text-sm mt-1">
                5つの重要サイバー攻撃に対する防衛シミュレーションが終了しました。
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 max-w-md mx-auto space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">迎撃成功数:</span>
                <span className="font-bold text-white">{correctAnswersCount} / {THREATS.length} 件</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">迎撃スコア:</span>
                <span className="text-xl font-mono font-black text-cyan-400">{currentScore} 点</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <CyberButton onClick={handleRestart} variant="secondary">
                <RotateCcw className="w-4 h-4" /> もう一度迎撃する
              </CyberButton>
              <CyberButton onClick={handleCompleteMission} variant="primary">
                <span>総合診断書・認定証を確認</span>
                <ChevronRight className="w-4 h-4" />
              </CyberButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

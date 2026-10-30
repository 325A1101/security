import React, { useState } from 'react';
import { ShieldAlert, Volume2, VolumeX, Key, Mail, ShieldCheck, Award } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playClickSound } from '../utils/audio.ts';

interface CyberHeaderProps {
  activeTab: 'dashboard' | 'password' | 'phishing' | 'defense' | 'result';
  setActiveTab: (tab: 'dashboard' | 'password' | 'phishing' | 'defense' | 'result') => void;
  scores: { password: number; phishing: number; defense: number };
  completedSteps: { password: boolean; phishing: boolean; defense: boolean };
}

export const CyberHeader: React.FC<CyberHeaderProps> = ({
  activeTab,
  setActiveTab,
  scores,
  completedSteps,
}) => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playClickSound();
  };

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-cyan-500/20 sticky top-0 z-40 transition-all shadow-lg shadow-black/40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Status */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('dashboard');
            }}
            className="flex items-center gap-3 text-left group focus:outline-none"
            aria-label="ホームへ戻る"
          >
            <div className="relative p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 text-cyan-400 group-hover:border-cyan-300 group-hover:shadow-cyan-500/30 group-hover:shadow-md transition-all">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
                  CYBERSHIELD v2.0
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  DEFENSE ONLINE
                </span>
              </div>
              <h1 className="text-base md:text-lg font-black tracking-tight text-white group-hover:text-cyan-200 transition-colors">
                サイバーセキュリティ体験シミュレーター
              </h1>
            </div>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundOn ? 'サウンドをミュート' : 'サウンドを有効化'}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors"
            title={soundOn ? 'サウンドON' : 'サウンドOFF'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none" aria-label="ミッション選択">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('password');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap border transition-all ${
              activeTab === 'password'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20 font-bold'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-cyan-500/40 hover:text-cyan-300'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>1. パスワード検証</span>
            {completedSteps.password && (
              <span className="ml-1 px-1 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {scores.password}pt
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('phishing');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap border transition-all ${
              activeTab === 'phishing'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20 font-bold'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-cyan-500/40 hover:text-cyan-300'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>2. フィッシング検知</span>
            {completedSteps.phishing && (
              <span className="ml-1 px-1 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {scores.phishing}pt
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('defense');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap border transition-all ${
              activeTab === 'defense'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20 font-bold'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-cyan-500/40 hover:text-cyan-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3. 迎撃防衛戦</span>
            {completedSteps.defense && (
              <span className="ml-1 px-1 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {scores.defense}pt
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('result');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap border transition-all ${
              activeTab === 'result'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/30 font-bold'
                : 'bg-slate-800/80 text-amber-300 border-amber-500/40 hover:border-amber-400 hover:bg-amber-950/30'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>総合認定証</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

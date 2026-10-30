import React, { useState, useEffect } from 'react';
import { Terminal, Key, Mail, Award, ShieldAlert, CheckCircle2, AlertTriangle, ChevronRight, Zap, Lock, Unlock } from 'lucide-react';

// --- Utility Components ---
const CyberButton = ({ children, onClick, active = false, variant = 'primary', className = '' }) => {
  const baseStyle = "relative px-4 py-2 font-bold transition-all duration-200 border rounded-md";
  
  const variants = {
    primary: active 
      ? "bg-blue-600 border-blue-600 text-white" 
      : "bg-white border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50",
    danger: "bg-white border-rose-300 text-rose-600 hover:bg-rose-50",
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
};

const GlitchText = ({ text, className = "" }) => (
  <span className={`font-bold text-slate-800 ${className}`}>
    {text}
  </span>
);

// --- Modules ---

// 1. Password Cracker Simulator
const PasswordModule = ({ onComplete }) => {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState({ score: 0, time: '瞬殺 (0秒)', color: 'text-red-600', barColor: 'bg-red-500', max: false });

  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, time: '0秒', color: 'text-red-600', barColor: 'bg-red-500', max: false };

    let charsetSize = 0;
    if (/[a-z]/.test(pwd)) charsetSize += 26;
    if (/[A-Z]/.test(pwd)) charsetSize += 26;
    if (/[0-9]/.test(pwd)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) charsetSize += 32;

    const combinations = Math.pow(charsetSize, pwd.length);
    const guessesPerSecond = 100000000000; // 100 billion guesses/sec
    const seconds = combinations / guessesPerSecond;

    let timeStr, scoreVal, color, barColor;
    
    if (seconds < 1) { timeStr = '瞬殺 (< 1秒)'; scoreVal = 10; color = 'text-red-600'; barColor = 'bg-red-500'; }
    else if (seconds < 60) { timeStr = `${Math.round(seconds)}秒`; scoreVal = 25; color = 'text-orange-600'; barColor = 'bg-orange-500'; }
    else if (seconds < 3600) { timeStr = `${Math.round(seconds / 60)}分`; scoreVal = 40; color = 'text-yellow-600'; barColor = 'bg-yellow-500'; }
    else if (seconds < 86400) { timeStr = `${Math.round(seconds / 3600)}時間`; scoreVal = 60; color = 'text-yellow-600'; barColor = 'bg-yellow-400'; }
    else if (seconds < 31536000) { timeStr = `${Math.round(seconds / 86400)}日`; scoreVal = 75; color = 'text-green-600'; barColor = 'bg-green-500'; }
    else if (seconds < 3153600000) { timeStr = `${Math.round(seconds / 31536000)}年`; scoreVal = 90; color = 'text-emerald-600'; barColor = 'bg-emerald-500'; }
    else { timeStr = '数百年以上 (解読ほぼ不可)'; scoreVal = 100; color = 'text-blue-600'; barColor = 'bg-blue-600'; }

    return { score: scoreVal, time: timeStr, color, barColor, max: scoreVal === 100 };
  };

  useEffect(() => {
    setStrength(calculateStrength(password));
  }, [password]);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="border border-slate-200 bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Key className="w-6 h-6 text-blue-600" /> パスワード強度シミュレーター
        </h2>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          入力された文字列に対し、最新のGPUクラスタ（毎秒1000億回試行）による総当たり攻撃の突破時間を計算します。
        </p>
        
        <div className="relative mb-6">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワードを入力してください"
            className="w-full bg-slate-50 border-2 border-slate-300 focus:border-blue-500 text-slate-900 p-4 font-mono rounded-lg outline-none transition-all placeholder-slate-400"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            {password.length > 0 ? <Lock className="w-5 h-5 text-blue-500" /> : <Unlock className="w-5 h-5" />}
          </div>
        </div>

        <div className="space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex justify-between font-bold text-sm">
            <span className="text-slate-600">推定解読時間:</span>
            <span className={strength.color}>{strength.time}</span>
          </div>
          
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 ease-out ${strength.barColor}`}
              style={{ width: `${strength.score}%` }}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <CyberButton onClick={() => onComplete(strength.score)}>
            結果を保存して次へ <ChevronRight className="w-4 h-4" />
          </CyberButton>
        </div>
      </div>
    </div>
  );
};

// 2. Phishing Scanner
const PhishingModule = ({ onComplete }) => {
  const [found, setFound] = useState([]);
  const [showHint, setShowHint] = useState(false);
  
  const hotspots = [
    { id: 1, text: "security@amozon-support.co", reason: "偽のドメイン（正規は amazon.co.jp など）" },
    { id: 2, text: "24時間以内にアカウントが永久凍結", reason: "緊急性を煽り、冷静な判断を奪う手口" },
    { id: 3, text: "http://login-verify-amz.net/auth", reason: "公式と無関係な怪しいURL。httpsでもない" }
  ];

  const handleSpotClick = (id) => {
    if (!found.includes(id)) {
      setFound([...found, id]);
    }
  };

  const isComplete = found.length === hotspots.length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="border border-slate-200 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-600" /> フィッシング・スキャナー
          </h2>
          <div className="text-sm bg-blue-50 text-blue-800 px-3 py-1 rounded-full border border-blue-200 font-bold">
            特定した脅威: {found.length} / {hotspots.length}
          </div>
        </div>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          受信トレイに不審なメールが届きました。フィッシング詐欺の特徴を示す怪しい箇所を <strong className="text-rose-600">3つ</strong> クリックして特定してください。
        </p>

        {/* Mock Email UI */}
        <div className="bg-white rounded-lg overflow-hidden text-slate-800 shadow-md mb-6 select-none relative border border-slate-300">
          {/* Overlay when complete */}
          {isComplete && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-blue-600 animate-in fade-in duration-300">
              <ShieldAlert className="w-16 h-16 mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold mb-2">脅威を特定しました</h3>
              <p className="text-slate-600 font-medium">すべてのフィッシング要素を発見しました。</p>
            </div>
          )}

          <div className="bg-slate-100 border-b border-slate-300 p-4">
            <div className="flex text-sm mb-2">
              <span className="w-16 text-slate-500">差出人:</span>
              <span className="font-semibold text-slate-800">
                Amazonサポート &lt;
                <span 
                  onClick={() => handleSpotClick(1)}
                  className={`cursor-pointer px-1 rounded transition-colors ${found.includes(1) ? 'bg-rose-500 text-white font-bold ring-2 ring-rose-300' : 'hover:bg-rose-200'}`}
                >
                  security@amozon-support.co
                </span>
                &gt;
              </span>
            </div>
            <div className="flex text-sm">
              <span className="w-16 text-slate-500">件名:</span>
              <span className="font-bold text-slate-800">【重要】アカウント異常アクセスの検知</span>
            </div>
          </div>
          
          <div className="p-6 bg-white space-y-4 text-sm leading-relaxed text-slate-700">
            <p>お客様各位</p>
            <p>平素より当サービスをご利用いただき誠にありがとうございます。</p>
            <p>
              お客様のアカウントに対し、海外からの不審なログイン試行を検知しました。
              セキュリティ保護のため、現在アカウントの一部機能を制限しております。
            </p>
            <p className="font-bold text-red-600 bg-red-50 p-2 rounded inline-block">
              <span 
                  onClick={() => handleSpotClick(2)}
                  className={`cursor-pointer px-1 rounded transition-colors ${found.includes(2) ? 'bg-red-500 text-white font-bold ring-2 ring-red-600' : 'hover:bg-red-200'}`}
                >
                ご本人様確認が取れない場合、24時間以内にアカウントが永久凍結されます。
              </span>
            </p>
            <p>以下のリンクより、至急ご本人様確認手続きをお願いいたします。</p>
            
            <div className="my-6">
              <span 
                onClick={() => handleSpotClick(3)}
                className={`cursor-pointer inline-block text-blue-600 underline break-all p-2 rounded transition-colors ${found.includes(3) ? 'bg-rose-500 text-white font-bold no-underline ring-2 ring-rose-300' : 'hover:bg-blue-50'}`}
              >
                http://login-verify-amz.net/auth/recover?user=849204
              </span>
            </div>

            <p>※本メールは自動送信されています。返信には対応しておりません。<br/>
               Amazonカスタマーサポート</p>
          </div>
        </div>

        {/* Feedback Area */}
        <div className="h-32">
          {found.length > 0 && (
            <div className="space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200 h-full overflow-y-auto">
              <h4 className="font-bold text-slate-700 text-sm mb-2 flex items-center gap-2"><Terminal className="w-4 h-4"/> 解析ログ:</h4>
              {found.map(id => (
                <div key={id} className="flex items-start gap-2 text-sm text-slate-600 animate-in slide-in-from-bottom-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{hotspots.find(h => h.id === id).reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button 
            onClick={() => setShowHint(true)}
            className="text-sm text-slate-500 hover:text-blue-600 underline transition-colors"
          >
            ヒントを見る
          </button>
          
          {isComplete && (
            <CyberButton onClick={() => onComplete(100)}>
              結果を見る <ChevronRight className="w-4 h-4" />
            </CyberButton>
          )}
        </div>
        
        {showHint && !isComplete && (
          <div className="mt-4 text-sm text-amber-800 bg-amber-50 p-3 rounded border border-amber-200">
            ヒント: 「送信元のドメイン」「煽り文句」「リンク先のURL」に注意してください。
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Result Module
const ResultModule = ({ scores, onRestart }) => {
  const avgScore = Math.round((scores.password + scores.phishing) / 2);
  
  let rank = { label: 'F', title: '要注意', color: 'text-rose-600', desc: 'ハッカーの標的になりやすい状態です。基本的なセキュリティリテラシーを見直しましょう。' };
  if (avgScore >= 40) rank = { label: 'C', title: '初心者', color: 'text-amber-600', desc: '最低限の知識はありますが、高度な攻撃には騙される危険があります。' };
  if (avgScore >= 70) rank = { label: 'B', title: '中級者', color: 'text-emerald-600', desc: '標準的な防衛力を備えています。日々の業務でも油断せず警戒を続けてください。' };
  if (avgScore >= 90) rank = { label: 'S', title: 'セキュリティ・エリート', color: 'text-blue-600', desc: '完璧な防衛力です。あなたは組織を守るサイバーセキュリティの要です。' };

  return (
    <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in duration-700">
      <div className="text-center mb-8">
        <h2 className="text-lg text-slate-500 mb-2 font-bold">総合セキュリティ評価</h2>
        <div className={`text-8xl font-black my-6 ${rank.color}`}>
          {rank.label}
        </div>
        <div className={`text-2xl font-bold ${rank.color}`}>
          [{rank.title}]
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-8 rounded-xl w-full max-w-md shadow-sm mb-8">
        <p className="text-slate-700 text-base leading-relaxed text-center mb-8 font-medium">
          {rank.desc}
        </p>

        <div className="space-y-4 text-sm font-bold">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="text-slate-500">パスワード強度スコア:</span>
            <span className="text-slate-800 bg-slate-100 px-3 py-1 rounded-full">{scores.password} / 100</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="text-slate-500">脅威検知スコア:</span>
            <span className="text-slate-800 bg-slate-100 px-3 py-1 rounded-full">{scores.phishing} / 100</span>
          </div>
          <div className="flex justify-between items-center pt-3 text-lg">
            <span className="text-slate-600">総合スコア:</span>
            <span className="text-blue-600 font-black">{avgScore} PTS</span>
          </div>
        </div>
      </div>

      <CyberButton onClick={onRestart} className="px-8 py-3 text-lg">
        <Zap className="w-5 h-5" /> もう一度プレイする
      </CyberButton>
    </div>
  );
};


// --- Main Application ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scores, setScores] = useState({ password: 0, phishing: 0 });

  // Remove previous CSS hacks
  useEffect(() => {
    // No background injection needed
  }, []);

  const handlePasswordComplete = (score) => {
    setScores(prev => ({ ...prev, password: score }));
    setActiveTab('phishing');
  };

  const handlePhishingComplete = (score) => {
    setScores(prev => ({ ...prev, phishing: score }));
    setActiveTab('result');
  };

  const resetSystem = () => {
    setScores({ password: 0, phishing: 0 });
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 font-sans bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="max-w-4xl w-full mx-auto mb-10 flex flex-col md:flex-row items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <ShieldAlert className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-800">
            <GlitchText text="セキュリティ体験シミュレーター" />
          </h1>
        </div>

        {/* Tab Navigation */}
        <nav className="flex gap-2 text-sm font-bold">
          <CyberButton 
            variant="primary" 
            active={activeTab === 'dashboard' || activeTab === 'password'} 
            onClick={() => setActiveTab('password')}
          >
            1. パスワード検証
          </CyberButton>
          <CyberButton 
            variant="primary" 
            active={activeTab === 'phishing'}
            onClick={() => activeTab !== 'dashboard' && setActiveTab('phishing')}
            className={activeTab === 'dashboard' ? 'opacity-50 cursor-not-allowed' : ''}
          >
            2. メール監査
          </CyberButton>
          <CyberButton 
            variant="primary" 
            active={activeTab === 'result'}
            onClick={() => activeTab === 'result' && setActiveTab('result')}
            className={activeTab !== 'result' ? 'opacity-50 cursor-not-allowed' : ''}
          >
            3. 総合評価
          </CyberButton>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto">
        {activeTab === 'dashboard' && (
          <div className="text-center py-20 animate-in fade-in zoom-in duration-700">
            <div className="relative inline-block mb-8">
              <ShieldAlert className="w-24 h-24 text-blue-500 mx-auto relative z-10" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-6">
              セキュリティ・トレーニングを開始
            </h2>
            <p className="text-slate-600 mb-10 max-w-lg mx-auto leading-relaxed text-base font-medium">
              このシミュレーターは、パスワード漏洩のリスクと、巧妙化するフィッシング詐欺の手口を疑似体験し、リテラシーを向上させるためのシステムです。
            </p>
            <CyberButton onClick={() => setActiveTab('password')} className="text-lg py-4 px-8">
              シミュレーションを開始 <Zap className="w-5 h-5 ml-2" />
            </CyberButton>
          </div>
        )}

        {activeTab === 'password' && <PasswordModule onComplete={handlePasswordComplete} />}
        
        {activeTab === 'phishing' && <PhishingModule onComplete={handlePhishingComplete} />}
        
        {activeTab === 'result' && <ResultModule scores={scores} onRestart={resetSystem} />}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-slate-500 font-medium flex justify-center items-center gap-2">
        <Lock className="w-4 h-4 text-slate-400" /> 安全な接続が確立されています
      </footer>
    </div>
  );
}
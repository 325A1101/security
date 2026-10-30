export interface AttackProfile {
  id: string;
  name: string;
  nameJa: string;
  speed: number; // guesses per second
  description: string;
}

export const ATTACK_PROFILES: AttackProfile[] = [
  {
    id: 'pc',
    name: 'Standard Laptop',
    nameJa: '一般PC / ノートPC',
    speed: 100_000_000, // 100M/sec
    description: '一般的なCPU/内蔵グラフィックスによる総当たり攻撃'
  },
  {
    id: 'gpu_cluster',
    name: '8x RTX 4090 GPU Rig',
    nameJa: '最新GPUクラスタ (8基)',
    speed: 100_000_000_000, // 100B/sec
    description: 'サイバー犯罪組織が使用する専用パスワードクラック装置'
  },
  {
    id: 'botnet',
    name: 'Global Botnet (10k nodes)',
    nameJa: '分散ボットネット (1万台規模)',
    speed: 10_000_000_000_000, // 10T/sec
    description: '世界中の感染端末を動員した大規模分散アタック'
  },
  {
    id: 'supercomputer',
    name: 'Nation-State Supercomputer',
    nameJa: '国家級スーパーコンピュータ',
    speed: 1_000_000_000_000_000, // 1 Quadrillion/sec
    description: '政府機関・高度標的型攻撃（APT）レベルの計算資源'
  }
];

const COMMON_PASSWORDS = new Set([
  'password', 'password123', 'admin', 'admin123', '123456', '12345678', '123456789',
  'qwerty', 'letmein', 'welcome', 'login', 'pass1234', 'master', 'shadow', 'superman',
  'baseball', 'football', 'monkey', 'dragon', 'iloveyou', 'secret', 'default',
  'password1', 'test1234', '111111', '000000', 'p@ssword', 'zaq12wsx'
]);

export interface PasswordAnalysis {
  entropyBits: number;
  charsetSize: number;
  combinations: number;
  score: number; // 0 to 100
  timeString: string;
  color: string;
  barColor: string;
  levelText: string;
  weaknesses: string[];
  strengths: string[];
  timesByProfile: { profileId: string; timeString: string; seconds: number }[];
}

export function formatCrackTime(seconds: number): string {
  if (seconds < 0.001) return '瞬時 (< 1ミリ秒)';
  if (seconds < 1) return '瞬殺 (< 1秒)';
  if (seconds < 60) return `${Math.round(seconds)}秒`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}分`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)}時間`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)}日`;
  if (seconds < 3153600000) return `${Math.max(1, Math.round(seconds / 31536000))}年`;
  if (seconds < 31536000000) {
    const centuries = Math.max(1, Math.round(seconds / 3153600000));
    const years = Math.round(seconds / 31536000);
    return `${centuries}世紀 (${years.toLocaleString()}年)`;
  }
  if (seconds < 31536000000000) {
    const manYears = Math.round((seconds / 31536000) / 10000);
    return `${manYears.toLocaleString()}万年以上`;
  }
  return '宇宙の寿命以上 (解読不可)';
}

export function analyzePassword(pwd: string): PasswordAnalysis {
  if (!pwd) {
    return {
      entropyBits: 0,
      charsetSize: 0,
      combinations: 0,
      score: 0,
      timeString: '0秒',
      color: 'text-rose-500',
      barColor: 'bg-rose-500',
      levelText: '未入力',
      weaknesses: ['パスワードを入力してください'],
      strengths: [],
      timesByProfile: ATTACK_PROFILES.map(p => ({ profileId: p.id, timeString: '0秒', seconds: 0 }))
    };
  }

  const weaknesses: string[] = [];
  const strengths: string[] = [];

  let charsetSize = 0;
  const hasLower = /[a-z]/.test(pwd);
  const hasUpper = /[A-Z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSymbol = /[^a-zA-Z0-9]/.test(pwd);

  if (hasLower) charsetSize += 26;
  if (hasUpper) charsetSize += 26;
  if (hasNumber) charsetSize += 10;
  if (hasSymbol) charsetSize += 32;

  if (hasLower) strengths.push('英小文字を使用');
  if (hasUpper) strengths.push('英大文字を使用');
  if (hasNumber) strengths.push('数字を使用');
  if (hasSymbol) strengths.push('記号・特殊文字を使用');

  const lowerPwd = pwd.toLowerCase();

  // Check dictionary
  if (COMMON_PASSWORDS.has(lowerPwd)) {
    weaknesses.push('世界で最も頻出する漏洩パスワード一覧に含まれています');
  }

  // Check length
  if (pwd.length < 8) {
    weaknesses.push('8文字未満（現代の基準では非常に危険です）');
  } else if (pwd.length >= 16) {
    strengths.push('16文字以上の堅牢な長さ');
  } else if (pwd.length >= 12) {
    strengths.push('12文字以上の推奨基準をクリア');
  }

  // Check repetitive
  if (/(.)\1{2,}/.test(pwd)) {
    weaknesses.push('同一文字が3回以上連続しています');
  }

  // Check sequential sequences
  if (/012|123|234|345|456|567|678|789|abc|bcd|cde|def|qwer|asdf/.test(lowerPwd)) {
    weaknesses.push('予測されやすいキーボード配列や連番が含まれています');
  }

  // Entropy calculation
  // Entropy = L * log2(N)
  const entropyBits = Math.round(pwd.length * (charsetSize > 0 ? Math.log2(charsetSize) : 0));
  const combinations = Math.pow(charsetSize, pwd.length);

  // Reference attack speed: GPU Cluster (100 Billion / sec)
  const gpuSpeed = 100_000_000_000;
  const gpuSeconds = combinations / gpuSpeed;

  const timesByProfile = ATTACK_PROFILES.map(profile => ({
    profileId: profile.id,
    seconds: combinations / profile.speed,
    timeString: formatCrackTime(combinations / profile.speed)
  }));

  // Score calculation based on entropy and penalties
  let score = 0;
  if (COMMON_PASSWORDS.has(lowerPwd)) {
    score = 5;
  } else {
    // 0 to 80 bits is 0 to 100
    score = Math.min(100, Math.round((entropyBits / 80) * 100));
    if (pwd.length < 8) score = Math.min(score, 25);
    if (weaknesses.length > 2) score = Math.max(10, score - 20);
    if (charsetSize >= 94 && pwd.length >= 14) score = 100;
  }

  let color = 'text-rose-400';
  let barColor = 'bg-rose-500';
  let levelText = '極めて脆弱 (Instant Breach)';

  if (score >= 90) {
    color = 'text-emerald-400';
    barColor = 'bg-emerald-500';
    levelText = '要塞級 (Fortress)';
  } else if (score >= 70) {
    color = 'text-cyan-400';
    barColor = 'bg-cyan-500';
    levelText = '強固 (Strong)';
  } else if (score >= 50) {
    color = 'text-amber-400';
    barColor = 'bg-amber-500';
    levelText = '中程度 (Moderate)';
  } else if (score >= 30) {
    color = 'text-orange-400';
    barColor = 'bg-orange-500';
    levelText = '脆弱 (Weak)';
  }

  return {
    entropyBits,
    charsetSize,
    combinations,
    score,
    timeString: formatCrackTime(gpuSeconds),
    color,
    barColor,
    levelText,
    weaknesses,
    strengths,
    timesByProfile
  };
}

export function generateSecurePassword(length = 16, includeSymbols = true): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let chars = lowercase + uppercase + numbers;
  if (includeSymbols) chars += symbols;

  let result = '';
  // Ensure at least one of each required type
  result += lowercase[Math.floor(Math.random() * lowercase.length)];
  result += uppercase[Math.floor(Math.random() * uppercase.length)];
  result += numbers[Math.floor(Math.random() * numbers.length)];
  if (includeSymbols) {
    result += symbols[Math.floor(Math.random() * symbols.length)];
  }

  for (let i = result.length; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  // Shuffle
  return result.split('').sort(() => 0.5 - Math.random()).join('');
}

// Passphrase generator (Diceware style)
const WORD_LIST = [
  'cyber', 'shield', 'falcon', 'quantum', 'matrix', 'beacon', 'orbital', 'sentinel',
  'nebula', 'protocol', 'aurora', 'citadel', 'glacier', 'phantom', 'titan', 'vortex',
  'iron', 'cipher', 'horizon', 'zenith', 'pulse', 'echo', 'shadow', 'vector'
];

export function generatePassphrase(wordCount = 4): string {
  const chosen: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const word = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    // Capitalize first letter
    chosen.push(word.charAt(0).toUpperCase() + word.slice(1));
  }
  const randomNum = Math.floor(Math.random() * 90 + 10);
  return chosen.join('-') + '-' + randomNum + '!';
}

// --- Incident Defense Mini-Game Types & Rules ---
export interface CyberThreat {
  id: string;
  name: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  vectorExplanation: string;
  correctCountermeasureId: string;
}

export interface Countermeasure {
  id: string;
  name: string;
  iconName: string;
  description: string;
}

export const THREATS: CyberThreat[] = [
  {
    id: 't1',
    name: 'ランサムウェア感染 & 社内ファイル暗号化',
    category: 'マルウェア・身代金要求',
    severity: 'CRITICAL',
    description: '社内共有サーバの主要業務ファイルが一斉に拡張子「.locked」に変更され、ビットコインを要求する画面が表示された。',
    vectorExplanation: '攻撃者は身代金を払わせるためバックアップの破壊も狙います。隔離された不変（イミュータブル）オフラインバックアップと自動ロールバックが唯一の確実な復旧策です。',
    correctCountermeasureId: 'c_backup'
  },
  {
    id: 't2',
    name: '大量トラフィックによるWebサーバー停止 (DDoS)',
    category: 'サービス妨害攻撃',
    severity: 'HIGH',
    description: 'ECサイトへ毎秒数十万件の不正パケットが殺到し、帯域がパンクして正規の顧客がアクセス不能になっている。',
    vectorExplanation: 'DDoS攻撃にはサーバー単体での耐性は限界があります。エッジでのAnycast CDNとWAF/レートリミットによるスクラビング（無害化）が不可欠です。',
    correctCountermeasureId: 'c_cdn_waf'
  },
  {
    id: 't3',
    name: 'パスワード流出リストによる総当たり試行 (クレデンシャルスタッフィング)',
    category: '認証突破・なりすまし',
    severity: 'CRITICAL',
    description: '他社サービスから漏洩したID/PWリストを用いて、自社ログインAPIに数万回のアカウント乗っ取り試行が走っている。',
    vectorExplanation: 'パスワードが合致していても、スマートフォンやFIDO2ハードウェアキーによる2要素認証（MFA）が強制されていれば侵入を100%遮断できます。',
    correctCountermeasureId: 'c_mfa'
  },
  {
    id: 't4',
    name: '公開Webフォームを狙ったSQLインジェクション',
    category: 'Webアプリケーション脆弱性',
    severity: 'HIGH',
    description: '検索バーに `\' OR \'1\'=\'1` などの文字列を入力され、顧客データベースの全レコードが抽出されそうになっている。',
    vectorExplanation: 'SQLインジェクションは、プレースホルダを用いたパラメータ化クエリ（Prepared Statement）の実装とWAFの入力検証で完全に無力化できます。',
    correctCountermeasureId: 'c_waf_query'
  },
  {
    id: 't5',
    name: 'カフェの野良Wi-Fiによる盗聴・中間者攻撃 (MitM)',
    category: 'ネットワーク傍受',
    severity: 'MEDIUM',
    description: '社員が外出先の公衆フリーWi-Fiに接続して社内ポータルにアクセス中、パケットを傍受・改ざんされるリスクがある。',
    vectorExplanation: '公衆回線での平文通信リスクは、社内専用の暗号化トンネル（VPN / WireGuard）とHSTS（厳格な常時TLS暗号化）の強制で通信を完全秘匿します。',
    correctCountermeasureId: 'c_vpn_tls'
  }
];

export const COUNTERMEASURES: Countermeasure[] = [
  {
    id: 'c_mfa',
    name: '多要素認証 (MFA / FIDO2)',
    iconName: 'Smartphone',
    description: 'パスワード以外の物理トークンや認証アプリで突破を完全阻止'
  },
  {
    id: 'c_backup',
    name: '不変オフラインバックアップ (3-2-1ルール)',
    iconName: 'DatabaseBackup',
    description: '暗号化不可能な隔離ストレージから即座に正常データをロールバック'
  },
  {
    id: 'c_cdn_waf',
    name: 'Anycast CDN & DDoSスクラビング',
    iconName: 'Activity',
    description: '世界規模の分散ネットワークで不正トラフィックを分散・吸収'
  },
  {
    id: 'c_waf_query',
    name: 'パラメータ化クエリ & Web WAF',
    iconName: 'Code',
    description: '入力文字列をSQL命令として解釈させず、安全にエスケープ処理'
  },
  {
    id: 'c_vpn_tls',
    name: '常時TLS暗号化 & 企業VPN',
    iconName: 'ShieldCheck',
    description: '公衆ネットワーク上のすべての通信パケットを強力にトンネリング'
  }
];

export function calculateOverallEvaluation(scores: { password: number; phishing: number; defense: number }) {
  const avg = Math.round((scores.password * 0.35) + (scores.phishing * 0.35) + (scores.defense * 0.30));

  if (avg >= 90) {
    return {
      rank: 'S',
      rankTitle: '最高位サイバーガーディアン',
      rankColor: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/20 border-cyan-500/50',
      description: '卓越した脅威検知能力と強固なセキュリティ習慣を保有しています。組織のセキュリティリーダーとして推奨されます。',
      score: avg
    };
  } else if (avg >= 75) {
    return {
      rank: 'A',
      rankTitle: 'セキュリティエキスパート',
      rankColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20 border-emerald-500/50',
      description: '大半の巧妙なサイバー攻撃・フィッシングを識別し、堅牢な防御姿勢を維持できています。',
      score: avg
    };
  } else if (avg >= 55) {
    return {
      rank: 'B',
      rankTitle: '標準セキュリティ実践者',
      rankColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/20 border-amber-500/50',
      description: '基本的な防衛意識を持っていますが、組織を狙った標的型フィッシングや複合攻撃には警戒が必要です。',
      score: avg
    };
  } else {
    return {
      rank: 'C',
      rankTitle: '要警戒・訓練推奨',
      rankColor: 'text-rose-400',
      badgeBg: 'bg-rose-500/20 border-rose-500/50',
      description: 'パスワード強度やフィッシング見極めに脆弱性が確認されました。日頃のセキュリティ設定の改善が急務です。',
      score: avg
    };
  }
}

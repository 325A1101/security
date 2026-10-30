import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzePassword,
  formatCrackTime,
  generateSecurePassword,
  generatePassphrase,
  calculateOverallEvaluation,
  THREATS,
  COUNTERMEASURES
} from './securityLogic.ts';

test('empty password returns 0 score and warning', () => {
  const result = analyzePassword('');
  assert.equal(result.score, 0);
  assert.equal(result.entropyBits, 0);
  assert.equal(result.weaknesses.length > 0, true);
});

test('weak common password gets flagged and penalized', () => {
  const result = analyzePassword('password123');
  assert.equal(result.score <= 25, true);
  assert.equal(result.weaknesses.some(w => w.includes('頻出') || w.includes('危険')), true);
});

test('complex 16-character password achieves high score', () => {
  const complex = 'Kx9#vL!2pQ&mZ7$w';
  const result = analyzePassword(complex);
  assert.equal(result.score >= 90, true);
  assert.equal(result.levelText.includes('要塞') || result.levelText.includes('Strong') || result.levelText.includes('Fortress'), true);
  assert.equal(result.entropyBits >= 80, true);
});

test('password generator produces requested length and diversity', () => {
  const generated = generateSecurePassword(20, true);
  assert.equal(generated.length, 20);
  assert.equal(/[a-z]/.test(generated), true);
  assert.equal(/[A-Z]/.test(generated), true);
  assert.equal(/[0-9]/.test(generated), true);
});

test('passphrase generator creates hyphenated words with digits', () => {
  const passphrase = generatePassphrase(4);
  assert.equal(passphrase.includes('-'), true);
  assert.equal(/\d/.test(passphrase), true);
});

test('threats map cleanly to defined countermeasures', () => {
  const countermeasureIds = new Set(COUNTERMEASURES.map(c => c.id));
  for (const threat of THREATS) {
    assert.equal(
      countermeasureIds.has(threat.correctCountermeasureId),
      true,
      `Threat ${threat.id} has invalid countermeasure ${threat.correctCountermeasureId}`
    );
  }
});

test('overall evaluation yields correct rank tiers', () => {
  const topTier = calculateOverallEvaluation({ password: 95, phishing: 95, defense: 100 });
  assert.equal(topTier.rank, 'S');

  const lowTier = calculateOverallEvaluation({ password: 20, phishing: 30, defense: 40 });
  assert.equal(lowTier.rank, 'C');
});

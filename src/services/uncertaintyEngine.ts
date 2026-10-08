import { CandidateReading, WordPrediction, WordStatus } from '../types';
import { levenshteinDistance } from './metricsCalculator';

/**
 * Normalizes a word for comparison (strips surrounding punctuation, lowercase)
 */
export function cleanWord(w: string): string {
  return w.toLowerCase().replace(/^[^\w\u0B80-\u0BFF\u0900-\u097F]+|[^\w\u0B80-\u0BFF\u0900-\u097F]+$/g, '');
}

/**
 * Calculate similarity between two words (0.0 to 1.0)
 */
export function wordSimilarity(w1: string, w2: string): number {
  const c1 = cleanWord(w1);
  const c2 = cleanWord(w2);
  if (c1 === c2) return 1.0;
  const maxLen = Math.max(c1.length, c2.length);
  if (maxLen === 0) return 1.0;
  const dist = levenshteinDistance(c1, c2);
  return Math.max(0, 1.0 - dist / maxLen);
}

export interface CandidateVote {
  candidate: string;
  count: number;
  sources: string[];
}

/**
 * Groups and counts candidate readings from recognition passes
 */
export function clusterCandidates(
  readings: { passName: string; word: string }[]
): CandidateVote[] {
  const clusters: CandidateVote[] = [];

  for (const item of readings) {
    const word = item.word.trim();
    if (!word) continue;

    let matched = false;
    for (const cluster of clusters) {
      if (wordSimilarity(cluster.candidate, word) >= 0.85) {
        cluster.count += 1;
        cluster.sources.push(item.passName);
        // Keep the cleaner/longer casing if informative
        if (word.length >= cluster.candidate.length && !/^[a-z]+$/.test(word)) {
          cluster.candidate = word;
        }
        matched = true;
        break;
      }
    }

    if (!matched) {
      clusters.push({
        candidate: word,
        count: 1,
        sources: [item.passName],
      });
    }
  }

  // Sort by highest vote count
  return clusters.sort((a, b) => b.count - a.count);
}

/**
 * Classifies uncertainty and synthesizes plain-language evidence for a word
 */
export function analyzeWordUncertainty(
  primaryWord: string,
  passReadings: { passName: string; word: string }[],
  isCrossedOut: boolean = false,
  isMarginNote: boolean = false,
  imageQualityScore: number = 75
): {
  status: WordStatus;
  selectedText: string;
  agreementScore: number;
  stabilityScore: number;
  candidates: CandidateReading[];
  reason: string;
} {
  const totalPasses = Math.max(1, passReadings.length);
  const clusters = clusterCandidates(passReadings);

  const topCluster = clusters[0] || { candidate: primaryWord, count: 1, sources: ['Pass A'] };
  const agreement = topCluster.count / totalPasses;

  // Transform into CandidateReading array
  const candidates: CandidateReading[] = clusters.map((c) => ({
    text: c.candidate,
    passSource: c.sources.join(', '),
    votes: c.count,
    confidence: Number((c.count / totalPasses).toFixed(2)),
    normalizedScore: Number((c.count / totalPasses).toFixed(2)),
  }));

  // Crossed out text gets explicit recognition
  if (isCrossedOut) {
    return {
      status: 'uncertain',
      selectedText: topCluster.candidate,
      agreementScore: Number(agreement.toFixed(2)),
      stabilityScore: 0.5,
      candidates,
      reason: `Strikethrough stroke detected across handwriting. Preserving suspected original reading: "${topCluster.candidate}".`,
    };
  }

  // Margin note warning
  if (isMarginNote && agreement < 0.75) {
    return {
      status: 'uncertain',
      selectedText: topCluster.candidate,
      agreementScore: Number(agreement.toFixed(2)),
      stabilityScore: 0.6,
      candidates,
      reason: `Cramped margin note with split readings (${topCluster.count}/${totalPasses} passes).`,
    };
  }

  // Illegible: Severe quality degradation, blur, or severe stroke fragmentation
  const isSevereFragmentation =
    clusters.length >= 3 && topCluster.count === 1 && imageQualityScore < 45;
  const isExtremeNoise = topCluster.candidate.replace(/[^a-zA-Z0-9\u0B80-\u0BFF\u0900-\u097F]/g, '').length === 0;

  if (isSevereFragmentation || isExtremeNoise || imageQualityScore < 20) {
    return {
      status: 'illegible',
      selectedText: '[illegible]',
      agreementScore: 0.15,
      stabilityScore: 0.1,
      candidates,
      reason: 'Insufficient visual stroke evidence. InkSure abstains from inventing text.',
    };
  }

  // Reliable: Strong consensus (at least 75-80% of passes agree and quality is adequate)
  if (agreement >= 0.75 && imageQualityScore >= 35) {
    return {
      status: 'reliable',
      selectedText: topCluster.candidate,
      agreementScore: Number(agreement.toFixed(2)),
      stabilityScore: 0.95,
      candidates,
      reason: `Consensus verified across ${topCluster.count}/${totalPasses} recognition passes.`,
    };
  }

  // Uncertain: Multiple plausible candidates competing
  const alternative = clusters[1];
  const diffReason = alternative
    ? `Recognition passes disagree between "${topCluster.candidate}" (${topCluster.count}/${totalPasses}) and "${alternative.candidate}" (${alternative.count}/${totalPasses}).`
    : `Weak stroke stability across preprocessing passes (${topCluster.count}/${totalPasses} passes supported).`;

  return {
    status: 'uncertain',
    selectedText: topCluster.candidate,
    agreementScore: Number(agreement.toFixed(2)),
    stabilityScore: Number((agreement * 0.85).toFixed(2)),
    candidates,
    reason: diffReason,
  };
}

/**
 * Reconstructs clean document string with visible uncertainty markers
 */
export function formatInkSureDocumentText(words: WordPrediction[]): string {
  return words
    .map((w) => {
      if (w.humanCorrection) {
        return w.humanCorrection;
      }
      if (w.status === 'illegible') {
        return '[illegible]';
      }
      if (w.isCrossedOut) {
        return `~~${w.text}~~`;
      }
      if (w.status === 'uncertain') {
        return `[uncertain: ${w.text}]`;
      }
      return w.text;
    })
    .join(' ');
}

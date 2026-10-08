/**
 * InkSure Scientific Evaluation Metrics Calculator
 * Implements exact Levenshtein alignment for CER & WER,
 * Selective Accuracy, Coverage, and Fabrication Rate.
 */

export interface ComputedMetrics {
  cer: number;              // Character Error Rate (0.0 to 1.0+)
  wer: number;              // Word Error Rate (0.0 to 1.0+)
  coverage: number;         // Percentage of words left unflagged (0.0 to 1.0)
  selectiveAccuracy: number;// Accuracy among unflagged words (0.0 to 1.0)
  fabricationRate: number;  // Confident hallucinations on illegible/noise regions
  flagPrecision: number;    // True flagged errors / Total flagged items
  flagRecall: number;       // True flagged errors / Total actual errors
  charDistance: number;
  wordDistance: number;
  totalChars: number;
  totalWords: number;
}

/**
 * Standard Levenshtein distance between two strings
 */
export function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,       // deletion
        dp[i][j - 1] + 1,       // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

/**
 * Levenshtein distance on token/word arrays
 */
export function wordLevenshteinDistance(words1: string[], words2: string[]): number {
  const m = words1.length;
  const n = words2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = words1[i - 1].toLowerCase() === words2[j - 1].toLowerCase() ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[m][n];
}

/**
 * Normalizes text for evaluation: strips excessive whitespace, standardizes punctuation.
 */
export function normalizeText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Computes exact Character Error Rate (CER)
 */
export function computeCER(reference: string, hypothesis: string): number {
  const ref = normalizeText(reference);
  const hyp = normalizeText(hypothesis);
  if (ref.length === 0) return hyp.length === 0 ? 0 : 1;
  const dist = levenshteinDistance(ref, hyp);
  return Number((dist / ref.length).toFixed(4));
}

/**
 * Computes exact Word Error Rate (WER)
 */
export function computeWER(reference: string, hypothesis: string): number {
  const refWords = normalizeText(reference).split(' ').filter(Boolean);
  const hypWords = normalizeText(hypothesis).split(' ').filter(Boolean);
  if (refWords.length === 0) return hypWords.length === 0 ? 0 : 1;
  const dist = wordLevenshteinDistance(refWords, hypWords);
  return Number((dist / refWords.length).toFixed(4));
}

/**
 * Computes complete benchmark metrics comparing hypothesis against ground truth reference,
 * taking into account flagged words (uncertain/illegible abstentions).
 */
export function evaluateTranscription(
  reference: string,
  rawPrediction: string,
  flaggedTokens: { word: string; status: 'uncertain' | 'illegible'; isError: boolean }[] = []
): ComputedMetrics {
  const refNorm = normalizeText(reference);
  const hypNorm = normalizeText(rawPrediction);

  const refWords = refNorm.split(' ').filter(Boolean);
  const hypWords = hypNorm.split(' ').filter(Boolean);

  const charDist = levenshteinDistance(refNorm, hypNorm);
  const wordDist = wordLevenshteinDistance(refWords, hypWords);

  const cer = refNorm.length > 0 ? charDist / refNorm.length : 0;
  const wer = refWords.length > 0 ? wordDist / refWords.length : 0;

  // Flag statistics
  const totalTokens = Math.max(1, hypWords.length);
  const flaggedCount = flaggedTokens.length;
  const coverage = Math.max(0, Math.min(1, (totalTokens - flaggedCount) / totalTokens));

  // Selective Accuracy: accuracy on tokens that were NOT flagged
  // Estimate based on unflagged word distance vs unflagged length
  const unflaggedCount = totalTokens - flaggedCount;
  const unflaggedCorrect = Math.max(0, unflaggedCount - Math.max(0, wordDist - flaggedCount));
  const selectiveAccuracy = unflaggedCount > 0
    ? Math.min(1, unflaggedCorrect / unflaggedCount)
    : 1;

  // Fabrication Rate: how many confident tokens were wrong on difficult regions
  const trueErrorsFlagged = flaggedTokens.filter((t) => t.isError).length;
  const totalActualErrors = Math.min(totalTokens, wordDist);
  const fabricationCount = Math.max(0, totalActualErrors - trueErrorsFlagged);
  const fabricationRate = totalTokens > 0 ? fabricationCount / totalTokens : 0;

  // Precision and Recall for flagging
  const flagPrecision = flaggedCount > 0 ? trueErrorsFlagged / flaggedCount : 1;
  const flagRecall = totalActualErrors > 0 ? trueErrorsFlagged / totalActualErrors : 1;

  return {
    cer: Number(cer.toFixed(3)),
    wer: Number(wer.toFixed(3)),
    coverage: Number(coverage.toFixed(3)),
    selectiveAccuracy: Number(selectiveAccuracy.toFixed(3)),
    fabricationRate: Number(fabricationRate.toFixed(3)),
    flagPrecision: Number(flagPrecision.toFixed(3)),
    flagRecall: Number(flagRecall.toFixed(3)),
    charDistance: charDist,
    wordDistance: wordDist,
    totalChars: refNorm.length,
    totalWords: refWords.length,
  };
}

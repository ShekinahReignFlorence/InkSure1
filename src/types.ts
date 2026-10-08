export type WordStatus = 'reliable' | 'uncertain' | 'illegible';

export type RegionType = 'main_text' | 'margin_note' | 'crossed_out' | 'diagram' | 'header';

export interface CandidateReading {
  text: string;
  passSource: string;
  votes: number;
  confidence: number;
  normalizedScore: number;
}

export interface WordPrediction {
  id: string;
  documentId: string;
  regionId: string;
  wordIndex: number;
  text: string;
  bbox: [number, number, number, number]; // [x, y, width, height] in percentage 0-100
  status: WordStatus;
  isCrossedOut: boolean;
  isMarginNote: boolean;
  isHyphen?: boolean;
  isHyphenated?: boolean;
  candidateReadings: CandidateReading[];
  readerCount: number;
  agreementScore: number; // 0.0 to 1.0 (agreement across passes)
  stabilityScore: number;  // 0.0 to 1.0 (consistency across preprocessing filters)
  reason: string;          // Human-friendly explanation
  originalAiText: string;
  humanCorrection?: string;
  cropUrl?: string;
  imageQualityScore?: number; // 0.0 to 1.0
  reviewed?: boolean;
  isAutoInterpreted?: boolean;
  requiresManualVerification?: boolean;
  isFinalWord?: boolean;
}

export interface DocumentRegion {
  id: string;
  type: RegionType;
  bbox: [number, number, number, number]; // percentage [x, y, width, height]
  text: string;
  wordIds: string[];
  note?: string;
}

export interface FinalWordEvidence {
  word: string;
  bbox: [number, number, number, number];
  cropUrl?: string;
  strokeCharacteristics: string;
  consensusSummary: string;
  confidenceScore: number;
  verified: boolean;
}

export interface OverallTestResult {
  testPassed: boolean;
  totalWordsTested: number;
  reliablePassedWithoutHuman: number;
  ambiguousFlaggedForReview: number;
  zeroHallucinationScore: number;
  strokeAlignmentScore: number;
  summary: string;
  auditCertificateId: string;
  testedAt: string;
}

export interface RecognitionPass {
  id: string;
  name: string;
  variant: 'original' | 'contrast' | 'sharpened' | 'segmented';
  description: string;
  rawText: string;
  confidence: number;
  processingTimeMs: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  uploadedAt: string;
  imageUrl: string;
  thumbnailUrl?: string;
  script: 'Auto Detect' | 'English' | 'Tamil' | 'Hindi' | 'Telugu' | 'Malayalam' | 'Mixed Script';
  mode: 'fast' | 'balanced' | 'maximum_reliability';
  regions: DocumentRegion[];
  words: WordPrediction[];
  fullText: string;
  baselineText: string;
  inkSureText: string;
  stats: {
    totalWords: number;
    reliableCount: number;
    uncertainCount: number;
    illegibleCount: number;
    crossedOutCount: number;
    marginNoteCount: number;
    hyphenCount?: number;
  };
  passes: RecognitionPass[];
  isReviewed: boolean;
  isDemo?: boolean;
  finalWordEvidence?: FinalWordEvidence;
  overallTestResult?: OverallTestResult;
}

export interface EvaluationSample {
  sampleId: string;
  title: string;
  writerId: string;
  difficulty: 'Moderate' | 'Hard' | 'Extreme';
  script: string;
  imageUrl: string;
  groundTruthText: string;
  baselineText: string;
  inkSureText: string;
  baselineCER: number;
  baselineWER: number;
  inkSureCER: number;
  inkSureWER: number;
  selectiveAccuracy: number;
  coverage: number;
  fabricationRate: number;
  flagPrecision: number;
  flagRecall: number;
  notes: string;
}

export interface AblationConfig {
  id: string;
  label: string;
  name: string;
  description: string;
  cer: number;
  wer: number;
  coverage: number;
  selectiveAccuracy: number;
  fabricationRate: number;
  notes: string;
}

export interface ApiSettings {
  provider: 'free_engine' | 'groq' | 'gemini' | 'paddle_vl';
  groqApiKey: string;
  groqModel: string;
  geminiApiKey: string;
  paddleEndpoint: string;
  uncertaintyThreshold: number; // e.g. 0.75
  abstentionThreshold: number;  // e.g. 0.40
}

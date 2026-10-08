import React from 'react';
import {
  FileText,
  Sliders,
  Layers,
  Sparkles,
  GitBranch,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Cpu,
  UserCheck,
  ArrowDown,
} from 'lucide-react';

export const HowItWorksView: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Upload Difficult Handwriting',
      desc: 'Accepts raw JPG/PNG scans of messy cursive, physician prescriptions, archival deeds, and degraded paper.',
      icon: <FileText className="w-5 h-5 text-blue-600" />,
    },
    {
      num: '02',
      title: 'Computer Vision Preprocessing',
      desc: 'Executes histogram contrast stretching, 3x3 high-pass Sobel edge sharpening, and adaptive Otsu binarization directly on canvas.',
      icon: <Sliders className="w-5 h-5 text-emerald-600" />,
    },
    {
      num: '03',
      title: 'Layout & Region Segmentation',
      desc: 'Detects spatial layout: separates main body sentences from margin annotations and flags pen strikethroughs.',
      icon: <Layers className="w-5 h-5 text-indigo-600" />,
    },
    {
      num: '04',
      title: 'Generate Unconstrained Baseline',
      desc: 'Runs a single-pass reader without safety constraints. This forms the baseline control that InkSure measures against.',
      icon: <Cpu className="w-5 h-5 text-slate-600" />,
    },
    {
      num: '05',
      title: 'Multiple Recognition Passes',
      desc: 'Executes 4 diverse recognition passes across raw, contrast-normalized, sharpened, and region-segmented image variants.',
      icon: <GitBranch className="w-5 h-5 text-purple-600" />,
    },
    {
      num: '06',
      title: 'Word Candidate Alignment',
      desc: 'Aligns word tokens across passes using sequence alignment and Levenshtein string distance clustering.',
      icon: <Sparkles className="w-5 h-5 text-amber-600" />,
    },
    {
      num: '07',
      title: 'Measure Disagreement & Stroke Stability',
      desc: 'Computes consensus vote ratio, token entropy, and sensitivity to image filters. Identifies where interpretations diverge.',
      icon: <ShieldCheck className="w-5 h-5 text-blue-700" />,
    },
    {
      num: '08',
      title: 'Assign Certainty Triad (Reliable / Uncertain / Illegible)',
      desc: 'Assigns Green for unanimous agreement, Amber for multiple plausible readings, and Red (abstention) for destroyed ink.',
      icon: <AlertTriangle className="w-5 h-5 text-amber-700" />,
    },
    {
      num: '09',
      title: 'Evidence-Constrained Post-Correction',
      desc: 'Constrains language model refinement strictly to visual stroke evidence. Explicitly prohibits inventing tokens from context.',
      icon: <CheckCircle className="w-5 h-5 text-emerald-700" />,
    },
    {
      num: '10',
      title: 'Human-in-the-Loop Review',
      desc: 'Clinicians or archivists inspect the exact handwriting stroke crop alongside candidate votes with one-click acceptance.',
      icon: <UserCheck className="w-5 h-5 text-indigo-700" />,
    },
    {
      num: '11',
      title: 'Clean Verified Document Export',
      desc: 'Exports clean editable TXT or JSON with bounding boxes, token stability scores, and audit-ready verification logs.',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-800" />,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase font-bold tracking-wider text-[#6B7280]">
          Research Architecture
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#111827]">
          How InkSure Operates
        </h1>
        <p className="text-base text-[#4B5563] max-w-2xl mx-auto">
          "Most OCR systems optimize for reading everything. InkSure optimizes for knowing what should NOT be guessed."
        </p>
      </div>

      {/* Difference Callout */}
      <div className="bg-white rounded-2xl border-2 border-emerald-200 p-6 shadow-xs space-y-3">
        <h3 className="text-lg font-bold text-[#111827]">
          What makes InkSure different?
        </h3>
        <p className="text-sm text-[#4B5563] leading-relaxed">
          Traditional OCR and Vision-Language models operate under a closed-world assumption: they must predict a word
          for every pixel cluster. In extreme bad handwriting, this results in dangerous hallucinations (e.g., misreading
          faded "morning" as "morphine", or transcribing struck-out medications).
        </p>
        <p className="text-sm text-[#4B5563] leading-relaxed">
          InkSure treats recognition as an hypothesis-testing process: by feeding varied optical views (contrast, edge, segment)
          to recognition passes and measuring token disagreement, InkSure measures confidence empirically. When visual evidence
          is insufficient, it <strong>abstains</strong>.
        </p>
      </div>

      {/* 11-Step Pipeline */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#111827] mb-6">
          The 11-Stage Evidence Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-xl border border-[#E5DFD3] p-5 shadow-xs flex items-start gap-4 hover:border-[#1E293B] transition-colors"
            >
              <div className="flex flex-col items-center">
                <span className="font-mono text-xs font-bold text-[#6B7280] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E8E2D5] mb-2">
                  {step.num}
                </span>
                <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#EFE9DD]">
                  {step.icon}
                </div>
              </div>

              <div className="flex-1">
                <h4 className="font-bold text-sm text-[#111827]">
                  {step.title}
                </h4>
                <p className="text-xs text-[#4B5563] mt-1 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Research Note on Correlation */}
      <div className="p-5 rounded-xl bg-[#FAF7F0] border border-[#E6DFD1] text-xs text-[#4B5563] space-y-2">
        <h4 className="font-bold text-[#111827] text-sm">
          Scientific Transparency & Correlation Note
        </h4>
        <p>
          Multiple passes through an identical neural network on varied optical inputs are correlated recognition passes,
          not mathematically independent readers. InkSure measures candidate stability across these optical transformations
          without claiming false Bayesian independence.
        </p>
      </div>
    </div>
  );
};

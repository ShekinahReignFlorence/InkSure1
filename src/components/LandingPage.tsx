import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle,
  FileSearch,
  Layers,
  Sparkles,
  ChevronRight,
  Eye,
  FileCheck,
  Strikethrough,
  Split,
  Workflow,
} from 'lucide-react';

interface LandingPageProps {
  onStartDemo: () => void;
  onExploreHowItWorks: () => void;
  onOpenNewScan: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartDemo,
  onExploreHowItWorks,
  onOpenNewScan,
}) => {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#141B2D]">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#EAE4D8] overflow-hidden">
        {/* Subtle paper grain background overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#111827_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-6xl mx-auto">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE7DA] border border-[#DDD5C5] text-xs font-medium text-[#4A5568] mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            HNX26EPS04 Extreme Bad-Handwriting Digitization System
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111827] leading-[1.12]">
                <span className="font-serif italic font-normal block text-[#4B5563] text-2xl sm:text-3xl mb-1">
                  Read the unread.
                </span>
                Turn difficult handwriting into verified text — without guessing.
              </h1>

              <p className="text-lg text-[#4B5563] leading-relaxed max-w-xl">
                Ordinary OCR forces a guess on every blurred stroke. InkSure generates multiple evidence-backed
                interpretations, maps uncertainty directly to the handwriting crop, and{' '}
                <strong className="text-[#111827] font-semibold">abstains when the evidence is insufficient.</strong>
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onOpenNewScan}
                  className="px-6 py-3.5 rounded-xl bg-[#1E293B] hover:bg-[#0F172A] text-white font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 text-base active:scale-98"
                >
                  <span>Try InkSure Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onStartDemo}
                  className="px-5 py-3.5 rounded-xl bg-[#EDE7DB] hover:bg-[#E3DC CE] text-[#1E293B] font-semibold border border-[#DCD3C1] transition-all flex items-center gap-2 text-base"
                >
                  <Eye className="w-4 h-4 text-[#4B5563]" />
                  <span>Inspect Preloaded Cases</span>
                </button>
              </div>

              {/* Trust Statement */}
              <div className="pt-4 border-t border-[#EAE4D8] flex items-start gap-3 text-xs text-[#52525B]">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Core Principle:</strong> InkSure does not just recognize handwriting. It measures whether
                  the recognition deserves to be trusted.
                </p>
              </div>
            </div>

            {/* Right Hero Interactive Diagram */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5DFD3] space-y-4">
                <div className="flex items-center justify-between border-b border-[#F0EBE0] pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                    Evidence Pipeline
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                    Active Verification
                  </span>
                </div>

                {/* Micro Stages */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#EFE9DD] flex items-center justify-between">
                    <span className="text-[#6B7280] font-medium">1. Difficult Handwriting</span>
                    <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#E5DFD3] text-[#1F2937]">
                      Blurry / Crossed-out / Cursive
                    </span>
                  </div>

                  <div className="flex justify-center text-[#9CA3AF]">
                    <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#EFE9DD] flex items-center justify-between">
                    <span className="text-[#6B7280] font-medium">2. Multiple Recognition Passes</span>
                    <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#E5DFD3] text-[#1F2937]">
                      Raw + Contrast + Edge
                    </span>
                  </div>

                  <div className="flex justify-center text-[#9CA3AF]">
                    <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#EFE9DD] flex items-center justify-between">
                    <span className="text-[#6B7280] font-medium">3. Uncertainty & Disagreement</span>
                    <span className="font-mono text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-amber-800 font-bold">
                      Flag [morning] vs [warning]
                    </span>
                  </div>

                  <div className="flex justify-center text-[#9CA3AF]">
                    <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                    <span className="text-emerald-900 font-semibold">4. Clean Editable Document</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                      0 Hallucinations
                    </span>
                  </div>
                </div>

                {/* Example Callout */}
                <div className="pt-2 text-xs border-t border-[#F0EBE0] text-[#4B5563]">
                  <p className="italic">
                    “Standard OCR guessed: <span className="text-rose-600 line-through">take morphine</span>.
                    InkSure flagged: <span className="text-amber-800 font-medium">[uncertain: morning]</span> and saved patient safety.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: WHY ORDINARY OCR BREAKS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EAE4D8] bg-[#F8F5EE]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">
              Why ordinary OCR breaks on difficult handwriting
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#4B5563]">
              Standard OCR engines are forced to output a word for every stroke, even when the image is blotted, struck-out, or ambiguous.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 */}
            <div className="bg-white rounded-xl p-5 border border-[#E5DFD3] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Cramped Script
                  </span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="h-14 bg-[#FAF7F0] rounded-md border border-[#EFE7DA] flex items-center justify-center font-serif italic text-lg text-[#1F2937] px-2 mb-3">
                  morn... / warn...
                </div>
                <div className="space-y-1.5 text-xs">
                  <p className="text-rose-600">
                    <strong>Standard OCR:</strong> Silently guesses "morning" with 94% fake confidence.
                  </p>
                  <p className="text-emerald-700">
                    <strong>InkSure:</strong> Flags conflict: 3/5 passes say "morning", 2/5 say "warning".
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl p-5 border border-[#E5DFD3] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Crossed-Out Text
                  </span>
                  <Strikethrough className="w-4 h-4 text-purple-600" />
                </div>
                <div className="h-14 bg-[#FAF7F0] rounded-md border border-[#EFE7DA] flex items-center justify-center font-serif italic text-lg text-[#1F2937] px-2 mb-3">
                  <span className="line-through decoration-rose-600 decoration-2">aspirin</span> paracetamol
                </div>
                <div className="space-y-1.5 text-xs">
                  <p className="text-rose-600">
                    <strong>Standard OCR:</strong> Transcribes both as active medication: "aspirin paracetamol".
                  </p>
                  <p className="text-emerald-700">
                    <strong>InkSure:</strong> Detects strikethrough, preserves as ~~aspirin~~ without merging.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl p-5 border border-[#E5DFD3] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Margin Notes
                  </span>
                  <Split className="w-4 h-4 text-blue-600" />
                </div>
                <div className="h-14 bg-[#FAF7F0] rounded-md border border-[#EFE7DA] flex items-center justify-center text-xs font-semibold text-[#854D0E] px-2 mb-3">
                  📌 [Margin: check renal]
                </div>
                <div className="space-y-1.5 text-xs">
                  <p className="text-rose-600">
                    <strong>Standard OCR:</strong> Merges randomly into the middle of the body sentence.
                  </p>
                  <p className="text-emerald-700">
                    <strong>InkSure:</strong> Spatially separates margin annotations into explicit regions.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-xl p-5 border border-[#E5DFD3] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Ink Blots / Tears
                  </span>
                  <XCircle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="h-14 bg-[#FAF7F0] rounded-md border border-[#EFE7DA] flex items-center justify-center text-xs font-bold text-rose-800 px-2 mb-3">
                  ● [Dark ink smear]
                </div>
                <div className="space-y-1.5 text-xs">
                  <p className="text-rose-600">
                    <strong>Standard OCR:</strong> Invents a word like "allergic" or "notary" from LLM priors.
                  </p>
                  <p className="text-emerald-700">
                    <strong>InkSure:</strong> Abstains cleanly: marks as [illegible] and preserves integrity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <span className="inline-block text-xs uppercase tracking-widest font-bold text-[#4B5563] bg-[#EAE3D5] px-4 py-1.5 rounded-full border border-[#D8CEBC]">
              Evidence beats guessing.
            </span>
          </div>
        </div>
      </section>

      {/* SECTION: THREE LEVELS OF CERTAINTY */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EAE4D8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-wider text-[#6B7280]">
              The Classification Triad
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mt-1">
              Three levels of certainty
            </h2>
            <p className="mt-2 text-sm text-[#4B5563]">
              Every word prediction is grounded in multi-pass stability before assignment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Green */}
            <div className="bg-white rounded-xl p-6 border-2 border-emerald-200 shadow-xs relative overflow-hidden">
              <div className="w-2.5 h-full bg-emerald-500 absolute left-0 top-0" />
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-lg text-emerald-950">Reliable</h3>
                  <span className="text-xs font-medium text-emerald-700">Green underline</span>
                </div>
              </div>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Multiple recognition passes across raw, contrast-enhanced, and sharpened image variants independently converge on this reading.
              </p>
              <div className="mt-5 p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900 font-mono">
                ✓ Agreement ≥ 80% & High stroke clarity
              </div>
            </div>

            {/* Amber */}
            <div className="bg-white rounded-xl p-6 border-2 border-amber-200 shadow-xs relative overflow-hidden">
              <div className="w-2.5 h-full bg-amber-500 absolute left-0 top-0" />
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                <div>
                  <h3 className="font-bold text-lg text-amber-950">Uncertain</h3>
                  <span className="text-xs font-medium text-amber-700">Amber badge & underline</span>
                </div>
              </div>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                More than one interpretation is plausible. InkSure refuses to pick one silently, displaying all candidate votes to the human reviewer.
              </p>
              <div className="mt-5 p-3 rounded-lg bg-amber-50/60 border border-amber-100 text-xs text-amber-900 font-mono">
                ! Candidate conflict: [morning / warning]
              </div>
            </div>

            {/* Red */}
            <div className="bg-white rounded-xl p-6 border-2 border-rose-200 shadow-xs relative overflow-hidden">
              <div className="w-2.5 h-full bg-rose-500 absolute left-0 top-0" />
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-6 h-6 text-rose-600" />
                <div>
                  <h3 className="font-bold text-lg text-rose-950">Illegible</h3>
                  <span className="text-xs font-medium text-rose-700">Red badge & abstention</span>
                </div>
              </div>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                There is not enough visual stroke evidence to safely reconstruct this token. InkSure outputs [illegible] rather than inventing text.
              </p>
              <div className="mt-5 p-3 rounded-lg bg-rose-50/60 border border-rose-100 text-xs text-rose-900 font-mono">
                ⊘ Insufficient visual evidence (Abstention)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: EVIDENCE SPOTLIGHT */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EAE4D8] bg-[#F7F4EC]">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-[#E0D9CB] shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-[#111827]">
              Evidence, not hallucination
            </h3>
          </div>
          <p className="text-sm text-[#4B5563] mb-6">
            When a word is flagged, the reviewer inspects the original image crop alongside candidate votes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Handwriting Crop */}
            <div className="md:col-span-5 bg-[#FAF7F0] p-4 rounded-xl border border-[#E5DFD3] text-center">
              <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block mb-2">
                Original Handwriting Crop
              </span>
              <div className="w-full h-24 bg-white rounded-lg border border-[#DDD5C5] flex items-center justify-center font-serif italic text-3xl text-[#1E293B] shadow-inner">
                morning
              </div>
              <span className="text-[11px] text-[#6B7280] mt-2 block">
                Ambiguous first loop: 'm' vs 'w'
              </span>
            </div>

            {/* Candidate Readings */}
            <div className="md:col-span-7 space-y-3">
              <span className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                Candidate Readings from Recognition Passes:
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-between font-mono">
                  <span className="font-bold text-[#111827]">1. "morning"</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    3 of 5 passes (Contrast & Segmented)
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-between font-mono">
                  <span className="font-bold text-[#111827]">2. "warning"</span>
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    1 of 5 passes (Sharpened)
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-between font-mono">
                  <span className="font-bold text-[#111827]">3. "moving"</span>
                  <span className="text-[#6B7280] bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                    1 of 5 passes (Raw Baseline)
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                <strong>Why flagged:</strong> Recognition passes disagree. Instead of silently selecting one, InkSure shows you the evidence and lets the clinician or reviewer decide.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-[#111827]">
            Ready to digitize difficult handwriting safely?
          </h2>
          <p className="text-[#4B5563] text-sm sm:text-base">
            Test the preloaded clinical prescription, historical deeds, and multilingual notes — or upload your own image.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onOpenNewScan}
              className="px-6 py-3 rounded-xl bg-[#1E293B] hover:bg-[#0F172A] text-white font-semibold shadow transition-all"
            >
              Start New Scan
            </button>
            <button
              onClick={onExploreHowItWorks}
              className="px-6 py-3 rounded-xl bg-[#EDE7DA] hover:bg-[#E3DCCF] text-[#1E293B] font-semibold border border-[#DCD3C1] transition-all"
            >
              Read Research Methodology
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

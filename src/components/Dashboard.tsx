import React from 'react';
import {
  PlusCircle,
  FileText,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';
import { DocumentItem } from '../types';

interface DashboardProps {
  documents: DocumentItem[];
  onOpenDocument: (doc: DocumentItem) => void;
  onNewScan: () => void;
  onOpenReviewQueue: () => void;
  onOpenEvaluation: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  documents,
  onOpenDocument,
  onNewScan,
  onOpenReviewQueue,
  onOpenEvaluation,
}) => {
  // Aggregate real statistics
  const totalDocs = documents.length;
  const totalWords = documents.reduce((acc, d) => acc + d.stats.totalWords, 0);
  const totalFlagged = documents.reduce(
    (acc, d) => acc + d.stats.uncertainCount + d.stats.illegibleCount,
    0
  );
  const pendingReviews = documents.reduce(
    (acc, d) => acc + d.words.filter((w) => (w.status === 'uncertain' || w.status === 'illegible') && !w.reviewed).length,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE4D8] pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#6B7280]">
            InkSure Document Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] mt-1">
            Good day. What would you like to digitize?
          </h1>
          <p className="text-sm text-[#4B5563] mt-1">
            Extreme bad-handwriting digitization with verifiable evidence mapping and zero hallucination.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNewScan}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-xl font-semibold shadow-sm transition-all hover:shadow text-sm active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ New Scan</span>
          </button>
        </div>
      </div>

      {/* Real Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Documents */}
        <div className="bg-white p-5 rounded-xl border border-[#E5DFD3] shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block">
            Documents Processed
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#111827]">{totalDocs}</span>
            <span className="text-xs text-[#6B7280]">verified scans</span>
          </div>
        </div>

        {/* Total Words */}
        <div className="bg-white p-5 rounded-xl border border-[#E5DFD3] shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block">
            Words Digitized
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-800">{totalWords}</span>
            <span className="text-xs text-emerald-600 font-medium">tokens aligned</span>
          </div>
        </div>

        {/* Words Flagged */}
        <div className="bg-white p-5 rounded-xl border border-[#E5DFD3] shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block">
            Words Flagged
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-700">{totalFlagged}</span>
            <span className="text-xs text-amber-600 font-medium">evidence check</span>
          </div>
        </div>

        {/* Review Required */}
        <div
          onClick={onOpenReviewQueue}
          className="bg-white p-5 rounded-xl border border-[#E5DFD3] shadow-xs cursor-pointer hover:border-amber-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              Review Required
            </span>
            <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-amber-700 transition-colors" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-700">{pendingReviews}</span>
            <span className="text-xs text-rose-600 font-medium">pending human check</span>
          </div>
        </div>
      </div>

      {/* Judge Demo Banner */}
      <div className="bg-[#FAF7F0] border border-[#E6DFD1] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-[#EFE9DC] text-[#1E293B]">
            <Sparkles className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111827]">
              Judge Evaluation Demo Flow (2-Minute Walkthrough)
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] mt-0.5">
              Inspect how InkSure contrasts against baseline OCR: flags dangerous hallucinations (e.g., "morphine" vs "morning"), isolates crossed-out text, and abstains on ink blots.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onOpenDocument(documents[0])}
            className="px-4 py-2 bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Open Clinical Rx Case</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenEvaluation}
            className="px-3.5 py-2 bg-white hover:bg-[#F3EFE6] text-[#1E293B] border border-[#D5CDBC] rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            View Benchmark
          </button>
        </div>
      </div>

      {/* Recent Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#111827]">
            Recent Documents
          </h2>
          <span className="text-xs text-[#6B7280]">
            Showing {documents.length} available scans
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5DFD3] p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-[#9CA3AF] mx-auto" />
            <h3 className="text-base font-bold text-[#111827]">No documents yet</h3>
            <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
              Upload your first difficult handwriting sample to see multi-pass recognition and uncertainty mapping.
            </p>
            <button
              onClick={onNewScan}
              className="mt-2 px-4 py-2 bg-[#1E293B] text-white rounded-lg text-xs font-semibold"
            >
              + Upload Handwriting
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {documents.map((doc) => {
              const pendingInDoc = doc.words.filter(
                (w) => (w.status === 'uncertain' || w.status === 'illegible') && !w.reviewed
              ).length;

              return (
                <div
                  key={doc.id}
                  onClick={() => onOpenDocument(doc)}
                  className="bg-white rounded-xl border border-[#E5DFD3] p-4 hover:border-[#1E293B] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-[#111827] text-sm group-hover:text-blue-900 transition-colors line-clamp-1">
                          {doc.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] text-[#6B7280] mt-0.5">
                          <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="font-medium text-[#4B5563]">{doc.script}</span>
                          {doc.isDemo && (
                            <span className="px-1.5 py-0.2 bg-amber-50 text-amber-800 rounded font-semibold text-[10px] border border-amber-200">
                              Demo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Image Preview Thumbnail */}
                    <div className="w-full h-32 rounded-lg bg-[#FAF8F5] border border-[#EAE4D8] overflow-hidden flex items-center justify-center p-2 relative">
                      <img
                        src={doc.thumbnailUrl || doc.imageUrl}
                        alt={doc.title}
                        className="max-h-full max-w-full object-contain filter group-hover:scale-102 transition-transform"
                      />
                      <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                        {doc.stats.uncertainCount > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                            {doc.stats.uncertainCount} uncertain
                          </span>
                        )}
                        {doc.stats.illegibleCount > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300">
                            {doc.stats.illegibleCount} illegible
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Excerpt */}
                    <p className="text-xs text-[#4B5563] font-serif italic line-clamp-2">
                      "{doc.inkSureText}"
                    </p>
                  </div>

                  {/* Footer status */}
                  <div className="pt-3 mt-3 border-t border-[#F2ECE1] flex items-center justify-between text-xs">
                    <span className="text-[#6B7280]">
                      {doc.stats.totalWords} words total
                    </span>
                    <span className="text-xs font-semibold text-[#1E293B] group-hover:underline flex items-center gap-1">
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

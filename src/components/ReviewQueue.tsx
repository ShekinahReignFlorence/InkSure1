import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Filter,
  Check,
  Edit3,
  Strikethrough,
  Split,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { DocumentItem, WordPrediction } from '../types';

interface ReviewQueueProps {
  documents: DocumentItem[];
  onUpdateWord: (docId: string, wordId: string, correction: string, status: 'reliable' | 'illegible') => void;
  onOpenDocument: (doc: DocumentItem) => void;
}

export const ReviewQueue: React.FC<ReviewQueueProps> = ({
  documents,
  onUpdateWord,
  onOpenDocument,
}) => {
  const [filter, setFilter] = useState<'pending_manual' | 'auto_interpreted' | 'uncertain' | 'illegible' | 'crossed_out' | 'margin_note' | 'hyphen' | 'all'>('pending_manual');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState<string>('');

  // Collect all items across documents
  const allItems: Array<{ doc: DocumentItem; word: WordPrediction }> = [];
  for (const doc of documents) {
    for (const word of doc.words) {
      allItems.push({ doc, word });
    }
  }

  // Items requiring manual review: ambiguous or uncertain
  const pendingManualItems = allItems.filter(
    (item) => (item.word.status === 'uncertain' || item.word.status === 'illegible') && !item.word.reviewed
  );

  const autoInterpretedItems = allItems.filter(
    (item) => item.word.status === 'reliable' || item.word.reviewed
  );

  // Filter items
  const filteredItems = allItems.filter((item) => {
    if (filter === 'pending_manual') {
      return (item.word.status === 'uncertain' || item.word.status === 'illegible') && !item.word.reviewed;
    }
    if (filter === 'auto_interpreted') {
      return item.word.status === 'reliable' || item.word.isAutoInterpreted;
    }
    if (filter === 'uncertain') return item.word.status === 'uncertain';
    if (filter === 'illegible') return item.word.status === 'illegible';
    if (filter === 'crossed_out') return item.word.isCrossedOut;
    if (filter === 'margin_note') return item.word.isMarginNote;
    if (filter === 'hyphen') return item.word.isHyphen || item.word.isHyphenated;
    return true;
  });

  const totalWordsCount = allItems.length;
  const autoVerifiedCount = autoInterpretedItems.length;
  const pendingReviewCount = pendingManualItems.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE4D8] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Automatic AI & OCR Interpretation Engine Active
          </div>
          <h1 className="text-2xl font-bold text-[#111827] mt-1">
            Verification Queue
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5563] mt-0.5">
            Interpretations are automatic via AI and OCR consensus. Manual verification is only required when strokes are ambiguous or uncertain.
          </p>
        </div>

        {/* Progress Pill */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-semibold text-[#111827]">
              {autoVerifiedCount} of {totalWordsCount} auto-verified ({pendingReviewCount} require triage)
            </span>
            <div className="w-36 bg-[#EAE4D8] rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full transition-all"
                style={{ width: `${totalWordsCount > 0 ? (autoVerifiedCount / totalWordsCount) * 100 : 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilter('pending_manual')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 flex items-center gap-1 ${
            filter === 'pending_manual'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white border border-[#E5DFD3] text-[#4B5563] hover:bg-[#FAF8F5]'
          }`}
        >
          <span>⚠ Needs Review (Ambiguous / Uncertain)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-bold">
            {pendingReviewCount}
          </span>
        </button>

        <button
          onClick={() => setFilter('auto_interpreted')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 flex items-center gap-1 ${
            filter === 'auto_interpreted'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white border border-[#E5DFD3] text-[#4B5563] hover:bg-[#FAF8F5]'
          }`}
        >
          <span>✓ Auto-Interpreted via AI & OCR</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
            {autoVerifiedCount}
          </span>
        </button>

        <button
          onClick={() => setFilter('crossed_out')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
            filter === 'crossed_out'
              ? 'bg-rose-700 text-white'
              : 'bg-white border border-[#E5DFD3] text-[#4B5563] hover:bg-[#FAF8F5]'
          }`}
        >
          ✂ Struck-Out ({allItems.filter((i) => i.word.isCrossedOut).length})
        </button>

        <button
          onClick={() => setFilter('margin_note')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
            filter === 'margin_note'
              ? 'bg-indigo-700 text-white'
              : 'bg-white border border-[#E5DFD3] text-[#4B5563] hover:bg-[#FAF8F5]'
          }`}
        >
          📌 Margin Notes ({allItems.filter((i) => i.word.isMarginNote).length})
        </button>

        <button
          onClick={() => setFilter('hyphen')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
            filter === 'hyphen'
              ? 'bg-teal-700 text-white'
              : 'bg-white border border-[#E5DFD3] text-[#4B5563] hover:bg-[#FAF8F5]'
          }`}
        >
          ‐ Hyphens ({allItems.filter((i) => i.word.isHyphen || i.word.isHyphenated).length})
        </button>

        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
            filter === 'all'
              ? 'bg-[#1E293B] text-white'
              : 'bg-white border border-[#E5DFD3] text-[#4B5563] hover:bg-[#FAF8F5]'
          }`}
        >
          All Tokens ({totalWordsCount})
        </button>
      </div>

      {/* Queue Items */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5DFD3] p-12 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="text-base font-bold text-[#111827]">Queue Clear</h3>
          <p className="text-xs text-[#6B7280]">
            No pending items match this filter. All evidence has been verified.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map(({ doc, word }) => {
            const isEditing = editingId === word.id;

            return (
              <div
                key={word.id}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-xs space-y-4 ${
                  word.reviewed ? 'border-emerald-200 bg-emerald-50/15' : 'border-[#E5DFD3]'
                }`}
              >
                {/* Item Top Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EBE0] pb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenDocument(doc)}
                      className="font-bold text-[#111827] hover:underline flex items-center gap-1"
                    >
                      <span>{doc.title}</span>
                      <ExternalLink className="w-3 h-3 text-[#6B7280]" />
                    </button>
                    <span className="text-[#9CA3AF]">•</span>
                    <span className="text-[#6B7280]">Word #{word.wordIndex + 1}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {word.status === 'uncertain' && (
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                        ! Multiple Readings Plausible
                      </span>
                    )}
                    {word.status === 'illegible' && (
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-semibold border border-rose-200">
                        ⊘ Insufficient Stroke Evidence
                      </span>
                    )}
                    {word.isCrossedOut && (
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-semibold border border-rose-200">
                        ✂ Struck Out
                      </span>
                    )}
                    {word.isMarginNote && (
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-semibold border border-indigo-200">
                        📌 Margin Note
                      </span>
                    )}
                    {(word.isHyphen || word.isHyphenated) && (
                      <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-semibold border border-teal-200">
                        ‐ Hyphen
                      </span>
                    )}
                    {word.humanCorrection ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300">
                        ✓ Verified by Human
                      </span>
                    ) : (word.status === 'reliable' || word.reviewed) ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                        ✓ Auto-Interpreted via AI & OCR
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Main Row: Crop on Left, Evidence & Candidates on Right */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  {/* Handwriting Crop */}
                  <div className="md:col-span-4 bg-[#FAF7F0] p-3 rounded-xl border border-[#E8E2D5] text-center">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1">
                      Handwriting Crop:
                    </span>
                    <div className="h-20 bg-white rounded-lg border border-[#DDD5C5] p-1 flex items-center justify-center overflow-hidden shadow-inner">
                      {word.cropUrl ? (
                        <img
                          src={word.cropUrl}
                          alt="Crop"
                          className="max-h-full max-w-full object-contain filter contrast-125"
                        />
                      ) : (
                        <span className="font-serif italic text-2xl text-[#1E293B]">
                          {word.originalAiText}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Candidates & Actions */}
                  <div className="md:col-span-8 space-y-3">
                    <div className="text-xs text-[#4B5563]">
                      <strong>Evidence Note:</strong> {word.reason}
                    </div>

                    {/* Candidate choices */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-[#6B7280] uppercase">
                        Placements:
                      </span>
                      {word.candidateReadings.map((c, idx) => (
                        <button
                          key={idx}
                          onClick={() => onUpdateWord(doc.id, word.id, c.text, 'reliable')}
                          className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EFE9DD] border border-[#DDD5C5] text-xs font-semibold text-[#111827] flex items-center gap-1.5 transition-colors"
                        >
                          <span>"{c.text}"</span>
                          <span className="text-[10px] text-[#6B7280]">({c.votes} passes)</span>
                        </button>
                      ))}

                      <button
                        onClick={() => onUpdateWord(doc.id, word.id, '[illegible]', 'illegible')}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-800 transition-colors"
                      >
                        Mark [illegible]
                      </button>
                    </div>

                    {/* Custom Edit Box */}
                    {isEditing ? (
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={editInput}
                          onChange={(e) => setEditInput(e.target.value)}
                          className="px-3 py-1.5 text-xs bg-white border border-[#DDD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E293B] flex-1"
                          placeholder="Type manual transcription..."
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            if (editInput.trim()) {
                              onUpdateWord(doc.id, word.id, editInput.trim(), 'reliable');
                              setEditingId(null);
                            }
                          }}
                          className="px-3 py-1.5 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1.5 text-xs text-[#6B7280]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(word.id);
                          setEditInput(word.humanCorrection || word.text);
                        }}
                        className="text-xs text-[#4B5563] hover:text-[#111827] font-semibold flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Manual override</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

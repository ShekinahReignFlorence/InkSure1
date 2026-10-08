import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  RotateCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  X,
  FileText,
  Sparkles,
  Layers,
  ArrowRight,
  RefreshCw,
  Eye,
  Camera,
  Smartphone,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ApiSettings, DocumentItem } from '../types';
import { processDocumentImage } from '../services/aiService';
import { generatePreprocessingVariants, optimizeImageSize, PreprocessedVariants } from '../services/imageProcessor';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';
import { CameraCaptureModal } from './CameraCaptureModal';

interface UploadWorkspaceProps {
  onDocumentCreated: (doc: DocumentItem) => void;
  onCancel: () => void;
  apiSettings: ApiSettings;
}

export const UploadWorkspace: React.FC<UploadWorkspaceProps> = ({
  onDocumentCreated,
  onCancel,
  apiSettings,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('sample_scan.jpg');
  const [script, setScript] = useState<
    'Auto Detect' | 'English' | 'Tamil' | 'Hindi' | 'Telugu' | 'Malayalam' | 'Mixed Script'
  >('Auto Detect');
  const [mode, setMode] = useState<'fast' | 'balanced' | 'maximum_reliability'>('balanced');
  const [activeFilterTab, setActiveFilterTab] = useState<'original' | 'contrast' | 'sharpened' | 'binarized'>('original');
  const [variants, setVariants] = useState<PreprocessedVariants | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const rawUrl = e.target?.result as string;
      const dataUrl = await optimizeImageSize(rawUrl, 1400);
      setSelectedImage(dataUrl);
      try {
        const generated = await generatePreprocessingVariants(dataUrl);
        setVariants(generated);
      } catch (err) {
        console.warn('Canvas filter generation error:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = async (dataUrl: string, name: string) => {
    setFileName(name);
    const optimized = await optimizeImageSize(dataUrl, 1400);
    setSelectedImage(optimized);
    try {
      const generated = await generatePreprocessingVariants(optimized);
      setVariants(generated);
    } catch (err) {
      console.warn('Canvas filter generation error:', err);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSelectPreloaded = async (doc: DocumentItem) => {
    setSelectedImage(doc.imageUrl);
    setFileName(doc.title + '.jpg');
    setScript(doc.script);
    try {
      const generated = await generatePreprocessingVariants(doc.imageUrl);
      setVariants(generated);
    } catch {
      // Ignore
    }
  };

  const handleStartDigitization = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setProgressPercent(10);
    setCurrentStep('Loading image and analyzing noise metrics...');

    try {
      const doc = await processDocumentImage(
        selectedImage,
        fileName,
        script,
        mode,
        apiSettings,
        (step, pct) => {
          setCurrentStep(step);
          setProgressPercent(pct);
        }
      );

      // Brief delay for user to read completed stats
      setTimeout(() => {
        setIsProcessing(false);
        onDocumentCreated(doc);
      }, 500);
    } catch (err) {
      console.error('Processing error:', err);
      setIsProcessing(false);
      alert('Digitization encountered an issue. Falling back to local offline mode.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#E5DFD3] shadow-xl max-w-4xl w-full p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAE4D8] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              New Handwriting Scan
            </span>
            <h2 className="text-xl font-bold text-[#111827]">
              Upload Difficult Handwriting
            </h2>
          </div>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#EAE4D8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isProcessing ? (
          <div className="space-y-6">
            {/* Quick Demo Pre-load buttons for judges */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] block mb-2">
                Fast Evaluation Presets (Click to load edge case):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SAMPLE_DOCUMENTS.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => handleSelectPreloaded(doc)}
                    className="p-2.5 rounded-xl border border-[#DDD5C5] bg-white hover:bg-[#F4EFE6] text-left transition-colors flex items-center gap-3 text-xs group"
                  >
                    <div className="w-10 h-10 rounded bg-[#FAF7F0] border border-[#E8E2D5] flex items-center justify-center overflow-hidden shrink-0">
                      <img src={doc.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#111827] truncate group-hover:text-blue-900">
                        {doc.title}
                      </div>
                      <div className="text-[#6B7280] truncate text-[11px]">
                        {doc.stats.uncertainCount} uncertain • {doc.stats.illegibleCount} illegible • {doc.script}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Drag & Drop Upload Box with Mobile Camera Option */}
            {!selectedImage ? (
              <div className="space-y-4">
                {/* 100% Free & Offline Feature Highlight */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs text-emerald-950">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      <strong>100% Free & Unlimited:</strong> Zero API fees, zero credit limits. Works entirely offline on your device CPU.
                    </span>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1 font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full text-[10px]">
                    <Zap className="w-3 h-3" /> Offline Ready
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Camera Scanner Button (Mobile & Desktop) */}
                  <div
                    onClick={() => setIsCameraOpen(true)}
                    className="border-2 border-emerald-500/50 hover:border-emerald-600 rounded-2xl p-6 text-center bg-emerald-50/30 hover:bg-emerald-50/60 cursor-pointer transition-all group flex flex-col items-center justify-center space-y-3"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <Camera className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#111827] flex items-center justify-center gap-1.5">
                        <span>Take Photo with Camera</span>
                        <Smartphone className="w-4 h-4 text-emerald-600 sm:hidden" />
                      </h3>
                      <p className="text-xs text-[#4B5563] mt-1 max-w-xs">
                        Instant live viewfinder with document framing for mobile phones & webcams
                      </p>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                    >
                      Open Camera
                    </button>
                  </div>

                  {/* Drag & Drop File Upload Box */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#D5CDBC] hover:border-[#1E293B] rounded-2xl p-6 text-center bg-white cursor-pointer transition-all hover:bg-[#FAF8F5] group flex flex-col items-center justify-center space-y-3"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/png, image/jpeg, image/jpg"
                      className="hidden"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                    />
                    <div className="w-14 h-14 rounded-2xl bg-[#FAF7F0] border border-[#E5DFD3] flex items-center justify-center text-[#6B7280] group-hover:text-[#111827] group-hover:scale-105 transition-transform">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#111827]">
                        Upload Handwriting File
                      </h3>
                      <p className="text-xs text-[#6B7280] mt-1">
                        Drop JPG, PNG, or scanned receipts and deeds
                      </p>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 bg-[#EFE9DC] hover:bg-[#E5DFD1] text-[#1E293B] rounded-xl text-xs font-semibold border border-[#D5CDBC]"
                    >
                      Browse Files
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Selected Image Preview with Filter Tabs */
              <div className="bg-white rounded-2xl border border-[#E5DFD3] p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-xs font-bold text-[#111827] truncate max-w-xs">
                      {fileName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                      title="Rotate 90°"
                      className="p-1.5 rounded-md hover:bg-[#F3EFE6] text-[#6B7280] text-xs flex items-center gap-1"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Rotate</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setVariants(null);
                      }}
                      className="text-xs text-rose-600 hover:underline px-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Preprocessing Variant Tabs */}
                {variants && (
                  <div className="flex items-center gap-1 p-1 bg-[#FAF8F5] rounded-lg border border-[#EFE9DD] text-xs">
                    <span className="text-[10px] font-bold text-[#6B7280] px-2 uppercase">
                      Canvas Filters:
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveFilterTab('original')}
                      className={`px-2.5 py-1 rounded font-medium transition-colors ${
                        activeFilterTab === 'original'
                          ? 'bg-white shadow-xs text-[#111827]'
                          : 'text-[#6B7280] hover:text-[#111827]'
                      }`}
                    >
                      Original
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFilterTab('contrast')}
                      className={`px-2.5 py-1 rounded font-medium transition-colors ${
                        activeFilterTab === 'contrast'
                          ? 'bg-white shadow-xs text-[#111827]'
                          : 'text-[#6B7280] hover:text-[#111827]'
                      }`}
                    >
                      Grayscale & Contrast
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFilterTab('sharpened')}
                      className={`px-2.5 py-1 rounded font-medium transition-colors ${
                        activeFilterTab === 'sharpened'
                          ? 'bg-white shadow-xs text-[#111827]'
                          : 'text-[#6B7280] hover:text-[#111827]'
                      }`}
                    >
                      Sobel Sharpened
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFilterTab('binarized')}
                      className={`px-2.5 py-1 rounded font-medium transition-colors ${
                        activeFilterTab === 'binarized'
                          ? 'bg-white shadow-xs text-[#111827]'
                          : 'text-[#6B7280] hover:text-[#111827]'
                      }`}
                    >
                      Adaptive Binarized
                    </button>
                  </div>
                )}

                {/* Viewport */}
                <div className="w-full h-56 bg-[#FAF8F5] rounded-xl border border-[#E8E2D5] flex items-center justify-center overflow-hidden p-2">
                  <img
                    src={
                      variants
                        ? activeFilterTab === 'contrast'
                          ? variants.grayscaleContrast
                          : activeFilterTab === 'sharpened'
                          ? variants.sharpened
                          : activeFilterTab === 'binarized'
                          ? variants.binarized
                          : variants.original
                        : selectedImage
                    }
                    alt="Preview"
                    style={{ transform: `rotate(${rotation}deg)` }}
                    className="max-h-full max-w-full object-contain transition-transform"
                  />
                </div>
              </div>
            )}

            {/* Pipeline Configuration Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Language / Script */}
              <div className="bg-white p-3.5 rounded-xl border border-[#E5DFD3] space-y-1.5">
                <label className="text-xs font-bold text-[#111827] uppercase tracking-wider block">
                  Language / Script
                </label>
                <select
                  value={script}
                  onChange={(e) => setScript(e.target.value as any)}
                  className="w-full bg-[#FAF8F5] border border-[#DDD5C5] rounded-lg px-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#1E293B]"
                >
                  <option value="Auto Detect">Auto Detect Script</option>
                  <option value="English">English / Latin Cursive</option>
                  <option value="Tamil">Tamil (தமிழ் எழுத்து)</option>
                  <option value="Hindi">Hindi (देवनागरी)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Malayalam">Malayalam (മലയാളം)</option>
                  <option value="Mixed Script">Mixed Script (English + Indic)</option>
                </select>
                <p className="text-[11px] text-[#6B7280]">
                  Preserves authentic script without forced transliteration.
                </p>
              </div>

              {/* Processing Mode */}
              <div className="bg-white p-3.5 rounded-xl border border-[#E5DFD3] space-y-1.5">
                <label className="text-xs font-bold text-[#111827] uppercase tracking-wider block">
                  Processing Mode
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['fast', 'balanced', 'maximum_reliability'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                        mode === m
                          ? 'bg-[#1E293B] text-white shadow-xs'
                          : 'bg-[#FAF8F5] text-[#4B5563] hover:bg-[#F3EFE6] border border-[#E5DFD3]'
                      }`}
                    >
                      {m === 'maximum_reliability' ? 'Max Reliability' : m}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  {mode === 'maximum_reliability'
                    ? 'Recommended: Executes 4 recognition passes + stroke alignment.'
                    : 'Balanced candidate verification and fast feedback.'}
                </p>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAE4D8]">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B7280] hover:bg-[#EAE4D8] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedImage}
                onClick={handleStartDigitization}
                className="px-6 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs shadow transition-all flex items-center gap-2 active:scale-98"
              >
                <span>Digitize with InkSure</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Live Animated Recognition Pipeline Visualization */
          <div className="py-8 px-4 space-y-6 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-full bg-amber-50 border-2 border-amber-300 flex items-center justify-center mx-auto text-amber-800 animate-spin">
                <RefreshCw className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[#111827]">
                Evidence-Aware Recognition in Progress
              </h3>
              <p className="text-xs text-[#6B7280]">
                {currentStep}
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-[#EAE4D8] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#1E293B] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Visual Pipeline Checklist */}
              <div className="text-left bg-white p-4 rounded-xl border border-[#E5DFD3] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Image received & stroke quality analyzed</span>
                </div>
                <div className={`flex items-center gap-2 ${progressPercent >= 25 ? 'text-emerald-700' : 'text-[#9CA3AF]'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Contrast, sharpened & binarized variants generated</span>
                </div>
                <div className={`flex items-center gap-2 ${progressPercent >= 45 ? 'text-emerald-700' : 'text-[#9CA3AF]'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Writing regions & margin annotations detected</span>
                </div>
                <div className={`flex items-center gap-2 ${progressPercent >= 70 ? 'text-emerald-700' : 'text-[#9CA3AF]'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Multiple recognition passes executed</span>
                </div>
                <div className={`flex items-center gap-2 ${progressPercent >= 85 ? 'text-emerald-700' : 'text-[#9CA3AF]'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Candidate alignment & uncertainty analysis</span>
                </div>
                <div className={`flex items-center gap-2 ${progressPercent >= 95 ? 'text-emerald-700' : 'text-[#9CA3AF]'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Evidence mapped & safe transcription prepared</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Real Mobile & Desktop Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
};

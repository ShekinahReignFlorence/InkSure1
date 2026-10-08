import React, { useState } from 'react';
import {
  X,
  Settings,
  ShieldCheck,
  Zap,
  Sparkles,
  Key,
  Sliders,
  Check,
  Info,
} from 'lucide-react';
import { ApiSettings } from '../types';

interface SettingsModalProps {
  settings: ApiSettings;
  onSave: (settings: ApiSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSave,
  onClose,
}) => {
  const [current, setCurrent] = useState<ApiSettings>(settings);
  const [savedBadge, setSavedBadge] = useState(false);

  const handleSave = () => {
    onSave(current);
    setSavedBadge(true);
    setTimeout(() => {
      setSavedBadge(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#E5DFD3] shadow-xl max-w-xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAE4D8] pb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#111827]" />
            <h2 className="text-lg font-bold text-[#111827]">
              AI Provider & Engine Configuration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#EAE4D8]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Provider Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] block">
            Recognition Provider
          </label>

          <div className="grid grid-cols-1 gap-2.5">
            {/* Free Unlimited Mode */}
            <div
              onClick={() => setCurrent({ ...current, provider: 'free_engine' })}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                current.provider === 'free_engine'
                  ? 'border-[#1E293B] bg-white ring-1 ring-[#1E293B]'
                  : 'border-[#E5DFD3] bg-[#FAF8F5] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="font-bold text-sm text-[#111827]">
                    Free Unlimited Mode (Zero-Credit Engine)
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-[#6B7280] mt-1 pl-4.5">
                100% free and offline-resilient. Multi-pass canvas filters, stroke metrics, and candidate alignment without external API quotas or limits.
              </p>
            </div>

            {/* Groq API */}
            <div
              onClick={() => setCurrent({ ...current, provider: 'groq' })}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                current.provider === 'groq'
                  ? 'border-[#1E293B] bg-white ring-1 ring-[#1E293B]'
                  : 'border-[#E5DFD3] bg-[#FAF8F5] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-sm text-[#111827]">
                    Groq Cloud API (Free Tier Keys)
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#4B5563] bg-[#EFE9DD] px-2 py-0.5 rounded">
                  Ultra-Fast
                </span>
              </div>
              <p className="text-xs text-[#6B7280] mt-1 pl-6">
                Connect your free Groq API key for Llama 3.2 Vision / Llama 3.3.
              </p>
            </div>

            {/* Paddle-VL 1.6 */}
            <div
              onClick={() => setCurrent({ ...current, provider: 'paddle_vl' })}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                current.provider === 'paddle_vl'
                  ? 'border-[#1E293B] bg-white ring-1 ring-[#1E293B]'
                  : 'border-[#E5DFD3] bg-[#FAF8F5] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-sm text-[#111827]">
                    Paddle-VL 1.6 / PaddleOCR
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  OCR Specialist
                </span>
              </div>
              <p className="text-xs text-[#6B7280] mt-1 pl-6">
                Specialized neural handwriting model for Indic and Latin scripts.
              </p>
            </div>
          </div>
        </div>

        {/* API Key inputs if Groq or Paddle selected */}
        {current.provider === 'groq' && (
          <div className="bg-white p-4 rounded-xl border border-[#E5DFD3] space-y-2">
            <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-700" />
              <span>Groq API Key (gsk_...)</span>
            </label>
            <input
              type="password"
              value={current.groqApiKey}
              onChange={(e) => setCurrent({ ...current, groqApiKey: e.target.value })}
              placeholder="gsk_..."
              className="w-full text-xs p-2 bg-[#FAF8F5] border border-[#DDD5C5] rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#1E293B]"
            />
            <p className="text-[11px] text-[#6B7280]">
              Keys are stored strictly in your browser localStorage.
            </p>
          </div>
        )}

        {/* Uncertainty Threshold Sliders */}
        <div className="bg-white p-4 rounded-xl border border-[#E5DFD3] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#111827] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#6B7280]" />
              <span>Uncertainty Thresholds</span>
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#4B5563]">Agreement Threshold (for Reliable flag):</span>
                <span className="font-mono font-bold text-[#111827]">
                  {Math.round(current.uncertaintyThreshold * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={current.uncertaintyThreshold}
                onChange={(e) =>
                  setCurrent({ ...current, uncertaintyThreshold: parseFloat(e.target.value) })
                }
                className="w-full accent-[#1E293B]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#4B5563]">Abstention Threshold (mark as [illegible]):</span>
                <span className="font-mono font-bold text-[#111827]">
                  {Math.round(current.abstentionThreshold * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="0.6"
                step="0.05"
                value={current.abstentionThreshold}
                onChange={(e) =>
                  setCurrent({ ...current, abstentionThreshold: parseFloat(e.target.value) })
                }
                className="w-full accent-[#1E293B]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAE4D8]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#6B7280] hover:bg-[#EAE4D8] rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{savedBadge ? 'Saved!' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

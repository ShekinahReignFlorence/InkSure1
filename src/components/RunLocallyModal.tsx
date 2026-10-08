import React, { useState } from 'react';
import {
  X,
  Terminal,
  Laptop,
  Smartphone,
  CheckCircle2,
  Copy,
  Check,
  Cloud,
  ShieldCheck,
  WifiOff,
  Zap,
  Globe,
  Camera,
  Cpu,
} from 'lucide-react';

interface RunLocallyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RunLocallyModal: React.FC<RunLocallyModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: '1. Clone & Install Dependencies',
      desc: 'Zero external native dependencies required. Pure TypeScript & Node.js.',
      code: 'git clone <your-repo-url>\ncd inksure\nnpm install',
    },
    {
      title: '2. Launch Zero-Cost Local Server',
      desc: 'Starts the Vite & Express engine on port 3000.',
      code: 'npm run dev',
    },
    {
      title: '3. Mobile Scanner on Local Wi-Fi (No Internet Needed)',
      desc: 'Expose to your local network so phones on the same Wi-Fi can scan documents via camera.',
      code: 'npm run dev -- --host\n# Open on your phone browser: http://<your-computer-ip>:3000',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#E5DFD3] shadow-2xl max-w-3xl w-full p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto animate-in fade-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAE4D8] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center text-white">
              <Laptop className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#111827]">
                  Run Locally & Free Deployment Guide
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  100% Free Forever
                </span>
              </div>
              <p className="text-xs text-[#6B7280]">
                Zero API fees • Runs fully offline • Mobile camera enabled
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#EAE4D8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Architectural Guarantees */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-[#E5DFD3] space-y-1">
            <Zap className="w-4 h-4 text-emerald-600" />
            <div className="font-bold text-[#111827]">$0 Financial Cost</div>
            <p className="text-[10px] text-[#6B7280]">Zero paid Gemini API or cloud subscriptions required.</p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#E5DFD3] space-y-1">
            <WifiOff className="w-4 h-4 text-blue-600" />
            <div className="font-bold text-[#111827]">100% Offline Ready</div>
            <p className="text-[10px] text-[#6B7280]">Runs on-device via WebAssembly & Canvas OCR when disconnected.</p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#E5DFD3] space-y-1">
            <Smartphone className="w-4 h-4 text-purple-600" />
            <div className="font-bold text-[#111827]">Mobile Camera</div>
            <p className="text-[10px] text-[#6B7280]">Live camera viewfinder with document grid alignment.</p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#E5DFD3] space-y-1">
            <Cpu className="w-4 h-4 text-amber-600" />
            <div className="font-bold text-[#111827]">Low-Spec Optimized</div>
            <p className="text-[10px] text-[#6B7280]">Images scaled to 1400px for 10x speed & minimal RAM usage.</p>
          </div>
        </div>

        {/* Step-by-Step Local Run */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-[#111827] flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#1E293B]" />
            <span>How to Run Locally on Your Machine:</span>
          </h3>

          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-[#E5DFD3] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#111827]">{step.title}</span>
                  <button
                    onClick={() => handleCopy(step.code, idx)}
                    className="flex items-center gap-1 px-2 py-1 bg-[#FAF8F5] hover:bg-[#F0EBE0] text-[#4B5563] rounded text-[11px] font-semibold border border-[#DDD5C5] transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-[#6B7280]">{step.desc}</p>
                <pre className="bg-[#1E293B] text-emerald-400 p-2.5 rounded-lg text-xs font-mono overflow-x-auto">
                  {step.code}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Free Deployment Guide */}
        <div className="space-y-3 bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E2D5]">
          <h3 className="font-bold text-sm text-[#111827] flex items-center gap-2">
            <Cloud className="w-4 h-4 text-blue-600" />
            <span>How to Deploy for Free (Step-by-Step):</span>
          </h3>

          <div className="space-y-2 text-xs text-[#374151]">
            <div className="flex items-start gap-2">
              <span className="font-bold text-emerald-700">Step 1:</span>
              <span><strong>Push to GitHub:</strong> Commit your codebase and push to a free GitHub repository.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-emerald-700">Step 2:</span>
              <span><strong>Connect to Vercel / Netlify:</strong> Sign in with GitHub on <code className="bg-white px-1 py-0.5 rounded border">vercel.com</code> or <code className="bg-white px-1 py-0.5 rounded border">netlify.com</code> (100% Free Tier).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-emerald-700">Step 3:</span>
              <span><strong>Configure Build:</strong> Build command: <code className="bg-white px-1 py-0.5 rounded border font-mono">npm run build</code>, Output directory: <code className="bg-white px-1 py-0.5 rounded border font-mono">dist</code>.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-emerald-700">Step 4:</span>
              <span><strong>Instant Free URL:</strong> You receive a permanent HTTPS URL with PWA offline caching enabled so anyone can use it from mobile or desktop at zero cost!</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#EAE4D8]">
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Zero paid API dependencies. Ready for local and production deployment.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            Got it, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

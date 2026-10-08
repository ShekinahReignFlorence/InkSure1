import React, { useState, useEffect } from 'react';
import {
  FileText,
  PlusCircle,
  CheckCircle2,
  BarChart3,
  HelpCircle,
  Settings,
  FolderOpen,
  Sparkles,
  Zap,
  Camera,
  WifiOff,
  Terminal,
} from 'lucide-react';
import { ApiSettings } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNewScan: () => void;
  onOpenSettings: () => void;
  onOpenRunLocally: () => void;
  pendingReviewCount: number;
  apiSettings: ApiSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onNewScan,
  onOpenSettings,
  onOpenRunLocally,
  pendingReviewCount,
  apiSettings,
}) => {
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? !navigator.onLine : false;
  });

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getProviderBadge = () => {
    if (isOffline) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
          <WifiOff className="w-3.5 h-3.5 text-amber-700" />
          <span>Offline Active (Local CPU)</span>
        </span>
      );
    }
    if (apiSettings.provider === 'groq') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Zap className="w-3 h-3 text-emerald-600" />
          Groq API
        </span>
      );
    }
    if (apiSettings.provider === 'paddle_vl') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <Sparkles className="w-3 h-3 text-blue-600" />
          Paddle-VL
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Free Local Engine (Zero Cost)
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FCFBFA]/95 backdrop-blur-md border-b border-[#E8E4DC] px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-[#111827] flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-serif italic text-xl">I</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-[#111827] tracking-tight">InkSure</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#EDE8DF] text-[#4B5563]">
                  v1.6
                </span>
              </div>
              <p className="text-[11px] text-[#6B7280] font-normal leading-tight">
                Read the unread.
              </p>
            </div>
          </button>

          {/* Primary Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-[#EAE4D9] text-[#111827]'
                  : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3EFE6]'
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'documents' || activeTab === 'workspace'
                  ? 'bg-[#EAE4D9] text-[#111827]'
                  : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3EFE6]'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              Documents
            </button>

            <button
              onClick={() => setActiveTab('review')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'review'
                  ? 'bg-[#EAE4D9] text-[#111827]'
                  : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3EFE6]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Review Queue
              {pendingReviewCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  {pendingReviewCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('evaluation')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'evaluation'
                  ? 'bg-[#EAE4D9] text-[#111827]'
                  : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3EFE6]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Evaluation
            </button>

            <button
              onClick={() => setActiveTab('how-it-works')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'how-it-works'
                  ? 'bg-[#EAE4D9] text-[#111827]'
                  : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3EFE6]'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              How It Works
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenRunLocally}
            title="How to Run Locally & Free Deployment Guide"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#374151] rounded-lg text-xs font-semibold border border-[#DDD5C5] transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-700" />
            <span>Run Locally / Deploy</span>
          </button>

          <div className="hidden sm:block cursor-pointer" onClick={onOpenSettings}>
            {getProviderBadge()}
          </div>

          <button
            onClick={onOpenSettings}
            title="Configure API Provider"
            className="p-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#EAE4D9] transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onNewScan}
            title="Scan with Camera"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-all active:scale-98"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera</span>
          </button>

          <button
            onClick={onNewScan}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-lg text-sm font-semibold shadow-sm transition-all hover:shadow active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Scan</span>
          </button>
        </div>
      </div>
    </header>
  );
};

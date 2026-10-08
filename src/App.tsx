import React, { useState, useEffect } from 'react';
import { ApiSettings, DocumentItem, WordPrediction } from './types';
import { SAMPLE_DOCUMENTS } from './data/sampleDocuments';
import { loadSavedSettings, saveSettings } from './services/aiService';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { DocumentWorkspace } from './components/DocumentWorkspace';
import { ReviewQueue } from './components/ReviewQueue';
import { EvaluationView } from './components/EvaluationView';
import { HowItWorksView } from './components/HowItWorksView';
import { UploadWorkspace } from './components/UploadWorkspace';
import { SettingsModal } from './components/SettingsModal';
import { RunLocallyModal } from './components/RunLocallyModal';
import { FolderOpen, PlusCircle, ArrowRight, ShieldCheck, Heart, Terminal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem('inksure_documents');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore
    }
    return SAMPLE_DOCUMENTS;
  });

  const [currentDocument, setCurrentDocument] = useState<DocumentItem | null>(() => SAMPLE_DOCUMENTS[0]);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isRunLocallyOpen, setIsRunLocallyOpen] = useState<boolean>(false);
  const [apiSettings, setApiSettings] = useState<ApiSettings>(loadSavedSettings);

  // Sync documents to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('inksure_documents', JSON.stringify(documents));
    } catch {
      // Ignore storage errors
    }
  }, [documents]);

  const handleOpenDocument = (doc: DocumentItem) => {
    setCurrentDocument(doc);
    setActiveTab('workspace');
  };

  const handleUpdateDocument = (updatedDoc: DocumentItem) => {
    setDocuments((prev) => prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)));
    setCurrentDocument(updatedDoc);
  };

  const handleUpdateWordFromQueue = (
    docId: string,
    wordId: string,
    correction: string,
    status: 'reliable' | 'illegible'
  ) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== docId) return doc;
        const updatedWords = doc.words.map((w) => {
          if (w.id === wordId) {
            return {
              ...w,
              humanCorrection: correction,
              text: correction,
              status,
              reviewed: true,
            };
          }
          return w;
        });
        return {
          ...doc,
          words: updatedWords,
          isReviewed: true,
        };
      })
    );

    if (currentDocument && currentDocument.id === docId) {
      const updatedWords = currentDocument.words.map((w) => {
        if (w.id === wordId) {
          return {
            ...w,
            humanCorrection: correction,
            text: correction,
            status,
            reviewed: true,
          };
        }
        return w;
      });
      setCurrentDocument({ ...currentDocument, words: updatedWords, isReviewed: true });
    }
  };

  const handleDocumentCreated = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setCurrentDocument(newDoc);
    setIsUploadOpen(false);
    setActiveTab('workspace');
  };

  const handleSaveSettings = (newSettings: ApiSettings) => {
    setApiSettings(newSettings);
    saveSettings(newSettings);
  };

  // Calculate pending reviews count
  const pendingReviewCount = documents.reduce(
    (acc, d) => acc + d.words.filter((w) => (w.status === 'uncertain' || w.status === 'illegible') && !w.reviewed).length,
    0
  );

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#141B2D] flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewScan={() => setIsUploadOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenRunLocally={() => setIsRunLocallyOpen(true)}
        pendingReviewCount={pendingReviewCount}
        apiSettings={apiSettings}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            onStartDemo={() => {
              setCurrentDocument(documents[0]);
              setActiveTab('workspace');
            }}
            onExploreHowItWorks={() => setActiveTab('how-it-works')}
            onOpenNewScan={() => setIsUploadOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            documents={documents}
            onOpenDocument={handleOpenDocument}
            onNewScan={() => setIsUploadOpen(true)}
            onOpenReviewQueue={() => setActiveTab('review')}
            onOpenEvaluation={() => setActiveTab('evaluation')}
          />
        )}

        {activeTab === 'documents' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#EAE4D8] pb-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#6B7280]">
                  Document Archive
                </span>
                <h1 className="text-2xl font-bold text-[#111827]">
                  All Digitized Documents
                </h1>
              </div>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-4 py-2 bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Scan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleOpenDocument(doc)}
                  className="bg-white rounded-xl border border-[#E5DFD3] p-4 hover:border-[#1E293B] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm text-[#111827] line-clamp-1">
                        {doc.title}
                      </h3>
                      {doc.isDemo && (
                        <span className="text-[10px] bg-amber-50 text-amber-800 font-semibold px-1.5 py-0.5 rounded border border-amber-200">
                          Demo
                        </span>
                      )}
                    </div>

                    <div className="w-full h-32 rounded-lg bg-[#FAF8F5] border border-[#EAE4D8] overflow-hidden flex items-center justify-center p-2">
                      <img
                        src={doc.thumbnailUrl || doc.imageUrl}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="text-xs text-[#4B5563] font-serif italic line-clamp-2">
                      "{doc.inkSureText}"
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#F2ECE1] flex items-center justify-between text-xs">
                    <span className="text-[#6B7280]">{doc.stats.totalWords} words</span>
                    <span className="font-semibold text-[#1E293B] flex items-center gap-1">
                      <span>Review</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'workspace' && currentDocument && (
          <DocumentWorkspace
            document={currentDocument}
            onUpdateDocument={handleUpdateDocument}
            onClose={() => setActiveTab('dashboard')}
            onOpenReviewQueue={() => setActiveTab('review')}
          />
        )}

        {activeTab === 'review' && (
          <ReviewQueue
            documents={documents}
            onUpdateWord={handleUpdateWordFromQueue}
            onOpenDocument={handleOpenDocument}
          />
        )}

        {activeTab === 'evaluation' && <EvaluationView />}

        {activeTab === 'how-it-works' && <HowItWorksView />}
      </main>

      {/* New Scan Upload Modal */}
      {isUploadOpen && (
        <UploadWorkspace
          onDocumentCreated={handleDocumentCreated}
          onCancel={() => setIsUploadOpen(false)}
          apiSettings={apiSettings}
        />
      )}

      {/* API Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={apiSettings}
          onSave={handleSaveSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Run Locally & Free Deployment Modal */}
      <RunLocallyModal
        isOpen={isRunLocallyOpen}
        onClose={() => setIsRunLocallyOpen(false)}
      />

      {/* Modern Minimal Footer */}
      <footer className="border-t border-[#EAE4D8] bg-[#F7F4EC] py-6 px-4 text-xs text-[#6B7280]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#111827]">InkSure</span>
            <span>—</span>
            <span>Evidence-aware extreme bad-handwriting digitization</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsRunLocallyOpen(true)}
              className="text-emerald-800 hover:text-emerald-950 font-semibold underline underline-offset-2 flex items-center gap-1"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Run Locally & Free Deploy Guide</span>
            </button>
            <span>•</span>
            <span className="text-emerald-800 font-medium">Free Unlimited Mode Active</span>
            <span>•</span>
            <span>“Read the unread.”</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  X,
  RotateCw,
  Zap,
  ZapOff,
  Check,
  RefreshCw,
  AlertCircle,
  Upload,
  Sparkles,
} from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string, fileName: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileFallbackRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isFlashActive, setIsFlashActive] = useState<boolean>(false);

  // Stop camera media tracks cleanly
  const stopTracks = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    }
  }, [stream]);

  // Start device camera
  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    setIsInitializing(true);
    setCameraError(null);
    stopTracks();

    try {
      // First try high resolution with exact or ideal facing mode
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => {});
      }

      // Check if torch/flashlight is supported on the active video track
      const track = mediaStream.getVideoTracks()[0];
      if (track) {
        const capabilities = (track.getCapabilities ? track.getCapabilities() : {}) as any;
        if (capabilities && 'torch' in capabilities) {
          setHasTorch(true);
        } else {
          setHasTorch(false);
        }
      }
    } catch (err: any) {
      console.warn('Camera access warning:', err);
      // Fallback: try basic video constraint without resolution hints
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setStream(fallbackStream);
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (fallbackErr: any) {
        setCameraError(
          fallbackErr.name === 'NotAllowedError'
            ? 'Camera access was denied. Please allow camera permissions in your browser or use file upload.'
            : 'No accessible camera was found on this device. You can upload an image from your files instead.'
        );
      }
    } finally {
      setIsInitializing(false);
    }
  }, [stopTracks]);

  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      startCamera(facingMode);
    } else {
      stopTracks();
    }
    return () => {
      stopTracks();
    };
  }, [isOpen, facingMode, startCamera, stopTracks]);

  // Toggle flash/torch on supported mobile devices
  const toggleTorch = async () => {
    if (!stream || !hasTorch) return;
    try {
      const track = stream.getVideoTracks()[0];
      const nextTorch = !torchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: nextTorch }],
      });
      setTorchOn(nextTorch);
    } catch (err) {
      console.warn('Torch toggle failed:', err);
    }
  };

  // Flip rear / front camera
  const handleFlipCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  // Capture still photo from video stream
  const handleShutter = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    // Trigger visual flash animation
    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 200);

    const canvas = canvasRef.current || document.createElement('canvas');
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If using user-facing camera, flip horizontally for natural mirror feel
    if (facingMode === 'user') {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(dataUrl);
    stopTracks();
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  // Confirm photo and send to InkSure
  const handleConfirm = () => {
    if (!capturedImage) return;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    onCapture(capturedImage, `handwriting_cam_${timestamp}.jpg`);
    onClose();
  };

  // Handle fallback file selection from device photo gallery / camera roll
  const handleFileFallback = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#111827] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl flex flex-col max-h-[95vh]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900/90 border-b border-gray-800 text-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-bold tracking-wide">
              {capturedImage ? 'Review Handwriting Photo' : 'Handwriting Scanner Camera'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Flash / Torch Toggle */}
            {hasTorch && !capturedImage && (
              <button
                type="button"
                onClick={toggleTorch}
                title={torchOn ? 'Turn Flash Off' : 'Turn Flash On'}
                className={`p-2 rounded-full transition-colors ${
                  torchOn ? 'bg-amber-400 text-gray-950 font-bold' : 'bg-gray-800 text-gray-300 hover:text-white'
                }`}
              >
                {torchOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
              </button>
            )}

            {/* Flip camera */}
            {!capturedImage && !cameraError && (
              <button
                type="button"
                onClick={handleFlipCamera}
                title="Flip Camera (Front/Rear)"
                className="p-2 rounded-full bg-gray-800 text-gray-300 hover:text-white transition-colors"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            )}

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewfinder / Preview Area */}
        <div className="relative flex-1 min-h-[360px] sm:min-h-[460px] bg-black flex items-center justify-center overflow-hidden">
          {/* Flash animation */}
          {isFlashActive && (
            <div className="absolute inset-0 bg-white z-30 opacity-90 animate-out fade-out duration-200 pointer-events-none" />
          )}

          {capturedImage ? (
            /* Snapshot Review View */
            <div className="relative w-full h-full flex items-center justify-center p-3">
              <img
                src={capturedImage}
                alt="Captured Handwriting"
                className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-lg border border-gray-700"
              />
              <div className="absolute top-5 left-5 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs text-emerald-400 font-medium border border-emerald-500/30 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Document captured in high resolution</span>
              </div>
            </div>
          ) : cameraError ? (
            /* Error & File Upload Fallback */
            <div className="p-6 text-center max-w-md text-gray-300 space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white">Camera Access Needed</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{cameraError}</p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => fileFallbackRef.current?.click()}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md flex items-center justify-center gap-2 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Photo from Device Gallery</span>
                </button>
                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  Retry Camera
                </button>
              </div>
            </div>
          ) : (
            /* Live Camera Stream with Document Alignment Guide */
            <div className="relative w-full h-full flex items-center justify-center">
              {isInitializing && (
                <div className="absolute inset-0 z-20 bg-black/70 flex flex-col items-center justify-center text-gray-300 gap-3">
                  <RefreshCw className="w-7 h-7 animate-spin text-emerald-400" />
                  <span className="text-xs font-medium">Opening camera sensor...</span>
                </div>
              )}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover max-h-[65vh]"
              />

              {/* Document Framing Reticle Guide Overlay */}
              <div className="absolute inset-0 pointer-events-none p-6 sm:p-10 flex flex-col items-center justify-center">
                <div className="relative w-full max-w-md aspect-3/4 sm:aspect-4/3 rounded-2xl border-2 border-dashed border-emerald-400/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] flex items-center justify-center">
                  {/* Four Corner Reticles */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

                  {/* Center Guidance Badge */}
                  <div className="bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs text-white/90 font-medium border border-white/20 flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Align handwriting inside frame</span>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-gray-300 bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full">
                  Keep camera steady with good lighting
                </div>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
          <input
            ref={fileFallbackRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileFallback}
          />
        </div>

        {/* Bottom Shutter & Action Bar */}
        <div className="px-6 py-4 bg-gray-900 border-t border-gray-800 flex items-center justify-between text-white">
          {capturedImage ? (
            /* Confirmation Actions */
            <div className="w-full flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRetake}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake Photo</span>
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 transition-all hover:scale-102"
              >
                <Check className="w-4 h-4" />
                <span>Analyze Handwriting with InkSure</span>
              </button>
            </div>
          ) : (
            /* Live Camera Controls */
            <div className="w-full flex items-center justify-between">
              {/* Native camera gallery picker */}
              <button
                type="button"
                onClick={() => fileFallbackRef.current?.click()}
                className="p-2.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                title="Select from gallery or device storage"
              >
                <Upload className="w-5 h-5" />
              </button>

              {/* Primary Circular Shutter Button */}
              <button
                type="button"
                onClick={handleShutter}
                disabled={isInitializing || !!cameraError}
                aria-label="Capture photo"
                className="group relative w-16 h-16 rounded-full border-4 border-white flex items-center justify-center transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500 group-hover:bg-emerald-400 flex items-center justify-center transition-colors">
                  <Camera className="w-6 h-6 text-gray-950" />
                </div>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

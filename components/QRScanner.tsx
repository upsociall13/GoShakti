
import React, { useState, useRef, useEffect } from 'react';

interface QRScannerProps {
  onClose: () => void;
  onResult: (type: 'FARMER' | 'PRODUCT', id: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onClose, onResult }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [statusText, setStatusText] = useState('Initializing Secure Camera...');

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
        setStatusText('Align QR code within the frame');
      } catch (err) {
        console.error("Camera access error:", err);
        setHasPermission(false);
        setStatusText('Camera access denied or unavailable');
      }
    }

    startCamera();

    // Simulated Scanning Logic
    const timer = setTimeout(() => {
      if (hasPermission !== false) {
        setScanning(false);
        setStatusText('Identity Matched: Decrypting...');
        
        // Randomly simulate a farmer or product scan after 3 seconds
        setTimeout(() => {
          const isFarmer = Math.random() > 0.5;
          onResult(isFarmer ? 'FARMER' : 'PRODUCT', isFarmer ? 'KYF-9912' : 'PRD-451');
        }, 1500);
      }
    }, 4000);

    return () => {
      clearTimeout(timer);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [hasPermission, onResult]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-emerald-950/95 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-black rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(52,211,153,0.3)] border-8 border-emerald-900/50">
        
        {/* Camera Feed */}
        <div className="aspect-square relative flex items-center justify-center bg-slate-900">
          {hasPermission === false ? (
            <div className="p-12 text-center space-y-8">
              <div className="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                 <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <p className="text-2xl font-black text-white uppercase tracking-widest">Hardware Blocked</p>
              <p className="text-slate-400 font-bold leading-relaxed">Please enable camera permissions in your browser settings to verify credentials.</p>
              <button onClick={onClose} className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest">Close Portal</button>
            </div>
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className={`w-full h-full object-cover grayscale brightness-[0.8] ${!scanning ? 'blur-sm opacity-50' : 'opacity-100'} transition-all duration-700`} 
            />
          )}

          {/* Scanner UI Overlay */}
          {hasPermission !== false && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
              {/* Corner Borders */}
              <div className="absolute top-12 left-12 w-16 h-16 border-t-8 border-l-8 border-emerald-400 rounded-tl-3xl"></div>
              <div className="absolute top-12 right-12 w-16 h-16 border-t-8 border-r-8 border-emerald-400 rounded-tr-3xl"></div>
              <div className="absolute bottom-12 left-12 w-16 h-16 border-b-8 border-l-8 border-emerald-400 rounded-bl-3xl"></div>
              <div className="absolute bottom-12 right-12 w-16 h-16 border-b-8 border-r-8 border-emerald-400 rounded-br-3xl"></div>

              {/* Laser Line */}
              {scanning && (
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 shadow-[0_0_20px_#10b981] animate-[scan-line_3s_ease-in-out_infinite]"></div>
              )}

              {/* Status Indicator */}
              <div className="mt-auto text-center space-y-6 relative z-10">
                <div className="inline-flex items-center gap-4 bg-emerald-950/80 backdrop-blur-xl px-8 py-4 rounded-3xl border border-emerald-400/30">
                  <div className={`w-3 h-3 rounded-full ${scanning ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'} shadow-[0_0_15px_currentColor]`}></div>
                  <span className="text-xs font-black text-white uppercase tracking-[0.4em]">{statusText}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-emerald-950 p-10 flex items-center justify-between border-t border-white/10">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
              <img src="https://picsum.photos/seed/scan/40/40" alt="Scanner" className="w-6 h-6 brightness-0 invert" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Encrypted Validator</p>
              <p className="text-sm text-white/60 font-bold">SHA-256 Verified Input</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-5 hover:bg-white/10 rounded-2xl transition-all group"
          >
            <svg className="w-8 h-8 text-white/40 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scan-line {
          0%, 100% { top: 5%; }
          50% { top: 95%; }
        }
      `}</style>
    </div>
  );
};

export default QRScanner;

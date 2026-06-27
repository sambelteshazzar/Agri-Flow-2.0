import React, { useState, useRef } from 'react';
import { X, AlertTriangle, Upload, Loader2 } from 'lucide-react';
import { analyzeCropImage } from '@/services/geminiService';
import type { CountryContext } from '@/services/geminiService';

interface CropScannerProps {
  isOpen: boolean;
  onClose: () => void;
  countryCtx: CountryContext | undefined;
}

const CropScanner: React.FC<CropScannerProps> = ({ isOpen, onClose, countryCtx }) => {
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [scanContext, setScanContext] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const scanInputRef = useRef<HTMLInputElement>(null);

  const handleScanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setScanImage(reader.result as string); setScanResult(''); };
      reader.readAsDataURL(file);
    }
  };

  const performScan = async () => {
    if (!scanImage) return;
    setIsScanning(true);
    try {
      const diagnosis = await analyzeCropImage(scanImage, scanContext, countryCtx);
      setScanResult(diagnosis);
    } catch {
      setScanResult("Could not complete the analysis.");
    } finally {
      setIsScanning(false);
    }
  };

  const resetScanner = () => { setScanImage(null); setScanContext(''); setScanResult(''); onClose(); };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-jade-950/90 backdrop-blur-md" role="dialog" aria-modal="true">
      <div className="bg-[var(--bg-content)] w-full max-w-2xl shadow-2xl rounded-md flex flex-col max-h-[90vh] border border-jade-600">
        <div className="bg-jade-950 p-5 flex justify-between items-center border-b-4 border-red-600 shrink-0">
          <h3 className="text-xl font-semibold text-white flex items-center"><AlertTriangle className="w-5 h-5 mr-2 text-red-500" /> Crop Health Check</h3>
          <button onClick={resetScanner} aria-label="Close" className="text-[var(--text-tertiary)] hover:text-white"><X className="w-6 h-6" aria-hidden="true" /></button>
        </div>
        <div className="p-6 overflow-y-auto">
          {!scanResult ? (
            <div className="space-y-6">
              <div onClick={() => scanInputRef.current?.click()} className={`border-4 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer ${scanImage ? 'border-jade-600 bg-jade-50 dark:bg-jade-900/20' : 'border-[var(--text-secondary)] bg-[var(--bg-card)]'}`}>
                <input type="file" accept="image/*" className="hidden" ref={scanInputRef} onChange={handleScanUpload} />
                {scanImage ? <img src={scanImage} className="max-h-48 object-contain" /> : <><Upload className="w-12 h-12 text-[var(--text-secondary)] mb-4" /><p className="text-[var(--text-primary)] font-semibold">Tap to Upload</p></>}
              </div>
              <textarea value={scanContext} onChange={e => setScanContext(e.target.value)} className="w-full p-3 border-2 border-[var(--border-card)] rounded font-medium text-[var(--text-primary)] placeholder-[var(--text-secondary)] bg-[var(--bg-content)] focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-jade-500/10" placeholder="Add specific observation notes here..." rows={3} />
              <button onClick={performScan} disabled={!scanImage || isScanning} className="w-full py-4 bg-red-600 text-white font-semibold hover:bg-red-700 rounded-sm shadow-md flex items-center justify-center">
                {isScanning ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : 'Run Health Check'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-[var(--bg-card)] border-l-4 border-red-600 p-6 shadow-sm"><p className="whitespace-pre-wrap font-medium text-[var(--text-primary)]">{scanResult}</p></div>
              <button onClick={() => setScanResult('')} className="w-full py-3 bg-jade-800 text-white font-semibold rounded-sm">Scan Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropScanner;

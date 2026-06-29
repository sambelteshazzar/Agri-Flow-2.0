import React, { useState } from 'react';
import { X, ClipboardList } from 'lucide-react';
import { LogEntry } from '@/types';

interface CropLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCropId: string | null;
  onSubmit: (data: { referenceId: string; category: string; date: string; type: LogEntry['type']; note: string }) => Promise<void>;
  onShowToast: (msg: string, type: string) => void;
  areaUnit: string;
}

const CropLogModal: React.FC<CropLogModalProps> = ({ isOpen, onClose, selectedCropId, onSubmit, onShowToast, areaUnit }) => {
  const [newLog, setNewLog] = useState<{ type: LogEntry['type']; note: string }>({ type: 'Observation', note: '' });

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCropId && newLog.note) {
      try {
        await onSubmit({
          referenceId: selectedCropId,
          category: 'CROP',
          date: new Date().toISOString(),
          type: newLog.type,
          note: newLog.note
        });
        onClose();
        setNewLog({ type: 'Observation', note: '' });
      } catch (error) {
        onShowToast("Failed to save log", "error");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-full-modal flex items-center justify-center p-4 bg-jade-950/80 backdrop-blur-md" role="dialog" aria-modal="true">
      <div className="bg-[var(--bg-card)] w-full max-w-md shadow-2xl rounded-md border border-jade-600">
        <div className="bg-jade-950 p-5 flex justify-between items-center border-b-4 border-sunburst-500">
          <h3 className="text-xl font-bold text-white flex items-center">
            <ClipboardList className="w-5 h-5 mr-2 text-sunburst-500" /> Log Activity
          </h3>
          <button onClick={onClose} aria-label="Close" className="text-[var(--text-tertiary)] hover:text-white"><X className="w-6 h-6" aria-hidden="true" /></button>
        </div>
        <form onSubmit={handleLogSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Activity Type</label>
            <select value={newLog.type} onChange={e => setNewLog({...newLog, type: e.target.value as any})} className="w-full p-3 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-sm font-bold text-[var(--text-primary)] focus:outline-none focus:border-sunburst-500 focus:ring-4 focus:ring-jade-500/10">
              <option value="Observation">Observation</option>
              <option value="Action">Action (Water/Weed)</option>
              <option value="Input">Input (Fertilizer)</option>
              <option value="Harvest">Harvest</option>
              <option value="Treatment">Treatment</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Details</label>
            <textarea value={newLog.note} onChange={e => setNewLog({...newLog, note: e.target.value})} className="w-full p-3 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-sunburst-500 focus:ring-4 focus:ring-jade-500/10" rows={3} placeholder={`e.g. Applied 50kg Urea per ${areaUnit === 'acres' ? 'acre' : 'hectare'}...`} required />
          </div>
          <button type="submit" className="w-full bg-jade-950 dark:bg-jade-700 text-sunburst-500 py-4 font-semibold hover:bg-jade-900 dark:hover:bg-jade-600 rounded-sm shadow-md">Save Entry</button>
        </form>
      </div>
    </div>
  );
};

export default CropLogModal;

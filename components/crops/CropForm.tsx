import React, { useState, useRef, useEffect } from 'react';
import { X, Sprout, Image as ImageIcon } from 'lucide-react';
import { Crop } from '@/types';
import { formatAreaLabel } from '@/utils/localeFormat';
import getCropImage from './getCropImage';
import CROP_TEMPLATES from './cropTemplates';
import { ImageUpload } from '@/components/ui/ImageUpload';

interface CropFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (crop: Omit<Crop, 'id'>) => void;
  onShowToast: (msg: string, type: string) => void;
  areaUnit: string;
  editingCrop?: Crop | null;
}

const DEFAULT_CROP: Partial<Crop> = {
  name: '',
  variety: '',
  plantingDate: '',
  harvestDate: '',
  status: 'Healthy',
  area: 0,
  imageUrl: getCropImage('Generic'),
  soilHealth: 'Unknown',
  waterEfficiency: 'Moderate',
  biodiversityScore: 50
};

const CropForm: React.FC<CropFormProps> = ({ isOpen, onClose, onSubmit, onShowToast, areaUnit, editingCrop }) => {
  const [newCrop, setNewCrop] = useState<Partial<Crop>>(DEFAULT_CROP);

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setNewCrop(editingCrop ? { ...editingCrop } : { ...DEFAULT_CROP });
      if (firstInputRef.current) firstInputRef.current.focus();
    }
  }, [isOpen, editingCrop]);

  const applyTemplate = (template: typeof CROP_TEMPLATES[0]) => {
    setNewCrop({
      ...newCrop,
      name: template.name,
      variety: template.variety,
      plantingDate: template.plantingDate,
      harvestDate: template.harvestDate,
      area: template.area,
      imageUrl: template.imageUrl,
      soilHealth: template.soilHealth,
      waterEfficiency: template.waterEfficiency,
      biodiversityScore: template.biodiversityScore,
      status: 'Healthy'
    });
  };

  const handleNameChange = (name: string) => {
    setNewCrop(prev => ({
      ...prev,
      name: name,
      imageUrl: getCropImage(name)
    }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCrop.name && newCrop.variety && newCrop.plantingDate && newCrop.harvestDate && newCrop.area && newCrop.area > 0) {
      onSubmit(newCrop as Omit<Crop, 'id'>);
      if (!editingCrop) {
        setNewCrop({ ...DEFAULT_CROP });
      }
      onClose();
    } else {
      onShowToast("Please check fields. Area must be > 0.", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-full-modal flex items-center justify-center p-4 bg-jade-950/80 backdrop-blur-md" role="dialog" aria-modal="true">
      <div className="bg-[var(--bg-card)] w-full max-w-lg shadow-2xl rounded-md border border-jade-600 max-h-[90vh] overflow-y-auto">
        <div className="bg-jade-950 p-5 flex justify-between items-center border-b-4 border-sunburst-500 sticky top-0 z-10">
          <h3 className="text-xl font-semibold text-white flex items-center"><Sprout className="w-5 h-5 mr-2 text-sunburst-500" /> {editingCrop ? 'Edit Plot' : 'Register New Plot'}</h3>
          <button onClick={onClose} aria-label="Close" className="text-[var(--text-tertiary)] hover:text-white"><X className="w-6 h-6" aria-hidden="true" /></button>
        </div>
        <div className="p-6">

          <div className="mb-6 bg-[var(--bg-content)] p-4 rounded border border-[var(--border-card)]">
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Quick Start Templates</label>
            <div className="grid grid-cols-4 gap-2">
              {CROP_TEMPLATES.map((template, i) => (
                <button
                  key={template.name}
                  type="button"
                  onClick={() => applyTemplate(template)}
                  className={`py-2 px-2 border rounded text-xs font-semibold transition-colors shadow-sm flex items-center justify-center gap-1 ${
                    newCrop.name === template.name
                      ? 'bg-sunburst-500/10 border-sunburst-500 text-sunburst-700 dark:text-sunburst-400'
                      : 'bg-[var(--bg-card)] border-[var(--border-card)] text-[var(--text-secondary)] hover:border-sunburst-500 dark:hover:border-sunburst-500 hover:text-sunburst-700 dark:hover:text-sunburst-400'
                  }`}
                >
                  <Sprout className="w-3 h-3" /> {template.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-4">

            <div className="mb-4">
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1 flex items-center"><ImageIcon className="w-3 h-3 mr-1" /> Plot Imagery</label>
              <div className="flex gap-4 items-start bg-[var(--bg-content)] p-3 rounded border border-[var(--border-card)]">
                <ImageUpload
                  value={newCrop.imageUrl || ''}
                  onChange={(url) => setNewCrop({...newCrop, imageUrl: url || getCropImage(newCrop.name)})}
                  label="Upload crop image"
                  placeholder="Crop photo"
                  size="md"
                />
                <div className="flex-1">
                  <p className="text-[10px] text-[var(--text-secondary)] font-medium">
                    Upload a photo of your crop, or leave empty to use the default image for {newCrop.name || 'this crop type'}.
                  </p>
                  {newCrop.imageUrl && !newCrop.imageUrl.startsWith('data:') && (
                    <button
                      type="button"
                      onClick={() => setNewCrop({...newCrop, imageUrl: getCropImage(newCrop.name)})}
                      className="mt-2 text-[10px] text-jade-600 hover:text-jade-700 font-semibold"
                    >
                      Reset to default
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Crop Type</label>
              <input required ref={firstInputRef} type="text" value={newCrop.name} onChange={e => handleNameChange(e.target.value)} className="w-full px-4 py-3 border-2 border-[var(--border-card)] rounded-sm font-bold text-[var(--text-primary)] placeholder-[var(--text-secondary)] bg-[var(--bg-content)] focus:outline-none focus:border-sunburst-500 focus:ring-4 focus:ring-jade-500/10" placeholder="e.g. Cowpea"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Variety</label>
                <input required type="text" value={newCrop.variety} onChange={e => setNewCrop({...newCrop, variety: e.target.value})} className="w-full px-4 py-3 border-2 border-[var(--border-card)] rounded-sm font-bold text-[var(--text-primary)] placeholder-[var(--text-secondary)] bg-[var(--bg-content)] focus:outline-none focus:border-sunburst-500 focus:ring-4 focus:ring-jade-500/10" placeholder="e.g. Pioneer P1197"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Area ({formatAreaLabel(areaUnit as any)})</label>
                <input required type="number" value={newCrop.area || ''} onChange={e => setNewCrop({...newCrop, area: Number(e.target.value)})} className="w-full px-4 py-3 border-2 border-[var(--border-card)] rounded-sm font-bold text-[var(--text-primary)] placeholder-[var(--text-secondary)] bg-[var(--bg-content)] focus:outline-none focus:border-sunburst-500 focus:ring-4 focus:ring-jade-500/10" placeholder="e.g. 15.5"/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Plant Date</label>
                <input required type="date" value={newCrop.plantingDate} onChange={e => setNewCrop({...newCrop, plantingDate: e.target.value})} className="w-full px-4 py-3 border-2 border-[var(--border-card)] rounded-sm font-bold text-[var(--text-primary)] bg-[var(--bg-content)] focus:outline-none focus:border-sunburst-500 focus:ring-4 focus:ring-jade-500/10" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Est Harvest</label>
                <input required type="date" value={newCrop.harvestDate} onChange={e => setNewCrop({...newCrop, harvestDate: e.target.value})} className="w-full px-4 py-3 border-2 border-[var(--border-card)] rounded-sm font-bold text-[var(--text-primary)] bg-[var(--bg-content)] focus:outline-none focus:border-sunburst-500 focus:ring-4 focus:ring-jade-500/10" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Water Efficiency</label>
                <select value={newCrop.waterEfficiency} onChange={e => setNewCrop({...newCrop, waterEfficiency: e.target.value as any})} className="w-full px-4 py-3 border-2 border-[var(--border-card)] rounded-sm font-bold text-[var(--text-primary)] bg-[var(--bg-content)] focus:outline-none focus:border-sunburst-500 focus:ring-4 focus:ring-jade-500/10">
                  <option value="High">High</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Soil Health</label>
                <select value={newCrop.soilHealth} onChange={e => setNewCrop({...newCrop, soilHealth: e.target.value as any})} className="w-full px-4 py-3 border-2 border-[var(--border-card)] rounded-sm font-bold text-[var(--text-primary)] bg-[var(--bg-content)] focus:outline-none focus:border-sunburst-500 focus:ring-4 focus:ring-jade-500/10">
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Degraded">Degraded</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full bg-sunburst-500 text-jade-950 py-4 font-semibold hover:bg-sunburst-400 rounded-sm shadow-md">{editingCrop ? 'Save Changes' : 'Confirm & Save'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CropForm;

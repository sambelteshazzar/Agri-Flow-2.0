import React, { useState, useRef, useEffect } from 'react';
import { useFarm } from '../contexts/FarmContext';
import { Plus, Ruler, CalendarDays, Trash2, X, Sprout, Layers, Droplets, Droplet, Leaf, Scan, AlertTriangle, Upload, Activity, Loader2, FileWarning, ClipboardList, Lightbulb, Check, Coffee, Wheat, Image as ImageIcon, Map, Database } from 'lucide-react';
import { Crop, LogEntry } from '../types';
import { analyzeCropImage } from '../services/geminiService';
import type { CountryContext } from '../services/geminiService';
import { formatArea, formatAreaLabel } from '../utils/localeFormat';

interface Suggestion {
  cropId: string;
  cropName: string;
  suggestedStatus: Crop['status'];
  reason: string;
  type: 'HARVEST' | 'HEALTH';
}

const getCropImage = (cropName: string) => {
  const lower = cropName?.toLowerCase() || '';
  
  // Grains & Cereals
  if (lower.includes('maize') || lower.includes('corn')) return 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('wheat') || lower.includes('barley') || lower.includes('rye') || lower.includes('oat')) return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('rice') || lower.includes('paddy')) return 'https://images.unsplash.com/photo-1536630596251-245f32a537be?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('sorghum') || lower.includes('millet')) return 'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?q=80&w=1000&auto=format&fit=crop';
  
  // Legumes
  if (lower.includes('soy')) return 'https://images.unsplash.com/photo-1599940824399-b87987ced72a?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('bean') || lower.includes('legume') || lower.includes('pea')) return 'https://images.unsplash.com/photo-1591466068305-64906f363065?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('peanut') || lower.includes('groundnut')) return 'https://images.unsplash.com/photo-1564856627670-34907a972dd4?q=80&w=1000&auto=format&fit=crop';

  // Cash Crops
  if (lower.includes('coffee')) return 'https://images.unsplash.com/photo-1584345604325-f5091269a0d1?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('cotton')) return 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('tea')) return 'https://images.unsplash.com/photo-1563205764-647629681bb9?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('cane') || lower.includes('sugar')) return 'https://images.unsplash.com/photo-1629814596319-21623fb04771?q=80&w=1000&auto=format&fit=crop';
  
  // Vegetables
  if (lower.includes('potato') || lower.includes('tuber')) return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('tomato')) return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('onion') || lower.includes('garlic')) return 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('carrot')) return 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('lettuce') || lower.includes('leaf') || lower.includes('spinach')) return 'https://images.unsplash.com/photo-1626202378907-d4fa249ebc90?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('pepper') || lower.includes('chili')) return 'https://images.unsplash.com/photo-1563514227149-561c2c018c16?q=80&w=1000&auto=format&fit=crop';

  // Fruits
  if (lower.includes('fruit') || lower.includes('apple') || lower.includes('orchard')) return 'https://images.unsplash.com/photo-1523301346795-8afc46477f61?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('grape') || lower.includes('vine')) return 'https://images.unsplash.com/photo-1596363824257-4a743787729d?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('banana')) return 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=1000&auto=format&fit=crop';
  
  // Generic / Default
  return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop';
};

const CROP_TEMPLATES = [
  {
    name: 'Maize',
    variety: 'Drought-Tol OBA Super 2',
    plantingDate: '2026-05-15',
    harvestDate: '2026-09-30',
    status: 'Healthy' as const,
    area: 50,
    imageUrl: getCropImage('Maize'),
    soilHealth: 'Degraded' as const,
    waterEfficiency: 'Low' as const,
    biodiversityScore: 22
  },
  {
    name: 'Rice',
    variety: 'NERICA L-34 (Lowland)',
    plantingDate: '2026-06-01',
    harvestDate: '2026-10-15',
    status: 'Healthy' as const,
    area: 30,
    imageUrl: getCropImage('Rice'),
    soilHealth: 'Good' as const,
    waterEfficiency: 'Moderate' as const,
    biodiversityScore: 55
  },
  {
    name: 'Millet',
    variety: 'SOSAT-C88 (ICRISAT)',
    plantingDate: '2026-06-15',
    harvestDate: '2026-10-30',
    status: 'Healthy' as const,
    area: 20,
    imageUrl: getCropImage('Millet'),
    soilHealth: 'Excellent' as const,
    waterEfficiency: 'High' as const,
    biodiversityScore: 40
  }
];

const CropManager: React.FC = () => {
  const { crops, addCrop, deleteCrop, addActivityLog, getLogsByRef, updateCropStatus, showToast, userProfile } = useFarm();

  const countryCtx: CountryContext | undefined = userProfile.countryCode ? {
    countryCode: userProfile.countryCode,
    region: userProfile.region || '',
    climateZone: userProfile.climateZone || 'temperate',
    currencyCode: userProfile.currencyCode || 'USD',
    currencySymbol: userProfile.currencySymbol || '$',
    language: userProfile.language || 'en',
    farmType: userProfile.farmType || 'mixed',
    areaUnit: userProfile.areaUnit || 'ha',
  } : undefined;
  
  // -- Suggestion State --
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);

  // -- Add Crop State --
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCrop, setNewCrop] = useState<Partial<Crop>>({
    name: '',
    variety: '',
    plantingDate: '',
    harvestDate: '',
    status: 'Healthy',
    area: 0,
    imageUrl: getCropImage('Generic'), // Initial fallback
    soilHealth: 'Unknown',
    waterEfficiency: 'Moderate',
    biodiversityScore: 50
  });

  // -- Log Modal State --
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [newLog, setNewLog] = useState<{ type: LogEntry['type'], note: string }>({ type: 'Observation', note: '' });

  // -- Scanner State --
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [scanContext, setScanContext] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const scanInputRef = useRef<HTMLInputElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus management
  useEffect(() => {
    if (isModalOpen && firstInputRef.current) firstInputRef.current.focus();
  }, [isModalOpen]);

  // -- AUTO-ANALYSIS --
  useEffect(() => {
    const runAnalysis = async () => {
      if (suggestion) return;

      const today = new Date();
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(today.getDate() + 7);

      for (const crop of crops) {
        if (crop.harvestDate && crop.status !== 'Harvest Ready') {
          const harvestDate = new Date(crop.harvestDate);
          if (harvestDate <= oneWeekFromNow) {
            setSuggestion({
              cropId: crop.id,
              cropName: crop.name,
              suggestedStatus: 'Harvest Ready',
              reason: `Harvest date is ${harvestDate <= today ? 'past due' : 'approaching soon'}.`,
              type: 'HARVEST'
            });
            return;
          }
        }

        if (crop.status === 'Healthy') {
           const logs = await getLogsByRef(crop.id);
           if (logs.length > 0) {
             const recentLog = logs[0];
             const text = recentLog.note.toLowerCase();
             const type = recentLog.type;

             if (
               text.includes('pest') || 
               text.includes('disease') || 
               text.includes('damage') || 
               text.includes('wilt') ||
               type === 'Treatment'
             ) {
               setSuggestion({
                 cropId: crop.id,
                 cropName: crop.name,
                 suggestedStatus: 'Needs Attention',
                 reason: `Recent activity log detected concern: "${recentLog.note.substring(0, 30)}..."`,
                 type: 'HEALTH'
               });
               return;
             }
           }
        }
      }
    };

    runAnalysis();
  }, [crops, getLogsByRef]); 

  const confirmSuggestion = async () => {
    if (suggestion) {
      await updateCropStatus(suggestion.cropId, suggestion.suggestedStatus);
      setSuggestion(null);
    }
  };

  const dismissSuggestion = () => {
    setSuggestion(null);
  };

  const loadSampleData = async () => {
    for (const t of CROP_TEMPLATES) {
      await addCrop({
        name: t.name,
        variety: t.variety,
        plantingDate: t.plantingDate,
        harvestDate: t.harvestDate,
        status: t.status,
        area: t.area,
        imageUrl: t.imageUrl,
        soilHealth: t.soilHealth,
        waterEfficiency: t.waterEfficiency,
        biodiversityScore: t.biodiversityScore,
      });
    }
    showToast('Sample crop data loaded', 'success');
  };

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
      // Auto-update image only if user hasn't manually set a custom URL that isn't one of our auto-generated ones
      imageUrl: getCropImage(name) 
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'bg-jade-600';
      case 'Needs Attention': return 'bg-sunburst-500';
      case 'Critical': return 'bg-terra-600';
      case 'Harvest Ready': return 'bg-blue-600';
      default: return 'bg-terra-300';
    }
  };

  const getWaterEfficiencyColor = (efficiency: string) => {
    switch (efficiency) {
      case 'High': return 'bg-jade-100 border-jade-200 text-jade-800 dark:bg-jade-900/30 dark:border-jade-800 dark:text-jade-300';
      case 'Moderate': return 'bg-sunburst-100 border-sunburst-200 text-sunburst-800 dark:bg-sunburst-900/30 dark:border-sunburst-800 dark:text-sunburst-300';
      case 'Low': return 'bg-red-100 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300';
      default: return 'bg-[var(--bg-content)] border-[var(--border-card)] text-[var(--text-primary)] dark:bg-jade-900/30 dark:border-jade-800 dark:text-jade-300';
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCrop.name && newCrop.variety && newCrop.plantingDate && newCrop.harvestDate && newCrop.area && newCrop.area > 0) {
      addCrop(newCrop as Omit<Crop, 'id'>);
      setIsModalOpen(false);
      setNewCrop({ 
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
      });
    } else {
      showToast("Please check fields. Area must be > 0.", "error");
    }
  };

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCropId && newLog.note) {
      try {
        await addActivityLog({
          referenceId: selectedCropId,
          category: 'CROP',
          date: new Date().toISOString(),
          type: newLog.type,
          note: newLog.note
        });
        setIsLogModalOpen(false);
        setNewLog({ type: 'Observation', note: '' });
        setSelectedCropId(null);
      } catch (error) {
        showToast("Failed to save log", "error");
      }
    }
  };

  const openLogModal = (id: string) => {
    setSelectedCropId(id);
    setIsLogModalOpen(true);
  };

  // -- Scanner Handlers --
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

  const resetScanner = () => { setScanImage(null); setScanContext(''); setScanResult(''); setIsScannerOpen(false); };

  return (
    <div className="space-y-6 animate-fade-in pb-10 relative">
      
      {/* -- SMART SUGGESTION MODAL -- */}
      {suggestion && (
        <div className="fixed bottom-6 right-6 z-[60] max-w-sm w-full animate-fade-in-up">
          <div className="bg-terra-900 dark:bg-jade-950 border-l-4 border-sunburst-500 rounded-r-lg shadow-2xl p-4 text-white relative">
            <button 
              onClick={dismissSuggestion}
              aria-label="Dismiss suggestion"
              className="absolute top-2 right-2 text-[var(--text-tertiary)] hover:text-white"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
            
            <div className="flex items-start gap-3">
              <div className="bg-sunburst-500/20 p-2 rounded-full">
                <Lightbulb className="w-5 h-5 text-sunburst-500 animate-pulse" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-sunburst-500 mb-1">Smart Insight</h4>
                <p className="text-sm font-medium mb-2">
                  Your crop looks like it needs an update — <span className="font-bold text-white">{suggestion.cropName}</span> status should be updated to <span className="font-bold text-sunburst-400">{suggestion.suggestedStatus}</span>.
                </p>
                <p className="text-xs text-[var(--text-tertiary)] italic mb-3">"{suggestion.reason}"</p>
                
                <div className="flex gap-2">
                  <button 
                    onClick={confirmSuggestion}
                    className="bg-sunburst-500 hover:bg-sunburst-400 text-jade-950 px-3 py-1.5 rounded text-xs font-semibold flex items-center"
                  >
                    <Check className="w-3 h-3 mr-1" /> Update Status
                  </button>
                  <button 
                    onClick={dismissSuggestion}
                    className="bg-transparent border border-jade-600 text-[var(--text-tertiary)] hover:text-white hover:border-jade-400 px-3 py-1.5 rounded text-xs font-semibold"
                  >
                    Ignore
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[var(--bg-card)] p-5 rounded-lg shadow-sm border border-[var(--border-card)] flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
        <div>
          <h2 className="text-3xl font-bold text-[var(--text-primary)] font-heading">My Crops</h2>
          <div className="flex items-center gap-2 mt-1">
<span className="px-2 py-0.5 bg-[var(--bg-content)] text-[var(--text-secondary)] text-xs font-semibold rounded">Plots: {crops.length}</span>
              <span className="px-2 py-0.5 bg-jade-100 dark:bg-jade-900/30 text-jade-800 dark:text-jade-300 text-xs font-semibold rounded flex items-center border border-jade-200 dark:border-jade-800">
                <Leaf className="w-3 h-3 mr-1" aria-hidden="true" /> Regenerative Focus
             </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsScannerOpen(true)} className="flex items-center px-4 py-3 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition-colors shadow-sm border border-red-800 focus:outline-none focus:ring-2 focus:ring-red-500">
            <Scan className="w-5 h-5 mr-2" /> Scan Pest/Disease
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center px-6 py-3 bg-jade-800 dark:bg-sunburst-500 text-white rounded font-semibold hover:bg-jade-700 dark:hover:bg-sunburst-400 transition-colors shadow-sm border border-jade-900 dark:border-sunburst-600 focus:outline-none focus:ring-2 focus:ring-jade-500">
            <Plus className="w-5 h-5 mr-2" /> Add Plot
          </button>
        </div>
      </div>

      {crops.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-[var(--bg-content)] rounded-2xl border-2 border-dashed border-[var(--border-card)] text-center animate-fade-in-up relative overflow-hidden group">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] pointer-events-none"></div>
          <div className="relative z-10 max-w-md">
             <div className="w-24 h-24 bg-jade-100 dark:bg-jade-900/30 rounded-full flex items-center justify-center mb-6 shadow-sm mx-auto group-hover:scale-110 transition-transform duration-500">
               <Map className="w-12 h-12 text-jade-600 dark:text-jade-400" />
             </div>
             <h3 className="text-2xl font-black text-[var(--text-primary)] mb-3 font-heading">Start Your Season</h3>
             <p className="text-[var(--text-secondary)] mb-8 text-sm font-medium leading-relaxed">
               Your digital farm map is ready. Register your first crop field to begin tracking real-time health metrics, harvest schedules, and soil data.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => setIsModalOpen(true)} className="px-8 py-3 bg-jade-600 text-white font-semibold rounded-lg hover:bg-jade-700 transition-all shadow-lg active:scale-95 text-xs flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add Your First Plot
                </button>
                <button onClick={loadSampleData} className="px-8 py-3 bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-card)] font-semibold rounded-lg hover:bg-[var(--bg-content)] transition-all shadow-sm active:scale-95 text-xs flex items-center justify-center gap-2">
                 <Database className="w-4 h-4" /> Load Sample Data
               </button>
             </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => (
            <div key={crop.id} className="bg-[var(--bg-card)] rounded-lg shadow-md border border-[var(--border-card)] overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300">
              <div className={`h-3 w-full ${getStatusColor(crop.status)}`}></div>
              <div className="relative h-56 bg-[var(--bg-content)]">
                <img 
                  src={crop.imageUrl} 
                  alt={crop.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop';
                  }}
                />
                <div className="absolute top-0 right-0 bg-jade-950 text-white px-3 py-1 m-2 rounded text-xs font-semibold shadow-md border border-jade-700">{crop.status}</div>
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                  <h3 className="text-2xl font-bold text-white font-heading leading-none shadow-black drop-shadow-md">{crop.name}</h3>
                  <span className="text-white text-sm font-semibold drop-shadow-md">{crop.variety}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex gap-2 mb-4">
                   <div className={`flex-1 p-2 rounded border-2 text-center ${getWaterEfficiencyColor(crop.waterEfficiency)}`}>
<div className="text-[10px] font-semibold mb-1 flex justify-center items-center opacity-80">
                         <Droplets className="w-3 h-3 mr-1" /> Water Eff.
                       </div>
                       <div className="text-sm font-bold flex items-center justify-center gap-1">
                        <Droplet 
                          className={`w-3 h-3 ${
                            crop.waterEfficiency === 'High' ? 'text-jade-600 fill-jade-600 dark:text-jade-400 dark:fill-jade-400' : 
                            crop.waterEfficiency === 'Moderate' ? 'text-sunburst-500 fill-sunburst-500 dark:text-sunburst-400 dark:fill-sunburst-400' : 
                            crop.waterEfficiency === 'Low' ? 'text-red-600 fill-red-600 dark:text-red-400 dark:fill-red-400' : 'text-[var(--text-tertiary)]'
                          }`} 
                        />
                        {crop.waterEfficiency}
                      </div>
                   </div>
                   <div className={`flex-1 p-2 rounded border-2 text-center ${crop.biodiversityScore < 40 ? 'bg-sunburst-50 border-sunburst-200 text-sunburst-800 dark:bg-sunburst-900/30 dark:border-sunburst-800 dark:text-sunburst-300' : 'bg-jade-50 border-jade-200 text-jade-800 dark:bg-jade-900/30 dark:border-jade-800 dark:text-jade-300'}`}>
<div className="text-[10px] font-semibold mb-1 opacity-80">Biodiversity</div>
                       <div className="text-sm font-bold">{crop.biodiversityScore}/100</div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 border-b border-[var(--border-card)] pb-4">
                  <div>
                     <div className="flex items-center text-[var(--text-secondary)] text-xs font-semibold mb-1"><Ruler className="w-3 h-3 mr-1" /> Size</div>
                      <div className="text-lg font-bold text-[var(--text-primary)]">{formatArea(crop.area, userProfile.areaUnit)}</div>
                  </div>
                  <div>
                     <div className="flex items-center text-[var(--text-secondary)] text-xs font-semibold mb-1"><CalendarDays className="w-3 h-3 mr-1" /> Harvest</div>
                     <div className="text-lg font-bold text-[var(--text-primary)]">{new Date(crop.harvestDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                  </div>
                </div>

                <div className="mt-auto flex gap-3">
<button onClick={() => openLogModal(crop.id)} className="flex-1 py-3 bg-jade-800 dark:bg-jade-700 text-white text-sm font-semibold rounded hover:bg-jade-950 dark:hover:bg-jade-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-jade-500 cursor-pointer active:scale-95">
                     Log Activity
                  </button>
                  <button onClick={() => deleteCrop(crop.id)} aria-label={`Delete ${crop.name} plot`} className="px-3 py-2 bg-[var(--bg-card)] text-[var(--text-secondary)] rounded hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors border-2 border-[var(--border-card)] hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer active:scale-95">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Activity Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-jade-950/80 backdrop-blur-md" role="dialog" aria-modal="true">
          <div className="bg-[var(--bg-card)] w-full max-w-md shadow-2xl rounded-md border border-jade-600">
            <div className="bg-jade-950 p-5 flex justify-between items-center border-b-4 border-sunburst-500">
<h3 className="text-xl font-bold text-white flex items-center">
                  <ClipboardList className="w-5 h-5 mr-2 text-sunburst-500" /> Log Activity
              </h3>
              <button onClick={() => setIsLogModalOpen(false)} aria-label="Close" className="text-[var(--text-tertiary)] hover:text-white"><X className="w-6 h-6" aria-hidden="true" /></button>
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
                <textarea value={newLog.note} onChange={e => setNewLog({...newLog, note: e.target.value})} className="w-full p-3 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-sunburst-500 focus:ring-4 focus:ring-jade-500/10" rows={3} placeholder={`e.g. Applied 50kg Urea per ${userProfile.areaUnit === 'acres' ? 'acre' : 'hectare'}...`} required />
              </div>
              <button type="submit" className="w-full bg-jade-950 dark:bg-jade-700 text-sunburst-500 py-4 font-semibold hover:bg-jade-900 dark:hover:bg-jade-600 rounded-sm shadow-md">Save Entry</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Crop Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-jade-950/80 backdrop-blur-md" role="dialog" aria-modal="true">
          <div className="bg-[var(--bg-card)] w-full max-w-lg shadow-2xl rounded-md border border-jade-600 max-h-[90vh] overflow-y-auto">
            <div className="bg-jade-950 p-5 flex justify-between items-center border-b-4 border-sunburst-500 sticky top-0 z-10">
              <h3 className="text-xl font-semibold text-white flex items-center"><Sprout className="w-5 h-5 mr-2 text-sunburst-500" /> Register New Plot</h3>
              <button onClick={() => setIsModalOpen(false)} aria-label="Close" className="text-[var(--text-tertiary)] hover:text-white"><X className="w-6 h-6" aria-hidden="true" /></button>
            </div>
            <div className="p-6">
              
              {/* --- QUICK START TEMPLATES --- */}
              <div className="mb-6 bg-[var(--bg-content)] p-4 rounded border border-[var(--border-card)]">
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Quick Start Templates</label>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => applyTemplate(CROP_TEMPLATES[0])}
                    className="flex-1 py-2 px-2 bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-sunburst-500 dark:hover:border-sunburst-500 text-[var(--text-secondary)] hover:text-sunburst-700 dark:hover:text-sunburst-400 rounded text-xs font-semibold transition-colors shadow-sm flex items-center justify-center gap-1"
                  >
                    <Sprout className="w-3 h-3" /> Maize
                  </button>
                  <button 
                    type="button" 
                    onClick={() => applyTemplate(CROP_TEMPLATES[1])}
                    className="flex-1 py-2 px-2 bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-sunburst-500 dark:hover:border-sunburst-500 text-[var(--text-secondary)] hover:text-sunburst-700 dark:hover:text-sunburst-400 rounded text-xs font-semibold transition-colors shadow-sm flex items-center justify-center gap-1"
                  >
                    <Coffee className="w-3 h-3" /> Rice
                  </button>
                  <button 
                    type="button" 
                    onClick={() => applyTemplate(CROP_TEMPLATES[2])}
                    className="flex-1 py-2 px-2 bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-sunburst-500 dark:hover:border-sunburst-500 text-[var(--text-secondary)] hover:text-sunburst-700 dark:hover:text-sunburst-400 rounded text-xs font-semibold transition-colors shadow-sm flex items-center justify-center gap-1"
                  >
                    <Wheat className="w-3 h-3" /> Millet
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                
                {/* Visual Image Preview & Editor */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1 flex items-center"><ImageIcon className="w-3 h-3 mr-1" /> Plot Imagery</label>
                  <div className="flex gap-4 items-start bg-[var(--bg-content)] p-3 rounded border border-[var(--border-card)]">
                    <div className="w-24 h-24 shrink-0 bg-[var(--bg-content)] rounded border border-[var(--border-card)] overflow-hidden relative group">
                       <img 
                         src={newCrop.imageUrl} 
                         alt="Crop Preview" 
                         className="w-full h-full object-cover" 
                         onError={(e) => {
                           e.currentTarget.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop';
                         }}
                       />
                       <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none"></div>
                    </div>
                    <div className="flex-1">
                       <input 
                         type="text" 
                         value={newCrop.imageUrl} 
                         onChange={e => setNewCrop({...newCrop, imageUrl: e.target.value})} 
                         className="w-full px-4 py-2 border-[var(--border-card)] bg-[var(--bg-content)] focus:border-sunburst-500 dark:focus:border-sunburst-500 focus:ring-4 focus:ring-jade-500/10 rounded-sm font-medium text-[var(--text-primary)] text-xs mb-2"
                         placeholder="https://example.com/image.jpg"
                       />
                       <p className="text-[10px] text-[var(--text-secondary)] font-medium">
                         The system automatically assigns an image based on the crop name. You can paste a custom URL here to override it.
                       </p>
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
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Area ({formatAreaLabel(userProfile.areaUnit)})</label>
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
                <button type="submit" className="w-full bg-sunburst-500 text-jade-950 py-4 font-semibold hover:bg-sunburst-400 rounded-sm shadow-md">Confirm & Save</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Scanner Modal */}
      {isScannerOpen && (
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
      )}
    </div>
  );
};

export default CropManager;

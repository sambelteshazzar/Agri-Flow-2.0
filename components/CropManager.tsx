import React, { useState, useEffect } from 'react';
import { useFarm } from '../contexts/FarmContext';
import { Plus, Leaf, Scan, Map, Database } from 'lucide-react';
import { Crop, LogEntry } from '../types';
import type { CountryContext } from '../services/geminiService';
import CropCard from './crops/CropCard';
import CropSuggestion from './crops/CropSuggestion';
import CropForm from './crops/CropForm';
import CropLogModal from './crops/CropLogModal';
import CropFinancialsModal from './crops/CropFinancialsModal';
import CropScanner from './crops/CropScanner';
import getCropImage from './crops/getCropImage';
import CROP_TEMPLATES from './crops/cropTemplates';
import { Suggestion } from './crops/types';

const CropManager: React.FC = () => {
  const { crops, addCrop, deleteCrop, addActivityLog, getLogsByRef, updateCropStatus, showToast, userProfile, cropExpenses, cropIncomes, addCropExpense, deleteCropExpense, addCropIncome, deleteCropIncome } = useFarm();

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

  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isFinancialsOpen, setIsFinancialsOpen] = useState(false);
  const [financialsCropId, setFinancialsCropId] = useState<string | null>(null);

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

  const handleAddSubmit = (crop: Omit<Crop, 'id'>) => {
    addCrop(crop);
  };

  const handleLogSubmit = async (data: { referenceId: string; category: string; date: string; type: LogEntry['type']; note: string }) => {
    await addActivityLog(data);
  };

  const openLogModal = (id: string) => {
    setSelectedCropId(id);
    setIsLogModalOpen(true);
  };

  const openFinancials = (id: string) => {
    setFinancialsCropId(id);
    setIsFinancialsOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10 relative">

      {suggestion && (
        <CropSuggestion suggestion={suggestion} onConfirm={confirmSuggestion} onDismiss={dismissSuggestion} />
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
            <CropCard
              key={crop.id}
              crop={crop}
              areaUnit={userProfile.areaUnit}
              expenses={cropExpenses}
              incomes={cropIncomes}
              currencyCode={userProfile.currencyCode}
              currencySymbol={userProfile.currencySymbol}
              onLogActivity={openLogModal}
              onDelete={deleteCrop}
              onOpenFinancials={openFinancials}
            />
          ))}
        </div>
      )}

      <CropLogModal
        isOpen={isLogModalOpen}
        onClose={() => { setIsLogModalOpen(false); setSelectedCropId(null); }}
        selectedCropId={selectedCropId}
        onSubmit={handleLogSubmit}
        onShowToast={showToast}
        areaUnit={userProfile.areaUnit}
      />

      <CropForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddSubmit}
        onShowToast={showToast}
        areaUnit={userProfile.areaUnit}
      />

      <CropScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        countryCtx={countryCtx}
      />

      <CropFinancialsModal
        isOpen={isFinancialsOpen}
        onClose={() => { setIsFinancialsOpen(false); setFinancialsCropId(null); }}
        cropName={crops.find(c => c.id === financialsCropId)?.name || ''}
        cropId={financialsCropId || ''}
        expenses={cropExpenses}
        incomes={cropIncomes}
        onAddExpense={addCropExpense}
        onDeleteExpense={deleteCropExpense}
        onAddIncome={addCropIncome}
        onDeleteIncome={deleteCropIncome}
        currencyCode={userProfile.currencyCode}
        currencySymbol={userProfile.currencySymbol}
      />
    </div>
  );
};

export default CropManager;

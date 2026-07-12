import React, { useState, useRef } from 'react';
import { useFarm } from '../contexts/FarmContext';
import { Plus, Trash2, Pencil, X, Beef, Tag, ClipboardList, Calendar, HeartPulse, Image as ImageIcon, Scan, Upload, Loader2, Stethoscope, Clipboard, Database } from 'lucide-react';
import { Livestock, LogEntry } from '../types';
import { analyzeCropImage, CountryContext, isAIConfigured } from '../services/geminiService';
import { ImageUpload } from '@/components/ui/ImageUpload';

import { getStockImage } from '@/utils/stockImages';

const getLivestockImage = (species: string) => {
  return getStockImage(species);
};

const LivestockManager: React.FC = () => {
  const { livestock, addLivestock, deleteLivestock, updateLivestock, updateLivestockStatus, addActivityLog, getLogsByRef, showToast, userProfile } = useFarm();

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
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Livestock | null>(null);
  const [newAnimal, setNewAnimal] = useState<Partial<Livestock>>({ 
    name: '', 
    species: 'Cattle', 
    count: 1, 
    status: 'Healthy', 
    grazingType: 'Rotational', 
    imageUrl: getLivestockImage('Cattle'), 
    notes: '' 
  });

  // Records Modal State
  const [isRecordsModalOpen, setIsRecordsModalOpen] = useState(false);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [animalLogs, setAnimalLogs] = useState<LogEntry[]>([]);
  const [newLog, setNewLog] = useState<{ type: LogEntry['type'], note: string }>({ type: 'Observation', note: '' });

  // Scanner State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [scanContext, setScanContext] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isScanSimulated, setIsScanSimulated] = useState(false);
  const scanInputRef = useRef<HTMLInputElement>(null);

  const openRecordsModal = async (id: string) => {
    setSelectedAnimalId(id);
    const logs = await getLogsByRef(id);
    setAnimalLogs(logs);
    setIsRecordsModalOpen(true);
  };

  const handleSpeciesChange = (species: string) => {
    setNewAnimal(prev => ({
      ...prev,
      species: species as any,
      imageUrl: prev.imageUrl && prev.imageUrl.startsWith('data:') ? prev.imageUrl : getLivestockImage(species)
    }));
  };

  const loadSampleData = async () => {
    const samples: Omit<Livestock, 'id'>[] = [
      { name: 'Dairy Herd #1', species: 'Cattle', count: 15, status: 'Healthy', grazingType: 'Rotational', notes: 'Sample herd for demonstration', imageUrl: getLivestockImage('Cattle') },
      { name: 'Free-Range Flock', species: 'Chicken', count: 120, status: 'Healthy', grazingType: 'Free Range', notes: 'Sample flock for demonstration', imageUrl: getLivestockImage('Chicken') },
      { name: 'West African Dwarf Goats', species: 'Goat', count: 25, status: 'Healthy', grazingType: 'Free Range', notes: 'Sample herd for demonstration', imageUrl: getLivestockImage('Goat') },
    ];
    for (const s of samples) {
      await addLivestock(s);
    }
    showToast('Sample livestock data loaded', 'success');
  };

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnimalId && newLog.note) {
      const entry: Omit<LogEntry, 'id'> = {
        referenceId: selectedAnimalId,
        category: 'LIVESTOCK',
        date: new Date().toISOString(),
        type: newLog.type,
        note: newLog.note
      };
      try {
        await addActivityLog(entry);
        // Fetch fresh logs to ensure integrity and correct IDs
        const updatedLogs = await getLogsByRef(selectedAnimalId);
        setAnimalLogs(updatedLogs);
        setNewLog({ type: 'Observation', note: '' });
      } catch (error) {
        showToast("Failed to save log", "error");
      }
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAnimal.name && newAnimal.count && newAnimal.count > 0) {
      if (editingAnimal) {
        updateLivestock(editingAnimal.id, newAnimal as Partial<Omit<Livestock, 'id'>>);
        setEditingAnimal(null);
      } else {
        addLivestock(newAnimal as Omit<Livestock, 'id'>);
      }
      setIsModalOpen(false);
      setNewAnimal({ 
        name: '', 
        species: 'Cattle', 
        count: 1, 
        status: 'Healthy', 
        grazingType: 'Rotational', 
        imageUrl: getLivestockImage('Cattle'), 
        notes: '' 
      });
    } else {
       showToast("Please enter a valid Herd Name and a Count greater than 0.", "error");
    }
  };

  const openEditModal = (animal: Livestock) => {
    setEditingAnimal(animal);
    setNewAnimal({ ...animal });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAnimal(null);
    setNewAnimal({ 
      name: '', 
      species: 'Cattle', 
      count: 1, 
      status: 'Healthy', 
      grazingType: 'Rotational', 
      imageUrl: getLivestockImage('Cattle'), 
      notes: '' 
    });
  };

  const handleStatusChange = async (id: string, newStatus: Livestock['status']) => {
    await updateLivestockStatus(id, newStatus);
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
      const diagnosis = await analyzeCropImage(scanImage, `LIVESTOCK HEALTH ANALYSIS: ${scanContext}. Check for signs of disease, injury, or malnutrition.`, countryCtx);
      setScanResult(diagnosis);
      setIsScanSimulated(!isAIConfigured());
    } catch {
      setScanResult("Could not complete the analysis. Please ensure the image is clear.");
    } finally {
      setIsScanning(false);
    }
  };

  const resetScanner = () => { setScanImage(null); setScanContext(''); setScanResult(''); setIsScanSimulated(false); setIsScannerOpen(false); };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'bg-jade-100 text-jade-800 border-jade-300 dark:bg-jade-900/30 dark:text-jade-300 dark:border-jade-800';
      case 'Sick': return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      case 'Quarantined': return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
      case 'Lactating': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      default: return 'bg-[var(--bg-content)] text-[var(--text-primary)] border-[var(--border-card)] dark:bg-jade-800 dark:text-[var(--text-secondary)] dark:border-[var(--border-card)]';
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      <div className="bg-[var(--bg-card)] dark:bg-jade-950 p-5 rounded-lg shadow-sm border border-[var(--border-card)] flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
        <div>
          <h2 className="text-3xl font-bold text-[var(--text-primary)] font-heading">My Livestock</h2>
          <p className="text-[var(--text-primary)] dark:text-[var(--text-secondary)] font-semibold mt-1 text-xs">Monitoring {livestock.reduce((acc, curr) => acc + curr.count, 0)} Head</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsScannerOpen(true)} className="flex items-center px-4 py-3 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition-colors shadow-sm border border-red-800 focus:outline-none focus:ring-2 focus:ring-red-500">
            <Scan className="w-5 h-5 mr-2" /> AI Health Scan
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center px-6 py-3 bg-jade-800 dark:bg-jade-700 text-white rounded font-semibold hover:bg-jade-900 dark:hover:bg-jade-600 transition-colors shadow-sm border border-jade-900 dark:border-jade-700 focus:outline-none focus:ring-2 focus:ring-jade-500">
            <Plus className="w-5 h-5 mr-2" /> Add Herd Unit
          </button>
        </div>
      </div>

      {livestock.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-[var(--bg-content)] dark:bg-jade-950 rounded-2xl border-2 border-dashed border-[var(--border-card)] text-center animate-fade-in-up relative overflow-hidden group">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
          <div className="relative z-10 max-w-md">
             <div className="w-24 h-24 bg-sunburst-100 dark:bg-sunburst-900/30 rounded-full flex items-center justify-center mb-6 shadow-sm mx-auto group-hover:scale-110 transition-transform duration-500">
               <Clipboard className="w-12 h-12 text-sunburst-600 dark:text-sunburst-400" />
             </div>
             <h3 className="text-2xl font-black text-[var(--text-primary)] mb-3 font-heading">Barn is Empty</h3>
             <p className="text-[var(--text-secondary)] mb-8 text-sm font-medium leading-relaxed">
               Begin monitoring your herd health, grazing patterns, and veterinary logs by adding your first livestock unit to the system.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => setIsModalOpen(true)} className="px-8 py-3 bg-sunburst-500 text-jade-950 font-semibold rounded-lg hover:bg-sunburst-400 transition-all shadow-lg active:scale-95 text-xs flex items-center justify-center gap-2">
                 <Plus className="w-4 h-4" /> Register Herd
               </button>
                <button onClick={loadSampleData} className="px-8 py-3 bg-[var(--bg-card)] dark:bg-jade-800 text-[var(--text-primary)] dark:text-[var(--text-primary)] border border-[var(--border-card)] dark:border-jade-600 font-semibold rounded-lg hover:bg-[var(--bg-content)] dark:hover:bg-jade-700 transition-all shadow-sm active:scale-95 text-xs flex items-center justify-center gap-2">
                 <Database className="w-4 h-4" /> Load Sample Herd
               </button>
             </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {livestock.map((animal) => (
            <div key={animal.id} className="bg-[var(--bg-card)] dark:bg-jade-950 rounded border border-[var(--border-card)] border-l-8 border-l-sunburst-500 shadow-md hover:shadow-lg transition-all group relative">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center">
                       <div className="bg-sunburst-500 text-jade-950 p-2 rounded-sm mr-3 font-bold shadow-sm"><Tag className="w-5 h-5" /></div>
                      <div>
                         <h3 className="text-xl font-bold text-[var(--text-primary)]">{animal.name}</h3>
                          <p className="text-xs font-semibold text-[var(--text-primary)] dark:text-[var(--text-tertiary)]">{animal.species}</p>
                      </div>
                   </div>
                   <div className="text-right"><span className="block text-3xl font-bold text-[var(--text-primary)] font-heading">{animal.count}</span><span className="text-[10px] text-[var(--text-secondary)] font-semibold">Count</span></div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                   {/* Interactive Status Selector */}
                   <div className={`relative rounded border-2 ${getStatusColor(animal.status)}`}>
                      <select 
                        value={animal.status} 
                        onChange={(e) => handleStatusChange(animal.id, e.target.value as any)}
                        className={`w-full h-full py-2 pl-2 pr-1 bg-transparent text-xs font-semibold appearance-none focus:outline-none cursor-pointer`}
                      >
                         <option value="Healthy" className="text-jade-950 dark:text-jade-950">Healthy</option>
                         <option value="Sick" className="text-jade-950 dark:text-jade-950">Sick</option>
                         <option value="Quarantined" className="text-jade-950 dark:text-jade-950">Quarantined</option>
                         <option value="Lactating" className="text-jade-950 dark:text-jade-950">Lactating</option>
                      </select>
                      <HeartPulse className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"/>
                   </div>
                   
                   <div className="text-center py-2 px-1 rounded border-2 border-[var(--border-card)] dark:border-[var(--border-card)] bg-[var(--bg-content)] dark:bg-jade-800 text-[var(--text-primary)] dark:text-[var(--text-primary)] text-xs font-semibold">{animal.grazingType}</div>
                </div>
                
                <div className="h-28 w-full bg-[var(--bg-content)] dark:bg-jade-800 mb-4 rounded-sm overflow-hidden border border-[var(--border-card)] relative group">
                    <img 
                      src={animal.imageUrl} 
                      className="w-full h-full object-cover" 
                      alt={`${animal.name} photo`}
                      onError={(e) => { e.currentTarget.src = getLivestockImage(animal.species); }}
                    />
                   {animal.notes && (
                     <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4 text-center">
                       <p className="text-white text-xs font-medium italic">"{animal.notes}"</p>
                     </div>
                   )}
                </div>

                  <div className="flex gap-2 border-t border-[var(--border-card)] pt-3">
                    <button onClick={() => openRecordsModal(animal.id)} className="flex-1 py-2 text-xs font-semibold bg-[var(--bg-content)] dark:bg-jade-800 hover:bg-terra-300 dark:hover:bg-jade-700 text-[var(--text-primary)] dark:text-[var(--text-primary)] rounded transition-colors border border-[var(--border-card)] dark:border-jade-600 focus:outline-none focus:ring-2 focus:ring-jade-400">Records</button>
                    <button onClick={() => openEditModal(animal)} aria-label={`Edit ${animal.name}`} className="px-3 py-2 text-[var(--text-secondary)] dark:text-[var(--text-tertiary)] hover:text-jade-600 dark:hover:text-jade-400 rounded hover:bg-jade-50 dark:hover:bg-jade-900/20 transition-colors border border-[var(--border-card)] focus:outline-none focus:ring-2 focus:ring-jade-500"><Pencil className="w-4 h-4" aria-hidden="true" /></button>
                     <button onClick={() => { if (window.confirm(`Delete "${animal.name}"? This cannot be undone.`)) deleteLivestock(animal.id); }} aria-label="Delete livestock entry" className="px-3 py-2 text-[var(--text-secondary)] dark:text-[var(--text-tertiary)] hover:text-red-600 dark:hover:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-[var(--border-card)] focus:outline-none focus:ring-2 focus:ring-red-500"><Trash2 className="w-4 h-4" aria-hidden="true" /></button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Records Modal */}
      {isRecordsModalOpen && (
        <div className="fixed inset-0 z-full-modal flex items-center justify-center p-4 bg-jade-950/80 backdrop-blur-md" role="dialog" aria-modal="true">
          <div className="bg-[var(--bg-card)] dark:bg-jade-950 w-full max-w-lg shadow-2xl rounded-md border border-jade-600 max-h-[85vh] flex flex-col">
            <div className="bg-jade-950 p-5 flex justify-between items-center border-b-4 border-sunburst-500 shrink-0">
              <h3 className="text-xl font-bold text-white font-semibold flex items-center">
                 <ClipboardList className="w-5 h-5 mr-2 text-sunburst-500" /> Herd Records
              </h3>
              <button onClick={() => setIsRecordsModalOpen(false)} aria-label="Close" className="text-[var(--text-tertiary)] hover:text-white"><X className="w-6 h-6" aria-hidden="true" /></button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
               {/* Add New Record Form */}
                <form onSubmit={handleLogSubmit} className="mb-6 p-4 bg-[var(--bg-content)] dark:bg-jade-800 rounded border border-[var(--border-card)]">
                   <h4 className="text-xs font-semibold text-[var(--text-primary)] dark:text-[var(--text-secondary)] mb-3">Add Entry</h4>
                  <div className="space-y-3">
                      <select value={newLog.type} onChange={e => setNewLog({...newLog, type: e.target.value as any})} className="w-full p-2 bg-[var(--bg-card)] dark:bg-jade-950 border border-[var(--border-card)] dark:border-jade-600 rounded font-bold text-sm text-[var(--text-primary)] focus:outline-none focus:border-jade-500">
                         <option value="Observation">General Observation</option>
                         <option value="Action">Vet Visit / Treatment</option>
                         <option value="Input">Feeding</option>
                      </select>
                      <input type="text" value={newLog.note} onChange={e => setNewLog({...newLog, note: e.target.value})} className="w-full p-2 bg-[var(--bg-card)] dark:bg-jade-950 border border-[var(--border-card)] dark:border-jade-600 rounded text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-secondary)] dark:placeholder-[var(--text-tertiary)] focus:outline-none focus:border-jade-500" placeholder="Details..." required />
                      <button type="submit" className="w-full bg-jade-800 dark:bg-jade-700 text-white py-2 text-xs font-semibold rounded hover:bg-jade-900 dark:hover:bg-jade-600">Save Record</button>
                  </div>
               </form>

               {/* History List */}
               <div className="space-y-3">
                   <h4 className="text-xs font-semibold text-[var(--text-primary)] dark:text-[var(--text-tertiary)] mb-2">History</h4>
                  {animalLogs.length === 0 ? (
                    <p className="text-sm text-[var(--text-secondary)] italic">No records found.</p>
                  ) : (
                    animalLogs.map((log, idx) => (
                       <div key={log.id} className="border-l-2 border-[var(--border-card)] pl-3 pb-3">
                          <div className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-tertiary)] font-semibold mb-1 flex items-center">
                             <Calendar className="w-3 h-3 mr-1" /> {new Date(log.date).toLocaleDateString()}
                             <span className="ml-2 px-1.5 py-0.5 bg-[var(--bg-content)] dark:bg-jade-800 text-[var(--text-primary)] dark:text-[var(--text-primary)] rounded-sm">{log.type}</span>
                          </div>
                          <p className="text-sm text-[var(--text-primary)] dark:text-[var(--text-secondary)] font-medium">{log.note}</p>
                      </div>
                    ))
                  )}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Livestock Modal (Standard Form) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-full-modal flex items-center justify-center p-4 bg-jade-950/80 backdrop-blur-md" role="dialog" aria-modal="true">
          <div className="bg-[var(--bg-card)] dark:bg-jade-950 w-full max-w-lg shadow-2xl rounded-md border border-jade-600 max-h-[90vh] overflow-y-auto">
             <div className="bg-jade-950 p-5 flex justify-between items-center border-b-4 border-sunburst-500 sticky top-0 z-10">
                 <h3 className="text-xl font-bold text-white font-semibold flex items-center"><Beef className="w-5 h-5 mr-2 text-sunburst-500" /> {editingAnimal ? 'Edit Herd Entry' : 'New Herd Entry'}</h3>
                <button onClick={closeModal} aria-label="Close" className="text-[var(--text-tertiary)] hover:text-white"><X className="w-6 h-6" aria-hidden="true" /></button>
             </div>
             <div className="p-6">
                <form onSubmit={handleAddSubmit} className="space-y-4">
                   
                   {/* Image Upload Area */}
                     <div className="flex gap-4 items-start bg-[var(--bg-content)] dark:bg-jade-800 p-3 rounded border border-[var(--border-card)]">
                      <ImageUpload
                        value={newAnimal.imageUrl || ''}
                        onChange={(url) => setNewAnimal({...newAnimal, imageUrl: url || getLivestockImage(newAnimal.species)})}
                        label="Upload livestock image"
                        placeholder="Livestock photo"
                        size="md"
                      />
                     <div className="flex-1">
                       <p className="text-[10px] text-[var(--text-secondary)] dark:text-[var(--text-tertiary)] font-medium">Upload a photo of your livestock, or leave empty to use the default image for {newAnimal.species || 'this species'}.</p>
                       {newAnimal.imageUrl && !newAnimal.imageUrl.startsWith('data:') && (
                         <button
                           type="button"
                           onClick={() => setNewAnimal({...newAnimal, imageUrl: getLivestockImage(newAnimal.species)})}
                           className="mt-2 text-[10px] text-jade-600 hover:text-jade-700 font-semibold"
                         >
                           Reset to default
                         </button>
                       )}
                     </div>
                   </div>

                   <div><label className="block text-xs font-semibold text-[var(--text-primary)] dark:text-[var(--text-secondary)] mb-1">Herd ID / Name</label><input autoFocus type="text" value={newAnimal.name} onChange={e => setNewAnimal({...newAnimal, name: e.target.value})} className="w-full px-4 py-3 border-2 border-[var(--border-card)] dark:border-jade-600 rounded-sm font-bold text-[var(--text-primary)] placeholder-[var(--text-secondary)] dark:placeholder-[var(--text-tertiary)] bg-[var(--bg-card)] dark:bg-jade-950 focus:outline-none focus:border-jade-500" placeholder="e.g. Black Angus Herd #4" required /></div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-xs font-semibold text-[var(--text-primary)] dark:text-[var(--text-secondary)] mb-1">Species</label>
                         <select value={newAnimal.species} onChange={e => handleSpeciesChange(e.target.value)} className="w-full px-4 py-3 border-2 border-[var(--border-card)] dark:border-jade-600 rounded-sm font-bold text-[var(--text-primary)] bg-[var(--bg-card)] dark:bg-jade-950 focus:outline-none focus:border-jade-500">
                          <option value="Cattle">Cattle</option>
                          <option value="Goat">Goat</option>
                          <option value="Sheep">Sheep</option>
                          <option value="Chicken">Chicken</option><option value="Pig">Pig</option>
                        </select>
                      </div>
                       <div><label className="block text-xs font-semibold text-[var(--text-primary)] dark:text-[var(--text-secondary)] mb-1">Count</label><input type="number" min="1" value={newAnimal.count} onChange={e => setNewAnimal({...newAnimal, count: Number(e.target.value)})} className="w-full px-4 py-3 border-2 border-[var(--border-card)] dark:border-jade-600 rounded-sm font-bold text-[var(--text-primary)] placeholder-[var(--text-secondary)] dark:placeholder-[var(--text-tertiary)] bg-[var(--bg-card)] dark:bg-jade-950 focus:outline-none focus:border-jade-500" placeholder="e.g. 12" required /></div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                       <div><label className="block text-xs font-semibold text-[var(--text-primary)] dark:text-[var(--text-secondary)] mb-1">Status</label><select value={newAnimal.status} onChange={e => setNewAnimal({...newAnimal, status: e.target.value as any})} className="w-full px-4 py-3 border-2 border-[var(--border-card)] dark:border-jade-600 rounded-sm font-bold text-[var(--text-primary)] bg-[var(--bg-card)] dark:bg-jade-950 focus:outline-none focus:border-jade-500"><option value="Healthy">Healthy</option><option value="Sick">Sick</option><option value="Quarantined">Quarantined</option><option value="Lactating">Lactating</option></select></div>
                       <div><label className="block text-xs font-semibold text-[var(--text-primary)] dark:text-[var(--text-secondary)] mb-1">Grazing</label><select value={newAnimal.grazingType} onChange={e => setNewAnimal({...newAnimal, grazingType: e.target.value as any})} className="w-full px-4 py-3 border-2 border-[var(--border-card)] dark:border-jade-600 rounded-sm font-bold text-[var(--text-primary)] bg-[var(--bg-card)] dark:bg-jade-950 focus:outline-none focus:border-jade-500"><option value="Rotational">Rotational</option><option value="Free Range">Free Range</option><option value="Feedlot">Feedlot</option></select></div>
                   </div>
                   
                   <div>
                       <label className="block text-xs font-semibold text-[var(--text-primary)] dark:text-[var(--text-secondary)] mb-1">Notes</label>
                       <textarea 
                         value={newAnimal.notes} 
                         onChange={e => setNewAnimal({...newAnimal, notes: e.target.value})} 
                         className="w-full px-4 py-3 border-2 border-[var(--border-card)] dark:border-jade-600 rounded-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-secondary)] dark:placeholder-[var(--text-tertiary)] bg-[var(--bg-card)] dark:bg-jade-950 focus:outline-none focus:border-jade-500"
                        rows={2} 
                        placeholder="Location, breed details, or health history..."
                      />
                   </div>

                     <button type="submit" className="w-full bg-sunburst-500 text-jade-950 py-4 font-semibold hover:bg-sunburst-400 rounded-sm shadow-md">{editingAnimal ? 'Save Changes' : 'Confirm Entry'}</button>
                </form>
             </div>
          </div>
        </div>
      )}

      {/* AI Health Scanner Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-full-modal flex items-center justify-center p-4 bg-jade-950/90 backdrop-blur-md" role="dialog" aria-modal="true">
           <div className="bg-[var(--bg-content)] dark:bg-jade-950 w-full max-w-2xl shadow-2xl rounded-md flex flex-col max-h-[90vh] border border-jade-600">
               <div className="bg-jade-950 p-5 flex justify-between items-center border-b-4 border-red-600 shrink-0">
                  <h3 className="text-xl font-bold text-white font-semibold flex items-center"><Stethoscope className="w-5 h-5 mr-2 text-red-500" /> Animal Health Check{!isAIConfigured() && <span className="ml-2 px-1.5 py-0.5 bg-white/20 text-white text-[9px] font-bold rounded uppercase tracking-wide">Demo</span>}</h3>
                <button onClick={resetScanner} aria-label="Close" className="text-[var(--text-tertiary)] hover:text-white"><X className="w-6 h-6" aria-hidden="true" /></button>
              </div>
              <div className="p-6 overflow-y-auto">
                 {!scanResult ? (
                   <div className="space-y-6">
                       <div onClick={() => scanInputRef.current?.click()} className={`border-4 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer ${scanImage ? 'border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-jade-500 dark:border-jade-600 bg-[var(--bg-card)] dark:bg-jade-800'}`}>
                          <input type="file" accept="image/*" className="hidden" ref={scanInputRef} onChange={handleScanUpload} />
                          {scanImage ? <img src={scanImage} className="max-h-48 object-contain" /> : <><Upload className="w-12 h-12 text-[var(--text-secondary)] mb-4" /><p className="text-[var(--text-primary)] dark:text-[var(--text-primary)] font-semibold">Tap to Upload Photo</p></>}
                      </div>
                      <textarea value={scanContext} onChange={e => setScanContext(e.target.value)} className="w-full p-3 border-2 border-[var(--border-card)] dark:border-jade-600 rounded font-medium text-[var(--text-primary)] placeholder-[var(--text-secondary)] dark:placeholder-[var(--text-tertiary)] bg-[var(--bg-card)] dark:bg-jade-800 focus:outline-none focus:border-red-500" placeholder="Add specific observation notes (e.g., lethargy, spots, limping)..." rows={3} />
                      <button onClick={performScan} disabled={!scanImage || isScanning} className="w-full py-4 bg-red-600 text-white font-semibold hover:bg-red-700 rounded-sm shadow-md flex items-center justify-center">
                        {isScanning ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : 'Run Analysis'}
                      </button>
                   </div>
                 ) : (
                    <div className="space-y-4">
                        <div className="bg-[var(--bg-card)] dark:bg-jade-800 border-l-4 border-red-600 p-6 shadow-sm">
                          {isScanSimulated && <span className="inline-block mb-2 px-1.5 py-0.5 bg-terra-200 dark:bg-terra-800 text-terra-700 dark:text-terra-300 text-[9px] font-bold rounded uppercase tracking-wide">Simulated Result</span>}
                          <p className="whitespace-pre-wrap font-medium text-[var(--text-primary)]">{scanResult}</p>
                        </div>
                        <button onClick={() => { setScanResult(''); setIsScanSimulated(false); }} className="w-full py-3 bg-jade-800 text-white font-semibold rounded-sm">New Scan</button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LivestockManager;

import React, { useState } from 'react';
import { useFarm } from '../contexts/FarmContext';
import { Save, User, Download, Upload, AlertTriangle, Moon, Sun, Trash2, Shield, MapPin } from 'lucide-react';
import { DB_KEYS } from '../services/persistence';

const Settings: React.FC = () => {
  const { userProfile, updateUserProfile, theme, toggleTheme, resetApp, showToast } = useFarm();
  
  const [formData, setFormData] = useState({
    name: userProfile.name,
    farmName: userProfile.farmName,
    bio: userProfile.bio,
    avatar: userProfile.avatar,
    role: userProfile.role
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateUserProfile(formData);
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleExportData = () => {
    const data: Record<string, any> = {};
    Object.values(DB_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          data[key] = JSON.parse(item);
        } catch {
          data[key] = item;
        }
      }
    });
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agriflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Backup download started', 'success');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        Object.keys(data).forEach(key => {
          if (Object.values(DB_KEYS).includes(key)) {
            localStorage.setItem(key, JSON.stringify(data[key]));
          }
        });
        showToast('Data imported successfully. Reloading...', 'success');
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        showToast('Failed to parse backup file', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10 animate-fade-in">
      <div className="pb-4 mb-8 border-b border-[var(--border-card)]">
        <h2 className="text-3xl font-semibold text-[var(--text-primary)] font-heading">Settings</h2>
        <p className="text-[var(--text-secondary)] font-semibold text-xs mt-1">Configuration & Data Management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PROFILE CARD */}
        <div className="card-surface p-6">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-card)]">
              <User className="w-6 h-6 text-field-600 dark:text-field-400" />
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Profile Settings</h3>
           </div>
           
           <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                 <img src={formData.avatar} alt="Avatar Preview" className="w-16 h-16 rounded-full border-4 border-soil-200 dark:border-field-700 object-cover" />
                 <div className="flex-1">
                    <label className="block text-xs font-semibold text-[var(--text-tertiary)] mb-1">Avatar URL</label>
                    <input 
                      type="text" 
                      value={formData.avatar} 
                      onChange={e => setFormData({...formData, avatar: e.target.value})}
                      className="w-full p-2 bg-[var(--bg-content)] border border-[var(--border-card)] rounded-lg text-sm font-medium focus:outline-none focus:border-field-500 text-[var(--text-primary)]"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-semibold text-[var(--text-tertiary)] mb-1">Display Name</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full p-2 bg-[var(--bg-content)] border border-[var(--border-card)] rounded-lg text-sm font-bold focus:outline-none focus:border-field-500 text-[var(--text-primary)]"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-semibold text-[var(--text-tertiary)] mb-1">Role Title</label>
                    <input 
                      type="text" 
                      value={formData.role} 
                      onChange={e => setFormData({...formData, role: e.target.value})}
                      className="w-full p-2 bg-[var(--bg-content)] border border-[var(--border-card)] rounded-lg text-sm font-medium focus:outline-none focus:border-field-500 text-[var(--text-primary)]"
                    />
                 </div>
              </div>

              <div>
                 <label className="block text-xs font-semibold text-[var(--text-tertiary)] mb-1">Farm Name</label>
                 <input 
                   type="text" 
                   value={formData.farmName} 
                   onChange={e => setFormData({...formData, farmName: e.target.value})}
                   className="w-full p-2 bg-[var(--bg-content)] border border-[var(--border-card)] rounded-lg text-sm font-bold focus:outline-none focus:border-field-500 text-[var(--text-primary)]"
                 />
              </div>

              <div>
                 <label className="block text-xs font-semibold text-[var(--text-tertiary)] mb-1">Bio</label>
                 <textarea 
                   value={formData.bio} 
                   onChange={e => setFormData({...formData, bio: e.target.value})}
                   rows={3}
                   className="w-full p-2 bg-[var(--bg-content)] border border-[var(--border-card)] rounded-lg text-sm font-medium focus:outline-none focus:border-field-500 resize-none text-[var(--text-primary)]"
                 />
              </div>

              <button 
                type="submit" 
                disabled={isSaving}
                className="w-full py-3 bg-field-800 dark:bg-harvest-500 hover:bg-field-700 dark:hover:bg-harvest-400 text-white dark:text-field-950 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Update Profile</>}
              </button>
           </form>
        </div>

        {/* PREFERENCES & DATA */}
        <div className="space-y-8">
           {/* Appearance */}
           <div className="card-surface p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                 <Sun className="w-5 h-5 text-harvest-500" /> Interface
              </h3>
              <div className="flex items-center justify-between p-4 bg-[var(--bg-content)] rounded-lg border border-[var(--border-card)]">
                 <div>
                    <span className="block font-bold text-[var(--text-primary)] text-sm">Theme Mode</span>
                    <span className="text-xs text-[var(--text-tertiary)]">Toggle between light and dark interface</span>
                 </div>
                 <button 
                   onClick={toggleTheme}
                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${theme === 'dark' ? 'bg-field-600' : 'bg-soil-300'}`}
                 >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                 </button>
              </div>
           </div>

           {/* Data Management */}
           <div className="card-surface p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                 <Shield className="w-5 h-5 text-field-500" /> Data Center
              </h3>
              
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <button onClick={handleExportData} className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-soil-300 dark:border-field-700 rounded-lg hover:bg-soil-50 dark:hover:bg-field-900/50 transition-colors group">
                       <Download className="w-6 h-6 text-[var(--text-tertiary)] group-hover:text-field-500 mb-2" />
                       <span className="text-xs font-semibold text-[var(--text-secondary)]">Backup Data</span>
                    </button>
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-soil-300 dark:border-field-700 rounded-lg hover:bg-soil-50 dark:hover:bg-field-900/50 transition-colors group cursor-pointer">
                       <Upload className="w-6 h-6 text-[var(--text-tertiary)] group-hover:text-harvest-500 mb-2" />
                       <span className="text-xs font-semibold text-[var(--text-secondary)]">Import Data</span>
                       <input type="file" accept=".json" className="hidden" onChange={handleImportData} />
                    </label>
                 </div>

                 <div className="organic-divider !my-0"></div>

                 <div className="pt-4">
                    <h4 className="text-xs font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-1">
                       <AlertTriangle className="w-4 h-4" /> Danger Zone
                    </h4>
                    <p className="text-xs text-[var(--text-tertiary)] mb-3">Irreversibly wipe all local data and return to factory settings.</p>
                    <button 
                      onClick={() => { if(confirm('Are you sure? All farm data will be lost.')) resetApp() }}
                      className="w-full py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg font-semibold text-xs hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2"
                    >
                       <Trash2 className="w-4 h-4" /> Factory Reset
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

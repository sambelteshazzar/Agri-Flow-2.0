
import React, { useState, useMemo } from 'react';
import { X, User, Loader2, Sprout, ChevronRight, Globe, MapPin, Tractor, Wheat, Beef, Fish, Flower2, Check, Search } from 'lucide-react';
import { COUNTRY_LIST, COUNTRY_REGISTRY } from '../constants';
import { CountryConfig, FarmType, AreaUnit, ClimateZone } from '../types';

export interface OnboardingData {
  name: string;
  farmName: string;
  countryCode: string;
  farmType: FarmType;
  farmSize: number;
  areaUnit: AreaUnit;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (data: OnboardingData) => Promise<void>;
}

const FARM_TYPE_OPTIONS: { value: FarmType; label: string; icon: React.ElementType; desc: string }[] = [
  { value: 'crop', label: 'Crops', icon: Wheat, desc: 'Grains, vegetables, cash crops' },
  { value: 'livestock', label: 'Livestock', icon: Beef, desc: 'Cattle, goats, poultry' },
  { value: 'mixed', label: 'Mixed', icon: Sprout, desc: 'Both crops and livestock' },
  { value: 'aquaculture', label: 'Aquaculture', icon: Fish, desc: 'Fish, shrimp, shellfish' },
  { value: 'horticulture', label: 'Horticulture', icon: Flower2, desc: 'Fruits, flowers, nurseries' },
];

const STEPS = [
  { num: 1, label: 'Profile' },
  { num: 2, label: 'Country' },
  { num: 3, label: 'Farm' },
  { num: 4, label: 'Confirm' },
];

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig | null>(null);
  const [farmType, setFarmType] = useState<FarmType>('mixed');
  const [farmSize, setFarmSize] = useState(5);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const filteredCountries = useMemo(() => {
    const q = countrySearch.toLowerCase();
    if (!q) return COUNTRY_LIST;
    return COUNTRY_LIST.filter(c =>
      c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [countrySearch]);

  const areaUnit: AreaUnit = selectedCountry?.areaUnit ?? 'ha';

  const canNext = () => {
    if (step === 1) return name.trim().length >= 2;
    if (step === 2) return selectedCountry !== null;
    if (step === 3) return farmSize > 0;
    return true;
  };

  const handleNext = () => {
    if (step < 4 && canNext()) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!selectedCountry) return;
    setIsAuthenticating(true);
    await onLogin({
      name: name.trim(),
      farmName: farmName.trim() || `${name.trim()}'s Farm`,
      countryCode: selectedCountry.code,
      farmType,
      farmSize,
      areaUnit,
    });
    setIsAuthenticating(false);
  };

  if (!isOpen) return null;

  const selectedCrops = selectedCountry ? selectedCountry.defaultCrops.slice(0, 4) : [];

   const inputClasses = "w-full pl-12 pr-4 py-4 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl font-medium text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2 transition-all placeholder:text-[var(--text-tertiary)]";

  return (
       <div className="fixed inset-0 z-[100] flex items-center justify-center bg-crimson-950/90 backdrop-blur-lg animate-fade-in">
       <div className="w-full max-w-2xl mx-4 rounded-3xl shadow-2xl overflow-hidden border border-[var(--border-card)] animate-fade-in-up bg-[var(--bg-card)] flex flex-col max-h-[90vh] card-surface">

        <div className="relative px-8 pt-8 pb-4">
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--bg-crimson-50)_0%_,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(30,58,40,0.3)_0%_,transparent_70%)]"></div>
          </div>
           <div className="flex flex-col items-center text-center py-6">
             <div className="flex items-center gap-2 mb-4">
               <div className="w-12 h-12 bg-gradient-to-br from-crimson-500 to-sunburst-500 rounded-xl flex items-center justify-center shadow-lg shadow-crimson-500/20">
                 <Sprout className="w-6 h-6 text-white" />
               </div>
               <div className="flex flex-col">
                 <span className="text-[var(--text-primary)] text-base font-heading font-bold">AgriFlow</span>
                 <span className="text-[var(--text-tertiary)] text-sm font-medium">Your farming intelligence platform</span>
               </div>
             </div>
             <h2 className="text-3xl md:text-4xl font-heading font-bold text-[var(--text-primary)] mt-4">
               {step === 1 && 'Set up your profile'}
               {step === 2 && 'Where is your farm?'}
               {step === 3 && 'Tell us about your farm'}
               {step === 4 && 'All set!'}
             </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-2 font-medium max-w-xl">
                {step === 1 && "We'll personalize AgriFlow to your needs."}
                {step === 2 && "We'll tailor crops, markets, and insights for your region."}
                {step === 3 && "A few details so we can set up your dashboard."}
                {step === 4 && "Here's a summary of your setup."}
              </p>
           </div>
        </div>

        <div className="px-8 pt-2 pb-4">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-crimson-600 text-white shadow-md shadow-crimson-500/25'
                    : step > s.num
                    ? 'bg-crimson-50 dark:bg-crimson-900/40 text-crimson-700 dark:text-crimson-400'
                    : 'bg-[var(--bg-content)] text-[var(--text-tertiary)]'
                }`}>
                  {step > s.num ? <Check className="w-3 h-3" /> : <span>{s.num}</span>}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded-full transition-all ${
                    step > s.num ? 'bg-crimson-400' : 'bg-[var(--border-card)]'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex-1 px-8 pb-6 overflow-y-auto">

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Your full name</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-crimson-500 transition-colors" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className={inputClasses}
                    placeholder="Adewale Okonkwo"
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Farm name <span className="text-[var(--text-tertiary)] font-normal">(optional)</span></label>
                <div className="relative group">
                  <Tractor className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-crimson-500 transition-colors" />
                  <input
                    type="text"
                    value={farmName}
                    onChange={e => setFarmName(e.target.value)}
                    className={inputClasses}
                    placeholder="Greenfield Farm"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-crimson-500 transition-colors" />
                <input
                  type="text"
                  value={countrySearch}
                  onChange={e => setCountrySearch(e.target.value)}
                  className={inputClasses}
                  placeholder="Search countries..."
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                {filteredCountries.map(country => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => setSelectedCountry(country)}
                     className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                       selectedCountry?.code === country.code
                         ? 'border-crimson-500 bg-crimson-50 dark:bg-crimson-900/20 shadow-md shadow-crimson-500/10'
                         : 'border-[var(--border-card)] hover:border-crimson-300 dark:hover:border-crimson-700 bg-[var(--bg-content)]'
                     }`}
                  >
                    <span className="text-2xl leading-none">{country.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--text-primary)] truncate">{country.name}</p>
                      <p className="text-[11px] text-[var(--text-tertiary)] font-medium">{country.region} · {country.climateZone.replace('_', ' ')}</p>
                    </div>
                    {selectedCountry?.code === country.code && (
                      <Check className="w-5 h-5 text-crimson-500 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && selectedCountry && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-3">Farm type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {FARM_TYPE_OPTIONS.map(({ value, label, icon: Icon, desc }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFarmType(value)}
                       className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all ${
                         farmType === value
                           ? 'border-crimson-500 bg-crimson-50 dark:bg-crimson-900/20 shadow-md shadow-crimson-500/10'
                           : 'border-[var(--border-card)] hover:border-crimson-300 dark:hover:border-crimson-700 bg-[var(--bg-content)]'
                       }`}
                    >
                      <Icon className={`w-5 h-5 ${farmType === value ? 'text-crimson-500' : 'text-[var(--text-tertiary)]'}`} />
                      <span className={`text-xs font-bold ${farmType === value ? 'text-crimson-700 dark:text-crimson-400' : 'text-[var(--text-primary)]'}`}>{label}</span>
                      <span className="text-[10px] text-[var(--text-tertiary)] text-center leading-tight">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Farm size ({areaUnit})</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={1}
                    max={areaUnit === 'acres' ? 5000 : 2000}
                    step={areaUnit === 'acres' ? 10 : 5}
                    value={farmSize}
                    onChange={e => setFarmSize(Number(e.target.value))}
                    className="flex-1 accent-crimson-500"
                  />
                  <div className="w-24 text-right">
                    <span className="text-lg font-heading font-bold text-[var(--text-primary)] font-mono">{farmSize.toLocaleString()}</span>
                    <span className="text-xs text-[var(--text-tertiary)] font-medium ml-1">{areaUnit}</span>
                  </div>
                </div>
              </div>
              <div className="bg-crimson-50 dark:bg-crimson-900/20 rounded-xl p-4 border border-crimson-200 dark:border-crimson-800">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-crimson-600 dark:text-crimson-400" />
                  <span className="text-xs font-bold text-crimson-700 dark:text-crimson-400">Region defaults</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {selectedCountry.flag} <span className="font-semibold">{selectedCountry.name}</span> ·
                  Climate: <span className="font-medium">{selectedCountry.climateZone.replace('_', ' ')}</span> ·
                  Currency: <span className="font-medium">{selectedCountry.currencySymbol} ({selectedCountry.currencyCode})</span>
                </p>
              </div>
            </div>
          )}

          {step === 4 && selectedCountry && (
            <div className="space-y-4">
              <div className="card-surface p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-tertiary)] font-semibold">Name</span>
                  <span className="text-sm text-[var(--text-primary)] font-bold">{name}</span>
                </div>
                <div className="organic-divider" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-tertiary)] font-semibold">Farm</span>
                  <span className="text-sm text-[var(--text-primary)] font-bold">{farmName || `${name}'s Farm`}</span>
                </div>
                <div className="organic-divider" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-tertiary)] font-semibold">Country</span>
                  <span className="text-sm text-[var(--text-primary)] font-bold">{selectedCountry.flag} {selectedCountry.name}</span>
                </div>
                <div className="organic-divider" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-tertiary)] font-semibold">Farm type</span>
                  <span className="text-sm text-[var(--text-primary)] font-bold capitalize">{farmType}</span>
                </div>
                <div className="organic-divider" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-tertiary)] font-semibold">Farm size</span>
                  <span className="text-sm text-[var(--text-primary)] font-bold font-mono">{farmSize.toLocaleString()} {areaUnit}</span>
                </div>
              </div>

              {selectedCrops.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">Your starter crops</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCrops.map(crop => (
                      <span key={crop.id} className="px-3 py-1.5 bg-crimson-50 dark:bg-crimson-900/20 text-crimson-700 dark:text-crimson-400 rounded-full text-xs font-bold border border-crimson-200 dark:border-crimson-800">
                        {crop.name}
                      </span>
                    ))}
                    {selectedCountry.defaultCrops.length > 4 && (
                      <span className="px-3 py-1.5 bg-[var(--bg-content)] text-[var(--text-tertiary)] rounded-full text-xs font-medium">
                        +{selectedCountry.defaultCrops.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-sunburst-50 dark:bg-sunburst-900/10 rounded-xl p-4 border border-sunburst-200 dark:border-sunburst-800/50">
                <p className="text-xs text-sunburst-700 dark:text-sunburst-400 font-medium">
                  AgriFlow will configure your dashboard with {selectedCountry.name}-specific crops, livestock, market prices, weather, and community data.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-8 pb-6 pt-3 border-t border-[var(--border-card)] flex items-center justify-between">
          {step > 1 ? (
             <button
               type="button"
               onClick={handleBack}
               className="px-5 py-4 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
             >
               Back
             </button>
          ) : (
            <div />
          )}

           {step < 4 ? (
             <button
               type="button"
               onClick={handleNext}
               disabled={!canNext()}
               className="px-8 py-4 bg-crimson-800 dark:bg-sunburst-500 hover:bg-crimson-700 dark:hover:bg-sunburst-400 text-white dark:text-crimson-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-crimson-500/15 dark:shadow-sunburst-500/15 hover:shadow-crimson-500/25 dark:hover:shadow-sunburst-500/25 flex items-center gap-2 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
             >
               Continue
               <ChevronRight className="w-4 h-4" />
             </button>
           ) : (
             <button
               type="button"
               onClick={handleSubmit}
               disabled={isAuthenticating}
               className="px-10 py-4 bg-crimson-800 dark:bg-sunburst-500 hover:bg-crimson-700 dark:hover:bg-sunburst-400 text-white dark:text-crimson-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-crimson-500/15 dark:shadow-sunburst-500/15 hover:shadow-crimson-500/25 dark:hover:shadow-sunburst-500/25 flex items-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {isAuthenticating ? (
                 <Loader2 className="w-5 h-5 animate-spin" />
               ) : (
                 <Sprout className="w-5 h-5" />
               )}
               {isAuthenticating ? 'Setting up...' : 'Launch AgriFlow'}
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;


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

  const inputClasses = "w-full pl-11 pr-4 py-3.5 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl font-medium text-[var(--text-primary)] focus:outline-none focus:border-field-500 dark:focus:border-field-400 focus:ring-4 focus:ring-field-500/10 transition-all placeholder:text-[var(--text-tertiary)]";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-field-950/90 backdrop-blur-lg animate-fade-in">
      <div className="w-full max-w-2xl mx-4 rounded-3xl shadow-2xl overflow-hidden border border-[var(--border-card)] animate-fade-in-up bg-[var(--bg-card)] flex flex-col max-h-[90vh]">

        <div className="flex justify-between items-start px-8 pt-8 pb-2 bg-gradient-to-b from-field-950/5 to-transparent dark:from-field-950/30 dark:to-transparent">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-gradient-to-br from-field-500 to-harvest-500 rounded-lg flex items-center justify-center shadow-lg shadow-field-500/20">
                <Sprout className="w-4 h-4 text-white" />
              </div>
              <span className="text-[var(--text-primary)] text-sm font-heading font-bold">AgriFlow</span>
            </div>
            <h2 className="text-2xl font-heading font-bold text-[var(--text-primary)] mt-3">
              {step === 1 && 'Set up your profile'}
              {step === 2 && 'Where is your farm?'}
              {step === 3 && 'Tell us about your farm'}
              {step === 4 && 'All set!'}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1 font-medium">
              {step === 1 && 'We\'ll personalize AgriFlow to your needs.'}
              {step === 2 && 'We\'ll tailor crops, markets, and insights for your region.'}
              {step === 3 && 'A few details so we can set up your dashboard.'}
              {step === 4 && 'Here\'s a summary of your setup.'}
            </p>
          </div>
          <button onClick={onClose} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors p-1 -mr-1 -mt-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-8 pt-2 pb-4">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-field-600 text-white shadow-md shadow-field-500/25'
                    : step > s.num
                    ? 'bg-field-50 dark:bg-field-900/40 text-field-700 dark:text-field-400'
                    : 'bg-[var(--bg-content)] text-[var(--text-tertiary)]'
                }`}>
                  {step > s.num ? <Check className="w-3 h-3" /> : <span>{s.num}</span>}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded-full transition-all ${
                    step > s.num ? 'bg-field-400' : 'bg-[var(--border-card)]'
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
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-field-500 transition-colors" />
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
                  <Tractor className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-field-500 transition-colors" />
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
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-field-500 transition-colors" />
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
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                      selectedCountry?.code === country.code
                        ? 'border-field-500 bg-field-50 dark:bg-field-900/20 shadow-md shadow-field-500/10'
                        : 'border-[var(--border-card)] hover:border-field-300 dark:hover:border-field-700 bg-[var(--bg-content)]'
                    }`}
                  >
                    <span className="text-2xl leading-none">{country.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--text-primary)] truncate">{country.name}</p>
                      <p className="text-[11px] text-[var(--text-tertiary)] font-medium">{country.region} · {country.climateZone.replace('_', ' ')}</p>
                    </div>
                    {selectedCountry?.code === country.code && (
                      <Check className="w-5 h-5 text-field-500 flex-shrink-0" />
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
                      className={`flex flex-col items-center gap-1.5 p-3.5 rounded-xl border-2 transition-all ${
                        farmType === value
                          ? 'border-field-500 bg-field-50 dark:bg-field-900/20 shadow-md shadow-field-500/10'
                          : 'border-[var(--border-card)] hover:border-field-300 dark:hover:border-field-700 bg-[var(--bg-content)]'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${farmType === value ? 'text-field-500' : 'text-[var(--text-tertiary)]'}`} />
                      <span className={`text-xs font-bold ${farmType === value ? 'text-field-700 dark:text-field-400' : 'text-[var(--text-primary)]'}`}>{label}</span>
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
                    className="flex-1 accent-field-500"
                  />
                  <div className="w-24 text-right">
                    <span className="text-lg font-heading font-bold text-[var(--text-primary)] font-mono">{farmSize.toLocaleString()}</span>
                    <span className="text-xs text-[var(--text-tertiary)] font-medium ml-1">{areaUnit}</span>
                  </div>
                </div>
              </div>
              <div className="bg-field-50 dark:bg-field-900/20 rounded-xl p-4 border border-field-200 dark:border-field-800">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-field-600 dark:text-field-400" />
                  <span className="text-xs font-bold text-field-700 dark:text-field-400">Region defaults</span>
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
                      <span key={crop.id} className="px-3 py-1.5 bg-field-50 dark:bg-field-900/20 text-field-700 dark:text-field-400 rounded-full text-xs font-bold border border-field-200 dark:border-field-800">
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

              <div className="bg-harvest-50 dark:bg-harvest-900/10 rounded-xl p-4 border border-harvest-200 dark:border-harvest-800/50">
                <p className="text-xs text-harvest-700 dark:text-harvest-400 font-medium">
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
              className="px-5 py-3 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
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
              className="px-6 py-3.5 bg-field-800 dark:bg-harvest-500 hover:bg-field-700 dark:hover:bg-harvest-400 text-white dark:text-field-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-field-500/15 dark:shadow-harvest-500/15 hover:shadow-field-500/25 dark:hover:shadow-harvest-500/25 flex items-center gap-2 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isAuthenticating}
              className="px-8 py-3.5 bg-field-800 dark:bg-harvest-500 hover:bg-field-700 dark:hover:bg-harvest-400 text-white dark:text-field-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-field-500/15 dark:shadow-harvest-500/15 hover:shadow-field-500/25 dark:hover:shadow-harvest-500/25 flex items-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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

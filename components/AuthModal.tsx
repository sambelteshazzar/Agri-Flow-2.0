
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-lg animate-fade-in">
      <div className="w-full max-w-2xl mx-4 rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 animate-fade-in-up bg-white dark:bg-slate-900 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-start px-8 pt-8 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/30">
                <Sprout className="w-4 h-4 text-white" />
              </div>
              <span className="text-white dark:text-white text-sm font-heading font-bold">AgriFlow</span>
            </div>
            <h2 className="text-2xl font-heading font-black text-slate-900 dark:text-white tracking-tight mt-3">
              {step === 1 && 'Set up your profile'}
              {step === 2 && 'Where is your farm?'}
              {step === 3 && 'Tell us about your farm'}
              {step === 4 && 'All set!'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {step === 1 && 'We\'ll personalize AgriFlow to your needs.'}
              {step === 2 && 'We\'ll tailor crops, markets, and insights for your region.'}
              {step === 3 && 'A few details so we can set up your dashboard.'}
              {step === 4 && 'Here\'s a summary of your setup.'}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-500 dark:hover:text-slate-200 transition-colors p-1 -mr-1 -mt-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-8 pt-2 pb-4">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-green-500 text-white shadow-md shadow-green-500/25'
                    : step > s.num
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                }`}>
                  {step > s.num ? <Check className="w-3 h-3" /> : <span>{s.num}</span>}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded-full transition-all ${
                    step > s.num ? 'bg-green-400' : 'bg-slate-200 dark:bg-slate-700'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-8 pb-6 overflow-y-auto">

          {/* Step 1: Name & Farm Name */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-2">Your full name</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-slate-400"
                    placeholder="Adewale Okonkwo"
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-2">Farm name <span className="text-slate-400 font-normal">(optional)</span></label>
                <div className="relative group">
                  <Tractor className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                  <input
                    type="text"
                    value={farmName}
                    onChange={e => setFarmName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-slate-400"
                    placeholder="Greenfield Farm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Country Picker */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                <input
                  type="text"
                  value={countrySearch}
                  onChange={e => setCountrySearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-slate-400"
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
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md shadow-green-500/10'
                        : 'border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-700 bg-slate-50 dark:bg-slate-800/50'
                    }`}
                  >
                    <span className="text-2xl leading-none">{country.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{country.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{country.region} · {country.climateZone.replace('_', ' ')}</p>
                    </div>
                    {selectedCountry?.code === country.code && (
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Farm Details */}
          {step === 3 && selectedCountry && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-3">Farm type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {FARM_TYPE_OPTIONS.map(({ value, label, icon: Icon, desc }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFarmType(value)}
                      className={`flex flex-col items-center gap-1.5 p-3.5 rounded-xl border-2 transition-all ${
                        farmType === value
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md shadow-green-500/10'
                          : 'border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-700 bg-slate-50 dark:bg-slate-800/50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${farmType === value ? 'text-green-500' : 'text-slate-400'}`} />
                      <span className={`text-xs font-bold ${farmType === value ? 'text-green-700 dark:text-green-400' : 'text-slate-700 dark:text-slate-300'}`}>{label}</span>
                      <span className="text-[10px] text-slate-400 text-center leading-tight">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-2">Farm size ({areaUnit})</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={1}
                    max={areaUnit === 'acres' ? 5000 : 2000}
                    step={areaUnit === 'acres' ? 10 : 5}
                    value={farmSize}
                    onChange={e => setFarmSize(Number(e.target.value))}
                    className="flex-1 accent-green-500"
                  />
                  <div className="w-24 text-right">
                    <span className="text-lg font-heading font-black text-slate-900 dark:text-white">{farmSize.toLocaleString()}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">{areaUnit}</span>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-bold text-green-700 dark:text-green-400">Region defaults</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedCountry.flag} <span className="font-semibold">{selectedCountry.name}</span> ·
                  Climate: <span className="font-medium">{selectedCountry.climateZone.replace('_', ' ')}</span> ·
                  Currency: <span className="font-medium">{selectedCountry.currencySymbol} ({selectedCountry.currencyCode})</span>
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && selectedCountry && (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Name</span>
                  <span className="text-sm text-slate-900 dark:text-white font-bold">{name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Farm</span>
                  <span className="text-sm text-slate-900 dark:text-white font-bold">{farmName || `${name}'s Farm`}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Country</span>
                  <span className="text-sm text-slate-900 dark:text-white font-bold">{selectedCountry.flag} {selectedCountry.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Farm type</span>
                  <span className="text-sm text-slate-900 dark:text-white font-bold capitalize">{farmType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Farm size</span>
                  <span className="text-sm text-slate-900 dark:text-white font-bold">{farmSize.toLocaleString()} {areaUnit}</span>
                </div>
              </div>

              {selectedCrops.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-400 mb-2">Your starter crops</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCrops.map(crop => (
                      <span key={crop.id} className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs font-bold border border-green-200 dark:border-green-800">
                        {crop.name}
                      </span>
                    ))}
                    {selectedCountry.defaultCrops.length > 4 && (
                      <span className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-xs font-medium">
                        +{selectedCountry.defaultCrops.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                <p className="text-xs text-yellow-800 dark:text-yellow-300 font-medium">
                  AgriFlow will configure your dashboard with {selectedCountry.name}-specific crops, livestock, market prices, weather, and community data.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="px-8 pb-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
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
              className="px-6 py-3.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 flex items-center gap-2 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isAuthenticating}
              className="px-8 py-3.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 flex items-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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

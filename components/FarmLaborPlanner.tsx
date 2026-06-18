
import React, { useState, useMemo } from 'react';
import { Users, Sprout, Tractor, Sun, CloudRain, Calculator, Info, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useFarm } from '../contexts/FarmContext';
import { COUNTRY_REGISTRY } from '../constants';

interface LaborInput {
  farmSizeHa: number;
  mainCrop: string;
  secondaryCrop: string;
  livestockCount: number;
  season: 'dry' | 'rainy';
  mechanization: 'none' | 'partial' | 'full';
  familyWorkers: number;
  irrigationType: 'rainfed' | 'manual' | 'pump';
}

interface LaborResult {
  totalWorkers: number;
  familyWorkers: number;
  hiredWorkers: number;
  peakWorkers: number;
  monthlyBreakdown: { month: string; workers: number; activity: string }[];
  costEstimate: { category: string; amount: number }[];
  totalMonthlyCost: number;
  recommendations: string[];
}

const WEST_AFRICAN_CROPS: Record<string, { labelDaysPerHa: number; harvestDaysPerHa: number; weedDaysPerHa: number }> = {
  cassava: { labelDaysPerHa: 25, harvestDaysPerHa: 30, weedDaysPerHa: 12 },
  yam: { labelDaysPerHa: 35, harvestDaysPerHa: 25, weedDaysPerHa: 15 },
  maize: { labelDaysPerHa: 18, harvestDaysPerHa: 12, weedDaysPerHa: 10 },
  rice: { labelDaysPerHa: 22, harvestDaysPerHa: 18, weedDaysPerHa: 14 },
  millet: { labelDaysPerHa: 14, harvestDaysPerHa: 10, weedDaysPerHa: 8 },
  sorghum: { labelDaysPerHa: 16, harvestDaysPerHa: 12, weedDaysPerHa: 9 },
  cocoa: { labelDaysPerHa: 20, harvestDaysPerHa: 28, weedDaysPerHa: 18 },
  groundnut: { labelDaysPerHa: 15, harvestDaysPerHa: 14, weedDaysPerHa: 10 },
  cowpea: { labelDaysPerHa: 12, harvestDaysPerHa: 10, weedDaysPerHa: 8 },
  vegetable: { labelDaysPerHa: 30, harvestDaysPerHa: 20, weedDaysPerHa: 20 },
};

const CROP_LABELS: Record<string, string> = {
  cassava: 'Cassava', yam: 'Yam', maize: 'Maize', rice: 'Rice',
  millet: 'Millet', sorghum: 'Sorghum', cocoa: 'Cocoa',
  groundnut: 'Groundnut', cowpea: 'Cowpea', vegetable: 'Vegetables',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const WORKING_DAYS_PER_MONTH = 22;

const calculateLabor = (input: LaborInput, dailyWage: number, feedingCost: number): LaborResult => {
  const cropData = WEST_AFRICAN_CROPS[input.mainCrop] || WEST_AFRICAN_CROPS.maize;
  const secondaryData = WEST_AFRICAN_CROPS[input.secondaryCrop] || WEST_AFRICAN_CROPS.maize;

  const mechFactor = input.mechanization === 'none' ? 1 : input.mechanization === 'partial' ? 0.65 : 0.35;
  const seasonFactor = input.season === 'rainy' ? 1.25 : 0.85;
  const irrigationFactor = input.irrigationType === 'rainfed' ? 0 : input.irrigationType === 'manual' ? 0.1 : 0.05;

  const mainHa = input.farmSizeHa * 0.7;
  const secondaryHa = input.farmSizeHa * 0.3;

  const plantingLaborMain = (cropData.labelDaysPerHa * mainHa * mechFactor * seasonFactor) / WORKING_DAYS_PER_MONTH;
  const plantingLaborSec = (secondaryData.labelDaysPerHa * secondaryHa * mechFactor * seasonFactor) / WORKING_DAYS_PER_MONTH;
  const weedingLaborMain = (cropData.weedDaysPerHa * mainHa * mechFactor * 2) / WORKING_DAYS_PER_MONTH;
  const weedingLaborSec = (secondaryData.weedDaysPerHa * secondaryHa * mechFactor * 2) / WORKING_DAYS_PER_MONTH;
  const harvestLaborMain = (cropData.harvestDaysPerHa * mainHa * mechFactor * seasonFactor) / WORKING_DAYS_PER_MONTH;
  const harvestLaborSec = (secondaryData.harvestDaysPerHa * secondaryHa * mechFactor * seasonFactor) / WORKING_DAYS_PER_MONTH;
  const livestockLabor = Math.ceil(input.livestockCount / 20) * 0.5;
  const irrigationLabor = (irrigationFactor * input.farmSizeHa * 10) / WORKING_DAYS_PER_MONTH;
  const generalMaintenance = input.farmSizeHa * 0.3 * mechFactor;

  const plantingMonths = input.season === 'rainy' ? [4, 5, 6] : [5, 6, 7];
  const weedingMonths = input.season === 'rainy' ? [5, 6, 7, 8] : [6, 7, 8, 9];
  const harvestMonths = input.season === 'rainy' ? [9, 10, 11] : [10, 11, 0];

  const monthlyBreakdown = MONTHS.map((month, i) => {
    let workers = generalMaintenance + livestockLabor + irrigationLabor;
    let activity = 'General maintenance';

    if (plantingMonths.includes(i)) {
      workers += plantingLaborMain + plantingLaborSec;
      activity = 'Land prep & planting';
    }
    if (weedingMonths.includes(i)) {
      workers += weedingLaborMain + weedingLaborSec;
      activity = activity === 'General maintenance' ? 'Weeding' : 'Planting & weeding';
    }
    if (harvestMonths.includes(i)) {
      workers += harvestLaborMain + harvestLaborSec;
      activity = 'Harvesting';
    }

    workers = Math.max(1, Math.ceil(workers));
    return { month, workers, activity };
  });

  const baseWorkers = monthlyBreakdown.reduce((sum, m) => sum + m.workers, 0) / 12;
  const totalWorkers = Math.ceil(baseWorkers);
  const hiredWorkers = Math.max(0, totalWorkers - input.familyWorkers);
  const peakWorkers = Math.max(...monthlyBreakdown.map(m => m.workers));

  const costEstimate = [
    { category: 'Hired labor (monthly)', amount: hiredWorkers * dailyWage * WORKING_DAYS_PER_MONTH },
    { category: 'Peak season extra', amount: Math.max(0, peakWorkers - totalWorkers) * dailyWage * WORKING_DAYS_PER_MONTH * 0.3 },
    { category: 'Supervision & tools', amount: hiredWorkers * dailyWage * 5 },
    { category: 'Feeding allowance', amount: hiredWorkers * feedingCost * WORKING_DAYS_PER_MONTH },
  ];

  const totalMonthlyCost = costEstimate.reduce((sum, c) => sum + c.amount, 0);

  const recommendations: string[] = [];
  if (input.mechanization === 'none' && input.farmSizeHa > 3) {
    recommendations.push('Consider partial mechanization (tractor hire) to reduce labor needs by up to 35%');
  }
  if (hiredWorkers > 5) {
    recommendations.push('Hire a foreman or supervisor to manage the labor team efficiently');
  }
  if (input.familyWorkers > totalWorkers) {
    recommendations.push('Your family labor covers all needs — no hiring required');
  }
  if (peakWorkers > totalWorkers * 1.5) {
    recommendations.push('Peak season demand is significantly higher — plan casual labor in advance');
  }
  if (input.irrigationType === 'manual' && input.farmSizeHa > 2) {
    recommendations.push('Switching to pump irrigation can cut irrigation labor by 50%');
  }
  if (input.season === 'dry' && input.irrigationType === 'rainfed') {
    recommendations.push('Dry season farming without irrigation is risky — consider supplementary watering');
  }
  if (input.livestockCount > 10 && input.farmSizeHa < 2) {
    recommendations.push('Integrated crop-livestock can optimize labor — livestock can help with land prep');
  }
  if (input.farmSizeHa > 5) {
    recommendations.push('For farms over 5 hectares, rotate weeding crews across plots weekly');
  }
  if (recommendations.length === 0) {
    recommendations.push('Your labor plan looks well balanced for your farm size and crop mix');
  }

  return {
    totalWorkers,
    familyWorkers: Math.min(input.familyWorkers, totalWorkers),
    hiredWorkers,
    peakWorkers,
    monthlyBreakdown,
    costEstimate,
    totalMonthlyCost,
    recommendations,
  };
};

const FarmLaborPlanner: React.FC = () => {
  const { userProfile } = useFarm();
  const countryCfg = userProfile.countryCode ? COUNTRY_REGISTRY[userProfile.countryCode] : null;
  const dailyWage = countryCfg?.dailyWageLocal ?? 3500;
  const currencySymbol = userProfile.currencySymbol || '₦';
  const feedingCost = Math.round(dailyWage * 0.29);

  const [input, setInput] = useState<LaborInput>({
    farmSizeHa: 2,
    mainCrop: 'cassava',
    secondaryCrop: 'maize',
    livestockCount: 0,
    season: 'rainy',
    mechanization: 'none',
    familyWorkers: 2,
    irrigationType: 'rainfed',
  });
  const [showResults, setShowResults] = useState(false);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);

  const result = useMemo(() => calculateLabor(input, dailyWage, feedingCost), [input, dailyWage, feedingCost]);

  const handleCalculate = () => setShowResults(true);

  const updateInput = (key: keyof LaborInput, value: number | string) => {
    setInput(prev => ({ ...prev, [key]: value }));
    if (showResults) setShowResults(false);
  };

  const formatCurrency = (n: number) => currencySymbol + n.toLocaleString();

  const inputClasses = "w-full px-3 py-2 rounded-lg border border-[var(--border-card)] bg-[var(--bg-content)] text-[var(--text-primary)] text-sm focus:ring-2 focus:ring-jade-500 focus:border-transparent transition-colors";

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="pb-4 border-b border-[var(--border-card)]">
        <h2 className="text-3xl font-semibold text-[var(--text-primary)] font-heading">Farm Labor Planner</h2>
        <p className="text-[var(--text-secondary)] font-semibold text-xs mt-1">Calculate Optimal Workforce for Your Farm</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-surface p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
            <Sprout className="w-4 h-4 text-jade-600 dark:text-jade-400" />
            Farm Details
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Farm Size ({userProfile.areaUnit})</label>
            <input
              type="number"
              min={0.5}
              max={100}
              step={0.5}
              value={input.farmSizeHa}
              onChange={e => updateInput('farmSizeHa', parseFloat(e.target.value) || 0.5)}
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Main Crop</label>
            <select
              value={input.mainCrop}
              onChange={e => updateInput('mainCrop', e.target.value)}
              className={inputClasses}
            >
              {Object.entries(CROP_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Secondary Crop</label>
            <select
              value={input.secondaryCrop}
              onChange={e => updateInput('secondaryCrop', e.target.value)}
              className={inputClasses}
            >
              {Object.entries(CROP_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Livestock Count</label>
            <input
              type="number"
              min={0}
              max={500}
              step={1}
              value={input.livestockCount}
              onChange={e => updateInput('livestockCount', parseInt(e.target.value) || 0)}
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Family Workers Available</label>
            <input
              type="number"
              min={0}
              max={20}
              step={1}
              value={input.familyWorkers}
              onChange={e => updateInput('familyWorkers', parseInt(e.target.value) || 0)}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="card-surface p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
            <Tractor className="w-4 h-4 text-sunburst-500" />
            Farm Setup
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Season</label>
            <div className="flex gap-2">
              <button
                onClick={() => updateInput('season', 'rainy')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-xs border-2 transition-colors ${
                  input.season === 'rainy'
                    ? 'bg-jade-600 text-white border-jade-600'
                    : 'bg-[var(--bg-content)] text-[var(--text-tertiary)] border-[var(--border-card)]'
                }`}
              >
                <CloudRain className="w-4 h-4" />
                Rainy Season
              </button>
              <button
                onClick={() => updateInput('season', 'dry')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-xs border-2 transition-colors ${
                  input.season === 'dry'
                    ? 'bg-sunburst-500 text-jade-950 border-sunburst-500'
                    : 'bg-[var(--bg-content)] text-[var(--text-tertiary)] border-[var(--border-card)]'
                }`}
              >
                <Sun className="w-4 h-4" />
                Dry Season
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Mechanization Level</label>
            <div className="flex gap-2">
              {([
                { key: 'none', label: 'Manual' },
                { key: 'partial', label: 'Partial' },
                { key: 'full', label: 'Mechanized' },
              ] as const).map(opt => (
                <button
                  key={opt.key}
                  onClick={() => updateInput('mechanization', opt.key)}
                  className={`flex-1 px-3 py-2.5 rounded-lg font-semibold text-xs border-2 transition-colors ${
                    input.mechanization === opt.key
                      ? 'bg-jade-800 dark:bg-sunburst-500 text-white dark:text-jade-950 border-jade-800 dark:border-sunburst-500'
                      : 'bg-[var(--bg-content)] text-[var(--text-tertiary)] border-[var(--border-card)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Irrigation Type</label>
            <div className="flex gap-2">
              {([
                { key: 'rainfed', label: 'Rainfed' },
                { key: 'manual', label: 'Manual' },
                { key: 'pump', label: 'Pump' },
              ] as const).map(opt => (
                <button
                  key={opt.key}
                  onClick={() => updateInput('irrigationType', opt.key)}
                  className={`flex-1 px-3 py-2.5 rounded-lg font-semibold text-xs border-2 transition-colors ${
                    input.irrigationType === opt.key
                      ? 'bg-jade-600 text-white border-jade-600'
                      : 'bg-[var(--bg-content)] text-[var(--text-tertiary)] border-[var(--border-card)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-jade-800 dark:bg-sunburst-500 hover:bg-jade-700 dark:hover:bg-sunburst-400 text-white dark:text-jade-950 rounded-lg font-semibold text-sm transition-colors shadow-md active:scale-[0.98] mt-4"
          >
            <Calculator className="w-4 h-4" />
            Calculate Workforce
          </button>

          {showResults && (
            <div className="mt-4 p-4 bg-jade-50 dark:bg-jade-900/20 rounded-lg border border-jade-200 dark:border-jade-800">
              <div className="flex items-center gap-2 text-jade-700 dark:text-jade-400 text-xs font-semibold mb-2">
                <CheckCircle2 className="w-4 h-4" />
                Quick Summary
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 card-inner rounded-lg">
                  <div className="text-2xl font-bold text-[var(--text-primary)] font-mono">{result.totalWorkers}</div>
                  <div className="text-[10px] font-medium text-[var(--text-tertiary)]">Total Workers</div>
                </div>
                <div className="text-center p-2 card-inner rounded-lg">
                  <div className="text-2xl font-bold text-jade-600 dark:text-jade-400 font-mono">{result.peakWorkers}</div>
                  <div className="text-[10px] font-medium text-[var(--text-tertiary)]">Peak Season</div>
                </div>
                <div className="text-center p-2 card-inner rounded-lg">
                  <div className="text-2xl font-bold text-sunburst-600 dark:text-sunburst-400 font-mono">{result.hiredWorkers}</div>
                  <div className="text-[10px] font-medium text-[var(--text-tertiary)]">Hired Needed</div>
                </div>
                <div className="text-center p-2 card-inner rounded-lg">
                  <div className="text-lg font-bold text-[var(--text-primary)] font-mono">{formatCurrency(result.totalMonthlyCost)}</div>
                  <div className="text-[10px] font-medium text-[var(--text-tertiary)]">Monthly Cost</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showResults && (
        <div className="space-y-6 animate-fade-in">
          <div className="card-surface p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] font-heading mb-4">Monthly Labor Schedule</h3>
            <div className="space-y-2">
              {result.monthlyBreakdown.map((m, i) => (
                <div key={m.month}>
                  <button
                    onClick={() => setExpandedMonth(expandedMonth === i ? null : i)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bg-content)] transition-colors"
                  >
                    <div className="w-10 text-xs font-bold text-[var(--text-primary)]">{m.month}</div>
                    <div className="flex-1">
                      <div className="h-3 bg-[var(--bg-content)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-jade-500 rounded-full transition-all duration-500"
                          style={{ width: `${(m.workers / result.peakWorkers) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-8 text-sm font-bold text-[var(--text-primary)] font-mono text-right">{m.workers}</div>
                    <div className="w-28 text-xs font-medium text-[var(--text-tertiary)] truncate">{m.activity}</div>
                    {expandedMonth === i ? <ChevronUp className="w-4 h-4 text-[var(--text-tertiary)]" /> : <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />}
                  </button>
                  {expandedMonth === i && (
                    <div className="ml-10 mr-4 mb-2 p-3 bg-[var(--bg-content)] rounded-lg text-xs text-[var(--text-secondary)] space-y-1">
                      <p><span className="font-medium text-[var(--text-primary)]">Workers needed:</span> <span className="font-mono">{m.workers}</span></p>
                      <p><span className="font-medium text-[var(--text-primary)]">Primary activity:</span> {m.activity}</p>
                      <p><span className="font-medium text-[var(--text-primary)]">Labor cost:</span> <span className="font-mono">{formatCurrency(m.workers * dailyWage * WORKING_DAYS_PER_MONTH)}</span></p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-surface p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] font-heading mb-4">Cost Breakdown</h3>
              <div className="space-y-3">
                {result.costEstimate.map(c => (
                  <div key={c.category} className="flex items-center justify-between py-2 border-b border-[var(--border-card)] last:border-0">
                    <span className="text-sm text-[var(--text-secondary)]">{c.category}</span>
                    <span className="text-sm font-bold text-[var(--text-primary)] font-mono">{formatCurrency(c.amount)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3 border-t-2 border-sunburst-500/30">
                  <span className="text-sm font-bold text-[var(--text-primary)]">Total Monthly</span>
                  <span className="text-sm font-bold text-jade-600 dark:text-jade-400 font-mono">{formatCurrency(result.totalMonthlyCost)}</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-sunburst-50 dark:bg-sunburst-900/10 rounded-lg border border-sunburst-200 dark:border-sunburst-800/50">
                <p className="text-xs text-sunburst-700 dark:text-sunburst-400 font-medium">
                  Wage basis: <span className="font-mono">{currencySymbol}{dailyWage.toLocaleString()}/day</span> ({countryCfg?.name ?? 'Nigeria'} regional average, 2026)
                </p>
              </div>
            </div>

            <div className="card-surface p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] font-heading mb-4">Recommendations</h3>
              <div className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-[var(--bg-content)] rounded-lg">
                    <Info className="w-4 h-4 text-jade-600 dark:text-jade-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-[var(--text-secondary)]">{rec}</p>
                  </div>
                ))}
              </div>
              {result.hiredWorkers === 0 && (
                <div className="mt-4 p-3 bg-jade-50 dark:bg-jade-900/20 rounded-lg border border-jade-200 dark:border-jade-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-jade-600 dark:text-jade-400" />
                  <p className="text-xs text-jade-700 dark:text-jade-400 font-medium">No hired labor needed — your family team covers everything</p>
                </div>
              )}
            </div>
          </div>

          <div className="card-surface p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] font-heading mb-4">Workforce Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-[var(--bg-content)] rounded-lg">
                <Users className="w-6 h-6 text-[var(--text-tertiary)] mx-auto mb-2" />
                <div className="text-3xl font-bold text-[var(--text-primary)] font-mono">{result.totalWorkers}</div>
                <div className="text-xs font-medium text-[var(--text-tertiary)] mt-1">Average Workers</div>
              </div>
              <div className="text-center p-4 bg-jade-50 dark:bg-jade-900/20 rounded-lg">
                <Sprout className="w-6 h-6 text-jade-600 dark:text-jade-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-jade-600 dark:text-jade-400 font-mono">{result.familyWorkers}</div>
                <div className="text-xs font-medium text-[var(--text-tertiary)] mt-1">Family Workers</div>
              </div>
              <div className="text-center p-4 bg-sunburst-50 dark:bg-sunburst-900/10 rounded-lg">
                <Tractor className="w-6 h-6 text-sunburst-600 dark:text-sunburst-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-sunburst-600 dark:text-sunburst-400 font-mono">{result.hiredWorkers}</div>
                <div className="text-xs font-medium text-[var(--text-tertiary)] mt-1">Hired Workers</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-500 dark:text-red-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 font-mono">{result.peakWorkers}</div>
                <div className="text-xs font-medium text-[var(--text-tertiary)] mt-1">Peak Season Max</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmLaborPlanner;

import React, { useState, useEffect } from 'react';
import { Calculator, Droplets, Sprout, RefreshCw } from 'lucide-react';
import { useFarm } from '../contexts/FarmContext';
import type { ResourceResult } from '../types';
import { formatCurrency, formatAreaLabel } from '../utils/localeFormat';

const ResourceCalculator: React.FC = () => {
  const { resourceResult: savedResourceResult, saveResourceResult, userProfile } = useFarm();

  const areaUnit = userProfile.areaUnit || 'ha';
  const currencyCode = userProfile.currencyCode || 'USD';
  const currencySymbol = userProfile.currencySymbol || '$';

  const [mode, setMode] = useState<'FERTILIZER' | 'IRRIGATION'>(savedResourceResult?.mode ?? 'FERTILIZER');

  const [targetN, setTargetN] = useState<number>(100);
  const [fertType, setFertType] = useState<number>(46);
  const [area, setArea] = useState<number>(1);
  const [fertResult, setFertResult] = useState<number>(savedResourceResult?.fertilizerKg ?? 0);

  const [cropFactor, setCropFactor] = useState<number>(1.2);
  const [et0, setEt0] = useState<number>(5);
  const [efficiency, setEfficiency] = useState<number>(0.75);
  const [irrigationResult, setIrrigationResult] = useState<number>(savedResourceResult?.irrigationLitersPerDay ?? 0);

  useEffect(() => {
    if (savedResourceResult) {
      setMode(savedResourceResult.mode);
      setFertResult(savedResourceResult.fertilizerKg);
      setIrrigationResult(savedResourceResult.irrigationLitersPerDay);
    }
  }, [savedResourceResult]);

  const calculateFertilizer = () => {
    const result = (targetN / (fertType / 100)) * area;
    const rounded = Math.round(result);
    setFertResult(rounded);
    saveResourceResult({ mode: 'FERTILIZER', fertilizerKg: rounded, irrigationLitersPerDay: irrigationResult, savedAt: new Date().toISOString() });
  };

  const calculateIrrigation = () => {
    // Guard: efficiency must be > 0 (otherwise divide-by-zero yields Infinity).
    const safeEfficiency = efficiency > 0 ? efficiency : 0.75;
    const areaM2 = areaUnit === 'acres' ? area * 4046.86 : area * 10000;
    const demandMm = et0 * cropFactor;
    const grossDemandMm = demandMm / safeEfficiency;
    const liters = Math.round(grossDemandMm * areaM2);
    setIrrigationResult(liters);
    saveResourceResult({ mode: 'IRRIGATION', fertilizerKg: fertResult, irrigationLitersPerDay: liters, savedAt: new Date().toISOString() });
  };

  const inputCls = "w-full p-3 bg-card-dynamic border border-primary-dynamic rounded font-bold text-primary-dynamic focus:outline-none focus:border-sunburst-500 dark:focus:border-sunburst-400";
  const labelCls = "block text-xs font-semibold text-secondary-dynamic mb-1";
  const unitCls = "ml-2 font-bold text-secondary-dynamic";

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end organic-divider pb-4 transition-colors">
        <div>
          <h2 className="text-3xl font-semibold text-primary-dynamic font-heading">Resource Toolkit</h2>
          <p className="text-secondary-dynamic font-semibold text-xs mt-1">Optimize Inputs & Reduce Waste</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
           <button 
             onClick={() => setMode('FERTILIZER')}
             aria-pressed={mode === 'FERTILIZER'}
             className={`px-4 py-2 rounded font-semibold text-xs border-2 focus:outline-none focus:ring-2 focus:ring-jade-500 transition-colors ${mode === 'FERTILIZER' ? 'bg-jade-800 dark:bg-sunburst-100 text-sunburst-500 dark:text-jade-900 border-jade-800 dark:border-sunburst-200' : 'bg-card-dynamic text-secondary-dynamic border-primary-dynamic'}`}
           >
             Fertilizer
           </button>
           <button 
             onClick={() => setMode('IRRIGATION')}
             aria-pressed={mode === 'IRRIGATION'}
             className={`px-4 py-2 rounded font-semibold text-xs border-2 focus:outline-none focus:ring-2 focus:ring-jade-500 transition-colors ${mode === 'IRRIGATION' ? 'bg-jade-700 dark:bg-jade-600 text-white border-jade-700 dark:border-jade-600' : 'bg-card-dynamic text-secondary-dynamic border-primary-dynamic'}`}
           >
             Irrigation
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="card-surface p-6">
           <h3 className="text-xl font-semibold text-primary-dynamic mb-6 flex items-center">
             {mode === 'FERTILIZER' ? <Sprout className="w-6 h-6 mr-2 text-jade-600 dark:text-jade-400" aria-hidden="true"/> : <Droplets className="w-6 h-6 mr-2 text-jade-600 dark:text-jade-400" aria-hidden="true"/>}
             {mode === 'FERTILIZER' ? 'Nutrient Planner' : 'Water Scheduler'}
           </h3>

           {mode === 'FERTILIZER' ? (
             <div className="space-y-4">
                <div>
                   <label htmlFor="targetN" className={labelCls}>Target Nitrogen (N)</label>
                   <div className="flex items-center">
                     <input id="targetN" type="number" value={targetN} onChange={e => setTargetN(Number(e.target.value))} className={inputCls}/>
                     <span className={unitCls} aria-hidden="true">kg/ha</span>
                   </div>
                </div>
                <div>
                   <label htmlFor="fertType" className={labelCls}>Fertilizer Type</label>
                   <select id="fertType" value={fertType} onChange={e => setFertType(Number(e.target.value))} className={inputCls}>
                      <option value={46}>Urea (46% N)</option>
                      <option value={21}>Sulphate of Ammonia (21% N)</option>
                      <option value={33}>Ammonium Nitrate (33% N)</option>
                      <option value={18}>DAP (18% N)</option>
                   </select>
                </div>
                <div>
                   <label htmlFor="fertArea" className={labelCls}>Field Area</label>
                   <div className="flex items-center">
                      <input id="fertArea" type="number" value={area} onChange={e => setArea(Number(e.target.value))} className={inputCls}/>
                      <span className={unitCls} aria-hidden="true">{formatAreaLabel(areaUnit as any)}</span>
                   </div>
                </div>
                 <button onClick={calculateFertilizer} className="w-full bg-jade-800 dark:bg-sunburst-500 text-white dark:text-jade-950 py-4 font-semibold hover:bg-jade-700 dark:hover:bg-sunburst-400 mt-4 focus:outline-none focus:ring-2 focus:ring-sunburst-500 focus:ring-offset-2 rounded transition-colors shadow-lg">Calculate Requirements</button>
             </div>
           ) : (
             <div className="space-y-4">
                <div>
                   <label htmlFor="cropFactor" className={labelCls}>Crop Factor (Kc)</label>
                   <select id="cropFactor" value={cropFactor} onChange={e => setCropFactor(Number(e.target.value))} className={inputCls}>
                      <option value={1.2}>Maize (Mid-season)</option>
                      <option value={1.05}>Sorghum (Mid-season)</option>
                      <option value={0.8}>Vegetables (Avg)</option>
                      <option value={1.1}>Fruit Trees</option>
                   </select>
                </div>
                <div>
                   <label htmlFor="et0" className={labelCls}>Evapotranspiration (ET0)</label>
                   <div className="flex items-center">
                     <input id="et0" type="number" value={et0} onChange={e => setEt0(Number(e.target.value))} className={inputCls}/>
                     <span className={unitCls} aria-hidden="true">mm/day</span>
                   </div>
                </div>
                <div>
                   <label htmlFor="efficiency" className={labelCls}>System Efficiency</label>
                   <select id="efficiency" value={efficiency} onChange={e => setEfficiency(Number(e.target.value))} className={inputCls}>
                      <option value={0.9}>Drip (90%)</option>
                      <option value={0.75}>Sprinkler (75%)</option>
                      <option value={0.5}>Flood (50%)</option>
                   </select>
                </div>
                <div>
                   <label htmlFor="irrArea" className={labelCls}>Field Area</label>
                   <div className="flex items-center">
                      <input id="irrArea" type="number" value={area} onChange={e => setArea(Number(e.target.value))} className={inputCls}/>
                      <span className={unitCls} aria-hidden="true">{formatAreaLabel(areaUnit as any)}</span>
                   </div>
                </div>
                <button onClick={calculateIrrigation} className="w-full bg-jade-700 dark:bg-jade-600 text-white py-4 font-semibold hover:bg-jade-600 dark:hover:bg-jade-500 mt-4 focus:outline-none focus:ring-2 focus:ring-jade-400 focus:ring-offset-2 rounded transition-colors shadow-lg">Calculate Water Needs</button>
             </div>
           )}
        </div>

        <div className="bg-jade-800 dark:bg-jade-950 text-white p-6 rounded shadow-lg border-l-8 border-sunburst-500 flex flex-col justify-center relative overflow-hidden transition-colors" role="status" aria-live="polite">
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
           
           <div className="relative z-10 text-center">
              <h4 className="text-jade-300 font-semibold text-sm mb-4">Calculated Output</h4>
              
              {mode === 'FERTILIZER' ? (
                <>
                  <div className="text-7xl font-bold font-heading text-white mb-2">{fertResult}</div>
                  <div className="text-sunburst-500 text-xl font-bold mb-6">Kilograms Needed</div>
                  <div className="card-inner p-4 rounded text-left">
                    <p className="text-xs text-jade-300 font-semibold mb-2">Cost Estimation</p>
                    <p className="text-sm">At current market rates (~{formatCurrency(1.2, currencyCode, currencySymbol)}/kg), this application will cost approximately <span className="text-white font-bold">{formatCurrency(fertResult * 1.2, currencyCode, currencySymbol)}</span>.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-7xl font-bold font-heading text-jade-300 mb-2">{irrigationResult.toLocaleString()}</div>
                  <div className="text-white text-xl font-bold mb-6">Liters / Day</div>
                  <div className="card-inner p-4 rounded text-left">
                    <p className="text-xs text-jade-300 font-semibold mb-2">Conservation Tip</p>
                    <p className="text-sm">Switching to Drip Irrigation (90% Eff) would save <span className="text-jade-400 font-bold">{(irrigationResult - (irrigationResult * (efficiency/0.9))).toLocaleString()} Liters</span> daily.</p>
                  </div>
                </>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default ResourceCalculator;

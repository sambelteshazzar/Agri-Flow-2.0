import React, { useState, useMemo } from 'react';
import { useFarm } from '../contexts/FarmContext';
import { CalendarDays, Droplets, Sprout, ChevronDown, ChevronUp, CloudRain, Sun, Leaf, Info, Search, X } from 'lucide-react';
import {
  CROP_CALENDAR,
  CLIMATE_ZONE_INFO,
  MONTHS,
  CropCalendarEntry,
  ClimateZone,
} from '../constants/plantingCalendar';

const CLIMATE_ICON: Record<ClimateZone, React.ReactNode> = {
  sahel: <Sun className="w-4 h-4 text-sunburst-500" />,
  sudan_savanna: <Sun className="w-4 h-4 text-sunburst-400" />,
  guinea_savanna: <CloudRain className="w-4 h-4 text-jade-500" />,
  tropical_wet_dry: <CloudRain className="w-4 h-4 text-jade-400" />,
  tropical_rainforest: <Droplets className="w-4 h-4 text-blue-500" />,
};

const WATER_COLORS: Record<string, string> = {
  Low: 'bg-jade-100 dark:bg-jade-900/30 text-jade-700 dark:text-jade-300 border-jade-300 dark:border-jade-700',
  Moderate: 'bg-sunburst-100 dark:bg-sunburst-900/30 text-sunburst-700 dark:text-sunburst-300 border-sunburst-300 dark:border-sunburst-700',
  High: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
};

const PlantingCalendar: React.FC = () => {
  const { userProfile } = useFarm();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCrop, setExpandedCrop] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth() + 1);
  const [selectedClimate, setSelectedClimate] = useState<ClimateZone | 'all'>('all');

  const userClimate = (userProfile.climateZone as ClimateZone) || 'guinea_savanna';

  const filteredCrops = useMemo(() => {
    let crops = CROP_CALENDAR;
    if (selectedClimate !== 'all') {
      crops = crops.filter(c => c.climateZones.includes(selectedClimate));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      crops = crops.filter(c => c.crop.toLowerCase().includes(q) || c.varieties.some(v => v.toLowerCase().includes(q)));
    }
    if (selectedMonth !== null) {
      crops = crops.filter(c =>
        c.plantingWindows.some(w => selectedMonth >= w.startMonth && selectedMonth <= w.endMonth)
      );
    }
    return crops;
  }, [searchQuery, selectedClimate, selectedMonth]);

  const climateZones = useMemo(() => {
    return (Object.keys(CLIMATE_ZONE_INFO) as ClimateZone[]).sort((a, b) => {
      if (a === userClimate) return -1;
      if (b === userClimate) return 1;
      return 0;
    });
  }, [userClimate]);

  const isCurrentMonthInWindow = (entry: CropCalendarEntry, month: number) => {
    return entry.plantingWindows.some(w => month >= w.startMonth && month <= w.endMonth);
  };

  const isHarvestMonth = (entry: CropCalendarEntry, month: number) => {
    const h = entry.harvestWindow;
    if (h.startMonth <= h.endMonth) {
      return month >= h.startMonth && month <= h.endMonth;
    }
    return month >= h.startMonth || month <= h.endMonth;
  };

  const toggleExpand = (crop: string) => {
    setExpandedCrop(prev => prev === crop ? null : crop);
  };

  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="bg-[var(--bg-card)] p-5 rounded-lg shadow-sm border border-[var(--border-card)] flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
        <div>
          <h2 className="text-3xl font-bold text-[var(--text-primary)] font-heading flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-jade-600" />
            Planting Calendar
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Offline West African seasonal planting guide — {CLIMATE_ZONE_INFO[userClimate]?.name || userClimate} zone
          </p>
        </div>
        <div className="px-4 py-2 bg-jade-50 dark:bg-jade-900/30 border border-jade-200 dark:border-jade-700 rounded-lg text-center">
          <p className="text-[10px] font-semibold text-jade-600 dark:text-jade-400 uppercase tracking-wide">Current Month</p>
          <p className="text-lg font-bold text-jade-800 dark:text-jade-200">{MONTHS[currentMonth - 1]}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
          <button
            onClick={() => setSelectedClimate('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border-2 transition-colors ${selectedClimate === 'all' ? 'bg-jade-800 text-white border-jade-800' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-card)] hover:border-jade-400'}`}
          >
            All Zones
          </button>
          {climateZones.map(zone => (
            <button
              key={zone}
              onClick={() => setSelectedClimate(zone)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border-2 transition-colors flex items-center gap-1.5 ${selectedClimate === zone ? 'bg-jade-800 text-white border-jade-800' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-card)] hover:border-jade-400'}`}
            >
              {CLIMATE_ICON[zone]}
              {CLIMATE_ZONE_INFO[zone].name}
              {zone === userClimate && <span className="ml-1 w-2 h-2 bg-sunburst-500 rounded-full" />}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Search crops..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-full text-sm font-medium focus:outline-none focus:border-jade-400 text-[var(--text-primary)]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5">
              <X className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-card)] p-4 overflow-x-auto">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Monthly Planting Windows</h3>
          {selectedMonth && (
            <button onClick={() => setSelectedMonth(null)} className="text-xs text-jade-600 dark:text-jade-400 font-semibold hover:underline">
              Clear month filter
            </button>
          )}
        </div>
        <div className="grid grid-cols-12 gap-1 min-w-[600px]">
          {MONTHS.map((m, i) => {
            const month = i + 1;
            const isCurrent = month === currentMonth;
            const isFiltered = month === selectedMonth;
            return (
              <button
                key={m}
                onClick={() => setSelectedMonth(selectedMonth === month ? null : month)}
                className={`flex flex-col items-center py-2 px-1 rounded text-[10px] font-semibold transition-colors border-2 ${isCurrent ? 'border-jade-500' : 'border-transparent'} ${isFiltered ? 'bg-jade-800 text-white' : 'bg-[var(--bg-content)] text-[var(--text-secondary)] hover:bg-jade-50 dark:hover:bg-jade-900/20'}`}
              >
                <span>{m}</span>
                <span className="text-[9px] mt-0.5">{isCurrent ? 'Now' : ''}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-[var(--text-secondary)]">
        Showing {filteredCrops.length} crop{filteredCrops.length !== 1 ? 's' : ''}
        {selectedMonth ? ` plantable in ${MONTHS[selectedMonth - 1]}` : ''}
        {selectedClimate !== 'all' ? ` for ${CLIMATE_ZONE_INFO[selectedClimate as ClimateZone]?.name}` : ''}
      </p>

      {filteredCrops.length === 0 && (
        <div className="text-center py-16 bg-[var(--bg-card)] rounded-lg border border-[var(--border-card)]">
          <CalendarDays className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
          <p className="text-[var(--text-secondary)] font-medium">No crops match your current filters.</p>
          <button onClick={() => { setSelectedMonth(null); setSelectedClimate('all'); setSearchQuery(''); }} className="mt-4 px-6 py-2 bg-jade-800 text-white text-sm font-semibold rounded hover:bg-jade-700">
            Reset Filters
          </button>
        </div>
      )}

      <div className="space-y-3">
        {filteredCrops.map(entry => {
          const isExpanded = expandedCrop === entry.crop;
          const isUserZone = entry.climateZones.includes(userClimate);
          return (
            <div
              key={entry.crop}
              className={`bg-[var(--bg-card)] rounded-lg border-2 transition-colors shadow-sm ${isUserZone ? 'border-l-4 border-l-jade-500 border-jade-200 dark:border-jade-800' : 'border-[var(--border-card)]'}`}
            >
              <button
                onClick={() => toggleExpand(entry.crop)}
                className="w-full p-4 flex items-center gap-4 text-left"
              >
                <span className="text-2xl">{entry.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">{entry.crop}</h3>
                    {isUserZone && <span className="px-1.5 py-0.5 bg-jade-100 dark:bg-jade-900/30 text-jade-700 dark:text-jade-300 text-[9px] font-bold rounded">Your Zone</span>}
                    <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded border ${WATER_COLORS[entry.waterNeed]}`}>
                      <Droplets className="w-3 h-3 inline mr-0.5" />{entry.waterNeed}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {entry.plantingWindows.map((w, i) => (
                      <span key={i} className="text-xs text-[var(--text-secondary)] font-medium">
                        {w.label}: {MONTHS[w.startMonth - 1]}–{MONTHS[w.endMonth - 1]}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:flex gap-1">
                  {MONTHS.map((_, mi) => {
                    const m = mi + 1;
                    const planting = isCurrentMonthInWindow(entry, m);
                    const harvest = isHarvestMonth(entry, m);
                    return (
                      <div
                        key={mi}
                        className={`w-5 h-5 rounded-sm text-[8px] flex items-center justify-center font-bold ${
                          planting ? 'bg-jade-500 text-white' : harvest ? 'bg-sunburst-400 text-jade-950' : 'bg-[var(--bg-content)] text-[var(--text-tertiary)]'
                        } ${m === currentMonth ? 'ring-2 ring-jade-500 ring-offset-1' : ''}`}
                        title={`${MONTHS[mi]}: ${planting ? 'Planting' : harvest ? 'Harvest' : 'Off-season'}`}
                      >
                        {planting ? 'P' : harvest ? 'H' : '·'}
                      </div>
                    );
                  })}
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-[var(--text-secondary)]" /> : <ChevronDown className="w-5 h-5 text-[var(--text-secondary)]" />}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-[var(--border-card)] pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)] mb-2 flex items-center gap-1"><Sprout className="w-3 h-3" /> Varieties</h4>
                      <div className="flex flex-wrap gap-1">
                        {entry.varieties.map(v => (
                          <span key={v} className="px-2 py-0.5 bg-[var(--bg-content)] text-[var(--text-primary)] text-[10px] font-semibold rounded border border-[var(--border-card)]">{v}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)] mb-2"><Leaf className="w-3 h-3 inline mr-1" />Soil Preference</h4>
                      <p className="text-xs text-[var(--text-secondary)]">{entry.soilPreference}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)] mb-1">Growth Duration</h4>
                      <p className="text-xs text-[var(--text-secondary)]">{entry.growthDurationWeeks} weeks ({Math.round(entry.growthDurationWeeks / 4)} months)</p>
                      <h4 className="text-xs font-bold text-[var(--text-primary)] mt-2 mb-1">Climate Zones</h4>
                      <div className="flex flex-wrap gap-1">
                        {entry.climateZones.map(z => (
                          <span key={z} className="px-1.5 py-0.5 bg-[var(--bg-content)] text-[var(--text-primary)] text-[10px] font-semibold rounded border border-[var(--border-card)] flex items-center gap-1">
                            {CLIMATE_ICON[z]} {CLIMATE_ZONE_INFO[z].name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)] mb-2 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Monthly Activities</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => {
                        const activities = entry.keyActivities[m];
                        if (!activities || activities.length === 0) return null;
                        return (
                          <div key={m} className={`p-2 rounded border ${m === currentMonth ? 'bg-jade-50 dark:bg-jade-900/20 border-jade-300 dark:border-jade-700' : 'bg-[var(--bg-content)] border-[var(--border-card)]'}`}>
                            <p className={`text-[10px] font-bold mb-1 ${m === currentMonth ? 'text-jade-700 dark:text-jade-300' : 'text-[var(--text-primary)]'}`}>
                              {MONTHS[m - 1]} {m === currentMonth && '(Now)'}
                            </p>
                            {activities.map((a, i) => (
                              <p key={i} className="text-[10px] text-[var(--text-secondary)] leading-relaxed">{a}</p>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)] mb-2 flex items-center gap-1"><Info className="w-3 h-3" /> Tips</h4>
                    <ul className="space-y-1">
                      {entry.tips.map((tip, i) => (
                        <li key={i} className="text-xs text-[var(--text-secondary)] flex items-start gap-2">
                          <span className="text-jade-500 font-bold mt-0.5 shrink-0">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedClimate !== 'all' && (
        <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-card)] p-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
            {CLIMATE_ICON[selectedClimate as ClimateZone]}
            {CLIMATE_ZONE_INFO[selectedClimate as ClimateZone].name} Zone
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase mb-1">Annual Rainfall</p>
              <p className="text-sm font-bold text-[var(--text-primary)]">{CLIMATE_ZONE_INFO[selectedClimate as ClimateZone].rainfall}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase mb-1">Covering</p>
              <p className="text-xs text-[var(--text-primary)]">{CLIMATE_ZONE_INFO[selectedClimate as ClimateZone].countries.join(', ')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantingCalendar;

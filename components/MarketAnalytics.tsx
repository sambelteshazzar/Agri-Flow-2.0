
import React, { useMemo, useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, BarChart, Bar, Legend, ReferenceLine, LineChart } from 'recharts';
import { YIELD_DATA } from '../constants';
import { TrendingUp, TrendingDown, Minus, RefreshCw, BarChart2, DollarSign, Activity, PieChart, ArrowUpRight, ArrowDownRight, Clock, Zap, Globe, MousePointer2 } from 'lucide-react';
import { useFarm } from '../contexts/FarmContext';
import { CropService } from '../services/cropService';

const MarketAnalytics: React.FC = () => {
  const { marketPrices, refreshMarketPrices, theme, crops } = useFarm();
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'1W' | '1M' | '3M'>('1M');

  useEffect(() => {
    if (marketPrices.length > 0 && !selectedCrop) {
      setSelectedCrop(marketPrices[0].cropName);
    }
  }, [marketPrices, selectedCrop]);

  const isDark = theme === 'dark';
  const axisColor = isDark ? '#7BA896' : '#3E735D';
  const gridColor = isDark ? '#1E5A47' : '#C8DFD3';
  const tooltipBg = isDark ? '#072118' : '#FFFFFF';
  const tooltipText = isDark ? '#E8F5EE' : '#0A2E23';
  const tooltipBorder = isDark ? '#1E5A47' : '#C8F4E0';
  const chartAccent = isDark ? '#38D19E' : '#069669';
  const chartAccentFaded = isDark ? '#14B882' : '#057855';

  useEffect(() => {
    if (!selectedCrop) return;
    
    const currentItem = marketPrices.find(p => p.cropName === selectedCrop);
    if (!currentItem) return;

    const days = timeRange === '1W' ? 7 : timeRange === '1M' ? 30 : 90;
    const data = [];
    let priceWalker = currentItem.price;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.unshift({
        date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        price: Number(priceWalker.toFixed(2)),
        volume: Math.floor(Math.random() * 10000) + 2000,
        ma: Number((priceWalker * (1 + (Math.random() * 0.05 - 0.025))).toFixed(2))
      });

      const volatility = currentItem.price * 0.02;
      const change = (Math.random() - 0.5) * volatility;
      priceWalker += (Math.random() > 0.5 ? -change : change);
    }
    setHistoryData(data);
  }, [selectedCrop, timeRange, marketPrices]);

  const financialData = useMemo(() => {
    let projectedRevenue = 0;
    let estimatedCosts = 0;

    const COST_PER_ACRE: Record<string, number> = {
      'maize': 450,
      'corn': 450,
      'soy': 300,
      'wheat': 320,
      'coffee': 800,
      'default': 350
    };

    crops.forEach(crop => {
       const marketPrice = marketPrices.find(p => p.cropName.toLowerCase().includes(crop.name.toLowerCase()))?.price || 50;
       const revenue = CropService.calculateProjectedYield(crop, marketPrice);
       projectedRevenue += revenue;

       const cropKey = Object.keys(COST_PER_ACRE).find(k => crop.name.toLowerCase().includes(k)) || 'default';
       const costPerAcre = COST_PER_ACRE[cropKey];
       estimatedCosts += (crop.area * costPerAcre);
    });

    if (projectedRevenue === 0) projectedRevenue = 3200;
    if (estimatedCosts === 0) estimatedCosts = 2800;

    const newData = [...YIELD_DATA];
    const lastIdx = newData.length - 1;
    
    newData[lastIdx] = { 
      ...newData[lastIdx], 
      value: Math.round(projectedRevenue), 
      cost: Math.round(estimatedCosts) 
    };
    return newData;
  }, [crops, marketPrices]);

  const activeTickerData = marketPrices.find(p => p.cropName === selectedCrop);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-4 border-b border-[var(--border-card)]">
        <div>
          <h2 className="text-3xl font-bold text-[var(--text-primary)] font-heading">Market Intelligence</h2>
          <div className="flex items-center gap-3 mt-1">
             <span className="flex items-center text-xs font-semibold text-jade-700 dark:text-jade-300 bg-jade-100 dark:bg-jade-900/30 px-2 py-0.5 rounded border border-jade-200 dark:border-jade-800">
               <Zap className="w-3 h-3 mr-1" /> Live Feed Active
             </span>
             <span className="text-[var(--text-tertiary)] text-xs font-semibold">•</span>
             <span className="text-[var(--text-secondary)] font-semibold text-xs">Global Commodities Exchange</span>
          </div>
        </div>
        <button 
          onClick={refreshMarketPrices}
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-jade-800 dark:bg-sunburst-500 text-white dark:text-jade-950 border border-transparent rounded-lg hover:opacity-90 transition-all text-xs font-semibold shadow-lg active:scale-95"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Sync Quotes
        </button>
      </div>

      {/* Interactive Tickers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketPrices.map((item, index) => {
          const isSelected = selectedCrop === item.cropName;
          return (
            <div 
              key={index} 
              onClick={() => setSelectedCrop(item.cropName)}
              className={`
                cursor-pointer relative p-5 shadow-sm hover:shadow-xl transition-all duration-300 group rounded-xl
                ${isSelected 
                  ? 'bg-jade-800 dark:bg-jade-900 scale-105 z-10 border-l-4 border-l-sunburst-500 ring-1 ring-sunburst-500/20' 
                  : 'card-surface border-l-4 border-l-terra-300 dark:border-l-jade-700 hover:scale-[1.02]'}
              `}
            >
              {isSelected && <div className="absolute top-2 right-2"><MousePointer2 className="w-4 h-4 text-sunburst-500 animate-pulse"/></div>}
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-[var(--text-primary)]'}`}>{item.cropName}</h3>
                <div className={`p-1 rounded ${item.trend === 'up' ? 'bg-jade-100 text-jade-700 dark:bg-jade-900/50 dark:text-jade-300' : item.trend === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' : 'bg-terra-100 text-terra-600 dark:bg-terra-800/50 dark:text-terra-400'}`}>
                   {item.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                   {item.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                   {item.trend === 'stable' && <Minus className="w-4 h-4" />}
                </div>
              </div>
              <div className="flex items-end gap-2 mb-1">
                <span className={`text-3xl font-bold font-heading ${isSelected ? 'text-sunburst-400' : 'text-[var(--text-primary)]'}`}>${item.price.toFixed(2)}</span>
                <span className={`text-xs font-bold mb-1.5 ${item.changePercentage > 0 ? 'text-jade-600 dark:text-jade-400' : 'text-red-600 dark:text-red-400'}`}>
                  {item.changePercentage > 0 ? '+' : ''}{item.changePercentage}%
                </span>
              </div>
              <div className={`text-[10px] font-semibold ${isSelected ? 'text-jade-300' : 'text-[var(--text-tertiary)]'}`}>
                 Per {item.unit}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MAIN CHART: Price Action */}
        <div className="lg:col-span-2 card-surface p-6">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                 <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Activity className="w-5 h-5 text-jade-600 dark:text-jade-400" />
                    Price Action: {selectedCrop}
                 </h3>
                 <p className="text-xs text-[var(--text-secondary)] font-medium mt-1">Real-time exchange data & volatility analysis</p>
              </div>
              <div className="flex bg-terra-100 dark:bg-jade-900/50 p-1 rounded-lg border border-terra-200 dark:border-jade-800">
                 {['1W', '1M', '3M'].map((range) => (
                    <button 
                      key={range}
                      onClick={() => setTimeRange(range as any)}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${timeRange === range ? 'bg-white dark:bg-jade-800 text-[var(--text-primary)] shadow-sm border border-terra-200 dark:border-jade-700' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'}`}
                    >
                       {range}
                    </button>
                 ))}
              </div>
           </div>

           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={historyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                       <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartAccent} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={chartAccent} stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: axisColor, fontSize: 11, fontWeight: 700}} 
                      dy={10}
                      minTickGap={30}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: axisColor, fontSize: 11, fontWeight: 700}}
                      domain={['auto', 'auto']}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: tooltipBg, 
                        borderRadius: '12px', 
                        border: `1px solid ${tooltipBorder}`,
                        color: tooltipText,
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        padding: '12px'
                      }}
                      itemStyle={{ color: tooltipText, fontSize: '12px', fontWeight: '600' }}
                      labelStyle={{ color: axisColor, fontSize: '10px', fontWeight: '700', marginBottom: '8px', textTransform: 'none' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke={chartAccent} 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                      name="Closing Price"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ma" 
                       stroke="#CC9A00"
                      strokeWidth={2} 
                      strokeDasharray="5 5" 
                      dot={false}
                      name="Moving Avg (7D)" 
                    />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* SIDEBAR: Sentiment & Depth */}
        <div className="space-y-6">
           
           {/* Market Sentiment Card */}
           <div className="bg-jade-950 text-white p-6 rounded-xl shadow-xl relative overflow-hidden border border-jade-800">
              <div className="absolute inset-0 bg-gradient-to-br from-jade-900 to-jade-950 z-0"></div>
              <div className="relative z-10">
                 <h4 className="text-xs font-semibold text-jade-400 mb-4 flex items-center">
                    <PieChart className="w-4 h-4 mr-2" /> Market Sentiment
                 </h4>
                 
                 <div className="flex justify-between items-end mb-2">
                    <span className="text-3xl font-black text-sunburst-400">{activeTickerData?.trend === 'up' ? 'BULLISH' : activeTickerData?.trend === 'down' ? 'BEARISH' : 'NEUTRAL'}</span>
                    <div className={`p-2 rounded-lg ${activeTickerData?.trend === 'up' ? 'bg-jade-500/20 text-jade-400' : activeTickerData?.trend === 'down' ? 'bg-red-500/20 text-red-400' : 'bg-terra-500/20 text-terra-400'}`}>
                       {activeTickerData?.trend === 'up' ? <ArrowUpRight className="w-6 h-6"/> : activeTickerData?.trend === 'down' ? <ArrowDownRight className="w-6 h-6"/> : <Minus className="w-6 h-6"/>}
                    </div>
                 </div>
                 
                 <div className="w-full h-2 bg-jade-800 rounded-full mt-2 overflow-hidden flex">
                    <div className="h-full bg-jade-500 transition-all duration-1000" style={{ width: activeTickerData?.trend === 'up' ? '75%' : activeTickerData?.trend === 'down' ? '25%' : '50%' }}></div>
                    <div className="h-full bg-red-500 flex-1"></div>
                 </div>
                 <div className="flex justify-between text-[10px] font-semibold mt-2 text-jade-400">
                    <span>Buy Pressure</span>
                    <span>Sell Pressure</span>
                 </div>

                 <div className="organic-divider !border-t-0 my-4"></div>

                 <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-jade-400">Volatility Index</span>
                    <span className="text-sm font-bold text-sunburst-400">High (14.2)</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-jade-400">24h Volume</span>
                    <span className="text-sm font-bold text-jade-300">4.2M Tons</span>
                 </div>
              </div>
           </div>

           {/* Live Feed Simulator */}
           <div className="card-surface p-6">
              <h4 className="text-xs font-semibold text-[var(--text-secondary)] mb-4 flex items-center">
                 <Clock className="w-4 h-4 mr-2" /> Live Order Flow
              </h4>
              <div className="space-y-3">
                 {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center justify-between text-xs animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                       <div className="flex items-center gap-2">
                          <span className="text-[var(--text-tertiary)] font-mono font-medium">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${i % 2 === 0 ? 'bg-jade-100 text-jade-700 dark:bg-jade-900/30 dark:text-jade-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                             {i % 2 === 0 ? 'BUY' : 'SELL'}
                          </span>
                       </div>
                       <span className="font-bold text-[var(--text-primary)]">
                           {[150, 350, 250][i]}T @ ${activeTickerData?.price?.toFixed(2) ?? '—'}
                       </span>
                    </div>
                 ))}
              </div>
           </div>

        </div>
      </div>

      {/* SECONDARY CHART: Profitability Squeeze */}
      <div className="card-surface p-6">
        <div className="flex items-center justify-between mb-6">
           <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] font-heading">Financial Resilience</h3>
              <p className="text-xs text-[var(--text-secondary)] font-semibold mt-1">Yearly Revenue vs Input Costs Analysis</p>
           </div>
           <div className="hidden md:flex gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
                 <div className="w-3 h-3 bg-jade-500 rounded-full"></div> Gross Revenue
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
                 <div className="w-3 h-3 bg-sunburst-600 rounded-full"></div> Input Costs
              </div>
           </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={financialData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: axisColor, fontSize: 12, fontWeight: 700}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: axisColor, fontSize: 12, fontWeight: 700}}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{
                  backgroundColor: tooltipBg, 
                  borderRadius: '12px', 
                  border: `1px solid ${tooltipBorder}`,
                  color: tooltipText,
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend verticalAlign="top" height={36} content={() => null} />
               <Area 
                 type="monotone" 
                 dataKey="value" 
                 name="Revenue"
                 stroke="#069669" 
                 strokeWidth={3}
                 fillOpacity={0.1} 
                 fill="#069669" 
               />
               <Line 
                 type="monotone" 
                 dataKey="cost" 
                 name="Input Costs"
                 stroke="#CC9A00" 
                 strokeWidth={3}
                 dot={{ r: 4, strokeWidth: 0, fill: '#CC9A00' }}
               />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalytics;

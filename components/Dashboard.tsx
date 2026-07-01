
import React, { useState, useEffect } from 'react';
import { CloudRain, Wind, Droplets, Thermometer, AlertTriangle, Calendar, CheckSquare, Square, MapPin, Activity, ShieldCheck, TrendingDown, TrendingUp, Sparkles, Loader2, Navigation, MapPinOff, Globe, X, Sprout, Beef, ArrowUpRight, ArrowDownRight, Minus, Clock, BarChart3, Leaf, Zap, Sun, Cloud, CloudDrizzle, DollarSign, Wallet } from 'lucide-react';
import { useFarm } from '../contexts/FarmContext';
import { generateDailyTasks, getLiveAgriIntel, CountryContext, isAIConfigured, isWeatherSimulated } from '../services/geminiService';
import { formatArea, formatCurrency } from '../utils/localeFormat';

const Dashboard: React.FC = () => {
  const { tasks, toggleTask, crops, addTask, livestock, marketPrices, userLocation, weather, alerts, userProfile, cropExpenses, cropIncomes } = useFarm();

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [liveIntel, setLiveIntel] = useState<string | null>(null);
  const [isLoadingIntel, setIsLoadingIntel] = useState(false);
  const [showWeatherAlert, setShowWeatherAlert] = useState(true);

  useEffect(() => {
    const fetchIntel = async () => {
      setIsLoadingIntel(true);
      try {
        const intel = await getLiveAgriIntel(countryCtx);
        setLiveIntel(intel);
      } catch (e) {
        console.error("Intel fetch failed", e);
      } finally {
        setIsLoadingIntel(false);
      }
    };
    fetchIntel();
  }, []);

  useEffect(() => {
    if (weather.climateRiskIndex === 'High' || weather.climateRiskIndex === 'Severe') {
      setShowWeatherAlert(true);
    }
  }, [weather.climateRiskIndex]);

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'Low': return 'text-jade-600 dark:text-jade-400';
      case 'Moderate': return 'text-sunburst-600 dark:text-sunburst-400';
      case 'High': return 'text-sunburst-600 dark:text-sunburst-400';
      case 'Severe': return 'text-red-600 dark:text-red-400 animate-pulse';
      default: return 'text-terra-500';
    }
  };

  const getRiskBg = (risk: string) => {
    switch(risk) {
      case 'Low': return 'bg-jade-50 dark:bg-jade-900/20 border-jade-200 dark:border-jade-800';
      case 'Moderate': return 'bg-sunburst-50 dark:bg-sunburst-900/20 border-sunburst-200 dark:border-sunburst-800';
      case 'High': return 'bg-sunburst-50 dark:bg-sunburst-900/20 border-sunburst-200 dark:border-sunburst-800';
      case 'Severe': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default: return 'bg-terra-50 dark:bg-jade-900/20 border-terra-200 dark:border-jade-800';
    }
  };

  const getWeatherGradient = () => {
    const condition = weather.condition?.toLowerCase() || '';
    if (condition.includes('rain') || condition.includes('shower') || condition.includes('drizzle')) {
      return 'from-jade-800 via-jade-700 to-jade-600';
    }
    if (condition.includes('cloud') || condition.includes('overcast')) {
      return 'from-jade-700 via-jade-600 to-jade-700';
    }
    if (condition.includes('sunny') || condition.includes('clear') || condition.includes('fair')) {
      return 'from-amber-600 via-orange-500 to-amber-500';
    }
    if (condition.includes('storm') || condition.includes('thunder')) {
      return 'from-jade-900 via-jade-800 to-jade-700';
    }
    return 'from-jade-700 via-jade-600 to-emerald-600';
  };

  const getWeatherIcon = () => {
    const condition = weather.condition?.toLowerCase() || '';
    if (condition.includes('rain') || condition.includes('shower') || condition.includes('drizzle')) return <CloudDrizzle className="w-12 h-12 text-white/90" />;
    if (condition.includes('cloud') || condition.includes('overcast')) return <Cloud className="w-12 h-12 text-white/90" />;
    if (condition.includes('sunny') || condition.includes('clear') || condition.includes('fair')) return <Sun className="w-12 h-12 text-sunburst-300" />;
    return <Sun className="w-12 h-12 text-white/90" />;
  };

  const handleTaskKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTask(id);
    }
  };

  const handleGenerateTasks = async () => {
    setIsGenerating(true);
    try {
      const jsonString = await generateDailyTasks(weather, crops, countryCtx);
      try {
        const newTasks: string[] = JSON.parse(jsonString);
        newTasks.forEach(taskText => addTask(taskText));
      } catch (parseError) {
        console.error("Failed to parse AI task response:", jsonString);
      }
    } catch (error) {
      console.error("Failed to generate tasks", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const healthyCrops = crops.filter(c => c.status === 'Healthy').length;
  const attentionCrops = crops.filter(c => c.status !== 'Healthy' && c.status !== 'Harvest Ready').length;
  const healthyLivestock = livestock.filter(l => l.status === 'Healthy').length;
  const totalLivestockCount = livestock.reduce((sum, l) => sum + l.count, 0);
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const completedToday = tasks.filter(t => t.completed).length;

  const totalExpenses = cropExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncomes = cropIncomes.reduce((sum, i) => sum + i.totalAmount, 0);
  const farmProfit = totalIncomes - totalExpenses;

  return (
    <div className="space-y-6 animate-fade-in pb-8">

      {/* Climate Risk Alert Banner */}
      {showWeatherAlert && (weather.climateRiskIndex === 'High' || weather.climateRiskIndex === 'Severe') && (
        <div className="bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-200 p-4 rounded-2xl shadow-sm flex justify-between items-start animate-fade-in-up">
            <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400" />
                <div>
                    <h3 className="font-bold text-sm">Weather Advisory</h3>
                    <p className="text-sm mt-0.5 font-medium opacity-80">{weather.forecast}</p>
                </div>
            </div>
            <button
              onClick={() => setShowWeatherAlert(false)}
              className="text-red-400 hover:text-red-600 dark:hover:text-red-200 transition-colors p-1"
              aria-label="Dismiss alert"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
      )}

       {/* Page Header */}
       <header className="mb-2 flex flex-col md:flex-row md:items-end justify-between pb-4 organic-divider pb-5">
         <div>
          <div className="flex items-center mt-2 gap-3 flex-wrap">
             {userLocation.latitude && userLocation.longitude ? (
               <span className="inline-flex items-center text-secondary-dynamic bg-terra-100/60 dark:bg-jade-900/30 px-2.5 py-1 rounded-lg text-xs font-medium border border-terra-200/60 dark:border-jade-800/60">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-jade-600 dark:text-jade-400" />
                  {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
               </span>
             ) : (
                <span className="inline-flex items-center text-terra-400 dark:text-jade-400 bg-terra-50 dark:bg-jade-900/20 px-2.5 py-1 rounded-lg text-xs font-medium border border-terra-200 dark:border-jade-800">
                  <MapPinOff className="w-3.5 h-3.5 mr-1.5" />
                  {userLocation.error ? 'Location unavailable' : 'Locating...'}
               </span>
             )}
              <span className="text-terra-300 dark:text-jade-700">·</span>
              <span className="text-secondary-dynamic text-xs font-medium">Season 2026</span>
              <span className="text-terra-300 dark:text-jade-700">·</span>
             <span className="text-secondary-dynamic text-xs font-medium">{weather.locationName}</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border font-semibold text-xs ${getRiskBg(weather.climateRiskIndex)}`}>
            <ShieldCheck className="w-4 h-4" />
            <span className={getRiskColor(weather.climateRiskIndex)}>{weather.climateRiskIndex} Climate Risk</span>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: 'Active Crops',
            value: crops.length.toString(),
            detail: `${healthyCrops} healthy, ${attentionCrops} need attention`,
            icon: Sprout,
            iconBg: 'bg-jade-50 dark:bg-jade-900/30',
            iconColor: 'text-jade-600 dark:text-jade-400',
            borderColor: 'border-jade-200/60 dark:border-jade-800/40',
            trend: healthyCrops > attentionCrops ? 'up' : 'down',
            trendLabel: healthyCrops > attentionCrops ? 'Mostly healthy' : 'Attention needed',
          },
          {
            label: 'Livestock',
            value: totalLivestockCount.toString(),
            detail: `${livestock.length} herds, ${healthyLivestock} healthy`,
            icon: Beef,
            iconBg: 'bg-sunburst-50 dark:bg-sunburst-900/20',
            iconColor: 'text-sunburst-600 dark:text-sunburst-400',
            borderColor: 'border-sunburst-200/60 dark:border-sunburst-800/30',
            trend: 'up',
            trendLabel: 'All monitored',
          },
          {
            label: 'Tasks',
            value: `${completedToday}/${tasks.length}`,
            detail: `${pendingTasks} remaining today`,
            icon: Calendar,
            iconBg: 'bg-blue-50 dark:bg-blue-900/20',
            iconColor: 'text-blue-600 dark:text-blue-400',
            borderColor: 'border-blue-200/60 dark:border-blue-800/30',
            trend: pendingTasks === 0 ? 'up' : pendingTasks > 5 ? 'down' : 'neutral',
            trendLabel: pendingTasks === 0 ? 'All complete' : `${pendingTasks} pending`,
          },
          {
            label: 'Active Alerts',
            value: alerts.length.toString(),
            detail: alerts.filter(a => a.severity === 'critical').length > 0 ? 'Critical alert active' : 'No critical alerts',
            icon: AlertTriangle,
            iconBg: alerts.filter(a => a.severity === 'critical').length > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-terra-50 dark:bg-jade-900/30',
            iconColor: alerts.filter(a => a.severity === 'critical').length > 0 ? 'text-red-600 dark:text-red-400' : 'text-terra-400 dark:text-jade-400',
            borderColor: alerts.filter(a => a.severity === 'critical').length > 0 ? 'border-red-200/60 dark:border-red-800/30' : 'border-terra-200/60 dark:border-jade-800/40',
            trend: alerts.length === 0 ? 'up' : 'down',
            trendLabel: alerts.length === 0 ? 'All clear' : 'Review needed',
          },
          {
            label: 'Farm Profit',
            value: formatCurrency(farmProfit, userProfile.currencyCode || 'USD', userProfile.currencySymbol || '$'),
            detail: `${formatCurrency(totalExpenses, userProfile.currencyCode || 'USD', userProfile.currencySymbol || '$')} spent · ${formatCurrency(totalIncomes, userProfile.currencyCode || 'USD', userProfile.currencySymbol || '$')} earned`,
            icon: Wallet,
            iconBg: farmProfit >= 0 ? 'bg-jade-50 dark:bg-jade-900/30' : 'bg-red-50 dark:bg-red-900/20',
            iconColor: farmProfit >= 0 ? 'text-jade-600 dark:text-jade-400' : 'text-red-600 dark:text-red-400',
            borderColor: farmProfit >= 0 ? 'border-jade-200/60 dark:border-jade-800/40' : 'border-red-200/60 dark:border-red-800/30',
            trend: farmProfit >= 0 ? 'up' : 'down',
            trendLabel: farmProfit >= 0 ? 'Profitable' : 'Loss',
          },
        ].map((kpi, i) => (
          <div key={kpi.label} className={`card-surface leaf-glow p-5 opacity-0 animate-stagger-${i + 1} border ${kpi.borderColor}`}>
            <div className="flex items-start justify-between mb-3 relative z-10">
              <div className={`p-2.5 rounded-xl ${kpi.iconBg} shadow-sm`}>
                <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium">
                {kpi.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 text-jade-500" />}
                {kpi.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 text-orange-500" />}
                {kpi.trend === 'neutral' && <Minus className="w-3.5 h-3.5 text-terra-400" />}
                <span className={kpi.trend === 'up' ? 'text-jade-600 dark:text-jade-400' : kpi.trend === 'down' ? 'text-orange-600 dark:text-orange-400' : 'text-secondary-dynamic'}>
                  {kpi.trendLabel}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-primary-dynamic relative z-10">{kpi.value}</div>
            <p className="text-xs text-secondary-dynamic mt-1 relative z-10">{kpi.detail}</p>
          </div>
        ))}
      </div>

      {/* Weather Section — Atmospheric Gradient Header */}
      <section className="relative overflow-hidden rounded-2xl shadow-lg animate-stagger-5" aria-label="Weather Conditions">
        <div className={`bg-gradient-to-br ${getWeatherGradient()} p-6 md:p-8 relative`}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="animate-float">
                {getWeatherIcon()}
              </div>
              <div>
                <h3 className="text-white/70 text-sm font-semibold mb-1">Weather Conditions{isWeatherSimulated() && <span className="ml-1.5 px-1 py-0.5 bg-white/20 text-white text-[8px] font-bold rounded uppercase tracking-wide">Estimated</span>}</h3>
                <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">{weather.temp}°C</div>
                <p className="text-white/80 text-sm font-medium mt-1">{weather.condition}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-6 flex-1 max-w-md">
              <div className="text-center">
                <Droplets className="w-5 h-5 text-white/50 mx-auto mb-1.5" />
                <div className="text-xl font-bold text-white">{weather.humidity}%</div>
                <div className="text-[10px] text-white/60 font-medium mt-0.5">Humidity</div>
              </div>
              <div className="text-center">
                <Wind className="w-5 h-5 text-white/50 mx-auto mb-1.5" />
                <div className="text-xl font-bold text-white">{weather.windSpeed}<span className="text-sm font-normal text-white/50 ml-0.5">km/h</span></div>
                <div className="text-[10px] text-white/60 font-medium mt-0.5">Wind</div>
              </div>
              <div className="text-center">
                <Activity className="w-5 h-5 text-white/50 mx-auto mb-1.5" />
                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg ${getRiskBg(weather.climateRiskIndex)} ${getRiskColor(weather.climateRiskIndex)}`}>
                  {weather.climateRiskIndex}
                </span>
                <div className="text-[10px] text-white/60 font-medium mt-1.5">Risk Level</div>
              </div>
            </div>
          </div>

          {weather.forecast && (
            <div className="relative z-10 mt-5 pt-4 border-t border-white/15">
              <p className="text-white/70 text-xs font-medium">{weather.forecast}</p>
            </div>
          )}
        </div>
      </section>

      {/* Market Intelligence */}
      <section className="card-surface sun-glow p-6 relative overflow-hidden animate-stagger-6">
        <div className="flex items-center mb-4 relative z-10">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400 mr-3 shadow-sm">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-primary-dynamic font-heading">Market Intelligence</h3>
          {!isAIConfigured() && (
            <span className="ml-2 px-1.5 py-0.5 bg-terra-200 dark:bg-terra-800 text-terra-700 dark:text-terra-300 text-[9px] font-bold rounded uppercase tracking-wide">Simulated</span>
          )}
          {isLoadingIntel && <Loader2 className="w-4 h-4 text-terra-400 dark:text-jade-400 animate-spin ml-3" />}
        </div>
        <div className="text-secondary-dynamic text-sm leading-relaxed relative z-10">
          {liveIntel ? (
            liveIntel.split('\n').map((line, i) => <p key={i} className="mb-2.5 last:mb-0 border-l-2 border-jade-500 dark:border-jade-400 pl-3.5">{line}</p>)
          ) : (
            <div className="flex items-center gap-2 text-terra-400 dark:text-jade-400 italic">
              <Loader2 className="w-3.5 h-3.5 animate-spin"/>
              <span>Loading market update...</span>
            </div>
          )}
        </div>
      </section>

      {/* Two-Column: Alerts + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Alerts Panel */}
        <div className="card-surface overflow-hidden opacity-0 animate-stagger-3">
          <div className="p-5 organic-divider pb-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-orange-600 dark:text-orange-400 mr-3 shadow-sm">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-primary-dynamic font-heading">Active Alerts</h3>
            </div>
            {alerts.length > 0 && <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-bold px-2.5 py-1 rounded-full">{alerts.length}</span>}
          </div>
          <div className="divide-y divide-terra-100/60 dark:divide-jade-800/40">
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-secondary-dynamic">
                <div className="w-12 h-12 bg-jade-50 dark:bg-jade-900/20 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-jade-600 dark:text-jade-400" />
                </div>
                <p className="font-semibold text-sm text-primary-dynamic">No active alerts</p>
                <p className="text-xs mt-1 text-secondary-dynamic">Your farm is looking good</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="p-4 hover:bg-terra-50/50 dark:hover:bg-jade-900/20 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-primary-dynamic text-sm">{alert.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0 ml-2 ${
                      alert.category === 'FINANCIAL' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                      alert.category === 'WEATHER' ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                      alert.category === 'LAND' ? 'bg-jade-50 text-jade-700 dark:bg-jade-900/30 dark:text-jade-300' :
                      'bg-terra-50 text-terra-700 dark:bg-jade-900/30 dark:text-jade-300'
                    }`}>
                      {alert.category}
                    </span>
                  </div>
                  <p className="text-sm text-secondary-dynamic leading-relaxed">{alert.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Daily Tasks Panel */}
        <div className="card-surface overflow-hidden opacity-0 animate-stagger-4">
          <div className="p-5 organic-divider pb-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400 mr-3 shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-primary-dynamic font-heading">Daily Tasks</h3>
            </div>
              <button
                onClick={handleGenerateTasks}
                disabled={isGenerating}
                className="flex items-center gap-2 text-jade-600 dark:text-jade-400 hover:text-jade-700 dark:hover:text-jade-300 text-xs font-bold transition-colors disabled:opacity-50 bg-jade-50 dark:bg-jade-900/20 px-4 py-2 rounded-lg border border-jade-200 dark:border-jade-800"
              >
                {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {isGenerating ? "Generating..." : "AI Generate"}
                {!isAIConfigured() && <span className="px-1 py-0.5 bg-terra-200 dark:bg-terra-800 text-terra-700 dark:text-terra-300 text-[8px] font-bold rounded">SIM</span>}
              </button>
          </div>

          <div className="bg-terra-50/60 dark:bg-jade-900/20 px-5 py-2.5 border-b border-terra-100/60 dark:border-jade-800/40 text-xs font-semibold text-secondary-dynamic flex justify-between">
            <span>{pendingTasks} remaining</span>
            <span>{completedToday} completed</span>
          </div>

          <div role="list" className="max-h-80 overflow-y-auto custom-scrollbar">
            {tasks.map((task) => (
               <div
                 key={task.id}
                 role="checkbox"
                 aria-checked={task.completed}
                 tabIndex={0}
                 onClick={() => toggleTask(task.id)}
                 onKeyDown={(e) => handleTaskKeyDown(e, task.id)}
                  className={`
                    flex items-center p-5 cursor-pointer border-b border-terra-100/40 dark:border-jade-800/30 last:border-0 hover:bg-terra-50/40 dark:hover:bg-jade-900/15 transition-colors
                    ${task.completed ? 'opacity-50' : ''}
                  `}
               >
                 <div className={`mr-3 ${task.completed ? 'text-terra-300 dark:text-jade-800' : 'text-jade-600 dark:text-jade-500'}`}>
                  {task.completed ? <CheckSquare className="w-[18px] h-[18px]" /> : <Square className="w-[18px] h-[18px]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-terra-400 dark:text-jade-500' : 'text-primary-dynamic'}`}>
                    {task.text}
                  </p>
                  {task.priority === 'high' && !task.completed && (
                    <span className="inline-block mt-1 text-[10px] bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-lg font-semibold">
                      Priority
                    </span>
                  )}
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-terra-100 dark:bg-jade-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-terra-400 dark:text-jade-400 shadow-sm">
                  <Calendar className="w-6 h-6"/>
                </div>
                <p className="text-secondary-dynamic font-medium text-sm">No tasks scheduled</p>
                <button onClick={handleGenerateTasks} className="mt-2 text-jade-600 dark:text-jade-400 text-xs font-bold hover:underline">Generate with AI</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Crop Status Quick View */}
      {crops.length > 0 && (
        <section className="card-surface overflow-hidden animate-fade-in-up">
          <div className="p-5 organic-divider pb-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-2 bg-jade-50 dark:bg-jade-900/20 rounded-xl text-jade-600 dark:text-jade-400 mr-3 shadow-sm">
                <Sprout className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-primary-dynamic font-heading">Crop Status Overview</h3>
            </div>
            <span className="text-xs font-medium text-secondary-dynamic">{crops.length} total</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-terra-100/60 dark:divide-jade-800/40">
            {crops.map(crop => {
              const statusStyles: Record<string, string> = {
                'Healthy': 'bg-jade-50 dark:bg-jade-900/20 text-jade-700 dark:text-jade-300 border-jade-200 dark:border-jade-800',
                'Needs Attention': 'bg-sunburst-50 dark:bg-sunburst-900/20 text-sunburst-700 dark:text-sunburst-300 border-sunburst-200 dark:border-sunburst-800',
                'Critical': 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
                'Harvest Ready': 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
              };
              const style = statusStyles[crop.status] || statusStyles['Healthy'];
              return (
                <div key={crop.id} className="p-4 flex items-center gap-3 hover:bg-terra-50/30 dark:hover:bg-jade-900/15 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${style} border shrink-0 shadow-sm`}>
                    {crop.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-primary-dynamic truncate">{crop.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-secondary-dynamic">{formatArea(crop.area, userProfile.areaUnit || 'ha')}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-lg ${style} border`}>{crop.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;


import React, { useState, useEffect } from 'react';
import { CloudRain, Wind, Droplets, Thermometer, AlertTriangle, Calendar, CheckSquare, Square, MapPin, Activity, ShieldCheck, TrendingDown, TrendingUp, Sparkles, Loader2, Navigation, MapPinOff, Globe, X, Sprout, Beef, ArrowUpRight, ArrowDownRight, Minus, Clock, BarChart3, Leaf, Zap } from 'lucide-react';
import { useFarm } from '../contexts/FarmContext';
import { generateDailyTasks, getLiveAgriIntel } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const { tasks, toggleTask, crops, addTask, livestock, marketPrices, userLocation, weather, alerts } = useFarm();
  const [isGenerating, setIsGenerating] = useState(false);
  const [liveIntel, setLiveIntel] = useState<string | null>(null);
  const [isLoadingIntel, setIsLoadingIntel] = useState(false);
  const [showWeatherAlert, setShowWeatherAlert] = useState(true);

  useEffect(() => {
    const fetchIntel = async () => {
      setIsLoadingIntel(true);
      try {
        const intel = await getLiveAgriIntel();
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
      case 'Low': return 'text-green-600 dark:text-green-500';
      case 'Moderate': return 'text-yellow-600 dark:text-yellow-500';
      case 'High': return 'text-orange-600 dark:text-orange-500';
      case 'Severe': return 'text-red-600 dark:text-red-500 animate-pulse';
      default: return 'text-slate-500';
    }
  };

  const getRiskBg = (risk: string) => {
    switch(risk) {
      case 'Low': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'Moderate': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'High': return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'Severe': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default: return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
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
      const jsonString = await generateDailyTasks(weather, crops);
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

  return (
    <div className="space-y-6 animate-fade-in pb-8">

      {/* Climate Risk Alert Banner */}
      {showWeatherAlert && (weather.climateRiskIndex === 'High' || weather.climateRiskIndex === 'Severe') && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-xl shadow-sm flex justify-between items-start animate-fade-in-up">
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
      <header className="mb-2 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h2>
          <div className="flex items-center mt-2 gap-3 flex-wrap">
             {userLocation.latitude && userLocation.longitude ? (
               <span className="inline-flex items-center text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-green-600 dark:text-green-400" />
                  {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
               </span>
             ) : (
               <span className="inline-flex items-center text-slate-500 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700">
                  <MapPinOff className="w-3.5 h-3.5 mr-1.5" />
                  {userLocation.error ? 'Location unavailable' : 'Locating...'}
               </span>
             )}
             <span className="text-slate-400 dark:text-slate-600">|</span>
             <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Season 2025</span>
             <span className="text-slate-400 dark:text-slate-600">|</span>
             <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">{weather.locationName}</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-medium text-xs ${getRiskBg(weather.climateRiskIndex)}`}>
            <ShieldCheck className="w-4 h-4" />
            <span className={getRiskColor(weather.climateRiskIndex)}>{weather.climateRiskIndex} Climate Risk</span>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Active Crops',
            value: crops.length.toString(),
            detail: `${healthyCrops} healthy, ${attentionCrops} need attention`,
            icon: Sprout,
            iconBg: 'bg-green-50 dark:bg-green-900/20',
            iconColor: 'text-green-600 dark:text-green-400',
            trend: healthyCrops > attentionCrops ? 'up' : 'down',
            trendLabel: healthyCrops > attentionCrops ? 'Mostly healthy' : 'Attention needed',
          },
          {
            label: 'Livestock',
            value: totalLivestockCount.toString(),
            detail: `${livestock.length} herds, ${healthyLivestock} healthy`,
            icon: Beef,
            iconBg: 'bg-amber-50 dark:bg-amber-900/20',
            iconColor: 'text-amber-600 dark:text-amber-400',
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
            trend: pendingTasks === 0 ? 'up' : pendingTasks > 5 ? 'down' : 'neutral',
            trendLabel: pendingTasks === 0 ? 'All complete' : `${pendingTasks} pending`,
          },
          {
            label: 'Active Alerts',
            value: alerts.length.toString(),
            detail: alerts.filter(a => a.severity === 'critical').length > 0 ? 'Critical alert active' : 'No critical alerts',
            icon: AlertTriangle,
            iconBg: alerts.filter(a => a.severity === 'critical').length > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-slate-50 dark:bg-slate-800',
            iconColor: alerts.filter(a => a.severity === 'critical').length > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400',
            trend: alerts.length === 0 ? 'up' : 'down',
            trendLabel: alerts.length === 0 ? 'All clear' : 'Review needed',
          },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${kpi.iconBg}`}>
                <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium">
                {kpi.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />}
                {kpi.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 text-orange-500" />}
                {kpi.trend === 'neutral' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
                <span className={kpi.trend === 'up' ? 'text-green-600 dark:text-green-400' : kpi.trend === 'down' ? 'text-orange-600 dark:text-orange-400' : 'text-slate-500'}>
                  {kpi.trendLabel}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{kpi.value}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{kpi.detail}</p>
          </div>
        ))}
      </div>

      {/* Weather Section */}
      <section className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800" aria-label="Weather Conditions">
        <div className="flex items-center mb-5">
          <Thermometer className="w-5 h-5 mr-2 text-orange-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Weather Conditions</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Temperature</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{weather.temp}°C</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">{weather.condition}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Humidity</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{weather.humidity}%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Relative moisture</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Wind Speed</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{weather.windSpeed} <span className="text-base font-normal text-slate-500">km/h</span></div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Surface wind</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Forecast</span>
            <div className="text-sm font-medium text-slate-900 dark:text-white mt-2 leading-snug">{weather.forecast}</div>
            <div className="mt-2">
              <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-md ${getRiskBg(weather.climateRiskIndex)} ${getRiskColor(weather.climateRiskIndex)}`}>
                {weather.climateRiskIndex} Risk
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Market Intelligence */}
      <section className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 mr-3">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Market Intelligence</h3>
          {isLoadingIntel && <Loader2 className="w-4 h-4 text-slate-400 animate-spin ml-3" />}
        </div>
        <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          {liveIntel ? (
            liveIntel.split('\n').map((line, i) => <p key={i} className="mb-2 last:mb-0 border-l-2 border-blue-500 pl-3">{line}</p>)
          ) : (
            <div className="flex items-center gap-2 text-slate-500 italic">
              <Loader2 className="w-3 h-3 animate-spin"/>
              <span>Loading market update...</span>
            </div>
          )}
        </div>
      </section>

      {/* Two-Column: Alerts + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Alerts Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Alerts</h3>
            </div>
            {alerts.length > 0 && <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-xs font-bold px-2.5 py-1 rounded-full">{alerts.length}</span>}
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="font-medium text-sm">No active alerts</p>
                <p className="text-xs mt-1 text-slate-400">All systems operating normally</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{alert.title}</h4>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                      alert.category === 'FINANCIAL' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' :
                      alert.category === 'WEATHER' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200' :
                      alert.category === 'LAND' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' :
                      'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                    }`}>
                      {alert.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{alert.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Daily Tasks Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-slate-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Daily Tasks</h3>
            </div>
            <button
              onClick={handleGenerateTasks}
              disabled={isGenerating}
              className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-bold transition-colors disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {isGenerating ? "Generating..." : "AI Generate"}
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-2.5 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 flex justify-between">
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
                  flex items-center p-4 cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors focus:outline-none
                  ${task.completed ? 'opacity-60' : ''}
                `}
              >
                <div className={`mr-3 ${task.completed ? 'text-slate-400 dark:text-slate-600' : 'text-green-600 dark:text-green-500'}`}>
                  {task.completed ? <CheckSquare className="w-4.5 h-4.5" /> : <Square className="w-4.5 h-4.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                    {task.text}
                  </p>
                  {task.priority === 'high' && !task.completed && (
                    <span className="inline-block mt-1 text-[10px] bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-full font-semibold">
                      Priority
                    </span>
                  )}
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Calendar className="w-6 h-6"/>
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">No tasks scheduled</p>
                <button onClick={handleGenerateTasks} className="mt-2 text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline">Generate with AI</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Crop Status Quick View */}
      {crops.length > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div className="flex items-center">
              <Sprout className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Crop Status Overview</h3>
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{crops.length} total</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
            {crops.map(crop => {
              const statusStyles: Record<string, string> = {
                'Healthy': 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
                'Needs Attention': 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
                'Critical': 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
                'Harvest Ready': 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
              };
              const style = statusStyles[crop.status] || statusStyles['Healthy'];
              return (
                <div key={crop.id} className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${style} border shrink-0`}>
                    {crop.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{crop.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500 dark:text-slate-400">{crop.area} ac</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${style} border`}>{crop.status}</span>
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

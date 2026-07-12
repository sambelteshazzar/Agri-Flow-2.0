import React from 'react';
import { Trash2, Pencil, Ruler, CalendarDays, Droplets, Droplet, Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Crop, CropExpense, CropIncome } from '@/types';
import { formatArea, formatCurrency } from '@/utils/localeFormat';
import { getStockImage as getCropImage } from '@/utils/stockImages';

interface CropCardProps {
  crop: Crop;
  areaUnit: string;
  expenses: CropExpense[];
  incomes: CropIncome[];
  currencyCode: string;
  currencySymbol: string;
  onLogActivity: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenFinancials: (id: string) => void;
  onEdit: (crop: Crop) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Healthy': return 'bg-jade-600';
    case 'Needs Attention': return 'bg-sunburst-500';
    case 'Critical': return 'bg-terra-600';
    case 'Harvest Ready': return 'bg-blue-600';
    default: return 'bg-terra-300';
  }
};

const getWaterEfficiencyColor = (efficiency: string) => {
  switch (efficiency) {
    case 'High': return 'bg-jade-100 border-jade-200 text-jade-800 dark:bg-jade-900/30 dark:border-jade-800 dark:text-jade-300';
    case 'Moderate': return 'bg-sunburst-100 border-sunburst-200 text-sunburst-800 dark:bg-sunburst-900/30 dark:border-sunburst-800 dark:text-sunburst-300';
    case 'Low': return 'bg-red-100 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300';
    default: return 'bg-[var(--bg-content)] border-[var(--border-card)] text-[var(--text-primary)] dark:bg-jade-900/30 dark:border-jade-800 dark:text-jade-300';
  }
};

const CropCard: React.FC<CropCardProps> = ({ crop, areaUnit, expenses, incomes, currencyCode, currencySymbol, onLogActivity, onDelete, onOpenFinancials, onEdit }) => {
  const cropExpenses = expenses.filter(e => e.cropId === crop.id);
  const cropIncomes = incomes.filter(i => i.cropId === crop.id);
  const totalExp = cropExpenses.reduce((s, e) => s + e.amount, 0);
  const totalInc = cropIncomes.reduce((s, i) => s + i.totalAmount, 0);
  const profit = totalInc - totalExp;
  const hasFinancials = cropExpenses.length > 0 || cropIncomes.length > 0;

  return (
    <div className="bg-[var(--bg-card)] rounded-lg shadow-md border border-[var(--border-card)] overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300">
      <div className={`h-3 w-full ${getStatusColor(crop.status)}`}></div>
      <div className="relative h-56 bg-[var(--bg-content)]">
        <img
          src={crop.imageUrl || getCropImage(crop.name)}
          alt={crop.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = getCropImage(crop.name);
          }}
        />
        <div className="absolute top-0 right-0 bg-jade-950 text-white px-3 py-1 m-2 rounded text-xs font-semibold shadow-md border border-jade-700">{crop.status}</div>
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
          <h3 className="text-2xl font-bold text-white font-heading leading-none shadow-black drop-shadow-md">{crop.name}</h3>
          <span className="text-white text-sm font-semibold drop-shadow-md">{crop.variety}</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex gap-2 mb-4">
          <div className={`flex-1 p-2 rounded border-2 text-center ${getWaterEfficiencyColor(crop.waterEfficiency)}`}>
            <div className="text-[10px] font-semibold mb-1 flex justify-center items-center opacity-80">
              <Droplets className="w-3 h-3 mr-1" /> Water Eff.
            </div>
            <div className="text-sm font-bold flex items-center justify-center gap-1">
              <Droplet
                className={`w-3 h-3 ${
                  crop.waterEfficiency === 'High' ? 'text-jade-600 fill-jade-600 dark:text-jade-400 dark:fill-jade-400' :
                  crop.waterEfficiency === 'Moderate' ? 'text-sunburst-500 fill-sunburst-500 dark:text-sunburst-400 dark:fill-sunburst-400' :
                  crop.waterEfficiency === 'Low' ? 'text-red-600 fill-red-600 dark:text-red-400 dark:fill-red-400' : 'text-[var(--text-tertiary)]'
                }`}
              />
              {crop.waterEfficiency}
            </div>
          </div>
          <div className={`flex-1 p-2 rounded border-2 text-center ${crop.biodiversityScore < 40 ? 'bg-sunburst-50 border-sunburst-200 text-sunburst-800 dark:bg-sunburst-900/30 dark:border-sunburst-800 dark:text-sunburst-300' : 'bg-jade-50 border-jade-200 text-jade-800 dark:bg-jade-900/30 dark:border-jade-800 dark:text-jade-300'}`}>
            <div className="text-[10px] font-semibold mb-1 opacity-80">Biodiversity</div>
            <div className="text-sm font-bold">{crop.biodiversityScore}/100</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 border-b border-[var(--border-card)] pb-4">
          <div>
            <div className="flex items-center text-[var(--text-secondary)] text-xs font-semibold mb-1"><Ruler className="w-3 h-3 mr-1" /> Size</div>
            <div className="text-lg font-bold text-[var(--text-primary)]">{formatArea(crop.area, areaUnit)}</div>
          </div>
          <div>
            <div className="flex items-center text-[var(--text-secondary)] text-xs font-semibold mb-1"><CalendarDays className="w-3 h-3 mr-1" /> Harvest</div>
            <div className="text-lg font-bold text-[var(--text-primary)]">{new Date(crop.harvestDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
          </div>
        </div>

        {hasFinancials && (
          <div className="flex gap-2 mb-4 border-b border-[var(--border-card)] pb-4">
            <div className="flex-1 p-2 rounded border-2 text-center bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
              <div className="text-[10px] font-semibold text-red-600 dark:text-red-400 mb-1 flex items-center justify-center gap-1">
                <TrendingDown className="w-3 h-3" /> Spent
              </div>
              <div className="text-sm font-bold text-red-700 dark:text-red-300">{formatCurrency(totalExp, currencyCode, currencySymbol)}</div>
            </div>
            <div className="flex-1 p-2 rounded border-2 text-center bg-jade-50 border-jade-200 dark:bg-jade-900/20 dark:border-jade-800">
              <div className="text-[10px] font-semibold text-jade-600 dark:text-jade-400 mb-1 flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3" /> Earned
              </div>
              <div className="text-sm font-bold text-jade-700 dark:text-jade-300">{formatCurrency(totalInc, currencyCode, currencySymbol)}</div>
            </div>
            <div className={`flex-1 p-2 rounded border-2 text-center ${profit >= 0 ? 'bg-jade-50 border-jade-200 dark:bg-jade-900/20 dark:border-jade-800' : 'bg-terra-50 border-terra-200 dark:bg-terra-900/20 dark:border-terra-800'}`}>
              <div className={`text-[10px] font-semibold mb-1 flex items-center justify-center gap-1 ${profit >= 0 ? 'text-jade-600 dark:text-jade-400' : 'text-terra-600 dark:text-terra-400'}`}>
                <DollarSign className="w-3 h-3" /> Profit
              </div>
              <div className={`text-sm font-bold ${profit >= 0 ? 'text-jade-700 dark:text-jade-300' : 'text-terra-700 dark:text-terra-300'}`}>{profit >= 0 ? '+' : ''}{formatCurrency(profit, currencyCode, currencySymbol)}</div>
            </div>
          </div>
        )}

        <div className="mt-auto flex gap-2">
          <button onClick={() => onLogActivity(crop.id)} className="flex-1 py-3 bg-jade-800 dark:bg-jade-700 text-white text-sm font-semibold rounded hover:bg-jade-950 dark:hover:bg-jade-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-jade-500 cursor-pointer active:scale-95">
            Log Activity
          </button>
          <button onClick={() => onOpenFinancials(crop.id)} className="flex-1 py-3 bg-[var(--bg-content)] border-2 border-jade-600 text-jade-700 dark:text-jade-400 text-sm font-semibold rounded hover:bg-jade-50 dark:hover:bg-jade-900/20 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-jade-500 cursor-pointer active:scale-95 flex items-center justify-center gap-1">
            <Wallet className="w-4 h-4" /> Finances
          </button>
          <button onClick={() => onEdit(crop)} aria-label={`Edit ${crop.name} plot`} className="px-3 py-2 bg-[var(--bg-card)] text-[var(--text-secondary)] rounded hover:bg-jade-50 dark:hover:bg-jade-900/20 hover:text-jade-600 dark:hover:text-jade-400 transition-colors border-2 border-[var(--border-card)] hover:border-jade-200 focus:outline-none focus:ring-2 focus:ring-jade-500 cursor-pointer active:scale-95">
            <Pencil className="w-5 h-5" />
          </button>
          <button onClick={() => { if (window.confirm(`Delete "${crop.name}"? This cannot be undone.`)) onDelete(crop.id); }} aria-label={`Delete ${crop.name} plot`} className="px-3 py-2 bg-[var(--bg-card)] text-[var(--text-secondary)] rounded hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors border-2 border-[var(--border-card)] hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer active:scale-95">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropCard;

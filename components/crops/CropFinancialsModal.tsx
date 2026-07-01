import React, { useState, useMemo } from 'react';
import { X, DollarSign, TrendingUp, TrendingDown, Plus, Trash2, Pencil, Wallet } from 'lucide-react';
import { CropExpense, CropIncome } from '@/types';
import { formatCurrency } from '@/utils/localeFormat';

interface CropFinancialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cropName: string;
  cropId: string;
  expenses: CropExpense[];
  incomes: CropIncome[];
  onAddExpense: (data: Omit<CropExpense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  onUpdateExpense: (id: string, data: Partial<Omit<CropExpense, 'id' | 'cropId'>>) => void;
  onAddIncome: (data: Omit<CropIncome, 'id'>) => void;
  onDeleteIncome: (id: string) => void;
  onUpdateIncome: (id: string, data: Partial<Omit<CropIncome, 'id' | 'cropId'>>) => void;
  currencyCode: string;
  currencySymbol: string;
}

const EXPENSE_CATEGORIES: CropExpense['category'][] = ['Seeds', 'Fertilizer', 'Labor', 'Irrigation', 'Equipment', 'Pesticide', 'Transport', 'Other'];
const INCOME_TYPES: CropIncome['type'][] = ['Harvest Sale', 'Subsidy', 'Insurance Payout', 'Processing', 'Other'];

type Tab = 'expenses' | 'income';

const CropFinancialsModal: React.FC<CropFinancialsModalProps> = ({
  isOpen,
  onClose,
  cropName,
  cropId,
  expenses,
  incomes,
  onAddExpense,
  onDeleteExpense,
  onUpdateExpense,
  onAddIncome,
  onDeleteIncome,
  onUpdateIncome,
  currencyCode,
  currencySymbol
}) => {
  const [tab, setTab] = useState<Tab>('expenses');
  const [showForm, setShowForm] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editingIncomeId, setEditingIncomeId] = useState<string | null>(null);

  const [expCategory, setExpCategory] = useState<CropExpense['category']>('Seeds');
  const [expDescription, setExpDescription] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);

  const [incType, setIncType] = useState<CropIncome['type']>('Harvest Sale');
  const [incDescription, setIncDescription] = useState('');
  const [incQuantity, setIncQuantity] = useState('');
  const [incUnitPrice, setIncUnitPrice] = useState('');
  const [incDate, setIncDate] = useState(new Date().toISOString().split('T')[0]);

  const cropExpenses = useMemo(() => expenses.filter(e => e.cropId === cropId), [expenses, cropId]);
  const cropIncomes = useMemo(() => incomes.filter(i => i.cropId === cropId), [incomes, cropId]);
  const totalExpenses = useMemo(() => cropExpenses.reduce((s, e) => s + e.amount, 0), [cropExpenses]);
  const totalIncome = useMemo(() => cropIncomes.reduce((s, i) => s + i.totalAmount, 0), [cropIncomes]);
  const profit = totalIncome - totalExpenses;

  const resetExpForm = () => {
    setExpCategory('Seeds');
    setExpDescription('');
    setExpAmount('');
    setExpDate(new Date().toISOString().split('T')[0]);
    setShowForm(false);
    setEditingExpenseId(null);
  };

  const resetIncForm = () => {
    setIncType('Harvest Sale');
    setIncDescription('');
    setIncQuantity('');
    setIncUnitPrice('');
    setIncDate(new Date().toISOString().split('T')[0]);
    setShowForm(false);
    setEditingIncomeId(null);
  };

  const startEditExpense = (exp: CropExpense) => {
    setEditingExpenseId(exp.id);
    setExpCategory(exp.category);
    setExpDescription(exp.description);
    setExpAmount(String(exp.amount));
    setExpDate(new Date(exp.date).toISOString().split('T')[0]);
    setShowForm(true);
  };

  const startEditIncome = (inc: CropIncome) => {
    setEditingIncomeId(inc.id);
    setIncType(inc.type);
    setIncDescription(inc.description);
    setIncQuantity(String(inc.quantity));
    setIncUnitPrice(String(inc.unitPrice));
    setIncDate(new Date(inc.date).toISOString().split('T')[0]);
    setShowForm(true);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expAmount || Number(expAmount) <= 0) return;
    if (editingExpenseId) {
      onUpdateExpense(editingExpenseId, {
        category: expCategory,
        description: expDescription || expCategory,
        amount: Number(expAmount),
        date: new Date(expDate).toISOString()
      });
    } else {
      onAddExpense({
        cropId,
        category: expCategory,
        description: expDescription || expCategory,
        amount: Number(expAmount),
        date: new Date(expDate).toISOString()
      });
    }
    resetExpForm();
  };

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(incQuantity) || 0;
    const price = Number(incUnitPrice) || 0;
    const total = qty * price;
    if (total <= 0) return;
    if (editingIncomeId) {
      onUpdateIncome(editingIncomeId, {
        type: incType,
        description: incDescription || incType,
        quantity: qty,
        unitPrice: price,
        totalAmount: total,
        date: new Date(incDate).toISOString()
      });
    } else {
      onAddIncome({
        cropId,
        type: incType,
        description: incDescription || incType,
        quantity: qty,
        unitPrice: price,
        totalAmount: total,
        date: new Date(incDate).toISOString()
      });
    }
    resetIncForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-full-modal flex items-center justify-center p-4 bg-jade-950/80 backdrop-blur-md" role="dialog" aria-modal="true">
      <div className="bg-[var(--bg-card)] w-full max-w-lg shadow-2xl rounded-md border border-jade-600 max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="bg-jade-950 p-5 flex justify-between items-center border-b-4 border-sunburst-500 sticky top-0 z-10">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Wallet className="w-5 h-5 mr-2 text-sunburst-500" /> {cropName} Finances
          </h3>
          <button onClick={onClose} aria-label="Close" className="text-[var(--text-tertiary)] hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 text-center">
              <div className="text-[10px] font-semibold text-red-600 dark:text-red-400 mb-1 flex items-center justify-center gap-1">
                <TrendingDown className="w-3 h-3" /> Expenses
              </div>
              <div className="text-lg font-bold text-red-700 dark:text-red-300">
                {formatCurrency(totalExpenses, currencyCode, currencySymbol)}
              </div>
            </div>
            <div className="bg-jade-50 dark:bg-jade-900/20 border border-jade-200 dark:border-jade-800 rounded p-3 text-center">
              <div className="text-[10px] font-semibold text-jade-600 dark:text-jade-400 mb-1 flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3" /> Income
              </div>
              <div className="text-lg font-bold text-jade-700 dark:text-jade-300">
                {formatCurrency(totalIncome, currencyCode, currencySymbol)}
              </div>
            </div>
            <div className={`${profit >= 0 ? 'bg-jade-50 dark:bg-jade-900/20 border-jade-200 dark:border-jade-800' : 'bg-terra-50 dark:bg-terra-900/20 border-terra-200 dark:border-terra-800'} border rounded p-3 text-center`}>
              <div className={`text-[10px] font-semibold mb-1 flex items-center justify-center gap-1 ${profit >= 0 ? 'text-jade-600 dark:text-jade-400' : 'text-terra-600 dark:text-terra-400'}`}>
                <DollarSign className="w-3 h-3" /> Profit
              </div>
              <div className={`text-lg font-bold ${profit >= 0 ? 'text-jade-700 dark:text-jade-300' : 'text-terra-700 dark:text-terra-300'}`}>
                {formatCurrency(profit, currencyCode, currencySymbol)}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => { setTab('expenses'); setShowForm(false); setEditingExpenseId(null); setEditingIncomeId(null); }}
              className={`flex-1 py-2 text-sm font-semibold rounded border-2 transition-colors ${
                tab === 'expenses'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-400 text-red-700 dark:text-red-300'
                  : 'bg-[var(--bg-content)] border-[var(--border-card)] text-[var(--text-secondary)]'
              }`}
            >
              Expenses ({cropExpenses.length})
            </button>
            <button
              onClick={() => { setTab('income'); setShowForm(false); setEditingExpenseId(null); setEditingIncomeId(null); }}
              className={`flex-1 py-2 text-sm font-semibold rounded border-2 transition-colors ${
                tab === 'income'
                  ? 'bg-jade-50 dark:bg-jade-900/20 border-jade-400 text-jade-700 dark:text-jade-300'
                  : 'bg-[var(--bg-content)] border-[var(--border-card)] text-[var(--text-secondary)]'
              }`}
            >
              Income ({cropIncomes.length})
            </button>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full mb-4 py-2 bg-jade-800 dark:bg-jade-700 text-white text-sm font-semibold rounded hover:bg-jade-950 dark:hover:bg-jade-600 transition-colors shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />             {editingExpenseId || editingIncomeId ? 'Cancel Edit' : `Add ${tab === 'expenses' ? 'Expense' : 'Income'}`}
          </button>

          {showForm && tab === 'expenses' && (
            <form onSubmit={handleAddExpense} className="mb-4 p-4 bg-[var(--bg-content)] border border-[var(--border-card)] rounded space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-[var(--text-secondary)] mb-1">Category</label>
                  <select value={expCategory} onChange={e => setExpCategory(e.target.value as any)} className="w-full px-3 py-2 border-2 border-[var(--border-card)] rounded-sm bg-[var(--bg-card)] text-[var(--text-primary)] text-sm font-medium focus:border-sunburst-500 focus:outline-none">
                    {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[var(--text-secondary)] mb-1">Amount ({currencySymbol})</label>
                  <input type="number" min="0.01" step="0.01" value={expAmount} onChange={e => setExpAmount(e.target.value)} className="w-full px-3 py-2 border-2 border-[var(--border-card)] rounded-sm bg-[var(--bg-card)] text-[var(--text-primary)] text-sm font-bold focus:border-sunburst-500 focus:outline-none" placeholder="0.00" required />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-[var(--text-secondary)] mb-1">Description</label>
                <input type="text" value={expDescription} onChange={e => setExpDescription(e.target.value)} className="w-full px-3 py-2 border-2 border-[var(--border-card)] rounded-sm bg-[var(--bg-card)] text-[var(--text-primary)] text-sm font-medium focus:border-sunburst-500 focus:outline-none" placeholder="e.g. NPK 15-15-15 fertilizer" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-[var(--text-secondary)] mb-1">Date</label>
                <input type="date" value={expDate} onChange={e => setExpDate(e.target.value)} className="w-full px-3 py-2 border-2 border-[var(--border-card)] rounded-sm bg-[var(--bg-card)] text-[var(--text-primary)] text-sm font-medium focus:border-sunburst-500 focus:outline-none" required />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2.5 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 transition-colors">{editingExpenseId ? 'Update Expense' : 'Save Expense'}</button>
                <button type="button" onClick={resetExpForm} className="px-4 py-2.5 border-2 border-[var(--border-card)] text-[var(--text-secondary)] text-sm font-semibold rounded hover:bg-[var(--bg-content)]">Cancel</button>
              </div>
            </form>
          )}

          {showForm && tab === 'income' && (
            <form onSubmit={handleAddIncome} className="mb-4 p-4 bg-[var(--bg-content)] border border-[var(--border-card)] rounded space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-[var(--text-secondary)] mb-1">Type</label>
                <select value={incType} onChange={e => setIncType(e.target.value as any)} className="w-full px-3 py-2 border-2 border-[var(--border-card)] rounded-sm bg-[var(--bg-card)] text-[var(--text-primary)] text-sm font-medium focus:border-sunburst-500 focus:outline-none">
                  {INCOME_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-[var(--text-secondary)] mb-1">Quantity</label>
                  <input type="number" min="0.01" step="0.01" value={incQuantity} onChange={e => setIncQuantity(e.target.value)} className="w-full px-3 py-2 border-2 border-[var(--border-card)] rounded-sm bg-[var(--bg-card)] text-[var(--text-primary)] text-sm font-bold focus:border-sunburst-500 focus:outline-none" placeholder="e.g. 500 (bags/kg)" required />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[var(--text-secondary)] mb-1">Unit Price ({currencySymbol})</label>
                  <input type="number" min="0.01" step="0.01" value={incUnitPrice} onChange={e => setIncUnitPrice(e.target.value)} className="w-full px-3 py-2 border-2 border-[var(--border-card)] rounded-sm bg-[var(--bg-card)] text-[var(--text-primary)] text-sm font-bold focus:border-sunburst-500 focus:outline-none" placeholder="0.00" required />
                </div>
              </div>
              <div className="bg-jade-50 dark:bg-jade-900/20 border border-jade-200 dark:border-jade-800 rounded p-2 text-center">
                <span className="text-[10px] font-semibold text-jade-600 dark:text-jade-400">Total: </span>
                <span className="text-sm font-bold text-jade-700 dark:text-jade-300">
                  {formatCurrency((Number(incQuantity) || 0) * (Number(incUnitPrice) || 0), currencyCode, currencySymbol)}
                </span>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-[var(--text-secondary)] mb-1">Description</label>
                <input type="text" value={incDescription} onChange={e => setIncDescription(e.target.value)} className="w-full px-3 py-2 border-2 border-[var(--border-card)] rounded-sm bg-[var(--bg-card)] text-[var(--text-primary)] text-sm font-medium focus:border-sunburst-500 focus:outline-none" placeholder="e.g. First harvest sale at local market" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-[var(--text-secondary)] mb-1">Date</label>
                <input type="date" value={incDate} onChange={e => setIncDate(e.target.value)} className="w-full px-3 py-2 border-2 border-[var(--border-card)] rounded-sm bg-[var(--bg-card)] text-[var(--text-primary)] text-sm font-medium focus:border-sunburst-500 focus:outline-none" required />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2.5 bg-jade-700 text-white text-sm font-semibold rounded hover:bg-jade-800 transition-colors">{editingIncomeId ? 'Update Income' : 'Save Income'}</button>
                <button type="button" onClick={resetIncForm} className="px-4 py-2.5 border-2 border-[var(--border-card)] text-[var(--text-secondary)] text-sm font-semibold rounded hover:bg-[var(--bg-content)]">Cancel</button>
              </div>
            </form>
          )}

          {tab === 'expenses' && cropExpenses.length === 0 && !showForm && (
            <p className="text-center text-[var(--text-secondary)] text-sm py-8">No expenses recorded yet. Tap "Add Expense" to start tracking costs.</p>
          )}
          {tab === 'income' && cropIncomes.length === 0 && !showForm && (
            <p className="text-center text-[var(--text-secondary)] text-sm py-8">No income recorded yet. Tap "Add Income" to log harvest sales and earnings.</p>
          )}

          {tab === 'expenses' && (
            <div className="space-y-2">
              {cropExpenses.map(exp => (
                <div key={exp.id} className="flex items-center gap-3 p-3 bg-[var(--bg-content)] border border-[var(--border-card)] rounded group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">{exp.category}</span>
                      <span className="text-sm font-bold text-[var(--text-primary)]">-{formatCurrency(exp.amount, currencyCode, currencySymbol)}</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate">{exp.description}</p>
                    <p className="text-[10px] text-[var(--text-tertiary)]">{new Date(exp.date).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => startEditExpense(exp)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-jade-500 hover:bg-jade-50 dark:hover:bg-jade-900/20 rounded transition-opacity"
                    aria-label="Edit expense"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { if (window.confirm('Delete this expense?')) onDeleteExpense(exp.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-opacity"
                    aria-label="Delete expense"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === 'income' && (
            <div className="space-y-2">
              {cropIncomes.map(inc => (
                <div key={inc.id} className="flex items-center gap-3 p-3 bg-[var(--bg-content)] border border-[var(--border-card)] rounded group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-jade-100 dark:bg-jade-900/30 text-jade-700 dark:text-jade-300 rounded">{inc.type}</span>
                      <span className="text-sm font-bold text-jade-700 dark:text-jade-300">+{formatCurrency(inc.totalAmount, currencyCode, currencySymbol)}</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate">{inc.description} &middot; {inc.quantity} @ {currencySymbol}{inc.unitPrice}</p>
                    <p className="text-[10px] text-[var(--text-tertiary)]">{new Date(inc.date).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => startEditIncome(inc)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-jade-500 hover:bg-jade-50 dark:hover:bg-jade-900/20 rounded transition-opacity"
                    aria-label="Edit income"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { if (window.confirm('Delete this income entry?')) onDeleteIncome(inc.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-opacity"
                    aria-label="Delete income"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropFinancialsModal;

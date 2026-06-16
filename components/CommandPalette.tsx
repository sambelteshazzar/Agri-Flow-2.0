
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, LayoutDashboard, Sprout, Beef, TrendingUp, BrainCircuit, GraduationCap, Calculator, Users, HardHat, Globe, Settings, ArrowRight, Command } from 'lucide-react';
import { NavigationTab } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavigationTab) => void;
}

const commands = [
  { id: NavigationTab.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, category: 'Navigate', shortcut: '1' },
  { id: NavigationTab.CROPS, label: 'My Crops', icon: Sprout, category: 'Navigate', shortcut: '2' },
  { id: NavigationTab.LIVESTOCK, label: 'Livestock', icon: Beef, category: 'Navigate', shortcut: '3' },
  { id: NavigationTab.MARKET, label: 'Market', icon: TrendingUp, category: 'Navigate', shortcut: '4' },
  { id: NavigationTab.NEWS, label: 'News', icon: Globe, category: 'Navigate', shortcut: '5' },
  { id: NavigationTab.AI_ADVISOR, label: 'AI Advisor', icon: BrainCircuit, category: 'Tools', shortcut: '6' },
  { id: NavigationTab.CALCULATOR, label: 'Calculators', icon: Calculator, category: 'Tools', shortcut: '7' },
  { id: NavigationTab.EDUCATION, label: 'Learn', icon: GraduationCap, category: 'Tools', shortcut: '8' },
  { id: NavigationTab.COMMUNITY, label: 'Community', icon: Users, category: 'Connect', shortcut: '9' },
  { id: NavigationTab.LABOR, label: 'Labor Planner', icon: HardHat, category: 'Tools', shortcut: '0' },
  { id: NavigationTab.SETTINGS, label: 'Settings', icon: Settings, category: 'Account', shortcut: ',' },
];

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const executeSelected = useCallback(() => {
    if (filtered[selectedIndex]) {
      onNavigate(filtered[selectedIndex].id);
      onClose();
    }
  }, [filtered, selectedIndex, onNavigate, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeSelected();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, filtered, selectedIndex, executeSelected, onClose]);

  if (!isOpen) return null;

  const categories = [...new Set(filtered.map(c => c.category))];

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-field-950/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg mx-4 bg-[var(--bg-card)] rounded-2xl shadow-2xl border border-[var(--border-card)] overflow-hidden animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-[var(--border-card)]">
          <Search className="w-5 h-5 text-[var(--text-tertiary)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search views, tools, actions..."
            className="flex-1 py-4 bg-transparent text-[var(--text-primary)] text-sm font-medium focus:outline-none placeholder:text-[var(--text-tertiary)]"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 rounded-md bg-[var(--bg-content)] border border-[var(--border-card)] text-[10px] font-bold text-[var(--text-tertiary)]">
            <Command className="w-3 h-3" />K
          </kbd>
        </div>

        <div className="max-h-72 overflow-y-auto p-2 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-[var(--text-tertiary)]">No results found</div>
          ) : (
            categories.map(category => (
              <div key={category}>
                <p className="px-2 pt-2 pb-1 text-[10px] font-semibold text-[var(--text-tertiary)]">{category}</p>
                {filtered.filter(c => c.category === category).map(cmd => {
                  const globalIndex = filtered.indexOf(cmd);
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => { onNavigate(cmd.id); onClose(); }}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        globalIndex === selectedIndex
                          ? 'bg-field-50 dark:bg-field-900/20 text-field-700 dark:text-field-400'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-content)]'
                      }`}
                    >
                      <cmd.icon className={`w-4 h-4 shrink-0 ${globalIndex === selectedIndex ? 'text-field-500' : 'text-[var(--text-tertiary)]'}`} />
                      <span className="font-medium flex-1 text-left">{cmd.label}</span>
                      {globalIndex === selectedIndex && <ArrowRight className="w-3.5 h-3.5 text-field-500" />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[var(--border-card)] text-[10px] text-[var(--text-tertiary)] font-medium">
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-[var(--bg-content)] border border-[var(--border-card)] font-bold">↑↓</kbd> Navigate</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-[var(--bg-content)] border border-[var(--border-card)] font-bold">↵</kbd> Open</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-[var(--bg-content)] border border-[var(--border-card)] font-bold">esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;

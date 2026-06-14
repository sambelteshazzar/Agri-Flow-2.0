
import React from 'react';
import { LayoutDashboard, Sprout, Beef, TrendingUp, BrainCircuit, GraduationCap, Calculator, Users, HardHat, Globe, Settings } from 'lucide-react';
import { NavigationTab } from '../types';

interface MobileNavProps {
  activeTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
}

const primaryTabs = [
  { id: NavigationTab.DASHBOARD, label: 'Home', icon: LayoutDashboard },
  { id: NavigationTab.CROPS, label: 'Crops', icon: Sprout },
  { id: NavigationTab.LIVESTOCK, label: 'Stock', icon: Beef },
  { id: NavigationTab.MARKET, label: 'Market', icon: TrendingUp },
  { id: NavigationTab.NEWS, label: 'News', icon: Globe },
];

const secondaryTabs = [
  { id: NavigationTab.AI_ADVISOR, label: 'AI', icon: BrainCircuit },
  { id: NavigationTab.CALCULATOR, label: 'Calc', icon: Calculator },
  { id: NavigationTab.EDUCATION, label: 'Learn', icon: GraduationCap },
  { id: NavigationTab.COMMUNITY, label: 'Social', icon: Users },
  { id: NavigationTab.LABOR, label: 'Labor', icon: HardHat },
  { id: NavigationTab.SETTINGS, label: 'Settings', icon: Settings },
];

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onNavigate }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 safe-area-bottom">
      <div className="flex flex-col">
        <div className="flex items-center justify-around h-14 px-0.5">
          {primaryTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors rounded-lg ${
                  isActive ? 'text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-900/10' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-green-600 dark:text-green-400' : ''}`}>
                  {tab.label}
                </span>
                {isActive && <div className="w-1 h-1 rounded-full bg-green-500 mt-0.5" />}
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-around h-12 px-0.5 border-t border-slate-100 dark:border-slate-800/50">
          {secondaryTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex flex-col items-center justify-center gap-0 flex-1 h-full transition-colors rounded-lg ${
                  isActive ? 'text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-900/10' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className={`text-[9px] font-medium ${isActive ? 'text-green-600 dark:text-green-400' : ''}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileNav;

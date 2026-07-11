
import React from 'react';
import { LayoutDashboard, Sprout, Beef, TrendingUp, BrainCircuit, GraduationCap, Calculator, Users, HardHat, Globe, Settings } from 'lucide-react';
import { NavigationTab } from '../types';

interface MobileNavProps {
  activeTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
}

const primaryTabs = [
  { id: NavigationTab.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { id: NavigationTab.CROPS, label: 'Crops', icon: Sprout },
  { id: NavigationTab.LIVESTOCK, label: 'Livestock', icon: Beef },
  { id: NavigationTab.MARKET, label: 'Market', icon: TrendingUp },
  { id: NavigationTab.NEWS, label: 'News', icon: Globe },
];

const secondaryTabs = [
  { id: NavigationTab.AI_ADVISOR, label: 'Advisor', icon: BrainCircuit },
  { id: NavigationTab.CALCULATOR, label: 'Calculators', icon: Calculator },
  { id: NavigationTab.EDUCATION, label: 'Learn', icon: GraduationCap },
  { id: NavigationTab.COMMUNITY, label: 'Community', icon: Users },
  { id: NavigationTab.LABOR, label: 'Labor', icon: HardHat },
  { id: NavigationTab.SETTINGS, label: 'Settings', icon: Settings },
];

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onNavigate }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/[0.97] dark:bg-jade-950/[0.97] backdrop-blur-xl border-t border-terra-200/50 dark:border-jade-800/50 safe-area-bottom shadow-[0_-4px_20px_rgba(58,39,25,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
      <div className="flex flex-col">
        <div className="flex items-center justify-around h-[52px] px-0.5">
          {primaryTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all rounded-xl ${
                  isActive ? 'text-jade-600 dark:text-jade-400' : 'text-terra-400 dark:text-jade-500'
                }`}
              >
                <div className={`relative p-1 rounded-xl transition-all ${isActive ? 'bg-jade-50 dark:bg-jade-900/30' : ''}`}>
                  <tab.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                  {isActive && <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-jade-500 shadow-sm shadow-jade-500/50" />}
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-jade-600 dark:text-jade-400 font-semibold' : ''}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-around h-11 px-0.5 border-t border-terra-100/50 dark:border-jade-800/30">
          {secondaryTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex flex-col items-center justify-center gap-0 flex-1 h-full transition-all rounded-lg ${
                  isActive ? 'text-jade-600 dark:text-jade-400' : 'text-terra-400 dark:text-jade-500'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className={`text-[9px] font-medium ${isActive ? 'text-jade-600 dark:text-jade-400 font-semibold' : ''}`}>
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

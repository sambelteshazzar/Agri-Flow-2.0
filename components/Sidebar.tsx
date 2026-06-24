
import React from 'react';
import { LayoutDashboard, Sprout, TrendingUp, BrainCircuit, Beef, GraduationCap, Calculator, Users, HardHat, Globe, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
  onLogout: () => void;
}

const navGroups = [
  {
    label: 'Overview',
    items: [
      { id: NavigationTab.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
      { id: NavigationTab.CROPS, label: 'My Crops', icon: Sprout },
      { id: NavigationTab.LIVESTOCK, label: 'Livestock', icon: Beef },
    ],
  },
  {
    label: 'Insights',
    items: [
      { id: NavigationTab.MARKET, label: 'Market', icon: TrendingUp },
      { id: NavigationTab.NEWS, label: 'News', icon: Globe },
      { id: NavigationTab.AI_ADVISOR, label: 'AI Advisor', icon: BrainCircuit },
    ],
  },
  {
    label: 'Tools',
    items: [
      { id: NavigationTab.CALCULATOR, label: 'Calculators', icon: Calculator },
      { id: NavigationTab.EDUCATION, label: 'Learn', icon: GraduationCap },
      { id: NavigationTab.COMMUNITY, label: 'Community', icon: Users },
      { id: NavigationTab.LABOR, label: 'Labor Planner', icon: HardHat },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen, onLogout }) => {
  
  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-terra-900/40 dark:bg-black/60 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 z-[70] h-full w-[260px] bg-sidebar-dynamic text-primary-dynamic
          shadow-2xl md:shadow-none transform transition-transform duration-300 ease-in-out
          border-r border-terra-200/50 dark:border-jade-800/50
          md:translate-x-0 md:static md:h-screen flex flex-col
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Branding Header */}
        <div className="flex items-center px-5 h-[72px] border-b border-terra-200/50 dark:border-jade-800/50 shrink-0">
          <img src="/logo-AgriFlow.png" alt="AgriFlow" className="w-9 h-9 rounded-xl mr-3 shadow-lg shadow-jade-600/20 dark:shadow-jade-500/10" />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-primary-dynamic font-heading">Agri<span className="text-jade-600 dark:text-jade-400">Flow</span></h1>
            <p className="text-[9px] text-secondary-dynamic font-medium -mt-0.5">Smart Farming</p>
          </div>
        </div>

        {/* Scrollable Nav Area */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
          {navGroups.map(group => (
            <div key={group.label}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold text-terra-400 dark:text-jade-400 tracking-wide">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`
                        w-full flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium relative
                        ${isActive 
                          ? 'bg-jade-50 dark:bg-jade-900/30 text-jade-700 dark:text-jade-400 shadow-sm' 
                          : 'text-secondary-dynamic hover:bg-terra-100/60 dark:hover:bg-jade-900/30 hover:text-primary-dynamic'
                        }
                      `}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-jade-500 rounded-r-full" />
                      )}
                      <item.icon 
                        className={`w-[18px] h-[18px] mr-3 ${isActive ? 'text-jade-600 dark:text-jade-400' : 'text-terra-400 dark:text-jade-500'}`} 
                      />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-terra-200/50 dark:border-jade-800/50 shrink-0">
           <button 
             onClick={() => handleNavClick(NavigationTab.SETTINGS)}
              className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-colors ${activeTab === NavigationTab.SETTINGS ? 'bg-jade-50 dark:bg-jade-900/30 text-jade-700 dark:text-jade-400' : 'text-secondary-dynamic hover:bg-terra-100/60 dark:hover:bg-jade-900/30'}`}
          >
            <SettingsIcon className="w-[18px] h-[18px] mr-3 text-terra-400 dark:text-jade-500" />
            Settings
          </button>
           <button 
             onClick={onLogout}
              className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-secondary-dynamic hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/60 dark:hover:bg-red-900/10 transition-all"
          >
            <LogOut className="w-[18px] h-[18px] mr-3" />
            Log Out
          </button>
           <p className="text-center text-[9px] text-terra-400/60 dark:text-[#4D8A72]/60 mt-3">
             <img src="/logo-AgriFlow.png" alt="" className="w-4 h-4 inline-block rounded-sm mr-1 align-middle" />
             © 2026 AgriFlow Inc.
           </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

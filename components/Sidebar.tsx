
import React from 'react';
import { LayoutDashboard, Sprout, TrendingUp, BrainCircuit, Leaf, Beef, GraduationCap, Calculator, Users, HardHat, Globe, LogOut, Settings as SettingsIcon } from 'lucide-react';
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
          className="fixed inset-0 z-[60] bg-soil-900/40 dark:bg-black/60 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 z-[70] h-full w-[260px] bg-sidebar-dynamic text-primary-dynamic
          shadow-2xl md:shadow-none transform transition-transform duration-300 ease-in-out
          border-r border-soil-200/50 dark:border-[#1C3A28]/50
          md:translate-x-0 md:static md:h-screen flex flex-col
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Branding Header */}
        <div className="flex items-center px-5 h-[72px] border-b border-soil-200/50 dark:border-[#1C3A28]/50 shrink-0">
          <div className="bg-field-600 dark:bg-field-500 rounded-xl p-2 mr-3 shadow-lg shadow-field-600/20 dark:shadow-field-500/10">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-primary-dynamic font-heading">Agri<span className="text-field-600 dark:text-field-400">Flow</span></h1>
            <p className="text-[9px] text-secondary-dynamic font-medium -mt-0.5">Smart Farming</p>
          </div>
        </div>

        {/* Scrollable Nav Area */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
          {navGroups.map(group => (
            <div key={group.label}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold text-soil-400 dark:text-[#8BA898] tracking-wide">{group.label}</p>
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
                          ? 'bg-field-50 dark:bg-field-900/30 text-field-700 dark:text-field-400 shadow-sm' 
                          : 'text-secondary-dynamic hover:bg-soil-100/60 dark:hover:bg-[#183222]/60 hover:text-primary-dynamic'
                        }
                      `}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-field-500 rounded-r-full" />
                      )}
                      <item.icon 
                        className={`w-[18px] h-[18px] mr-3 ${isActive ? 'text-field-600 dark:text-field-400' : 'text-soil-400 dark:text-[#5C7A68]'}`} 
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
        <div className="p-3 border-t border-soil-200/50 dark:border-[#1C3A28]/50 shrink-0">
           <button 
             onClick={() => handleNavClick(NavigationTab.SETTINGS)}
             className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-colors ${activeTab === NavigationTab.SETTINGS ? 'bg-field-50 dark:bg-field-900/30 text-field-700 dark:text-field-400' : 'text-secondary-dynamic hover:bg-soil-100/60 dark:hover:bg-[#183222]/60'}`}
          >
            <SettingsIcon className="w-[18px] h-[18px] mr-3 text-soil-400 dark:text-[#5C7A68]" />
            Settings
          </button>
           <button 
             onClick={onLogout}
              className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-secondary-dynamic hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/60 dark:hover:bg-red-900/10 transition-all"
          >
            <LogOut className="w-[18px] h-[18px] mr-3" />
            Log Out
          </button>
          <p className="text-center text-[9px] text-soil-400/60 dark:text-[#5C7A68]/60 mt-3">© 2026 AgriFlow Inc.</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

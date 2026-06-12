
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, Wifi, WifiOff, Globe, Bell, X, AlertTriangle, TrendingUp, Info, LogIn, User, Loader2, CheckCircle, AlertCircle, Info as InfoIcon, Search, Command } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CropManager from './components/CropManager';
import LivestockManager from './components/LivestockManager';
import EducationHub from './components/EducationHub';
import MarketAnalytics from './components/MarketAnalytics';
import NewsHub from './components/NewsHub';
import AIAdvisor from './components/AIAdvisor';
import ResourceCalculator from './components/ResourceCalculator';
import CommunityHub from './components/CommunityHub';
import GamesHub from './components/GamesHub';
import GetStarted from './components/GetStarted';
import SettingsPage from './components/Settings';
import VoiceAgent from './components/VoiceAgent';
import AuthModal from './components/AuthModal';
import CommandPalette from './components/CommandPalette';
import MobileNav from './components/MobileNav';
import { NavigationTab } from './types';
import { FarmProvider, useFarm } from './contexts/FarmContext';

const FAVICON_EMOJIS: Record<string, string> = {
  [NavigationTab.DASHBOARD]: '📊',
  [NavigationTab.CROPS]: '🌾',
  [NavigationTab.LIVESTOCK]: '🐄',
  [NavigationTab.MARKET]: '📈',
  [NavigationTab.NEWS]: '🌐',
  [NavigationTab.AI_ADVISOR]: '🤖',
  [NavigationTab.CALCULATOR]: '🧮',
  [NavigationTab.EDUCATION]: '🎓',
  [NavigationTab.COMMUNITY]: '👥',
  [NavigationTab.GAMES]: '🎮',
  [NavigationTab.SETTINGS]: '⚙️',
};

const AppContent: React.FC = () => {
  const { userProfile, alerts, isSignedIn, login, logout, toasts, removeToast, currentView, navigate } = useFarm();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(() => localStorage.getItem('agriflow_has_started') === 'true');
  const [isOnline, setIsOnline] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [viewKey, setViewKey] = useState(0);
  const mainRef = useRef<HTMLElement>(null);
  const scrollPositions = useRef<Record<string, number>>({});
  const prevViewRef = useRef<NavigationTab>(currentView);

  const unreadAlerts = alerts.length;

  const getPageTitle = (tab: NavigationTab) => {
    switch(tab) {
      case NavigationTab.AI_ADVISOR: return 'AI Consultant';
      case NavigationTab.CALCULATOR: return 'Resource Tools';
      case NavigationTab.COMMUNITY: return 'Community Hub';
      case NavigationTab.CROPS: return 'Field Operations';
      case NavigationTab.DASHBOARD: return 'Command Center';
      case NavigationTab.EDUCATION: return 'Training';
      case NavigationTab.LIVESTOCK: return 'Livestock';
      case NavigationTab.MARKET: return 'Market Data';
      case NavigationTab.NEWS: return 'Global Wire';
      case NavigationTab.GAMES: return 'Arcade';
      case NavigationTab.SETTINGS: return 'System Configuration';
      default: return 'AgriFlow';
    }
  };

  // Feature 1: Page transitions — re-key on view change
  // Feature 4: Scroll persistence — save/restore per tab
  // Feature 6: Dynamic title + favicon
  useEffect(() => {
    if (prevViewRef.current !== currentView) {
      // Save scroll of previous view
      if (mainRef.current) {
        scrollPositions.current[prevViewRef.current] = mainRef.current.scrollTop;
      }
      // Trigger page transition animation
      setViewKey(k => k + 1);
      // Restore scroll for new view
      requestAnimationFrame(() => {
        if (mainRef.current) {
          mainRef.current.scrollTop = scrollPositions.current[currentView] ?? 0;
        }
      });
      prevViewRef.current = currentView;
    }

    // Dynamic page title
    const title = getPageTitle(currentView);
    document.title = `${title} · AgriFlow`;

    // Dynamic favicon
    const emoji = FAVICON_EMOJIS[currentView] || '🌱';
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
    if (link) {
      link.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emoji}</text></svg>`;
    }
  }, [currentView]);

  // Feature 2: Command palette — Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleStart = () => {
    setHasStarted(true);
    localStorage.setItem('agriflow_has_started', 'true');
  };

  const renderContent = () => {
    switch (currentView) {
      case NavigationTab.DASHBOARD: return <Dashboard />;
      case NavigationTab.CROPS: return <CropManager />;
      case NavigationTab.LIVESTOCK: return <LivestockManager />;
      case NavigationTab.CALCULATOR: return <ResourceCalculator />;
      case NavigationTab.COMMUNITY: return <CommunityHub />;
      case NavigationTab.EDUCATION: return <EducationHub />;
      case NavigationTab.MARKET: return <MarketAnalytics />;
      case NavigationTab.NEWS: return <NewsHub />;
      case NavigationTab.AI_ADVISOR: return <AIAdvisor />;
      case NavigationTab.GAMES: return <GamesHub />;
      case NavigationTab.SETTINGS: return <SettingsPage />;
      default: return <Dashboard />;
    }
  };

  const handleLogout = () => {
    logout();
    setHasStarted(false);
    localStorage.removeItem('agriflow_has_started');
    navigate(NavigationTab.DASHBOARD);
    setIsMobileOpen(false);
  };

  const handleAuthSubmit = async (name: string, email: string) => {
    await login(name, email);
    setIsAuthModalOpen(false);
  };

  if (!hasStarted) {
    return <GetStarted onStart={handleStart} />;
  }

  return (
    <div className="flex h-screen h-[100dvh] bg-[#FDFCF8] dark:bg-slate-950 overflow-hidden relative transition-colors duration-300">

      {/* GLOBAL TOAST CONTAINER */}
      <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl backdrop-blur-md border animate-fade-in-up min-w-[300px] max-w-sm
              ${toast.type === 'success' ? 'bg-green-50/90 dark:bg-green-900/90 border-green-200 dark:border-green-800 text-green-800 dark:text-green-100' : ''}
              ${toast.type === 'error' ? 'bg-red-50/90 dark:bg-red-900/90 border-red-200 dark:border-red-800 text-red-800 dark:text-red-100' : ''}
              ${toast.type === 'info' ? 'bg-slate-50/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100' : ''}
            `}
          >
            <div className="shrink-0">
              {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
              {toast.type === 'info' && <InfoIcon className="w-5 h-5" />}
            </div>
            <p className="text-sm font-bold flex-1">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="opacity-60 hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* --- GLOBAL VOICE AGENT --- */}
      <VoiceAgent />

      {/* SIGN IN / SIGN UP MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleAuthSubmit}
      />

      {/* COMMAND PALETTE */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={navigate}
      />

      {/* Sidebar Component */}
      <Sidebar
        activeTab={currentView}
        setActiveTab={navigate}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative pb-16 md:pb-0">

        {/* TOP HEADER (Desktop & Mobile) */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 flex items-center justify-between px-4 md:px-8 z-20 shadow-sm transition-colors">

          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg mr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-heading">
                {getPageTitle(currentView)}
              </h1>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest hidden md:block">
                System Status: Nominal
              </p>
            </div>
          </div>

          {/* Right: Profile & Controls */}
          <div className="flex items-center gap-2 md:gap-6">

            {/* System Controls (Hidden on small mobile) */}
            <div className="hidden md:flex items-center gap-3 border-r border-slate-200 dark:border-slate-800 pr-6">
              {/* Command Palette Trigger */}
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                Search
                <kbd className="ml-1.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-[9px] font-bold text-slate-400">
                  <Command className="w-2.5 h-2.5" />K
                </kbd>
              </button>

              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${isOnline ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'}`}
              >
                {isOnline ? <Wifi className="w-3 h-3 mr-2" /> : <WifiOff className="w-3 h-3 mr-2" />}
                {isOnline ? 'Online' : 'Offline'}
              </button>
              <button className="flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Globe className="w-3 h-3 mr-2" /> EN-US
              </button>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
                >
                  <Bell className="w-5 h-5" />
                  {unreadAlerts > 0 && <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-fade-in-up">
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                      <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Alerts ({unreadAlerts})</h3>
                      <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {alerts.length > 0 ? alerts.map(alert => (
                        <div key={alert.id} className="p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer group">
                          <div className="flex items-start gap-3">
                            <div className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-full text-red-600 dark:text-red-400 mt-0.5"><AlertTriangle className="w-4 h-4" /></div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-red-700 dark:group-hover:text-red-400">{alert.title}</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{alert.message}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Just now</p>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="p-4 text-center text-slate-400 text-xs">No active alerts</div>
                      )}
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-2 border-t border-slate-200 dark:border-slate-700 text-center">
                      <button className="text-[10px] font-bold uppercase text-slate-500 hover:text-slate-800 dark:hover:text-slate-300">Mark all as read</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Profile / Sign In */}
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{userProfile.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-1 tracking-wide">{userProfile.role}</p>
                </div>
                <div
                  onClick={() => navigate(NavigationTab.SETTINGS)}
                  className="relative cursor-pointer group"
                  title="Settings"
                >
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-slate-900 dark:bg-slate-800 text-yellow-500 flex items-center justify-center font-bold text-lg border-2 border-white dark:border-slate-700 shadow-md group-hover:bg-slate-800 dark:group-hover:bg-slate-700 transition-colors overflow-hidden">
                    {userProfile.avatar ? (
                      <img
                        src={userProfile.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&background=random`;
                        }}
                      />
                    ) : (
                      userProfile.name.charAt(0)
                    )}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${isOnline ? 'bg-green-500' : 'bg-red-500'} shadow-sm`}></div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 rounded-lg font-bold text-xs uppercase tracking-wide transition-all shadow-md active:scale-95"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            )}

          </div>
        </header>

        {/* Scrollable Content with page transition + scroll persistence */}
        <main
          ref={mainRef}
          className="flex-1 overflow-auto p-4 md:p-8 bg-[#F1F5F9] dark:bg-[#020617] transition-colors"
        >
          <div key={viewKey} className="max-w-7xl mx-auto h-full animate-page-enter">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <MobileNav activeTab={currentView} onNavigate={navigate} />
    </div>
  );
};

function App() {
  return (
    <FarmProvider>
      <AppContent />
    </FarmProvider>
  );
}

export default App;

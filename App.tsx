
import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { Menu, Wifi, WifiOff, Globe, Bell, X, AlertTriangle, TrendingUp, Info, LogIn, User, Loader2, CheckCircle, AlertCircle, Info as InfoIcon, Search, Command } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CropManager from './components/CropManager';
import LivestockManager from './components/LivestockManager';
import MobileNav from './components/MobileNav';
import CommandPalette from './components/CommandPalette';
import GetStarted from './components/GetStarted';
import { LoginPage } from './components/LoginPage';

const EducationHub = lazy(() => import('./components/EducationHub'));
const MarketAnalytics = lazy(() => import('./components/MarketAnalytics'));
const NewsHub = lazy(() => import('./components/NewsHub'));
const AIAdvisor = lazy(() => import('./components/AIAdvisor'));
const ResourceCalculator = lazy(() => import('./components/ResourceCalculator'));
const CommunityHub = lazy(() => import('./components/CommunityHub'));
const FarmLaborPlanner = lazy(() => import('./components/FarmLaborPlanner'));
const SettingsPage = lazy(() => import('./components/Settings'));
const VoiceAgent = lazy(() => import('./components/VoiceAgent'));

import { NavigationTab } from './types';
import type { OnboardingData } from './components/AuthModal';
import { FarmProvider, useFarm } from './contexts/FarmContext';

const LazyLoader: React.FC = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="w-8 h-8 animate-spin text-field-500" />
  </div>
);

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
  [NavigationTab.LABOR]: '👷',
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
      case NavigationTab.AI_ADVISOR: return 'AI Advisor';
      case NavigationTab.CALCULATOR: return 'Calculators';
      case NavigationTab.COMMUNITY: return 'Community';
      case NavigationTab.CROPS: return 'My Crops';
      case NavigationTab.DASHBOARD: return 'Dashboard';
      case NavigationTab.EDUCATION: return 'Learn';
      case NavigationTab.LIVESTOCK: return 'Livestock';
      case NavigationTab.MARKET: return 'Market';
      case NavigationTab.NEWS: return 'News';
      case NavigationTab.LABOR: return 'Labor Planner';
      case NavigationTab.SETTINGS: return 'Settings';
      default: return 'AgriFlow';
    }
  };

  useEffect(() => {
    if (prevViewRef.current !== currentView) {
      if (mainRef.current) {
        scrollPositions.current[prevViewRef.current] = mainRef.current.scrollTop;
      }
      setViewKey(k => k + 1);
      requestAnimationFrame(() => {
        if (mainRef.current) {
          mainRef.current.scrollTop = scrollPositions.current[currentView] ?? 0;
        }
      });
      prevViewRef.current = currentView;
    }

    const title = getPageTitle(currentView);
    document.title = `${title} · AgriFlow`;

    const emoji = FAVICON_EMOJIS[currentView] || '🌱';
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
    if (link) {
      link.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emoji}</text></svg>`;
    }
  }, [currentView]);

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
     const handleOpenAuth = () => {
       setIsAuthModalOpen(true);
     };

  const renderContent = () => {
    return (
      <Suspense fallback={<LazyLoader />}>
        {(() => {
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
            case NavigationTab.LABOR: return <FarmLaborPlanner />;
            case NavigationTab.SETTINGS: return <SettingsPage />;
            default: return <Dashboard />;
          }
        })()}
      </Suspense>
    );
  };

  const handleLogout = () => {
    logout();
    setHasStarted(false);
    localStorage.removeItem('agriflow_has_started');
    navigate(NavigationTab.DASHBOARD);
    setIsMobileOpen(false);
  };

   const handleAuthSubmit = async (email: string, password: string, remember: boolean) => {
     const dummyData: OnboardingData = {
       name: email.split('@')[0] || email,
       farmName: `${email.split('@')[0]}'s Farm`,
       countryCode: 'NG',
       farmType: 'mixed',
       farmSize: 1,
       areaUnit: 'ha',
     };
     await login(dummyData);
     setIsAuthModalOpen(false);
     setHasStarted(true);
     localStorage.setItem('agriflow_has_started', 'true');
   };

   const handleSignup = async (data: OnboardingData & { email: string; password: string }) => {
     await login(data);
     setIsAuthModalOpen(false);
     setHasStarted(true);
     localStorage.setItem('agriflow_has_started', 'true');
   };

    if (!hasStarted) {
      return (
        <>
          <GetStarted onStart={handleOpenAuth} />
           <LoginPage
             isOpen={isAuthModalOpen}
             onClose={() => setIsAuthModalOpen(false)}
             onLogin={handleAuthSubmit}
             onSignup={handleSignup}
           />
        </>
      );
    }

  return (
    <div className="flex h-screen h-[100dvh] bg-app dark:bg-[#0C1810] overflow-hidden relative transition-colors duration-300">

      {/* GLOBAL TOAST CONTAINER */}
      <div aria-live="polite" aria-atomic="false" className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            role="alert"
            className={`
              pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md border animate-fade-in-up min-w-[300px] max-w-sm
              ${toast.type === 'success' ? 'bg-field-50/95 dark:bg-field-900/95 border-field-200 dark:border-field-800 text-field-800 dark:text-field-100' : ''}
              ${toast.type === 'error' ? 'bg-red-50/95 dark:bg-red-900/95 border-red-200 dark:border-red-800 text-red-800 dark:text-red-100' : ''}
              ${toast.type === 'info' ? 'bg-soil-50/95 dark:bg-[#12261A]/95 border-soil-200 dark:border-[#1C3A28] text-soil-800 dark:text-[#E8F0EA]' : ''}
            `}
          >
            <div className="shrink-0">
              {toast.type === 'success' && <CheckCircle className="w-5 h-5" aria-hidden="true" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5" aria-hidden="true" />}
              {toast.type === 'info' && <InfoIcon className="w-5 h-5" aria-hidden="true" />}
            </div>
            <p className="text-sm font-semibold flex-1">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} aria-label="Dismiss notification" className="opacity-50 hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      {/* --- GLOBAL VOICE AGENT --- */}
      <Suspense fallback={null}><VoiceAgent /></Suspense>

       {/* SIGN IN / SIGN UP MODAL */}
        <LoginPage
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleAuthSubmit}
          onSignup={handleSignup}
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
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative pb-24 md:pb-0">

        {/* TOP HEADER */}
        <header className="h-[72px] bg-white/80 dark:bg-[#12261A]/80 backdrop-blur-xl border-b border-soil-200/60 dark:border-[#1C3A28]/60 shrink-0 flex items-center justify-between px-4 md:px-8 z-20 transition-colors">

          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 text-soil-600 dark:text-[#8BA898] hover:bg-soil-100 dark:hover:bg-[#183222] rounded-xl mr-3 focus:outline-none"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-primary-dynamic tracking-tight font-heading">
                {getPageTitle(currentView)}
              </h1>
              <p className="text-[10px] md:text-xs text-field-600 dark:text-field-400 font-medium hidden md:block">
                Your farm at a glance
              </p>
            </div>
          </div>

          {/* Right: Profile & Controls */}
          <div className="flex items-center gap-2 md:gap-5">

            {/* System Controls (Hidden on small mobile) */}
            <div className="hidden md:flex items-center gap-3 border-r border-soil-200/60 dark:border-[#1C3A28]/60 pr-5">
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-soil-50 dark:bg-[#183222] text-soil-500 dark:text-[#8BA898] border border-soil-200 dark:border-[#1C3A28] hover:bg-soil-100 dark:hover:bg-[#1E3D2A] transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                Search
                <kbd className="ml-1.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg bg-white dark:bg-[#0C1810] border border-soil-200 dark:border-[#1C3A28] text-[9px] font-medium text-soil-400 dark:text-[#8BA898]">
                  <Command className="w-2.5 h-2.5" />K
                </kbd>
              </button>

              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`flex items-center px-3 py-2 rounded-xl text-[11px] font-semibold transition-all border ${isOnline ? 'bg-field-50 dark:bg-field-900/30 text-field-700 dark:text-field-400 border-field-200 dark:border-field-800' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'}`}
              >
                {isOnline ? <Wifi className="w-3 h-3 mr-1.5" /> : <WifiOff className="w-3 h-3 mr-1.5" />}
                {isOnline ? 'Online' : 'Offline'}
              </button>
              <button className="flex items-center px-3 py-2 rounded-xl text-[11px] font-semibold bg-soil-50 dark:bg-[#183222] text-soil-600 dark:text-[#8BA898] border border-soil-200 dark:border-[#1C3A28] hover:bg-soil-100 dark:hover:bg-[#1E3D2A] transition-colors">
                <Globe className="w-3 h-3 mr-1.5" /> EN
              </button>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-soil-400 dark:text-[#8BA898] hover:text-soil-600 dark:hover:text-[#E8F0EA] transition-colors focus:outline-none"
                >
                  <Bell className="w-5 h-5" />
                  {unreadAlerts > 0 && <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#12261A]"></span>}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 card-surface z-50 animate-fade-in-up overflow-hidden">
                    <div className="bg-soil-50 dark:bg-[#183222] p-3 border-b border-soil-200 dark:border-[#1C3A28] flex justify-between items-center">
                      <h3 className="text-xs font-semibold text-soil-800 dark:text-[#E8F0EA]">Alerts ({unreadAlerts})</h3>
                      <button onClick={() => setShowNotifications(false)} className="text-soil-400 hover:text-soil-600 dark:hover:text-[#E8F0EA]">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {alerts.length > 0 ? alerts.map(alert => (
                        <div key={alert.id} className="p-4 border-b border-soil-100 dark:border-[#1C3A28] hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors cursor-pointer group">
                          <div className="flex items-start gap-3">
                            <div className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-full text-red-600 dark:text-red-400 mt-0.5"><AlertTriangle className="w-4 h-4" /></div>
                            <div>
                              <p className="text-sm font-semibold text-primary-dynamic group-hover:text-red-700 dark:group-hover:text-red-400">{alert.title}</p>
                              <p className="text-xs text-secondary-dynamic mt-1">{alert.message}</p>
                               <p className="text-[10px] text-soil-400 dark:text-[#8BA898] font-medium mt-2">Just now</p>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="p-4 text-center text-soil-400 dark:text-[#8BA898] text-xs">No active alerts</div>
                      )}
                    </div>
                    <div className="bg-soil-50 dark:bg-[#183222] p-2 border-t border-soil-200 dark:border-[#1C3A28] text-center">
                      <button className="text-[10px] font-semibold text-soil-500 dark:text-[#8BA898] hover:text-soil-800 dark:hover:text-[#E8F0EA]">Mark all as read</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Profile / Sign In */}
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-primary-dynamic leading-none">{userProfile.name}</p>
                  <p className="text-[10px] text-secondary-dynamic font-medium mt-1">{userProfile.role}</p>
                </div>
                <div
                  onClick={() => navigate(NavigationTab.SETTINGS)}
                  className="relative cursor-pointer group"
                  title="Settings"
                >
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-field-800 dark:bg-field-700 text-harvest-400 flex items-center justify-center font-bold text-lg border-2 border-white dark:border-[#1E3D2A] shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
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
                  <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#12261A] ${isOnline ? 'bg-field-500' : 'bg-red-500'} shadow-sm`}></div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-harvest-500 hover:bg-harvest-400 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-harvest-500/20 active:scale-95"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            )}

          </div>
        </header>

        {/* Scrollable Content */}
        <main
          ref={mainRef}
          className="flex-1 overflow-auto p-4 md:p-8 bg-content dark:bg-[#0A1A0F] transition-colors custom-scrollbar"
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

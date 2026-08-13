
import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { Avatar } from '@/utils/avatar';
import { Menu, Wifi, WifiOff, Globe, Bell, X, AlertTriangle, TrendingUp, Info, LogIn, User, Loader2, CheckCircle, AlertCircle, Info as InfoIcon, Search, Command } from 'lucide-react';
import Sidebar from './components/Sidebar';
import CommandPalette from './components/CommandPalette';
import GetStarted from './components/GetStarted';
import { LoginPage } from './components/LoginPage';
import { NotificationBell } from './components/NotificationBell';

const Dashboard = lazy(() => import('./components/Dashboard'));
const CropManager = lazy(() => import('./components/CropManager'));
const LivestockManager = lazy(() => import('./components/LivestockManager'));
const EducationHub = lazy(() => import('./components/EducationHub'));
const MarketAnalytics = lazy(() => import('./components/MarketAnalytics'));
const NewsHub = lazy(() => import('./components/NewsHub'));
const AIAdvisor = lazy(() => import('./components/AIAdvisor'));
const ResourceCalculator = lazy(() => import('./components/ResourceCalculator'));
const CommunityHub = lazy(() => import('./components/CommunityHubWrapper'));
const FarmLaborPlanner = lazy(() => import('./components/FarmLaborPlanner'));
const SettingsPage = lazy(() => import('./components/Settings'));
const VoiceAgent = lazy(() => import('./components/VoiceAgent'));
const PlantingCalendar = lazy(() => import('./components/PlantingCalendar'));

import { NavigationTab, OnboardingData } from './types';
import { RouteErrorBoundary } from './components/RouteErrorBoundary';
import { FarmProvider, useFarm } from './contexts/FarmContext';
import { getRelativeTime } from './utils/localeFormat';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const LazyLoader: React.FC = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="w-8 h-8 animate-spin text-jade-500" />
  </div>
);

const AppContent: React.FC = () => {
  console.log('[AgriFlow] AppContent rendering...');
  const { userProfile, alerts, isSignedIn, login, signIn, logout, toasts, removeToast, currentView, navigate, dismissAlert, dismissAllAlerts } = useFarm();
  console.log('[AgriFlow] useFarm() called, isSignedIn:', isSignedIn);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(() => isSignedIn);
  console.log('[AgriFlow] hasStarted:', hasStarted);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [viewKey, setViewKey] = useState(0);
  const mainRef = useRef<HTMLElement>(null);
  const scrollPositions = useRef<Record<string, number>>({});
  const prevViewRef = useRef<NavigationTab>(currentView);
  const notifRef = useRef<HTMLDivElement>(null);

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

  const getPageSubtitle = (tab: NavigationTab) => {
    switch(tab) {
      case NavigationTab.AI_ADVISOR: return 'Ask questions, get advice';
      case NavigationTab.CALCULATOR: return 'Optimize inputs & reduce waste';
      case NavigationTab.COMMUNITY: return 'Connect with fellow farmers';
      case NavigationTab.CROPS: return 'Monitor & manage your fields';
      case NavigationTab.DASHBOARD: return 'Your farm at a glance';
      case NavigationTab.EDUCATION: return 'Grow your knowledge';
      case NavigationTab.LIVESTOCK: return 'Track your herd & records';
      case NavigationTab.MARKET: return 'Prices, trends & opportunities';
      case NavigationTab.NEWS: return 'Agricultural news & updates';
      case NavigationTab.LABOR: return 'Plan tasks & workforce';
      case NavigationTab.CALENDAR: return 'Plan your season';
      case NavigationTab.SETTINGS: return 'Profile & preferences';
      default: return 'Smart farming assistant';
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

    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
    if (link) {
      link.href = '/logo-AgriFlow.png';
    }
  }, [currentView]);

  useEffect(() => {
    if (!showNotifications) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

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
   };
     const handleOpenAuth = () => {
       setIsAuthModalOpen(true);
     };

  const renderContent = () => {
    const goHome = () => navigate(NavigationTab.DASHBOARD);
    return (
      <Suspense fallback={<LazyLoader />}>
        {(() => {
          switch (currentView) {
            case NavigationTab.DASHBOARD: return <RouteErrorBoundary routeName="Dashboard" onNavigateHome={goHome}><Dashboard /></RouteErrorBoundary>;
            case NavigationTab.CROPS: return <RouteErrorBoundary routeName="Crop Manager" onNavigateHome={goHome}><CropManager /></RouteErrorBoundary>;
            case NavigationTab.LIVESTOCK: return <RouteErrorBoundary routeName="Livestock" onNavigateHome={goHome}><LivestockManager /></RouteErrorBoundary>;
            case NavigationTab.CALCULATOR: return <RouteErrorBoundary routeName="Calculators" onNavigateHome={goHome}><ResourceCalculator /></RouteErrorBoundary>;
            case NavigationTab.COMMUNITY: return <RouteErrorBoundary routeName="Community" onNavigateHome={goHome}><CommunityHub /></RouteErrorBoundary>;
            case NavigationTab.EDUCATION: return <RouteErrorBoundary routeName="Education" onNavigateHome={goHome}><EducationHub /></RouteErrorBoundary>;
            case NavigationTab.MARKET: return <RouteErrorBoundary routeName="Market Analytics" onNavigateHome={goHome}><MarketAnalytics /></RouteErrorBoundary>;
            case NavigationTab.NEWS: return <RouteErrorBoundary routeName="News Hub" onNavigateHome={goHome}><NewsHub /></RouteErrorBoundary>;
            case NavigationTab.AI_ADVISOR: return <RouteErrorBoundary routeName="AI Advisor" onNavigateHome={goHome}><AIAdvisor /></RouteErrorBoundary>;
            case NavigationTab.LABOR: return <RouteErrorBoundary routeName="Labor Planner" onNavigateHome={goHome}><FarmLaborPlanner /></RouteErrorBoundary>;
            case NavigationTab.CALENDAR: return <RouteErrorBoundary routeName="Planting Calendar" onNavigateHome={goHome}><PlantingCalendar /></RouteErrorBoundary>;
            case NavigationTab.SETTINGS: return <RouteErrorBoundary routeName="Settings" onNavigateHome={goHome}><SettingsPage /></RouteErrorBoundary>;
            default: return <RouteErrorBoundary routeName="Dashboard" onNavigateHome={goHome}><Dashboard /></RouteErrorBoundary>;
          }
        })()}
      </Suspense>
    );
  };

  const handleLogout = () => {
    logout();
    setHasStarted(false);
    navigate(NavigationTab.DASHBOARD);
    setIsMobileOpen(false);
  };

   const handleAuthSubmit = async (data: { email: string; password: string; remember: boolean }) => {
     try {
       await signIn(data.email, data.password);
       setIsAuthModalOpen(false);
       setHasStarted(true);
       navigate(NavigationTab.DASHBOARD);
     } catch (err) {
       console.error('[AgriFlow] Sign-in failed:', err);
     }
   };

const handleSignup = async (data: OnboardingData & { email: string; password: string }) => {
      try {
        await login(data);
        const hash = await hashPassword(data.password);
        localStorage.setItem('agriflow_credentials', JSON.stringify({ email: data.email, passwordHash: hash }));
        setIsAuthModalOpen(false);
        setHasStarted(true);
        navigate(NavigationTab.DASHBOARD);
      } catch (err) {
        console.error('[AgriFlow] Sign-up failed:', err);
      }
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
      <div aria-live="polite" aria-atomic="false" className="fixed top-24 right-4 z-toast flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            role="alert"
            className={`
              pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md border animate-fade-in-up min-w-[300px] max-w-sm
              ${toast.type === 'success' ? 'bg-jade-50/95 dark:bg-jade-900/95 border-jade-200 dark:border-jade-800 text-jade-800 dark:text-jade-100' : ''}
              ${toast.type === 'error' ? 'bg-red-50/95 dark:bg-red-900/95 border-red-200 dark:border-red-800 text-red-800 dark:text-red-100' : ''}
              ${toast.type === 'info' ? 'bg-terra-50/95 dark:bg-[#12261A]/95 border-terra-200 dark:border-[#1E5A47] text-terra-800 dark:text-[#E8F0EA]' : ''}
              ${toast.type === 'warning' ? 'bg-amber-50/95 dark:bg-amber-900/95 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-100' : ''}
            `}
          >
            <div className="shrink-0">
              {toast.type === 'success' && <CheckCircle className="w-5 h-5" aria-hidden="true" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5" aria-hidden="true" />}
              {toast.type === 'info' && <InfoIcon className="w-5 h-5" aria-hidden="true" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5" aria-hidden="true" />}
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

       {/* SIGN IN / SIGN UP MODAL (only when user has started but is signed out) */}
       {hasStarted && !isSignedIn && (
         <LoginPage
           isOpen={isAuthModalOpen}
           onClose={() => setIsAuthModalOpen(false)}
           onLogin={handleAuthSubmit}
           onSignup={handleSignup}
         />
       )}

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
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">

        {/* TOP HEADER */}
        <header className="h-[72px] bg-white/80 dark:bg-[#12261A]/80 backdrop-blur-xl border-b border-terra-200/60 dark:border-[#1E5A47]/60 shrink-0 flex items-center justify-between px-4 md:px-8 z-20 transition-colors">

          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 text-terra-600 dark:text-[#7BA896] hover:bg-terra-100 dark:hover:bg-[#163D2F] rounded-xl mr-3 focus:outline-none"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-primary-dynamic tracking-tight font-heading">
                {getPageTitle(currentView)}
              </h1>
              <p className="text-[10px] md:text-xs text-jade-600 dark:text-jade-400 font-medium hidden md:block">
                {getPageSubtitle(currentView)}
              </p>
            </div>
          </div>

          {/* Right: Profile & Controls */}
          <div className="flex items-center gap-2 md:gap-5">

            {/* System Controls (Hidden on small mobile) */}
            <div className="hidden md:flex items-center gap-3 border-r border-terra-200/60 dark:border-[#1E5A47]/60 pr-5">
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-terra-50 dark:bg-[#163D2F] text-terra-500 dark:text-[#7BA896] border border-terra-200 dark:border-[#1E5A47] hover:bg-terra-100 dark:hover:bg-[#1E3D2A] transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                Search
                <kbd className="ml-1.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg bg-white dark:bg-[#0C1810] border border-terra-200 dark:border-[#1E5A47] text-[9px] font-medium text-terra-400 dark:text-[#7BA896]">
                  <Command className="w-2.5 h-2.5" />K
                </kbd>
              </button>

              <div
                className={`flex items-center px-3 py-2 rounded-xl text-[11px] font-semibold border ${isOnline ? 'bg-jade-50 dark:bg-jade-900/30 text-jade-700 dark:text-jade-400 border-jade-200 dark:border-jade-800' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'}`}
              >
                {isOnline ? <Wifi className="w-3 h-3 mr-1.5" /> : <WifiOff className="w-3 h-3 mr-1.5" />}
                {isOnline ? 'Online' : 'Offline'}
              </div>

              {/* Notifications Bell */}
              <NotificationBell />

              {/* System Alerts */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-terra-400 dark:text-[#7BA896] hover:text-terra-600 dark:hover:text-[#E8F0EA] transition-colors focus:outline-none"
                >
                  <Bell className="w-5 h-5" />
                  {unreadAlerts > 0 && <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#12261A]"></span>}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 card-surface z-dropdown animate-fade-in-up overflow-hidden">
                    <div className="bg-terra-50 dark:bg-[#163D2F] p-3 border-b border-terra-200 dark:border-[#1E5A47] flex justify-between items-center">
                      <h3 className="text-xs font-semibold text-terra-800 dark:text-[#E8F0EA]">Alerts ({unreadAlerts})</h3>
                      <button onClick={() => setShowNotifications(false)} className="text-terra-400 hover:text-terra-600 dark:hover:text-[#E8F0EA]">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {alerts.length > 0 ? alerts.map(alert => (
                        <div key={alert.id} onClick={() => dismissAlert(alert.id)} className="p-4 border-b border-terra-100 dark:border-[#1E5A47] hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors cursor-pointer group">
                          <div className="flex items-start gap-3">
                            <div className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-full text-red-600 dark:text-red-400 mt-0.5"><AlertTriangle className="w-4 h-4" /></div>
                            <div>
                              <p className="text-sm font-semibold text-primary-dynamic group-hover:text-red-700 dark:group-hover:text-red-400">{alert.title}</p>
                              <p className="text-xs text-secondary-dynamic mt-1">{alert.message}</p>
                                <p className="text-[10px] text-terra-400 dark:text-[#7BA896] font-medium mt-2">{alert.timestamp ? getRelativeTime(alert.timestamp) : 'Just now'}</p>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="p-4 text-center text-terra-400 dark:text-[#7BA896] text-xs">No active alerts</div>
                      )}
                    </div>
                    <div className="bg-terra-50 dark:bg-[#163D2F] p-2 border-t border-terra-200 dark:border-[#1E5A47] text-center">
                       <button onClick={() => { dismissAllAlerts(); setShowNotifications(false); }} className="text-[10px] font-semibold text-terra-500 dark:text-[#7BA896] hover:text-terra-800 dark:hover:text-[#E8F0EA]">Mark all as read</button>
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
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-jade-800 dark:bg-jade-700 text-sunburst-400 flex items-center justify-center font-bold text-lg border-2 border-white dark:border-[#1E3D2A] shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
                    {userProfile.avatar ? (
                      <img
                        src={userProfile.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/stock/user.svg';
                        }}
                      />
                    ) : (
                      <Avatar name={userProfile.name} size={40} />
                    )}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#12261A] ${isOnline ? 'bg-jade-500' : 'bg-red-500'} shadow-sm`}></div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-sunburst-500 hover:bg-sunburst-400 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-sunburst-500/20 active:scale-95"
              >
                <LogIn className="w-4 h-4" /> Sign in
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

        {/* Footer Bar */}
        <footer className="shrink-0 px-4 md:px-8 py-2.5 border-t border-terra-200/40 dark:border-[#1E5A47]/40 bg-content dark:bg-[#0A1A0F] flex items-center justify-between text-[10px] text-terra-400/70 dark:text-[#4D8A72]/70">
          <div className="flex items-center gap-1.5">
            <img src="/logo-AgriFlow.png" alt="AgriFlow" className="w-4 h-4 rounded-sm" />
            <span className="font-semibold text-terra-500 dark:text-[#7BA896]">AgriFlow 2.0</span>
            <span>· © 2026</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span>Built for farmers, by farmers</span>
            <span className="text-jade-500 dark:text-jade-400">🌾</span>
          </div>
        </footer>
      </div>

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

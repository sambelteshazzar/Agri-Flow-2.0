import React, { useEffect, useRef } from 'react';
import { Bell, X, CheckCircle2, MessageSquare, Heart, UserPlus, Award, TrendingUp, Clock, Cloud } from 'lucide-react';
import { useFarm } from '@/contexts/FarmContext';
import { parseContent, renderParsedContent } from '@/utils/parseContent';

const ICON_MAP: Record<string, React.ElementType> = {
  reply: MessageSquare,
  like: Heart,
  follow: UserPlus,
  mention: Award,
  answer: MessageSquare,
  accepted_answer: CheckCircle2,
  market_alert: TrendingUp,
  weather_alert: Cloud,
};

export function NotificationBell() {
  const { 
    notifications, unreadNotificationCount, isSignedIn, userProfile,
    markNotificationAsRead, markAllNotificationsAsRead, getNotifications 
  } = useFarm();
  
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSignedIn && notifications.length === 0) {
      getNotifications();
    }
  }, [isSignedIn, notifications.length, getNotifications]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
    // Navigate based on reference
    if (notification.referenceType === 'post' && notification.referenceId) {
      // Could navigate to post
    }
    setIsOpen(false);
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAllNotificationsAsRead();
  };

  if (!isSignedIn) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-terra-400 dark:text-[#7BA896] hover:text-terra-600 dark:hover:text-[#E8F0EA] transition-colors focus:outline-none"
        aria-label={`Notifications${unreadNotificationCount > 0 ? `, ${unreadNotificationCount} unread` : ''}`}
      >
        <Bell className="w-5 h-5" />
        {unreadNotificationCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#12261A]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 card-surface z-dropdown animate-fade-in-up overflow-hidden shadow-xl">
          <div className="flex items-center justify-between p-3 border-b border-terra-200 dark:border-[#1E5A47]">
            <h3 className="text-sm font-semibold text-terra-800 dark:text-[#E8F0EA]">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadNotificationCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-[10px] font-semibold text-terra-500 dark:text-[#7BA896] hover:text-terra-800 dark:hover:text-[#E8F0EA]">
                  Mark all read
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-terra-400 hover:text-terra-600 dark:hover:text-[#E8F0EA]">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-terra-400 dark:text-[#7BA896] text-xs">
                No notifications yet
              </div>
            ) : (
              notifications.map(notification => {
                const Icon = ICON_MAP[notification.type] || Bell;
                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full p-4 text-left hover:bg-terra-50 dark:hover:bg-[#163D2F] transition-colors border-b border-terra-100 dark:border-[#1E5A47] ${!notification.read ? 'bg-terra-50/50 dark:bg-jade-900/20' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl ${!notification.read ? 'bg-jade-100 dark:bg-jade-900/30' : 'bg-terra-100 dark:bg-[#1E3D2A]'}`}>
                        <Icon className={`w-4 h-4 ${!notification.read ? 'text-jade-600 dark:text-jade-400' : 'text-terra-400 dark:text-jade-500'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-semibold ${!notification.read ? 'text-terra-900 dark:text-white' : 'text-terra-700 dark:text-terra-300'}`}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] text-terra-400 dark:text-jade-500 shrink-0 ml-2">
                            {getTimeAgo(notification.date)}
                          </span>
                        </div>
                        <p className="text-xs text-terra-500 dark:text-jade-400 mt-1 line-clamp-2">
                          {renderParsedContent(parseContent(notification.message))}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-jade-500 mt-1.5 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
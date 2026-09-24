import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import { motion } from 'framer-motion';
import {
  Home,
  Compass,
  Globe,
  Sparkles,
  Award,
  MessageSquare,
  LayoutDashboard,
  ShieldAlert,
  Info,
  User
} from 'lucide-react';

export const FloatingNavPill: React.FC = () => {
  const { currentView, setCurrentView, currentUser, isAuthenticated, triggerAuthGate } = useApp();

  interface NavItem {
    view: AppView;
    label: string;
    icon: React.ReactNode;
    requiresAuth?: boolean;
    authAction?: string;
  }

  // Adaptive navigation:
  // Logged-out users: Home, Explore, Alumni Network, Mentors, Achievements, About
  // Logged-in users: Home, Explore, Alumni Network, Mentors, Achievements, Dashboard, Chat
  const navItems: NavItem[] = !isAuthenticated
    ? [
        { view: 'landing', label: 'Home', icon: <Home className="w-4 h-4" /> },
        { view: 'explore', label: 'Explore', icon: <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" /> },
        { view: 'map', label: 'Alumni Network', icon: <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> },
        { view: 'mentors', label: 'Mentors', icon: <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" /> },
        { view: 'achievements', label: 'Achievements', icon: <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" /> },
        { view: 'about', label: 'About', icon: <Info className="w-4 h-4 text-slate-500 dark:text-slate-400" /> }
      ]
    : [
        { view: 'landing', label: 'Home', icon: <Home className="w-4 h-4" /> },
        { view: 'explore', label: 'Explore', icon: <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" /> },
        { view: 'map', label: 'Alumni Network', icon: <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> },
        { view: 'mentors', label: 'Mentors', icon: <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" /> },
        { view: 'achievements', label: 'Achievements', icon: <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" /> },
        {
          view:
            currentUser.role === 'student'
              ? 'student-dashboard'
              : currentUser.role === 'alumni'
              ? 'alumni-dashboard'
              : 'admin-dashboard',
          label: 'Dashboard',
          icon: <LayoutDashboard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        },
        {
          view: 'chat',
          label: 'Chat',
          icon: <MessageSquare className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        },
        { view: 'about', label: 'About', icon: <Info className="w-4 h-4 text-slate-500 dark:text-slate-400" /> },
        ...(currentUser.role !== 'admin'
          ? [
              {
                view: 'my-profile' as AppView,
                label: 'Profile',
                icon: <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              }
            ]
          : []),
        ...(currentUser.role === 'admin'
          ? [
              {
                view: 'admin-dashboard' as AppView,
                label: 'Admin',
                icon: <ShieldAlert className="w-4 h-4 text-amber-600" />
              }
            ]
          : [])
      ];

  const handleNavClick = (item: NavItem) => {
    if (item.requiresAuth && !isAuthenticated) {
      triggerAuthGate(item.authAction || 'access this protected area');
      return;
    }
    setCurrentView(item.view);
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0, x: '-50%' }}
      animate={{ y: 0, opacity: 1, x: '-50%' }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      className="fixed bottom-4 sm:bottom-5 left-1/2 z-40 max-w-[96vw]"
    >
      <nav
        aria-label="Primary Navigation"
        className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 rounded-full shadow-xl shadow-slate-900/10 dark:shadow-black/50 text-slate-700 dark:text-slate-200 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {navItems.map(item => {
          const isActive =
            currentView === item.view ||
            (item.label === 'Dashboard' && currentView.includes('dashboard'));

          return (
            <motion.button
              key={`${item.view}-${item.label}`}
              onClick={() => handleNavClick(item)}
              title={item.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                isActive
                  ? 'text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="floatingActiveNavPill"
                  className="absolute inset-0 bg-blue-600 rounded-full -z-10 shadow-sm"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10">{item.icon}</span>
              <span className="relative z-10 inline text-[11px] sm:text-xs">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </motion.div>
  );
};

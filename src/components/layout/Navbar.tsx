import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  LayoutDashboard,
  User,
  LogOut,
  Bell,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Sun,
  Moon,
  Smartphone,
  Search,
  X
} from 'lucide-react';
import { AlumniConnectLogo } from '../common/AlumniConnectLogo';
import { UserAvatar } from '../common/UserAvatar';
import { AppView } from '../../types';

import { AnimatePresence, motion } from 'framer-motion';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    logout,
    currentView,
    navigate,
    setCurrentView,
    setAuthModalOpen,
    setAuthModalMode,
    notifications,
    unreadNotifCount,
    markNotificationsAsRead,
    theme,
    toggleTheme,
    setGetTheAppModalOpen,
    globalSearchQuery,
    setGlobalSearchQuery
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleNavClick = (view: AppView) => {
    navigate(view);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentView !== 'explore') {
      navigate('explore');
    }
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2">
          {/* Left: Brand Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer shrink-0"
            onClick={() => handleNavClick('landing')}
            title="Alumni Connect Home"
          >
            <AlumniConnectLogo size="md" />
          </motion.div>

          {/* Right Section: Actions & Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Search Button / Bar Toggle */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.form
                    key="search-form"
                    initial={{ opacity: 0, scale: 0.95, width: 140 }}
                    animate={{ opacity: 1, scale: 1, width: 'auto' }}
                    exit={{ opacity: 0, scale: 0.95, width: 140 }}
                    transition={{ duration: 0.18 }}
                    onSubmit={handleSearchSubmit}
                    className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 shadow-sm"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                    <input
                      type="text"
                      value={globalSearchQuery}
                      onChange={e => setGlobalSearchQuery(e.target.value)}
                      placeholder="Search alumni, skills, company..."
                      className="w-36 sm:w-56 text-xs bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                      autoFocus
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSearchOpen(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1 p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.button
                    key="search-btn"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setSearchOpen(true)}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Search platform"
                  >
                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* "Get the App" Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setGetTheAppModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/80 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
              title="Get Alumni Connect Mobile App"
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Get the App</span>
            </motion.button>

            {/* Theme Toggle (Light / Dark) */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ rotate: 180, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </motion.button>

            {/* Authenticated Controls */}
            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => {
                      setNotifOpen(!notifOpen);
                      if (!notifOpen) markNotificationsAsRead();
                    }}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                    {unreadNotifCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadNotifCount}
                      </span>
                    )}
                  </motion.button>

                  {/* Notifications Dropdown with Spring Popover */}
                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 6 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 z-50 text-slate-900 dark:text-slate-100"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                          <h3 className="text-sm font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
                            <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Notifications
                          </h3>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{notifications.length} updates</span>
                        </div>
                        <div className="max-h-72 overflow-y-auto space-y-1.5">
                          {notifications.length === 0 ? (
                            <p className="text-center py-4 text-xs text-slate-400">No notifications yet</p>
                          ) : (
                            notifications.map(n => (
                              <motion.div
                                key={n.id}
                                whileHover={{ scale: 1.01 }}
                                className={`p-2.5 rounded-xl text-xs transition-colors border ${
                                  !n.read
                                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900'
                                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                              >
                                <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                                  <span>{n.title}</span>
                                  <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{n.message}</p>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User Profile Menu */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 sm:gap-2 pl-1 pr-2 sm:pr-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-xs font-medium cursor-pointer shadow-2xs"
                  >
                    <UserAvatar
                      name={currentUser.name}
                      avatarUrl={currentUser.avatar}
                      size="sm"
                    />
                    <span className="hidden sm:inline font-bold text-slate-900 dark:text-slate-100">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                      <ShieldCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      {currentUser.role}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 6 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                        className="absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 z-50 text-slate-900 dark:text-slate-100"
                        onMouseLeave={() => setUserMenuOpen(false)}
                      >
                        <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center gap-3">
                          <UserAvatar
                            name={currentUser.name}
                            avatarUrl={currentUser.avatar}
                            size="md"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate">{currentUser.name}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {currentUser.email || currentUser.university}
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full w-fit">
                              <CheckCircle2 className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                              Verified {currentUser.role === 'student' ? 'Student' : currentUser.role === 'alumni' ? 'Alumni' : currentUser.role === 'teacher' ? 'Faculty' : 'Admin'}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (currentUser.role === 'student') navigate('student-dashboard');
                            else if (currentUser.role === 'alumni') navigate('alumni-dashboard');
                            else if (currentUser.role === 'teacher') navigate('teacher-dashboard');
                            else navigate('admin-dashboard');
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400 flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          Dashboard
                        </button>

                        {currentUser.role !== 'admin' && (
                          <button
                            onClick={() => {
                              navigate('my-profile');
                              setUserMenuOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400 flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            My Profile
                          </button>
                        )}

                      <button
                        onClick={() => {
                          navigate('chat');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400 flex items-center gap-2 cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        Messages & Chats
                      </button>

                      <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              </>
            ) : (
              /* Public / Logged-out Visitor Action Buttons */
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('signup');
                    setAuthModalOpen(true);
                  }}
                  className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs hover:shadow-xs transition-all cursor-pointer shrink-0"
                >
                  Join
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

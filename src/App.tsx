import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { FloatingNavPill } from './components/layout/FloatingNavPill';
import { LandingPage } from './components/landing/LandingPage';
import { ExploreAlumni } from './components/explore/ExploreAlumni';
import { IndiaAlumniMap } from './components/map/IndiaAlumniMap';
import { MentorshipHub } from './components/mentorship/MentorshipHub';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { AlumniDashboard } from './components/dashboard/AlumniDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PersonalProfileView } from './components/profile/PersonalProfileView';
import { ChatSystem } from './components/chat/ChatSystem';
import { AboutPage } from './components/about/AboutPage';
import { AchievementsPage } from './components/achievements/AchievementsPage';
import { AuthGateModal } from './components/auth/AuthGateModal';
import { AuthModal } from './components/auth/AuthModal';
import { OtpVerificationModal } from './components/auth/OtpVerificationModal';
import { AlumniDetailModal } from './components/explore/AlumniDetailModal';
import { MentorshipModal } from './components/mentorship/MentorshipModal';
import { GetTheAppModal } from './components/common/GetTheAppModal';
import { AIChatbotWidget } from './components/ai/AIChatbotWidget';
import { ToastContainer } from './components/common/ToastContainer';
import { IntroSequence } from './components/intro/IntroSequence';

import { AnimatePresence, motion } from 'framer-motion';

const MainAppContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#090D16] text-[#0F172A] dark:text-[#F8FAFC] relative pb-20 sm:pb-24 transition-colors duration-300">
      {/* 1.5-2s Cinematic Opening Educational Sequence */}
      <IntroSequence />

      {/* Top Sticky Navigation */}
      <Navbar />

      {/* Main View Router with Fluid Transitions */}
      <main className="flex-1 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex-1"
          >
            {currentView === 'landing' && <LandingPage />}
            {currentView === 'explore' && <ExploreAlumni />}
            {currentView === 'map' && <IndiaAlumniMap />}
            {currentView === 'mentors' && <MentorshipHub />}
            {currentView === 'achievements' && <AchievementsPage />}
            {currentView === 'student-dashboard' && <StudentDashboard />}
            {currentView === 'alumni-dashboard' && <AlumniDashboard />}
            {currentView === 'teacher-dashboard' && <TeacherDashboard />}
            {currentView === 'admin-dashboard' && <AdminDashboard />}
            {currentView === 'my-profile' && <PersonalProfileView />}
            {currentView === 'chat' && <ChatSystem />}
            {currentView === 'about' && <AboutPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Fixed Floating Navigation Pill */}
      <FloatingNavPill />

      {/* Floating AI Guide Chatbot Widget */}
      <AIChatbotWidget />

      {/* Auth Gate Modal for Logged-Out Visitors */}
      <AuthGateModal />

      {/* Modals & Dialogs */}
      <AuthModal />
      <OtpVerificationModal />
      <AlumniDetailModal />
      <MentorshipModal />
      <GetTheAppModal />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

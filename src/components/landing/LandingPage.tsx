import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  Compass,
  MapPin,
  CheckCircle2,
  Building2,
  Briefcase,
  Star,
  GraduationCap,
  MessageSquare,
  Search,
  Check,
  TrendingUp,
  Award,
  Globe,
  Lock,
  Layers,
  ChevronRight,
  Filter,
  BookOpen,
  Code2,
  FileCheck,
  HelpCircle,
  Clock,
  UserPlus,
  Zap,
  Radio,
  Activity
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { HeroNetworkBg } from '../common/HeroNetworkBg';
import { HeroCarousel } from '../common/HeroCarousel';
import { Hero3DCanvas } from '../canvas/Hero3DCanvas';
import { LiveActivityTicker } from '../common/LiveActivityTicker';
import { InteractiveTiltCard } from '../common/InteractiveTiltCard';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { AnimatedWorkflowPipeline } from '../common/AnimatedWorkflowPipeline';
import { AmbientMeshBg } from '../common/AmbientMeshBg';
import { IndiaCourseNetworkMap } from '../map/IndiaCourseNetworkMap';

export const LandingPage: React.FC = () => {
  const {
    setCurrentView,
    navigate,
    setAuthModalOpen,
    setAuthModalMode,
    alumniList,
    achievements,
    setSelectedAchievement,
    setSelectedAlumni,
    setGlobalSearchQuery,
    triggerAuthGate,
    isAuthenticated,
    sendConnectionRequest
  } = useApp();

  // AI Discovery Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCampusFilter, setSelectedCampusFilter] = useState('All');
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  // Requirement 3: 6 Changing/Animated Visual Storytelling Panels
  const STORY_PANELS = [
    {
      id: 'story-1',
      category: 'Discovery',
      title: 'Student Discovering an Alumni',
      tagline: 'Precision search across companies, skills & batches',
      description: 'An undergraduate student filters for senior alumni at Microsoft and discovers Rahul Sharma (IIT Roorkee / ML Engineer) to request career mentorship.',
      step: 'Student → Alumni',
      badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-900',
      icon: Compass,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      person: 'Rahul Sharma · ML Engineer at Microsoft',
      metric: 'Filtered from 10k+ Alumni'
    },
    {
      id: 'story-2',
      category: 'Mentorship',
      title: 'Alumni Mentoring a Student',
      tagline: '1-on-1 resume review & interview preparation',
      description: 'Priya Patel conducts a structured resume critique for Ayushi, highlighting cloud architecture certifications and suggesting impactful engineering bullets.',
      step: 'Alumni → Student',
      badgeColor: 'bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300 border-teal-200 dark:border-teal-900',
      icon: Sparkles,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      person: 'Priya Patel · Staff Engineer at Microsoft',
      metric: '5-Minute Guidance Session'
    },
    {
      id: 'story-3',
      category: 'Networking',
      title: 'Career / Networking Connection',
      tagline: 'Direct candidate referral into tier-1 tech pipelines',
      description: 'Aditya Negi reviews a student’s open-source Go backend portfolio, verifies system design readiness, and provides a priority referral at Zomato.',
      step: 'Network → Opportunity',
      badgeColor: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900',
      icon: Briefcase,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      person: 'Aditya Negi · Backend Lead at Zomato',
      metric: 'Direct Candidate Referral'
    },
    {
      id: 'story-4',
      category: 'Institution',
      title: 'Institutional Engagement',
      tagline: 'Campuses maintaining long-term verified relationships',
      description: 'Colleges and universities maintain centralized verified directories, track graduate milestones, and invite prominent alumni for campus symposia.',
      step: 'Alumni → Institution',
      badgeColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-900',
      icon: Building2,
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
      person: 'Dr. Rajesh Verma · Dean of Placements',
      metric: '50+ Partner Institutions'
    },
    {
      id: 'story-5',
      category: 'Opportunities',
      title: 'Events & Opportunities',
      tagline: 'Hackathons, webinars & live masterclasses',
      description: 'Students join live interactive webinars with senior Google & Microsoft alumni, gaining actionable insights on system design and interview techniques.',
      step: 'Student → Institution',
      badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-900',
      icon: Award,
      avatar: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
      person: 'Pan-India SDE Roadmap Webinar',
      metric: '100+ Annual Events'
    },
    {
      id: 'story-6',
      category: 'Success',
      title: 'Successful Alumni Stories',
      tagline: 'Milestone breakthroughs from campus to global leadership',
      description: 'Celebrating alumni who founded funded startups, co-authored top research papers, and reached executive leadership worldwide.',
      step: 'One Platform → Everything',
      badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
      icon: TrendingUp,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      person: 'Neha Bansal · Forbes 30 Under 30 Founder',
      metric: '250+ Startup & Career Breakthroughs'
    }
  ];

  // Interactive Floating Pills (inspired by reference image)
  const floatingPills = [
    { text: '1-on-1 Mentorship', bg: 'bg-blue-100/90 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800', rotation: '-rotate-3' },
    { text: 'Verified Alumni', bg: 'bg-teal-100/90 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 border-teal-200 dark:border-teal-800', rotation: 'rotate-2' },
    { text: 'Resume Review', bg: 'bg-indigo-100/90 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800', rotation: '-rotate-2' },
    { text: 'Cross-Campus Network', bg: 'bg-slate-100/90 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700', rotation: 'rotate-3' },
    { text: 'Mock Technical Interviews', bg: 'bg-sky-100/90 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200 border-sky-200 dark:border-sky-800', rotation: '-rotate-1' },
    { text: 'Career Roadmaps', bg: 'bg-amber-100/90 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800', rotation: 'rotate-2' },
    { text: 'Industry Referrals', bg: 'bg-emerald-100/90 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800', rotation: '-rotate-4' },
    { text: 'AI-Powered Matching', bg: 'bg-purple-100/90 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800', rotation: 'rotate-1' }
  ];

  // Participating Institutions
  const participatingInstitutions = [
    { name: "Tula's Institute", city: 'Dehradun', count: '1,420+ Alumni', focus: 'Engineering & Management' },
    { name: 'Graphic Era University', city: 'Dehradun', count: '3,800+ Alumni', focus: 'Computer Science & AI' },
    { name: 'IIT Roorkee', city: 'Roorkee', count: '6,200+ Alumni', focus: 'Technology & Research' },
    { name: 'IIT Hyderabad', city: 'Hyderabad', count: '2,900+ Alumni', focus: 'Product & Design' },
    { name: 'IIT Delhi', city: 'New Delhi', count: '5,400+ Alumni', focus: 'Enterprise & Startups' },
    { name: 'IIT Bombay', city: 'Mumbai', count: '7,100+ Alumni', focus: 'AI & Deep Tech' }
  ];

  // AI Search Example Logic (Section 12 requirement)
  const handlePerformAISearch = (queryText: string) => {
    setSearchQuery(queryText);
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 600);
  };

  const isExactQuery = searchQuery.toLowerCase().includes('microsoft') || searchQuery.toLowerCase().includes('machine learning');
  const filteredAlumni = alumniList.filter(alumni => {
    if (selectedCampusFilter === 'All') return true;
    return alumni.university.toLowerCase().includes(selectedCampusFilter.toLowerCase());
  });

  return (
    <div className="w-full flex flex-col bg-[#F8F9FA] dark:bg-[#090D16] text-[#0F172A] dark:text-[#F8FAFC] font-sans transition-colors duration-200">
      
      {/* ========================================================= */}
      {/* SECTION 7: MAIN HERO SECTION                              */}
      {/* ========================================================= */}
      <section className="relative w-full pt-10 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden bg-gradient-to-b from-white via-slate-50/70 to-slate-100/50 dark:from-[#0B1120] dark:via-[#090D16] dark:to-[#070A10]">

        {/* ── 3D Interactive WebGL Hero Canvas (Background Live Animation) ── */}
        <Hero3DCanvas className="opacity-80 dark:opacity-65" />

        {/* ── Interactive network canvas (behind everything) ── */}
        <HeroNetworkBg
          isDark={false}
          intensity={0.6}
          className="opacity-40 dark:opacity-25"
        />

        {/* ── Slow-drifting ambient blobs ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Top-right blob — drifts slowly */}
          <motion.div
            animate={{ x: [0, 18, 0], y: [0, -12, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-32 right-8 w-[500px] h-[500px] bg-blue-100 dark:bg-blue-900/40 rounded-full blur-3xl opacity-40 dark:opacity-20"
          />
          {/* Bottom-left blob — drifts opposite */}
          <motion.div
            animate={{ x: [0, -14, 0], y: [0, 16, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            className="absolute top-48 -left-20 w-[420px] h-[420px] bg-indigo-100 dark:bg-indigo-900/40 rounded-full blur-3xl opacity-35 dark:opacity-15"
          />
          {/* Center-right lavender blob */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
            className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-violet-100 dark:bg-violet-900/20 rounded-full blur-3xl opacity-20 dark:opacity-10"
          />
        </div>

        {/* ── Floating geometric accent dots ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-400/20 dark:bg-blue-400/10"
              style={{
                width: 6 + i * 4,
                height: 6 + i * 4,
                left: `${15 + i * 18}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -(8 + i * 5), 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 4 + i * 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.8,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">

            {/* ── Left Column ── */}
            <div className="lg:col-span-6 text-left space-y-6">

              {/* Label strip */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
              >
                <p className="text-[10px] sm:text-[11px] font-black tracking-[0.22em] uppercase text-blue-600 dark:text-blue-400 mb-3">
                  YOUR COLLEGE &nbsp;•&nbsp; YOUR NETWORK &nbsp;•&nbsp; YOUR FUTURE
                </p>
              </motion.div>

              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900 text-xs font-semibold text-blue-800 dark:text-blue-300 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Verified Pan-India University Network</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.10]"
              >
                Connect.{' '}Discover.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 dark:from-blue-400 dark:via-indigo-400 dark:to-teal-400">
                  Grow Together.
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.28 }}
                className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-xl"
              >
                Alumni Connect bridges students, alumni, mentors and institutions into one trusted ecosystem — powered by verified institutional identity.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.36 }}
                className="pt-2 flex flex-wrap items-center gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate('explore')}
                  className="px-5 sm:px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-shadow flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Alumni</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate('mentors')}
                  className="px-5 sm:px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-shadow flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Find a Mentor</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { setAuthModalMode('signup'); setAuthModalOpen(true); }}
                  className="px-5 sm:px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Join the Network</span>
                </motion.button>
              </motion.div>

              {/* Floating Pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.48 }}
                className="pt-2"
              >
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2.5">
                  Verified Ecosystem Highlights
                </span>
                <div className="flex flex-wrap gap-2">
                  {floatingPills.slice(0, 6).map((pill, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.08, y: -2 }}
                      animate={{ y: [0, -(2 + idx % 3), 0] }}
                      transition={{
                        duration: 3.5 + idx * 0.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: idx * 0.3,
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm cursor-default ${pill.bg} ${pill.rotation}`}
                    >
                      <Sparkles className="w-3 h-3 opacity-70" />
                      <span>{pill.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Floating info cards — gently bob with live beacons */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="flex flex-wrap gap-3 pt-1"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-300 group hover:border-blue-400 transition-colors"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  <span className="text-base">🎓</span> 10,000+ Verified Alumni
                </motion.div>
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-300 group hover:border-indigo-400 transition-colors"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  <span className="text-base">🏛️</span> 50+ Institutions
                </motion.div>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-300 group hover:border-teal-400 transition-colors"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                  </span>
                  <span className="text-base">✨</span> 500+ Active Mentors
                </motion.div>
              </motion.div>
            </div>

            {/* ── Right Column: Layered Editorial Carousel ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 relative pb-8"
            >
              {/* Subtle floating motion on the whole carousel */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              >
                <HeroCarousel />
              </motion.div>

              {/* Floating stat card — top-left of image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                style={{ top: '12%', left: '-5%' }}
                className="absolute z-20 hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-lg text-xs font-bold text-slate-800 dark:text-slate-200 hover:scale-105 transition-transform"
              >
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white">10k+</p>
                    <p className="text-[10px] text-slate-500 font-medium">Verified Alumni</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating stat card — bottom-right of image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.85, duration: 0.5 }}
                style={{ bottom: '16%', right: '-4%' }}
                className="absolute z-20 hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-lg text-xs font-bold text-slate-800 dark:text-slate-200 hover:scale-105 transition-transform"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/60 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white">500+</p>
                    <p className="text-[10px] text-slate-500 font-medium">Active Mentors</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating Live Mentorship Session Active card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                style={{ bottom: '-3%', left: '4%' }}
                className="absolute z-20 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-emerald-500/30 dark:border-emerald-500/30 shadow-xl text-xs font-bold hover:scale-105 transition-transform cursor-pointer"
                onClick={() => navigate('mentors')}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <div>
                  <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-extrabold text-[11px]">
                    <span>Live Mentorship Active</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">1-on-1</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Rahul S. (Microsoft) & Ayush A.</p>
                </div>
              </motion.div>

              {/* Floating verified badge */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.45 }}
                style={{ top: '60%', right: '-3%' }}
                className="absolute z-20 hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 shadow-md"
              >
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                  className="flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300">Verified Network</span>
                </motion.div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── LIVE ACTIVITY TICKER (Continuous ecosystem pulse) ── */}
      <LiveActivityTicker />

      {/* ========================================================= */}
      {/* SECTION 9: BELOW-HERO CONTENT (Requirement 9)             */}
      {/* ========================================================= */}
      {/* SECTION 4: STATIC DATA / IMPACT SECTION                   */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Header & Exact Metrics */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
              <span>Platform Impact</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Measurable Impact Across Higher Education
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Authentic connections bridging campuses, corporate organizations, and mentorship communities nationwide.
            </p>

            {/* 6 Professional Impact Metrics Grid (Requirement 4) with Live Animated Counters & 3D Tilt */}
            <div className="pt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-left">
              <InteractiveTiltCard glowColor="rgba(59, 130, 246, 0.25)">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 h-full flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-baseline">
                      <AnimatedCounter value={10000} suffix="+" />
                    </div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Alumni</div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Verified across top firms
                  </div>
                </div>
              </InteractiveTiltCard>

              <InteractiveTiltCard glowColor="rgba(37, 99, 235, 0.25)">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 h-full flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 flex items-baseline">
                      <AnimatedCounter value={50} suffix="+" />
                    </div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Institutions</div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span> IITs, NITs & State Unis
                  </div>
                </div>
              </InteractiveTiltCard>

              <InteractiveTiltCard glowColor="rgba(99, 102, 241, 0.25)">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 h-full flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 flex items-baseline">
                      <AnimatedCounter value={500} suffix="+" />
                    </div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Mentors</div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block"></span> Active guidance leads
                  </div>
                </div>
              </InteractiveTiltCard>

              <InteractiveTiltCard glowColor="rgba(20, 184, 166, 0.25)">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 h-full flex flex-col justify-between hover:border-teal-300 dark:hover:border-teal-700 transition-colors">
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400 flex items-baseline">
                      <AnimatedCounter value={1000} suffix="+" />
                    </div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Student Pairs</div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block"></span> Verified 1-on-1 pairs
                  </div>
                </div>
              </InteractiveTiltCard>

              <InteractiveTiltCard glowColor="rgba(245, 158, 11, 0.25)">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 h-full flex flex-col justify-between hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 flex items-baseline">
                      <AnimatedCounter value={250} suffix="+" />
                    </div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Opportunities</div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span> Direct referral posts
                  </div>
                </div>
              </InteractiveTiltCard>

              <InteractiveTiltCard glowColor="rgba(168, 85, 247, 0.25)">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 h-full flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 flex items-baseline">
                      <AnimatedCounter value={100} suffix="+" />
                    </div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Alumni Events</div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block"></span> Webinars & reunions
                  </div>
                </div>
              </InteractiveTiltCard>
            </div>
          </div>

          {/* Section: How Alumni Connect Makes a Difference (Requirement 4) */}
          <div className="space-y-8 pt-4">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-full border border-teal-200/70 dark:border-teal-900">
                Ecosystem Architecture
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
                How Alumni Connect Makes a Difference
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                A structured multi-stakeholder model bridging every facet of education and career advancement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Card 1: Student -> Alumni */}
              <InteractiveTiltCard glowColor="rgba(59, 130, 246, 0.2)">
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-blue-500/50 transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 mb-3">
                      <span>Student → Alumni</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">Discovery & Guidance</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Students can discover alumni based on industry, skills, company and interests.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-700 text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Filter by 12+ professions & skills
                  </div>
                </div>
              </InteractiveTiltCard>

              {/* Card 2: Alumni -> Student */}
              <InteractiveTiltCard glowColor="rgba(20, 184, 166, 0.2)">
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-teal-500/50 transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 mb-3">
                      <span>Alumni → Student</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">Mentorship & Experience</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Alumni can mentor students, share experiences and provide career guidance.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-700 text-[11px] text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Structured resume critiques & prep
                  </div>
                </div>
              </InteractiveTiltCard>

              {/* Card 3: Student -> Institution */}
              <InteractiveTiltCard glowColor="rgba(99, 102, 241, 0.2)">
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-indigo-500/50 transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 mb-3">
                      <span>Student → Institution</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">Campus Opportunities</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Students can discover opportunities, events and institutional connections.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-700 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Centralized webinars & demo days
                  </div>
                </div>
              </InteractiveTiltCard>

              {/* Card 4: Alumni -> Institution */}
              <InteractiveTiltCard glowColor="rgba(168, 85, 247, 0.2)">
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-purple-500/50 transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 mb-3">
                      <span>Alumni → Institution</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">Long-term Engagement</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Institutions can maintain long-term relationships with their alumni.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-700 text-[11px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Institutional accreditation & records
                  </div>
                </div>
              </InteractiveTiltCard>

              {/* Card 5: Network -> Opportunity */}
              <InteractiveTiltCard glowColor="rgba(245, 158, 11, 0.2)">
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-amber-500/50 transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 mb-3">
                      <span>Network → Opportunity</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">Careers & Referrals</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Connections can lead to mentorship, internships, projects and career opportunities.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-700 text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> High-conversion referral pipelines
                  </div>
                </div>
              </InteractiveTiltCard>

              {/* Card 6: One Platform -> Everything */}
              <InteractiveTiltCard glowColor="rgba(16, 185, 129, 0.2)">
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-emerald-500/50 transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 mb-3">
                      <span>One Platform → Everything</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">Centralized Ecosystem</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Centralized alumni data, communication, events and engagement.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-700 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Zero scattered spreadsheets or cold emails
                  </div>
                </div>
              </InteractiveTiltCard>
            </div>
          </div>

          {/* Featured Achievements Section (Requirement 8) */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mb-1.5">
                  <Award className="w-4 h-4 animate-bounce" />
                  <span>Hall of Achievements</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Featured Alumni & Student Milestones
                </h3>
              </div>
              <button
                onClick={() => navigate('achievements')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-all cursor-pointer w-fit group"
              >
                <span>View All Achievements</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {achievements.slice(0, 3).map(ach => (
                <InteractiveTiltCard
                  key={ach.id}
                  glowColor="rgba(245, 158, 11, 0.2)"
                  onClick={() => {
                    setSelectedAchievement(ach);
                    navigate('achievements');
                  }}
                >
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-amber-400/50 transition-all flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-amber-600 dark:text-amber-400 text-[10px] uppercase flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {ach.category}
                        </span>
                        <span className="text-slate-400 text-[11px] font-semibold">{ach.year}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                        {ach.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                        {ach.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-700 flex items-center gap-2">
                      <img
                        src={ach.avatar}
                        alt={ach.personName}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 dark:text-white block">{ach.personName}</span>
                        <span className="text-[10px] text-slate-400">{ach.institution}</span>
                      </div>
                    </div>
                  </div>
                </InteractiveTiltCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 10: FEATURES SECTION (Requirement 10)             */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#070A10] border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Platform Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Everything You Need to Build Your Network
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
              A comprehensive toolkit engineered specifically for university students, verified alumni and campus leadership.
            </p>
          </div>

          {/* 6 Feature Cards Grid with 3D Tilt & Micro-Animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Verified Alumni */}
            <InteractiveTiltCard glowColor="rgba(59, 130, 246, 0.2)">
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-blue-400/50 transition-all h-full">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 border border-blue-200/50 dark:border-blue-900/50"
                >
                  <ShieldCheck className="w-6 h-6" />
                </motion.div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Verified Alumni</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Discover verified alumni profiles with genuine degrees and corporate badges. Never worry about fake profiles or inflated credentials.
                </p>
              </div>
            </InteractiveTiltCard>

            {/* Card 2: AI-Powered Discovery */}
            <InteractiveTiltCard glowColor="rgba(99, 102, 241, 0.2)">
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-indigo-400/50 transition-all h-full">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 border border-indigo-200/50 dark:border-indigo-900/50"
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">AI-Powered Discovery</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Find relevant alumni and mentors based on skills and career goals through intelligent natural language matching and fallback algorithms.
                </p>
              </div>
            </InteractiveTiltCard>

            {/* Card 3: Cross-University Network */}
            <InteractiveTiltCard glowColor="rgba(20, 184, 166, 0.2)">
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-teal-400/50 transition-all h-full">
                <motion.div
                  whileHover={{ rotate: 180, scale: 1.1 }}
                  transition={{ duration: 0.8 }}
                  className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-5 border border-teal-200/50 dark:border-teal-900/50"
                >
                  <Globe className="w-6 h-6" />
                </motion.div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Cross-University Network</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Connect across universities and institutes throughout India. Break beyond single-campus silos to learn from senior engineers across campuses.
                </p>
              </div>
            </InteractiveTiltCard>

            {/* Card 4: Smart Mentorship */}
            <InteractiveTiltCard glowColor="rgba(59, 130, 246, 0.2)">
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-blue-400/50 transition-all h-full">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 border border-blue-200/50 dark:border-blue-900/50"
                >
                  <BookOpen className="w-6 h-6" />
                </motion.div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Smart Mentorship</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Find mentors based on expertise and career interests. Submit structured requests for resume feedback, interview prep, and technical coaching.
                </p>
              </div>
            </InteractiveTiltCard>

            {/* Card 5: Professional Profiles */}
            <InteractiveTiltCard glowColor="rgba(99, 102, 241, 0.2)">
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-indigo-400/50 transition-all h-full">
                <motion.div
                  whileHover={{ scale: 1.15, y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 border border-indigo-200/50 dark:border-indigo-900/50"
                >
                  <Briefcase className="w-6 h-6" />
                </motion.div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Professional Profiles</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Explore skills, education, internships, achievements and experience with clean timeline formatting and verified graduation records.
                </p>
              </div>
            </InteractiveTiltCard>

            {/* Card 6: Secure Networking */}
            <InteractiveTiltCard glowColor="rgba(20, 184, 166, 0.2)">
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-teal-400/50 transition-all h-full">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.3 }}
                  className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-5 border border-teal-200/50 dark:border-teal-900/50"
                >
                  <Lock className="w-6 h-6" />
                </motion.div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Secure Networking</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Authentication and controlled communication protect student privacy. Only authenticated and accepted connections can message each other.
                </p>
              </div>
            </InteractiveTiltCard>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 11: ALUMNI NETWORK SECTION (Requirement 11)       */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Pan-India Verification Mesh</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Discover Your Alumni Network
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl">
                Explore participating institutions across India. Filter by university, discover mentors, and connect with authentic seniors.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('map')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer w-fit group"
            >
              <span>Explore Full Network</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Campus Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs font-semibold text-slate-400 mr-2">Filter by Campus:</span>
            {['All', "Tula's Institute", 'Graphic Era', 'IIT Roorkee', 'IIT Hyderabad'].map(campus => (
              <button
                key={campus}
                onClick={() => setSelectedCampusFilter(campus)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCampusFilter === campus
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {campus}
              </button>
            ))}
          </div>

          {/* Institutional Hubs Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {participatingInstitutions.map((inst, i) => (
              <InteractiveTiltCard key={inst.name} glowColor="rgba(59, 130, 246, 0.2)">
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg">
                        {inst.city}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <Users className="w-3.5 h-3.5 text-teal-600" />
                        {inst.count}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">{inst.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{inst.focus}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Registry
                    </span>
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          triggerAuthGate(`view ${inst.name}'s alumni directory`);
                          return;
                        }
                        setSelectedCampusFilter(inst.name);
                        setCurrentView('explore');
                      }}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer group flex items-center gap-1"
                    >
                      <span>View Directory</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              </InteractiveTiltCard>
            ))}
          </div>

          {/* Pan-India Course & Alumni Connection Map Section */}
          <div className="mt-14 pt-10 border-t border-slate-200/80 dark:border-slate-800">
            <IndiaCourseNetworkMap />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 12: AI DISCOVERY SECTION (Requirement 12)         */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#070A10] border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Intelligent Roster Matching</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tell Us Who You're Looking For
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Search naturally by company, role, university, or mentorship topic:
          </p>

          {/* Large Search Box */}
          <div className="mt-8 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center group focus-within:border-blue-500 transition-colors">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setHasSearched(false);
                }}
                placeholder="Find a Machine Learning alumni working at Microsoft…"
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-blue-600 dark:focus:border-blue-400 outline-none text-slate-800 dark:text-slate-100"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handlePerformAISearch(searchQuery || "Find a Machine Learning alumni working at Microsoft")}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-2xs transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Search Alumni</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          {/* Sample Prompts */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Quick suggestions:</span>
            {[
              "Find a Machine Learning alumni working at Microsoft",
              "Tula's Institute + Microsoft + Machine Learning",
              "Senior Data Scientist from IIT Roorkee",
              "Full Stack Architect from Graphic Era"
            ].map(prompt => (
              <button
                key={prompt}
                onClick={() => handlePerformAISearch(prompt)}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-700 dark:hover:text-blue-300 text-slate-600 dark:text-slate-300 transition-colors text-xs cursor-pointer border border-slate-200/70 dark:border-slate-700"
              >
                "{prompt}"
              </button>
            ))}
          </div>

          {/* Live Scanning Radar Effect */}
          <AnimatePresence>
            {isSearching && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-center gap-3 text-xs font-bold text-blue-700 dark:text-blue-300"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                <span>Searching Pan-India Verified Network across 50+ Institutions...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Search Result Demonstration (Requirement 12) */}
          {hasSearched && (
            <div className="mt-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left animate-in fade-in duration-200">
              {isExactQuery ? (
                <div>
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs mb-3">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Exact Match Found in Pan-India Network</span>
                  </div>
                  {/* Matching verified alumni card */}
                  <InteractiveTiltCard glowColor="rgba(20, 184, 166, 0.2)">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                          alt="Rahul Sharma"
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-white">
                            Rahul Sharma
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                              Verified Mentor
                            </span>
                          </div>
                          <div className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                            Machine Learning Engineer · Microsoft
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            Tula's Institute / IIT Roorkee Affiliate · 4.9 ★ (42 reviews)
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const target = alumniList.find(a => a.name.includes('Rahul')) || alumniList[0];
                          setSelectedAlumni(target);
                        }}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        View Profile & Request Mentorship
                      </button>
                    </div>
                  </InteractiveTiltCard>
                </div>
              ) : (
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                    No exact matches found at your specific college.
                  </div>
                  <div className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Here are relevant Machine Learning alumni from other participating universities:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="font-bold text-slate-900 dark:text-white">Dr. Vikram Malhotra</div>
                      <div className="text-blue-600 dark:text-blue-400 font-medium">Principal ML Scientist · IIT Roorkee</div>
                      <div className="text-slate-500 mt-1">Specializes in Deep Learning, NLP & Placements</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="font-bold text-slate-900 dark:text-white">Ananya Joshi</div>
                      <div className="text-teal-600 dark:text-teal-400 font-medium">Data Scientist · Graphic Era University</div>
                      <div className="text-slate-500 mt-1">Specializes in Python, BigQuery & Resume Review</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 13: MENTORSHIP SECTION (Requirement 13)           */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>1-on-1 Guidance</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Learn From Those Who've Been There
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Students request guidance from industry alumni and verified mentors who have navigated the path themselves.
            </p>

            {/* Infographic Workflow Pipeline with Live Flowing Energy Pulse */}
            <div className="mt-6 max-w-4xl mx-auto">
              <AnimatedWorkflowPipeline
                steps={[
                  { id: 'm-1', label: 'Student', sublabel: 'Discovers Senior', color: 'blue', icon: GraduationCap },
                  { id: 'm-2', label: 'Requests Guidance', sublabel: 'Personalized Query', color: 'indigo', icon: Search },
                  { id: 'm-3', label: 'Mentor Accepts', sublabel: 'Structured Calendar', color: 'teal', icon: CheckCircle2 },
                  { id: 'm-4', label: 'Mentorship', sublabel: '1-on-1 Prep & Review', color: 'purple', icon: Sparkles },
                  { id: 'm-5', label: 'Growth', sublabel: 'Tier-1 Placements', color: 'emerald', icon: TrendingUp },
                ]}
              />
            </div>
          </div>

          {/* Mentor Cards Grid with 3D Tilt & Live Online Beacon */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {alumniList.slice(0, 3).map(mentor => (
              <InteractiveTiltCard key={mentor.id} glowColor="rgba(20, 184, 166, 0.2)">
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-700 shadow-2xs hover:shadow-md hover:border-teal-400/50 transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="relative">
                        <img
                          src={mentor.avatar}
                          alt={mentor.name}
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                        />
                        <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-800"></span>
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        Verified Mentor
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                      {mentor.name}
                    </h3>
                    <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mt-0.5">
                      {mentor.jobTitle} @ {mentor.company}
                    </p>

                    <div className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{mentor.university}</span>
                    </div>

                    {/* Mentorship Areas */}
                    <div className="mt-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Mentorship Areas:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(mentor.mentorshipTopics || ['Machine Learning', 'Resume Review', 'Interview Prep']).slice(0, 3).map(topic => (
                          <span
                            key={topic}
                            className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-[10px] font-semibold border border-teal-200 dark:border-teal-800"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/70 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{mentor.rating || 4.9}</span>
                    </div>
                    <button
                      onClick={() => setSelectedAlumni(mentor)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Request Mentorship
                    </button>
                  </div>
                </div>
              </InteractiveTiltCard>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setCurrentView('mentors')}
              className="px-7 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm hover:shadow transition-all inline-flex items-center gap-2 cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Find a Mentor</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 14: ABOUT US SECTION (Requirement 14)             */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#070A10] border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Our Vision & Mission</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Why Alumni Connect?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Students often have critical questions about career roadmaps, internships, off-campus placements, higher studies, and industry expectations, but rarely have direct access to the right verified seniors to guide them.
            </p>
          </div>

          {/* Visual Storytelling Pipeline with Live Flowing Energy Beam */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
              The Structured Bridge Between Campus & Industry
            </div>

            <AnimatedWorkflowPipeline
              steps={[
                { id: 'bridge-1', label: 'Campus', sublabel: '50+ Verified Hubs', color: 'blue', icon: Building2 },
                { id: 'bridge-2', label: 'Student', sublabel: 'Seeking Guidance', color: 'indigo', icon: GraduationCap },
                { id: 'bridge-3', label: 'Alumni', sublabel: 'Corporate Leaders', color: 'teal', icon: Briefcase },
                { id: 'bridge-4', label: 'Mentorship', sublabel: 'Resume & Mock Prep', color: 'purple', icon: Sparkles },
                { id: 'bridge-5', label: 'Career Growth', sublabel: 'Priority Referrals', color: 'emerald', icon: TrendingUp },
              ]}
            />
          </div>

          {/* Pillars: Mission, Problem, Solution with 3D Tilt */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InteractiveTiltCard glowColor="rgba(59, 130, 246, 0.2)">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Our Mission
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    To democratize career guidance across Indian higher education by providing every ambitious student access to senior alumni from top product and research companies.
                  </p>
                </div>
              </div>
            </InteractiveTiltCard>

            <InteractiveTiltCard glowColor="rgba(245, 158, 11, 0.2)">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    The Problem
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Traditional social platforms suffer from spam, unverified claims, and cold messages that get ignored. Students don't know who is genuine or open to providing mentorship.
                  </p>
                </div>
              </div>
            </InteractiveTiltCard>

            <InteractiveTiltCard glowColor="rgba(16, 185, 129, 0.2)">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Our Solution
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Institutional email validation (.edu.in / .ac.in), dean moderation, and structured mentorship requests ensure authentic, high-value relationships.
                  </p>
                </div>
              </div>
            </InteractiveTiltCard>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 8: CALL TO ACTION                                 */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
        {/* Live Ambient Background Canvas */}
        <AmbientMeshBg particleColor="rgba(147, 197, 253, 0.45)" lineColor="rgba(99, 102, 241, 0.2)" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-300 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 inline-flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Verified Educational Networking
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Your next connection could change your career.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join thousands of university students and industry alumni actively networking, conducting resume reviews, and advancing their careers.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setAuthModalMode('signup');
                setAuthModalOpen(true);
              }}
              className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all cursor-pointer"
            >
              Join the Network
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentView('explore')}
              className="px-8 py-3.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white font-bold text-sm sm:text-base backdrop-blur-md transition-all cursor-pointer"
            >
              Explore Network
            </motion.button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 px-4 sm:px-6 lg:px-8 text-slate-600 dark:text-slate-400 text-xs transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white">Alumni Connect India</div>
            <p className="text-slate-400 mt-0.5">Verified Cross-University Professional Networking Ecosystem</p>
          </div>
          <div className="flex flex-wrap items-center gap-6 font-medium">
            <button onClick={() => setCurrentView('landing')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Home</button>
            <button onClick={() => setCurrentView('explore')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Explore</button>
            <button onClick={() => setCurrentView('map')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Alumni Network</button>
            <button onClick={() => setCurrentView('mentors')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Mentorship</button>
            <button onClick={() => setCurrentView('about')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">About</button>
          </div>
          <p className="text-slate-400">© 2026 Alumni Connect. All institutional rights verified.</p>
        </div>
      </footer>

    </div>
  );
};

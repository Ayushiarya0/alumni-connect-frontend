import React, { useState } from 'react';
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
  UserPlus
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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
    setHasSearched(true);
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
      <section className="relative w-full pt-10 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100/60 dark:from-[#0B1120] dark:via-[#090D16] dark:to-[#070A10]">
        {/* Subtle Background Glows */}
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
          <div className="absolute -top-32 right-10 w-[500px] h-[500px] bg-blue-100 dark:bg-blue-900 rounded-full blur-3xl"></div>
          <div className="absolute top-48 -left-20 w-[420px] h-[420px] bg-indigo-100 dark:bg-indigo-900 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Heading, Subheading & Action Buttons */}
            <div className="lg:col-span-6 text-left space-y-6">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900 text-xs font-semibold text-blue-800 dark:text-blue-300 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Verified Pan-India University Network</span>
              </div>

              {/* Main Heading (Requirement 3) */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                Connect. Discover.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 dark:from-blue-400 dark:via-indigo-400 dark:to-teal-400">
                  Grow. Together.
                </span>
              </h1>

              {/* Subheading (Requirement 3) */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-xl">
                Alumni Connect connects students, alumni, mentors and institutions in one centralized ecosystem.
              </p>

              {/* 3 CTA Buttons with tactile spring interactions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
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
                  onClick={() => {
                    setAuthModalMode('signup');
                    setAuthModalOpen(true);
                  }}
                  className="px-5 sm:px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm shadow-2xs transition-shadow flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Join the Network</span>
                </motion.button>
              </div>

              {/* Floating Highlights with subtle hover float */}
              <div className="pt-4">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2.5">
                  Verified Ecosystem Highlights
                </span>
                <div className="flex flex-wrap gap-2">
                  {floatingPills.slice(0, 6).map((pill, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.08, y: -2 }}
                      transition={{ duration: 0.15 }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs cursor-default ${pill.bg} ${pill.rotation}`}
                    >
                      <Sparkles className="w-3 h-3 opacity-70" />
                      <span>{pill.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Visual Storytelling Panels (Requirement 3) */}
            <div className="lg:col-span-6 relative">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Visual Storytelling
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      Panel {activeStoryIndex + 1} of 6
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setActiveStoryIndex(prev => (prev === 0 ? STORY_PANELS.length - 1 : prev - 1))}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs"
                      title="Previous Story"
                    >
                      ‹
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setActiveStoryIndex(prev => (prev === STORY_PANELS.length - 1 ? 0 : prev + 1))}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs"
                      title="Next Story"
                    >
                      ›
                    </motion.button>
                  </div>
                </div>

                {/* 6 Panel Selector Pills with Gliding Active Tab Highlight */}
                <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-4 no-scrollbar relative">
                  {STORY_PANELS.map((panel, idx) => (
                    <motion.button
                      key={panel.id}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setActiveStoryIndex(idx)}
                      className={`relative px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                        activeStoryIndex === idx
                          ? 'text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {activeStoryIndex === idx && (
                        <motion.div
                          layoutId="activeStoryPanelPill"
                          className="absolute inset-0 bg-blue-600 rounded-lg shadow-2xs -z-10"
                          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{panel.category}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Active Story Card with Fluid Slide/Fade Transition */}
                <AnimatePresence mode="wait">
                  {(() => {
                    const activeStory = STORY_PANELS[activeStoryIndex];
                    const Icon = activeStory.icon;
                    return (
                      <motion.div
                        key={activeStory.id}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-4"
                      >
                        {/* Step Indicator Badge */}
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${activeStory.badgeColor}`}>
                            {activeStory.step}
                          </span>
                          <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {activeStory.metric}
                          </span>
                        </div>

                        {/* Title & Tagline */}
                        <div>
                          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <span>{activeStory.title}</span>
                          </h3>
                          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                            {activeStory.tagline}
                          </p>
                        </div>

                        {/* Story Description */}
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                          {activeStory.description}
                        </p>

                        {/* Persona Profile Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={activeStory.avatar}
                              alt={activeStory.person}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">
                                {activeStory.person}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                Verified Institutional Participant
                              </p>
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              if (activeStoryIndex === 0) navigate('explore');
                              else if (activeStoryIndex === 1) navigate('mentors');
                              else if (activeStoryIndex === 4) navigate('map');
                              else if (activeStoryIndex === 5) navigate('achievements');
                              else navigate('explore');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                          >
                            <span>Explore</span>
                            <ArrowRight className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 9: BELOW-HERO CONTENT (Requirement 9)             */}
      {/* ========================================================= */}
      {/* SECTION 4: STATIC DATA / IMPACT SECTION                   */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Header & Exact Metrics (Requirement 4) */}
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

            {/* 6 Professional Impact Metrics Grid (Requirement 4) */}
            <div className="pt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-left">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">10,000+</div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Alumni</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Verified across top firms</div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">50+</div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Institutions</div>
                <div className="text-[10px] text-slate-400 mt-0.5">IITs, NITs & State Unis</div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">500+</div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Mentors</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Active guidance leads</div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <div className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">1,000+</div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Student Connections</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Verified 1-on-1 pairs</div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">250+</div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Career Opportunities</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Direct referral posts</div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">100+</div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Alumni Events</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Webinars & reunions</div>
              </div>
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
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-blue-500/50 transition-all flex flex-col justify-between">
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

              {/* Card 2: Alumni -> Student */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-teal-500/50 transition-all flex flex-col justify-between">
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

              {/* Card 3: Student -> Institution */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-indigo-500/50 transition-all flex flex-col justify-between">
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

              {/* Card 4: Alumni -> Institution */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-purple-500/50 transition-all flex flex-col justify-between">
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

              {/* Card 5: Network -> Opportunity */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-amber-500/50 transition-all flex flex-col justify-between">
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

              {/* Card 6: One Platform -> Everything */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-emerald-500/50 transition-all flex flex-col justify-between">
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
            </div>
          </div>

          {/* Featured Achievements Section (Requirement 8) */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mb-1.5">
                  <Award className="w-4 h-4" />
                  <span>Hall of Achievements</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Featured Alumni & Student Milestones
                </h3>
              </div>
              <button
                onClick={() => navigate('achievements')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-all cursor-pointer w-fit"
              >
                <span>View All Achievements</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {achievements.slice(0, 3).map(ach => (
                <div
                  key={ach.id}
                  onClick={() => {
                    setSelectedAchievement(ach);
                    navigate('achievements');
                  }}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-amber-600 dark:text-amber-400 text-[10px] uppercase">
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

          {/* 6 Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Verified Alumni */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Verified Alumni</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Discover verified alumni profiles with genuine degrees and corporate badges. Never worry about fake profiles or inflated credentials.
              </p>
            </div>

            {/* Card 2: AI-Powered Discovery */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">AI-Powered Discovery</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Find relevant alumni and mentors based on skills and career goals through intelligent natural language matching and fallback algorithms.
              </p>
            </div>

            {/* Card 3: Cross-University Network */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-5">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Cross-University Network</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Connect across universities and institutes throughout India. Break beyond single-campus silos to learn from senior engineers across campuses.
              </p>
            </div>

            {/* Card 4: Smart Mentorship */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Smart Mentorship</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Find mentors based on expertise and career interests. Submit structured requests for resume feedback, interview prep, and technical coaching.
              </p>
            </div>

            {/* Card 5: Professional Profiles */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Professional Profiles</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Explore skills, education, internships, achievements and experience with clean timeline formatting and verified graduation records.
              </p>
            </div>

            {/* Card 6: Secure Networking */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-5">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Secure Networking</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Authentication and controlled communication protect student privacy. Only authenticated and accepted connections can message each other.
              </p>
            </div>
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer w-fit"
            >
              <span>Explore Full Network</span>
              <ArrowRight className="w-4 h-4" />
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
            {participatingInstitutions.map(inst => (
              <div
                key={inst.name}
                className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg">
                      {inst.city}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
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
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    View Directory →
                  </button>
                </div>
              </div>
            ))}
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
          <div className="mt-8 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
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
            <button
              onClick={() => handlePerformAISearch(searchQuery || "Find a Machine Learning alumni working at Microsoft")}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-2xs transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Search Alumni</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
          <div className="text-center max-w-2xl mx-auto mb-14">
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

            {/* Infographic Workflow: Student -> Requests Guidance -> Mentor Accepts -> Mentorship -> Growth */}
            <div className="mt-6 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-bold text-slate-700 dark:text-slate-200">
              <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">Student</span>
              <span>→</span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300">Requests Guidance</span>
              <span>→</span>
              <span className="px-2.5 py-1 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300">Mentor Accepts</span>
              <span>→</span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300">Mentorship</span>
              <span>→</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">Growth</span>
            </div>
          </div>

          {/* Mentor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {alumniList.slice(0, 3).map(mentor => (
              <div
                key={mentor.id}
                className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-700 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                    />
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
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setCurrentView('mentors')}
              className="px-7 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm hover:shadow transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
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

          {/* Visual Storytelling: Campus -> Student -> Alumni -> Mentorship -> Career Growth */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 text-center">
              The Structured Bridge Between Campus & Industry
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-2 font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Campus</div>
                <div className="text-[10px] text-slate-500 mt-1">48+ Institutions in India</div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-2 font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Student</div>
                <div className="text-[10px] text-slate-500 mt-1">Seeking Help & Guidance</div>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center mx-auto mb-2 font-bold">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Alumni</div>
                <div className="text-[10px] text-slate-500 mt-1">Verified Corporate Roles</div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mx-auto mb-2 font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Mentorship</div>
                <div className="text-[10px] text-slate-500 mt-1">Resume & Interview Prep</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Career Growth</div>
                <div className="text-[10px] text-slate-500 mt-1">Tier-1 Placements & Referrals</div>
              </div>
            </div>
          </div>

          {/* Pillars: Mission, Problem, Solution */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Our Mission</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                To democratize career guidance across Indian higher education by providing every ambitious student access to senior alumni from top product and research companies.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">The Problem</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Traditional social platforms suffer from spam, unverified claims, and cold messages that get ignored. Students don't know who is genuine or open to providing mentorship.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Our Solution</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Institutional email validation (.edu.in / .ac.in), dean moderation, and structured mentorship requests ensure authentic, high-value relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 8: CALL TO ACTION                                 */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-300 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
            Verified Educational Networking
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Your next connection could change your career.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join thousands of university students and industry alumni actively networking, conducting resume reviews, and advancing their careers.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                setAuthModalMode('signup');
                setAuthModalOpen(true);
              }}
              className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all cursor-pointer"
            >
              Join the Network
            </button>
            <button
              onClick={() => setCurrentView('explore')}
              className="px-8 py-3.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white font-bold text-sm sm:text-base backdrop-blur-md transition-all cursor-pointer"
            >
              Explore Network
            </button>
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

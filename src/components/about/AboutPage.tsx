import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { BackButton } from '../common/BackButton';
import {
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  Building2,
  HeartHandshake,
  Lock,
  Globe,
  Briefcase,
  Layers,
  Award,
  TrendingUp,
  Search,
  Check,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  BookOpen,
  Target,
  Compass as VisionIcon
} from 'lucide-react';
import { AlumniConnectLogo } from '../common/AlumniConnectLogo';
import { InteractiveTiltCard } from '../common/InteractiveTiltCard';
import { AmbientMeshBg } from '../common/AmbientMeshBg';
import { AnimatedCounter } from '../common/AnimatedCounter';

export const AboutPage: React.FC = () => {
  const { setCurrentView, setAuthModalOpen, setAuthModalMode } = useApp();

  const timelineSteps = [
    {
      step: '01',
      title: 'Join',
      desc: 'Verify institutional credentials with official university email and profile authentication.',
      icon: GraduationCap,
      color: 'blue'
    },
    {
      step: '02',
      title: 'Discover',
      desc: 'Explore alumni by company, industry, graduation year, location, and verified skills.',
      icon: Search,
      color: 'indigo'
    },
    {
      step: '03',
      title: 'Connect',
      desc: 'Send personalized connection requests with clear professional or academic intent.',
      icon: HeartHandshake,
      color: 'teal'
    },
    {
      step: '04',
      title: 'Communicate',
      desc: 'Engage in structured 1-on-1 conversations, advice sessions, and guidance dialogues.',
      icon: MessageSquare,
      color: 'blue'
    },
    {
      step: '05',
      title: 'Learn',
      desc: 'Gain practical interview preparation, resume feedback, and industry domain insight.',
      icon: BookOpen,
      color: 'indigo'
    },
    {
      step: '06',
      title: 'Grow',
      desc: 'Unlock career opportunities, build lasting networks, and return as a mentor for juniors.',
      icon: TrendingUp,
      color: 'teal'
    }
  ];

  const studentBenefits = [
    'Direct access to seniors working at Tier-1 companies and startups',
    'Real-world mock interviews and actionable portfolio reviews',
    'Unfiltered guidance on higher studies, GATE, GRE, and CAT prep',
    'Internship referrals and early career opportunities'
  ];

  const alumniBenefits = [
    'Meaningful way to give back and mentor the next generation',
    'Re-connect with batchmates, professors, and institutional initiatives',
    'Identify rising student talent for referral bonuses and hiring',
    'Recognition in university achievements and alumni honors'
  ];

  const institutionBenefits = [
    'Centralized alumni registry with real-time career updates',
    'Accreditation metrics (NAAC, NIRF) backed by verified placement records',
    'Organize departmental reunions, guest lectures, and industry talks',
    'Foster long-term institutional endowment and philanthropic engagement'
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 sm:py-14 font-sans transition-colors duration-200 relative overflow-hidden">
      {/* Live Constellation Network Canvas in Background */}
      <AmbientMeshBg particleColor="rgba(59, 130, 246, 0.35)" lineColor="rgba(99, 102, 241, 0.12)" density={45} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Back Button Navigation */}
        <div className="flex items-center justify-between">
          <BackButton label="Back to Home" fallbackView="landing" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            About Alumni Connect
          </span>
        </div>

        {/* ========================================================= */}
        {/* 1. HERO SECTION: WHAT IS ALUMNI CONNECT?                   */}
        {/* ========================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold uppercase tracking-wider shadow-xs">
            <AlumniConnectLogo size="sm" showSubtitle={false} />
            <span className="ml-1">Centralized Ecosystem</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Bridging Students, Alumni & Institutions
          </h1>

          <p className="text-lg sm:text-xl font-medium text-blue-600 dark:text-blue-400">
            A centralized digital platform designed to strengthen communication between students, alumni, mentors, and institutions.
          </p>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Traditional campus networks stop at graduation day. Alumni Connect unifies verified academic histories with industry experience—democratizing mentorship so every student has an equal path to career excellence.
          </p>

          {/* Live Platform Highlights with pulsating beacons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xs text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-400 transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>10,000+ Verified Network</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xs text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-indigo-400 transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>50+ Partner Universities</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xs text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-teal-400 transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span>99.4% Verified Identity</span>
            </motion.div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. MISSION & VISION                                       */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InteractiveTiltCard glowColor="rgba(59, 130, 246, 0.25)">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between h-full hover:border-blue-400/50 transition-colors">
              <div className="space-y-4">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800 shadow-xs"
                >
                  <Target className="w-6 h-6" />
                </motion.div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800 inline-block">
                  Our Mission
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Democratize Mentorship & Career Guidance
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  To eliminate geographic and institutional barriers for college students across India by connecting them directly with verified alumni and industry leaders who offer authentic guidance, career roadmap planning, and mock interviews.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Equal opportunity regardless of college tier</span>
              </div>
            </div>
          </InteractiveTiltCard>

          <InteractiveTiltCard glowColor="rgba(99, 102, 241, 0.25)">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between h-full hover:border-indigo-400/50 transition-colors">
              <div className="space-y-4">
                <motion.div
                  whileHover={{ rotate: 180, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shadow-xs"
                >
                  <VisionIcon className="w-6 h-6" />
                </motion.div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-md border border-indigo-200 dark:border-indigo-800 inline-block">
                  Our Vision
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  The Standard for Lifelong Academic-Industry Ecosystems
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  A connected national collegiate ecosystem where no student graduates without a trusted mentor, and where every university maintains an active, engaged, and mutually supportive lifelong community.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Sustained alumni engagement spanning decades</span>
              </div>
            </div>
          </InteractiveTiltCard>
        </div>

        {/* ========================================================= */}
        {/* 3. VISUAL "HOW IT WORKS" TIMELINE                         */}
        {/* ========================================================= */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              Visual Progression
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              How Alumni Connect Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              The continuous journey from institutional enrollment to experienced mentor.
            </p>
          </div>

          {/* Continuous Glowing Energy Pulse traversing the steps */}
          <div className="hidden md:block relative h-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-teal-200 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-teal-900/40 rounded-full overflow-hidden">
            <motion.div
              animate={{ x: ['-100%', '300%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="w-1/3 h-full bg-gradient-to-r from-transparent via-blue-500 to-teal-400 opacity-90 shadow-[0_0_12px_rgba(59,130,246,0.8)]"
            />
          </div>

          {/* Visual Timeline Pipeline with 3D Tilt */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative">
            {timelineSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <InteractiveTiltCard key={step.step} glowColor="rgba(59, 130, 246, 0.2)">
                  <div className="relative p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between group hover:border-blue-400 dark:hover:border-blue-500 transition-colors h-full">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">
                          {step.step}
                        </span>
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                          transition={{ duration: 0.3 }}
                          className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shadow-2xs"
                        >
                          <Icon className="w-4 h-4" />
                        </motion.div>
                      </div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-1.5">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    {idx < timelineSteps.length - 1 && (
                      <div className="hidden md:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 w-5 h-5 rounded-full bg-blue-600 text-white items-center justify-center text-[10px] shadow-sm">
                        →
                      </div>
                    )}
                  </div>
                </InteractiveTiltCard>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl">
              <span className="text-blue-600 dark:text-blue-400">Join</span>
              <span>→</span>
              <span className="text-blue-600 dark:text-blue-400">Discover</span>
              <span>→</span>
              <span className="text-blue-600 dark:text-blue-400">Connect</span>
              <span>→</span>
              <span className="text-blue-600 dark:text-blue-400">Communicate</span>
              <span>→</span>
              <span className="text-blue-600 dark:text-blue-400">Learn</span>
              <span>→</span>
              <span className="text-teal-600 dark:text-teal-400 font-bold">Grow</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. WHY IT IS DIFFERENT                                    */}
        {/* ========================================================= */}
        <div className="bg-slate-900 dark:bg-slate-900/90 text-white rounded-3xl p-8 sm:p-12 shadow-lg border border-slate-800 space-y-8 relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-white/10 px-3 py-1 rounded-full border border-white/15 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              Distinct Value Proposition
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why Alumni Connect is Different
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Unlike generic social media platforms where claims are unverifiable and outreach goes unanswered, Alumni Connect is tailored specifically for academic-to-industry transitions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-800 relative z-10">
            <InteractiveTiltCard glowColor="rgba(59, 130, 246, 0.25)">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 h-full space-y-3">
                <div className="text-blue-400 font-extrabold text-lg flex items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                  </motion.div>
                  Verified Academics
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Institutional email verification and graduation record validation ensure that every connection is authentic.
                </p>
              </div>
            </InteractiveTiltCard>

            <InteractiveTiltCard glowColor="rgba(20, 184, 166, 0.25)">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 h-full space-y-3">
                <div className="text-teal-400 font-extrabold text-lg flex items-center gap-2">
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Globe className="w-5 h-5 text-teal-400" />
                  </motion.div>
                  Cross-Campus Reach
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Connect not just within your college, but with senior professionals across 50+ universities nationwide.
                </p>
              </div>
            </InteractiveTiltCard>

            <InteractiveTiltCard glowColor="rgba(99, 102, 241, 0.25)">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 h-full space-y-3">
                <div className="text-indigo-400 font-extrabold text-lg flex items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    <Lock className="w-5 h-5 text-indigo-400" />
                  </motion.div>
                  Safe & Moderated
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Dedicated admin oversight ensures spam-free communication, structured mentorship topics, and privacy control.
                </p>
              </div>
            </InteractiveTiltCard>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 5. BENEFITS FOR STUDENTS, ALUMNI & INSTITUTIONS           */}
        {/* ========================================================= */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              Ecosystem Stakeholders
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Built for Every Stakeholder
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Tangible value tailored for students, alumni, and educational institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Benefits */}
            <InteractiveTiltCard glowColor="rgba(59, 130, 246, 0.2)">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-full hover:border-blue-400/50 transition-colors">
                <div>
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mb-4 border border-blue-200 dark:border-blue-800"
                  >
                    <GraduationCap className="w-5 h-5" />
                  </motion.div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                    Benefits for Students
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-5">
                    Accelerate your transition from lecture halls to high-impact career opportunities.
                  </p>
                  <div className="space-y-3">
                    {studentBenefits.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 group">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setAuthModalMode('signup');
                      setAuthModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs transition-colors cursor-pointer group flex items-center justify-center gap-1"
                  >
                    <span>Join as Student</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </motion.button>
                </div>
              </div>
            </InteractiveTiltCard>

            {/* Alumni Benefits */}
            <InteractiveTiltCard glowColor="rgba(20, 184, 166, 0.2)">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-full hover:border-teal-400/50 transition-colors">
                <div>
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold mb-4 border border-teal-200 dark:border-teal-800"
                  >
                    <HeartHandshake className="w-5 h-5" />
                  </motion.div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                    Benefits for Alumni
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-5">
                    Share wisdom, discover high-potential juniors, and stay anchored to your alma mater.
                  </p>
                  <div className="space-y-3">
                    {alumniBenefits.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 group">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setAuthModalMode('signup');
                      setAuthModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold text-xs transition-colors cursor-pointer group flex items-center justify-center gap-1"
                  >
                    <span>Join as Alumni</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </motion.button>
                </div>
              </div>
            </InteractiveTiltCard>

            {/* Institution Benefits */}
            <InteractiveTiltCard glowColor="rgba(99, 102, 241, 0.2)">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-full hover:border-indigo-400/50 transition-colors">
                <div>
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold mb-4 border border-indigo-200 dark:border-indigo-800"
                  >
                    <Building2 className="w-5 h-5" />
                  </motion.div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                    Benefits for Institutions
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-5">
                    Strengthen college reputation, track outcome metrics, and celebrate graduate achievements.
                  </p>
                  <div className="space-y-3">
                    {institutionBenefits.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 group">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentView('explore')}
                    className="w-full py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs transition-colors cursor-pointer group flex items-center justify-center gap-1"
                  >
                    <span>View Network Directory</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </motion.button>
                </div>
              </div>
            </InteractiveTiltCard>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 6. CALL TO ACTION                                         */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl border border-slate-800 relative overflow-hidden">
          {/* Ambient Particles */}
          <AmbientMeshBg particleColor="rgba(147, 197, 253, 0.4)" lineColor="rgba(99, 102, 241, 0.15)" density={25} />

          <div className="relative z-10 space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Ready to Connect with Your Community?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Join thousands of students and alumni already collaborating, mentoring, and advancing careers together on Alumni Connect.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setAuthModalMode('signup');
                  setAuthModalOpen(true);
                }}
                className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                Create Account
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView('explore')}
                className="px-7 py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white font-bold text-sm backdrop-blur-md transition-colors cursor-pointer"
              >
                Explore Alumni
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

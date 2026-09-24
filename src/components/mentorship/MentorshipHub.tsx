import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ShieldCheck,
  Building2,
  GraduationCap,
  Search,
  CheckCircle2,
  Briefcase,
  Clock,
  UserPlus,
  Compass,
  FileText
} from 'lucide-react';
import { AlumniProfile } from '../../types';
import { BackButton } from '../common/BackButton';
import { motion } from 'framer-motion';

const MENTOR_FILTERS = [
  { label: 'All Mentors', value: 'all' },
  { label: 'Career', value: 'career' },
  { label: 'Technology', value: 'technology' },
  { label: 'Business', value: 'business' },
  { label: 'Higher Studies', value: 'higher studies' },
  { label: 'Entrepreneurship', value: 'entrepreneurship' },
  { label: 'Interview Preparation', value: 'interview preparation' },
  { label: 'Projects', value: 'projects' },
  { label: 'Research', value: 'research' }
];

export const MentorshipHub: React.FC = () => {
  const {
    alumniList,
    setMentorshipTarget,
    setSelectedAlumni,
    sendConnectionRequest,
    connections,
    currentUser,
    isAuthenticated,
    triggerAuthGate
  } = useApp();

  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Mentors only (available for mentorship)
  const allMentors = useMemo(() => {
    return alumniList.filter(a => a.availableForMentorship && a.verificationStatus === 'verified');
  }, [alumniList]);

  // Filtered mentors by category and search
  const filteredMentors = useMemo(() => {
    return allMentors.filter(m => {
      // Category filter matching
      if (selectedFilter !== 'all') {
        const filterLow = selectedFilter.toLowerCase();
        const matchesCategory =
          m.mentorshipCategories?.some(c => c.toLowerCase().includes(filterLow)) ||
          m.mentorshipTopics?.some(t => t.toLowerCase().includes(filterLow)) ||
          m.industry.toLowerCase().includes(filterLow) ||
          m.jobTitle.toLowerCase().includes(filterLow) ||
          m.skills.some(s => s.toLowerCase().includes(filterLow));

        if (!matchesCategory) return false;
      }

      // Search term matching
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = m.name.toLowerCase().includes(q);
        const matchCompany = m.company.toLowerCase().includes(q);
        const matchRole = m.jobTitle.toLowerCase().includes(q);
        const matchUni = m.university.toLowerCase().includes(q);
        const matchSkills = m.skills.some(s => s.toLowerCase().includes(q));
        const matchTopics = m.mentorshipTopics.some(t => t.toLowerCase().includes(q));

        if (!matchName && !matchCompany && !matchRole && !matchUni && !matchSkills && !matchTopics) {
          return false;
        }
      }

      return true;
    });
  }, [allMentors, selectedFilter, searchTerm]);

  const handleConnect = (mentor: AlumniProfile) => {
    if (!isAuthenticated) {
      triggerAuthGate(`connect with ${mentor.name}`);
      return;
    }
    sendConnectionRequest(mentor.id);
  };

  const handleRequestMentorship = (mentor: AlumniProfile) => {
    if (!isAuthenticated) {
      triggerAuthGate(`request mentorship with ${mentor.name}`);
      return;
    }
    setMentorshipTarget(mentor);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] dark:bg-[#090D16] text-[#0F172A] dark:text-[#F8FAFC] py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Universal Back Button */}
        <div>
          <BackButton label="Back to Home" fallbackView="landing" className="mb-3" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-900 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Verified Mentorship Channel</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Find an Alumni Mentor
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
                Connect with verified senior alumni offering 1-on-1 career guidance, resume reviews, technical roadmaps, and interview preparation.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs self-start md:self-auto text-center">
              <div className="text-xs font-bold text-teal-600 dark:text-teal-400">{allMentors.length} Verified Mentors</div>
              <div className="text-[10px] text-slate-400">Available across Indian campuses</div>
            </div>
          </div>
        </div>

        {/* Search & 8 Category Filters (Requirement 7) */}
        <div className="space-y-4">
          {/* Search Box */}
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search mentors by name, company, skill or topic..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-600 transition-colors shadow-2xs"
            />
          </div>

          {/* 8 Required Filters with Micro-interactions */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar text-xs font-bold">
            {MENTOR_FILTERS.map(f => {
              const isActive = selectedFilter === f.value;
              return (
                <motion.button
                  key={f.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFilter(f.value)}
                  className={`px-3.5 py-1.5 rounded-full shrink-0 transition-colors cursor-pointer border ${
                    isActive
                      ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {f.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Mentor Cards Grid (Requirement 7) */}
        {filteredMentors.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
            <Sparkles className="w-10 h-10 text-teal-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No mentors found for this filter</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Try switching back to "All Mentors" or searching for a different skill keyword.
            </p>
            <button
              onClick={() => {
                setSelectedFilter('all');
                setSearchTerm('');
              }}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map(mentor => {
              const conn = connections.find(
                c => c.studentId === currentUser.id && c.alumniId === mentor.id
              );

              return (
                <motion.div
                  key={mentor.id}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs hover:shadow-xl hover:border-teal-500/50 transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Photo, Name, Profession, Company */}
                    <div className="flex items-start gap-3.5 mb-4">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedAlumni(mentor)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3
                            onClick={() => setSelectedAlumni(mentor)}
                            className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer truncate"
                          >
                            {mentor.name}
                          </h3>
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-900">
                            <ShieldCheck className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                            Verified
                          </span>
                        </div>

                        {/* Profession & Company */}
                        <p className="text-xs font-bold text-teal-700 dark:text-teal-400 mt-0.5 truncate">
                          {mentor.jobTitle}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{mentor.company}</span>
                          <span>·</span>
                          <span className="truncate">{mentor.city}</span>
                        </p>
                      </div>
                    </div>

                    {/* Institution */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-800 mb-3.5">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">{mentor.university} (Class of {mentor.graduationYear})</span>
                    </div>

                    {/* Experience & Availability Badges */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Experience: <strong className="text-slate-800 dark:text-slate-200">{mentor.experienceYears}+ years</strong></span>
                      </span>

                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Available</span>
                      </span>
                    </div>

                    {/* Expertise (Skills) */}
                    <div className="space-y-1.5 mb-3.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Expertise
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {mentor.skills.slice(0, 4).map(skill => (
                          <span
                            key={skill}
                            className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Areas They Mentor In */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Mentorship Topics
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {mentor.mentorshipTopics.map(topic => (
                          <span
                            key={topic}
                            className="text-[10px] font-semibold bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border border-teal-200/60 dark:border-teal-900 px-2 py-0.5 rounded-lg"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Connect Button & Request Mentorship Button (Requirement 7) */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    {isAuthenticated && conn?.status === 'accepted' ? (
                      <span className="flex-1 py-2 px-3 text-center rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-900 font-bold text-xs">
                        Connected
                      </span>
                    ) : isAuthenticated && conn?.status === 'pending' ? (
                      <span className="flex-1 py-2 px-3 text-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 font-bold text-xs">
                        Pending
                      </span>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleConnect(mentor)}
                        className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Connect</span>
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRequestMentorship(mentor)}
                      className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Request Mentorship</span>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

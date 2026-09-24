import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Filter,
  Sparkles,
  ShieldCheck,
  Building2,
  MapPin,
  GraduationCap,
  UserPlus,
  Check,
  Clock,
  RotateCcw,
  Briefcase,
  Calendar,
  Layers,
  ArrowRight,
  AlertCircle,
  Compass,
  MessageSquare
} from 'lucide-react';
import { parseNaturalLanguageQuery, filterAlumniByParsedQuery } from '../../utils/aiQueryParser';
import { UNIVERSITIES } from '../../data/mockData';
import { AlumniProfile } from '../../types';
import { BackButton } from '../common/BackButton';
import { motion } from 'framer-motion';

export const ExploreAlumni: React.FC = () => {
  const {
    alumniList,
    setSelectedAlumni,
    sendConnectionRequest,
    connections,
    currentUser,
    isAuthenticated,
    triggerAuthGate,
    globalSearchQuery,
    setGlobalSearchQuery,
    setActiveChatRecipientId,
    setCurrentView
  } = useApp();

  // Advanced Filters
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedGradYear, setSelectedGradYear] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [mentorshipOnly, setMentorshipOnly] = useState(false);

  // Parse natural language search
  const parsedQuery = useMemo(() => {
    return parseNaturalLanguageQuery(globalSearchQuery);
  }, [globalSearchQuery]);

  // Primary Filtered Alumni List
  const filteredAlumni = useMemo(() => {
    let list = filterAlumniByParsedQuery(alumniList, parsedQuery);

    if (selectedUniversity !== 'all') {
      list = list.filter(a => a.universityId === selectedUniversity);
    }
    if (selectedCompany !== 'all') {
      list = list.filter(a => a.company.toLowerCase().includes(selectedCompany.toLowerCase()));
    }
    if (selectedRole !== 'all') {
      list = list.filter(a => a.jobTitle.toLowerCase().includes(selectedRole.toLowerCase()));
    }
    if (selectedDepartment !== 'all') {
      list = list.filter(a => a.department.toLowerCase().includes(selectedDepartment.toLowerCase()));
    }
    if (selectedLocation !== 'all') {
      list = list.filter(a => a.city.toLowerCase().includes(selectedLocation.toLowerCase()));
    }
    if (selectedSkill !== 'all') {
      list = list.filter(a =>
        a.skills.some(s => s.toLowerCase().includes(selectedSkill.toLowerCase()))
      );
    }
    if (selectedGradYear !== 'all') {
      list = list.filter(a => a.graduationYear.toString() === selectedGradYear);
    }
    if (selectedIndustry !== 'all') {
      list = list.filter(a => a.industry.toLowerCase().includes(selectedIndustry.toLowerCase()));
    }
    if (selectedExperience !== 'all') {
      if (selectedExperience === 'entry') {
        list = list.filter(a => a.experienceYears <= 3);
      } else if (selectedExperience === 'mid') {
        list = list.filter(a => a.experienceYears > 3 && a.experienceYears <= 7);
      } else if (selectedExperience === 'senior') {
        list = list.filter(a => a.experienceYears > 7);
      }
    }
    if (mentorshipOnly) {
      list = list.filter(a => a.availableForMentorship);
    }

    return list;
  }, [
    alumniList,
    parsedQuery,
    selectedUniversity,
    selectedCompany,
    selectedRole,
    selectedDepartment,
    selectedLocation,
    selectedSkill,
    selectedGradYear,
    selectedIndustry,
    selectedExperience,
    mentorshipOnly
  ]);

  const handleResetFilters = () => {
    setSelectedUniversity('all');
    setSelectedCompany('all');
    setSelectedRole('all');
    setSelectedDepartment('all');
    setSelectedSkill('all');
    setSelectedLocation('all');
    setSelectedGradYear('all');
    setSelectedIndustry('all');
    setSelectedExperience('all');
    setMentorshipOnly(false);
    setGlobalSearchQuery('');
  };

  const handleConnectAction = (alumni: AlumniProfile) => {
    if (!isAuthenticated) {
      triggerAuthGate(`connect with ${alumni.name}`);
      return;
    }
    sendConnectionRequest(alumni.id);
  };

  const handleMessageAction = (alumni: AlumniProfile) => {
    if (!isAuthenticated) {
      triggerAuthGate(`message ${alumni.name}`);
      return;
    }
    setActiveChatRecipientId(alumni.id);
    setCurrentView('chat');
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] dark:bg-[#090D16] text-[#0F172A] dark:text-[#F8FAFC] py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Universal Back Button */}
        <BackButton label="Back to Home" fallbackView="landing" className="mb-4" />

        {/* Section Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Alumni Directory & Cross-Campus Discovery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore the Alumni Network
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Search across universities, companies, roles, and technical proficiencies to find verified mentors and graduates throughout India.
          </p>
        </div>

        {/* AI Natural Language Search Prompt Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <input
              type="text"
              value={globalSearchQuery}
              onChange={e => setGlobalSearchQuery(e.target.value)}
              placeholder="Search alumni by university, company, role or skill... (e.g. Machine Learning at Microsoft)"
              className="block w-full pl-11 pr-24 py-3 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 text-xs sm:text-sm"
            />
            {globalSearchQuery && (
              <button
                onClick={() => setGlobalSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick NLP Tags */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Quick examples:</span>
            {[
              "Product Manager at Razorpay",
              "UI/UX Designer at Graphic Era",
              "Cybersecurity Professional",
              "Civil Engineer at L&T"
            ].map(q => (
              <button
                key={q}
                onClick={() => setGlobalSearchQuery(q)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors text-xs border border-slate-200/60 dark:border-slate-700 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout: Advanced Filter Sidebar + Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs sticky top-24 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Advanced Filters
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* 1. Institution */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Institution
                </label>
                <select
                  value={selectedUniversity}
                  onChange={e => setSelectedUniversity(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-600 outline-none bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="all">All Institutions</option>
                  {UNIVERSITIES.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.shortName} ({u.location})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Role / Profession (All 12 distinct professions) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Profession / Role
                </label>
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-600 outline-none bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="all">All Professions</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Entrepreneur">Entrepreneur / Founder</option>
                  <option value="Civil Engineer">Civil Engineer</option>
                  <option value="Doctor">Doctor / Medical</option>
                  <option value="Researcher">Researcher / PhD</option>
                  <option value="Government">Government / Civil Services</option>
                  <option value="Business Analyst">Business Analyst</option>
                  <option value="Cybersecurity">Cybersecurity Professional</option>
                  <option value="Marketing">Marketing Professional</option>
                </select>
              </div>

              {/* 3. Company */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Company
                </label>
                <select
                  value={selectedCompany}
                  onChange={e => setSelectedCompany(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-600 outline-none bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="all">All Companies</option>
                  <option value="microsoft">Microsoft</option>
                  <option value="google">Google</option>
                  <option value="amazon">Amazon</option>
                  <option value="zomato">Zomato</option>
                  <option value="razorpay">Razorpay</option>
                  <option value="larsen">Larsen & Toubro</option>
                  <option value="aiims">AIIMS</option>
                  <option value="swiggy">Swiggy</option>
                </select>
              </div>

              {/* 4. Department */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={e => setSelectedDepartment(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-600 outline-none bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="all">All Departments</option>
                  <option value="Computer Science">Computer Science & Eng</option>
                  <option value="Electrical">Electrical Engineering</option>
                  <option value="Civil">Civil Engineering</option>
                  <option value="Medicine">Medicine & Surgery</option>
                  <option value="Management">Management & Commerce</option>
                </select>
              </div>

              {/* 5. Location / City */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={e => setSelectedLocation(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-600 outline-none bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="all">All Locations</option>
                  <option value="bengaluru">Bengaluru</option>
                  <option value="delhi">New Delhi / NCR</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="dehradun">Dehradun</option>
                  <option value="pune">Pune</option>
                </select>
              </div>

              {/* 6. Graduation Year */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Graduation Year
                </label>
                <select
                  value={selectedGradYear}
                  onChange={e => setSelectedGradYear(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-600 outline-none bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="all">All Graduation Years</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="2018">2018</option>
                  <option value="2016">2016</option>
                  <option value="2014">2014 & Prior</option>
                </select>
              </div>

              {/* 7. Experience Level */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Experience Level
                </label>
                <select
                  value={selectedExperience}
                  onChange={e => setSelectedExperience(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-600 outline-none bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="all">Any Experience</option>
                  <option value="entry">Early Career (1 - 3 yrs)</option>
                  <option value="mid">Mid Career (4 - 7 yrs)</option>
                  <option value="senior">Senior / Leadership (8+ yrs)</option>
                </select>
              </div>

              {/* 8. Industry */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Industry
                </label>
                <select
                  value={selectedIndustry}
                  onChange={e => setSelectedIndustry(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-600 outline-none bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="all">All Industries</option>
                  <option value="technology">Technology & Software</option>
                  <option value="finance">FinTech & Payments</option>
                  <option value="health">Healthcare & Medicine</option>
                  <option value="infrastructure">Mega Infrastructure & Civil</option>
                  <option value="governance">Public Administration</option>
                  <option value="edtech">EdTech & AI</option>
                </select>
              </div>

              {/* Mentorship Toggle */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mentorshipOnly}
                    onChange={e => setMentorshipOnly(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Available for Mentorship
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Showing <strong className="text-slate-900 dark:text-white">{filteredAlumni.length}</strong> verified alumni
              </span>
              <span className="text-xs text-slate-400">Relevance Sorted</span>
            </div>

            {filteredAlumni.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredAlumni.map(alumni => {
                  const conn = connections.find(
                    c => c.studentId === currentUser.id && c.alumniId === alumni.id
                  );

                  return (
                    <motion.div
                      key={alumni.id}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs hover:shadow-lg hover:border-blue-500/50 transition-shadow flex flex-col justify-between"
                    >
                      <div>
                        {/* Top: Avatar & Badges */}
                        <div className="flex items-start justify-between gap-3">
                          <img
                            src={alumni.avatar}
                            alt={alumni.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setSelectedAlumni(alumni)}
                          />

                          <div className="flex flex-col items-end gap-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-900">
                              <ShieldCheck className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                              Verified Alumni
                            </span>
                            {alumni.availableForMentorship && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" /> Mentor
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Name & Title */}
                        <div className="mt-3">
                          <h3
                            onClick={() => setSelectedAlumni(alumni)}
                            className="font-bold text-slate-900 dark:text-white text-base hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                          >
                            {alumni.name}
                          </h3>
                          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mt-0.5">
                            {alumni.jobTitle}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 dark:text-slate-400">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{alumni.company}</span>
                            <span>·</span>
                            <span>{alumni.city}</span>
                          </div>
                        </div>

                        {/* Institution & Graduation Year */}
                        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-800">
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                          <span className="truncate">{alumni.university} ({alumni.graduationYear})</span>
                        </div>

                        {/* Skills */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {alumni.skills.slice(0, 3).map(skill => (
                            <span
                              key={skill}
                              className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Actions: View Profile, Connect, Message */}
                      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedAlumni(alumni)}
                          className="flex-1 py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer text-center"
                        >
                          View Profile
                        </motion.button>

                        {isAuthenticated && conn?.status === 'accepted' ? (
                          <button
                            disabled
                            className="py-2 px-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-900 font-semibold text-xs flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Connected
                          </button>
                        ) : isAuthenticated && conn?.status === 'pending' ? (
                          <button
                            disabled
                            className="py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 font-semibold text-xs flex items-center gap-1"
                          >
                            <Clock className="w-3.5 h-3.5" /> Pending
                          </button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleConnectAction(alumni)}
                            className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                          >
                            <UserPlus className="w-3.5 h-3.5" /> Connect
                          </motion.button>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => handleMessageAction(alumni)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                          title={`Message ${alumni.name}`}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">No alumni match this combination</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Try adjusting your filters or search keywords to view verified alumni profiles across other institutions.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

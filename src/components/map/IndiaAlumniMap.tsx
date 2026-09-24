import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Building2,
  GraduationCap,
  Users,
  Compass,
  Star,
  UserPlus,
  Layers,
  List,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Globe,
  Share2,
  Calendar,
  Briefcase,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  ExternalLink
} from 'lucide-react';
import { UNIVERSITIES, ALUMNI_EVENTS, CAREER_OPPORTUNITIES } from '../../data/mockData';
import { AlumniProfile } from '../../types';
import { BackButton } from '../common/BackButton';

interface CityHub {
  id: string;
  name: string;
  state: string;
  coordinates: [number, number];
  xPercent: number;
  yPercent: number;
}

const CITY_HUBS: CityHub[] = [
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', coordinates: [12.9716, 77.5946], xPercent: 44, yPercent: 78 },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', coordinates: [17.3850, 78.4867], xPercent: 48, yPercent: 62 },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', coordinates: [18.5204, 73.8567], xPercent: 34, yPercent: 60 },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', coordinates: [19.0760, 72.8777], xPercent: 28, yPercent: 57 },
  { id: 'gurgaon', name: 'Gurgaon / Delhi NCR', state: 'Haryana / Delhi', coordinates: [28.4595, 77.0266], xPercent: 43, yPercent: 32 },
  { id: 'roorkee', name: 'Roorkee & Dehradun', state: 'Uttarakhand', coordinates: [29.8659, 77.8963], xPercent: 47, yPercent: 25 },
  { id: 'noida', name: 'Noida', state: 'Uttar Pradesh', coordinates: [28.5355, 77.3910], xPercent: 45, yPercent: 33 },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', coordinates: [13.0827, 80.2707], xPercent: 52, yPercent: 82 },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', coordinates: [22.5726, 88.3639], xPercent: 78, yPercent: 48 }
];

type NetworkTab = 'map' | 'industry' | 'grad_year' | 'recommended' | 'events';

export const IndiaAlumniMap: React.FC = () => {
  const {
    alumniList,
    setSelectedAlumni,
    sendConnectionRequest,
    connections,
    currentUser,
    isAuthenticated,
    triggerAuthGate,
    events,
    opportunities,
    registerForEvent,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<NetworkTab>('map');
  const [activeCityId, setActiveCityId] = useState<string>('bengaluru');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedProfession, setSelectedProfession] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Filter alumni
  const filteredAlumni = useMemo(() => {
    return alumniList.filter(a => {
      if (selectedUniversity !== 'all' && a.universityId !== selectedUniversity) return false;
      if (selectedCompany !== 'all' && a.company.toLowerCase() !== selectedCompany.toLowerCase()) return false;
      if (selectedProfession !== 'all' && !a.jobTitle.toLowerCase().includes(selectedProfession.toLowerCase())) return false;
      return true;
    });
  }, [alumniList, selectedUniversity, selectedCompany, selectedProfession]);

  // Group alumni by city
  const cityAlumniMap = useMemo(() => {
    const map: Record<string, AlumniProfile[]> = {
      bengaluru: [],
      hyderabad: [],
      pune: [],
      mumbai: [],
      gurgaon: [],
      roorkee: [],
      noida: [],
      chennai: [],
      kolkata: []
    };

    filteredAlumni.forEach(alumni => {
      const loc = (alumni.city || alumni.location || '').toLowerCase();
      if (loc.includes('bengaluru') || loc.includes('bangalore')) map['bengaluru']?.push(alumni);
      else if (loc.includes('hyderabad')) map['hyderabad']?.push(alumni);
      else if (loc.includes('pune')) map['pune']?.push(alumni);
      else if (loc.includes('mumbai')) map['mumbai']?.push(alumni);
      else if (loc.includes('gurgaon') || loc.includes('delhi')) map['gurgaon']?.push(alumni);
      else if (loc.includes('roorkee') || loc.includes('dehradun')) map['roorkee']?.push(alumni);
      else if (loc.includes('noida')) map['noida']?.push(alumni);
      else if (loc.includes('chennai')) map['chennai']?.push(alumni);
      else if (loc.includes('kolkata')) map['kolkata']?.push(alumni);
    });

    return map;
  }, [filteredAlumni]);

  const activeCityAlumni = cityAlumniMap[activeCityId] || [];

  // Group alumni by industry
  const alumniByIndustry = useMemo(() => {
    const groups: Record<string, AlumniProfile[]> = {};
    alumniList.forEach(a => {
      const ind = a.industry || 'Technology & Engineering';
      if (!groups[ind]) groups[ind] = [];
      groups[ind].push(a);
    });
    return groups;
  }, [alumniList]);

  // Group alumni by graduation year
  const alumniByGradYear = useMemo(() => {
    const groups: Record<number, AlumniProfile[]> = {};
    alumniList.forEach(a => {
      const yr = a.graduationYear || 2024;
      if (!groups[yr]) groups[yr] = [];
      groups[yr].push(a);
    });
    return Object.entries(groups).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [alumniList]);

  // "People You May Want to Connect With" recommendations
  const recommendedPeople = useMemo(() => {
    return alumniList.filter(a => {
      return a.availableForMentorship || a.rating >= 4.9;
    }).slice(0, 6);
  }, [alumniList]);

  const handleConnect = (alumni: AlumniProfile) => {
    if (!isAuthenticated) {
      triggerAuthGate(`connect with ${alumni.name}`);
      return;
    }
    sendConnectionRequest(alumni.id);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] dark:bg-[#090D16] text-[#0F172A] dark:text-[#F8FAFC] py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Universal Back Button */}
        <div>
          <BackButton label="Back to Home" fallbackView="landing" className="mb-3" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
                <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Pan-India Alumni Network</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Alumni Network & Directory
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
                Explore verified alumni across cities, industries, graduation batches, and connect through mentorship opportunities.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs self-start md:self-auto">
              <div className="text-center px-2">
                <div className="text-xs font-bold text-slate-900 dark:text-white">{alumniList.length}</div>
                <div className="text-[10px] text-slate-400">Profiles</div>
              </div>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
              <div className="text-center px-2">
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400">{CITY_HUBS.length}</div>
                <div className="text-[10px] text-slate-400">City Hubs</div>
              </div>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
              <div className="text-center px-2">
                <div className="text-xs font-bold text-teal-600 dark:text-teal-400">50+</div>
                <div className="text-[10px] text-slate-400">Institutions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Network Connection Interface (Requirement 6) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md">
          <div className="text-center max-w-xl mx-auto mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
              Connection Architecture
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              Visual Student–Alumni Connection Pipeline
            </h3>
          </div>

          <div className="flex items-center justify-between gap-1 overflow-x-auto py-2 text-center text-xs font-bold">
            <div className="flex-1 min-w-[110px] p-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
              <div className="text-blue-300 text-[10px]">Step 1</div>
              <div className="text-white text-xs">Student</div>
              <div className="text-[10px] text-blue-200 font-normal">Discovers alumni</div>
            </div>

            <span className="text-blue-300 px-1">→</span>

            <div className="flex-1 min-w-[110px] p-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
              <div className="text-indigo-300 text-[10px]">Step 2</div>
              <div className="text-white text-xs">Alumni</div>
              <div className="text-[10px] text-indigo-200 font-normal">Verifies profile</div>
            </div>

            <span className="text-indigo-300 px-1">→</span>

            <div className="flex-1 min-w-[110px] p-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
              <div className="text-teal-300 text-[10px]">Step 3</div>
              <div className="text-white text-xs">Mentor</div>
              <div className="text-[10px] text-teal-200 font-normal">Guides 1-on-1</div>
            </div>

            <span className="text-teal-300 px-1">→</span>

            <div className="flex-1 min-w-[110px] p-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
              <div className="text-amber-300 text-[10px]">Step 4</div>
              <div className="text-white text-xs">Company</div>
              <div className="text-[10px] text-amber-200 font-normal">Reviews referral</div>
            </div>

            <span className="text-amber-300 px-1">→</span>

            <div className="flex-1 min-w-[110px] p-2 rounded-xl bg-emerald-500/20 backdrop-blur-xs border border-emerald-400/30">
              <div className="text-emerald-300 text-[10px]">Step 5</div>
              <div className="text-emerald-200 text-xs">Opportunity</div>
              <div className="text-[10px] text-emerald-100 font-normal">Career milestone</div>
            </div>
          </div>
        </div>

        {/* Network Section Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'map'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Map & City Hubs</span>
          </button>

          <button
            onClick={() => setActiveTab('industry')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'industry'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Alumni by Industry</span>
          </button>

          <button
            onClick={() => setActiveTab('grad_year')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'grad_year'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>By Graduation Year</span>
          </button>

          <button
            onClick={() => setActiveTab('recommended')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'recommended'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recommended Connections</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'events'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Events & Opportunities</span>
          </button>
        </div>

        {/* TAB 1: INTERACTIVE MAP & CITY HUBS */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Interactive Schematic Map Container */}
            <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 relative min-h-[460px] overflow-hidden border border-slate-800 shadow-xl flex flex-col justify-between">
              {/* Background Geographic Mesh */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* City Hub Pins */}
              <div className="relative z-10 w-full h-[360px]">
                {CITY_HUBS.map(hub => {
                  const isSelected = hub.id === activeCityId;
                  const count = cityAlumniMap[hub.id]?.length || 0;

                  return (
                    <div
                      key={hub.id}
                      onClick={() => setActiveCityId(hub.id)}
                      style={{ left: `${hub.xPercent}%`, top: `${hub.yPercent}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                    >
                      <span className="relative flex items-center justify-center">
                        {isSelected && (
                          <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-75"></span>
                        )}
                        <span
                          className={`relative inline-flex items-center justify-center rounded-full text-[10px] font-extrabold border shadow-lg transition-transform group-hover:scale-125 ${
                            isSelected
                              ? 'w-7 h-7 bg-blue-600 text-white border-white scale-110'
                              : count > 0
                              ? 'w-6 h-6 bg-teal-500 text-slate-950 border-teal-300'
                              : 'w-5 h-5 bg-slate-800 text-slate-400 border-slate-600'
                          }`}
                        >
                          {count}
                        </span>
                      </span>

                      <div
                        className={`absolute left-1/2 -translate-x-1/2 mt-1 px-2.5 py-0.5 rounded text-[10px] whitespace-nowrap font-bold pointer-events-none transition-all shadow-sm ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800/90 text-slate-200 border border-slate-700 group-hover:bg-white group-hover:text-slate-900'
                        }`}
                      >
                        {hub.name}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="relative z-20 flex items-center gap-4 text-[11px] text-slate-300 bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 w-fit">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
                  <span>Active Hub</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span>Selected Hub</span>
                </div>
              </div>
            </div>

            {/* City Hub Alumni Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      {CITY_HUBS.find(c => c.id === activeCityId)?.name}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activeCityAlumni.length} verified alumni stationed here
                    </p>
                  </div>
                </div>

                {activeCityAlumni.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No alumni in this hub matching your current filters
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                    {activeCityAlumni.map(alumni => (
                      <div
                        key={alumni.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 hover:border-blue-400 transition-all flex items-start justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={alumni.avatar}
                            alt={alumni.name}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 cursor-pointer"
                            onClick={() => setSelectedAlumni(alumni)}
                          />
                          <div>
                            <h4
                              onClick={() => setSelectedAlumni(alumni)}
                              className="font-bold text-xs text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                            >
                              {alumni.name}
                            </h4>
                            <div className="text-[11px] font-semibold text-blue-700 dark:text-blue-400">
                              {alumni.jobTitle} · {alumni.company}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {alumni.university} ({alumni.graduationYear})
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedAlumni(alumni)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors cursor-pointer shrink-0"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ALUMNI BY INDUSTRY */}
        {activeTab === 'industry' && (
          <div className="space-y-6">
            {Object.entries(alumniByIndustry).map(([industry, members]) => (
              <div key={industry} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{industry}</span>
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                    {members.length} Alumni
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.map(a => (
                    <div
                      key={a.id}
                      onClick={() => setSelectedAlumni(a)}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 hover:border-blue-400 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img src={a.avatar} alt={a.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <p className="font-bold text-xs text-slate-900 dark:text-white">{a.name}</p>
                          <p className="text-[10px] text-blue-700 dark:text-blue-400 font-semibold">{a.jobTitle} · {a.company}</p>
                          <p className="text-[10px] text-slate-400">{a.city}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: BY GRADUATION YEAR */}
        {activeTab === 'grad_year' && (
          <div className="space-y-6">
            {alumniByGradYear.map(([year, members]) => (
              <div key={year} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Class of {year}</span>
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                    {members.length} Alumni
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.map(a => (
                    <div
                      key={a.id}
                      onClick={() => setSelectedAlumni(a)}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-400 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img src={a.avatar} alt={a.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <p className="font-bold text-xs text-slate-900 dark:text-white">{a.name}</p>
                          <p className="text-[10px] text-indigo-700 dark:text-indigo-400 font-semibold">{a.jobTitle} · {a.company}</p>
                          <p className="text-[10px] text-slate-400">{a.university}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: RECOMMENDED CONNECTIONS */}
        {activeTab === 'recommended' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                People You May Want to Connect With
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Curated suggestions based on engineering department, shared technical interests, skills, and target companies.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {recommendedPeople.map(a => (
                  <div
                    key={a.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-3 mb-3">
                        <img src={a.avatar} alt={a.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{a.name}</p>
                          <p className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold">{a.jobTitle} · {a.company}</p>
                          <p className="text-[10px] text-slate-400">{a.university}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {a.bio}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedAlumni(a)}
                        className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:underline cursor-pointer"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => handleConnect(a)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Connect</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: EVENTS & OPPORTUNITIES */}
        {activeTab === 'events' && (
          <div className="space-y-8">
            {/* Events */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Upcoming Alumni Events & Masterclasses</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {events.map(ev => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="px-2 py-0.5 rounded font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 text-[10px]">
                          {ev.type}
                        </span>
                        <span className="text-slate-400 text-[11px] font-semibold">{ev.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ev.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                        {ev.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> {ev.attendeesCount} Registered
                      </span>
                      <button
                        onClick={() => registerForEvent(ev.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        Register Free
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Verified Alumni Career Opportunities & Referrals</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {opportunities.map(opp => (
                  <div
                    key={opp.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="px-2 py-0.5 rounded font-bold bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 text-[10px]">
                          {opp.type}
                        </span>
                        <span className="text-slate-400 text-[11px] font-semibold">{opp.salaryOrStipend}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{opp.title}</h4>
                      <p className="text-xs text-blue-700 dark:text-blue-400 font-semibold mt-0.5">{opp.company} · {opp.location}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                        {opp.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">By {opp.postedBy} ({opp.institution})</span>
                      <button
                        onClick={() => {
                          if (!isAuthenticated) {
                            triggerAuthGate(`apply for ${opp.title} at ${opp.company}`);
                            return;
                          }
                          addToast(`Application / referral request submitted for ${opp.title}`, 'success');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>Apply</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

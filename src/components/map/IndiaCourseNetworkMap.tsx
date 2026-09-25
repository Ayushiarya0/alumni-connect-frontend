import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  GraduationCap,
  Search,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  UserPlus,
  Compass,
  School,
  Star
} from 'lucide-react';
import { AlumniProfile } from '../../types';

export interface CourseData {
  id: string;
  name: string;
  shortCode: string;
  category: string;
  iconName: 'code' | 'ai' | 'civil' | 'electrical' | 'product' | 'design' | 'it' | 'medical';
  degrees: string[];
  description: string;
  hubIds: string[]; // Hub IDs where this course is taught / where alumni work
  campusNames: string[];
  careerRoles: string[];
  topCompanies: string[];
  keySkills: string[];
  avgRating: number;
}

export interface MapHub {
  id: string;
  name: string;
  state: string;
  label: string;
  xPercent: number;
  yPercent: number;
  campuses: string[];
  hubType: 'academic_and_tech' | 'tech_center' | 'academic_center';
}

export const MAP_HUBS: MapHub[] = [
  {
    id: 'roorkee-dehradun',
    name: 'Dehradun & Roorkee',
    state: 'Uttarakhand',
    label: 'Uttarakhand Edu Hub',
    xPercent: 47,
    yPercent: 24,
    campuses: ["Tula's Institute", 'Graphic Era University', 'IIT Roorkee'],
    hubType: 'academic_center'
  },
  {
    id: 'delhi-ncr',
    name: 'Delhi NCR & Gurgaon',
    state: 'Delhi / Haryana',
    label: 'Capital Tech Hub',
    xPercent: 43,
    yPercent: 32,
    campuses: ['DTU Delhi', 'IIT Delhi', 'AIIMS New Delhi'],
    hubType: 'academic_and_tech'
  },
  {
    id: 'rajasthan',
    name: 'Pilani & Jaipur',
    state: 'Rajasthan',
    label: 'BITS & Tech Hub',
    xPercent: 36,
    yPercent: 36,
    campuses: ['BITS Pilani', 'MNIT Jaipur'],
    hubType: 'academic_center'
  },
  {
    id: 'mumbai-pune',
    name: 'Mumbai & Pune',
    state: 'Maharashtra',
    label: 'Industrial & Infra Hub',
    xPercent: 30,
    yPercent: 58,
    campuses: ['IIT Bombay', 'COEP Pune', 'L&T Corporate'],
    hubType: 'academic_and_tech'
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    label: 'Cyberabad AI Hub',
    xPercent: 48,
    yPercent: 62,
    campuses: ['IIT Hyderabad', 'BITS Hyderabad', 'IIIT Hyderabad'],
    hubType: 'academic_and_tech'
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    label: 'Silicon Valley of India',
    xPercent: 44,
    yPercent: 78,
    campuses: ['IISc Bengaluru', 'IIIT-B', 'Tech HQs'],
    hubType: 'tech_center'
  },
  {
    id: 'chennai-trichy',
    name: 'Chennai & Trichy',
    state: 'Tamil Nadu',
    label: 'Southern Engineering Hub',
    xPercent: 52,
    yPercent: 82,
    campuses: ['NIT Trichy', 'IIT Madras', 'Anna University'],
    hubType: 'academic_center'
  },
  {
    id: 'kolkata',
    name: 'Kolkata & Kharagpur',
    state: 'West Bengal',
    label: 'Eastern Tech Corridor',
    xPercent: 78,
    yPercent: 48,
    campuses: ['IIT Kharagpur', 'Jadavpur University'],
    hubType: 'academic_center'
  }
];

export const COURSES_CATALOG: CourseData[] = [
  {
    id: 'cse',
    name: 'Computer Science & Engineering',
    shortCode: 'CSE',
    category: 'Engineering & Computing',
    iconName: 'code',
    degrees: ['B.Tech in CSE', 'M.Tech in Computer Science', 'Dual Degree B.Tech + M.Tech'],
    description: 'Core software engineering, algorithms, distributed systems, scalable web backends, and cloud microservices.',
    hubIds: ['roorkee-dehradun', 'delhi-ncr', 'bengaluru', 'hyderabad', 'mumbai-pune'],
    campusNames: ["Tula's Institute", 'Graphic Era University', 'IIT Roorkee', 'DTU Delhi'],
    careerRoles: ['Senior Software Engineer', 'Backend Architect', 'Cloud Infrastructure Engineer', 'Tech Lead'],
    topCompanies: ['Microsoft', 'Zomato', 'Google', 'Swiggy', 'Amazon'],
    keySkills: ['Data Structures & Algorithms', 'Go / Java', 'System Design', 'Kubernetes', 'Cloud Platforms (Azure/AWS)'],
    avgRating: 4.94
  },
  {
    id: 'ai-ds',
    name: 'Artificial Intelligence & Data Science',
    shortCode: 'AI & DS',
    category: 'Emerging Tech',
    iconName: 'ai',
    degrees: ['B.Tech in AI & ML', 'M.Tech in Data Science & AI', 'PhD in AI'],
    description: 'Foundational machine learning, transformer architectures, LLM fine-tuning, computer vision, and predictive statistics.',
    hubIds: ['roorkee-dehradun', 'hyderabad', 'delhi-ncr', 'bengaluru'],
    campusNames: ['IIT Roorkee', 'IIT Hyderabad', 'Graphic Era University', "Tula's Institute"],
    careerRoles: ['Staff ML Engineer', 'Data Scientist', 'AI/ML Researcher', 'Computer Vision Engineer'],
    topCompanies: ['Google', 'Adobe Research', 'Amazon', 'Microsoft IDC'],
    keySkills: ['PyTorch / TensorFlow', 'Transformers & LLMs', 'Python', 'BigQuery / SQL', 'MLOps'],
    avgRating: 4.96
  },
  {
    id: 'civil',
    name: 'Civil & Infrastructure Engineering',
    shortCode: 'Civil Engg',
    category: 'Core Engineering',
    iconName: 'civil',
    degrees: ['B.Tech in Civil Engineering', 'M.Tech in Structural Engineering'],
    description: 'Structural mechanics, high-speed rail systems, underground metro tunneling, BIM modeling, and sustainable smart cities.',
    hubIds: ['roorkee-dehradun', 'mumbai-pune', 'chennai-trichy', 'delhi-ncr'],
    campusNames: ["Tula's Institute", 'IIT Roorkee', 'NIT Trichy'],
    careerRoles: ['Senior Project Engineer', 'Metro & Tunnel Structural Lead', 'BIM Manager', 'Infrastructure Consultant'],
    topCompanies: ['Larsen & Toubro (L&T)', 'Tata Projects', 'DMRC & Metro Rails', 'Afcons'],
    keySkills: ['Structural Analysis', 'AutoCAD & STAAD Pro', 'BIM Modeling', 'Project Planning', 'Tunnel Engineering'],
    avgRating: 4.89
  },
  {
    id: 'electrical',
    name: 'Electrical & Electronics Engineering',
    shortCode: 'EEE / ECE',
    category: 'Core Engineering',
    iconName: 'electrical',
    degrees: ['B.Tech in Electrical Engg', 'B.Tech in ECE', 'M.Tech in VLSI & Embedded Systems'],
    description: 'Embedded IoT devices, battery telemetry for electric vehicles, clean energy grids, and silicon hardware design.',
    hubIds: ['roorkee-dehradun', 'delhi-ncr', 'bengaluru', 'chennai-trichy'],
    campusNames: ['IIT Roorkee', 'DTU Delhi', 'NIT Trichy'],
    careerRoles: ['EV Telemetry Lead', 'Embedded Hardware Engineer', 'VLSI Design Engineer', 'Hardware Founder'],
    topCompanies: ['Ola Electric', 'Texas Instruments', 'Intel India', 'EdAI Labs'],
    keySkills: ['IoT Microcontrollers', 'Battery Management Systems', 'C / C++', 'Circuit Synthesis', 'Signal Processing'],
    avgRating: 4.91
  },
  {
    id: 'product-mgmt',
    name: 'Product Management & Tech Business',
    shortCode: 'PM & MBA',
    category: 'Leadership & Business',
    iconName: 'product',
    degrees: ['B.E. + M.Sc Information Systems', 'MBA in Tech Management', 'Executive Product Leadership'],
    description: 'Product-market fit strategy, PRD formulation, user discovery funnels, agile sprints, and metric-driven business scaling.',
    hubIds: ['rajasthan', 'bengaluru', 'delhi-ncr', 'mumbai-pune'],
    campusNames: ['BITS Pilani', 'IIT Roorkee', 'Graphic Era University'],
    careerRoles: ['Lead Product Manager', 'Group PM', 'Strategy Director', 'FinTech Product Lead'],
    topCompanies: ['Razorpay', 'Flipkart', 'CRED', 'MakeMyTrip'],
    keySkills: ['PRD Writing', 'Product Roadmapping', 'A/B Testing & Metrics', 'User Research', 'GTM Strategy'],
    avgRating: 4.95
  },
  {
    id: 'ui-ux',
    name: 'UI/UX Design & Human-Centered Computing',
    shortCode: 'UI/UX',
    category: 'Design & Media',
    iconName: 'design',
    degrees: ['B.Des in Visual Communications', 'M.Des in Interaction Design'],
    description: 'Design systems, high-fidelity Figma prototyping, micro-animations, consumer mobile UX, and usability testing.',
    hubIds: ['roorkee-dehradun', 'bengaluru', 'mumbai-pune', 'delhi-ncr'],
    campusNames: ['Graphic Era University', 'IIT Roorkee (Design)', 'National Design Hubs'],
    careerRoles: ['Staff Product Designer', 'Design Systems Architect', 'UX Researcher', 'Interaction Designer'],
    topCompanies: ['CRED', 'Razorpay', 'Urban Company', 'Swiggy'],
    keySkills: ['Figma Mastery', 'Design Systems', 'Micro-Interactions', 'Prototyping', 'User Usability Auditing'],
    avgRating: 4.97
  },
  {
    id: 'it-web',
    name: 'Information Technology & Frontend Architectures',
    shortCode: 'IT & Web',
    category: 'Engineering & Computing',
    iconName: 'it',
    degrees: ['B.Tech in Information Technology', 'BCA / MCA Advanced Systems'],
    description: 'High-speed frontend architectures, component libraries, developer SDKs, checkout security, and web performance.',
    hubIds: ['roorkee-dehradun', 'bengaluru', 'delhi-ncr', 'hyderabad'],
    campusNames: ['Graphic Era University', "Tula's Institute", 'DTU Delhi'],
    careerRoles: ['Lead Frontend Architect', 'Full Stack Developer', 'Design Engineer', 'SDK Developer'],
    topCompanies: ['Razorpay', 'Swiggy', 'Zomato', 'Microsoft'],
    keySkills: ['React / Next.js', 'TypeScript', 'Web Performance Optimization', 'GraphQL', 'SDK Architecture'],
    avgRating: 4.92
  }
];

export const IndiaCourseNetworkMap: React.FC<{ compact?: boolean }> = ({ compact: _compact = false }) => {
  const { alumniList, setSelectedAlumni, sendConnectionRequest, isAuthenticated, triggerAuthGate } = useApp();

  const [selectedCourseId, setSelectedCourseId] = useState<string>('cse');
  const [selectedHubId, setSelectedHubId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeViewMode, setActiveViewMode] = useState<'map' | 'list'>('map');

  // Filter courses by search
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return COURSES_CATALOG;
    const q = searchQuery.toLowerCase();
    return COURSES_CATALOG.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.shortCode.toLowerCase().includes(q) ||
        c.degrees.some(d => d.toLowerCase().includes(q)) ||
        c.campusNames.some(cn => cn.toLowerCase().includes(q)) ||
        c.keySkills.some(s => s.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const activeCourse = useMemo(() => {
    return COURSES_CATALOG.find(c => c.id === selectedCourseId) || COURSES_CATALOG[0];
  }, [selectedCourseId]);

  // Find alumni matching the course
  const courseAlumni = useMemo(() => {
    const q = activeCourse.name.toLowerCase();
    const shortCode = activeCourse.shortCode.toLowerCase();

    return alumniList.filter(alumni => {
      const deg = (alumni.degree || '').toLowerCase();
      const dept = (alumni.department || '').toLowerCase();
      const skills = (alumni.skills || []).map(s => s.toLowerCase());

      // Filter by hub if selected
      if (selectedHubId !== 'all') {
        const hub = MAP_HUBS.find(h => h.id === selectedHubId);
        if (hub) {
          const loc = (alumni.city || alumni.location || alumni.state || '').toLowerCase();
          const uni = (alumni.university || '').toLowerCase();
          const matchesCampus = hub.campuses.some(c => uni.includes(c.toLowerCase()));
          const matchesCity = loc.includes(hub.name.toLowerCase()) || loc.includes(hub.state.toLowerCase());
          if (!matchesCampus && !matchesCity) return false;
        }
      }

      if (activeCourse.id === 'cse') {
        return deg.includes('computer science') || dept.includes('computer') || skills.includes('system design');
      }
      if (activeCourse.id === 'ai-ds') {
        return (
          deg.includes('artificial intelligence') ||
          deg.includes('data science') ||
          skills.includes('machine learning') ||
          skills.includes('generative ai') ||
          skills.includes('pytorch')
        );
      }
      if (activeCourse.id === 'civil') {
        return deg.includes('civil') || dept.includes('civil') || skills.includes('structural analysis');
      }
      if (activeCourse.id === 'electrical') {
        return deg.includes('electrical') || deg.includes('ece') || dept.includes('electrical') || skills.includes('iot');
      }
      if (activeCourse.id === 'product-mgmt') {
        return (
          alumni.jobTitle.toLowerCase().includes('product') ||
          skills.includes('product management') ||
          deg.includes('information systems')
        );
      }
      if (activeCourse.id === 'ui-ux') {
        return (
          deg.includes('design') ||
          alumni.jobTitle.toLowerCase().includes('design') ||
          skills.includes('ui/ux design') ||
          skills.includes('figma')
        );
      }
      if (activeCourse.id === 'it-web') {
        return deg.includes('information technology') || skills.includes('react') || skills.includes('typescript');
      }

      return deg.includes(q) || dept.includes(q) || deg.includes(shortCode);
    });
  }, [alumniList, activeCourse, selectedHubId]);

  // Calculate connection lines for the active course between relevant hubs
  const connectionArcs = useMemo(() => {
    const relevantHubs = MAP_HUBS.filter(h => activeCourse.hubIds.includes(h.id));
    if (relevantHubs.length < 2) return [];

    // Pair academic source hubs with industry destinations
    const sourceHubs = relevantHubs.filter(h => h.hubType === 'academic_center' || h.id === 'roorkee-dehradun');
    const destHubs = relevantHubs.filter(h => h.hubType === 'tech_center' || h.hubType === 'academic_and_tech');

    const arcs: Array<{ from: MapHub; to: MapHub; key: string }> = [];

    sourceHubs.forEach(src => {
      destHubs.forEach(dst => {
        if (src.id !== dst.id) {
          arcs.push({
            from: src,
            to: dst,
            key: `${src.id}-${dst.id}`
          });
        }
      });
    });

    return arcs.slice(0, 5); // display top 5 arcs for a clean, elegant visual
  }, [activeCourse]);

  const handleConnect = (alumni: AlumniProfile) => {
    if (!isAuthenticated) {
      triggerAuthGate(`connect with ${alumni.name} regarding the ${activeCourse.name} program`);
      return;
    }
    sendConnectionRequest(alumni.id);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300">
      {/* Header Bar */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden">
        {/* Ambient background grid */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="course-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#course-grid)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
              <span>Pan-India Course & Degree Discovery Map</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Connect Across India with Alumni by Course
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Explore premier engineering, technology, and management courses across Indian universities. Trace where alumni study, which cities they relocate to, and connect directly with seniors for curriculum guidance.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 sm:gap-4 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 shrink-0 self-start lg:self-auto">
            <div className="text-center px-2">
              <div className="text-lg sm:text-xl font-black text-white">{COURSES_CATALOG.length}</div>
              <div className="text-[10px] text-blue-200 uppercase font-semibold">Specializations</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-2">
              <div className="text-lg sm:text-xl font-black text-teal-300">{MAP_HUBS.length}</div>
              <div className="text-[10px] text-teal-200 uppercase font-semibold">Indian Hubs</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-2">
              <div className="text-lg sm:text-xl font-black text-amber-300">{courseAlumni.length}+</div>
              <div className="text-[10px] text-amber-200 uppercase font-semibold">Verified Alumni</div>
            </div>
          </div>
        </div>

        {/* Search & Course Filter Pills */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search courses, branches, or skills (e.g., Computer Science, Civil, AI, Product)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:bg-white/20 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Hub Filter Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedHubId}
              onChange={e => setSelectedHubId(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none focus:bg-slate-900 cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">All Indian Hubs</option>
              {MAP_HUBS.map(hub => (
                <option key={hub.id} value={hub.id} className="bg-slate-900 text-white">
                  {hub.name} ({hub.state})
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/10 p-1 rounded-xl border border-white/20">
              <button
                onClick={() => setActiveViewMode('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeViewMode === 'map' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setActiveViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeViewMode === 'list' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Course Quick-Select Buttons */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filteredCourses.map(course => {
            const isSelected = course.id === selectedCourseId;
            return (
              <button
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-500 text-white shadow-md scale-102 border border-white/40'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-300" />
                <span>{course.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'}`}>
                  {course.shortCode}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8">
        {activeViewMode === 'map' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Visual Interactive Schematic India Map with Course Connections */}
            <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-6 relative min-h-[500px] overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between">
              
              {/* India Schematic Geographic Outline Visual */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path
                    d="M 45 10 Q 52 14 50 20 Q 55 25 58 32 Q 70 38 82 46 Q 80 54 74 58 Q 62 65 54 78 Q 48 88 44 94 Q 40 85 36 74 Q 28 64 26 54 Q 24 42 32 32 Q 36 22 45 10 Z"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="0.8"
                    strokeDasharray="2,2"
                  />
                </svg>
              </div>

              {/* Dynamic SVG Animated Arcs for Active Course Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#818CF8" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#34D399" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {connectionArcs.map(arc => {
                  const x1 = arc.from.xPercent;
                  const y1 = arc.from.yPercent;
                  const x2 = arc.to.xPercent;
                  const y2 = arc.to.yPercent;
                  // Calculate quadratic curve control point
                  const cx = (x1 + x2) / 2 + (y2 - y1) * 0.15;
                  const cy = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.15;

                  return (
                    <g key={arc.key}>
                      <path
                        d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                        fill="none"
                        stroke="url(#arcGradient)"
                        strokeWidth="1.8"
                        strokeDasharray="4 2"
                        className="animate-pulse opacity-75"
                        vectorEffect="non-scaling-stroke"
                      />
                      {/* Traveling pulse dot on the line */}
                      <circle r="3" fill="#67E8F9" filter="drop-shadow(0 0 4px #38bdf8)">
                        <animateMotion
                          path={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                          dur="3.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  );
                })}
              </svg>

              {/* Top Banner on Map */}
              <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
                  <span className="font-bold text-white">Active Course:</span>
                  <span className="text-blue-400 font-semibold">{activeCourse.name}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {activeCourse.hubIds.length} connected Indian centers
                </div>
              </div>

              {/* Hub Marker Pins */}
              <div className="relative z-20 w-full h-[400px] my-2">
                {MAP_HUBS.map(hub => {
                  const isIncluded = activeCourse.hubIds.includes(hub.id);
                  const isSelected = selectedHubId === hub.id;
                  const hubAlumniCount = courseAlumni.filter(a => {
                    const loc = (a.city || a.location || a.university || '').toLowerCase();
                    return loc.includes(hub.name.toLowerCase()) || hub.campuses.some(c => loc.includes(c.toLowerCase()));
                  }).length;

                  return (
                    <div
                      key={hub.id}
                      onClick={() => setSelectedHubId(isSelected ? 'all' : hub.id)}
                      style={{ left: `${hub.xPercent}%`, top: `${hub.yPercent}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-30"
                    >
                      {/* Pulse ring for hubs active in this course */}
                      {isIncluded && (
                        <span className="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-blue-400 opacity-60" />
                      )}

                      <span
                        className={`relative inline-flex items-center justify-center rounded-2xl text-[10px] font-extrabold border shadow-lg transition-transform group-hover:scale-125 px-2 py-1 ${
                          isSelected
                            ? 'bg-blue-600 text-white border-white scale-110 shadow-blue-500/50'
                            : isIncluded
                            ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white border-teal-300 shadow-teal-500/30'
                            : 'bg-slate-900 text-slate-400 border-slate-700 opacity-70'
                        }`}
                      >
                        <MapPin className="w-3 h-3 mr-0.5" />
                        <span>{hubAlumniCount > 0 ? `${hubAlumniCount} Alumni` : hub.name.split(' ')[0]}</span>
                      </span>

                      {/* Tooltip on hover / selection */}
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 mt-1.5 px-3 py-1.5 rounded-xl text-[10px] whitespace-nowrap font-bold pointer-events-none transition-all shadow-xl z-40 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-900/95 text-slate-200 border border-slate-700 group-hover:bg-white group-hover:text-slate-900'
                        }`}
                      >
                        <div>{hub.name}</div>
                        <div className="text-[9px] opacity-75 font-normal">
                          {hub.campuses.slice(0, 2).join(' · ')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Map Footer & Legend */}
              <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                    <span>Academic & Industry Center</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>Selected Hub</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedHubId('all')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline"
                >
                  Clear Hub Filter
                </button>
              </div>
            </div>

            {/* Course Information & Connected Alumni Panel */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Selected Course Deep-Dive Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-5">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                      {activeCourse.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{activeCourse.avgRating} / 5.0</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                    {activeCourse.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {activeCourse.description}
                  </p>
                </div>

                {/* Popular Degrees */}
                <div>
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Popular Degree Pathways:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCourse.degrees.map(deg => (
                      <span
                        key={deg}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-600"
                      >
                        {deg}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Indian Campuses */}
                <div>
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Top Participating Campuses:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCourse.campusNames.map(c => (
                      <span
                        key={c}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 flex items-center gap-1"
                      >
                        <School className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        <span>{c}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Target Companies & Roles */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-700/80">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Top Hiring Firms
                    </span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {activeCourse.topCompanies.slice(0, 3).join(', ')}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Standard Roles
                    </span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {activeCourse.careerRoles[0]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Alumni Connect List for this Course */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Alumni in this Specialization</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {courseAlumni.length} verified graduates ready to advise
                    </p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    Pan-India Network
                  </span>
                </div>

                {courseAlumni.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No alumni found for this course under the selected hub filter.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {courseAlumni.map(alumni => (
                      <div
                        key={alumni.id}
                        className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all flex items-start justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={alumni.avatar}
                            alt={alumni.name}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 cursor-pointer"
                            onClick={() => setSelectedAlumni(alumni)}
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h5
                                onClick={() => setSelectedAlumni(alumni)}
                                className="font-bold text-xs text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                              >
                                {alumni.name}
                              </h5>
                              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div className="text-[11px] font-semibold text-blue-700 dark:text-blue-400">
                              {alumni.jobTitle} · {alumni.company}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {alumni.university} · {alumni.city}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button
                            onClick={() => setSelectedAlumni(alumni)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-center"
                          >
                            Profile
                          </button>
                          <button
                            onClick={() => handleConnect(alumni)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                          >
                            <UserPlus className="w-3 h-3" />
                            <span>Connect</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Course Directory Grid Mode */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div
                key={course.id}
                onClick={() => {
                  setSelectedCourseId(course.id);
                  setActiveViewMode('map');
                }}
                className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedCourseId === course.id
                    ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-500 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 hover:border-blue-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg">
                      {course.category}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {course.shortCode}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                    {course.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {course.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      <strong className="text-slate-800 dark:text-slate-200">Campuses:</strong>{' '}
                      {course.campusNames.join(', ')}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      <strong className="text-slate-800 dark:text-slate-200">Careers:</strong>{' '}
                      {course.careerRoles.slice(0, 2).join(' · ')}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{course.hubIds.length} Hubs Across India</span>
                  </span>
                  <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                    <span>View Map & Alumni</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

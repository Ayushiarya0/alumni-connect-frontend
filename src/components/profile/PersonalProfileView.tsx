import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Award,
  Sparkles,
  MapPin,
  Calendar,
  Building2,
  FileText,
  ExternalLink,
  Code,
  FolderGit2,
  CheckCircle2,
  Edit3,
  Plus,
  Compass,
  LayoutDashboard,
  Lock,
  Target,
  FileCheck
} from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

export const PersonalProfileView: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    setAuthModalOpen,
    setAuthModalMode,
    studentProfile,
    alumniList,
    setCurrentView,
    addToast
  } = useApp();

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center bg-[#F8F9FA] dark:bg-[#090D16] py-12 px-4 transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900">
              Personal Profile
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-3">
              Sign In to Manage Your Profile
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 leading-relaxed">
              Join Alumni Connect to build meaningful professional connections and showcase your university degree, internships, skills, and verified achievements.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setAuthModalOpen(true);
              }}
              className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => {
                setAuthModalMode('signup');
                setAuthModalOpen(true);
              }}
              className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isAlumni = currentUser.role === 'alumni';
  const currentAlumni = alumniList.find(a => a.id === currentUser.id) || {
    ...alumniList[0],
    id: currentUser.id,
    name: currentUser.name || alumniList[0].name,
    email: currentUser.email || alumniList[0].email,
    avatar: currentUser.avatar || alumniList[0].avatar,
    university: currentUser.university || alumniList[0].university
  };

  const displayName = isAlumni ? currentAlumni.name : (currentUser.name || studentProfile.name);
  const displayAvatar = isAlumni ? currentAlumni.avatar : (currentUser.avatar || studentProfile.avatar);
  const displayUni = isAlumni ? currentAlumni.university : (currentUser.university || studentProfile.university);

  const [availableForMentorship, setAvailableForMentorship] = useState(
    isAlumni ? currentAlumni.availableForMentorship : true
  );

  const toggleMentorship = () => {
    setAvailableForMentorship(!availableForMentorship);
    addToast(
      !availableForMentorship
        ? 'Mentorship status updated to: Available for Mentorship'
        : 'Mentorship status set to: Away',
      'info'
    );
  };

  // Requirement 7: What Alumni can help with
  const alumniCanHelpWith = [
    'Machine Learning',
    'Resume Review',
    'Interview Preparation',
    'Career Guidance',
    'Internship Guidance'
  ];

  // Requirement 8: What Student is looking for guidance in
  const studentLookingForGuidanceIn = studentProfile.lookingForGuidanceIn || [
    'Machine Learning',
    'Data Science',
    'Web Development',
    'Career Planning',
    'Internships',
    'Higher Studies'
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] dark:bg-[#090D16] py-8 sm:py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <button
              onClick={() => setCurrentView(isAlumni ? 'alumni-dashboard' : 'student-dashboard')}
              className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold"
            >
              Dashboard
            </button>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-bold">My Personal Profile</span>
          </div>

          <button
            onClick={() => setCurrentView(isAlumni ? 'alumni-dashboard' : 'student-dashboard')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Go to Dashboard</span>
          </button>
        </div>

        {/* 1. PROFILE HEADER CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative">
                <UserAvatar
                  name={displayName}
                  avatarUrl={displayAvatar}
                  size="2xl"
                  showBadge
                  badgeContent={<ShieldCheck className="w-3.5 h-3.5 text-white" />}
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    {displayName}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    {isAlumni ? 'Verified Alumni' : 'Verified Student'}
                  </span>
                </div>

                <p className="text-sm font-bold text-blue-700 dark:text-blue-400 mt-1">
                  {isAlumni ? `${currentAlumni.jobTitle} @ ${currentAlumni.company}` : `${studentProfile.course}`}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                    <span>
                      {displayUni} · Class of{' '}
                      {isAlumni ? currentAlumni.graduationYear : studentProfile.graduationYear}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isAlumni ? currentAlumni.location : studentProfile.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Completion Meter */}
            <div className="bg-blue-50/70 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-100 dark:border-blue-900 flex flex-col items-center min-w-[160px]">
              <span className="text-2xl font-black text-blue-700 dark:text-blue-400">
                {isAlumni ? '98%' : `${studentProfile.profileCompletion}%`}
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">Profile Completion</span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold mt-1">
                Institutional ID Verified ✓
              </span>
            </div>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: About */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">About</h2>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {isAlumni ? currentAlumni.bio : studentProfile.bio}
              </p>
            </div>

            {/* Section 2: Education */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Education</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {isAlumni ? currentAlumni.university : studentProfile.university}
                    </h3>
                    <p className="text-xs text-blue-700 dark:text-blue-400 font-semibold">
                      {isAlumni ? currentAlumni.degree : studentProfile.course}
                    </p>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-3">
                      <span>Department: {isAlumni ? currentAlumni.department : studentProfile.department}</span>
                      <span>·</span>
                      <span>Graduation: {isAlumni ? currentAlumni.graduationYear : studentProfile.graduationYear}</span>
                    </div>

                    {!isAlumni && studentProfile.academicRecords && (
                      <div className="mt-2 text-xs bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        <strong>Academic Standing:</strong> {studentProfile.academicRecords.gpa} — {studentProfile.academicRecords.highlights}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Internships */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Internships</h2>
              <div className="space-y-4">
                {(isAlumni ? currentAlumni.internships || [] : studentProfile.internships).map(intern => (
                  <div key={intern.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">{intern.role}</h3>
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">{intern.company}</p>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">{intern.duration}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{intern.description}</p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Skills Gained:</span>
                      {intern.skillsGained.map(sk => (
                        <span key={sk} className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-medium border border-slate-200 dark:border-slate-600">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Projects */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Featured Projects</h2>
              <div className="space-y-3">
                {(isAlumni ? currentAlumni.projects || [] : studentProfile.projects).map(proj => (
                  <div key={proj.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                          <FolderGit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          {proj.name}
                        </h3>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                          >
                            <span>Repository</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">{proj.description}</p>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {proj.techStack.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-semibold border border-blue-100 dark:border-blue-900">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Column (1 col) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Section 5: Skills */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Skills & Stack</h2>
              <div className="flex flex-wrap gap-2">
                {(isAlumni ? currentAlumni.skills : studentProfile.skills).map(skill => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-700 dark:hover:text-blue-300 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Section 6: ROLE-SPECIFIC GUIDANCE SECTION */}
            {isAlumni ? (
              /* ALUMNI VIEW: Available for Mentorship & What I can help with */
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Mentorship Setting
                  </h2>
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Available for Mentorship
                  </span>
                  <button
                    onClick={toggleMentorship}
                    className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      availableForMentorship
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {availableForMentorship ? 'Active' : 'Paused'}
                  </button>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    What I Can Help With:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {alumniCanHelpWith.map(item => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-[11px] font-semibold border border-teal-200 dark:border-teal-900 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* STUDENT VIEW: Looking for Guidance In (Requirement 8) */
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Looking for Guidance In
                    </h2>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    AI Guided
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  These topics power Alumni Connect's AI mentor matching to recommend the most relevant alumni from your university and other institutions:
                </p>

                <div className="flex flex-wrap gap-2">
                  {studentLookingForGuidanceIn.map(goal => (
                    <span
                      key={goal}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-900 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      {goal}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setCurrentView('mentors')}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Browse Matching Mentors</span>
                  </button>
                </div>
              </div>
            )}

            {/* Section 7: Achievements */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Achievements & Honors</h2>
              <ul className="space-y-2">
                {(isAlumni ? currentAlumni.achievements : studentProfile.achievements).map((ach, idx) => (
                  <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <Award className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 8: Certifications */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Certifications</h2>
              <div className="space-y-2.5">
                {(isAlumni ? currentAlumni.certifications || [] : studentProfile.certifications).map(cert => (
                  <div key={cert.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="font-bold text-slate-900 dark:text-white">{cert.name}</div>
                    <div className="text-[10px] text-blue-700 dark:text-blue-400 font-semibold">{cert.issuingOrganization} · {cert.issueDate}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

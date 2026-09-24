import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BackButton } from '../common/BackButton';
import {
  GraduationCap,
  ShieldCheck,
  Sparkles,
  MapPin,
  MessageSquare,
  Compass,
  ArrowRight,
  Clock,
  CheckCircle2,
  Building2,
  Star,
  UserPlus,
  User,
  ExternalLink,
  Briefcase,
  HelpCircle,
  TrendingUp,
  Lock,
  Users,
  Search,
  Check,
  FileText,
  FileUp,
  Calendar,
  Award,
  Bookmark,
  Bell,
  Share2
} from 'lucide-react';
import { AlumniProfile } from '../../types';

export const StudentDashboard: React.FC = () => {
  const {
    studentProfile,
    alumniList,
    connections,
    mentorships,
    setSelectedAlumni,
    sendConnectionRequest,
    setCurrentView,
    setActiveChatRecipientId,
    currentUser,
    isAuthenticated,
    setAuthModalOpen,
    setAuthModalMode,
    setGlobalSearchQuery,
    setMentorshipTarget,
    requestResumeReview,
    theme,
    events,
    opportunities,
    achievements,
    setSelectedAchievement,
    registerForEvent,
    notifications,
    addToast
  } = useApp();

  const [savedProfileIds, setSavedProfileIds] = useState<string[]>(['alumni-1', 'alumni-4']);

  const toggleSaveProfile = (id: string) => {
    if (savedProfileIds.includes(id)) {
      setSavedProfileIds(prev => prev.filter(x => x !== id));
      addToast('Profile removed from bookmarks', 'info');
    } else {
      setSavedProfileIds(prev => [...prev, id]);
      addToast('Profile saved to bookmarks!', 'success');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center bg-[#F8F9FA] dark:bg-[#090D16] py-12 px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              Student Command Center
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-3">
              Sign In to Access Student Dashboard
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 leading-relaxed">
              Join Alumni Connect to build meaningful professional connections, view personalized AI alumni recommendations, and track mentorship requests.
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

  // Active Mentors & Mentorship Requests (Requirement 6)
  const myMentorships = mentorships.filter(m => m.studentId === currentUser.id);
  const activeMentorships = myMentorships.filter(m => m.status === 'accepted');
  const pendingMentorships = myMentorships.filter(m => m.status === 'pending');

  // AI-Suggested Alumni & Mentors (Strictly recommends mentors/alumni who offer the help student seeks)
  const suggestedMentors = alumniList
    .filter(a => a.verificationStatus === 'verified' && a.availableForMentorship)
    .slice(0, 3);

  const suggestedAlumni = alumniList
    .filter(a => a.verificationStatus === 'verified')
    .slice(0, 4);

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] dark:bg-[#090D16] py-8 sm:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Bar & Shortcuts */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <BackButton label="Back to Home" fallbackView="landing" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('chat')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-blue-400 transition-colors shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>Messages</span>
            </button>
            <button
              onClick={() => setCurrentView('achievements')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-teal-400 transition-colors shadow-xs cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-teal-600" />
              <span>Achievements</span>
            </button>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-3 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Student Personal Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {currentUser.name || studentProfile.name || 'Student'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Explore verified alumni from <strong className="text-white">{currentUser.university || studentProfile.university || "Tula's Institute"}</strong> and partner institutions like IIT Roorkee, Graphic Era, and IIT Hyderabad. You currently have <strong className="text-white">{activeMentorships.length}</strong> active mentors guiding your preparation.
            </p>

            {/* Profile actions */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setCurrentView('my-profile')}
                className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>View Complete Profile</span>
              </button>
              <button
                onClick={() => setCurrentView('chat')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Mentorship Messages</span>
              </button>
            </div>
          </div>

          {/* Profile Completion Widget */}
          <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-col items-center min-w-[210px] text-center">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="3.5"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="3.5"
                  strokeDasharray={`${studentProfile.profileCompletion || 90}, 100`}
                />
              </svg>
              <span className="absolute text-lg font-extrabold text-white">
                {studentProfile.profileCompletion || 90}%
              </span>
            </div>
            <span className="text-xs font-bold text-white mt-2">Profile Completed</span>
            <button
              onClick={() => setCurrentView('my-profile')}
              className="text-[11px] text-blue-300 hover:text-white underline mt-0.5 cursor-pointer"
            >
              Update Guidance Interests
            </button>
          </div>
        </div>

        {/* Quick Actions (Explore Alumni, Find Mentor, Open Network, View Requests) */}
        <div>
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <button
              onClick={() => setCurrentView('explore')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 hover:shadow-md transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <div className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Explore Alumni
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Discover verified alumni across Indian campuses</p>
            </button>

            <button
              onClick={() => setCurrentView('mentors')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-300 hover:shadow-md transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                Find Mentor
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">1-on-1 resume reviews and interview preparation</p>
            </button>

            <button
              onClick={() => setCurrentView('map')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:shadow-md transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                Open Network
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Explore institutional clusters & tech hubs</p>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('mentors-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 hover:shadow-md transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <div className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors flex items-center justify-between">
                <span>View Requests</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  {myMentorships.length}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Track your pending & active mentorships</p>
            </button>
          </div>
        </div>

        {/* REQUIREMENT 6: "My Mentors" Section */}
        <div id="mentors-section" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/40 px-2.5 py-0.5 rounded-full mb-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Your Active Guides</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                My Mentors
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Experienced alumni guiding your resume, technical interview preparation, and placement roadmaps.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('mentors')}
              className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Find Another Mentor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cards for active mentors */}
          {activeMentorships.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
              <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">No active mentorships yet</p>
              <p className="mt-1">Connect with mentors in the Mentors directory to get 1-on-1 guidance.</p>
              <button
                onClick={() => setCurrentView('mentors')}
                className="mt-3 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 shadow-xs"
              >
                Explore Mentors Directory
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeMentorships.map(m => {
                const alumni = alumniList.find(a => a.id === m.alumniId);
                return (
                  <div
                    key={m.id}
                    className="p-5 rounded-2xl border-2 border-teal-100 dark:border-teal-900/60 bg-teal-50/20 dark:bg-slate-800/60 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top Row: Mentor Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={m.studentAvatar /* or alumni avatar */}
                            alt={m.alumniName}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3
                                onClick={() => {
                                  if (alumni) setSelectedAlumni(alumni);
                                }}
                                className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white hover:text-blue-600 transition-colors cursor-pointer"
                              >
                                {m.alumniName}
                              </h3>
                              <ShieldCheck className="w-4 h-4 text-teal-600" />
                            </div>
                            <p className="text-xs font-bold text-blue-700 dark:text-blue-400">
                              {alumni?.jobTitle || 'Machine Learning Engineer'}
                            </p>
                            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              <strong className="text-slate-800 dark:text-slate-200">{m.alumniCompany}</strong>
                            </div>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-900/70 text-teal-800 dark:text-teal-200">
                          Mentorship Active
                        </span>
                      </div>

                      {/* Mentorship Focus */}
                      <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                        <div className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase">
                          Guidance Focus: {m.areaOfHelp}
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium">{m.goal}</p>
                        {m.scheduledDate && (
                          <div className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold flex items-center gap-1 mt-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Next Session: {m.scheduledDate}</span>
                          </div>
                        )}
                        {m.mentorFeedback && (
                          <div className="mt-2 p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-[11px] text-teal-900 dark:text-teal-200">
                            <strong>Latest Feedback:</strong> {m.mentorFeedback}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Requirement 6: Student actions: Chat, Ask Question, Share Resume, Request Guidance */}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <button
                        onClick={() => {
                          setActiveChatRecipientId(m.alumniId);
                          setCurrentView('chat');
                        }}
                        className="py-2 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-center shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveChatRecipientId(m.alumniId);
                          setCurrentView('chat');
                        }}
                        className="py-2 px-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-center cursor-pointer"
                      >
                        Ask Question
                      </button>

                      <button
                        onClick={() => requestResumeReview(m.alumniId)}
                        className="py-2 px-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-semibold text-center border border-blue-200 dark:border-blue-800 cursor-pointer"
                      >
                        Share Resume
                      </button>

                      <button
                        onClick={() => {
                          if (alumni) setMentorshipTarget(alumni);
                        }}
                        className="py-2 px-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-800 dark:text-teal-200 font-semibold text-center border border-teal-200 dark:border-teal-800 cursor-pointer"
                      >
                        Request Guidance
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* REQUIREMENT 6: "Mentorship Requests" Section (Shows Pending vs Active) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Mentorship Requests</span>
            </h2>
            <span className="text-xs text-amber-800 dark:text-amber-200 font-bold bg-amber-50 dark:bg-amber-900/40 px-2.5 py-0.5 rounded-full">
              {myMentorships.length} Total Requests
            </span>
          </div>

          <div className="space-y-3">
            {myMentorships.map(m => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {m.alumniName} ({m.alumniCompany})
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        m.status === 'accepted'
                          ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200'
                          : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
                      }`}
                    >
                      {m.status === 'accepted' ? 'Mentorship Active' : 'Request Pending'}
                    </span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Topic:</strong> {m.areaOfHelp} · <em>"{m.goal}"</em>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {m.status === 'accepted' ? (
                    <button
                      onClick={() => {
                        setActiveChatRecipientId(m.alumniId);
                        setCurrentView('chat');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                    >
                      Open Chat
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 text-xs font-semibold border border-amber-200 dark:border-amber-800">
                      Awaiting Mentor Confirmation
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggested Mentors (Recommends verified mentors who guide students) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-2.5 py-0.5 rounded-full mb-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI Recommendation Engine</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Recommended Mentors for Your Career Goals
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Matched against your Machine Learning, Python, and Tier-1 product placement goals.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('mentors')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Explore All Mentors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {suggestedMentors.map(mentor => (
              <div
                key={mentor.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white">{mentor.name}</div>
                      <div className="text-xs font-bold text-teal-700 dark:text-teal-400">{mentor.jobTitle}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{mentor.company} · {mentor.experienceYears}y exp</div>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block text-[10px] uppercase">
                      What this mentor can help with:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(mentor.mentorshipTopics || ['Resume Review', 'Interview Prep']).slice(0, 3).map(t => (
                        <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-teal-50 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedAlumni(mentor)}
                    className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => setMentorshipTarget(mentor)}
                    className="py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
                  >
                    Request Mentorship
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 1. RECOMMENDED ALUMNI */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-2.5 py-0.5 rounded-full mb-1">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Peer & Senior Network</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Recommended Alumni
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Alumni from your institution and cross-campus engineering hubs ready to connect.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('explore')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Full Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {suggestedAlumni.map(alumni => {
              const isSaved = savedProfileIds.includes(alumni.id);
              return (
                <div
                  key={alumni.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:shadow-md transition-all space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <img
                        src={alumni.avatar}
                        alt={alumni.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <button
                        onClick={() => toggleSaveProfile(alumni.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 text-blue-600'
                            : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                        }`}
                        title={isSaved ? 'Remove Bookmark' : 'Save Profile'}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    <div className="mt-3">
                      <h3
                        onClick={() => setSelectedAlumni(alumni)}
                        className="font-extrabold text-sm text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer"
                      >
                        {alumni.name}
                      </h3>
                      <div className="text-xs font-bold text-blue-700 dark:text-blue-400">
                        {alumni.jobTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {alumni.company} · Class of {alumni.graduationYear}
                      </div>
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {alumni.skills.slice(0, 3).map(skill => (
                        <span
                          key={skill}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-1.5 text-xs">
                    <button
                      onClick={() => setSelectedAlumni(alumni)}
                      className="flex-1 py-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-center cursor-pointer"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => sendConnectionRequest(alumni.id)}
                      className="py-1.5 px-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800 cursor-pointer"
                    >
                      Connect
                    </button>
                    <button
                      onClick={() => {
                        setActiveChatRecipientId(alumni.id);
                        setCurrentView('chat');
                      }}
                      className="py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                    >
                      Message
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. SAVED PROFILES & CONNECTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Saved Profiles */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-blue-600" />
                <span>Saved Profiles ({savedProfileIds.length})</span>
              </h2>
              <button
                onClick={() => setCurrentView('explore')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Browse More
              </button>
            </div>

            <div className="space-y-3">
              {savedProfileIds.map(id => {
                const profile = alumniList.find(a => a.id === id);
                if (!profile) return null;
                return (
                  <div
                    key={id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <div
                          onClick={() => setSelectedAlumni(profile)}
                          className="font-bold text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer"
                        >
                          {profile.name}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {profile.jobTitle} · {profile.company}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedAlumni(profile)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setActiveChatRecipientId(profile.id);
                          setCurrentView('chat');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold cursor-pointer"
                      >
                        Chat
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connections */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                <span>My Connections ({connections.filter(c => c.studentId === currentUser.id).length})</span>
              </h2>
              <button
                onClick={() => setCurrentView('explore')}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
              >
                Find Alumni
              </button>
            </div>

            <div className="space-y-3">
              {connections.filter(c => c.studentId === currentUser.id).map(conn => {
                const alumni = alumniList.find(a => a.id === conn.alumniId);
                return (
                  <div
                    key={conn.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-sm">
                        {alumni?.name?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {alumni?.name || 'Verified Alumni'}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {alumni?.jobTitle} @ {alumni?.company}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                        {conn.status === 'accepted' ? 'Connected' : 'Pending'}
                      </span>
                      {conn.status === 'accepted' && (
                        <button
                          onClick={() => {
                            setActiveChatRecipientId(conn.alumniId);
                            setCurrentView('chat');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold cursor-pointer"
                        >
                          Chat
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. UPCOMING EVENTS & CAREER OPPORTUNITIES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Upcoming Alumni Events</span>
              </h2>
              <span className="text-xs font-semibold text-slate-500">Live Campus Sessions</span>
            </div>

            <div className="space-y-3">
              {events.slice(0, 3).map(event => (
                <div
                  key={event.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {event.title}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 text-[11px] flex items-center gap-2">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{event.date}</span>
                      <span>·</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Hosted by {event.organizer} · {event.attendeesCount} registered
                    </div>
                  </div>

                  <button
                    onClick={() => registerForEvent(event.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs cursor-pointer self-start sm:self-center"
                  >
                    Register Free
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Career Opportunities */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-teal-600" />
                <span>Career Opportunities</span>
              </h2>
              <span className="text-xs font-semibold text-slate-500">Alumni Referrals</span>
            </div>

            <div className="space-y-3">
              {opportunities.slice(0, 3).map(opp => (
                <div
                  key={opp.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {opp.title}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                        {opp.type}
                      </span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                      <strong>{opp.company}</strong> · {opp.location} · {opp.salaryOrStipend || 'Competitive'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Referred by {opp.postedBy}
                    </div>
                  </div>

                  <button
                    onClick={() => addToast(`Application submitted for ${opp.title} at ${opp.company}!`, 'success')}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs cursor-pointer self-start sm:self-center"
                  >
                    Request Referral
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. ACHIEVEMENT FEED & NOTIFICATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Achievement Feed */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Achievement Feed</span>
              </h2>
              <button
                onClick={() => setCurrentView('achievements')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {achievements.slice(0, 3).map(ach => (
                <div
                  key={ach.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {ach.category}
                    </span>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {ach.title}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {ach.personName} · {ach.institution} ({ach.year})
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedAchievement(ach);
                      setCurrentView('achievements');
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer self-center"
                  >
                    Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Notifications & Alerts</span>
              </h2>
              <span className="text-xs font-semibold text-slate-500">Live Updates</span>
            </div>

            <div className="space-y-3">
              {notifications.slice(0, 3).map(notif => (
                <div
                  key={notif.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3 text-xs"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                  <div className="space-y-0.5">
                    <p className="text-slate-800 dark:text-slate-200 font-medium">
                      {notif.message || notif.title}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {notif.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

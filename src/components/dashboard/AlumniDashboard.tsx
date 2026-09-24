import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BackButton } from '../common/BackButton';
import {
  ShieldCheck,
  Building2,
  MapPin,
  GraduationCap,
  Users,
  Sparkles,
  Calendar,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Star,
  Clock,
  Briefcase,
  Award,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  User,
  Lock,
  FileText,
  Check,
  X,
  Plus,
  Share2
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { UserAvatar } from '../common/UserAvatar';

export const AlumniDashboard: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    setAuthModalOpen,
    setAuthModalMode,
    alumniList,
    connections,
    acceptConnectionRequest,
    rejectConnectionRequest,
    mentorships,
    acceptMentorshipRequest,
    declineMentorshipRequest,
    setCurrentView,
    setActiveChatRecipientId,
    addToast,
    events,
    opportunities,
    achievements,
    registerForEvent,
    setSelectedAchievement,
    sendConnectionRequest
  } = useApp();

  const [shareAchievementOpen, setShareAchievementOpen] = useState(false);
  const [newAchievementTitle, setNewAchievementTitle] = useState('');
  const [newAchievementCategory, setNewAchievementCategory] = useState('Career Achievement');
  const [newAchievementDesc, setNewAchievementDesc] = useState('');

  const [studentModal, setStudentModal] = useState<{
    name: string;
    university: string;
    careerGoal: string;
    skills: string[];
    requestType: string;
    message: string;
    resumeUrl?: string;
  } | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center bg-[#F8F9FA] dark:bg-[#090D16] py-12 px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              Alumni Command Center
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-3">
              Sign In to Access Alumni Dashboard
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 leading-relaxed">
              Join Alumni Connect to build meaningful professional connections, manage mentorship requests from junior students, and give back to your alma mater.
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

  const currentAlumni = alumniList.find(a => a.id === currentUser.id) || {
    ...alumniList[0],
    id: currentUser.id,
    name: currentUser.name || alumniList[0].name,
    email: currentUser.email || alumniList[0].email,
    avatar: currentUser.avatar || alumniList[0].avatar,
    university: currentUser.university || alumniList[0].university
  };
  const [mentorshipAvailable, setMentorshipAvailable] = useState(currentAlumni.availableForMentorship);

  // Incoming mentorship requests seeking this alumni's guidance (Requirement 5)
  const incomingMentorships = mentorships.filter(
    m => m.alumniId === currentAlumni.id
  );

  const pendingGuidanceRequests = incomingMentorships.filter(m => m.status === 'pending');
  const activeMentees = incomingMentorships.filter(m => m.status === 'accepted');

  const incomingConnections = connections.filter(
    c => c.alumniId === currentAlumni.id && c.status === 'pending'
  );

  const activeConnections = connections.filter(
    c => c.alumniId === currentAlumni.id && c.status === 'accepted'
  );

  const toggleAvailability = () => {
    setMentorshipAvailable(!mentorshipAvailable);
    addToast(
      !mentorshipAvailable
        ? 'You are now marked as Available for Student Mentorship!'
        : 'Mentorship status updated to Away.',
      'info'
    );
  };

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
              onClick={() => setShareAchievementOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs font-bold text-teal-800 dark:text-teal-200 hover:bg-teal-100 transition-colors shadow-xs cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-teal-600" />
              <span>Share Achievement</span>
            </button>
          </div>
        </div>

        {/* Verification Status Banner if pending */}
        {currentAlumni.verificationStatus === 'pending' && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-3xl p-5 flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200">
              <h2 className="font-extrabold text-sm">Account Status: Pending Admin Verification</h2>
              <p className="mt-0.5 leading-relaxed">
                Your submitted degree credentials and employment proof at {currentAlumni.company} are currently being reviewed by university administrators. Your Verified Alumni Badge will be activated once verified.
              </p>
            </div>
          </div>
        )}

        {/* Top Alumni Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative">
              <UserAvatar
                name={currentAlumni.name}
                avatarUrl={currentAlumni.avatar}
                size="xl"
                showBadge
                badgeContent={<ShieldCheck className="w-3.5 h-3.5 text-white" />}
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {currentAlumni.name}
                </h1>
                {currentAlumni.verificationStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Verified Mentor
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Under Review
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-blue-700 dark:text-blue-400 mt-1">
                {currentAlumni.jobTitle} · <span className="text-slate-900 dark:text-white">{currentAlumni.company}</span>
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{currentAlumni.university} (Class of {currentAlumni.graduationYear})</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentAlumni.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action & Availability */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setCurrentView('my-profile')}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <User className="w-4 h-4 text-blue-600" />
              <span>Edit Guidance Profile</span>
            </button>

            <button
              onClick={toggleAvailability}
              className="px-4 py-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${mentorshipAvailable ? 'bg-teal-600 animate-pulse' : 'bg-slate-400'}`}></span>
              <span>{mentorshipAvailable ? 'Available for Mentorship' : 'Currently Away'}</span>
            </button>
          </div>
        </div>

        {/* Network Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <span>Students Guided</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
              {activeMentees.length + 14}
            </div>
            <div className="text-[11px] text-teal-600 font-medium mt-1">+4 this month</div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <span>Pending Requests</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
              {pendingGuidanceRequests.length}
            </div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">Awaiting your response</div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <span>Mentorship Sessions</span>
              <Sparkles className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
              {incomingMentorships.length + 22}
            </div>
            <div className="text-[11px] text-teal-600 font-medium mt-1">45+ guidance hours</div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <span>Mentee Rating</span>
              <Star className="w-4 h-4 text-amber-500 fill-current" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
              {currentAlumni.rating || 5.0} / 5.0
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              {currentAlumni.reviewsCount || 40} student reviews
            </div>
          </div>
        </div>

        {/* REQUIREMENT 5: "Students Seeking Your Guidance" Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-2.5 py-0.5 rounded-full mb-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Mentorship Queue</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Students Seeking Your Guidance
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Review student requests for resume reviews, technical mock interviews, and career roadmaps.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 w-fit">
              {pendingGuidanceRequests.length} Pending Guidance Requests
            </span>
          </div>

          {/* Cards Grid: Student Name, University, Career Goal, Skills, Request Type */}
          {pendingGuidanceRequests.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
              <CheckCircle2 className="w-10 h-10 text-teal-500 mx-auto mb-2" />
              <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                All student guidance requests responded to!
              </p>
              <p className="mt-1">Active mentees are listed in your active guidance schedule below.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pendingGuidanceRequests.map(req => {
                const sampleSkills = ['Python', 'Data Structures', 'Machine Learning', 'React'];
                return (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl border-2 border-blue-100 dark:border-blue-900/50 bg-blue-50/20 dark:bg-slate-800/60 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top Row: Student info & Request Type Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={req.studentAvatar}
                            alt={req.studentName}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <div className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                              {req.studentName}
                            </div>
                            <div className="text-xs text-blue-700 dark:text-blue-400 font-semibold flex items-center gap-1">
                              <GraduationCap className="w-3.5 h-3.5" />
                              <span>{req.studentUniversity}</span>
                            </div>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                          Request: {req.areaOfHelp}
                        </span>
                      </div>

                      {/* Career Goal & Message */}
                      <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                        <div className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase">
                          Career Goal & Interest
                        </div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {req.goal}
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-xs italic mt-1">
                          "{req.message}"
                        </p>
                      </div>

                      {/* Student Skills */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mr-1 self-center">
                          Skills:
                        </span>
                        {sampleSkills.map(s => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* Resume link if available */}
                      {req.resumeUrl && (
                        <div className="mt-2.5">
                          <a
                            href={req.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Submitted Resume Draft</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Actions: Accept, Decline, View Student Profile */}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() =>
                          setStudentModal({
                            name: req.studentName,
                            university: req.studentUniversity,
                            careerGoal: req.goal,
                            skills: sampleSkills,
                            requestType: req.areaOfHelp,
                            message: req.message,
                            resumeUrl: req.resumeUrl
                          })
                        }
                        className="flex-1 py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-center"
                      >
                        View Student Profile
                      </button>

                      <button
                        onClick={() => declineMentorshipRequest(req.id)}
                        className="py-2 px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold"
                      >
                        Decline
                      </button>

                      <button
                        onClick={() => {
                          acceptMentorshipRequest(req.id);
                          setActiveChatRecipientId(req.studentId);
                          setCurrentView('chat');
                        }}
                        className="py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept & Guide</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Active Mentees & Guidance Sessions */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Students You Are Currently Mentoring</span>
            </h2>
            <button
              onClick={() => setCurrentView('chat')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Open Messages
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {activeConnections.map(c => (
              <div
                key={c.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img src={c.studentAvatar} alt={c.studentName} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">{c.studentName}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{c.studentUniversity}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => {
                      setActiveChatRecipientId(c.studentId);
                      setCurrentView('chat');
                    }}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 text-center shadow-xs flex items-center justify-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open Chat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 1. UPCOMING EVENTS & ALUMNI SESSIONS */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-2.5 py-0.5 rounded-full mb-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Institutional Knowledge Sharing</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Alumni Events & Campus Sessions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Participate in guest lectures, virtual system design panels, and university reunions.
              </p>
            </div>

            <button
              onClick={() => {
                addToast('Speaker proposal sent to university organizers!', 'success');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Host a Tech Talk
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {events.map(event => (
              <div
                key={event.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4"
              >
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    {event.type.toUpperCase()}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-2">
                    {event.title}
                  </h3>
                  <div className="text-slate-500 dark:text-slate-400 text-xs mt-1 space-y-0.5">
                    <div>📅 {event.date}</div>
                    <div>📍 {event.location}</div>
                    <div>👥 {event.attendeesCount} Registered</div>
                  </div>
                </div>

                <button
                  onClick={() => registerForEvent(event.id)}
                  className="w-full py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  RSVP / Attend
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. ALUMNI COMMUNITY & BATCHMATE NETWORK */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/40 px-2.5 py-0.5 rounded-full mb-1">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                <span>Professional Circle</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Alumni Community & Batchmates
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Connect with verified colleagues across industry tech giants and startup founders.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('explore')}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Alumni</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {alumniList
              .filter(a => a.id !== currentAlumni.id)
              .slice(0, 4)
              .map(peer => (
                <div
                  key={peer.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-11 h-11 rounded-xl object-cover"
                    />
                    <div>
                      <div className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {peer.name}
                      </div>
                      <div className="text-[11px] text-blue-700 dark:text-blue-400 font-bold">
                        {peer.jobTitle}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {peer.company} · {peer.university}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
                    <button
                      onClick={() => sendConnectionRequest(peer.id)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs font-semibold text-slate-700 dark:text-slate-300 text-center cursor-pointer"
                    >
                      Connect
                    </button>
                    <button
                      onClick={() => {
                        setActiveChatRecipientId(peer.id);
                        setCurrentView('chat');
                      }}
                      className="py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                    >
                      Chat
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 3. OPPORTUNITIES & ACHIEVEMENTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Opportunities to refer */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-teal-600" />
                <span>Job & Referral Opportunities</span>
              </h2>
              <button
                onClick={() => {
                  addToast('Referral creation form opened!', 'info');
                }}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
              >
                + Post Referral
              </button>
            </div>

            <div className="space-y-3">
              {opportunities.map(opp => (
                <div
                  key={opp.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {opp.title}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {opp.company} · {opp.location} · {opp.type}
                    </div>
                  </div>

                  <button
                    onClick={() => addToast(`Opening details for ${opp.title} at ${opp.company}`, 'info')}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                  >
                    Manage
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Achievement Sharing & Honors</span>
              </h2>
              <button
                onClick={() => setShareAchievementOpen(true)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                + Share New
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
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal: View Student Profile Preview */}
        {studentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-extrabold text-base">Student Profile Preview</h3>
                <button
                  onClick={() => setStudentModal(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">{studentModal.name}</h4>
                <p className="text-xs text-blue-700 dark:text-blue-400 font-semibold">{studentModal.university}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Career Ambition & Interests</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{studentModal.careerGoal}</p>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Key Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {studentModal.skills.map(sk => (
                    <span key={sk} className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {studentModal.resumeUrl && (
                <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                  <a
                    href={studentModal.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300 hover:underline"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Open Student's Uploaded Resume (PDF)</span>
                  </a>
                </div>
              )}

              <button
                onClick={() => setStudentModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}

        {/* Modal: Share New Achievement */}
        {shareAchievementOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal-600" />
                  <span>Share Your Achievement</span>
                </h3>
                <button
                  onClick={() => setShareAchievementOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Achievement Title
                  </label>
                  <input
                    type="text"
                    value={newAchievementTitle}
                    onChange={e => setNewAchievementTitle(e.target.value)}
                    placeholder="e.g. Promoted to Staff Engineer / Founded AI Startup"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={newAchievementCategory}
                    onChange={e => setNewAchievementCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Career Achievement">Career Achievement</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Research">Research</option>
                    <option value="Academic Excellence">Academic Excellence</option>
                    <option value="Innovation">Innovation</option>
                    <option value="Social Impact">Social Impact</option>
                    <option value="Leadership">Leadership</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Brief Description
                  </label>
                  <textarea
                    rows={3}
                    value={newAchievementDesc}
                    onChange={e => setNewAchievementDesc(e.target.value)}
                    placeholder="Share the story, impact, or milestone with students and alumni..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setShareAchievementOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newAchievementTitle.trim()) {
                      addToast('Please enter an achievement title', 'error');
                      return;
                    }
                    addToast('Achievement shared successfully with the community!', 'success');
                    setShareAchievementOpen(false);
                    setNewAchievementTitle('');
                    setNewAchievementDesc('');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Publish Achievement
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

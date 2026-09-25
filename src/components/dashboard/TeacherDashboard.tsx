import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BackButton } from '../common/BackButton';
import {
  ShieldCheck,
  Building2,
  GraduationCap,
  Users,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  BookOpen,
  Send,
  Eye,
  Check,
  X,
  Target,
  FileText,
  Compass,
  ArrowRight,
  BrainCircuit,
  Lock
} from 'lucide-react';
import { calculateTeacherStudentCompatibility } from '../../utils/aiEngines';
import { StudentProfile } from '../../types';
import { motion } from 'framer-motion';

export const TeacherDashboard: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    setAuthModalOpen,
    setAuthModalMode,
    teacherProfile,
    teachersList,
    studentProfile,
    pendingStudents,
    connections,
    acceptConnectionRequest,
    rejectConnectionRequest,
    sendConnectionRequest,
    setCurrentView,
    setActiveChatRecipientId,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'requests' | 'recommended' | 'active'>('requests');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<StudentProfile | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center bg-[#F8F9FA] dark:bg-[#090D16] py-12 px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
              Faculty Command Portal
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-3">
              Faculty Login Required
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 leading-relaxed">
              Access your teacher dashboard to review student connection requests, discover AI-recommended mentees, and provide academic guidance.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setAuthModalOpen(true);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              Sign In as Faculty
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeTeacher = teacherProfile?.id === currentUser.id
    ? teacherProfile
    : (teachersList?.find(t => t.id === currentUser.id) || teacherProfile);

  // Incoming connection requests addressed to this teacher
  const incomingRequests = connections.filter(
    c => (c.alumniId === activeTeacher.id || c.alumniId === currentUser.id) && c.status === 'pending'
  );

  // Accepted connections
  const activeConnections = connections.filter(
    c => (c.alumniId === activeTeacher.id || c.alumniId === currentUser.id) && c.status === 'accepted'
  );

  // Pool of candidate students for AI recommendations
  const candidateStudents: StudentProfile[] = useMemo(() => {
    const list = [studentProfile, ...(pendingStudents || [])];
    // De-duplicate by ID
    const seen = new Set<string>();
    return list.filter(s => {
      if (!s || !s.id || seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
  }, [studentProfile, pendingStudents]);

  // Dynamically calculate compatibility for all candidate students
  const aiRecommendedStudents = useMemo(() => {
    return candidateStudents
      .map(student => ({
        student,
        compat: calculateTeacherStudentCompatibility(activeTeacher, student)
      }))
      .sort((a, b) => b.compat.compatibilityScore - a.compat.compatibilityScore);
  }, [candidateStudents, activeTeacher]);

  const handleAccept = (reqId: string, studentName: string) => {
    acceptConnectionRequest(reqId);
    addToast(`Accepted connection request from ${studentName}.`, 'success');
  };

  const handleReject = (reqId: string) => {
    rejectConnectionRequest(reqId);
    addToast('Connection request declined.', 'info');
  };

  const handleStartChat = (studentId: string) => {
    setActiveChatRecipientId(studentId);
    setCurrentView('chat');
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] dark:bg-[#090D16] py-8 sm:py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation & Header */}
        <div>
          <BackButton label="Back to Home" fallbackView="landing" className="mb-3" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
                <BrainCircuit className="w-3.5 h-3.5 text-amber-600" />
                <span>Faculty Academic &amp; Mentorship Command</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Teacher Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
                Guide students matching your research and teaching focus, review incoming connection requests, and hold virtual office hours.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('my-profile')}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 transition-colors self-start sm:self-auto shadow-sm"
            >
              View Public Faculty Profile
            </button>
          </div>
        </div>

        {/* Teacher Overview Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <img
                src={activeTeacher.avatar}
                alt={activeTeacher.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400/40 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {activeTeacher.name}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Faculty
                  </span>
                </div>

                <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mt-1">
                  {activeTeacher.designation} · {activeTeacher.department}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {activeTeacher.university}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    Office Hours: {activeTeacher.officeHours || 'Tue, Thu: 2:00 PM - 5:00 PM'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-center min-w-[90px]">
                <span className="text-xl font-black text-amber-700 dark:text-amber-300 block">
                  {incomingRequests.length}
                </span>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Pending</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-center min-w-[90px]">
                <span className="text-xl font-black text-blue-700 dark:text-blue-300 block">
                  {activeConnections.length}
                </span>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Connected</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40 text-center min-w-[90px]">
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-300 block">
                  {aiRecommendedStudents.length}
                </span>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">AI Matches</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'requests'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>Connection Requests</span>
            {incomingRequests.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black">
                {incomingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('recommended')}
            className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'recommended'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Recommended Students</span>
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'active'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Active Student Connections ({activeConnections.length})</span>
          </button>
        </div>

        {/* Tab 1: Incoming Connection Requests */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {incomingRequests.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">All caught up!</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You have no pending student connection requests. Check the "AI-Recommended Students" tab to discover students matching your expertise.
                </p>
              </div>
            ) : (
              incomingRequests.map(req => (
                <div
                  key={req.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={req.studentAvatar || 'https://api.dicebear.com/8.x/avataaars/svg?seed=Alex'}
                      alt={req.studentName}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {req.studentName}
                        </h4>
                        {req.matchPercentage && (
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-black">
                            {req.matchPercentage}% AI Match
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {req.studentUniversity}
                      </p>

                      {req.note && (
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 italic">
                          "{req.note}"
                        </p>
                      )}

                      {req.matchedSkills && req.matchedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          <span className="text-[10px] font-bold text-slate-400 mr-1">Matched:</span>
                          {req.matchedSkills.map(sk => (
                            <span key={sk} className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                              {sk} ✓
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Accept / Reject Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleReject(req.id)}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-red-50 hover:border-red-200 text-slate-600 hover:text-red-600 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      Decline
                    </button>
                    <button
                      onClick={() => handleAccept(req.id, req.studentName)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Accept Request
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: AI-Recommended Students (Requirement 10) */}
        {activeTab === 'recommended' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-amber-600" />
                  AI Compatibility Engine
                </h4>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                  Calculated by cross-referencing your teaching syllabus &amp; research expertise with each student's learning goals and project interests.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiRecommendedStudents.map(({ student, compat }) => (
                <div
                  key={student.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar || 'https://api.dicebear.com/8.x/avataaars/svg?seed=Alex'}
                          alt={student.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {student.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {student.course} · Class of {student.graduationYear}
                          </p>
                        </div>
                      </div>

                      {/* Dynamic Compatibility Score */}
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-black">
                        {compat.compatibilityScore}% Match
                      </span>
                    </div>

                    {/* Requirement 10: "Student wants X | You provide Y" explanation */}
                    <div className="mt-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Student Wants to Learn:</span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {(student.learningGoals || ['Machine Learning', 'Python']).map(g => (
                            <span key={g} className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[10px] font-bold">
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">You Provide:</span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {(compat.matchedTopics || activeTeacher.subjectsCanTeach?.slice(0, 3) || []).map((p: string) => (
                            <span key={p} className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                              {p} ✓
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 italic">
                      "{compat.whyRecommended}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setSelectedStudentForModal(student)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Student Profile
                    </button>

                    <button
                      onClick={() => {
                        sendConnectionRequest(student.id, {
                          targetRole: 'alumni',
                          matchPercentage: compat.compatibilityScore,
                          matchedSkills: compat.matchedTopics,
                          matchReason: compat.whyRecommended,
                          note: `Professor invitation from ${activeTeacher.name}`
                        });
                        addToast(`Invitation sent to ${student.name}!`, 'success');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <Send className="w-3 h-3" />
                      Invite to Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Active Student Connections */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {activeConnections.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <Users className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">No active connections yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When you accept connection requests from students, they will appear here with direct chat access.
                </p>
              </div>
            ) : (
              activeConnections.map(conn => (
                <div
                  key={conn.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={conn.studentAvatar || 'https://api.dicebear.com/8.x/avataaars/svg?seed=Alex'}
                      alt={conn.studentName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {conn.studentName}
                        </h4>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                          Connected
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{conn.studentUniversity}</p>
                      {conn.matchPercentage && (
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-1 block">
                          AI Compatibility: {conn.matchPercentage}%
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartChat(conn.studentId)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm self-end sm:self-auto"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Open Mentorship Chat
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {selectedStudentForModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Candidate Student Profile
              </h3>
              <button
                onClick={() => setSelectedStudentForModal(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudentForModal.avatar || 'https://api.dicebear.com/8.x/avataaars/svg?seed=Alex'}
                  alt={selectedStudentForModal.name}
                  className="w-14 h-14 rounded-2xl object-cover border"
                />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {selectedStudentForModal.name}
                  </h4>
                  <p className="text-xs text-slate-500">{selectedStudentForModal.course}</p>
                  <p className="text-xs text-slate-400">{selectedStudentForModal.university}</p>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Bio:</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">
                  {selectedStudentForModal.bio || 'Motivated engineering student looking for faculty guidance in machine learning.'}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {(selectedStudentForModal.skills || []).map(s => (
                    <span key={s} className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Learning Topics:</span>
                <div className="flex flex-wrap gap-1">
                  {(selectedStudentForModal.learningGoals || ['Machine Learning', 'Python']).map(g => (
                    <span key={g} className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudentForModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

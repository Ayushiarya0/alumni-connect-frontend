import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Search,
  Send,
  ShieldCheck,
  CheckCheck,
  Building2,
  GraduationCap,
  Sparkles,
  User,
  Clock,
  Lock,
  FileText,
  Check,
  X,
  HelpCircle,
  FileUp,
  Award,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

import { BackButton } from '../common/BackButton';
import { UserAvatar } from '../common/UserAvatar';

export const ChatSystem: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    setAuthModalOpen,
    setAuthModalMode,
    alumniList,
    connections,
    mentorships,
    acceptMentorshipRequest,
    declineMentorshipRequest,
    sendResumeFeedback,
    messages,
    sendMessage,
    activeChatRecipientId,
    setActiveChatRecipientId,
    setCurrentView,
    navigate,
    theme,
    chatSessionTimeRemaining,
    isChatSessionLocked,
    chatSessionPrice,
    setChatSessionPrice,
    unlockChatSession,
    resetChatTimer,
    addToast
  } = useApp();

  const isStudent = currentUser.role === 'student';
  const isAlumni = currentUser.role === 'alumni' || currentUser.role === 'admin';

  // Navigation tab in chat
  const [chatTab, setChatTab] = useState<'conversations' | 'requests'>('conversations');
  const [inputText, setInputText] = useState('');
  const [conversationSearch, setConversationSearch] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showPaidUnlockModal, setShowPaidUnlockModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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
              Private Mentorship Network
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-3">
              Sign In Required for Mentorship Conversations
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 leading-relaxed">
              Login to ask verified alumni for career guidance, request resume reviews, and receive 1-on-1 industry mentorship.
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

  // Determine conversation partners based on role
  // If Student: partners are Alumni / Mentors who guide them
  // If Alumni: partners are Students seeking guidance
  const acceptedConns = connections.filter(c => c.status === 'accepted');

  const conversationPartners = isStudent
    ? acceptedConns
        .filter(c => c.studentId === currentUser.id)
        .map(c => {
          const alumni = alumniList.find(a => a.id === c.alumniId);
          return {
            id: c.alumniId,
            name: c.alumniName,
            avatar: c.alumniAvatar,
            roleTitle: alumni?.jobTitle || 'Verified Mentor',
            company: c.alumniCompany,
            university: alumni?.university || 'IIT Roorkee',
            isMentor: alumni?.availableForMentorship ?? true,
            isOnline: true
          };
        })
    : acceptedConns
        .filter(c => c.alumniId === currentUser.id)
        .map(c => ({
          id: c.studentId,
          name: c.studentName,
          avatar: c.studentAvatar,
          roleTitle: 'Student Seeking Guidance',
          company: c.studentUniversity,
          university: c.studentUniversity,
          isMentor: false,
          isOnline: true
        }));

  // If no active recipient, fallback to first partner or Rahul Sharma / Ayushi
  const activeRecipientId =
    activeChatRecipientId ||
    (conversationPartners[0]?.id ?? (isStudent ? 'alumni-rahul-sharma' : 'student-ayushi'));

  const activePartner =
    conversationPartners.find(p => p.id === activeRecipientId) ||
    (isStudent
      ? {
          id: 'alumni-rahul-sharma',
          name: 'Rahul Sharma',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          roleTitle: 'Machine Learning Engineer',
          company: 'Microsoft',
          university: 'IIT Roorkee',
          isMentor: true,
          isOnline: true
        }
      : {
          id: 'student-registered',
          name: 'Ayushi Arya',
          avatar: '',
          roleTitle: 'Student Seeking Guidance',
          company: "Tula's Institute",
          university: "Tula's Institute",
          isMentor: false,
          isOnline: true
        });

  // Filter messages between currentUser and activeRecipientId
  const currentConversationMessages = messages.filter(
    m =>
      (m.senderId === currentUser.id && m.receiverId === activeRecipientId) ||
      (m.senderId === activeRecipientId && m.receiverId === currentUser.id)
  );

  // Relevant mentorship request for this partner pair (if any)
  const activeMentorship = mentorships.find(
    m =>
      (m.studentId === currentUser.id && m.alumniId === activeRecipientId) ||
      (m.alumniId === currentUser.id && m.studentId === activeRecipientId)
  );

  // Pending student requests for Alumni view
  const incomingStudentRequests = mentorships.filter(
    m => m.alumniId === currentUser.id && m.status === 'pending'
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversationMessages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeRecipientId) return;

    sendMessage(activeRecipientId, inputText);
    setInputText('');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1800);
  };

  // Quick Action Buttons for Students (strictly Student asking Alumni for help)
  const handleStudentQuickAction = (actionType: 'resume' | 'career' | 'interview' | 'tech') => {
    if (!activeRecipientId) return;

    let text = '';
    if (actionType === 'resume') {
      text = 'Hi! Could you please review my resume and suggest improvements for SDE and ML roles?';
    } else if (actionType === 'career') {
      text = 'Can you guide me on the roadmap to become a Machine Learning Engineer at top product companies?';
    } else if (actionType === 'interview') {
      text = 'Can you help me prepare for upcoming technical interviews and share what recruiters prioritize?';
    } else {
      text = 'Can you suggest which core technical skills, projects, and certifications I should build next?';
    }

    sendMessage(activeRecipientId, text);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1800);
  };

  const handleProvideFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackInput.trim() || !activeMentorship) return;

    sendResumeFeedback(activeMentorship.id, feedbackInput);
    sendMessage(
      activeRecipientId,
      `📋 Mentor Resume Feedback: "${feedbackInput}"`
    );
    setFeedbackInput('');
    setShowFeedbackModal(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] dark:bg-[#090D16] py-6 sm:py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header with Universal Back Button */}
        <div className="flex items-center justify-between mb-4">
          <BackButton
            label={isStudent ? 'Back to Student Dashboard' : 'Back to Alumni Dashboard'}
            fallbackView={isStudent ? 'student-dashboard' : 'alumni-dashboard'}
          />
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
              Verified 1-on-1 Guidance Channel
            </span>
          </div>
        </div>

        {/* Main Chat Box Container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-[82vh] min-h-[600px] grid grid-cols-1 md:grid-cols-12 transition-colors">
          
          {/* Left Column: Conversations & Requests List (md: 4 cols) */}
          <div className="md:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
            
            {/* Header & Tabs */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>
                    {isStudent ? 'Your Mentorship Conversations' : 'Student Guidance Center'}
                  </span>
                </h2>
              </div>

              {/* Strict Requirement 10: Role-specific navigation tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold mb-3">
                <button
                  onClick={() => setChatTab('conversations')}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center ${
                    chatTab === 'conversations'
                      ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {isStudent ? 'My Mentors' : 'Students I Mentor'}
                </button>
                <button
                  onClick={() => setChatTab('requests')}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                    chatTab === 'requests'
                      ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <span>{isStudent ? 'Mentorship Requests' : 'Student Requests'}</span>
                  {incomingStudentRequests.length > 0 && !isStudent && (
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center">
                      {incomingStudentRequests.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={conversationSearch}
                  onChange={e => setConversationSearch(e.target.value)}
                  placeholder={isStudent ? 'Search your mentors...' : 'Search students...'}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-600 outline-none bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              
              {/* Tab 1: Conversations */}
              {chatTab === 'conversations' && (
                <>
                  {conversationPartners.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      <Lock className="w-6 h-6 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        {isStudent ? 'No active mentors yet' : 'No active mentees yet'}
                      </p>
                      <p className="mt-1">
                        {isStudent
                          ? 'Find a verified alumni mentor in the Mentors or Explore section.'
                          : 'Students requesting your guidance will appear in Student Requests.'}
                      </p>
                      {isStudent && (
                        <button
                          onClick={() => setCurrentView('mentors')}
                          className="mt-3 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                        >
                          Find a Mentor
                        </button>
                      )}
                    </div>
                  ) : (
                    conversationPartners
                      .filter(p => p.name.toLowerCase().includes(conversationSearch.toLowerCase()))
                      .map(p => {
                        const isSelected = p.id === activeRecipientId;
                        return (
                          <div
                            key={p.id}
                            onClick={() => setActiveChatRecipientId(p.id)}
                            className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-3 ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 shadow-xs'
                                : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/60 border border-transparent'
                            }`}
                          >
                            <div className="relative">
                              <UserAvatar
                                name={p.name}
                                avatarUrl={p.avatar}
                                size="md"
                              />
                              {p.isOnline && (
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-teal-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-slate-900 dark:text-white truncate flex items-center gap-1">
                                  <span>{p.name}</span>
                                  {p.isMentor && <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />}
                                </span>
                                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">Online</span>
                              </div>
                              <div className="text-[11px] text-blue-700 dark:text-blue-400 truncate font-semibold">
                                {p.roleTitle} {p.company ? `· ${p.company}` : ''}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                                {p.university}
                              </div>
                            </div>
                          </div>
                        );
                      })
                  )}
                </>
              )}

              {/* Tab 2: Requests (Strict Student Requests for Alumni; Mentorship Requests for Student) */}
              {chatTab === 'requests' && (
                <div className="space-y-2 p-1">
                  {isStudent ? (
                    /* Student viewing outgoing Mentorship Requests */
                    <>
                      {mentorships.map(m => (
                        <div
                          key={m.id}
                          className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              Mentor: {m.alumniName} ({m.alumniCompany})
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                m.status === 'accepted'
                                  ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                                  : 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                              }`}
                            >
                              {m.status === 'accepted' ? 'Mentorship Active' : 'Request Pending'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300">
                            <strong>Help Needed:</strong> {m.areaOfHelp} - {m.goal}
                          </p>
                          {m.scheduledDate && (
                            <p className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Scheduled: {m.scheduledDate}</span>
                            </p>
                          )}
                          {m.mentorFeedback && (
                            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-[11px] text-teal-900 dark:text-teal-200">
                              <strong>Mentor Feedback:</strong> {m.mentorFeedback}
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    /* Alumni / Mentor viewing incoming Student Requests */
                    <>
                      {incomingStudentRequests.length === 0 ? (
                        <p className="text-center py-6 text-xs text-slate-400">
                          No pending student requests. Active mentees appear under "Students I Mentor".
                        </p>
                      ) : (
                        incomingStudentRequests.map(req => (
                          <div
                            key={req.id}
                            className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800/80 shadow-xs space-y-2.5"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={req.studentAvatar}
                                alt={req.studentName}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                              />
                              <div>
                                <div className="font-extrabold text-xs text-slate-900 dark:text-white">
                                  {req.studentName}
                                </div>
                                <div className="text-[10px] text-blue-700 dark:text-blue-400 font-semibold">
                                  Student · {req.studentUniversity}
                                </div>
                              </div>
                            </div>

                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs">
                              <span className="font-bold text-slate-700 dark:text-slate-300 block text-[10px] uppercase">
                                Request: {req.areaOfHelp}
                              </span>
                              <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5 italic">
                                "{req.message}"
                              </p>
                              {req.resumeUrl && (
                                <a
                                  href={req.resumeUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline"
                                >
                                  <FileText className="w-3 h-3" />
                                  <span>View Student's Resume Draft</span>
                                </a>
                              )}
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={() => declineMentorshipRequest(req.id)}
                                className="flex-1 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 text-xs font-semibold"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => {
                                  acceptMentorshipRequest(req.id);
                                  setActiveChatRecipientId(req.studentId);
                                  setChatTab('conversations');
                                }}
                                className="flex-1 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
                              >
                                Accept & Guide
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Chat Window & Guidance Tools (md: 8 cols) */}
          <div className="md:col-span-8 flex flex-col h-full bg-white dark:bg-slate-900">
            {activePartner ? (
              <>
                {/* Active Partner Top Bar */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <UserAvatar
                        name={activePartner.name}
                        avatarUrl={activePartner.avatar}
                        size="md"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-teal-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {activePartner.name}
                        </span>
                        {activePartner.isMentor && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-teal-700 dark:text-teal-300 font-bold bg-teal-50 dark:bg-teal-900/40 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                            <ShieldCheck className="w-3 h-3 text-teal-600" />
                            Verified Mentor
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {activePartner.roleTitle} {activePartner.company ? `· ${activePartner.company}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Free conversation timer */}
                    <div
                      className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
                        isChatSessionLocked
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900'
                          : chatSessionTimeRemaining <= 60
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900 animate-pulse'
                          : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900'
                      }`}
                      title={isChatSessionLocked ? 'Free 5-minute session expired' : 'Active conversation timer'}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Free conversation: {formatTimer(chatSessionTimeRemaining)}</span>
                    </div>

                    {/* End Conversation Button */}
                    <button
                      onClick={() => {
                        resetChatTimer();
                        addToast('Conversation session concluded.', 'info');
                      }}
                      className="hidden sm:inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                      title="Conclude conversation session"
                    >
                      End conversation
                    </button>

                    {/* Alumni/Mentor specific action: Provide Resume Feedback */}
                    {isAlumni && (
                      <button
                        onClick={() => setShowFeedbackModal(true)}
                        className="px-3 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-bold hover:bg-teal-100 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-teal-600" />
                        <span className="hidden sm:inline">Give Resume Feedback</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Mentorship Context Card (Shows ongoing guidance relationship) */}
                {activeMentorship && (
                  <div className="px-4 py-2.5 bg-blue-50/70 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/50 flex flex-wrap items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-bold text-slate-900 dark:text-white">
                        Mentorship Topic: {activeMentorship.areaOfHelp}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">({activeMentorship.goal})</span>
                    </div>
                    {activeMentorship.resumeUrl && (
                      <a
                        href={activeMentorship.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 dark:text-blue-300 font-bold flex items-center gap-1 hover:underline"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Student Resume Draft</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Message Feed */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
                  <div className="text-center my-2">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full shadow-xs">
                      {isStudent
                        ? `Mentorship Channel with ${activePartner.name}`
                        : `Student Mentorship Session with ${activePartner.name}`}
                    </span>
                  </div>

                  {currentConversationMessages.map(msg => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[80%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                            isMe
                              ? 'bg-blue-600 text-white rounded-br-none'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-bl-none'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                              isMe ? 'text-blue-200' : 'text-slate-400'
                            }`}
                          >
                            <span>
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {isMe && <CheckCheck className="w-3.5 h-3.5 text-blue-200" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                      <div className="flex gap-1 items-center bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-xs">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                        <span
                          className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        ></span>
                        <span
                          className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: '0.4s' }}
                        ></span>
                      </div>
                      <span>{activePartner.name} is typing...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Action Buttons for Students (Strictly Student -> Requests Help -> Alumni/Mentor) */}
                {isStudent && (
                  <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
                    <span className="text-[11px] text-slate-400 font-bold whitespace-nowrap">Ask Mentor:</span>
                    <button
                      onClick={() => handleStudentQuickAction('resume')}
                      className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs whitespace-nowrap transition-colors font-medium cursor-pointer"
                    >
                      Request Resume Review
                    </button>
                    <button
                      onClick={() => handleStudentQuickAction('career')}
                      className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs whitespace-nowrap transition-colors font-medium cursor-pointer"
                    >
                      Ask Career Question
                    </button>
                    <button
                      onClick={() => handleStudentQuickAction('interview')}
                      className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs whitespace-nowrap transition-colors font-medium cursor-pointer"
                    >
                      Interview Guidance
                    </button>
                    <button
                      onClick={() => handleStudentQuickAction('tech')}
                      className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs whitespace-nowrap transition-colors font-medium cursor-pointer"
                    >
                      Technical Help
                    </button>
                  </div>
                )}

                {/* Input Bar or Locked Session Overlay */}
                {isChatSessionLocked ? (
                  <div className="p-4 sm:p-5 bg-amber-50/90 dark:bg-amber-950/40 border-t border-amber-200 dark:border-amber-900/80 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs sm:text-sm">
                      <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Your free 5-minute conversation has ended.</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                      Extend your 1-on-1 mentorship session with {activePartner.name} for another 5 minutes to continue this career conversation.
                    </p>
                    <button
                      onClick={() => setShowPaidUnlockModal(true)}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Continue Conversation (₹{chatSessionPrice} / 5 mins)</span>
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSend}
                    className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3"
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      placeholder={
                        isStudent
                          ? `Ask ${activePartner.name} for guidance or resume feedback...`
                          : `Guide ${activePartner.name} and answer their questions...`
                      }
                      className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 outline-none transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className={`p-2.5 rounded-xl font-semibold transition-all ${
                        inputText.trim()
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                <h3 className="font-bold text-slate-700 dark:text-slate-300 text-base">Select a conversation</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  {isStudent
                    ? 'Connect with alumni mentors from your college or partner institutions.'
                    : 'Select a student to review their mentorship request and provide guidance.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal: Mentor Provides Resume Feedback */}
        {showFeedbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white">
              <h3 className="text-lg font-extrabold flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <span>Provide Resume Feedback to {activePartner.name}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Share constructive suggestions on technical skills, project presentation, and interview alignment.
              </p>

              <form onSubmit={handleProvideFeedbackSubmit} className="mt-4 space-y-3">
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Overall format is clean. I recommend quantifying impact in your ML projects (e.g. 'Reduced inference latency by 25%'). Emphasize Docker and PyTorch in skills..."
                  value={feedbackInput}
                  onChange={e => setFeedbackInput(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600 leading-relaxed"
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
                  >
                    Send Feedback
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Paid Session Continuation */}
        {showPaidUnlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white">
              <button
                onClick={() => setShowPaidUnlockModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Mentorship Extension
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Continue Conversation
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Add an additional 5-minute mentorship session with {activePartner.name}. Pricing is configurable per platform standards.
              </p>

              {/* Price selector */}
              <div className="my-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Session Rate:</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">(Configurable)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 20, 25].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setChatSessionPrice(amt)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        chatSessionPrice === amt
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      ₹{amt} / 5m
                    </button>
                  ))}
                </div>
              </div>

              {/* Prototype verification disclaimer */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                  Sandbox Payment Integration:
                </span>
                Verified prototype payment simulation. Production system connects to Razorpay / Stripe gateway with UPI, NetBanking and card processing.
              </div>

              <div className="flex items-center justify-end gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setShowPaidUnlockModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    unlockChatSession();
                    setShowPaidUnlockModal(false);
                    addToast(`Payment of ₹${chatSessionPrice} verified. +5 minutes unlocked!`, 'success');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow transition-all cursor-pointer"
                >
                  Verify & Unlock +5 Mins (₹{chatSessionPrice})
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

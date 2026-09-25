import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Building2,
  MapPin,
  Clock,
  ArrowRight,
  Send,
  UserCheck,
  ShieldCheck,
  Info,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  Lightbulb
} from 'lucide-react';
import { AIMentorMatch, TeacherProfile, AlumniProfile } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTED_QUERIES = [
  'I want a teacher who can help me learn Machine Learning.',
  'I need a mentor for Python and Data Science.',
  'I want someone experienced in ML who can guide me with projects.',
  'Looking for a faculty guide for Deep Learning and Neural Networks.',
  'Need help with Python data structures and machine learning fundamentals.'
];

interface AIMentorSearchProps {
  initialQuery?: string;
  onSelectMentor?: (match: AIMentorMatch) => void;
}

export const AIMentorSearch: React.FC<AIMentorSearchProps> = ({
  initialQuery = 'I want a mentor for Machine Learning and Python',
  onSelectMentor
}) => {
  const {
    currentUser,
    studentProfile,
    teachersList,
    alumniList,
    connections,
    sendConnectionRequest,
    executeAIMentorSearch,
    isAuthenticated,
    triggerAuthGate,
    addToast,
    setSelectedAlumni,
    setSelectedTeacher,
    setCurrentView
  } = useApp();

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<AIMentorMatch[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Execute initial search on mount
  useEffect(() => {
    handleSearch(initialQuery);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const results = await executeAIMentorSearch(searchQuery);
      setMatches(results);
      if (results.length > 0 && !expandedId) {
        setExpandedId(results[0].mentor.id);
      }
    } catch (err) {
      console.error('Search failed', err);
      addToast('Search failed. Please try a different query.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (match: AIMentorMatch) => {
    const targetId = match.mentor.id;
    const targetName = match.mentor.name;
    const targetRole = match.mentorType;
    if (!isAuthenticated) {
      triggerAuthGate(`connect with ${targetName}`);
      return;
    }

    sendConnectionRequest(targetId, {
      targetRole,
      matchPercentage: match.matchPercentage,
      matchedSkills: match.explanation.matchingSkills,
      matchReason: match.explanation.recommendationReason,
      note: `Connected via AI Mentor Search for query: "${query}"`
    });
  };

  const handleViewProfile = (match: AIMentorMatch) => {
    const targetId = match.mentor.id;
    if (match.mentorType === 'teacher') {
      const teacher = teachersList.find(t => t.id === targetId);
      if (teacher) {
        setSelectedTeacher(teacher);
        setCurrentView('explore');
      }
    } else {
      const alumni = alumniList.find(a => a.id === targetId);
      if (alumni) {
        setSelectedAlumni(alumni);
      }
    }
  };

  const bestMatch = matches[0];
  const otherMatches = matches.slice(1);

  return (
    <div className="w-full space-y-6">
      {/* ── AI Search Header Card ────────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl border border-blue-800/50 relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-black uppercase tracking-wider mb-3">
            <BrainCircuit className="w-3.5 h-3.5 text-blue-300" />
            <span>AI-Powered Teacher &amp; Mentor Matchmaking</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Tell us what you want to learn...
          </h2>
          <p className="text-xs sm:text-sm text-blue-200/90 mt-1.5 leading-relaxed">
            Our multi-signal matchmaking engine analyzes your skills, learning goals, and experience level against verified faculty and industry alumni to compute explainable compatibility scores.
          </p>

          {/* Search Input Bar */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="mt-6 flex flex-col sm:flex-row items-stretch gap-2.5 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-lg"
          >
            <div className="flex-1 flex items-center gap-3 px-3 py-1.5">
              <Search className="w-5 h-5 text-blue-300 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g. I want a teacher who can help me learn Machine Learning and Python..."
                className="w-full bg-transparent text-sm text-white placeholder-blue-200/60 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Match...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Matches</span>
                </>
              )}
            </button>
          </form>

          {/* Suggested Prompts */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-blue-300 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5" />
              Try prompt:
            </span>
            {SUGGESTED_QUERIES.map((sq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(sq);
                  handleSearch(sq);
                }}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-blue-100 border border-white/10 transition-colors text-left"
              >
                "{sq}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search Results Area ────────────────────────────────────────── */}
      {loading ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto animate-pulse">
            <BrainCircuit className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            Calculating Multi-Signal Match Percentages
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Cross-referencing your learning goals with faculty course syllabi, research papers, and alumni industry projects...
          </p>
        </div>
      ) : matches.length === 0 && hasSearched ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Info className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            No exact mentor match found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try broadening your natural language query or using topics like "Machine Learning", "Python", "Data Science", or "System Design".
          </p>
        </div>
      ) : matches.length > 0 ? (
        <div className="space-y-6">
          {/* Section: Best AI Match */}
          {bestMatch && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-black uppercase tracking-wider border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Best AI Match
                </span>
                <span className="text-xs text-slate-400">Highest compatibility with your goals</span>
              </div>

              <MentorMatchCard
                match={bestMatch}
                isBestMatch={true}
                isExpanded={expandedId === bestMatch.mentor.id}
                onToggleExpand={() => setExpandedId(expandedId === bestMatch.mentor.id ? null : bestMatch.mentor.id)}
                onConnect={() => handleConnect(bestMatch)}
                onViewProfile={() => handleViewProfile(bestMatch)}
                connections={connections}
                currentUserId={currentUser.id}
              />
            </div>
          )}

          {/* Section: Other AI Matches */}
          {otherMatches.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Other Matching Faculty &amp; Mentors ({otherMatches.length})
              </h3>
              <div className="space-y-4">
                {otherMatches.map(match => (
                  <MentorMatchCard
                    key={match.mentor.id}
                    match={match}
                    isBestMatch={false}
                    isExpanded={expandedId === match.mentor.id}
                    onToggleExpand={() => setExpandedId(expandedId === match.mentor.id ? null : match.mentor.id)}
                    onConnect={() => handleConnect(match)}
                    onViewProfile={() => handleViewProfile(match)}
                    connections={connections}
                    currentUserId={currentUser.id}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

// ── Individual Mentor Match Card with Dynamic Scoring & Checklist ───────────────
interface MentorMatchCardProps {
  match: AIMentorMatch;
  isBestMatch?: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onConnect: () => void;
  onViewProfile: () => void;
  connections: any[];
  currentUserId: string;
}

const MentorMatchCard: React.FC<MentorMatchCardProps> = ({
  match,
  isBestMatch,
  isExpanded,
  onToggleExpand,
  onConnect,
  onViewProfile,
  connections,
  currentUserId
}) => {
  const mentor = match.mentor;
  const isTeacher = match.mentorType === 'teacher';
  const targetId = mentor.id;
  const targetName = mentor.name;
  const targetAvatar = mentor.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';
  const targetRole = match.mentorType;
  const targetTitle = isTeacher
    ? (mentor as TeacherProfile).designation || 'Faculty Member'
    : (mentor as AlumniProfile).jobTitle || (mentor as AlumniProfile).company || 'Alumni Mentor';
  const targetInstitution = mentor.university || "Tula's Institute";
  const experienceYears = isTeacher ? (mentor as TeacherProfile).experienceYears || 5 : 4;
  const targetSkills = mentor.skills || [];
  const recommendedReason = match.explanation.recommendationReason || match.explanation.summary;
  const matchExplanation = match.explanation.summary;
  const matchedSkills = match.explanation.matchingSkills || [];
  const unmatchedSkills = match.explanation.missingSkills || [];
  const targetExpertise: string[] = (mentor as any).expertise || mentor.skills.slice(0, 3);
  const targetSubjects: string[] = (mentor as any).subjectsCanTeach || (mentor as any).mentorshipTopics || [];

  const existingConn = connections.find(
    c => c.studentId === currentUserId && (c.alumniId === targetId || c.targetId === targetId)
  );

  const isConnected = existingConn?.status === 'accepted';
  const isPending = existingConn?.status === 'pending';

  // Determine badge color from match percentage
  const pct = match.matchPercentage;
  const badgeColor =
    pct >= 85
      ? 'bg-emerald-500 text-white'
      : pct >= 70
      ? 'bg-blue-600 text-white'
      : 'bg-amber-500 text-white';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl border transition-all overflow-hidden ${
        isBestMatch
          ? 'bg-gradient-to-r from-blue-50/40 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20 border-blue-300 dark:border-blue-800 shadow-md ring-1 ring-blue-500/20'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={targetAvatar}
                alt={targetName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
              />
              <span className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider text-white ${
                targetRole === 'teacher' ? 'bg-amber-600' : 'bg-indigo-600'
              }`}>
                {targetRole === 'teacher' ? 'FACULTY' : 'ALUMNI'}
              </span>
            </div>

            {/* Basic Info */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {targetName}
                </h4>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-900">
                  <ShieldCheck className="w-3 h-3 text-teal-600" />
                  Verified
                </span>
              </div>

              <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mt-0.5">
                {targetTitle}
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  {targetInstitution}
                </span>
                <span>·</span>
                <span>{experienceYears} Years Exp.</span>
              </div>

              {/* Top matching tags */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {targetSkills.slice(0, 4).map((skill: string) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Match Percentage & CTA */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
            <div className="text-right">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                AI Match Score
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`px-3 py-1 rounded-xl text-sm font-black shadow-sm ${badgeColor}`}>
                  {match.matchPercentage}% Match
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onViewProfile}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                View Profile
              </button>

              <button
                type="button"
                onClick={onConnect}
                disabled={isConnected || isPending}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                  isConnected
                    ? 'bg-emerald-600 text-white cursor-default'
                    : isPending
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-default'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isConnected ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Connected</span>
                  </>
                ) : isPending ? (
                  <>
                    <Clock className="w-3.5 h-3.5" />
                    <span>Request Pending</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Short Highlight Reason */}
        <div className="mt-4 p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
          <p className="text-xs text-blue-900 dark:text-blue-200 font-semibold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>"{recommendedReason}"</span>
          </p>

          <button
            type="button"
            onClick={onToggleExpand}
            className="text-[11px] font-extrabold text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0 ml-3"
          >
            <span>{isExpanded ? 'Hide Details' : 'Why this matches'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* ── Expandable Explainable AI Match Analysis ─────────────────── */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4"
            >
              {/* Detailed Match Reason */}
              <div>
                <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Why This is a Good Match
                </h5>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {matchExplanation}
                </p>
              </div>

              {/* Explainable Criteria Checklist */}
              <div>
                <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Transparent Signal Checklist
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {matchedSkills.map((skill: string) => (
                    <div
                      key={skill}
                      className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200 font-bold"
                    >
                      <span className="truncate">{skill}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                    </div>
                  ))}

                  {unmatchedSkills.slice(0, 3).map((skill: string) => (
                    <div
                      key={skill}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                    >
                      <span className="truncate">{skill}</span>
                      <XCircle className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Shared Interests & Expertise */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                    Relevant Expertise
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {targetExpertise.map((e: string) => (
                      <span key={e} className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-200">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                    Subjects / Topics Available
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {targetSubjects.map((s: string) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

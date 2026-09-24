import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  Building2,
  MapPin,
  GraduationCap,
  Calendar,
  Briefcase,
  Star,
  Sparkles,
  UserPlus,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  Award,
  Clock,
  Lock,
  ArrowRight,
  FileCheck
} from 'lucide-react';
import { AlumniProfile } from '../../types';
import { BackButton } from '../common/BackButton';
import { AnimatePresence, motion } from 'framer-motion';

export const AlumniDetailModal: React.FC = () => {
  const {
    selectedAlumni,
    setSelectedAlumni,
    currentUser,
    isAuthenticated,
    connections,
    sendConnectionRequest,
    setMentorshipTarget,
    setCurrentView,
    setActiveChatRecipientId,
    triggerAuthGate,
    alumniList
  } = useApp();

  // Check connection status
  const existingConn = selectedAlumni ? connections.find(
    c => c.studentId === currentUser.id && c.alumniId === selectedAlumni.id
  ) : undefined;

  const handleConnectClick = () => {
    if (!selectedAlumni) return;
    if (!isAuthenticated) {
      triggerAuthGate(`connect with ${selectedAlumni.name}`);
      return;
    }
    sendConnectionRequest(selectedAlumni.id);
  };

  const handleMentorshipClick = () => {
    if (!selectedAlumni) return;
    if (!isAuthenticated) {
      triggerAuthGate(`request 1-on-1 mentorship with ${selectedAlumni.name}`);
      return;
    }
    setMentorshipTarget(selectedAlumni);
    setSelectedAlumni(null);
  };

  const handleStartChat = () => {
    if (!selectedAlumni) return;
    if (!isAuthenticated) {
      triggerAuthGate(`message ${selectedAlumni.name}`);
      return;
    }
    setActiveChatRecipientId(selectedAlumni.id);
    setSelectedAlumni(null);
    setCurrentView('chat');
  };

  // Requirement 7: What Alumni can help with
  const whatICanHelpWith = selectedAlumni?.mentorshipTopics || [
    'Machine Learning',
    'Resume Review',
    'Interview Preparation',
    'Career Guidance',
    'Internship Guidance'
  ];

  return (
    <AnimatePresence>
      {selectedAlumni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedAlumni(null)}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-slate-900 dark:text-slate-100 max-h-[92vh] overflow-y-auto z-10"
          >
            {/* Top Navigation Row: Back Button & Close */}
            <div className="flex items-center justify-between mb-4">
              <BackButton label="Back to Directory" onClick={() => setSelectedAlumni(null)} />
              <motion.button
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedAlumni(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <img
              src={selectedAlumni.avatar}
              alt={selectedAlumni.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
            />
            {selectedAlumni.verificationStatus === 'verified' && (
              <span className="absolute -bottom-1 -right-1 p-1 bg-teal-600 text-white rounded-full shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{selectedAlumni.name}</h2>
              {selectedAlumni.verificationStatus === 'verified' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  Verified Alumni
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                  Verification Pending
                </span>
              )}

              {selectedAlumni.availableForMentorship && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Available for Mentorship
                </span>
              )}
            </div>

            <p className="text-sm font-bold text-blue-700 dark:text-blue-400 mt-1">
              {selectedAlumni.jobTitle}
            </p>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <strong className="text-slate-800 dark:text-slate-200">{selectedAlumni.company}</strong>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedAlumni.location}</span>
              </div>
              <div className="flex items-center gap-1 text-amber-600 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{selectedAlumni.rating || 4.9}</span>
                <span className="text-slate-400 font-normal">({selectedAlumni.reviewsCount || 35} reviews)</span>
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-2 text-xs text-indigo-900 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/40 px-3 py-1 rounded-xl w-fit">
              <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{selectedAlumni.university} · Batch of {selectedAlumni.graduationYear}</span>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons Bar (Requirement 7: Primary CTA: Request Mentorship) */}
        <div className="flex flex-wrap items-center gap-2.5 py-4 border-b border-slate-100 dark:border-slate-800">
          {/* Primary CTA: Request Mentorship */}
          {selectedAlumni.availableForMentorship && (
            <button
              onClick={handleMentorshipClick}
              className="flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow"
            >
              <Sparkles className="w-4 h-4" />
              <span>Request Mentorship</span>
            </button>
          )}

          {/* Connection action */}
          {isAuthenticated && existingConn?.status === 'accepted' ? (
            <button
              onClick={handleStartChat}
              className="py-3 px-5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open Chat</span>
            </button>
          ) : isAuthenticated && existingConn?.status === 'pending' ? (
            <div className="py-3 px-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 font-semibold text-xs flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Connection Pending</span>
            </div>
          ) : (
            <button
              onClick={handleConnectClick}
              className="py-3 px-5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Connect</span>
            </button>
          )}

          <a
            href={selectedAlumni.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="LinkedIn Profile"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Details Section */}
        <div className="py-5 space-y-6">
          {/* Requirement 7: What I can help with */}
          <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <h3 className="text-xs font-bold text-teal-900 dark:text-teal-200 uppercase tracking-wider">
                What I Can Help With
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {whatICanHelpWith.map(topic => (
                <span
                  key={topic}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1.5 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">About</h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{selectedAlumni.bio}</p>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Core Competencies & Stack</h3>
            <div className="flex flex-wrap gap-2">
              {selectedAlumni.skills.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* PRIVACY GUARD: Detailed records only shown to Authenticated Users */}
          {!isAuthenticated ? (
            <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border-2 border-dashed border-blue-200 dark:border-blue-900 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center mx-auto">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Detailed Career Trajectory & Achievements Protected
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                Sign in with your verified university account to unlock full professional history, verified awards, and request 1-on-1 mentorship.
              </p>
              <button
                onClick={() => triggerAuthGate(`view ${selectedAlumni.name}'s complete achievements and records`)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Sign In to Unlock Full Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              {/* Career Trajectory Timeline */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Career Trajectory</h3>
                <div className="space-y-3 border-l-2 border-blue-200 dark:border-blue-900 pl-4 ml-2">
                  {selectedAlumni.careerTrajectory.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900"></div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{step.role} · <span className="text-blue-600 dark:text-blue-400">{step.company}</span></div>
                      <div className="text-[11px] text-slate-400 font-medium">{step.year}</div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Achievements */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Key Highlights & Honors</h3>
                <ul className="space-y-1.5">
                  {selectedAlumni.achievements.map((ach, idx) => (
                    <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <Award className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
      )}
    </AnimatePresence>
  );
};

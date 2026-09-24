import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Building2,
  Send,
  CheckCircle2,
  FileText
} from 'lucide-react';

import { BackButton } from '../common/BackButton';
import { AnimatePresence, motion } from 'framer-motion';

const HELP_CATEGORIES = [
  'Resume Review',
  'Career Guidance',
  'Interview Preparation',
  'Technical Skills',
  'Internship Guidance',
  'Higher Studies',
  'Placement Guidance',
  'Industry Advice',
  'Project Guidance'
];

export const MentorshipModal: React.FC = () => {
  const {
    mentorshipTarget,
    setMentorshipTarget,
    sendMentorshipRequest,
    studentProfile,
    addToast
  } = useApp();

  const [selectedArea, setSelectedArea] = useState('Resume Review');
  const [goal, setGoal] = useState('Resume feedback and job matching');
  const [resumeUrl, setResumeUrl] = useState('https://example.com/resumes/my_resume_v1.pdf');
  const [message, setMessage] = useState(
    `Hi ${mentorshipTarget?.name || 'Mentor'}, I'm a student at ${studentProfile.university}. Could you please review my resume and guide me on interview preparation for product engineering roles?`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorshipTarget) return;
    if (!message.trim()) {
      addToast('Please write a brief note for the mentor.', 'error');
      return;
    }
    sendMentorshipRequest(
      mentorshipTarget.id,
      goal,
      selectedArea,
      message,
      selectedArea === 'Resume Review' ? resumeUrl : undefined
    );
    setMentorshipTarget(null);
  };

  return (
    <AnimatePresence>
      {mentorshipTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMentorshipTarget(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-slate-900 dark:text-white max-h-[92vh] overflow-y-auto z-10"
          >
            <div className="flex items-center justify-between mb-4">
              <BackButton label="Back to Mentors" onClick={() => setMentorshipTarget(null)} />
              <motion.button
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMentorshipTarget(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

        {/* Mentor Info Header */}
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100 dark:border-slate-800 mb-6">
          <img
            src={mentorshipTarget.avatar}
            alt={mentorshipTarget.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-xs"
          />
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/40 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
              <Sparkles className="w-3 h-3 text-teal-600" />
              Verified Mentor Available
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {mentorshipTarget.name}
            </h2>
            <div className="text-xs text-blue-700 dark:text-blue-400 font-semibold">
              {mentorshipTarget.jobTitle} @ {mentorshipTarget.company} · {mentorshipTarget.experienceYears}y exp
            </div>
          </div>
        </div>

        {/* Request Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Requirement 4: What do you need help with? */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              What do you need help with?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {HELP_CATEGORIES.map(cat => {
                const isSelected = selectedArea === cat;
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => {
                      setSelectedArea(cat);
                      setGoal(`${cat} guidance for tier-1 tech careers`);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specific Goal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Your Specific Question / Career Goal
            </label>
            <input
              type="text"
              value={goal}
              onChange={e => setGoal(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 outline-none"
              placeholder="e.g. Preparing for ML Engineer roles at Microsoft, Need resume review..."
            />
          </div>

          {/* Optional Resume Link if Resume Review is selected */}
          {selectedArea === 'Resume Review' && (
            <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-200">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Your Resume Document Link (PDF / Drive)</span>
              </label>
              <input
                type="url"
                value={resumeUrl}
                onChange={e => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/your-resume.pdf"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                {mentorshipTarget.name} will review this document and provide structured recommendations.
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Message to Mentor
            </label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 outline-none leading-relaxed"
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl text-[11px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
            <span>
              Mentorship is 1-on-1 and verified. {mentorshipTarget.name} will receive your request and can provide written feedback or schedule a live video session.
            </span>
          </div>

          {/* Requirement 4: Send Mentorship Request */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send Mentorship Request</span>
          </motion.button>
        </form>
      </motion.div>
    </div>
      )}
    </AnimatePresence>
  );
};

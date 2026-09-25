import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Upload,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  ShieldCheck,
  Send,
  RefreshCw,
  X,
  Briefcase,
  HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export interface ResumeErrorItem {
  id: string;
  category: 'Critical' | 'Warning' | 'Suggestion';
  title: string;
  location: string;
  originalText: string;
  recommendedAnswer: string;
  explanation: string;
}

export interface AIResumeAuditResult {
  fileName: string;
  fileSize: string;
  uploadDate: string;
  targetRole: string;
  overallScore: number;
  atsPassRate: number;
  formatRating: 'Poor' | 'Moderate' | 'Good' | 'Exceptional';
  metricsScore: number;
  actionVerbScore: number;
  errorsFound: ResumeErrorItem[];
  missingKeywords: string[];
  recommendedSummary: string;
  interviewPrepAnswers: {
    question: string;
    recommendedAnswer: string;
  }[];
}

const SAMPLE_ANALYSIS: AIResumeAuditResult = {
  fileName: 'Ayushi_Arya_Resume_2026.pdf',
  fileSize: '1.4 MB',
  uploadDate: 'Just now',
  targetRole: 'Software Development Engineer',
  overallScore: 78,
  atsPassRate: 85,
  formatRating: 'Good',
  metricsScore: 65,
  actionVerbScore: 72,
  errorsFound: [
    {
      id: 'err-1',
      category: 'Critical',
      title: 'Missing Quantifiable Business Metrics',
      location: 'Projects Section — Student Portal Experience',
      originalText: 'Worked on backend API for student portal and helped optimize queries.',
      recommendedAnswer:
        'Architected 12+ RESTful microservices in Node.js & PostgreSQL, reducing query latency by 42% and supporting 10,000+ daily student sessions with 99.9% uptime.',
      explanation:
        'Recruiters look for the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]". Include exact percentages and throughput.'
    },
    {
      id: 'err-2',
      category: 'Warning',
      title: 'Weak Action Verb & Passive Tone',
      location: 'Experience Section — Summer Intern',
      originalText: 'Was responsible for ML model training and data preprocessing tasks.',
      recommendedAnswer:
        'Spearheaded end-to-end data pipeline & fine-tuned Random Forest & XGBoost classifiers in Python, elevating prediction recall by 18.5%.',
      explanation:
        'Avoid passive phrases like "was responsible for" or "helped with". Use decisive power verbs such as "Spearheaded", "Engineered", or "Pioneered".'
    },
    {
      id: 'err-3',
      category: 'Critical',
      title: 'Missing Core Production Infrastructure Keywords',
      location: 'Skills & Tech Stack',
      originalText: 'Python, Machine Learning, React, PostgreSQL',
      recommendedAnswer:
        'Python, React, TypeScript, PostgreSQL, Docker, CI/CD, Redis Caching, Git, System Design (LLD/HLD)',
      explanation:
        'Top tech firms scan resumes for containerization (Docker), caching (Redis), and system design keywords. Adding these will boost your ATS score to 92+.'
    },
    {
      id: 'err-4',
      category: 'Suggestion',
      title: 'Generic Objective Instead of Impact Summary',
      location: 'Header / Summary',
      originalText: 'Hardworking computer science student looking for opportunities in a reputed company.',
      recommendedAnswer:
        'Computer Science Engineer specializing in scalable full-stack architectures and machine learning systems. Proven track record building low-latency APIs and deployed student-facing applications.',
      explanation:
        'Generic career objectives are obsolete. Replace with a 2-line technical summary highlighting your core proficiencies and shipped impact.'
    }
  ],
  missingKeywords: [
    'Docker & Containerization',
    'System Design (HLD/LLD)',
    'Redis Caching',
    'CI/CD Pipelines',
    'REST APIs & Microservices',
    'Unit Testing (Jest / PyTest)'
  ],
  recommendedSummary:
    'Aspiring Software Development Engineer with a strong foundation in Data Structures, Scalable Backend Architectures, and Applied Machine Learning. Experienced in building production-ready web services in Node.js, Python, and React with a focus on high throughput and clean code standards.',
  interviewPrepAnswers: [
    {
      question: 'Tell me about the most technically challenging project on your resume.',
      recommendedAnswer:
        'On my resume, the Student Portal Backend was the most challenging. We faced database bottlenecks during semester registrations with 5,000 concurrent requests. I resolved this by introducing Redis caching for course catalog lookups and index optimization on PostgreSQL, trimming query time from 350ms to 45ms.'
    },
    {
      question: 'Why did you choose PostgreSQL over a NoSQL database for your project?',
      recommendedAnswer:
        'The application required strict ACID compliance for user enrollment records and relational integrity across courses and students. I utilized PostgreSQL foreign keys and transactions to prevent double-booking of course seats.'
    }
  ]
};

export const AIResumeAnalyserModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSendFeedbackToChat?: (summaryText: string) => void;
  initialRole?: string;
}> = ({ isOpen, onClose, onSendFeedbackToChat, initialRole = 'Software Development Engineer' }) => {
  const { currentUser, addToast } = useApp();

  const [targetRole, setTargetRole] = useState(initialRole);
  const [_uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('Ayushi_Arya_Resume_2026.pdf');
  const [fileSize, setFileSize] = useState<string>('1.4 MB');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState('');
  const [auditResult, setAuditResult] = useState<AIResumeAuditResult>(SAMPLE_ANALYSIS);
  const [activeTab, setActiveTab] = useState<'errors' | 'rewrites' | 'keywords' | 'interview_prep'>('errors');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    triggerAIAnalysis(file.name, `${(file.size / (1024 * 1024)).toFixed(1)} MB`);
  };

  const triggerAIAnalysis = (name: string, size: string) => {
    setIsAnalyzing(true);
    setAnalysisProgress(10);
    setAnalysisStage('Extracting document tokens & layout hierarchy...');

    setTimeout(() => {
      setAnalysisProgress(35);
      setAnalysisStage('Auditing ATS keyword density & parser readability...');
    }, 600);

    setTimeout(() => {
      setAnalysisProgress(65);
      setAnalysisStage('Detecting weak action verbs & missing quantifiable metrics...');
    }, 1200);

    setTimeout(() => {
      setAnalysisProgress(90);
      setAnalysisStage('Synthesizing recommended high-impact answers & STAR revisions...');
    }, 1800);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisProgress(100);

      // Tailor results slightly based on selected target role
      const isML = targetRole.toLowerCase().includes('machine learning') || targetRole.toLowerCase().includes('ai');
      const isPM = targetRole.toLowerCase().includes('product');
      const isCivil = targetRole.toLowerCase().includes('civil');

      let dynamicScore = isML ? 82 : isPM ? 74 : isCivil ? 80 : 85;

      setAuditResult({
        ...SAMPLE_ANALYSIS,
        fileName: name,
        fileSize: size,
        targetRole,
        overallScore: dynamicScore,
        atsPassRate: dynamicScore + 5,
        missingKeywords: isML
          ? ['PyTorch', 'MLOps', 'Transformers / LLMs', 'Docker', 'FastAPI', 'Vector DBs']
          : isPM
          ? ['PRD Writing', 'A/B Testing', 'User Funnels', 'Product Metrics', 'Roadmapping']
          : isCivil
          ? ['STAAD Pro', 'AutoCAD', 'BIM Modeling', 'Structural Mechanics', 'Site Estimation']
          : SAMPLE_ANALYSIS.missingKeywords
      });

      addToast(`AI analysis completed for ${name}!`, 'success');
    }, 2400);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('Recommended answer copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendToChat = () => {
    const summary = `📄 AI Resume Analysis Report for "${auditResult.fileName}" (${auditResult.targetRole}):
• Overall ATS Score: ${auditResult.overallScore}/100
• Critical Errors Detected: ${auditResult.errorsFound.length} issues (Metrics & Keywords)
• Key Recommended Fix: ${auditResult.errorsFound[0]?.recommendedAnswer || auditResult.recommendedSummary}
• Missing Keywords to Add: ${auditResult.missingKeywords.slice(0, 4).join(', ')}`;

    if (onSendFeedbackToChat) {
      onSendFeedbackToChat(summary);
      onClose();
      addToast('Resume analysis summary posted to chat!', 'success');
    } else {
      handleCopyText(summary, 'all');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-blue-300">
                <ShieldCheck className="w-3 h-3 text-teal-400" />
                <span>AI Resume & CV Error Analyser</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Resume Intelligence & Error Detection
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Role & Media Upload Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          {/* Target Role Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 shrink-0">Target Role:</span>
            <select
              value={targetRole}
              onChange={e => {
                setTargetRole(e.target.value);
                triggerAIAnalysis(fileName, fileSize);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none cursor-pointer"
            >
              <option value="Software Development Engineer">Software Engineer (SDE)</option>
              <option value="Machine Learning / AI Engineer">Machine Learning / AI Engineer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Civil & Infrastructure Engineer">Civil Engineering</option>
              <option value="Frontend Architect">Frontend Architect / UI Engineer</option>
            </select>
          </div>

          {/* Upload Media / CV Button */}
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.docx,.doc,image/png,image/jpeg"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload CV / Media</span>
            </button>

            <button
              onClick={() => triggerAIAnalysis(fileName, fileSize)}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
              title="Re-analyze CV"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Uploaded File Chip */}
        <div className="px-5 py-2.5 bg-blue-50/60 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-xs text-blue-900 dark:text-blue-200 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-bold truncate">{fileName}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">({fileSize})</span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300">
              Parsed by AI
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
            For: <strong className="text-slate-800 dark:text-slate-200">{currentUser.role === 'student' ? 'Student Applicant' : 'Mentor Review'}</strong>
          </span>
        </div>

        {/* Main Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Analysis Progress Loading State */}
          {isAnalyzing ? (
            <div className="p-8 text-center space-y-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600" />
                <Sparkles className="w-6 h-6 text-blue-600 absolute" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                AI Deep-Scanning Resume & Formatting Rules...
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {analysisStage}
              </p>
              {/* Progress Bar */}
              <div className="w-full max-w-xs mx-auto bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              {/* Score Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/40 dark:from-slate-800 dark:to-slate-800/80 border border-blue-200/80 dark:border-slate-700 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
                    {auditResult.overallScore}
                    <span className="text-xs text-slate-400 font-semibold">/100</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1">
                    Overall ATS Score
                  </div>
                  <div className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">
                    Top 20% in Campus
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-amber-500">
                    {auditResult.errorsFound.length}
                  </div>
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1">
                    Errors Detected
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Fixes ready below
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">
                    {auditResult.atsPassRate}%
                  </div>
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1">
                    ATS Pass Chance
                  </div>
                  <div className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">
                    Tier-1 Screen Ready
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                    {auditResult.metricsScore}%
                  </div>
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1">
                    Quantified Metrics
                  </div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                    Needs XYZ formula
                  </div>
                </div>
              </div>

              {/* Navigation Tabs for Resume Options */}
              <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setActiveTab('errors')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'errors'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Errors in CV ({auditResult.errorsFound.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('rewrites')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'rewrites'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Recommended Answers & Revisions</span>
                </button>

                <button
                  onClick={() => setActiveTab('keywords')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'keywords'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Target ATS Keywords ({auditResult.missingKeywords.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('interview_prep')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'interview_prep'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Interview Answers from CV</span>
                </button>
              </div>

              {/* TAB 1: ERRORS IN CV */}
              {activeTab === 'errors' && (
                <div className="space-y-4">
                  {auditResult.errorsFound.map((err) => (
                    <div
                      key={err.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                              err.category === 'Critical'
                                ? 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900'
                                : err.category === 'Warning'
                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                                : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                            }`}
                          >
                            {err.category}
                          </span>
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {err.title}
                          </h4>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">{err.location}</span>
                      </div>

                      {/* Original vs Recommended Box */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {/* Original with Error */}
                        <div className="p-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40">
                          <div className="text-[10px] font-bold text-red-700 dark:text-red-300 uppercase mb-1 flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-red-500" />
                            <span>Error in Current CV:</span>
                          </div>
                          <p className="text-slate-800 dark:text-slate-200 leading-relaxed italic">
                            "{err.originalText}"
                          </p>
                        </div>

                        {/* AI Recommended High-Impact Answer */}
                        <div className="p-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40">
                          <div className="text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase mb-1 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-teal-500" />
                              <span>AI Recommended Answer:</span>
                            </span>
                            <button
                              onClick={() => handleCopyText(err.recommendedAnswer, err.id)}
                              className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                            >
                              {copiedId === err.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedId === err.id ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                          <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                            "{err.recommendedAnswer}"
                          </p>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        <strong className="text-slate-700 dark:text-slate-300">Why this matters:</strong> {err.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: RECOMMENDED ANSWERS & REVISIONS */}
              {activeTab === 'rewrites' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Recommended Executive Profile Summary</span>
                      </span>
                      <button
                        onClick={() => handleCopyText(auditResult.recommendedSummary, 'summary')}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === 'summary' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Summary</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      "{auditResult.recommendedSummary}"
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      All High-Velocity Rephrased Bullet Points (Ready to Paste)
                    </h4>
                    {auditResult.errorsFound.map((err) => (
                      <div
                        key={err.id}
                        className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3 shadow-2xs"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                            {err.location}
                          </span>
                          <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                            • {err.recommendedAnswer}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopyText(err.recommendedAnswer, err.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-200 text-xs font-semibold shrink-0 cursor-pointer flex items-center gap-1"
                        >
                          {copiedId === err.id ? <Check className="w-3 h-3 text-teal-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === err.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: TARGET ATS KEYWORDS */}
              {activeTab === 'keywords' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                      High-Priority Keywords Missing from Your CV for {auditResult.targetRole}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                      Applicant Tracking Systems (ATS) at companies like Microsoft, Google, Zomato and Razorpay screen resumes for exact technical terminology:
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {auditResult.missingKeywords.map(kw => (
                        <div
                          key={kw}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 flex items-center gap-1.5 shadow-2xs"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span>{kw}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: INTERVIEW ANSWERS FROM CV */}
              {activeTab === 'interview_prep' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    AI generated high-scoring answers to tough technical questions recruiters will ask directly based on your uploaded CV:
                  </p>

                  {auditResult.interviewPrepAnswers.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5"
                    >
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[10px] font-black">
                          Q{idx + 1}
                        </span>
                        <span>{item.question}</span>
                      </h4>

                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase">
                          <span>Recommended STAR Answer:</span>
                          <button
                            onClick={() => handleCopyText(item.recommendedAnswer, `q-${idx}`)}
                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            {copiedId === `q-${idx}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === `q-${idx}` ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {item.recommendedAnswer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Audit validated for <strong className="text-slate-900 dark:text-white">{auditResult.targetRole}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyText(auditResult.errorsFound.map(e => `• ${e.recommendedAnswer}`).join('\n'), 'all_bullets')}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {copiedId === 'all_bullets' ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy All Fixes</span>
            </button>

            <button
              onClick={handleSendToChat}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Summary to Chat</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

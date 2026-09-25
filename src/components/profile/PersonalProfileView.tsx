import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Award,
  Sparkles,
  MapPin,
  Building2,
  FileText,
  ExternalLink,
  Edit3,
  LayoutDashboard,
  Lock,
  Target,
  Camera,
  FileCheck,
  Upload,
  Eye,
  Download,
  Trash2,
  RefreshCw,
  Globe,
  Lock as LockIcon,
  CheckCircle2,
  X,
  Compass,
  Clock,
  BookOpen,
  Image as ImageIcon
} from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';
import { AvatarUpload } from '../common/AvatarUpload';
import { ProfileEditModal } from './ProfileEditModal';
import { useScrollReveal } from '../../utils/animations';
import { ResumeDocument, ProfileMediaItem } from '../../types';

export const PersonalProfileView: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    setAuthModalOpen,
    setAuthModalMode,
    studentProfile,
    alumniList,
    teacherProfile,
    teachersList,
    setCurrentView,
    addToast,
    updateUserAvatar,
    uploadResumeDoc,
    deleteResumeDoc,
    resumeVisibility,
    setResumeVisibility
  } = useApp();

  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [viewingResume, setViewingResume] = useState<ResumeDocument | null>(null);
  const [selectedMediaForLightbox, setSelectedMediaForLightbox] = useState<ProfileMediaItem | null>(null);
  const resumeFileInputRef = useRef<HTMLInputElement>(null);
  const revealRef = useScrollReveal();

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
              Join Alumni Connect to build verified connections, showcase skills, upload your resume, and power the AI matchmaking network.
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

  const role = currentUser.role;
  const isTeacher = role === 'teacher';
  const isAlumni = role === 'alumni';
  const isStudent = role === 'student' || (!isTeacher && !isAlumni);

  const currentAlumni = alumniList.find(a => a.id === currentUser.id) || {
    ...alumniList[0],
    id: currentUser.id,
    name: currentUser.name || alumniList[0].name,
    email: currentUser.email || alumniList[0].email,
    avatar: currentUser.avatar || alumniList[0].avatar,
    university: currentUser.university || alumniList[0].university
  };

  const activeTeacher = teacherProfile?.id === currentUser.id
    ? teacherProfile
    : (teachersList?.find(t => t.id === currentUser.id) || teacherProfile);

  const displayName = isTeacher
    ? activeTeacher.name
    : isAlumni
    ? currentAlumni.name
    : (currentUser.name || studentProfile.name);

  const displayAvatar = isTeacher
    ? activeTeacher.avatar
    : isAlumni
    ? currentAlumni.avatar
    : (currentUser.avatar || studentProfile.avatar);

  const displayUni = isTeacher
    ? activeTeacher.university
    : isAlumni
    ? currentAlumni.university
    : (currentUser.university || studentProfile.university);

  // Active user's resume
  const activeResume: ResumeDocument | undefined = isTeacher
    ? activeTeacher.resumeDoc
    : isAlumni
    ? currentAlumni.resumeDoc
    : studentProfile.resumeDoc;

  // Active user's media gallery
  const activeMedia: ProfileMediaItem[] = isTeacher
    ? (activeTeacher.mediaGallery || [])
    : isAlumni
    ? (currentAlumni.mediaGallery || [])
    : (studentProfile.mediaGallery || []);

  // Handle Resume File Upload (PDF preferred)
  const handleResumeFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf') && !file.type.includes('word') && !file.name.toLowerCase().endsWith('.docx')) {
      addToast('Please upload a PDF document (preferred) or Word doc.', 'error');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      addToast('File size exceeds 15MB limit.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const sizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      uploadResumeDoc({
        fileName: file.name,
        fileUrl: dataUrl,
        fileType: file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOCX',
        fileSize: sizeFormatted
      }, resumeVisibility);
    };
    reader.readAsDataURL(file);
    if (resumeFileInputRef.current) resumeFileInputRef.current.value = '';
  };

  const handleDownloadResume = (doc: ResumeDocument) => {
    const link = document.createElement('a');
    link.href = doc.fileUrl;
    link.download = doc.fileName || 'Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`Downloading ${doc.fileName}...`, 'info');
  };

  return (
    <div ref={revealRef} className="w-full min-h-screen bg-[#F8F9FA] dark:bg-[#090D16] py-8 sm:py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb & Dashboard Link */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <button
              onClick={() => setCurrentView(isTeacher ? 'teacher-dashboard' : isAlumni ? 'alumni-dashboard' : 'student-dashboard')}
              className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold"
            >
              Dashboard
            </button>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-bold">My Personal Profile</span>
          </div>

          <button
            onClick={() => setCurrentView(isTeacher ? 'teacher-dashboard' : isAlumni ? 'alumni-dashboard' : 'student-dashboard')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Go to {isTeacher ? 'Teacher' : isAlumni ? 'Alumni' : 'Student'} Dashboard</span>
          </button>
        </div>

        {/* 1. PROFILE HEADER CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              {/* Avatar with edit pencil overlay */}
              <div className="relative group">
                <UserAvatar
                  name={displayName}
                  avatarUrl={displayAvatar}
                  size="2xl"
                  showBadge
                  badgeContent={<ShieldCheck className="w-3.5 h-3.5 text-white" />}
                />
                <button
                  onClick={() => setShowAvatarUpload(true)}
                  className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 cursor-pointer"
                  title="Change profile photo"
                  aria-label="Change profile photo"
                >
                  <Camera className="w-5 h-5 text-white drop-shadow" />
                </button>
                <button
                  onClick={() => setShowAvatarUpload(true)}
                  className="absolute -bottom-0.5 -right-0.5 w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900 transition-colors z-10 btn-press"
                  title="Edit photo"
                  aria-label="Edit profile photo"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    {displayName}
                  </h1>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    isTeacher
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900'
                      : isAlumni
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900'
                      : 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-900'
                  }`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {isTeacher ? 'Verified Faculty' : isAlumni ? 'Verified Alumni' : 'Verified Student'}
                  </span>
                </div>

                <p className="text-sm font-bold text-blue-700 dark:text-blue-400 mt-1">
                  {isTeacher
                    ? `${activeTeacher.designation} · ${activeTeacher.department}`
                    : isAlumni
                    ? `${currentAlumni.jobTitle} @ ${currentAlumni.company}`
                    : `${studentProfile.course}`}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                    <span>
                      {displayUni}
                      {!isTeacher && ` · Class of ${isAlumni ? currentAlumni.graduationYear : studentProfile.graduationYear}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isTeacher ? activeTeacher.location : isAlumni ? currentAlumni.location : studentProfile.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Actions & Completion */}
            <div className="flex flex-col gap-3 items-start md:items-end">
              <div className="bg-blue-50/70 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-100 dark:border-blue-900 flex flex-col items-center min-w-[160px]">
                <span className="text-2xl font-black text-blue-700 dark:text-blue-400">
                  {isTeacher ? '100%' : isAlumni ? '98%' : `${studentProfile.profileCompletion}%`}
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">Profile Completion</span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold mt-1">
                  Institutional ID Verified ✓
                </span>
              </div>
              <button
                onClick={() => setShowEditProfile(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-700 dark:hover:bg-white transition-all btn-press shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile &amp; Media
              </button>
            </div>
          </div>
        </div>

        {/* 2. DEDICATED RESUME SECTION (Requirement 3) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Resume &amp; Professional Dossier
                </h2>
                {activeResume ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Resume Uploaded
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    No Resume Uploaded
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Upload your official CV or resume. It helps mentors evaluate project readiness and powers the AI matchmaking engine.
              </p>
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Profile Visibility:</span>
              <button
                type="button"
                onClick={() => {
                  const nextVis = resumeVisibility === 'public' ? 'private' : 'public';
                  setResumeVisibility(nextVis);
                  addToast(`Resume visibility set to ${nextVis.toUpperCase()}`, 'info');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  resumeVisibility === 'public'
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {resumeVisibility === 'public' ? (
                  <>
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    Public to Mentors
                  </>
                ) : (
                  <>
                    <LockIcon className="w-3.5 h-3.5 text-slate-500" />
                    Private / Only Me
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="pt-6">
            <input
              type="file"
              ref={resumeFileInputRef}
              accept=".pdf,.docx,application/pdf"
              className="hidden"
              onChange={handleResumeFileSelect}
            />

            {activeResume ? (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {activeResume.fileName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200">
                        {activeResume.fileType || 'PDF'}
                      </span>
                      {activeResume.fileSize && <span>· {activeResume.fileSize}</span>}
                      <span>· Updated {activeResume.lastUpdated}</span>
                    </div>
                  </div>
                </div>

                {/* Professional Actions Bar */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => setViewingResume(activeResume)}
                    className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Resume
                  </button>
                  <button
                    onClick={() => handleDownloadResume(activeResume)}
                    className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                  <button
                    onClick={() => resumeFileInputRef.current?.click()}
                    className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Replace Resume
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to remove your resume?')) {
                        deleteResumeDoc();
                      }
                    }}
                    className="flex-none px-3 py-2 rounded-xl border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    title="Remove Resume"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Upload Your Resume / CV</h4>
                  <p className="text-xs text-slate-400 mt-0.5">PDF format preferred. Maximum file size 15MB.</p>
                </div>
                <button
                  type="button"
                  onClick={() => resumeFileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                >
                  <Upload className="w-4 h-4" />
                  Upload Resume
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3. PROFILE MEDIA & SHOWCASE (Requirement 2) */}
        {activeMedia.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-600" />
                  Profile Showcase &amp; Media Gallery ({activeMedia.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Verified projects, presentations, certificates, and animated visual assets
                </p>
              </div>
              <button
                onClick={() => setShowEditProfile(true)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Manage Media</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {activeMedia.map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedMediaForLightbox(item)}
                  className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer shadow-sm hover:shadow-md transition-all"
                >
                  <img
                    src={item.url}
                    alt={item.caption || 'Showcase'}
                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.isAnimated && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-purple-600/90 backdrop-blur-md text-[9px] font-black text-white uppercase">
                      GIF
                    </span>
                  )}
                  <div className="p-2.5 bg-white dark:bg-slate-900">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {item.caption || 'Project Showcase'}
                    </p>
                    <span className="text-[10px] text-slate-400">{item.uploadedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. 2-COLUMN DETAILS LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: About / Bio */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">About &amp; Overview</h2>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {isTeacher
                  ? activeTeacher.bio
                  : isAlumni
                  ? currentAlumni.bio
                  : studentProfile.bio}
              </p>
            </div>

            {/* Teacher Specific: Teaching & Research Areas */}
            {isTeacher && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Academic Focus &amp; Subjects Taught
                </h2>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-2">Subjects Can Teach / Guide:</span>
                  <div className="flex flex-wrap gap-2">
                    {(activeTeacher.subjectsCanTeach || []).map(subject => (
                      <span key={subject} className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-900 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-2">Research &amp; Technical Expertise:</span>
                  <div className="flex flex-wrap gap-2">
                    {(activeTeacher.expertise || []).map(exp => (
                      <span key={exp} className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-900 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-indigo-600" />
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
                {activeTeacher.officeHours && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span><strong>Student Office Hours:</strong> {activeTeacher.officeHours}</span>
                  </div>
                )}
              </div>
            )}

            {/* Student Specific: Learning Goals & Career Roadmap */}
            {isStudent && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-blue-600" />
                  Learning Topics &amp; Career Roadmap
                </h2>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-2">Current Learning Topics:</span>
                  <div className="flex flex-wrap gap-2">
                    {(studentProfile.learningGoals || ['Machine Learning', 'Python', 'System Architecture']).map(goal => (
                      <span key={goal} className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>

                {studentProfile.careerGoals && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Career Goal:</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                      {studentProfile.careerGoals}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Education Details */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Academic Credentials</h2>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {displayUni}
                  </h3>
                  <p className="text-xs text-blue-700 dark:text-blue-400 font-semibold">
                    {isTeacher
                      ? activeTeacher.department
                      : isAlumni
                      ? currentAlumni.degree
                      : studentProfile.course}
                  </p>
                  {!isTeacher && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Graduation Year: {isAlumni ? currentAlumni.graduationYear : studentProfile.graduationYear}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Featured Projects (Student & Alumni) */}
            {!isTeacher && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Featured Projects</h2>
                <div className="space-y-3">
                  {(isAlumni ? currentAlumni.projects || [] : studentProfile.projects || []).map(proj => (
                    <div key={proj.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {proj.name}
                        </h3>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                          >
                            <span>Repo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">{proj.description}</p>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {proj.techStack.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-semibold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column (1 col) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Skills & Technical Capabilities */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Skills &amp; Capabilities</h2>
              <div className="flex flex-wrap gap-2">
                {(isTeacher
                  ? activeTeacher.skills
                  : isAlumni
                  ? currentAlumni.skills
                  : studentProfile.skills || []
                ).map(skill => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Mentorship Areas */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                {isStudent ? 'Looking for Mentorship In' : 'Can Mentor Students In'}
              </h2>
              <div className="flex flex-wrap gap-2">
                {(isTeacher
                  ? activeTeacher.subjectsCanTeach || ['Machine Learning', 'Python', 'Data Science']
                  : isAlumni
                  ? currentAlumni.skills.slice(0, 4)
                  : studentProfile.preferredMentorshipAreas || ['Machine Learning', 'Project Guidance', 'Resume Review']
                ).map(item => (
                  <span
                    key={item}
                    className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-900 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-teal-600" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Action: Find AI Matches */}
            {isStudent && (
              <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white space-y-3 shadow-md">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider">
                  AI Matchmaking
                </span>
                <h3 className="text-base font-extrabold">Find Your Ideal Teacher / Mentor</h3>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Search by natural language: "I want a mentor for Machine Learning and Python" and get explainable match percentages.
                </p>
                <button
                  onClick={() => setCurrentView('mentors')}
                  className="w-full py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 shadow hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Launch AI Mentor Search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* In-App Resume Viewer Modal */}
      {viewingResume && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {viewingResume.fileName}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Uploaded document view · {viewingResume.fileType || 'PDF'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadResume(viewingResume)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
                <button
                  onClick={() => setViewingResume(null)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
              {viewingResume.fileUrl.startsWith('data:application/pdf') || viewingResume.fileUrl.startsWith('data:image') ? (
                <iframe
                  src={viewingResume.fileUrl}
                  title="Resume Viewer"
                  className="w-full h-[65vh] rounded-xl border border-slate-200 dark:border-slate-800"
                />
              ) : (
                <div className="text-center p-8 space-y-4 max-w-md">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto">
                    <FileCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {viewingResume.fileName}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Ready for download and verification. Verified against official university record format.
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadResume(viewingResume)}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 transition-all inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download File to View Full Document
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox for Profile Media */}
      {selectedMediaForLightbox && (
        <div
          className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedMediaForLightbox(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {selectedMediaForLightbox.caption || 'Showcase Media'}
              </span>
              <button
                onClick={() => setSelectedMediaForLightbox(null)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={selectedMediaForLightbox.url}
              alt="Lightbox"
              className="w-full max-h-[70vh] object-contain bg-black"
            />
          </div>
        </div>
      )}

      {/* Avatar Upload Modal */}
      {showAvatarUpload && (
        <AvatarUpload
          currentAvatar={displayAvatar}
          name={displayName}
          onSave={(url) => {
            updateUserAvatar(url);
            setShowAvatarUpload(false);
            addToast('Profile photo updated!', 'success');
          }}
          onClose={() => setShowAvatarUpload(false)}
        />
      )}

      {/* Profile Edit Modal */}
      {showEditProfile && (
        <ProfileEditModal
          onClose={() => setShowEditProfile(false)}
        />
      )}
    </div>
  );
};

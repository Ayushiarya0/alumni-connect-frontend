import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  GraduationCap,
  Briefcase,
  ShieldAlert,
  Mail,
  Lock,
  User,
  Building,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  BookOpen
} from 'lucide-react';
import { UNIVERSITIES } from '../../data/mockData';
import { AlumniConnectLogo } from '../common/AlumniConnectLogo';
import { AnimatePresence, motion } from 'framer-motion';

type AuthTab = 'login_student' | 'login_alumni' | 'login_teacher' | 'login_admin' | 'register';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    loginUser,
    registerUser,
    addToast
  } = useApp();

  // Active tab in dialog
  const [activeTab, setActiveTab] = useState<AuthTab>(
    authModalMode === 'signup' ? 'register' : 'login_student'
  );

  // Sync tab with external modal open mode
  React.useEffect(() => {
    if (authModalMode === 'signup') {
      setActiveTab('register');
    } else if (authModalMode === 'login' && activeTab === 'register') {
      setActiveTab('login_student');
    }
  }, [authModalMode]);

  // Form states - common
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState(UNIVERSITIES[0]?.name || "Tula's Institute");
  const [registerRole, setRegisterRole] = useState<'student' | 'alumni' | 'teacher'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Student-specific registration fields
  const [course, setCourse] = useState('B.Tech Computer Science');
  const [graduationYear, setGraduationYear] = useState<number>(2026);
  const [skills, setSkills] = useState('Python, Data Structures, React, SQL');

  // Alumni-specific registration fields
  const [degree, setDegree] = useState('B.Tech in Computer Science');
  const [currentCompany, setCurrentCompany] = useState('Google');
  const [designation, setDesignation] = useState('Senior Software Engineer');
  const [industry, setIndustry] = useState('Technology & Software');
  const [location, setLocation] = useState('Bangalore, India');

  // Teacher-specific registration fields
  const [department, setDepartment] = useState('Department of Computer Science & Engineering');
  const [teacherDesignation, setTeacherDesignation] = useState('Professor & Head of AI Laboratory');
  const [subjectsCanTeach, setSubjectsCanTeach] = useState('Machine Learning, Python, Data Science, Deep Learning');

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      addToast('Please enter your student email and password.', 'error');
      return;
    }
    const success = loginUser('student', email.trim(), password);
    if (success) {
      setAuthModalOpen(false);
      resetForm();
    }
  };

  const handleAlumniLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      addToast('Please enter your alumni email and password.', 'error');
      return;
    }
    const success = loginUser('alumni', email.trim(), password);
    if (success) {
      setAuthModalOpen(false);
      resetForm();
    }
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      addToast('Please enter your faculty email and password.', 'error');
      return;
    }
    const success = loginUser('teacher', email.trim(), password);
    if (success) {
      setAuthModalOpen(false);
      resetForm();
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      addToast('Please enter admin credentials.', 'error');
      return;
    }
    const success = loginUser('admin', email.trim(), password);
    if (success) {
      setAuthModalOpen(false);
      resetForm();
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      addToast('Please fill all required registration fields.', 'error');
      return;
    }
    if (password.length < 6) {
      addToast('Password must be at least 6 characters.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    if (registerRole === 'student') {
      registerUser({
        fullName: fullName.trim(),
        email: email.trim(),
        role: 'student',
        university: university.trim(),
        password,
        course: course.trim(),
        graduationYear: Number(graduationYear) || 2026,
        skills: skills.trim()
      });
    } else if (registerRole === 'teacher') {
      registerUser({
        fullName: fullName.trim(),
        email: email.trim(),
        role: 'teacher',
        university: university.trim(),
        password,
        department: department.trim(),
        designation: teacherDesignation.trim(),
        subjectsCanTeach: subjectsCanTeach.trim(),
        skills: skills.trim(),
        location: location.trim()
      });
    } else {
      registerUser({
        fullName: fullName.trim(),
        email: email.trim(),
        role: 'alumni',
        university: university.trim(),
        password,
        graduationYear: Number(graduationYear) || 2021,
        degree: degree.trim(),
        currentCompany: currentCompany.trim(),
        designation: designation.trim(),
        industry: industry.trim(),
        skills: skills.trim(),
        location: location.trim()
      });
    }

    setAuthModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      addToast('Please enter your email address to receive password reset instructions.', 'info');
      return;
    }
    addToast(`Password reset link sent to ${email.trim()}`, 'success');
  };

  return (
    <AnimatePresence>
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setAuthModalOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 text-slate-900 dark:text-slate-100 max-h-[92vh] overflow-y-auto z-10"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors z-10 cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Modal Branding Header */}
            <div className="text-center mb-5">
              <div className="inline-block mb-2">
                <AlumniConnectLogo size="md" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {activeTab === 'register'
                  ? 'Join the AlumniConnect Network'
                  : activeTab === 'login_admin'
                  ? 'University Admin Portal'
                  : 'Sign In to AlumniConnect'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                University-grade ecosystem connecting students, verified alumni, mentors and institutions.
              </p>
            </div>

            {/* Tab Selection */}
            <div className="grid grid-cols-5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1 mb-5 text-[10px] sm:text-xs font-bold border border-slate-200/80 dark:border-slate-700/80 gap-1 relative">
              <button
                type="button"
                onClick={() => setActiveTab('login_student')}
                className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                  activeTab === 'login_student'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Student</span>
                <span className="sm:hidden">Student</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('login_alumni')}
                className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                  activeTab === 'login_alumni'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Alumni</span>
                <span className="sm:hidden">Alum</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('login_teacher')}
                className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                  activeTab === 'login_teacher'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Faculty</span>
                <span className="sm:hidden">Faculty</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('login_admin')}
                className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                  activeTab === 'login_admin'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
                <span className="sm:hidden">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/50'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Up</span>
                <span className="sm:hidden">Join</span>
              </button>
            </div>

            {/* TAB 1: LOGIN AS STUDENT */}
            {activeTab === 'login_student' && (
              <form onSubmit={handleStudentLogin} className="space-y-4">
                <div className="p-3 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-blue-900 dark:text-blue-100">
                      Demo Student Access
                    </div>
                    <div className="text-[11px] text-blue-700/80 dark:text-blue-300/80">
                      ayushi.arya@tulas.edu.in (Pass: Student@2026)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('ayushi.arya@tulas.edu.in');
                      setPassword('Student@2026');
                    }}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Student Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="student@university.edu.in"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Login as Student</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* TAB 2: LOGIN AS ALUMNI */}
            {activeTab === 'login_alumni' && (
              <form onSubmit={handleAlumniLogin} className="space-y-4">
                <div className="p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-indigo-900 dark:text-indigo-100">
                      Demo Alumni Mentor Access
                    </div>
                    <div className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80">
                      priya.sharma@google.com (Pass: Alumni@2026)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('priya.sharma@google.com');
                      setPassword('Alumni@2026');
                    }}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Alumni Work Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="alumni@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Login as Alumni</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* TAB: LOGIN AS TEACHER / FACULTY */}
            {activeTab === 'login_teacher' && (
              <form onSubmit={handleTeacherLogin} className="space-y-4">
                <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-amber-900 dark:text-amber-100">
                      Verified Faculty Access
                    </div>
                    <div className="text-[11px] text-amber-700/80 dark:text-amber-300/80">
                      sunita.sen@iitr.ac.in (Pass: Teacher@2026)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('sunita.sen@iitr.ac.in');
                      setPassword('Teacher@2026');
                    }}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Faculty University Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="professor@iitr.ac.in"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-amber-600 dark:focus:border-amber-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-amber-600 dark:focus:border-amber-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-amber-600 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Login as Faculty / Teacher</span>
                </button>
              </form>
            )}

            {/* TAB 3: LOGIN AS ADMIN (Restricted Access) */}
            {activeTab === 'login_admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="p-3 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-900/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-purple-900 dark:text-purple-100">
                        Admin Central Authority
                      </div>
                      <div className="text-[11px] text-purple-700/80 dark:text-purple-300/80">
                        dean.alumni@alumniconnect.ac.in (Pass: Admin@2026)
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('dean.alumni@alumniconnect.ac.in');
                        setPassword('Admin@2026');
                      }}
                      className="shrink-0 px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      Auto-Fill
                    </button>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                    * Admin accounts are strictly pre-provisioned for institutional authorities. Public self-registration is disabled.
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Official Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="dean.alumni@alumniconnect.ac.in"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-600 dark:focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Admin Security Key / Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-600 dark:focus:border-purple-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Access Admin Control Center</span>
                </button>
              </form>
            )}

            {/* TAB 4: REGISTER (STUDENT OR ALUMNI) */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3">
                {/* Role Switcher */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Membership Role:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegisterRole('student')}
                      className={`p-2 rounded-xl border-2 flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                        registerRole === 'student'
                          ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Student</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegisterRole('alumni')}
                      className={`p-2 rounded-xl border-2 flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                        registerRole === 'alumni'
                          ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>Alumni</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegisterRole('teacher')}
                      className={`p-2 rounded-xl border-2 flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                        registerRole === 'teacher'
                          ? 'border-amber-600 bg-amber-50/80 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Faculty</span>
                    </button>
                  </div>
                </div>

                {/* Common: Name & University */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ayushi Arya"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      University / College *
                    </label>
                    <div className="relative">
                      <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={university}
                        onChange={e => setUniversity(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none cursor-pointer"
                      >
                        {UNIVERSITIES.map(u => (
                          <option key={u.id} value={u.name}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {registerRole === 'student' ? 'Institutional Email *' : 'Work Email *'}
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder={registerRole === 'student' ? 'student@university.edu.in' : 'alumni@company.com'}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Role Specific: STUDENT */}
                {registerRole === 'student' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Course / Major
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. B.Tech CSE"
                        value={course}
                        onChange={e => setCourse(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Graduation Year
                      </label>
                      <input
                        type="number"
                        placeholder="2026"
                        value={graduationYear}
                        onChange={e => setGraduationYear(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Skills (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="Python, React, Machine Learning, SQL"
                        value={skills}
                        onChange={e => setSkills(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Role Specific: ALUMNI */}
                {registerRole === 'alumni' && (
                  <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Degree Earned
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. B.Tech CSE"
                          value={degree}
                          onChange={e => setDegree(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Graduation Year
                        </label>
                        <input
                          type="number"
                          placeholder="2021"
                          value={graduationYear}
                          onChange={e => setGraduationYear(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Current Company
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Microsoft"
                          value={currentCompany}
                          onChange={e => setCurrentCompany(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Designation / Role
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Senior Software Engineer"
                          value={designation}
                          onChange={e => setDesignation(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Industry
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Software, Finance"
                          value={industry}
                          onChange={e => setIndustry(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Location (City, Country)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Bangalore, India"
                          value={location}
                          onChange={e => setLocation(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Domain Skills & Mentoring Topics
                      </label>
                      <input
                        type="text"
                        placeholder="System Design, Cloud, ML, Career Guidance"
                        value={skills}
                        onChange={e => setSkills(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Role Specific: TEACHER / FACULTY */}
                {registerRole === 'teacher' && (
                  <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Academic Department
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Computer Science & Engineering"
                          value={department}
                          onChange={e => setDepartment(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Academic Designation
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Professor & Head of Lab"
                          value={teacherDesignation}
                          onChange={e => setTeacherDesignation(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Subjects You Can Teach / Guide (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Machine Learning, Python, Data Science, Deep Learning"
                        value={subjectsCanTeach}
                        onChange={e => setSubjectsCanTeach(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Skills & Research Focus (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Machine Learning, PyTorch, Applied Statistics, NLP"
                        value={skills}
                        onChange={e => setSkills(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        placeholder="Min. 6 chars"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        placeholder="Repeat password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 mt-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Submit Registration & Send Verification Email</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab(registerRole === 'student' ? 'login_student' : 'login_alumni')}
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                  >
                    Log In
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

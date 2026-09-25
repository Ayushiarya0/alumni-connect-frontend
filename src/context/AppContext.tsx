import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserSession,
  AlumniProfile,
  TeacherProfile,
  StudentProfile,
  ConnectionRequest,
  MentorshipRequest,
  ChatMessage,
  NotificationItem,
  UserRole,
  AchievementItem,
  AlumniEvent,
  CareerOpportunity,
  StartupListing,
  FeedbackReport,
  University,
  StudentSkill,
  SkillProficiency,
  ResumeDocument,
  StudentAchievement,
  Certification,
  Project,
  ProfileMediaItem,
  AIMentorMatch
} from '../types';
import {
  ALUMNI_LIST,
  TEACHERS_LIST,
  CURRENT_STUDENT,
  INITIAL_CONNECTIONS,
  INITIAL_MENTORSHIPS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  ACHIEVEMENTS_LIST,
  ALUMNI_EVENTS,
  CAREER_OPPORTUNITIES,
  UNIVERSITIES,
  MOCK_PENDING_STUDENTS,
  MOCK_STARTUPS,
  MOCK_FEEDBACK_REPORTS
} from '../data/mockData';
import { matchTeachersAndMentorsAI } from '../utils/aiEngines';

export type AppView =
  | 'landing'
  | 'explore'
  | 'map'
  | 'mentors'
  | 'achievements'
  | 'student-dashboard'
  | 'alumni-dashboard'
  | 'teacher-dashboard'
  | 'admin-dashboard'
  | 'my-profile'
  | 'chat'
  | 'about';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentUser: UserSession;
  currentRole: UserRole;
  isAuthenticated: boolean;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  // Navigation stack & Back button system
  viewHistory: AppView[];
  navigate: (view: AppView) => void;
  goBack: () => void;
  canGoBack: boolean;
  // Role & Auth
  switchUserRole: (role: UserRole) => void;
  loginUser: (
    role: 'student' | 'alumni' | 'teacher' | 'admin',
    email: string,
    password?: string,
    name?: string,
    university?: string
  ) => boolean;
  registerUser: (details: {
    fullName: string;
    email: string;
    role: 'student' | 'alumni' | 'teacher';
    university: string;
    password?: string;
    course?: string;
    graduationYear?: number;
    skills?: string;
    degree?: string;
    currentCompany?: string;
    designation?: string;
    department?: string;
    subjectsCanTeach?: string;
    expertise?: string;
    learningGoals?: string;
    industry?: string;
    location?: string;
  }) => void;
  logout: () => void;
  // Email verification architecture
  isEmailVerified: boolean;
  verifyEmailToken: (token: string) => { success: boolean; message: string };
  resendVerificationEmail: (email?: string) => { success: boolean; message: string; devToken?: string };
  currentDevVerificationToken: string;
  // Profiles & Network Lists
  studentProfile: StudentProfile;
  alumniList: AlumniProfile[];
  teachersList: TeacherProfile[];
  teacherProfile: TeacherProfile;
  selectedTeacher: TeacherProfile | null;
  setSelectedTeacher: (teacher: TeacherProfile | null) => void;
  pendingStudents: StudentProfile[];
  approveStudentAccount: (studentId: string) => void;
  rejectStudentAccount: (studentId: string, reason?: string) => void;
  universities: University[];
  addUniversity: (uni: University) => void;
  connections: ConnectionRequest[];
  mentorships: MentorshipRequest[];
  messages: ChatMessage[];
  notifications: NotificationItem[];
  unreadNotifCount: number;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  // Auth Gate Modal (for logged-out visitors)
  authGateModalOpen: boolean;
  setAuthGateModalOpen: (open: boolean) => void;
  authGateAction: string;
  triggerAuthGate: (actionName: string) => void;
  // Auth & Modals
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  otpModalOpen: boolean;
  setOtpModalOpen: (open: boolean) => void;
  pendingEmailForOtp: string;
  setPendingEmailForOtp: (email: string) => void;
  // Get The App Modal
  getTheAppModalOpen: boolean;
  setGetTheAppModalOpen: (open: boolean) => void;
  GOOGLE_PLAY_STORE_APP_URL: string;
  // Profile Detail & Mentorship Modals
  selectedAlumni: AlumniProfile | null;
  setSelectedAlumni: (alumni: AlumniProfile | null) => void;
  mentorshipTarget: AlumniProfile | null;
  setMentorshipTarget: (alumni: AlumniProfile | null) => void;
  // Achievements & Events
  achievements: AchievementItem[];
  selectedAchievement: AchievementItem | null;
  setSelectedAchievement: (item: AchievementItem | null) => void;
  events: AlumniEvent[];
  opportunities: CareerOpportunity[];
  startups: StartupListing[];
  feedbackReports: FeedbackReport[];
  registerForEvent: (eventId: string) => void;
  postOpportunity: (opp: Omit<CareerOpportunity, 'id' | 'postedBy' | 'alumniId' | 'status'>) => void;
  moderateOpportunity: (id: string, status: 'approved' | 'rejected') => void;
  postStartup: (startup: Omit<StartupListing, 'id' | 'founderName' | 'founderId' | 'status' | 'createdAt'>) => void;
  moderateStartup: (id: string, status: 'approved' | 'rejected') => void;
  moderateEvent: (id: string, status: 'approved' | 'rejected') => void;
  resolveFeedback: (id: string) => void;
  // Student Skills, Certs, Achievements, Projects, Resume & CV Management
  studentSkills: StudentSkill[];
  addStudentSkill: (name: string, proficiency: SkillProficiency, category?: string) => void;
  removeStudentSkill: (name: string) => void;
  updateStudentSkill: (name: string, proficiency: SkillProficiency) => void;
  addStudentCertification: (cert: Omit<Certification, 'id'>) => void;
  deleteStudentCertification: (id: string) => void;
  addStudentAchievement: (ach: Omit<StudentAchievement, 'id'>) => void;
  deleteStudentAchievement: (id: string) => void;
  addStudentProject: (proj: Omit<Project, 'id'>) => void;
  deleteStudentProject: (id: string) => void;
  uploadResumeDoc: (doc: Omit<ResumeDocument, 'id' | 'lastUpdated'>, visibility?: 'public' | 'private') => void;
  deleteResumeDoc: () => void;
  resumeVisibility: 'public' | 'private';
  setResumeVisibility: (visibility: 'public' | 'private') => void;
  updateResumeLinks: (links: { googleDriveUrl?: string; linkedInUrl?: string; portfolioUrl?: string }) => void;
  // Media Section & Showcase
  uploadProfileMedia: (media: { url: string; caption?: string; type?: 'image' | 'gif'; isAnimated?: boolean }) => void;
  deleteProfileMedia: (id: string) => void;
  // Theme state
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  // Opening cinematic intro
  showIntro: boolean;
  setShowIntro: (show: boolean) => void;
  replayIntro: () => void;
  // Connection Actions
  sendConnectionRequest: (
    targetId: string,
    options?: {
      note?: string;
      targetRole?: 'alumni' | 'teacher';
      matchPercentage?: number;
      matchedSkills?: string[];
      matchReason?: string;
    }
  ) => void;
  acceptConnectionRequest: (requestId: string) => void;
  rejectConnectionRequest: (requestId: string) => void;
  // AI Matchmaking & Search
  executeAIMentorSearch: (query: string) => Promise<AIMentorMatch[]>;
  // Mentorship Actions (Student -> Requests Help -> Alumni/Mentor)
  sendMentorshipRequest: (
    alumniId: string,
    goal: string,
    areaOfHelp: string,
    message: string,
    resumeUrl?: string
  ) => void;
  requestResumeReview: (alumniId: string, note?: string) => void;
  acceptMentorshipRequest: (requestId: string) => void;
  declineMentorshipRequest: (requestId: string) => void;
  sendResumeFeedback: (requestId: string, feedback: string) => void;
  // Chat Actions & 5-minute Free Timer Session System
  activeChatRecipientId: string | null;
  setActiveChatRecipientId: (id: string | null) => void;
  sendMessage: (receiverId: string, content: string) => void;
  chatSessionTimeRemaining: number;
  isChatSessionLocked: boolean;
  chatSessionPrice: number;
  setChatSessionPrice: (price: number) => void;
  unlockChatSession: () => void;
  resetChatTimer: () => void;
  // Notifications
  markNotificationsAsRead: () => void;
  // Admin Verification Dossier Actions
  approveAlumniProfile: (alumniId: string) => void;
  rejectAlumniProfile: (alumniId: string) => void;
  requestMoreInfoAlumni: (alumniId: string, note: string) => void;
  toggleUserSuspension: (userId: string) => void;
  // Search state
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  // Avatar & Profile update
  updateUserAvatar: (avatarUrl: string, isAnimated?: boolean) => void;
  updateUserProfile: (data: Partial<{
    name: string; bio: string; university: string; course: string;
    graduationYear: string; currentCompany: string; designation: string;
    department: string; subjectsCanTeach: string; expertise: string;
    industry: string; skills: string; location: string; experience: string;
    interests: string; linkedinUrl: string; careerGoals: string;
    learningGoals: string; developmentGoals: string; experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    preferredMentorshipAreas: string; officeHours: string;
  }>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export interface RegisteredUserRecord {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'alumni' | 'teacher' | 'admin';
  university: string;
  avatar?: string;
  password?: string;
  course?: string;
  graduationYear?: number;
  skills?: string[];
  department?: string;
  designation?: string;
  subjectsCanTeach?: string[];
  expertise?: string[];
  learningGoals?: string[];
  developmentGoals?: string;
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  preferredMentorshipAreas?: string[];
  officeHours?: string;
  degree?: string;
  currentCompany?: string;
  industry?: string;
  location?: string;
  isEmailVerified: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  verificationToken?: string;
  createdAt: string;
}

export const STORAGE_REGISTERED_USERS = 'alumniconnect_registered_users';
export const STORAGE_ACTIVE_SESSION = 'alumniconnect_active_session';
export const STORAGE_USER_PROFILES = 'alumniconnect_profiles_db';

export function getAllStoredProfiles(): Record<string, any> {
  try {
    const raw = localStorage.getItem(STORAGE_USER_PROFILES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getStoredProfile(userId: string): any {
  const all = getAllStoredProfiles();
  return all[userId] || null;
}

export function saveStoredProfile(userId: string, profile: any) {
  try {
    const all = getAllStoredProfiles();
    all[userId] = profile;
    localStorage.setItem(STORAGE_USER_PROFILES, JSON.stringify(all));

    // Non-blocking sync to server API
    fetch(`/api/profile/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    }).catch(() => {});
  } catch (err) {
    console.error('Failed to save stored profile', err);
  }
}

export function deriveNameFromEmail(email: string): string {
  if (!email || !email.includes('@')) return 'Student Member';
  const prefix = email.split('@')[0];
  const parts = prefix
    .replace(/[0-9._\-+]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'Student Member';
  return parts
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');
}

export function getStoredUsers(): RegisteredUserRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_REGISTERED_USERS);
    if (!raw) {
      const initialUsers: RegisteredUserRecord[] = [
        {
          id: 'student-ayushi-arya',
          name: 'Ayushi Arya',
          email: 'ayushi.arya@tulas.edu.in',
          role: 'student',
          university: "Tula's Institute",
          course: 'B.Tech Computer Science and Engineering',
          graduationYear: 2026,
          skills: ['Python', 'Machine Learning', 'React', 'Data Structures', 'PostgreSQL'],
          avatar: '',
          password: 'Student@2026',
          isEmailVerified: true,
          approvalStatus: 'approved',
          createdAt: new Date().toISOString()
        },
        {
          id: 'alumni-priya',
          name: 'Priya Patel',
          email: 'priya.patel@microsoft.com',
          role: 'alumni',
          university: 'Indian Institute of Technology Roorkee',
          degree: 'B.Tech CSE (Batch of 2020)',
          currentCompany: 'Microsoft',
          designation: 'Senior Software Engineer',
          industry: 'Cloud & Distributed Systems',
          skills: ['Azure', 'Distributed Systems', 'C#', 'Go', 'System Design'],
          location: 'Bengaluru, Karnataka',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
          password: 'Alumni@2026',
          isEmailVerified: true,
          approvalStatus: 'approved',
          createdAt: new Date().toISOString()
        },
        {
          id: 'teacher-sunita-sen',
          name: 'Dr. Sunita Sen',
          email: 'sunita.sen@iitr.ac.in',
          role: 'teacher',
          university: 'Indian Institute of Technology Roorkee',
          department: 'Department of Computer Science & Engineering',
          designation: 'Professor & Head of AI Laboratory',
          skills: ['Machine Learning', 'Python', 'Deep Learning', 'PyTorch', 'Data Science', 'Statistics', 'NLP'],
          subjectsCanTeach: ['Machine Learning', 'Python', 'Data Science', 'Deep Learning'],
          expertise: ['Machine Learning', 'Deep Neural Networks', 'Applied Statistics'],
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
          password: 'Teacher@2026',
          isEmailVerified: true,
          approvalStatus: 'approved',
          createdAt: new Date().toISOString()
        },
        {
          id: 'admin-verma',
          name: 'Dr. Rajesh Verma',
          email: 'admin@alumniconnect.edu',
          role: 'admin',
          university: 'Central Platform Administration',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
          password: 'Admin@2026',
          isEmailVerified: true,
          approvalStatus: 'approved',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(STORAGE_REGISTERED_USERS, JSON.stringify(initialUsers));
      return initialUsers;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredUsers(users: RegisteredUserRecord[]) {
  try {
    localStorage.setItem(STORAGE_REGISTERED_USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save registered users', err);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state: persists in localStorage
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('alumniconnect_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  // Apply theme to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('alumniconnect_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Opening cinematic sequence (1.5 - 2s on initial entry, can be replayed)
  const [showIntro, setShowIntro] = useState<boolean>(true);

  const replayIntro = () => {
    setShowIntro(true);
  };

  // Public logged-out view by default or restored session
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_ACTIVE_SESSION);
      if (raw) {
        const s = JSON.parse(raw);
        return Boolean(s && s.isAuthenticated);
      }
    } catch {}
    return false;
  });

  const [currentView, setCurrentView] = useState<AppView>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_ACTIVE_SESSION);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && s.isAuthenticated) {
          if (s.role === 'student') return 'student-dashboard';
          if (s.role === 'alumni') return 'alumni-dashboard';
          if (s.role === 'teacher') return 'teacher-dashboard';
          if (s.role === 'admin') return 'admin-dashboard';
        }
      }
    } catch {}
    return 'landing';
  });

  const [viewHistory, setViewHistory] = useState<AppView[]>([currentView]);

  // Navigation with history tracking
  const navigate = (view: AppView) => {
    setViewHistory(prev => [...prev, view]);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (viewHistory.length > 1) {
      const nextHistory = [...viewHistory];
      nextHistory.pop(); // pop current view
      const prevView = nextHistory[nextHistory.length - 1];
      setViewHistory(nextHistory);
      setCurrentView(prevView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('landing');
    }
  };

  const canGoBack = viewHistory.length > 1 && currentView !== 'landing';

  // User session
  const [currentUser, setCurrentUser] = useState<UserSession>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_ACTIVE_SESSION);
      if (raw) {
        const s = JSON.parse(raw) as UserSession;
        if (s && s.isAuthenticated && s.name) {
          return s;
        }
      }
    } catch {}
    return {
      id: 'guest-visitor',
      name: 'Guest Visitor',
      email: '',
      role: 'guest',
      avatar: '',
      university: 'Public Network',
      verificationStatus: 'pending',
      isAuthenticated: false,
      isEmailVerified: false,
      approvalStatus: 'approved'
    };
  });

  // Student Profile state - syncs with authenticated student identity and custom edits
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_ACTIVE_SESSION);
      if (raw) {
        const s = JSON.parse(raw) as UserSession;
        if (s && s.isAuthenticated && s.role === 'student' && s.name) {
          const storedProf = getStoredProfile(s.id);
          if (storedProf) return storedProf;
          return {
            ...CURRENT_STUDENT,
            id: s.id,
            name: s.name,
            email: s.email,
            avatar: s.avatar || '',
            university: s.university || CURRENT_STUDENT.university,
            studentSkills: CURRENT_STUDENT.studentSkills || [],
            studentAchievements: CURRENT_STUDENT.studentAchievements || [],
            resumeDoc: CURRENT_STUDENT.resumeDoc,
            isEmailVerified: true,
            approvalStatus: 'approved'
          };
        }
      }
    } catch {}
    const stored = getStoredUsers();
    const regStudent = stored.find(u => u.role === 'student');
    if (regStudent) {
      const storedProf = getStoredProfile(regStudent.id);
      if (storedProf) return storedProf;
      return {
        ...CURRENT_STUDENT,
        id: regStudent.id,
        name: regStudent.name,
        email: regStudent.email,
        avatar: regStudent.avatar || '',
        university: regStudent.university,
        studentSkills: CURRENT_STUDENT.studentSkills || [],
        studentAchievements: CURRENT_STUDENT.studentAchievements || [],
        resumeDoc: CURRENT_STUDENT.resumeDoc,
        isEmailVerified: true,
        approvalStatus: 'approved'
      };
    }
    return CURRENT_STUDENT;
  });

  const [studentSkills, setStudentSkills] = useState<StudentSkill[]>(
    studentProfile.studentSkills || CURRENT_STUDENT.studentSkills || []
  );

  const [alumniList, setAlumniList] = useState<AlumniProfile[]>(() => {
    try {
      const raw = localStorage.getItem('alumniconnect_alumni_list');
      if (raw) return JSON.parse(raw);
    } catch {}
    return ALUMNI_LIST;
  });

  // Teachers State & Profiles
  const [teachersList, setTeachersList] = useState<TeacherProfile[]>(() => {
    try {
      const raw = localStorage.getItem('alumniconnect_teachers_list');
      if (raw) return JSON.parse(raw);
    } catch {}
    return TEACHERS_LIST;
  });

  const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile | null>(null);

  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_ACTIVE_SESSION);
      if (raw) {
        const s = JSON.parse(raw) as UserSession;
        if (s && s.isAuthenticated && s.role === 'teacher' && s.name) {
          const stored = getStoredProfile(s.id);
          if (stored) return stored;
          return {
            ...TEACHERS_LIST[0],
            id: s.id,
            name: s.name,
            email: s.email,
            avatar: s.avatar || TEACHERS_LIST[0].avatar,
            university: s.university || TEACHERS_LIST[0].university
          };
        }
      }
    } catch {}
    return TEACHERS_LIST[0];
  });

  const [resumeVisibility, setResumeVisibility] = useState<'public' | 'private'>(() => {
    return (studentProfile.resumeVisibility || 'public') as 'public' | 'private';
  });
  const [pendingStudents, setPendingStudents] = useState<StudentProfile[]>(MOCK_PENDING_STUDENTS);
  const [universities, setUniversities] = useState<University[]>(UNIVERSITIES);
  const [startups, setStartups] = useState<StartupListing[]>(MOCK_STARTUPS);
  const [feedbackReports, setFeedbackReports] = useState<FeedbackReport[]>(MOCK_FEEDBACK_REPORTS);

  const [connections, setConnections] = useState<ConnectionRequest[]>(() => {
    const activeName = studentProfile.name || CURRENT_STUDENT.name;
    const activeUni = studentProfile.university || CURRENT_STUDENT.university;
    const activeId = studentProfile.id || CURRENT_STUDENT.id;
    return INITIAL_CONNECTIONS.map(c =>
      c.studentId === 'student-current'
        ? { ...c, studentId: activeId, studentName: activeName, studentUniversity: activeUni }
        : c
    );
  });
  const [mentorships, setMentorships] = useState<MentorshipRequest[]>(() => {
    const activeName = studentProfile.name || CURRENT_STUDENT.name;
    const activeUni = studentProfile.university || CURRENT_STUDENT.university;
    const activeId = studentProfile.id || CURRENT_STUDENT.id;
    return INITIAL_MENTORSHIPS.map(m =>
      m.studentId === 'student-current'
        ? { ...m, studentId: activeId, studentName: activeName, studentUniversity: activeUni }
        : m
    );
  });
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Achievements & Events
  const [achievements, setAchievements] = useState<AchievementItem[]>(ACHIEVEMENTS_LIST);
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementItem | null>(null);
  const [events, setEvents] = useState<AlumniEvent[]>(ALUMNI_EVENTS);
  const [opportunities, setOpportunities] = useState<CareerOpportunity[]>(CAREER_OPPORTUNITIES);

  // Email Verification State
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(() => {
    return Boolean(currentUser.isEmailVerified);
  });
  const [currentDevVerificationToken, setCurrentDevVerificationToken] = useState<string>('482910');

  // Modals & UI States
  const [authGateModalOpen, setAuthGateModalOpen] = useState(false);
  const [authGateAction, setAuthGateAction] = useState('connect with verified alumni');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [pendingEmailForOtp, setPendingEmailForOtp] = useState('');
  const [getTheAppModalOpen, setGetTheAppModalOpen] = useState(false);
  const GOOGLE_PLAY_STORE_APP_URL = 'https://play.google.com/store/apps/details?id=com.alumniconnect.app';

  const [selectedAlumni, setSelectedAlumni] = useState<AlumniProfile | null>(null);
  const [mentorshipTarget, setMentorshipTarget] = useState<AlumniProfile | null>(null);
  const [activeChatRecipientId, setActiveChatRecipientId] = useState<string | null>('alumni-rahul-sharma');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Chat 5-minute Free Conversation Countdown System
  const [chatSessionTimeRemaining, setChatSessionTimeRemaining] = useState<number>(300);
  const [isChatSessionLocked, setIsChatSessionLocked] = useState<boolean>(false);
  const [chatSessionPrice, setChatSessionPrice] = useState<number>(20);

  useEffect(() => {
    if (currentView !== 'chat' || !isAuthenticated) return;
    if (isChatSessionLocked) return;

    const timer = setInterval(() => {
      setChatSessionTimeRemaining(prev => {
        if (prev <= 1) {
          setIsChatSessionLocked(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentView, isAuthenticated, isChatSessionLocked]);

  const unlockChatSession = () => {
    setChatSessionTimeRemaining(300);
    setIsChatSessionLocked(false);
    addToast('Payment verified! Additional 5-minute mentorship session unlocked.', 'success');
  };

  const resetChatTimer = () => {
    setChatSessionTimeRemaining(300);
    setIsChatSessionLocked(false);
  };

  // Toast system
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const triggerAuthGate = (actionName: string) => {
    setAuthGateAction(actionName);
    setAuthGateModalOpen(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_ACTIVE_SESSION);
    } catch {}
    setCurrentUser({
      id: 'guest-visitor',
      name: 'Guest Visitor',
      email: '',
      role: 'guest',
      avatar: '',
      university: 'Public Network',
      verificationStatus: 'pending',
      isAuthenticated: false,
      isEmailVerified: false,
      approvalStatus: 'approved'
    });
    setCurrentView('landing');
    setViewHistory(['landing']);
    addToast('You have logged out. Now browsing as Public Guest.', 'info');
  };

  // Email verification implementation
  const verifyEmailToken = (token: string): { success: boolean; message: string } => {
    const cleanToken = token.trim();
    if (!cleanToken) {
      return { success: false, message: 'Please enter verification token.' };
    }
    if (cleanToken !== '482910' && cleanToken !== currentDevVerificationToken) {
      return { success: false, message: 'Invalid or expired verification token.' };
    }

    const storedUsers = getStoredUsers();
    const idx = storedUsers.findIndex(
      u => u.email.toLowerCase() === pendingEmailForOtp.toLowerCase()
    );

    if (idx !== -1) {
      storedUsers[idx].isEmailVerified = true;
      saveStoredUsers(storedUsers);
      const u = storedUsers[idx];

      setIsEmailVerified(true);
      setOtpModalOpen(false);
      confetti({ particleCount: 80, spread: 60 });
      addToast('Email verified successfully! Full platform access granted.', 'success');

      // Complete login
      loginUser(u.role as any, u.email, u.password, u.name, u.university);
      return { success: true, message: 'Email verified successfully!' };
    }

    setIsEmailVerified(true);
    setOtpModalOpen(false);
    confetti({ particleCount: 80, spread: 60 });
    addToast('Email verified successfully!', 'success');
    return { success: true, message: 'Email verified successfully!' };
  };

  const resendVerificationEmail = (email?: string) => {
    const targetEmail = email || pendingEmailForOtp || currentUser.email || 'your email';
    setCurrentDevVerificationToken('482910');
    addToast(`Verification email re-sent to ${targetEmail}. (Dev Code: 482910)`, 'info');
    return { success: true, message: 'Verification email sent.', devToken: '482910' };
  };

  // Real Authentication Login
  const loginUser = (
    role: 'student' | 'alumni' | 'teacher' | 'admin',
    email: string,
    password?: string,
    name?: string,
    university?: string
  ): boolean => {
    const cleanEmail = email.trim().toLowerCase();

    // Check for Admin clearance
    if (role === 'admin' || cleanEmail === 'admin@alumniconnect.edu') {
      if (password && password !== 'Admin@2026') {
        addToast('Invalid email or password.', 'error');
        return false;
      }
      switchUserRole('admin');
      return true;
    }

    const storedUsers = getStoredUsers();
    let existingUser = storedUsers.find(u => u.email.toLowerCase() === cleanEmail);

    // Validate password if user exists and has one
    if (existingUser && password && existingUser.password && existingUser.password !== password) {
      addToast('Invalid email or password.', 'error');
      return false;
    }

    // Check email verification status
    if (existingUser && existingUser.isEmailVerified === false) {
      addToast('Please verify your email before continuing.', 'error');
      setPendingEmailForOtp(cleanEmail);
      setOtpModalOpen(true);
      return false;
    }

    let resolvedName = name?.trim() || existingUser?.name || deriveNameFromEmail(cleanEmail);
    let resolvedUniversity =
      university?.trim() ||
      existingUser?.university ||
      (role === 'student' ? "Tula's Institute" : role === 'teacher' ? 'Indian Institute of Technology Roorkee' : 'IIT Roorkee');
    let resolvedAvatar = existingUser?.avatar || '';

    if (!existingUser) {
      existingUser = {
        id: `${role}-${Date.now()}`,
        name: resolvedName,
        email: cleanEmail,
        role: role,
        university: resolvedUniversity,
        avatar: resolvedAvatar,
        password: password,
        isEmailVerified: true,
        approvalStatus: 'approved',
        createdAt: new Date().toISOString()
      };
      saveStoredUsers([existingUser, ...storedUsers]);
    }

    const userId = existingUser.id;

    const newSession: UserSession = {
      id: userId,
      name: resolvedName,
      email: cleanEmail,
      role: role,
      avatar: resolvedAvatar,
      university: resolvedUniversity,
      verificationStatus: 'verified',
      isAuthenticated: true,
      isEmailVerified: true,
      approvalStatus: existingUser.approvalStatus || 'approved'
    };

    setCurrentUser(newSession);
    setIsAuthenticated(true);
    setIsEmailVerified(true);

    try {
      localStorage.setItem(STORAGE_ACTIVE_SESSION, JSON.stringify(newSession));
    } catch (e) {
      console.error(e);
    }

    // Load or initialize personal profile from persistent storage
    const savedProf = getStoredProfile(userId);

    if (role === 'student') {
      const studentData: StudentProfile = savedProf || {
        ...CURRENT_STUDENT,
        id: userId,
        name: resolvedName,
        email: cleanEmail,
        avatar: resolvedAvatar,
        university: resolvedUniversity,
        course: existingUser.course || CURRENT_STUDENT.course,
        skills: existingUser.skills || CURRENT_STUDENT.skills,
        learningGoals: existingUser.learningGoals || ['Machine Learning', 'Python', 'Data Science'],
        experienceLevel: existingUser.experienceLevel || 'Intermediate',
        preferredMentorshipAreas: existingUser.preferredMentorshipAreas || ['Machine Learning', 'Python'],
        verificationStatus: 'verified',
        isEmailVerified: true,
        approvalStatus: 'approved'
      };
      setStudentProfile(studentData);
      saveStoredProfile(userId, studentData);

      setConnections(prev =>
        prev.map(c =>
          c.studentId === 'student-current' || c.studentId === userId
            ? {
                ...c,
                studentId: userId,
                studentName: resolvedName,
                studentAvatar: resolvedAvatar,
                studentUniversity: resolvedUniversity
              }
            : c
        )
      );

      setMentorships(prev =>
        prev.map(m =>
          m.studentId === 'student-current' || m.studentId === userId
            ? {
                ...m,
                studentId: userId,
                studentName: resolvedName,
                studentAvatar: resolvedAvatar,
                studentUniversity: resolvedUniversity
              }
            : m
        )
      );

      setActiveChatRecipientId('alumni-rahul-sharma');
      navigate('student-dashboard');
      addToast(`Welcome back, ${resolvedName}!`, 'success');
      return true;
    } else if (role === 'teacher') {
      const teacherData: TeacherProfile = savedProf || {
        ...TEACHERS_LIST[0],
        id: userId,
        name: resolvedName,
        email: cleanEmail,
        avatar: resolvedAvatar || TEACHERS_LIST[0].avatar,
        university: resolvedUniversity,
        department: existingUser.department || 'Department of Computer Science & Engineering',
        designation: existingUser.designation || 'Professor & Head of AI Laboratory',
        skills: existingUser.skills || ['Machine Learning', 'Python', 'Deep Learning', 'PyTorch', 'Data Science'],
        subjectsCanTeach: existingUser.subjectsCanTeach || ['Machine Learning', 'Python', 'Data Science', 'Deep Learning'],
        expertise: existingUser.expertise || ['Machine Learning', 'Deep Neural Networks', 'Computer Vision'],
        mentorshipTopics: ['Machine Learning Foundations', 'Python for Data Science', 'Research Project Guidance'],
        experienceYears: existingUser.experienceLevel === 'Advanced' ? 12 : 8,
        bio: `Faculty member at ${resolvedUniversity}. Dedicated to guiding students in advanced machine learning, algorithmic thinking, and industry projects.`,
        location: 'India',
        verificationStatus: 'verified',
        availableForMentorship: true,
        registrationDate: new Date().toISOString().split('T')[0]
      };
      setTeacherProfile(teacherData);
      saveStoredProfile(userId, teacherData);

      setTeachersList(prev => {
        const exists = prev.find(t => t.id === userId);
        if (exists) {
          return prev.map(t => t.id === userId ? { ...t, ...teacherData } : t);
        }
        return [teacherData, ...prev];
      });

      setActiveChatRecipientId('student-ayushi-arya');
      navigate('teacher-dashboard');
      addToast(`Welcome to Teacher Portal, ${resolvedName}!`, 'success');
      return true;
    } else {
      // Alumni
      const alumniData: AlumniProfile = savedProf || {
        ...ALUMNI_LIST[0],
        id: userId,
        name: resolvedName,
        email: cleanEmail,
        avatar: resolvedAvatar || ALUMNI_LIST[0].avatar,
        university: resolvedUniversity,
        company: existingUser.currentCompany || 'Microsoft',
        jobTitle: existingUser.designation || 'Senior Software Engineer',
        skills: existingUser.skills || ['Azure', 'Distributed Systems', 'Python', 'System Design'],
        subjectsCanTeach: existingUser.subjectsCanTeach || ['System Design', 'Cloud Architecture', 'Python'],
        verificationStatus: 'verified',
        availableForMentorship: true
      };
      saveStoredProfile(userId, alumniData);

      setAlumniList(prev => {
        const exists = prev.find(a => a.id === userId);
        if (exists) {
          return prev.map(a => a.id === userId ? { ...a, ...alumniData } : a);
        }
        return [alumniData, ...prev];
      });

      setActiveChatRecipientId('student-ayushi');
      navigate('alumni-dashboard');
      addToast(`Welcome back, ${resolvedName}!`, 'success');
      return true;
    }
  };

  // Real registration with student, alumni & teacher fields
  const registerUser = (details: {
    fullName: string;
    email: string;
    role: 'student' | 'alumni' | 'teacher';
    university: string;
    password?: string;
    course?: string;
    graduationYear?: number;
    skills?: string;
    degree?: string;
    currentCompany?: string;
    designation?: string;
    department?: string;
    subjectsCanTeach?: string;
    expertise?: string;
    learningGoals?: string;
    industry?: string;
    location?: string;
  }) => {
    const cleanEmail = details.email.trim().toLowerCase();
    const cleanName = details.fullName.trim();
    const cleanUni = details.university.trim();
    const skillsList = details.skills ? details.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    const subjectsList = details.subjectsCanTeach ? details.subjectsCanTeach.split(',').map(s => s.trim()).filter(Boolean) : [];
    const expertiseList = details.expertise ? details.expertise.split(',').map(s => s.trim()).filter(Boolean) : [];
    const learningList = details.learningGoals ? details.learningGoals.split(',').map(s => s.trim()).filter(Boolean) : ['Machine Learning', 'Python'];

    const storedUsers = getStoredUsers().filter(u => u.email.toLowerCase() !== cleanEmail);
    const newUser: RegisteredUserRecord = {
      id: `${details.role}-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      role: details.role,
      university: cleanUni,
      avatar: '',
      password: details.password,
      course: details.course,
      graduationYear: details.graduationYear,
      skills: skillsList,
      degree: details.degree || details.course,
      currentCompany: details.currentCompany,
      designation: details.designation,
      department: details.department || 'Computer Science',
      subjectsCanTeach: subjectsList,
      expertise: expertiseList,
      learningGoals: learningList,
      industry: details.industry,
      location: details.location,
      isEmailVerified: false,
      approvalStatus: 'pending',
      verificationToken: '482910',
      createdAt: new Date().toISOString()
    };

    saveStoredUsers([newUser, ...storedUsers]);

    // If teacher, initialize teacher profile
    if (details.role === 'teacher') {
      const newTeacher: TeacherProfile = {
        id: newUser.id,
        name: cleanName,
        email: cleanEmail,
        avatar: '',
        university: cleanUni,
        universityId: cleanUni.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        department: details.department || 'Department of Computer Science',
        designation: details.designation || 'Assistant Professor of Computer Science',
        experienceYears: 6,
        skills: skillsList.length ? skillsList : ['Machine Learning', 'Python', 'Data Science'],
        expertise: expertiseList.length ? expertiseList : ['Machine Learning', 'Data Science'],
        subjectsCanTeach: subjectsList.length ? subjectsList : ['Machine Learning', 'Python', 'Data Science'],
        mentorshipTopics: ['Academic Mentorship', 'Machine Learning Projects', 'Career Guidance'],
        bio: `Faculty member at ${cleanUni}. Guiding students in technical skills, academic research, and project mentorship.`,
        location: details.location || 'India',
        verificationStatus: 'verified',
        availableForMentorship: true,
        registrationDate: new Date().toISOString().split('T')[0]
      };
      setTeachersList(prev => [newTeacher, ...prev]);
      saveStoredProfile(newUser.id, newTeacher);
    }

    // If student, add to pending students list
    if (details.role === 'student') {
      const pendingRecord: StudentProfile = {
        id: newUser.id,
        name: cleanName,
        email: cleanEmail,
        avatar: '',
        university: cleanUni,
        universityId: cleanUni.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        course: details.course || 'B.Tech CSE',
        department: 'Computer Science',
        graduationYear: details.graduationYear || 2026,
        skills: skillsList.length ? skillsList : ['Python', 'Data Structures', 'SQL'],
        studentSkills: skillsList.map(s => ({ name: s, proficiency: 'Intermediate' as const })),
        learningGoals: learningList,
        interests: ['Placements', 'Mentorship', 'AI/ML'],
        careerGoals: 'Aspiring Engineer seeking mentorship in ML & Software Development.',
        location: details.location || 'India',
        bio: `Student at ${cleanUni}.`,
        internships: [],
        projects: [],
        certifications: [],
        achievements: [],
        profileCompletion: 65,
        verificationStatus: 'pending',
        isEmailVerified: false,
        approvalStatus: 'pending',
        registrationDate: new Date().toISOString().split('T')[0]
      };
      setPendingStudents(prev => [pendingRecord, ...prev]);
      saveStoredProfile(newUser.id, pendingRecord);
    }

    // Trigger Email Verification Flow
    setPendingEmailForOtp(cleanEmail);
    setCurrentDevVerificationToken('482910');
    setOtpModalOpen(true);
    addToast('Verification email sent. Please enter the verification token to continue.', 'info');
  };

  // Student Skills Management
  const addStudentSkill = (name: string, proficiency: SkillProficiency, category: string = 'Technical') => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setStudentSkills(prev => {
      const exists = prev.find(s => s.name.toLowerCase() === trimmed.toLowerCase());
      if (exists) {
        return prev.map(s => s.name.toLowerCase() === trimmed.toLowerCase() ? { ...s, proficiency, category } : s);
      }
      return [...prev, { name: trimmed, proficiency, category }];
    });
    setStudentProfile(prev => ({
      ...prev,
      skills: Array.from(new Set([...prev.skills, trimmed]))
    }));
    addToast(`Skill "${trimmed}" (${proficiency}) added to your profile!`, 'success');
  };

  const removeStudentSkill = (name: string) => {
    setStudentSkills(prev => prev.filter(s => s.name.toLowerCase() !== name.toLowerCase()));
    setStudentProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.toLowerCase() !== name.toLowerCase())
    }));
    addToast(`Skill "${name}" removed.`, 'info');
  };

  const updateStudentSkill = (name: string, proficiency: SkillProficiency) => {
    setStudentSkills(prev =>
      prev.map(s => (s.name.toLowerCase() === name.toLowerCase() ? { ...s, proficiency } : s))
    );
    addToast(`Proficiency for ${name} updated to ${proficiency}.`, 'success');
  };

  // Student Certifications Management
  const addStudentCertification = (cert: Omit<Certification, 'id'>) => {
    const newCert: Certification = {
      ...cert,
      id: `cert-${Date.now()}`
    };
    setStudentProfile(prev => ({
      ...prev,
      certifications: [newCert, ...(prev.certifications || [])]
    }));
    addToast(`Certification "${cert.name}" added to your profile!`, 'success');
  };

  const deleteStudentCertification = (id: string) => {
    setStudentProfile(prev => ({
      ...prev,
      certifications: (prev.certifications || []).filter(c => c.id !== id)
    }));
    addToast('Certification deleted.', 'info');
  };

  // Student Achievements Management
  const addStudentAchievement = (ach: Omit<StudentAchievement, 'id'>) => {
    const newAch: StudentAchievement = {
      ...ach,
      id: `ach-${Date.now()}`
    };
    setStudentProfile(prev => ({
      ...prev,
      studentAchievements: [newAch, ...(prev.studentAchievements || [])],
      achievements: [ach.title, ...(prev.achievements || [])]
    }));
    addToast(`Achievement "${ach.title}" added to your showcase!`, 'success');
  };

  const deleteStudentAchievement = (id: string) => {
    setStudentProfile(prev => ({
      ...prev,
      studentAchievements: (prev.studentAchievements || []).filter(a => a.id !== id)
    }));
    addToast('Achievement removed.', 'info');
  };

  // Student Projects Management
  const addStudentProject = (proj: Omit<Project, 'id'>) => {
    const newProj: Project = {
      ...proj,
      id: `proj-${Date.now()}`
    };
    setStudentProfile(prev => ({
      ...prev,
      projects: [newProj, ...(prev.projects || [])]
    }));
    addToast(`Project "${proj.name}" added to your portfolio!`, 'success');
  };

  const deleteStudentProject = (id: string) => {
    setStudentProfile(prev => ({
      ...prev,
      projects: (prev.projects || []).filter(p => p.id !== id)
    }));
    addToast('Project removed.', 'info');
  };

  // Resume & CV Management
  const uploadResumeDoc = (doc: Omit<ResumeDocument, 'id' | 'lastUpdated'>, visibility?: 'public' | 'private') => {
    const newDoc: ResumeDocument = {
      ...doc,
      id: `res-${Date.now()}`,
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    if (currentUser.role === 'student') {
      setStudentProfile(prev => {
        const updated = {
          ...prev,
          resumeDoc: newDoc,
          resumeVisibility: visibility || resumeVisibility || 'public',
          profileCompletion: Math.min(100, (prev.profileCompletion || 75) + 10)
        };
        saveStoredProfile(currentUser.id, updated);
        return updated;
      });
    } else if (currentUser.role === 'teacher') {
      setTeacherProfile(prev => {
        const updated = {
          ...prev,
          resumeDoc: newDoc,
          resumeVisibility: visibility || resumeVisibility || 'public'
        };
        saveStoredProfile(currentUser.id, updated);
        return updated;
      });
      setTeachersList(prev => prev.map(t => t.id === currentUser.id ? { ...t, resumeDoc: newDoc } : t));
    } else if (currentUser.role === 'alumni') {
      setAlumniList(prev => {
        const updated = prev.map(a => a.id === currentUser.id ? { ...a, resumeDoc: newDoc, resumeVisibility: visibility || 'public' } : a);
        const me = updated.find(a => a.id === currentUser.id);
        if (me) saveStoredProfile(currentUser.id, me);
        return updated;
      });
    }

    // Non-blocking sync to server API
    fetch('/api/profile/resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id, resumeDoc: newDoc, visibility: visibility || 'public' })
    }).catch(() => {});

    addToast(`Resume "${doc.fileName}" uploaded & ready for AI analysis!`, 'success');
  };

  const deleteResumeDoc = () => {
    if (currentUser.role === 'student') {
      setStudentProfile(prev => {
        const updated = { ...prev, resumeDoc: undefined };
        saveStoredProfile(currentUser.id, updated);
        return updated;
      });
    } else if (currentUser.role === 'teacher') {
      setTeacherProfile(prev => {
        const updated = { ...prev, resumeDoc: undefined };
        saveStoredProfile(currentUser.id, updated);
        return updated;
      });
      setTeachersList(prev => prev.map(t => t.id === currentUser.id ? { ...t, resumeDoc: undefined } : t));
    } else if (currentUser.role === 'alumni') {
      setAlumniList(prev => {
        const updated = prev.map(a => a.id === currentUser.id ? { ...a, resumeDoc: undefined } : a);
        const me = updated.find(a => a.id === currentUser.id);
        if (me) saveStoredProfile(currentUser.id, me);
        return updated;
      });
    }

    fetch('/api/profile/resume', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id })
    }).catch(() => {});

    addToast('Resume deleted.', 'info');
  };

  const updateResumeLinks = (links: { googleDriveUrl?: string; linkedInUrl?: string; portfolioUrl?: string }) => {
    setStudentProfile(prev => {
      const updated = {
        ...prev,
        resumeDoc: prev.resumeDoc ? {
          ...prev.resumeDoc,
          externalLinks: {
            ...prev.resumeDoc.externalLinks,
            ...links
          }
        } : {
          id: `res-links-${Date.now()}`,
          fileName: 'Online Portfolio / Profile Links',
          fileUrl: links.googleDriveUrl || links.portfolioUrl || '#',
          fileType: 'PDF' as const,
          lastUpdated: 'Just now',
          externalLinks: links
        }
      };
      saveStoredProfile(currentUser.id, updated);
      return updated;
    });
    addToast('Resume and career links updated successfully!', 'success');
  };

  // Media Section & Showcase
  const uploadProfileMedia = (media: { url: string; caption?: string; type?: 'image' | 'gif'; isAnimated?: boolean }) => {
    const isAnim = media.isAnimated || media.url.includes('.gif') || media.url.startsWith('data:image/gif');
    const newItem: ProfileMediaItem = {
      id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      url: media.url,
      caption: media.caption,
      type: media.type || (isAnim ? 'gif' : 'image'),
      isAnimated: isAnim,
      uploadedAt: 'Just now'
    };

    if (currentUser.role === 'student') {
      setStudentProfile(prev => {
        const updated = {
          ...prev,
          mediaGallery: [newItem, ...(prev.mediaGallery || [])]
        };
        saveStoredProfile(currentUser.id, updated);
        return updated;
      });
    } else if (currentUser.role === 'teacher') {
      setTeacherProfile(prev => {
        const updated = {
          ...prev,
          mediaGallery: [newItem, ...(prev.mediaGallery || [])]
        };
        saveStoredProfile(currentUser.id, updated);
        return updated;
      });
      setTeachersList(prev => prev.map(t => t.id === currentUser.id ? { ...t, mediaGallery: [newItem, ...(t.mediaGallery || [])] } : t));
    } else if (currentUser.role === 'alumni') {
      setAlumniList(prev => {
        const updated = prev.map(a => a.id === currentUser.id ? { ...a, mediaGallery: [newItem, ...(a.mediaGallery || [])] } : a);
        const me = updated.find(a => a.id === currentUser.id);
        if (me) saveStoredProfile(currentUser.id, me);
        return updated;
      });
    }

    fetch('/api/profile/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id, mediaItem: newItem })
    }).catch(() => {});

    addToast(isAnim ? 'Animated profile media added to showcase!' : 'Media uploaded to your profile showcase!', 'success');
  };

  const deleteProfileMedia = (id: string) => {
    if (currentUser.role === 'student') {
      setStudentProfile(prev => {
        const updated = {
          ...prev,
          mediaGallery: (prev.mediaGallery || []).filter(m => m.id !== id)
        };
        saveStoredProfile(currentUser.id, updated);
        return updated;
      });
    } else if (currentUser.role === 'teacher') {
      setTeacherProfile(prev => {
        const updated = {
          ...prev,
          mediaGallery: (prev.mediaGallery || []).filter(m => m.id !== id)
        };
        saveStoredProfile(currentUser.id, updated);
        return updated;
      });
      setTeachersList(prev => prev.map(t => t.id === currentUser.id ? { ...t, mediaGallery: (t.mediaGallery || []).filter(m => m.id !== id) } : t));
    } else if (currentUser.role === 'alumni') {
      setAlumniList(prev => {
        const updated = prev.map(a => a.id === currentUser.id ? { ...a, mediaGallery: (a.mediaGallery || []).filter(m => m.id !== id) } : a);
        const me = updated.find(a => a.id === currentUser.id);
        if (me) saveStoredProfile(currentUser.id, me);
        return updated;
      });
    }

    fetch(`/api/profile/media/${currentUser.id}/${id}`, {
      method: 'DELETE'
    }).catch(() => {});

    addToast('Media item removed.', 'info');
  };

  // Admin Student Approval
  const approveStudentAccount = (studentId: string) => {
    setPendingStudents(prev => prev.filter(s => s.id !== studentId));
    addToast('Student account approved! Official welcome notification dispatched.', 'success');
  };

  const rejectStudentAccount = (studentId: string, reason?: string) => {
    setPendingStudents(prev => prev.filter(s => s.id !== studentId));
    addToast(`Student registration rejected: ${reason || 'Application rejected by administration.'}`, 'error');
  };

  // University Management
  const addUniversity = (uni: University) => {
    setUniversities(prev => [uni, ...prev]);
    addToast(`University "${uni.name}" added to the Pan-India network!`, 'success');
  };

  // Startup Management
  const postStartup = (startup: Omit<StartupListing, 'id' | 'founderName' | 'founderId' | 'status' | 'createdAt'>) => {
    const newStartup: StartupListing = {
      ...startup,
      id: `startup-${Date.now()}`,
      founderName: currentUser.name || 'Alumni Founder',
      founderId: currentUser.id,
      status: 'approved',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStartups(prev => [newStartup, ...prev]);
    addToast(`Startup "${startup.name}" listed successfully!`, 'success');
  };

  const moderateStartup = (id: string, status: 'approved' | 'rejected') => {
    setStartups(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    addToast(`Startup listing marked as ${status}.`, 'info');
  };

  // Opportunity Posting & Moderation
  const postOpportunity = (opp: Omit<CareerOpportunity, 'id' | 'postedBy' | 'alumniId' | 'status'>) => {
    const newOpp: CareerOpportunity = {
      ...opp,
      id: `opp-${Date.now()}`,
      postedBy: currentUser.name || 'Alumni Member',
      alumniId: currentUser.id,
      status: 'approved',
      aiMatchScore: 90,
      aiMatchReasons: ['Direct alumni posting', 'Verified company badge']
    };
    setOpportunities(prev => [newOpp, ...prev]);
    addToast(`Opportunity "${opp.title}" posted successfully!`, 'success');
  };

  const moderateOpportunity = (id: string, status: 'approved' | 'rejected') => {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    addToast(`Career opportunity marked as ${status}.`, 'info');
  };

  const moderateEvent = (id: string, status: 'approved' | 'rejected') => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    addToast(`Campus event marked as ${status}.`, 'info');
  };

  const resolveFeedback = (id: string) => {
    setFeedbackReports(prev => prev.map(f => f.id === id ? { ...f, status: 'resolved' } : f));
    addToast('Feedback ticket marked as resolved.', 'success');
  };

  // Switch persona for admin/testing
  const switchUserRole = (role: UserRole) => {
    if (role === 'guest') {
      logout();
      return;
    }

    setIsAuthenticated(true);

    if (role === 'student') {
      const storedUsers = getStoredUsers();
      const registeredStudent = storedUsers.find(u => u.role === 'student') || {
        id: 'student-ayushi-arya',
        name: 'Ayushi Arya',
        email: 'ayushi.arya@tulas.edu.in',
        role: 'student' as const,
        university: "Tula's Institute",
        avatar: '',
        createdAt: new Date().toISOString()
      };

      loginUser('student', registeredStudent.email, registeredStudent.name, registeredStudent.university);
    } else if (role === 'alumni') {
      const priya = alumniList.find(a => a.id === 'alumni-1') || alumniList[0];
      setCurrentUser({
        id: priya.id,
        name: priya.name,
        email: priya.email,
        role: 'alumni',
        avatar: priya.avatar,
        university: priya.university,
        verificationStatus: priya.verificationStatus,
        isAuthenticated: true
      });
      setActiveChatRecipientId('student-ayushi');
      navigate('alumni-dashboard');
      addToast(`Logged in as Alumni / Mentor: ${priya.name}`, 'success');
    } else if (role === 'teacher') {
      const teacher = teachersList[0] || TEACHERS_LIST[0];
      setCurrentUser({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        role: 'teacher',
        avatar: teacher.avatar,
        university: teacher.university,
        verificationStatus: 'verified',
        isAuthenticated: true,
        approvalStatus: 'approved',
        isEmailVerified: true
      });
      setTeacherProfile(teacher);
      navigate('teacher-dashboard');
      addToast(`Logged in as Teacher / Professor: ${teacher.name}`, 'success');
    } else if (role === 'admin') {
      setCurrentUser({
        id: 'admin-verma',
        name: 'Dr. Rajesh Verma',
        email: 'dean.alumni@alumniconnect.ac.in',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
        university: 'Platform Central Administration',
        verificationStatus: 'verified',
        isAuthenticated: true
      });
      navigate('admin-dashboard');
      addToast('Logged in as Administrator: Dr. Rajesh Verma', 'success');
    }
  };

  // Connections
  const sendConnectionRequest = (
    targetId: string,
    options?: {
      note?: string;
      targetRole?: 'alumni' | 'teacher';
      matchPercentage?: number;
      matchedSkills?: string[];
      matchReason?: string;
    }
  ) => {
    if (!isAuthenticated) {
      const target = alumniList.find(a => a.id === targetId) || teachersList.find(t => t.id === targetId);
      triggerAuthGate(`send a connection request to ${target?.name || 'this mentor'}`);
      return;
    }

    const alumni = alumniList.find(a => a.id === targetId);
    const teacher = teachersList.find(t => t.id === targetId);
    const target = teacher || alumni;
    if (!target) return;

    const existing = connections.find(
      c => c.studentId === currentUser.id && c.alumniId === targetId
    );

    if (existing) {
      addToast('Connection request already exists or is pending.', 'info');
      return;
    }

    const targetRole: 'alumni' | 'teacher' = options?.targetRole || (teacher ? 'teacher' : 'alumni');
    const newRequest: ConnectionRequest = {
      id: `req-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatar,
      studentUniversity: currentUser.university,
      alumniId: target.id,
      alumniName: target.name,
      alumniAvatar: target.avatar,
      alumniCompany: (target as any).company || (target as any).department || target.university,
      targetRole,
      status: 'pending',
      note: options?.note,
      matchPercentage: options?.matchPercentage,
      matchedSkills: options?.matchedSkills,
      matchReason: options?.matchReason,
      createdAt: 'Just now'
    };

    setConnections(prev => {
      const updated = [...prev, newRequest];
      try {
        localStorage.setItem('alumniconnect_connections', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Notify backend non-blocking
    fetch('/api/connections/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRequest)
    }).catch(() => {});

    addToast(`Connection request sent to ${target.name}!`, 'success');
  };

  const acceptConnectionRequest = (requestId: string) => {
    const req = connections.find(c => c.id === requestId);
    setConnections(prev => {
      const updated = prev.map(c => (c.id === requestId ? { ...c, status: 'accepted' as const } : c));
      try {
        localStorage.setItem('alumniconnect_connections', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (req) {
      // Create initial chat message
      const welcomeMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        receiverId: req.studentId,
        content: `Hi ${req.studentName}! I accepted your connection request. Looking forward to connecting and sharing insights!`,
        timestamp: 'Just now',
        read: false
      };
      setMessages(prev => [...prev, welcomeMsg]);

      // Add notification for the student
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          userId: req.studentId,
          type: 'connection_accepted',
          title: 'Connection Accepted',
          message: `${currentUser.name} accepted your connection request!`,
          timestamp: 'Just now',
          read: false
        },
        ...prev
      ]);
    }

    fetch('/api/connections/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId })
    }).catch(() => {});

    addToast('Connection request accepted! You are now connected.', 'success');
  };

  const rejectConnectionRequest = (requestId: string) => {
    setConnections(prev => {
      const updated = prev.map(c => (c.id === requestId ? { ...c, status: 'rejected' as const } : c));
      try {
        localStorage.setItem('alumniconnect_connections', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    fetch('/api/connections/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId })
    }).catch(() => {});

    addToast('Connection request declined.', 'info');
  };

  // AI Mentor / Teacher Search
  const executeAIMentorSearch = async (query: string): Promise<AIMentorMatch[]> => {
    try {
      const localMatches = matchTeachersAndMentorsAI(query, studentProfile, teachersList, alumniList);
      return localMatches;
    } catch (err) {
      console.error('AI Matchmaking error:', err);
      return [];
    }
  };

  // Mentorship Requests (Student -> Requests Help -> Alumni/Mentor)
  const sendMentorshipRequest = (
    alumniId: string,
    goal: string,
    areaOfHelp: string,
    message: string,
    resumeUrl?: string
  ) => {
    if (!isAuthenticated) {
      const alumni = alumniList.find(a => a.id === alumniId);
      triggerAuthGate(`request mentorship from ${alumni?.name || 'this mentor'}`);
      return;
    }

    const alumni = alumniList.find(a => a.id === alumniId);
    if (!alumni) return;

    const newMentorship: MentorshipRequest = {
      id: `mentor-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatar,
      studentUniversity: currentUser.university,
      alumniId: alumni.id,
      alumniName: alumni.name,
      alumniCompany: alumni.company,
      goal,
      areaOfHelp,
      message,
      resumeUrl: resumeUrl || 'https://drive.google.com/file/d/sample-student-resume.pdf',
      status: 'pending',
      createdAt: 'Just now'
    };

    setMentorships(prev => [newMentorship, ...prev]);
    addToast(`Mentorship request sent to ${alumni.name}!`, 'success');
  };

  const requestResumeReview = (alumniId: string, note?: string) => {
    const slug = (currentUser.name || 'student').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    sendMentorshipRequest(
      alumniId,
      'Resume Review for SDE/ML Roles',
      'Resume Review',
      note || 'Could you please review my resume and suggest improvements for product engineering roles?',
      `https://drive.google.com/file/d/${slug}-resume-2026.pdf`
    );
  };

  const acceptMentorshipRequest = (requestId: string) => {
    setMentorships(prev =>
      prev.map(m => (m.id === requestId ? { ...m, status: 'accepted' } : m))
    );
    const req = mentorships.find(m => m.id === requestId);
    if (req) {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        receiverId: req.studentId,
        content: `Hello ${req.studentName}! I have accepted your ${req.areaOfHelp} mentorship request. Let's work together to accelerate your career!`,
        timestamp: 'Just now',
        read: false
      };
      setMessages(prev => [...prev, newMsg]);
    }
    addToast('Mentorship request accepted. Chat session active!', 'success');
  };

  const declineMentorshipRequest = (requestId: string) => {
    setMentorships(prev =>
      prev.map(m => (m.id === requestId ? { ...m, status: 'declined' } : m))
    );
    addToast('Mentorship request declined.', 'info');
  };

  const sendResumeFeedback = (requestId: string, feedback: string) => {
    setMentorships(prev =>
      prev.map(m =>
        m.id === requestId
          ? { ...m, mentorFeedback: feedback, status: 'completed' }
          : m
      )
    );
    const req = mentorships.find(m => m.id === requestId);
    if (req) {
      const feedbackMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        receiverId: req.studentId,
        content: `📋 Resume Review Feedback: ${feedback}`,
        timestamp: 'Just now',
        read: false
      };
      setMessages(prev => [...prev, feedbackMsg]);
    }
    addToast('Resume review feedback sent to student!', 'success');
  };

  // Chat Actions
  const sendMessage = (receiverId: string, content: string) => {
    if (!content.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      content,
      timestamp: 'Just now',
      read: false
    };

    setMessages(prev => [...prev, newMsg]);
  };

  // Event registration
  const registerForEvent = (eventId: string) => {
    setEvents(prev =>
      prev.map(ev =>
        ev.id === eventId ? { ...ev, attendeesCount: ev.attendeesCount + 1 } : ev
      )
    );
    addToast('Registered for alumni event! Confirmation details sent to your email.', 'success');
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  // Admin Verification Dossier Actions
  const approveAlumniProfile = (alumniId: string) => {
    setAlumniList(prev =>
      prev.map(a =>
        a.id === alumniId
          ? {
              ...a,
              verificationStatus: 'verified',
              adminNotes: 'Verified by University Administrator via official degree registry & corporate email badge.'
            }
          : a
      )
    );
    confetti({ particleCount: 70, spread: 60 });
    addToast('Alumni application Approved! Verified Alumni Badge granted.', 'success');
  };

  const rejectAlumniProfile = (alumniId: string) => {
    setAlumniList(prev =>
      prev.map(a =>
        a.id === alumniId
          ? {
              ...a,
              verificationStatus: 'rejected',
              adminNotes: 'Verification rejected due to insufficient or unverified credentials.'
            }
          : a
      )
    );
    addToast('Alumni application marked as Rejected (Verification Required).', 'error');
  };

  const requestMoreInfoAlumni = (alumniId: string, note: string) => {
    setAlumniList(prev =>
      prev.map(a =>
        a.id === alumniId
          ? {
              ...a,
              verificationStatus: 'info_requested',
              adminNotes: note || 'Please submit official company email verification or ID badge.'
            }
          : a
      )
    );
    addToast('Applicant notified to submit additional verification credentials.', 'info');
  };

  const toggleUserSuspension = (userId: string) => {
    setAlumniList(prev =>
      prev.map(a =>
        a.id === userId
          ? {
              ...a,
              verificationStatus:
                a.verificationStatus === 'suspended' ? 'verified' : 'suspended'
            }
          : a
      )
    );
    addToast('User status updated by platform administrator.', 'info');
  };

  // ── Avatar Update ────────────────────────────────────────────────────────
  const updateUserAvatar = (avatarUrl: string) => {
    setCurrentUser(prev => {
      const updated = { ...prev, avatar: avatarUrl };
      try { localStorage.setItem(STORAGE_ACTIVE_SESSION, JSON.stringify(updated)); } catch {}
      return updated;
    });

    const storedUsers = getStoredUsers();
    const idx = storedUsers.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) {
      storedUsers[idx] = { ...storedUsers[idx], avatar: avatarUrl };
      saveStoredUsers(storedUsers);
    }

    if (currentUser.role === 'student') {
      setStudentProfile(prev => {
        const updated = { ...prev, avatar: avatarUrl };
        saveStoredProfile(currentUser.id, updated);
        return updated;
      });
    } else if (currentUser.role === 'teacher') {
      setTeacherProfile(prev => {
        const updated = { ...prev, avatar: avatarUrl };
        saveStoredProfile(currentUser.id, updated);
        return updated;
      });
      setTeachersList(prev => prev.map(t => (t.id === currentUser.id ? { ...t, avatar: avatarUrl } : t)));
    } else if (currentUser.role === 'alumni') {
      setAlumniList(prev => {
        const updated = prev.map(a => (a.id === currentUser.id ? { ...a, avatar: avatarUrl } : a));
        const me = updated.find(a => a.id === currentUser.id);
        if (me) saveStoredProfile(currentUser.id, me);
        return updated;
      });
    }

    // Server API sync
    fetch('/api/profile/avatar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id, avatarUrl })
    }).catch(() => {});

    addToast('Profile photo updated!', 'success');
  };

  // ── Profile Update ────────────────────────────────────────────────────────
  const updateUserProfile = (data: Partial<{
    name: string; bio: string; university: string; course: string;
    graduationYear: string; currentCompany: string; designation: string;
    industry: string; skills: string; location: string; experience: string;
    interests: string; linkedinUrl: string; careerGoals: string;
    department: string; subjectsCanTeach: string; expertise: string;
    learningGoals: string; developmentGoals: string; experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    preferredMentorshipAreas: string; officeHours: string;
  }>) => {
    const skillsArr = data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : undefined;
    const interestsArr = data.interests ? data.interests.split(',').map(s => s.trim()).filter(Boolean) : undefined;
    const subjectsCanTeachArr = data.subjectsCanTeach ? data.subjectsCanTeach.split(',').map(s => s.trim()).filter(Boolean) : undefined;
    const expertiseArr = data.expertise ? data.expertise.split(',').map(s => s.trim()).filter(Boolean) : undefined;
    const learningGoalsArr = data.learningGoals ? data.learningGoals.split(',').map(s => s.trim()).filter(Boolean) : undefined;
    const preferredMentorshipAreasArr = data.preferredMentorshipAreas ? data.preferredMentorshipAreas.split(',').map(s => s.trim()).filter(Boolean) : undefined;
    const gradYear = data.graduationYear ? parseInt(data.graduationYear) : undefined;

    setCurrentUser(prev => {
      const updated = {
        ...prev,
        ...(data.name && { name: data.name }),
        ...(data.university && { university: data.university }),
      };
      try { localStorage.setItem(STORAGE_ACTIVE_SESSION, JSON.stringify(updated)); } catch {}
      return updated;
    });

    if (data.name || data.university) {
      const storedUsers = getStoredUsers();
      const idx = storedUsers.findIndex(u => u.id === currentUser.id);
      if (idx !== -1) {
        if (data.name) storedUsers[idx].name = data.name;
        if (data.university) storedUsers[idx].university = data.university;
        saveStoredUsers(storedUsers);
      }
    }

    if (currentUser.role === 'student') {
      setStudentProfile(prev => {
        const updated = {
          ...prev,
          ...(data.name && { name: data.name }),
          ...(data.bio && { bio: data.bio }),
          ...(data.university && { university: data.university }),
          ...(data.course && { course: data.course }),
          ...(gradYear && { graduationYear: gradYear }),
          ...(skillsArr && { skills: skillsArr }),
          ...(interestsArr && { interests: interestsArr }),
          ...(data.location && { location: data.location }),
          ...(data.careerGoals && { careerGoals: data.careerGoals }),
          ...(learningGoalsArr && { learningGoals: learningGoalsArr }),
          ...(data.developmentGoals && { developmentGoals: data.developmentGoals }),
          ...(data.experienceLevel && { experienceLevel: data.experienceLevel }),
          ...(preferredMentorshipAreasArr && { preferredMentorshipAreas: preferredMentorshipAreasArr }),
        };
        saveStoredProfile(currentUser.id, updated);
        return updated;
      });
    } else if (currentUser.role === 'teacher') {
      setTeacherProfile(prev => {
        const updated: TeacherProfile = {
          ...prev,
          ...(data.name && { name: data.name }),
          ...(data.bio && { bio: data.bio }),
          ...(data.university && { university: data.university }),
          ...(data.department && { department: data.department }),
          ...(data.designation && { designation: data.designation }),
          ...(data.experience && { experienceYears: parseInt(data.experience) }),
          ...(skillsArr && { skills: skillsArr }),
          ...(subjectsCanTeachArr && { subjectsCanTeach: subjectsCanTeachArr }),
          ...(expertiseArr && { expertise: expertiseArr }),
          ...(data.location && { location: data.location }),
          ...(data.officeHours && { officeHours: data.officeHours }),
          ...(data.linkedinUrl && { linkedinUrl: data.linkedinUrl }),
          ...(data.developmentGoals && { developmentGoals: data.developmentGoals })
        };
        saveStoredProfile(currentUser.id, updated);
        return updated;
      });
      setTeachersList(prev =>
        prev.map(t =>
          t.id === currentUser.id
            ? {
                ...t,
                ...(data.name && { name: data.name }),
                ...(data.bio && { bio: data.bio }),
                ...(data.university && { university: data.university }),
                ...(data.department && { department: data.department }),
                ...(data.designation && { designation: data.designation }),
                ...(data.experience && { experienceYears: parseInt(data.experience) }),
                ...(skillsArr && { skills: skillsArr }),
                ...(subjectsCanTeachArr && { subjectsCanTeach: subjectsCanTeachArr }),
                ...(expertiseArr && { expertise: expertiseArr }),
                ...(data.location && { location: data.location }),
                ...(data.officeHours && { officeHours: data.officeHours }),
                ...(data.linkedinUrl && { linkedinUrl: data.linkedinUrl }),
                ...(data.developmentGoals && { developmentGoals: data.developmentGoals })
              }
            : t
        )
      );
    } else if (currentUser.role === 'alumni') {
      setAlumniList(prev => {
        const updated = prev.map(a =>
          a.id === currentUser.id
            ? {
                ...a,
                ...(data.name && { name: data.name }),
                ...(data.bio && { bio: data.bio }),
                ...(data.university && { university: data.university }),
                ...(data.course && { degree: data.course }),
                ...(gradYear && { graduationYear: gradYear }),
                ...(data.currentCompany && { company: data.currentCompany }),
                ...(data.designation && { jobTitle: data.designation }),
                ...(data.industry && { industry: data.industry }),
                ...(skillsArr && { skills: skillsArr }),
                ...(expertiseArr && { expertise: expertiseArr }),
                ...(data.location && { location: data.location }),
                ...(data.experience && { experienceYears: parseInt(data.experience) }),
                ...(data.linkedinUrl && { linkedinUrl: data.linkedinUrl }),
                ...(learningGoalsArr && { learningGoals: learningGoalsArr }),
                ...(data.developmentGoals && { developmentGoals: data.developmentGoals }),
                ...(preferredMentorshipAreasArr && { preferredMentorshipAreas: preferredMentorshipAreasArr })
              }
            : a
        );
        const me = updated.find(a => a.id === currentUser.id);
        if (me) saveStoredProfile(currentUser.id, me);
        return updated;
      });
    }

    addToast('Profile information saved and synchronized!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        isAuthenticated,
        currentView,
        setCurrentView,
        viewHistory,
        navigate,
        goBack,
        canGoBack,
        switchUserRole,
        loginUser,
        registerUser,
        logout,
        studentProfile,
        alumniList,
        teachersList,
        teacherProfile,
        selectedTeacher,
        setSelectedTeacher,
        connections,
        mentorships,
        messages,
        notifications,
        unreadNotifCount,
        toasts,
        addToast,
        removeToast,
        authGateModalOpen,
        setAuthGateModalOpen,
        authGateAction,
        triggerAuthGate,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        otpModalOpen,
        setOtpModalOpen,
        pendingEmailForOtp,
        setPendingEmailForOtp,
        getTheAppModalOpen,
        setGetTheAppModalOpen,
        GOOGLE_PLAY_STORE_APP_URL,
        selectedAlumni,
        setSelectedAlumni,
        mentorshipTarget,
        setMentorshipTarget,
        achievements,
        selectedAchievement,
        setSelectedAchievement,
        events,
        opportunities,
        registerForEvent,
        sendConnectionRequest,
        acceptConnectionRequest,
        rejectConnectionRequest,
        executeAIMentorSearch,
        theme,
        toggleTheme,
        showIntro,
        setShowIntro,
        replayIntro,
        sendMentorshipRequest,
        requestResumeReview,
        acceptMentorshipRequest,
        declineMentorshipRequest,
        sendResumeFeedback,
        activeChatRecipientId,
        setActiveChatRecipientId,
        sendMessage,
        chatSessionTimeRemaining,
        isChatSessionLocked,
        chatSessionPrice,
        setChatSessionPrice,
        unlockChatSession,
        resetChatTimer,
        markNotificationsAsRead,
        approveAlumniProfile,
        rejectAlumniProfile,
        requestMoreInfoAlumni,
        toggleUserSuspension,
        globalSearchQuery,
        setGlobalSearchQuery,
        updateUserAvatar,
        updateUserProfile,
        // Email verification
        isEmailVerified,
        verifyEmailToken,
        resendVerificationEmail,
        currentDevVerificationToken,
        // Admin moderation and network lists
        pendingStudents,
        approveStudentAccount,
        rejectStudentAccount,
        universities,
        addUniversity,
        startups,
        postStartup,
        moderateStartup,
        feedbackReports,
        resolveFeedback,
        postOpportunity,
        moderateOpportunity,
        moderateEvent,
        // Student skills, certs, achievements, projects, resume & media
        studentSkills,
        addStudentSkill,
        removeStudentSkill,
        updateStudentSkill,
        addStudentCertification,
        deleteStudentCertification,
        addStudentAchievement,
        deleteStudentAchievement,
        addStudentProject,
        deleteStudentProject,
        uploadResumeDoc,
        deleteResumeDoc,
        resumeVisibility,
        setResumeVisibility,
        updateResumeLinks,
        uploadProfileMedia,
        deleteProfileMedia
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

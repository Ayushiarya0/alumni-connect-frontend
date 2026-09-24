import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserSession,
  AlumniProfile,
  StudentProfile,
  ConnectionRequest,
  MentorshipRequest,
  ChatMessage,
  NotificationItem,
  UserRole,
  AchievementItem,
  AlumniEvent,
  CareerOpportunity
} from '../types';
import {
  ALUMNI_LIST,
  CURRENT_STUDENT,
  INITIAL_CONNECTIONS,
  INITIAL_MENTORSHIPS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  ACHIEVEMENTS_LIST,
  ALUMNI_EVENTS,
  CAREER_OPPORTUNITIES
} from '../data/mockData';

export type AppView =
  | 'landing'
  | 'explore'
  | 'map'
  | 'mentors'
  | 'achievements'
  | 'student-dashboard'
  | 'alumni-dashboard'
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
  loginUser: (role: 'student' | 'alumni', email: string, name?: string, university?: string) => void;
  registerUser: (details: { fullName: string; email: string; role: 'student' | 'alumni'; university: string; password?: string }) => void;
  logout: () => void;
  studentProfile: StudentProfile;
  alumniList: AlumniProfile[];
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
  registerForEvent: (eventId: string) => void;
  // Theme state
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  // Opening cinematic intro
  showIntro: boolean;
  setShowIntro: (show: boolean) => void;
  replayIntro: () => void;
  // Connection Actions
  sendConnectionRequest: (alumniId: string, note?: string) => void;
  acceptConnectionRequest: (requestId: string) => void;
  rejectConnectionRequest: (requestId: string) => void;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export interface RegisteredUserRecord {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'alumni';
  university: string;
  avatar?: string;
  password?: string;
  createdAt: string;
}

const STORAGE_REGISTERED_USERS = 'alumniconnect_registered_users';
const STORAGE_ACTIVE_SESSION = 'alumniconnect_active_session';

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
          avatar: '',
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
      isAuthenticated: false
    };
  });

  // Student Profile state - syncs with authenticated student identity
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_ACTIVE_SESSION);
      if (raw) {
        const s = JSON.parse(raw) as UserSession;
        if (s && s.isAuthenticated && s.role === 'student' && s.name) {
          return {
            ...CURRENT_STUDENT,
            id: s.id,
            name: s.name,
            email: s.email,
            avatar: s.avatar || '',
            university: s.university || CURRENT_STUDENT.university
          };
        }
      }
    } catch {}
    const stored = getStoredUsers();
    const regStudent = stored.find(u => u.role === 'student');
    if (regStudent) {
      return {
        ...CURRENT_STUDENT,
        id: regStudent.id,
        name: regStudent.name,
        email: regStudent.email,
        avatar: regStudent.avatar || '',
        university: regStudent.university
      };
    }
    return CURRENT_STUDENT;
  });

  const [alumniList, setAlumniList] = useState<AlumniProfile[]>(ALUMNI_LIST);
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

  // Chat 5-minute Free Conversation Countdown System (Requirement 13)
  const [chatSessionTimeRemaining, setChatSessionTimeRemaining] = useState<number>(300); // 300 seconds = 05:00
  const [isChatSessionLocked, setIsChatSessionLocked] = useState<boolean>(false);
  const [chatSessionPrice, setChatSessionPrice] = useState<number>(20); // Configurable price: ₹20 per additional 5 minutes

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
    setChatSessionTimeRemaining(300); // +5 minutes
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
      isAuthenticated: false
    });
    setCurrentView('landing');
    setViewHistory(['landing']);
    addToast('You have logged out. Now browsing as Public Guest.', 'info');
  };

  // Real Authentication Login (Requirement 10: Real Credentials Login)
  const loginUser = (
    role: 'student' | 'alumni',
    email: string,
    name?: string,
    university?: string
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    const storedUsers = getStoredUsers();
    let existingUser = storedUsers.find(u => u.email.toLowerCase() === cleanEmail);

    let resolvedName = name?.trim() || existingUser?.name || deriveNameFromEmail(cleanEmail);
    let resolvedUniversity = university?.trim() || existingUser?.university || (role === 'student' ? "Tula's Institute" : "IIT Roorkee");
    let resolvedAvatar = existingUser?.avatar || '';

    // If new user or name changed, persist in registered users list
    if (!existingUser) {
      existingUser = {
        id: `${role}-${Date.now()}`,
        name: resolvedName,
        email: cleanEmail,
        role: role,
        university: resolvedUniversity,
        avatar: resolvedAvatar,
        createdAt: new Date().toISOString()
      };
      saveStoredUsers([existingUser, ...storedUsers]);
    } else if (name && name.trim() && existingUser.name !== name.trim()) {
      existingUser.name = name.trim();
      if (university) existingUser.university = university.trim();
      saveStoredUsers(storedUsers.map(u => u.email.toLowerCase() === cleanEmail ? existingUser! : u));
      resolvedName = existingUser.name;
      resolvedUniversity = existingUser.university;
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
      isAuthenticated: true
    };

    setCurrentUser(newSession);
    setIsAuthenticated(true);

    try {
      localStorage.setItem(STORAGE_ACTIVE_SESSION, JSON.stringify(newSession));
    } catch (e) {
      console.error(e);
    }

    if (role === 'student') {
      setStudentProfile(prev => ({
        ...prev,
        id: userId,
        name: resolvedName,
        email: cleanEmail,
        avatar: resolvedAvatar,
        university: resolvedUniversity,
        verificationStatus: 'verified'
      }));

      // Update student name and university in all user-owned connections & mentorships
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

      setMessages(prev =>
        prev.map(msg =>
          msg.receiverId === 'student-current'
            ? { ...msg, receiverId: userId }
            : msg.senderId === 'student-current'
            ? { ...msg, senderId: userId }
            : msg
        )
      );

      setActiveChatRecipientId('alumni-rahul-sharma');
      navigate('student-dashboard');
      addToast(`Welcome back, ${resolvedName}!`, 'success');
    } else {
      const alumni = alumniList.find(a => a.id === userId || a.email.toLowerCase() === cleanEmail) || {
        ...alumniList[0],
        id: userId,
        name: resolvedName,
        email: cleanEmail,
        university: resolvedUniversity,
        avatar: resolvedAvatar
      };

      setActiveChatRecipientId('student-ayushi');
      navigate('alumni-dashboard');
      addToast(`Welcome back, ${resolvedName}!`, 'success');
    }
  };

  const registerUser = (details: {
    fullName: string;
    email: string;
    role: 'student' | 'alumni';
    university: string;
    password?: string;
  }) => {
    const cleanEmail = details.email.trim().toLowerCase();
    const cleanName = details.fullName.trim();
    const cleanUni = details.university.trim();

    const storedUsers = getStoredUsers().filter(u => u.email.toLowerCase() !== cleanEmail);
    const newUser: RegisteredUserRecord = {
      id: `${details.role}-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      role: details.role,
      university: cleanUni,
      avatar: '',
      password: details.password,
      createdAt: new Date().toISOString()
    };

    saveStoredUsers([newUser, ...storedUsers]);

    // Log in immediately with exact entered full name and institution
    loginUser(details.role, cleanEmail, cleanName, cleanUni);
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
  const sendConnectionRequest = (alumniId: string, note?: string) => {
    if (!isAuthenticated) {
      const alumni = alumniList.find(a => a.id === alumniId);
      triggerAuthGate(`send a connection request to ${alumni?.name || 'this alumni'}`);
      return;
    }

    const alumni = alumniList.find(a => a.id === alumniId);
    if (!alumni) return;

    const existing = connections.find(
      c => c.studentId === currentUser.id && c.alumniId === alumniId
    );

    if (existing) {
      addToast('Connection request already exists.', 'info');
      return;
    }

    const newRequest: ConnectionRequest = {
      id: `req-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatar,
      studentUniversity: currentUser.university,
      alumniId: alumni.id,
      alumniName: alumni.name,
      alumniAvatar: alumni.avatar,
      alumniCompany: alumni.company,
      status: 'pending',
      note,
      createdAt: 'Just now'
    };

    setConnections(prev => [...prev, newRequest]);
    addToast(`Connection request sent to ${alumni.name}`, 'success');

    setTimeout(() => {
      setConnections(prev =>
        prev.map(c => (c.id === newRequest.id ? { ...c, status: 'accepted' } : c))
      );
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          userId: currentUser.id,
          type: 'connection_accepted',
          title: 'Connection Accepted',
          message: `${alumni.name} (${alumni.jobTitle} @ ${alumni.company}) accepted your connection request!`,
          timestamp: 'Just now',
          read: false
        },
        ...prev
      ]);
      addToast(`${alumni.name} accepted your connection request!`, 'success');
    }, 5000);
  };

  const acceptConnectionRequest = (requestId: string) => {
    setConnections(prev =>
      prev.map(c => (c.id === requestId ? { ...c, status: 'accepted' } : c))
    );
    addToast('Connection request accepted.', 'success');
  };

  const rejectConnectionRequest = (requestId: string) => {
    setConnections(prev =>
      prev.map(c => (c.id === requestId ? { ...c, status: 'rejected' } : c))
    );
    addToast('Connection request rejected.', 'info');
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
        setGlobalSearchQuery
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

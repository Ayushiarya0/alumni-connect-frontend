export type UserRole = 'student' | 'alumni' | 'admin' | 'guest';

export type AppView =
  | 'landing'
  | 'explore'
  | 'map'
  | 'mentors'
  | 'student-dashboard'
  | 'alumni-dashboard'
  | 'admin-dashboard'
  | 'my-profile'
  | 'chat'
  | 'about'
  | 'achievements';

export type VerificationStatus =
  | 'verified'
  | 'pending'
  | 'under_review'
  | 'rejected'
  | 'info_requested'
  | 'suspended';

export interface University {
  id: string;
  name: string;
  shortName: string;
  location: string;
  city?: string;
  state: string;
  logo: string;
  verifiedDomains: string[];
  studentCount: number;
  alumniCount: number;
  coordinates: [number, number]; // [lat, lng]
}

export interface Internship {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  skillsGained: string[];
  certificateUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  link?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  credentialId?: string;
}

export interface AlumniProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  university: string;
  universityId: string;
  degree: string;
  department: string;
  graduationYear: number;
  jobTitle: string;
  company: string;
  companyLogo: string;
  industry: string;
  location: string;
  city: string;
  state: string;
  coordinates: [number, number]; // [lat, lng]
  skills: string[];
  bio: string;
  experienceYears: number;
  careerTrajectory: {
    year: string;
    role: string;
    company: string;
    desc: string;
  }[];
  internships?: Internship[];
  projects?: Project[];
  certifications?: Certification[];
  achievements: string[];
  availableForMentorship: boolean;
  mentorshipTopics: string[];
  mentorshipCategories?: string[]; // e.g. "Career Guidance", "Technical Skills", "Higher Studies", "Placements", "Entrepreneurship"
  verificationStatus: VerificationStatus;
  submittedDocuments?: {
    type: string;
    name: string;
    url: string;
    verified: boolean;
  }[];
  adminNotes?: string;
  linkedinUrl: string;
  rating: number;
  reviewsCount: number;
  matchScore?: number;
  matchReason?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  university: string;
  universityId: string;
  course: string;
  department: string;
  graduationYear: number;
  academicRecords?: {
    gpa: string;
    highlights: string;
  };
  skills: string[];
  interests: string[];
  lookingForGuidanceIn?: string[];
  careerGoals: string;
  location: string;
  bio: string;
  internships: Internship[];
  projects: Project[];
  certifications: Certification[];
  achievements: string[];
  profileCompletion: number;
  verificationStatus: VerificationStatus;
}

export interface ConnectionRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentUniversity: string;
  alumniId: string;
  alumniName: string;
  alumniAvatar: string;
  alumniCompany: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  note?: string;
  createdAt: string;
}

export interface MentorshipRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentUniversity: string;
  alumniId: string;
  alumniName: string;
  alumniCompany: string;
  goal: string;
  areaOfHelp: string; // e.g. "Resume Review", "Career Guidance", "Interview Preparation", "Technical Skills", etc.
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  scheduledDate?: string;
  resumeUrl?: string;
  mentorFeedback?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type:
    | 'connection_request'
    | 'connection_accepted'
    | 'mentorship_request'
    | 'mentorship_accepted'
    | 'new_message'
    | 'verification'
    | 'announcement';
  title: string;
  message: string;
  content?: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalAlumni: number;
  totalStudents: number;
  verifiedAlumni: number;
  pendingAlumni: number;
  activeConnections: number;
  mentorshipSessions: number;
  pendingVerifications: number;
  universityDistribution: { university: string; count: number }[];
  industryDistribution: { industry: string; percentage: number }[];
  monthlyGrowth: { month: string; students: number; alumni: number }[];
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  university: string;
  verificationStatus: VerificationStatus;
  isAuthenticated: boolean;
}

export type AchievementCategory =
  | 'Career Achievement'
  | 'Entrepreneurship'
  | 'Research'
  | 'Academic Excellence'
  | 'Innovation'
  | 'Social Impact'
  | 'Sports'
  | 'Leadership';

export interface AchievementItem {
  id: string;
  personName: string;
  personRole: 'alumni' | 'student';
  title: string;
  category: AchievementCategory;
  description: string;
  year: number;
  institution: string;
  image?: string;
  badge?: string;
  avatar: string;
  companyOrOrg?: string;
}

export interface AlumniEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'Webinar' | 'Networking' | 'Panel Discussion' | 'Workshop' | 'Campus Reunion';
  organizer: string;
  institution: string;
  attendeesCount: number;
  image: string;
  description: string;
  registrationOpen: boolean;
}

export interface CareerOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Remote';
  postedBy: string;
  alumniId: string;
  institution: string;
  salaryOrStipend: string;
  stipend?: string;
  deadline: string;
  skillsRequired: string[];
  description: string;
}


export type UserRole = 'student' | 'alumni' | 'teacher' | 'admin' | 'guest';

export type AppView =
  | 'landing'
  | 'explore'
  | 'map'
  | 'mentors'
  | 'student-dashboard'
  | 'alumni-dashboard'
  | 'teacher-dashboard'
  | 'admin-dashboard'
  | 'my-profile'
  | 'chat'
  | 'about'
  | 'achievements';

export interface ProfileMediaItem {
  id: string;
  url: string;
  caption?: string;
  type: 'image' | 'gif' | 'video';
  uploadedAt: string;
  isAnimated?: boolean;
}

export interface AIMentorMatch {
  mentor: AlumniProfile | TeacherProfile;
  mentorType: 'teacher' | 'alumni';
  matchPercentage: number;
  explanation: {
    summary: string;
    matchingSkills: string[];
    missingSkills: string[];
    sharedInterests: string[];
    relevantExpertise: string[];
    recommendationReason: string;
    criteriaBreakdown: {
      skillOverlap: number;
      learningGoalAlignment: number;
      interestAlignment: number;
      mentorshipTopicAlignment: number;
      experienceRelevance: number;
    };
  };
}

export type VerificationStatus =
  | 'verified'
  | 'pending'
  | 'under_review'
  | 'rejected'
  | 'info_requested'
  | 'suspended';

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced';

export interface StudentSkill {
  name: string;
  proficiency: SkillProficiency;
  category?: string;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  location: string;
  city?: string;
  state: string;
  logo: string;
  website?: string;
  departments?: string[];
  courses?: string[];
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
  credentialUrl?: string;
  certificateFileUrl?: string;
  certificateFileName?: string;
}

export interface StudentAchievement {
  id: string;
  title: string;
  description: string;
  organization: string;
  date: string;
  mediaUrl?: string;
  mediaName?: string;
  externalLink?: string;
}

export interface ResumeDocument {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: 'PDF' | 'DOC' | 'DOCX';
  fileSize?: string;
  lastUpdated: string;
  externalLinks?: {
    resumeUrl?: string;
    googleDriveUrl?: string;
    linkedInUrl?: string;
    portfolioUrl?: string;
  };
}

export interface AIResumeAnalysis {
  targetRole: string;
  currentMatchScore: number;
  strengths: string[];
  skillGaps: string[];
  missingSkills: string[];
  suggestedRoles: string[];
  recommendedIndustries: string[];
  recommendedActions: string[];
}

export interface AICareerRoadmapStep {
  id: string;
  stepNumber: number;
  title: string;
  phase:
    | 'Current Skills'
    | 'Missing Skills'
    | 'Recommended Learning'
    | 'Projects'
    | 'Mentorship'
    | 'Internship'
    | 'Target Career';
  description: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  skillsToAcquire?: string[];
  linkedAlumniIds?: string[];
  linkedOpportunityIds?: string[];
}

export interface MatchScoreBreakdown {
  overallMatch: number;
  skillMatch: number;
  careerMatch: number;
  industryMatch: number;
  experienceMatch: number;
  whyReasons: string[];
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
  mentorshipCategories?: string[];
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
  matchBreakdown?: MatchScoreBreakdown;
  registrationDate?: string;
  subjectsCanTeach?: string[];
  expertise?: string[];
  developmentGoals?: string;
  mediaGallery?: ProfileMediaItem[];
  resumeDoc?: ResumeDocument;
  resumeVisibility?: 'public' | 'private';
}

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  university: string;
  universityId: string;
  department: string;
  designation: string;
  experienceYears: number;
  skills: string[];
  expertise: string[];
  subjectsCanTeach: string[];
  mentorshipTopics: string[];
  officeHours?: string;
  bio: string;
  location: string;
  verificationStatus: VerificationStatus;
  resumeDoc?: ResumeDocument;
  resumeVisibility?: 'public' | 'private';
  mediaGallery?: ProfileMediaItem[];
  availableForMentorship: boolean;
  matchScore?: number;
  matchReason?: string;
  matchBreakdown?: MatchScoreBreakdown;
  registrationDate?: string;
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
  studentSkills?: StudentSkill[];
  interests: string[];
  learningGoals?: string[];
  developmentGoals?: string;
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  preferredMentorshipAreas?: string[];
  lookingForGuidanceIn?: string[];
  careerGoals: string;
  location: string;
  bio: string;
  internships: Internship[];
  projects: Project[];
  certifications: Certification[];
  achievements: string[];
  studentAchievements?: StudentAchievement[];
  resumeDoc?: ResumeDocument;
  resumeVisibility?: 'public' | 'private';
  mediaGallery?: ProfileMediaItem[];
  profileCompletion: number;
  verificationStatus: VerificationStatus;
  isEmailVerified?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  registrationDate?: string;
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
  targetId?: string;
  targetName?: string;
  targetAvatar?: string;
  targetRole?: 'alumni' | 'teacher';
  matchPercentage?: number;
  matchedSkills?: string[];
  matchReason?: string;
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
  areaOfHelp: string;
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
    | 'announcement'
    | 'approval'
    | 'opportunity';
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
  verifiedStudents?: number;
  pendingAlumni: number;
  pendingStudents?: number;
  activeConnections: number;
  mentorshipSessions: number;
  pendingVerifications: number;
  totalUniversities?: number;
  totalJobs?: number;
  totalInternships?: number;
  totalEvents?: number;
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
  isEmailVerified?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
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
  status?: 'approved' | 'pending_review' | 'rejected';
}

export interface CareerOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Remote' | 'Project' | 'Freelance' | 'Startup';
  postedBy: string;
  alumniId: string;
  institution: string;
  salaryOrStipend: string;
  stipend?: string;
  deadline: string;
  skillsRequired: string[];
  description: string;
  status?: 'approved' | 'pending_review' | 'rejected';
  aiMatchScore?: number;
  aiMatchReasons?: string[];
  applied?: boolean;
  saved?: boolean;
}

export interface StartupListing {
  id: string;
  name: string;
  founderName: string;
  founderId: string;
  university: string;
  industry: string;
  tagline: string;
  description: string;
  website?: string;
  stage: 'Idea' | 'Early Stage' | 'Seed' | 'Growth' | 'Profitable';
  seeking: string[]; // e.g. "Interns", "Co-founder", "Investors", "Mentors"
  status: 'approved' | 'pending_review' | 'rejected';
  createdAt: string;
}

export interface FeedbackReport {
  id: string;
  submittedBy: string;
  userRole: UserRole;
  category: 'Platform Feedback' | 'Bug Report' | 'Content Moderation' | 'Feature Request';
  subject: string;
  message: string;
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
}


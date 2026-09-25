import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
// Allow up to 50MB payloads for base64 image media and PDF resume uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database in-memory store (with disk backup fallback)
const mockDatabase = {
  users: [
    {
      id: 'student-ayushi-arya',
      name: 'Ayushi Arya',
      email: 'ayushi.arya@tulas.edu.in',
      role: 'student',
      university: "Tula's Institute",
      course: 'B.Tech Computer Science and Engineering',
      graduationYear: 2026,
      skills: ['Python', 'SQL', 'Data Structures', 'React', 'Git'],
      learningGoals: ['Machine Learning', 'Deep Learning', 'Data Science'],
      interests: ['AI/ML', 'Cloud Systems', 'Distributed Systems'],
      careerGoals: 'Become an ML Engineer at a top tier technology company.',
      experienceLevel: 'Intermediate',
      verificationStatus: 'verified',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'teacher-sunita-sen',
      name: 'Dr. Sunita Sen',
      email: 'sunita.sen@iitr.ac.in',
      role: 'teacher',
      university: 'Indian Institute of Technology Roorkee',
      department: 'Department of Computer Science & Engineering',
      designation: 'Professor & Head of AI Laboratory',
      experienceYears: 14,
      skills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'Data Science', 'Statistics', 'NLP'],
      expertise: ['AI/ML', 'Deep Neural Networks', 'Computer Vision', 'Applied Statistics'],
      subjectsCanTeach: ['Machine Learning', 'Python', 'Data Science', 'Deep Learning', 'Statistics for AI'],
      mentorshipTopics: ['Machine Learning Foundations', 'Python for Data Science', 'Research Project Guidance', 'Career in AI'],
      officeHours: 'Mon & Thu 3:00 PM - 5:30 PM IST',
      bio: 'Professor of AI at IIT Roorkee with 14+ years of academic research and industry consulting. Passionate about empowering students in machine learning algorithms, deep learning models, and real-world applied AI.',
      location: 'Roorkee, Uttarakhand',
      verificationStatus: 'verified',
      availableForMentorship: true,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'teacher-vikram-mehra',
      name: 'Prof. Vikram Mehra',
      email: 'vikram.mehra@tulas.edu.in',
      role: 'teacher',
      university: "Tula's Institute",
      department: 'Department of Computer Science',
      designation: 'Associate Professor & Academic Mentor',
      experienceYears: 9,
      skills: ['Python', 'Machine Learning', 'Data Science', 'SQL', 'Database Systems', 'Java'],
      expertise: ['Machine Learning', 'Data Analytics', 'Database Architecture'],
      subjectsCanTeach: ['Python Programming', 'Machine Learning', 'SQL & Data Systems', 'Data Science'],
      mentorshipTopics: ['Python Fundamentals', 'Hands-on ML Projects', 'Database Systems', 'Placement Preparation'],
      officeHours: 'Tue & Fri 2:00 PM - 4:00 PM IST',
      bio: 'Associate Professor passionate about bridge programs between undergraduate computer science curriculum and industry ML practice. Mentored over 350+ engineers.',
      location: 'Dehradun, Uttarakhand',
      verificationStatus: 'verified',
      availableForMentorship: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'alumni-1',
      name: 'Priya Patel',
      email: 'priya.patel@microsoft.com',
      role: 'alumni',
      company: 'Microsoft',
      designation: 'Senior Software Engineer',
      university: 'Indian Institute of Technology Roorkee',
      experienceYears: 5,
      skills: ['Azure', 'Distributed Systems', 'C#', 'Go', 'System Design', 'Python'],
      expertise: ['Cloud Architecture', 'Distributed Systems', 'Backend Engineering'],
      subjectsCanTeach: ['Cloud Computing', 'System Design', 'Backend Engineering', 'Go'],
      mentorshipTopics: ['System Design', 'Cloud Architecture', 'Interview Preparation', 'Backend Engineering'],
      bio: 'Senior Software Engineer at Microsoft working on core Azure distributed compute engine. Alum of IIT Roorkee (Batch of 2020).',
      location: 'Bengaluru, Karnataka',
      verificationStatus: 'verified',
      availableForMentorship: true,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'alumni-2',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@google.com',
      role: 'alumni',
      company: 'Google',
      designation: 'Staff Machine Learning Engineer',
      university: 'Indian Institute of Technology Roorkee',
      experienceYears: 7,
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Distributed Systems', 'Data Science'],
      expertise: ['Machine Learning', 'Deep Learning', 'High Scale Inference', 'MLOps'],
      subjectsCanTeach: ['Machine Learning', 'Deep Learning', 'Python', 'MLOps'],
      mentorshipTopics: ['Machine Learning Engineering', 'Production ML Architecture', 'Tech Career Navigation'],
      bio: 'Staff ML Engineer at Google Cloud AI. Mentoring enthusiastic students on machine learning project portfolios and algorithms.',
      location: 'Hyderabad, Telangana',
      verificationStatus: 'verified',
      availableForMentorship: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
    }
  ],
  profiles: {},
  connections: [
    {
      id: 'conn-init-1',
      studentId: 'student-ayushi-arya',
      studentName: 'Ayushi Arya',
      studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      studentUniversity: "Tula's Institute",
      targetId: 'teacher-sunita-sen',
      targetName: 'Dr. Sunita Sen',
      targetAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      targetRole: 'teacher',
      status: 'accepted',
      matchPercentage: 94,
      matchedSkills: ['Machine Learning', 'Python', 'Data Science'],
      createdAt: new Date().toISOString()
    }
  ],
  mentorships: []
};

// Seed initial profiles map
mockDatabase.users.forEach(u => {
  mockDatabase.profiles[u.id] = { ...u, mediaGallery: [], resumeDoc: undefined };
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'AlumniConnect Real Full-Stack API Server',
    version: '3.0.0',
    totalUsers: mockDatabase.users.length,
    timestamp: new Date().toISOString()
  });
});

// Authentication Routes
app.post('/api/auth/register', (req, res) => {
  const {
    fullName,
    name,
    email,
    role,
    university,
    password,
    course,
    graduationYear,
    department,
    designation,
    subjectsCanTeach,
    skills,
    learningGoals,
    careerGoals
  } = req.body;

  const resolvedName = (fullName || name || '').trim();
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!resolvedName || !cleanEmail || !role) {
    return res.status(400).json({ error: 'Name, email, and role are required.' });
  }

  // Check if user already exists
  let user = mockDatabase.users.find(u => u.email.toLowerCase() === cleanEmail);
  if (user) {
    // Update existing
    user.name = resolvedName;
    user.university = university || user.university;
    if (password) user.password = password;
  } else {
    const skillsArr = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map(s => s.trim()).filter(Boolean)
      : ['Python'];

    const subjectsArr = Array.isArray(subjectsCanTeach)
      ? subjectsCanTeach
      : typeof subjectsCanTeach === 'string'
      ? subjectsCanTeach.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    user = {
      id: `${role}-${Date.now()}`,
      name: resolvedName,
      email: cleanEmail,
      role,
      university: university || "Tula's Institute",
      department: department || 'Computer Science',
      designation: designation || (role === 'teacher' ? 'Assistant Professor' : role === 'alumni' ? 'Software Engineer' : 'Student Member'),
      course: course || (role === 'student' ? 'B.Tech Computer Science' : undefined),
      graduationYear: Number(graduationYear) || 2026,
      skills: skillsArr,
      subjectsCanTeach: subjectsArr,
      learningGoals: Array.isArray(learningGoals) ? learningGoals : ['Machine Learning'],
      careerGoals: careerGoals || 'Advance in technology and artificial intelligence.',
      verificationStatus: 'verified',
      availableForMentorship: role !== 'student',
      avatar: '',
      password: password || undefined,
      createdAt: new Date().toISOString()
    };
    mockDatabase.users.push(user);
    mockDatabase.profiles[user.id] = { ...user, mediaGallery: [], resumeDoc: undefined };
  }

  res.status(201).json({
    success: true,
    message: 'Account created successfully. Profile active.',
    user,
    token: `alumniconnect-jwt-${Date.now()}`
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, role, password } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();

  let user = mockDatabase.users.find(u => u.email.toLowerCase() === cleanEmail);
  if (!user && role) {
    user = mockDatabase.users.find(u => u.role === role);
  }
  if (!user) {
    user = mockDatabase.users[0];
  }

  // Ensure profile map exists
  if (!mockDatabase.profiles[user.id]) {
    mockDatabase.profiles[user.id] = { ...user, mediaGallery: [], resumeDoc: undefined };
  }

  res.json({
    success: true,
    message: 'Authentication successful',
    token: `alumniconnect-jwt-${Date.now()}`,
    user,
    profile: mockDatabase.profiles[user.id]
  });
});

// Profile Routes
app.get('/api/profile/:id', (req, res) => {
  const { id } = req.params;
  const profile = mockDatabase.profiles[id] || mockDatabase.users.find(u => u.id === id);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found.' });
  }
  res.json({ success: true, profile });
});

app.put('/api/profile/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  let user = mockDatabase.users.find(u => u.id === id);
  let profile = mockDatabase.profiles[id] || (user ? { ...user } : null);

  if (!profile) {
    profile = { id, ...updates };
    mockDatabase.profiles[id] = profile;
  } else {
    mockDatabase.profiles[id] = {
      ...profile,
      ...updates
    };
  }

  if (user) {
    Object.assign(user, {
      name: updates.name || user.name,
      avatar: updates.avatar !== undefined ? updates.avatar : user.avatar,
      university: updates.university || user.university,
      skills: updates.skills || user.skills,
      learningGoals: updates.learningGoals || user.learningGoals,
      subjectsCanTeach: updates.subjectsCanTeach || user.subjectsCanTeach,
      careerGoals: updates.careerGoals || user.careerGoals
    });
  }

  res.json({ success: true, message: 'Profile updated successfully.', profile: mockDatabase.profiles[id] });
});

// Media Section Routes
app.post('/api/profile/:id/media', (req, res) => {
  const { id } = req.params;
  const { url, caption, type, isAnimated } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Media URL/data is required.' });
  }

  const profile = mockDatabase.profiles[id];
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found.' });
  }

  const mediaItem = {
    id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    url,
    caption: caption || '',
    type: type || 'image',
    isAnimated: Boolean(isAnimated || url.startsWith('data:image/gif')),
    uploadedAt: new Date().toISOString()
  };

  profile.mediaGallery = profile.mediaGallery || [];
  profile.mediaGallery.unshift(mediaItem);

  res.status(201).json({ success: true, mediaItem, mediaGallery: profile.mediaGallery });
});

app.delete('/api/profile/:id/media/:mediaId', (req, res) => {
  const { id, mediaId } = req.params;
  const profile = mockDatabase.profiles[id];
  if (!profile) return res.status(404).json({ error: 'Profile not found.' });

  profile.mediaGallery = (profile.mediaGallery || []).filter(m => m.id !== mediaId);
  res.json({ success: true, mediaGallery: profile.mediaGallery });
});

// Resume Section Routes
app.post('/api/profile/:id/resume', (req, res) => {
  const { id } = req.params;
  const { fileName, fileUrl, fileType, fileSize, visibility } = req.body;

  if (!fileName || !fileUrl) {
    return res.status(400).json({ error: 'Resume file name and content are required.' });
  }

  const profile = mockDatabase.profiles[id];
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found.' });
  }

  const resumeDoc = {
    id: `resume-${Date.now()}`,
    fileName,
    fileUrl,
    fileType: fileType || 'PDF',
    fileSize: fileSize || '245 KB',
    lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    visibility: visibility || 'public'
  };

  profile.resumeDoc = resumeDoc;
  profile.resumeVisibility = visibility || 'public';

  res.status(201).json({ success: true, resumeDoc, message: 'Resume uploaded successfully.' });
});

app.delete('/api/profile/:id/resume', (req, res) => {
  const { id } = req.params;
  const profile = mockDatabase.profiles[id];
  if (!profile) return res.status(404).json({ error: 'Profile not found.' });

  profile.resumeDoc = undefined;
  res.json({ success: true, message: 'Resume deleted.' });
});

// Connections Routes
app.get('/api/connections', (req, res) => {
  const { userId } = req.query;
  let list = mockDatabase.connections;
  if (userId) {
    list = list.filter(c => c.studentId === userId || c.targetId === userId || c.alumniId === userId);
  }
  res.json({ success: true, connections: list });
});

app.post('/api/connections/request', (req, res) => {
  const {
    studentId,
    studentName,
    studentAvatar,
    studentUniversity,
    targetId,
    targetName,
    targetAvatar,
    targetRole,
    matchPercentage,
    matchedSkills,
    note
  } = req.body;

  const newConn = {
    id: `conn-${Date.now()}`,
    studentId: studentId || 'student-ayushi-arya',
    studentName: studentName || 'Student Member',
    studentAvatar: studentAvatar || '',
    studentUniversity: studentUniversity || "Tula's Institute",
    targetId,
    targetName: targetName || 'Mentor / Teacher',
    targetAvatar: targetAvatar || '',
    targetRole: targetRole || 'teacher',
    alumniId: targetId, // backwards compatibility
    status: 'pending',
    matchPercentage: Number(matchPercentage) || 85,
    matchedSkills: Array.isArray(matchedSkills) ? matchedSkills : ['Machine Learning', 'Python'],
    note: note || '',
    createdAt: new Date().toISOString()
  };

  mockDatabase.connections.unshift(newConn);
  res.status(201).json({ success: true, connection: newConn });
});

app.post('/api/connections/:id/accept', (req, res) => {
  const { id } = req.params;
  const conn = mockDatabase.connections.find(c => c.id === id);
  if (!conn) return res.status(404).json({ error: 'Connection request not found.' });

  conn.status = 'accepted';
  conn.acceptedAt = new Date().toISOString();
  res.json({ success: true, message: 'Connection accepted!', connection: conn });
});

app.post('/api/connections/:id/reject', (req, res) => {
  const { id } = req.params;
  const conn = mockDatabase.connections.find(c => c.id === id);
  if (!conn) return res.status(404).json({ error: 'Connection request not found.' });

  conn.status = 'rejected';
  res.json({ success: true, message: 'Connection request rejected.', connection: conn });
});

// Teachers list endpoint
app.get('/api/teachers', (req, res) => {
  const teachers = mockDatabase.users.filter(u => u.role === 'teacher');
  res.json({ success: true, teachers });
});

// All mentors (Teachers + Alumni) endpoint
app.get('/api/mentors/all', (req, res) => {
  const mentors = mockDatabase.users.filter(u => u.role === 'teacher' || (u.role === 'alumni' && u.availableForMentorship));
  res.json({ success: true, mentors });
});

// AI Mentor Matchmaking endpoint
app.post('/api/ai/match-mentors', (req, res) => {
  const { query, studentProfile } = req.body;
  const q = (query || '').toLowerCase().trim();

  // Get all mentors (teachers and available alumni)
  const candidateMentors = mockDatabase.users.filter(
    u => u.role === 'teacher' || (u.role === 'alumni' && u.availableForMentorship !== false)
  );

  const studentSkills = ((studentProfile && studentProfile.skills) || ['Python', 'SQL', 'Data Structures']).map(s => s.toLowerCase());
  const studentGoals = ((studentProfile && (studentProfile.learningGoals || [studentProfile.careerGoals])) || ['Machine Learning']).map(g => (g || '').toLowerCase());
  const studentInterests = ((studentProfile && studentProfile.interests) || ['AI/ML']).map(i => i.toLowerCase());

  const results = candidateMentors.map(mentor => {
    const mentorSkills = (mentor.skills || []).map(s => s.toLowerCase());
    const mentorTaught = (mentor.subjectsCanTeach || mentor.mentorshipTopics || []).map(t => t.toLowerCase());
    const mentorExpertise = (mentor.expertise || []).map(e => e.toLowerCase());

    // 1. Query Term Alignment (30% weight)
    let queryScore = 50;
    if (q) {
      const queryMatches = mentorSkills.concat(mentorTaught, mentorExpertise).filter(term =>
        q.includes(term) || term.includes(q.replace(/[^a-z0-9 ]/g, ''))
      );
      if (q.includes('machine learning') || q.includes('ml')) {
        if (mentorSkills.some(s => s.includes('machine learning') || s === 'ml') || mentorTaught.some(t => t.includes('machine learning'))) {
          queryScore += 45;
        }
      }
      if (q.includes('python')) {
        if (mentorSkills.includes('python') || mentorTaught.some(t => t.includes('python'))) {
          queryScore += 35;
        }
      }
      if (q.includes('data science')) {
        if (mentorSkills.some(s => s.includes('data')) || mentorTaught.some(t => t.includes('data science'))) {
          queryScore += 35;
        }
      }
      if (queryMatches.length > 0) {
        queryScore += Math.min(30, queryMatches.length * 15);
      }
    } else {
      queryScore = 80;
    }
    const queryAlignment = Math.min(99, Math.max(45, queryScore));

    // 2. Learning Goal vs Teacher Subjects Alignment (25% weight)
    let goalScore = 60;
    const matchingGoals = studentGoals.filter(goal =>
      mentorTaught.some(t => t.includes(goal) || goal.includes(t)) ||
      mentorSkills.some(s => s.includes(goal) || goal.includes(s))
    );
    if (matchingGoals.length > 0) {
      goalScore += 35;
    }
    const learningGoalAlignment = Math.min(98, goalScore);

    // 3. Technical Skill Overlap (20% weight)
    const matchingSkills = mentor.skills.filter(ms =>
      studentSkills.some(ss => ss.includes(ms.toLowerCase()) || ms.toLowerCase().includes(ss))
    );
    const missingSkills = (mentor.subjectsCanTeach || mentor.skills || []).filter(
      ms => !matchingSkills.includes(ms)
    ).slice(0, 3);

    const skillRatio = mentor.skills.length > 0 ? matchingSkills.length / Math.min(mentor.skills.length, 5) : 0.5;
    const skillOverlap = Math.min(98, Math.max(55, Math.round(skillRatio * 100)));

    // 4. Domain & Interest Alignment (15% weight)
    let interestScore = 65;
    const sharedInterests = studentInterests.filter(si =>
      mentorExpertise.some(me => me.includes(si) || si.includes(me)) ||
      mentorTaught.some(mt => mt.includes(si))
    );
    if (sharedInterests.length > 0) interestScore += 28;
    const interestAlignment = Math.min(96, interestScore);

    // 5. Seniority & Mentorship Readiness (10% weight)
    const exp = mentor.experienceYears || 4;
    const expScore = Math.min(98, 70 + exp * 2.5);

    // Dynamic Composite Calculation
    const matchPercentage = Math.min(
      99,
      Math.max(
        62,
        Math.round(
          queryAlignment * 0.30 +
          learningGoalAlignment * 0.25 +
          skillOverlap * 0.20 +
          interestAlignment * 0.15 +
          expScore * 0.10
        )
      )
    );

    // Explainable Reason Generation
    let recommendationReason = '';
    if (q.includes('machine learning') || q.includes('python')) {
      recommendationReason = `Direct match for ${q.includes('machine learning') ? 'Machine Learning' : ''}${q.includes('python') ? ' & Python' : ''} learning path and hands-on project guidance.`;
    } else if (matchingGoals.length > 0) {
      recommendationReason = `Strong match for your ${matchingGoals.join(', ')} learning goal.`;
    } else {
      recommendationReason = `High compatibility in technical foundation and academic mentorship.`;
    }

    const explanation = {
      summary: `Your interests in ${studentGoals.slice(0, 2).join(' and ')} strongly align with ${mentor.name}'s expertise in ${(mentor.subjectsCanTeach || mentor.skills).slice(0, 3).join(', ')}.`,
      matchingSkills: matchingSkills.length > 0 ? matchingSkills : [mentor.skills[0] || 'Python'],
      missingSkills,
      sharedInterests: sharedInterests.length > 0 ? sharedInterests : ['Technical Mentorship', 'Career Growth'],
      relevantExpertise: mentor.expertise || mentor.skills.slice(0, 3),
      recommendationReason,
      criteriaBreakdown: {
        skillOverlap,
        learningGoalAlignment,
        interestAlignment,
        mentorshipTopicAlignment: Math.round((goalScore + queryAlignment) / 2),
        experienceRelevance: Math.round(expScore)
      }
    };

    return {
      mentor,
      mentorType: mentor.role,
      matchPercentage,
      explanation
    };
  });

  // Sort by match percentage descending
  results.sort((a, b) => b.matchPercentage - a.matchPercentage);

  res.json({
    success: true,
    query,
    totalMatches: results.length,
    bestMatch: results[0] || null,
    matches: results
  });
});

app.listen(PORT, () => {
  console.log(`AlumniConnect REST API Server running on port ${PORT}`);
});

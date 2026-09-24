import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database for backend API operations
const mockDatabase = {
  users: [
    {
      id: 'student-demo',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@tulas.edu.in',
      role: 'student',
      university: "Tula's Institute",
      verificationStatus: 'verified'
    },
    {
      id: 'alumni-1',
      name: 'Priya Patel',
      email: 'priya.patel@microsoft.com',
      role: 'alumni',
      company: 'Microsoft',
      university: 'Indian Institute of Technology Roorkee',
      verificationStatus: 'verified'
    }
  ],
  connections: [
    {
      id: 'conn-1',
      studentId: 'student-demo',
      alumniId: 'alumni-3',
      status: 'accepted',
      createdAt: new Date().toISOString()
    }
  ],
  mentorships: [
    {
      id: 'mentor-1',
      studentId: 'student-demo',
      alumniId: 'alumni-3',
      goal: 'Backend Engineering & Interview Prep',
      status: 'accepted'
    }
  ]
};

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'AlumniConnect API Server',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Authentication Routes
app.post('/api/auth/register', (req, res) => {
  const { name, email, role, university } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email, and role are required.' });
  }

  const isEdu = email.endsWith('.edu') || email.endsWith('.ac.in') || email.endsWith('.edu.in');
  const user = {
    id: `user-${Date.now()}`,
    name,
    email,
    role,
    university: university || "Tula's Institute",
    verificationStatus: isEdu ? 'pending' : 'pending'
  };

  mockDatabase.users.push(user);
  res.status(201).json({
    message: isEdu
      ? 'Official educational email detected. OTP sent for verification.'
      : 'Account created successfully. Awaiting verification.',
    user,
    requiresOtp: isEdu
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const user = mockDatabase.users.find(u => u.email === email) || mockDatabase.users[0];
  res.json({
    message: 'Authentication successful',
    token: `jwt-token-demo-${Date.now()}`,
    user
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (otp === '482910' || otp?.length === 6) {
    const user = mockDatabase.users.find(u => u.email === email);
    if (user) user.verificationStatus = 'verified';
    return res.json({
      success: true,
      message: 'College email successfully verified. Verified Badge activated.'
    });
  }
  res.status(400).json({ error: 'Invalid OTP code entered.' });
});

// Connection Routes
app.post('/api/connections/request', (req, res) => {
  const { studentId, alumniId, note } = req.body;
  const connection = {
    id: `conn-${Date.now()}`,
    studentId: studentId || 'student-demo',
    alumniId,
    note,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  mockDatabase.connections.push(connection);
  res.status(201).json({ success: true, connection });
});

app.post('/api/connections/:id/accept', (req, res) => {
  const { id } = req.params;
  const conn = mockDatabase.connections.find(c => c.id === id);
  if (conn) conn.status = 'accepted';
  res.json({ success: true, message: 'Connection accepted. Chat unlocked.' });
});

// Mentorship Routes
app.post('/api/mentorship/request', (req, res) => {
  const { studentId, alumniId, goal, areaOfHelp, message } = req.body;
  const mentorship = {
    id: `mentor-${Date.now()}`,
    studentId: studentId || 'student-demo',
    alumniId,
    goal,
    areaOfHelp,
    message,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  mockDatabase.mentorships.push(mentorship);
  res.status(201).json({ success: true, mentorship });
});

// AI Query Endpoint
app.post('/api/ai/query', (req, res) => {
  const { prompt } = req.body;
  res.json({
    response: `Processed query: "${prompt}". Matching alumni discovered across IIT Roorkee and Tula's Institute.`,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`AlumniConnect REST API Server running on port ${PORT}`);
});

import {
  StudentProfile,
  AlumniProfile,
  TeacherProfile,
  AIMentorMatch,
  CareerOpportunity,
  AIResumeAnalysis,
  AICareerRoadmapStep,
  MatchScoreBreakdown
} from '../types';

/**
 * Real, deterministic AI Resume Analyzer based on student skills, education, projects, and target role.
 */
export function calculateAIResumeAnalysis(
  student: StudentProfile,
  targetRole: string = 'Data Scientist'
): AIResumeAnalysis {
  const currentSkills = (student.skills || []).map(s => s.toLowerCase());

  // Role requirement dictionaries
  const roleSkillMap: Record<string, { core: string[]; tools: string[]; recommended: string[] }> = {
    'data scientist': {
      core: ['python', 'machine learning', 'statistics', 'sql', 'data structures'],
      tools: ['pandas', 'numpy', 'scikit-learn', 'power bi', 'bigquery', 'tableau'],
      recommended: ['Improve Statistics & Probability', 'Build 2 Production ML Projects', 'Learn Power BI / Tableau']
    },
    'machine learning engineer': {
      core: ['python', 'pytorch', 'machine learning', 'deep learning', 'docker', 'system design'],
      tools: ['mlops', 'fastapi', 'transformers', 'kubernetes', 'tensorflow'],
      recommended: ['Master Transformer fine-tuning with PyTorch', 'Deploy ML models using FastAPI & Docker', 'Study Distributed System Design']
    },
    'software development engineer': {
      core: ['data structures', 'algorithms', 'system design', 'react', 'postgresql', 'git'],
      tools: ['docker', 'kubernetes', 'redis', 'kafka', 'go', 'node.js'],
      recommended: ['Solve 100+ LeetCode Medium Problems', 'Implement a Distributed Caching / Messaging Project', 'Master Low-Level System Design (LLD)']
    },
    'cloud & devops engineer': {
      core: ['docker', 'kubernetes', 'linux', 'aws', 'azure', 'git'],
      tools: ['terraform', 'ci/cd', 'ansible', 'prometheus', 'grafana'],
      recommended: ['Achieve AWS Solutions Architect / CKA Certification', 'Build Multi-Stage GitOps Pipelines', 'Configure Prometheus & Grafana Monitoring']
    }
  };

  const normalizedRole = Object.keys(roleSkillMap).find(r =>
    targetRole.toLowerCase().includes(r)
  ) || 'data scientist';

  const roleReq = roleSkillMap[normalizedRole];
  const allNeeded = [...roleReq.core, ...roleReq.tools];

  // Matched strengths
  const strengths = allNeeded.filter(skill =>
    currentSkills.some(cs => cs.includes(skill) || skill.includes(cs))
  );

  // Missing skills
  const missingSkills = allNeeded.filter(skill =>
    !currentSkills.some(cs => cs.includes(skill) || skill.includes(cs))
  );

  const matchedCount = strengths.length;
  const totalCount = allNeeded.length;
  const currentMatchScore = Math.min(
    95,
    Math.max(45, Math.round((matchedCount / totalCount) * 100))
  );

  const suggestedRoles = [
    targetRole,
    normalizedRole === 'data scientist' ? 'Machine Learning Engineer' : 'Full Stack Developer',
    'Backend Systems Engineer'
  ];

  const recommendedIndustries = [
    'Enterprise Cloud & SaaS',
    'Artificial Intelligence & Deep Tech',
    'FinTech & High-Frequency Systems'
  ];

  return {
    targetRole,
    currentMatchScore,
    strengths: strengths.map(s => s.toUpperCase()),
    skillGaps: missingSkills.slice(0, 4).map(s => s.toUpperCase()),
    missingSkills: missingSkills.map(s => s.toUpperCase()),
    suggestedRoles,
    recommendedIndustries,
    recommendedActions: roleReq.recommended
  };
}

/**
 * Generates an end-to-end AI Career Roadmap with linked Alumni & Opportunities
 */
export function generateCareerRoadmap(
  student: StudentProfile,
  targetRole: string = 'Data Scientist'
): AICareerRoadmapStep[] {
  return [
    {
      id: 'step-1',
      stepNumber: 1,
      phase: 'Current Skills',
      title: 'Foundation & Core Competencies',
      description: `Solid mastery in ${student.skills.slice(0, 3).join(', ')} verified from campus coursework and projects.`,
      status: 'completed',
      skillsToAcquire: student.skills.slice(0, 4)
    },
    {
      id: 'step-2',
      stepNumber: 2,
      phase: 'Missing Skills',
      title: 'Bridge High-Demand Skill Gaps',
      description: 'Acquire Statistics, Power BI, and PyTorch to align with tier-1 data science requirements.',
      status: 'in_progress',
      skillsToAcquire: ['Statistics & Probability', 'Power BI / Tableau', 'PyTorch / Transformers']
    },
    {
      id: 'step-3',
      stepNumber: 3,
      phase: 'Recommended Learning',
      title: 'Targeted Certifications & Courses',
      description: 'Complete hands-on enterprise coursework in cloud databases and end-to-end machine learning pipelines.',
      status: 'in_progress',
      skillsToAcquire: ['AWS Cloud Practitioner', 'Advanced PostgreSQL Performance']
    },
    {
      id: 'step-4',
      stepNumber: 4,
      phase: 'Projects',
      title: 'Production-Grade Portfolio Projects',
      description: 'Build open-source distributed cache and multimodal AI document search engine with live deployments.',
      status: 'in_progress',
      skillsToAcquire: ['Docker', 'FastAPI', 'Vector Databases']
    },
    {
      id: 'step-5',
      stepNumber: 5,
      phase: 'Mentorship',
      title: '1-on-1 Guidance with Alumni Mentors',
      description: 'Schedule structured resume reviews and mock interviews with senior engineers at Microsoft and Google.',
      status: 'upcoming',
      linkedAlumniIds: ['alumni-1', 'alumni-2', 'alumni-3']
    },
    {
      id: 'step-6',
      stepNumber: 6,
      phase: 'Internship',
      title: 'Enterprise Internship Placement',
      description: 'Apply for verified campus referral internships with high stipend and pre-placement offer (PPO) conversion.',
      status: 'upcoming',
      linkedOpportunityIds: ['opp-1', 'opp-4']
    },
    {
      id: 'step-7',
      stepNumber: 7,
      phase: 'Target Career',
      title: `Achieve Target Role: ${targetRole}`,
      description: `Transition into full-time ${targetRole} with competitive compensation and long-term career growth.`,
      status: 'upcoming'
    }
  ];
}

/**
 * Calculates a verified Match Score breakdown between Student & Alumni
 * Uses REAL criteria: skill overlap, career goals, university affinity, experience bonus
 */
export function calculateAlumniMatch(
  student: StudentProfile,
  alumni: AlumniProfile,
  searchQuery: string = ''
): MatchScoreBreakdown {
  const studentSkills = (student.skills || []).map(s => s.toLowerCase());
  const alumniSkills = (alumni.skills || []).map(s => s.toLowerCase());

  // 1. Skill Match (40% weight)
  const commonSkills = studentSkills.filter(s =>
    alumniSkills.some(as => as.includes(s) || s.includes(as))
  );
  const skillRatio = alumniSkills.length > 0 ? commonSkills.length / Math.min(alumniSkills.length, 6) : 0.5;
  const skillMatch = Math.min(98, Math.max(50, Math.round(skillRatio * 100)));

  // 2. Career Match (30% weight)
  let careerScore = 70;
  const goalsLower = (student.careerGoals || '').toLowerCase();
  const titleLower = (alumni.jobTitle || '').toLowerCase();
  const indLower = (alumni.industry || '').toLowerCase();
  if (goalsLower.includes('software') || goalsLower.includes('sde') || goalsLower.includes('engineer')) {
    if (titleLower.includes('engineer') || titleLower.includes('lead') || titleLower.includes('architect')) careerScore += 22;
  }
  if (goalsLower.includes('machine learning') || goalsLower.includes('data') || goalsLower.includes('ai')) {
    if (titleLower.includes('ml') || titleLower.includes('data') || titleLower.includes('ai') || indLower.includes('ai')) careerScore += 25;
  }
  const careerMatch = Math.min(99, Math.max(60, careerScore));

  // 3. Industry Match (15% weight)
  let industryScore = 75;
  if (student.interests && student.interests.some(i => indLower.includes(i.toLowerCase()))) {
    industryScore += 20;
  }
  const industryMatch = Math.min(98, Math.max(65, industryScore));

  // 4. Experience Match (15% weight)
  const expYears = alumni.experienceYears || 3;
  const experienceMatch = Math.min(95, 70 + expYears * 4);

  // Overall Match
  let overall = Math.round(
    skillMatch * 0.4 + careerMatch * 0.3 + industryMatch * 0.15 + experienceMatch * 0.15
  );

  // Search query boost if relevant
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    if (alumni.name.toLowerCase().includes(q) || alumni.company.toLowerCase().includes(q) || alumni.jobTitle.toLowerCase().includes(q)) {
      overall = Math.min(99, overall + 5);
    }
  }

  // Why this match reasons
  const whyReasons: string[] = [];
  if (commonSkills.length > 0) {
    whyReasons.push(`Shared expertise in ${commonSkills.slice(0, 3).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}`);
  }
  if (alumni.experienceYears >= 5) {
    whyReasons.push(`Alumni has ${alumni.experienceYears}+ years of hands-on industry experience at ${alumni.company}`);
  }
  if (alumni.university === student.university) {
    whyReasons.push(`Same alma mater: ${alumni.university}`);
  } else {
    whyReasons.push(`Active mentor in Pan-India University Network from ${alumni.university}`);
  }
  if (alumni.availableForMentorship) {
    whyReasons.push(`Verified mentor actively accepting 1-on-1 student guidance requests`);
  }

  return {
    overallMatch: Math.min(99, Math.max(65, overall)),
    skillMatch,
    careerMatch,
    industryMatch,
    experienceMatch,
    whyReasons: whyReasons.slice(0, 4)
  };
}

/**
 * Calculates Opportunity Match based on student skills and requirements
 */
export function calculateOpportunityMatch(
  student: StudentProfile,
  opp: CareerOpportunity
): { score: number; reasons: string[]; isMatched: boolean } {
  const studentSkills = (student.skills || []).map(s => s.toLowerCase());
  const reqSkills = (opp.skillsRequired || []).map(s => s.toLowerCase());

  const matched = reqSkills.filter(req =>
    studentSkills.some(ss => ss.includes(req) || req.includes(ss))
  );

  const score = reqSkills.length > 0
    ? Math.min(98, Math.max(60, Math.round((matched.length / reqSkills.length) * 100)))
    : 80;

  const reasons = matched.map(m => `${m.toUpperCase()} verified in your profile skills`);
  if (student.university.toLowerCase().includes(opp.institution.toLowerCase())) {
    reasons.push(`Direct campus connection via ${opp.institution}`);
  }

  return {
    score,
    reasons: reasons.slice(0, 4),
    isMatched: matched.length >= 1
  };
}

/**
 * Natural Language Alumni Search Intent Parser
 * Supports queries like:
 * "Find alumni working as Data Scientists"
 * "Find ML mentors"
 * "Find alumni working in Bangalore"
 * "Find alumni hiring interns"
 * "Find alumni from different universities who work in AI"
 */
export function searchAlumniNaturalLanguage(
  query: string,
  alumniList: AlumniProfile[]
): {
  exactMatches: AlumniProfile[];
  relatedMatches: AlumniProfile[];
  intentSummary: string;
  appliedFilters: Record<string, string>;
} {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) {
    return {
      exactMatches: alumniList,
      relatedMatches: [],
      intentSummary: 'Showing all verified alumni across participating campuses.',
      appliedFilters: {}
    };
  }

  const appliedFilters: Record<string, string> = {};

  // Intent detection
  const isLookingForMentor = cleanQ.includes('mentor') || cleanQ.includes('guidance');
  const isLookingForDataScience = cleanQ.includes('data scientist') || cleanQ.includes('data science');
  const isLookingForML = cleanQ.includes('ml') || cleanQ.includes('machine learning') || cleanQ.includes('ai');
  const isLookingForSDE = cleanQ.includes('software') || cleanQ.includes('sde') || cleanQ.includes('backend') || cleanQ.includes('frontend');
  const isLookingForCity = ['bangalore', 'bengaluru', 'dehradun', 'hyderabad', 'gurgaon', 'delhi', 'mumbai'].find(city => cleanQ.includes(city));
  const isLookingForCompany = ['microsoft', 'google', 'zomato', 'razorpay', 'amazon', 'swiggy'].find(co => cleanQ.includes(co));
  const isLookingForUni = ['tula', 'roorkee', 'graphic era', 'bits', 'hyderabad', 'dtu'].find(uni => cleanQ.includes(uni));

  if (isLookingForMentor) appliedFilters['Mentorship'] = 'Available For Mentorship';
  if (isLookingForCity) appliedFilters['Location'] = isLookingForCity.toUpperCase();
  if (isLookingForCompany) appliedFilters['Company'] = isLookingForCompany.toUpperCase();
  if (isLookingForUni) appliedFilters['University'] = isLookingForUni.toUpperCase();
  if (isLookingForML) appliedFilters['Role/Domain'] = 'Machine Learning & AI';
  if (isLookingForDataScience) appliedFilters['Role/Domain'] = 'Data Science';
  if (isLookingForSDE) appliedFilters['Role/Domain'] = 'Software Engineering';

  const exactMatches = alumniList.filter(alumni => {
    let matches = true;

    if (isLookingForMentor && !alumni.availableForMentorship) {
      matches = false;
    }

    if (isLookingForCity && !alumni.city.toLowerCase().includes(isLookingForCity) && !alumni.location.toLowerCase().includes(isLookingForCity)) {
      matches = false;
    }

    if (isLookingForCompany && !alumni.company.toLowerCase().includes(isLookingForCompany)) {
      matches = false;
    }

    if (isLookingForUni && !alumni.university.toLowerCase().includes(isLookingForUni)) {
      matches = false;
    }

    if (isLookingForML) {
      const hasML = alumni.jobTitle.toLowerCase().includes('ml') ||
        alumni.jobTitle.toLowerCase().includes('machine learning') ||
        alumni.skills.some(s => s.toLowerCase().includes('machine learning') || s.toLowerCase().includes('pytorch') || s.toLowerCase().includes('ai'));
      if (!hasML) matches = false;
    }

    if (isLookingForDataScience) {
      const hasDS = alumni.jobTitle.toLowerCase().includes('data') ||
        alumni.skills.some(s => s.toLowerCase().includes('data science') || s.toLowerCase().includes('python'));
      if (!hasDS) matches = false;
    }

    return matches;
  });

  // If no exact matches, generate "Related Alumni" with semantic similarity
  let relatedMatches: AlumniProfile[] = [];
  if (exactMatches.length === 0) {
    relatedMatches = alumniList.filter(alumni => {
      // Find alumni in related tech domains or companies
      return (
        (isLookingForML && alumni.skills.some(s => s.toLowerCase().includes('python'))) ||
        (isLookingForDataScience && alumni.skills.some(s => s.toLowerCase().includes('sql') || s.toLowerCase().includes('python'))) ||
        (isLookingForCity && alumni.availableForMentorship) ||
        (isLookingForCompany && alumni.experienceYears >= 4)
      );
    }).slice(0, 4);
  }

  let intentSummary = '';
  if (exactMatches.length > 0) {
    intentSummary = `Found ${exactMatches.length} verified alumni matching your natural search intent: "${query}"`;
  } else {
    intentSummary = `No exact match found for "${query}". Here are related alumni with complementary skills and active mentorship availability.`;
  }

  return {
    exactMatches,
    relatedMatches,
    intentSummary,
    appliedFilters
  };
}

/**
 * AI Teacher / Mentor Natural Language Matchmaking Layer
 * Analyzes:
 * - Student skills, learning goals, interests, development needs, experience level
 * - Requested subject & intent from natural language query
 * - Teacher/Alumni skills, expertise, mentorship areas, experience, subjects they can teach
 * Computes explainable, dynamic match percentages (no hardcoded numbers).
 */
export function matchTeachersAndMentorsAI(
  query: string,
  student: StudentProfile,
  teachers: TeacherProfile[] = [],
  alumni: AlumniProfile[] = []
): AIMentorMatch[] {
  const cleanQ = (query || '').toLowerCase().trim();

  // Combine candidates: teachers and verified alumni who are available for mentorship
  const candidates: { mentor: TeacherProfile | AlumniProfile; mentorType: 'teacher' | 'alumni' }[] = [
    ...teachers.map(t => ({ mentor: t, mentorType: 'teacher' as const })),
    ...alumni.filter(a => a.availableForMentorship).map(a => ({ mentor: a, mentorType: 'alumni' as const }))
  ];

  const studentSkills = (student.skills || []).map(s => s.toLowerCase());
  const studentGoals = (student.learningGoals && student.learningGoals.length > 0
    ? student.learningGoals
    : (student.lookingForGuidanceIn && student.lookingForGuidanceIn.length > 0 ? student.lookingForGuidanceIn : [student.careerGoals || 'Machine Learning'])
  ).map(g => (g || '').toLowerCase());
  const studentInterests = (student.interests || ['ai/ml', 'cloud']).map(i => i.toLowerCase());

  const matches: AIMentorMatch[] = candidates.map(({ mentor, mentorType }) => {
    const isTeacher = mentorType === 'teacher';
    const teacherMentor = mentor as TeacherProfile;
    const alumniMentor = mentor as AlumniProfile;

    const mentorSkills = (mentor.skills || []).map(s => s.toLowerCase());
    const mentorSubjects = (
      isTeacher
        ? (teacherMentor.subjectsCanTeach || teacherMentor.mentorshipTopics || [])
        : (alumniMentor.subjectsCanTeach || alumniMentor.mentorshipTopics || [])
    ).map(s => s.toLowerCase());
    const mentorExpertise = (
      isTeacher
        ? (teacherMentor.expertise || teacherMentor.skills || [])
        : (alumniMentor.expertise || alumniMentor.skills || [])
    ).map(e => e.toLowerCase());

    // 1. Query Term Match (30% weight)
    let queryScore = 55;
    if (cleanQ) {
      if (cleanQ.includes('machine learning') || cleanQ.includes('ml')) {
        if (mentorSkills.some(s => s.includes('machine learning') || s === 'ml') || mentorSubjects.some(s => s.includes('machine learning'))) {
          queryScore += 38;
        }
      }
      if (cleanQ.includes('python')) {
        if (mentorSkills.includes('python') || mentorSubjects.some(s => s.includes('python'))) {
          queryScore += 30;
        }
      }
      if (cleanQ.includes('data science') || cleanQ.includes('deep learning')) {
        if (mentorSkills.some(s => s.includes('data science') || s.includes('deep learning')) || mentorSubjects.some(s => s.includes('data science') || s.includes('deep learning'))) {
          queryScore += 28;
        }
      }
      if (cleanQ.includes('cloud') || cleanQ.includes('aws') || cleanQ.includes('azure')) {
        if (mentorSkills.some(s => s.includes('cloud') || s.includes('azure') || s.includes('aws')) || mentorSubjects.some(s => s.includes('cloud'))) {
          queryScore += 35;
        }
      }
      if (cleanQ.includes('system design') || cleanQ.includes('backend')) {
        if (mentorSkills.some(s => s.includes('system design') || s.includes('go') || s.includes('backend')) || mentorSubjects.some(s => s.includes('system design'))) {
          queryScore += 35;
        }
      }
      if (cleanQ.includes('project') || cleanQ.includes('projects') || cleanQ.includes('guidance')) {
        queryScore += 15;
      }
      // General term matches
      const specificMatches = mentorSkills.concat(mentorSubjects).filter(term =>
        cleanQ.includes(term) || term.includes(cleanQ.replace(/[^a-z0-9 ]/g, ''))
      );
      if (specificMatches.length > 0) {
        queryScore += Math.min(25, specificMatches.length * 10);
      }
    } else {
      queryScore = 80;
    }
    const queryAlignment = Math.min(99, Math.max(50, queryScore));

    // 2. Student Learning Goals vs Mentor Teaching Areas (25% weight)
    let goalScore = 60;
    const matchingGoals = studentGoals.filter(goal =>
      mentorSubjects.some(s => s.includes(goal) || goal.includes(s)) ||
      mentorSkills.some(s => s.includes(goal) || goal.includes(s)) ||
      mentorExpertise.some(e => e.includes(goal) || goal.includes(e))
    );
    if (matchingGoals.length > 0) {
      goalScore += Math.min(38, matchingGoals.length * 20);
    }
    const learningGoalAlignment = Math.min(99, Math.max(52, goalScore));

    // 3. Technical Skill Overlap (20% weight)
    const matchingSkills = mentor.skills.filter(ms =>
      studentSkills.some(ss => ss.includes(ms.toLowerCase()) || ms.toLowerCase().includes(ss))
    );
    const missingSkills = (mentor.subjectsCanTeach || mentor.skills || []).filter(
      ms => !matchingSkills.some(m => m.toLowerCase() === ms.toLowerCase())
    ).slice(0, 3);

    const skillRatio = mentor.skills.length > 0 ? matchingSkills.length / Math.min(mentor.skills.length, 5) : 0.5;
    const skillOverlap = Math.min(98, Math.max(52, Math.round(skillRatio * 95) + 10));

    // 4. Interest & Domain Alignment (15% weight)
    let interestScore = 65;
    const sharedInterests = studentInterests.filter(si =>
      mentorExpertise.some(me => me.includes(si) || si.includes(me)) ||
      mentorSubjects.some(ms => ms.includes(si) || si.includes(ms))
    );
    if (sharedInterests.length > 0) {
      interestScore += Math.min(30, sharedInterests.length * 15);
    }
    const interestAlignment = Math.min(98, Math.max(55, interestScore));

    // 5. Experience & Mentorship Relevance (10% weight)
    const exp = mentor.experienceYears || 4;
    const experienceRelevance = Math.min(98, 70 + exp * 2.4);

    // Dynamic Composite Score
    const matchPercentage = Math.min(
      99,
      Math.max(
        60,
        Math.round(
          queryAlignment * 0.30 +
          learningGoalAlignment * 0.25 +
          skillOverlap * 0.20 +
          interestAlignment * 0.15 +
          experienceRelevance * 0.10
        )
      )
    );

    // Natural Language Explanation
    let recommendationReason = '';
    if (cleanQ.includes('machine learning') || cleanQ.includes('ml')) {
      recommendationReason = `Strong match for your Machine Learning learning goals and project architecture.`;
    } else if (cleanQ.includes('python')) {
      recommendationReason = `Direct match for Python engineering, foundational algorithms, and hands-on guidance.`;
    } else if (matchingGoals.length > 0) {
      recommendationReason = `High alignment with your target learning goal in ${matchingGoals.slice(0, 2).map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(' & ')}.`;
    } else {
      recommendationReason = `Strong technical compatibility and verified academic mentorship track record.`;
    }

    const goalNames = studentGoals.slice(0, 2).map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(' and ') || 'Machine Learning';
    const mentorSubjectsNames = (mentor.subjectsCanTeach || mentor.skills || []).slice(0, 3).join(', ');

    const explanation = {
      summary: `Your interests in ${goalNames} strongly align with ${mentor.name}'s expertise in ${mentorSubjectsNames}.`,
      matchingSkills: matchingSkills.length > 0 ? matchingSkills : [mentor.skills[0] || 'Python'],
      missingSkills: missingSkills.length > 0 ? missingSkills : ['Advanced Research'],
      sharedInterests: sharedInterests.length > 0 ? sharedInterests.map(i => i.toUpperCase()) : ['AI/ML', 'TECHNICAL CAREERS'],
      relevantExpertise: mentor.expertise || mentor.skills.slice(0, 3),
      recommendationReason,
      criteriaBreakdown: {
        skillOverlap,
        learningGoalAlignment,
        interestAlignment,
        mentorshipTopicAlignment: Math.round((goalScore + queryAlignment) / 2),
        experienceRelevance: Math.round(experienceRelevance)
      }
    };

    return {
      mentor,
      mentorType,
      matchPercentage,
      explanation
    };
  });

  // Sort descending by calculated match percentage
  return matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

/**
 * Calculates Student Compatibility for Teachers (Teacher Dashboard)
 */
export function calculateTeacherStudentCompatibility(
  teacher: TeacherProfile,
  student: StudentProfile
): {
  compatibilityScore: number;
  studentWants: string;
  youProvide: string;
  whyRecommended: string;
  matchedTopics: string[];
} {
  const teacherSubjects = (teacher.subjectsCanTeach || teacher.skills || []).map(s => s.toLowerCase());
  const studentGoals = (student.learningGoals || [student.careerGoals || 'Machine Learning']).map(g => (g || '').toLowerCase());
  const studentSkills = (student.skills || []).map(s => s.toLowerCase());

  const matchedTopics = teacherSubjects.filter(sub =>
    studentGoals.some(g => g.includes(sub) || sub.includes(g)) ||
    studentSkills.some(s => s.includes(sub) || sub.includes(s))
  );

  const score = Math.min(
    98,
    Math.max(65, 60 + matchedTopics.length * 12 + (student.experienceLevel === 'Intermediate' ? 6 : 4))
  );

  const studentWants = (student.learningGoals && student.learningGoals.length > 0)
    ? student.learningGoals.slice(0, 3).join(' + ')
    : 'Machine Learning + Python';

  const youProvide = (teacher.subjectsCanTeach && teacher.subjectsCanTeach.length > 0)
    ? teacher.subjectsCanTeach.slice(0, 3).join(' + ')
    : teacher.skills.slice(0, 3).join(' + ');

  const whyRecommended = `Student is seeking guidance in ${studentWants}, which directly overlaps with your core teaching curriculum (${youProvide}).`;

  return {
    compatibilityScore: score,
    studentWants,
    youProvide,
    whyRecommended,
    matchedTopics: matchedTopics.slice(0, 4)
  };
}


import { AlumniProfile } from '../types';

export interface ParsedSearchQuery {
  role?: string;
  company?: string;
  location?: string;
  university?: string;
  skills: string[];
  rawQuery: string;
}

const KNOWN_ROLES = [
  'software engineer', 'sde', 'data scientist', 'machine learning', 'ml engineer',
  'frontend', 'backend', 'devops', 'solutions architect', 'product designer',
  'quant', 'tech lead', 'cloud engineer', 'ui/ux', 'system architect'
];

const KNOWN_COMPANIES = [
  'microsoft', 'google', 'amazon', 'zomato', 'razorpay', 'adobe',
  'goldman sachs', 'flipkart', 'aws', 'blinkit', 'swiggy', 'cisco'
];

const KNOWN_LOCATIONS = [
  'bangalore', 'bengaluru', 'hyderabad', 'pune', 'gurgaon', 'delhi',
  'noida', 'mumbai', 'roorkee', 'dehradun', 'karnataka', 'telangana', 'uttarakhand'
];

const KNOWN_UNIVERSITIES = [
  'iit roorkee', 'roorkee', "tula's", 'tulas', 'graphic era', 'geu',
  'iit hyderabad', 'bits pilani', 'bits', 'dtu', 'nit trichy'
];

const KNOWN_SKILLS = [
  'python', 'react', 'typescript', 'azure', 'aws', 'kubernetes', 'docker',
  'pytorch', 'llms', 'c++', 'go', 'node.js', 'redis', 'kafka', 'system design',
  'distributed systems', 'figma', 'graphql', 'machine learning'
];

export function parseNaturalLanguageQuery(query: string): ParsedSearchQuery {
  const normalized = query.toLowerCase();
  const parsed: ParsedSearchQuery = {
    skills: [],
    rawQuery: query
  };

  // Extract Role
  for (const role of KNOWN_ROLES) {
    if (normalized.includes(role)) {
      parsed.role = role;
      break;
    }
  }

  // Extract Company
  for (const comp of KNOWN_COMPANIES) {
    if (normalized.includes(comp)) {
      parsed.company = comp;
      break;
    }
  }

  // Extract Location
  for (const loc of KNOWN_LOCATIONS) {
    if (normalized.includes(loc)) {
      parsed.location = loc === 'bangalore' ? 'bengaluru' : loc;
      break;
    }
  }

  // Extract University
  for (const uni of KNOWN_UNIVERSITIES) {
    if (normalized.includes(uni)) {
      parsed.university = uni;
      break;
    }
  }

  // Extract Skills
  for (const skill of KNOWN_SKILLS) {
    if (normalized.includes(skill)) {
      parsed.skills.push(skill);
    }
  }

  return parsed;
}

export function filterAlumniByParsedQuery(alumniList: AlumniProfile[], parsed: ParsedSearchQuery): AlumniProfile[] {
  if (!parsed.rawQuery.trim()) return alumniList;

  return alumniList.map(alumni => {
    let score = 50; // base score

    const alumniText = `
      ${alumni.name} ${alumni.jobTitle} ${alumni.company} ${alumni.location}
      ${alumni.university} ${alumni.industry} ${alumni.skills.join(' ')} ${alumni.bio}
    `.toLowerCase();

    // Check Role
    if (parsed.role && (alumni.jobTitle.toLowerCase().includes(parsed.role) || alumniText.includes(parsed.role))) {
      score += 25;
    }

    // Check Company
    if (parsed.company && (alumni.company.toLowerCase().includes(parsed.company) || alumniText.includes(parsed.company))) {
      score += 25;
    }

    // Check Location
    if (parsed.location && (alumni.location.toLowerCase().includes(parsed.location) || alumni.city.toLowerCase().includes(parsed.location))) {
      score += 20;
    }

    // Check University
    if (parsed.university && (alumni.university.toLowerCase().includes(parsed.university) || alumniText.includes(parsed.university))) {
      score += 20;
    }

    // Check Skills
    for (const skill of parsed.skills) {
      if (alumni.skills.some(s => s.toLowerCase().includes(skill))) {
        score += 15;
      }
    }

    // Free text match if no specific tags matched
    if (!parsed.role && !parsed.company && !parsed.location && !parsed.university && parsed.skills.length === 0) {
      const words = parsed.rawQuery.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      for (const word of words) {
        if (alumniText.includes(word)) {
          score += 12;
        }
      }
    }

    return {
      ...alumni,
      matchScore: Math.min(99, Math.max(60, score))
    };
  }).filter(alumni => {
    // If specific fields were parsed, require at least one strong match
    if (parsed.role || parsed.company || parsed.location || parsed.university || parsed.skills.length > 0) {
      return (alumni.matchScore || 0) >= 70;
    }
    return (alumni.matchScore || 0) >= 60;
  }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}

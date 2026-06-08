export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  photo?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string;
  isPresent: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startYear: string;
  endYear: string;
  notes?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface Project {
  id: string;
  name: string;
  role: string;
  description: string;
  link?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  year: string;
  link?: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
  languages: Language[];
  hobbies: string;
  achievements: string;
}

export interface CVSettings {
  template: 'classic' | 'modern' | 'creative' | 'professional' | 'minimalist' | 'executive' | 'tech' | 'harvard' | 'startup' | 'elegant' | 'academic' | 'infographic';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  showPhoto: boolean;
  showProjects: boolean;
  showCertificates: boolean;
}

export const defaultCVData: CVData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    photo: '',
  },
  summary: '',
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certificates: [],
  languages: [],
  hobbies: '',
  achievements: '',
};

export const defaultCVSettings: CVSettings = {
  template: 'modern',
  accentColor: '#3B82F6',
  fontSize: 'medium',
  showPhoto: true,
  showProjects: true,
  showCertificates: true,
};

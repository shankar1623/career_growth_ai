// Comprehensive TypeScript types for CareerGrowth AI

export interface SectionAnalysis {
  sectionName: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  problems: string[];
  atsConcerns: string[];
  grammarConcerns: string[];
  originalText: string;
  suggestedReplacement: string;
  explanation: string;
}

export interface ResumeOverallAnalysis {
  overallScore: number;
  atsScore: number;
  contentScore: number;
  impactScore: number;
  skillsScore: number;
  experienceScore: number;
  projectsScore: number;
  formattingScore: number;
  grammarScore: number;
  topFixes: string[];
  sections: SectionAnalysis[];
  extractedSkills?: string[];
}

export interface MissingSkillItem {
  skill: string;
  reason: string;
  whyToLearn: string;
  relevance: string;
}

export interface MissingKeywordItem {
  keyword: string;
  context: string;
  importance: 'High' | 'Medium' | 'Low';
}

export interface JobMatchAnalysis {
  overallMatch: number;
  skillsMatch: number;
  experienceMatch: number;
  keywordMatch: number;
  projectRelevance: number;
  educationMatch: number;
  responsibilitiesMatch: number;
  atsMatch: number;
  strongMatches: string[];
  missingSkills: MissingSkillItem[];
  missingKeywords: MissingKeywordItem[];
  recommendations: string[];
}

export interface CompanyInfo {
  name: string;
  domain?: string;
  industry?: string;
  overview: string;
  products: string[];
  mission?: string;
  culture?: string;
  sourceUrl?: string;
  isVerified: boolean;
}

export interface SelfIntroductionResult {
  pitch30: string;
  pitch60: string;
  pitch90: string;
  whyItWorks: string;
  keyHighlights: string[];
}

export type InterviewRoundType = 
  | 'SELF_INTRO'
  | 'RESUME_DEEP_DIVE'
  | 'TECHNICAL'
  | 'CODING'
  | 'BEHAVIORAL_HR';

export interface InterviewQuestionItem {
  id?: string;
  orderIndex: number;
  questionText: string;
  category?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  context?: string;
  idealAnswerPoints?: string[];
}

export interface InterviewRoundData {
  id?: string;
  roundNumber: number;
  roundType: InterviewRoundType;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
  score?: number;
  questions: InterviewQuestionItem[];
}

export interface AnswerStarAnalysis {
  situation?: string;
  task?: string;
  action?: string;
  result?: string;
}

export interface AnswerEvaluationResult {
  score: number;
  clarityScore: number;
  relevanceScore: number;
  fillerWordCount: number;
  detectedFillerWords?: string[];
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  improvedExample: string;
  starAnalysis?: AnswerStarAnalysis;
}

export interface CodingTestResult {
  testCaseNumber: number;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed: boolean;
  notes?: string;
}

export interface CodingEvaluationResult {
  correctnessScore: number;
  complexityTime: string;
  complexitySpace: string;
  codeQualityScore: number;
  feedback: string;
  testResults: CodingTestResult[];
  optimizationSuggestions?: string[];
}

export interface ImprovementItem {
  problem: string;
  whyItMatters: string;
  betterExample: string;
  howToPractice: string;
}

export interface RoundFeedbackItem {
  roundNumber: number;
  roundType: string;
  title: string;
  score: number;
  isGood: boolean;
  statusText: string;
  problem: string;
  whyItMatters: string;
  betterExample: string;
  howToPractice: string;
}

export interface InterviewFinalEvaluation {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  problemSolvingScore: number;
  structureScore: number;
  resumeScore: number;
  codingScore: number;
  hrScore: number;
  summaryFeedback: string;
  strengths: string[];
  improvements: ImprovementItem[];
}

export type RoadmapResourceType = 'Video' | 'Course' | 'Documentation' | 'Practice' | 'Article';

export interface RoadmapResource {
  title: string;
  url?: string;
  type: RoadmapResourceType;
}

export interface RoadmapItemData {
  id?: string;
  weekNumber: number;
  skill: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  currentLevel: string;
  targetLevel: string;
  topics: string[];
  practiceTasks: string[];
  resources: RoadmapResource[];
  isCompleted?: boolean;
}

export interface LearningRoadmapData {
  id?: string;
  title: string;
  targetRole: string;
  overallProgress: number;
  totalWeeks: number;
  items: RoadmapItemData[];
}

export interface ScoreTrendData {
  date: string;
  score: number;
  type: string;
  label: string;
}

export interface SkillRadarData {
  skill: string;
  level: number;
  fullMark: number;
}

export interface DashboardAnalytics {
  resumeScore: number;
  atsScore: number;
  latestMatchScore: number;
  latestInterviewScore: number;
  strongSkills: string[];
  needsImprovement: string[];
  roadmapCompletionPct: number;
  scoreTrends: ScoreTrendData[];
  skillRadar: SkillRadarData[];
  recentActivities: {
    id: string;
    type: 'RESUME' | 'JOB_MATCH' | 'INTERVIEW' | 'ROADMAP';
    title: string;
    score?: number;
    date: string;
    link: string;
  }[];
}

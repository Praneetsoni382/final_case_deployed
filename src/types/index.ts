export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  age?: number;
  isVerified: boolean;
  emailVerified?: boolean;
  verificationToken?: string | null;
  verificationTokenExpiresAt?: number | null;
  resetToken?: string | null;
  resetTokenExpiresAt?: number | null;
  lastLoginAt?: string | null;
  pairingCode: string; // Unique student code, e.g. "MN-4821"
  teacherId?: string | null;
  createdAt: string;
}

export type MainGrowthParameter = 
  | 'Self-Reliance'
  | 'Confidence'
  | 'Fearlessness'
  | 'Concentration'
  | 'Perseverance'
  | 'Initiative'
  | 'Responsibility'
  | 'Critical Thinking'
  | 'Judgement'
  | 'Adaptability'
  | 'Resourcefulness'
  | 'Empathy'
  | 'Cooperation'
  | 'Harmony'
  | 'Reflection'
  | 'Consistency'
  | 'Willingness';

export type GrowthLevel = 
  | 'Beginning'
  | 'Developing'
  | 'Growing'
  | 'Consistent'
  | 'Strong Evidence';

export interface ParameterGrowth {
  name: MainGrowthParameter;
  score: number; // 0 - 100
  level: GrowthLevel;
  previousLevel: GrowthLevel;
  trend: 'up' | 'down' | 'steady';
  evidenceCount: number;
  recentEvidences: GrowthEvidence[];
}

export interface GrowthEvidence {
  id: string;
  userId: string;
  date: string;
  parameter: MainGrowthParameter;
  action: string;
  delta: number;
  source: 'test' | 'reflection' | 'streak' | 'teacher_observation';
  timestamp: string;
}

export interface StudentProfile {
  userId: string;
  developmentGoals: string[];
  struggles: string[];
  onboardingCompleted: boolean;
  updatedAt: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isDevelopmentallyPreferred: boolean;
  explanation: string;
  parameters: {
    [key in MainGrowthParameter]?: number;
  };
  qualities: string[];
}

export interface QuestionHint {
  id: string;
  order: number;
  text: string;
}

export interface DevelopmentQuestion {
  id: string;
  title?: string;
  scenario?: string;
  questionText: string;
  options: QuestionOption[];
  correctOptionId?: string;
  hints?: QuestionHint[];
  studentSelectedOptionId?: string;
  studentWrittenResponse?: string;
  hintsUsedCount?: number;
  relatedQualities: string[];
  relatedParameters: MainGrowthParameter[];
}

export interface KeyfieldEvidence {
  keyfield: string;
  level: 'Strong Evidence' | 'Developing' | 'Emerging' | 'Insufficient Evidence';
  where: string; // Scenario / Question title & context where observed
  how: string; // The specific choice and reasoning evidence
  guidance: string; // Actionable reflection for growth
}

export interface VivekanandaGrowthReport {
  highlightedKeyfields: string[];
  areasForImprovement: string[];
  evidenceBreakdown: KeyfieldEvidence[];
  synthesis: string;
  disclaimer: string;
}

export interface DailyTest {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  questions: DevelopmentQuestion[];
  status: 'pending' | 'completed';
  score?: number; // 0 to 10
  alignmentRating?: string;
  strongAreas?: string[];
  areasNeedingAttention?: string[];
  growthParametersAffected?: MainGrowthParameter[];
  developmentInsight?: string;
  growthReport?: VivekanandaGrowthReport;
  completionTimeMinutes?: number;
  startedAt: string;
  completedAt?: string;
}

export interface Reflection {
  id: string;
  userId: string;
  testId: string;
  date: string; // YYYY-MM-DD
  mainReflection: string; // What did today's questions make you realize about yourself?
  whatLearned: string;
  improveTomorrow: string;
  thoughtProvokingAnswer: string;
  relatedDevelopmentAreas: string[];
  createdAt: string;
}

export interface StreakInfo {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  history: {
    date: string;
    completed: boolean;
  }[];
}

export interface Reward {
  id: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  type: 'file' | 'link' | 'text';
  title: string;
  content: string; // Text message or Link URL
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  createdAt: string;
}

export interface StorageItem {
  id: string;
  userId: string;
  name: string;
  type: 'reward_file' | 'reward_link' | 'reward_text' | 'resource' | 'teacher_file';
  senderName: string;
  url?: string;
  content?: string;
  fileSize?: string;
  fileType?: string;
  sharedWithCohort?: boolean;
  targetStudentName?: string;
  targetStudentId?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  receiverName: string;
  text: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'test_ready' | 'reward_received' | 'message_received' | 'streak_milestone' | 'test_completed' | 'reflection_submitted';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface TeacherObservation {
  id: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  note: string;
  observedDate: string;
  createdAt: string;
}

// ==========================================
// SCENARIO CHALLENGE & FIRESTORE TYPES
// ==========================================

export interface Criterion {
  id: string;
  name: string;
  description: string;
}

export interface Hint {
  id: string;
  order: number;
  text: string;
}

export interface ChallengeOption {
  id: string;
  text: string;
}

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  scenario: string;
  question: string;
  options?: ChallengeOption[];
  correctOptionId?: string;
  explanation?: string;
  instructions?: string;
  difficulty?: string;
  estimatedMinutes?: number;
  expectedOutputType?: string;
  hints?: Hint[];
  criteria?: Criterion[];
  rubric?: Record<string, any>;
  optionalReasoning?: boolean;
  active?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Attempt {
  id: string;
  studentId: string;
  challengeId: string;
  startedAt: string;
  submittedAt?: string;
  timeTaken?: number;
  attemptCount?: number;
  hintsUsed?: number;
  hintIdsUsed?: string[];
  revisionCount?: number;
  selectedOption?: string;
  answerChanged?: boolean;
  changeCount?: number;
  optionalReasoning?: string;
  answer?: string;
  completed: boolean;
  status: 'in_progress' | 'submitted' | 'evaluated';
  createdAt: string;
  updatedAt?: string;
}

export interface ChallengeReflection {
  id: string;
  attemptId: string;
  studentId: string;
  challengeId: string;
  difficulty?: string;
  changedApproach?: boolean;
  whatChanged?: string;
  whatLearned?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CriterionResult {
  criterionId: string;
  criterionName: string;
  level: 'Strong' | 'Developing' | 'Emerging' | 'Insufficient Evidence';
  evidence: string;
  explanation?: string;
}

export interface Evaluation {
  id: string;
  attemptId: string;
  studentId: string;
  challengeId: string;
  status: 'pending' | 'completed';
  criteriaResults: CriterionResult[];
  strengths: string[];
  growthAreas: string[];
  feedback: string;
  insufficientEvidence: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface GrowthRecord {
  id: string;
  studentId: string;
  attemptId?: string;
  challengeId?: string;
  evaluationId?: string;
  criterionId?: string;
  criterionName: string;
  level: 'Strong' | 'Developing' | 'Emerging' | 'Insufficient Evidence';
  evidence: string;
  createdAt: string;
}


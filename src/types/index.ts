// ── Quiz ────────────────────────────────────────────────────────
export interface QuizQuestion {
  id: string;
  question: string;
  questionType: "text" | "photo";
  questionPic?: string;
  answerSelectionType: "single" | "multiple";
  answers: string[];
  correctAnswer: string | number;
  messageForCorrectAnswer: string;
  messageForIncorrectAnswer: string;
  explanation: string;
  point: string;
}

export interface Quiz {
  id: string;
  regionName: string;
  time: number;
  status: boolean;
  questionPic: string;
  like: number;
  reports: number;
  questions: QuizQuestion[];
  quizTitle: string;
  quizSynopsis: string;
  nrOfQuestions: string;
  userId: string;
  userName: string;
  completeQuizCount: number;
}

export interface QuizResult {
  numberOfCorrectAnswers: number;
  numberOfIncorrectAnswers: number;
  numberOfQuestions: number;
  correctPoints: number;
  totalPoints: number;
  questions: QuizQuestion[];
}

// ── Game Modes ──────────────────────────────────────────────────
export type GameMode = "learn" | "exam" | "marathon";

export interface GameModeConfig {
  id: GameMode;
  labelUk: string;
  labelEn: string;
  icon: string;
  descriptionUk: string;
  descriptionEn: string;
  showHints: boolean;
  timed: boolean;
  timePerQuestion?: number; // seconds
}

// ── Progress & Badges ───────────────────────────────────────────
export interface RegionProgress {
  region: string;
  quizzesCompleted: number;
  totalCorrect: number;
  totalQuestions: number;
  bestScore: number;
  lastPlayedAt: number;
}

export interface UserProgress {
  regions: Record<string, RegionProgress>;
  totalQuizzesCompleted: number;
  totalCorrect: number;
  totalQuestions: number;
  badges: string[];
  streak: number;
  lastPlayedDate: string;
}

export interface Badge {
  id: string;
  nameUk: string;
  nameEn: string;
  descriptionUk: string;
  descriptionEn: string;
  icon: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  condition: (progress: UserProgress) => boolean;
}

// ── Leaderboard ─────────────────────────────────────────────────
export interface LeaderboardEntry {
  id: string;
  userName: string;
  userId: string;
  totalScore: number;
  regionsCompleted: number;
  totalQuizzes: number;
  accuracy: number;
  updatedAt: number;
}

// ── AI ──────────────────────────────────────────────────────────
export interface AIExplanation {
  explanation: string;
  funFact: string;
  historicalContext?: string;
}

export interface AIGeneratedQuestion {
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

// ── i18n ────────────────────────────────────────────────────────
export type Locale = "uk" | "en";

// ── Auth ────────────────────────────────────────────────────────
export interface AuthState {
  token: string;
  isError: boolean;
  errorMessage: string;
  userId: string;
  userName: string;
  email: string;
  isAuthenticated: boolean;
}

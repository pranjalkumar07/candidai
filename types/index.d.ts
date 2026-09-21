interface QuestionEvaluation {
  question: string;
  candidateAnswer: string;
  score: number;
  whatWasCorrect: string;
  whatWasMissing: string;
  whatWasIncorrect: string;
  whyItMatters: string;
  howToImprove: string;
  idealAnswer: string;
  followUpQuestion: string;
}

interface Feedback {
  id: string;
  interviewId: string;
  userId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  hiringSummary?: string;
  criticalWeaknesses?: string[];
  technicalGaps?: string[];
  communicationGaps?: string[];
  struggledQuestions?: string[];
  strongQuestions?: string[];
  improvementAreas?: string[];
  recommendedTopics?: string[];
  difficultyAssessment?: string;
  nextInterviewRecommendation?: string;
  questionEvaluations?: QuestionEvaluation[];
  durationSeconds?: number;
  completedAt?: string;
  createdAt: string;
}

interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  createdAt: string;
  userId: string;
  type: string;
  finalized: boolean;
  coverImage?: string;
  duration?: number; // Configured duration in minutes
  durationSeconds?: number; // Actual recorded duration in seconds
  completedAt?: string;
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
  durationSeconds?: number;
}

interface User {
  name: string;
  email: string;
  id: string;
}

interface InterviewCardProps {
  interviewId?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
  coverImage?: string;
  duration?: number;
  durationSeconds?: number;
}

interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
  role?: string;
  level?: string;
  interviewMode?: string;
  duration?: number;
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password?: string;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}

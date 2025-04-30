interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
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
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string | undefined;
  transcript?: { role: string; content: string }[];
  feedbackId?: string;
  generalQuestions?: {
    introduction: string;
    motivation: string;
    experience: string;
  };
  actualQuestions?: { question: string; answer: string }[];
  type: string;
}

interface User {
  name: string;
  email: string;
  id: string;
  subscription: boolean;
  createdAt?: string;
  photoURL?: string;
}

interface InterviewCardProps {
  id?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
  currUser?: string;
}

interface AgentProps {
  userName: string;
  photoURL?: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
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

interface GoogleSignInParams{
  email: string;
  idToken: string;
  name: string;
  photoURL: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
  subscription: boolean;
}

type FormType = "sign-in" | "sign-up";

interface TextInterviewFormProps {
  userId: string | undefined;
  state: 'generate' | string;
}
interface TextBasedInterview {
  userId: string | undefined;
  interviewId: string;
  username: string | undefined;
  type: string;
  questions: string[];
}

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

interface RazorPayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface ErrorResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

interface Leaderboards {
  id: string;
  name: string;
  totalImpressions: number;
  maxPossibleScore: number;
  totalInterviews: number;
  averageScore: number;
  photoUrl?: string;
}

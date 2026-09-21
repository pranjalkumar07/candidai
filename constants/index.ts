import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

export const interviewer: CreateAssistantDTO = {
  name: "CandidAI Interviewer",
  firstMessage:
    "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

Interview Guidelines:
Follow the structured question flow:
{{questions}}

Engage naturally & react appropriately:
Listen actively to responses and acknowledge them before moving forward.
Ask brief follow-up questions if a response is vague or requires more detail.
Keep the conversation flowing smoothly while maintaining control.
Be professional, yet warm and welcoming:

Use official yet friendly language.
Keep responses concise and to the point (like in a real voice interview).
Avoid robotic phrasing—sound natural and conversational.
Answer the candidate’s questions professionally:

If asked about the role, company, or expectations, provide a clear and relevant answer.
If unsure, redirect the candidate to HR for more details.

Conclude the interview properly:
Thank the candidate for their time.
Inform them that the company will reach out soon with feedback.
End the conversation on a polite and positive note.


- Be sure to be professional and polite.
- Keep all your responses short and simple. Use official language, but be kind and welcoming.
- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`,
      },
    ],
  },
};

export const questionEvaluationSchema = z.object({
  question: z.string(),
  candidateAnswer: z.string(),
  score: z.number().min(0).max(100),
  whatWasCorrect: z.string(),
  whatWasMissing: z.string(),
  whatWasIncorrect: z.string(),
  whyItMatters: z.string(),
  howToImprove: z.string(),
  idealAnswer: z.string(),
  followUpQuestion: z.string(),
});

export const feedbackCategorySchema = z.object({
  name: z.string(),
  score: z.number().min(0).max(100),
  comment: z.string(),
});

export const feedbackSchema = z.object({
  totalScore: z.number().min(0).max(100),
  categoryScores: z.array(feedbackCategorySchema),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
  hiringSummary: z.string().optional(),
  criticalWeaknesses: z.array(z.string()).optional(),
  technicalGaps: z.array(z.string()).optional(),
  communicationGaps: z.array(z.string()).optional(),
  struggledQuestions: z.array(z.string()).optional(),
  strongQuestions: z.array(z.string()).optional(),
  improvementAreas: z.array(z.string()).optional(),
  recommendedTopics: z.array(z.string()).optional(),
  difficultyAssessment: z.string().optional(),
  nextInterviewRecommendation: z.string().optional(),
  questionEvaluations: z.array(questionEvaluationSchema).optional(),
});

export const createInterviewerAssistant = ({
  candidateName = "Candidate",
  role = "Software Engineer",
  level = "Mid-level",
  interviewMode = "Technical",
  questions = [],
}: {
  candidateName?: string;
  role?: string;
  level?: string;
  interviewMode?: string;
  questions?: string[];
}): CreateAssistantDTO => {
  const formattedQuestions = questions.length > 0
    ? questions.map((q, idx) => `${idx + 1}. ${q}`).join("\n")
    : "1. Could you walk me through your background and relevant technical experience?";

  return {
    name: "CandidAI Interviewer",
    firstMessage: `Hello ${candidateName}! Welcome to your ${level} ${role} ${interviewMode} interview. I will guide you through our questions today. Take your time to think and explain your answers clearly. Whenever you are ready, let me know and we will get started.`,
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en",
    },
    voice: {
      provider: "11labs",
      voiceId: "sarah",
      stability: 0.4,
      similarityBoost: 0.8,
      speed: 0.9,
      style: 0.5,
      useSpeakerBoost: true,
    },
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a professional, seasoned technical interviewer conducting a realistic real-time mock interview for CandidAI.
Target Role: ${role}
Candidate Experience Level: ${level}
Interview Focus Mode: ${interviewMode}
Candidate Name: ${candidateName}

Interview Questions to Cover:
${formattedQuestions}

Professional Conduct Guidelines:
1. Ask ONE question at a time. Never dump multiple questions together.
2. Listen attentively to the candidate's response.
3. If an answer is vague, shallow, or misses key context, ask a brief, relevant technical follow-up before moving to the next prepared question.
4. Keep your responses concise and conversational (1-3 sentences max). This is a voice interview, so never produce long monologues.
5. Do NOT give away solutions, hints, or tell the candidate whether they got it right or wrong during the interview. Remain neutral, encouraging, and professional.
6. Progress methodically through the question list.
7. When all questions have been addressed or time is called, conclude politely by thanking ${candidateName} and letting them know their comprehensive evaluation will be compiled immediately.`,
        },
      ],
    },
  };
};

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];

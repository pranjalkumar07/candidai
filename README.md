# CandidAI

> **Practice smarter. Interview with confidence.**

CandidAI is an AI-powered mock interview platform designed to help candidates practice realistic interviews and receive structured performance feedback. Built with modern web technologies, real-time voice AI, and generative models, CandidAI simulates authentic technical and behavioral interview scenarios tailored to specific roles, experience levels, and technology stacks.

---

## Core Features

- **AI-Generated Interview Questions**: Dynamic question generation powered by Google Gemini tailored to specific job titles, seniority levels, and tech stacks.
- **Real-Time AI Voice Interviews**: Interactive, conversational voice interviews powered by Vapi AI that listen, respond, and adapt in real time.
- **Role and Experience-Based Configuration**: Fully configurable interview sessions adapting difficulty and domain depth to entry-level, mid-level, or senior positions.
- **Technical and Behavioral Practice**: Tailored interview tracks spanning coding concepts, system design, architectural principles, and STAR-method behavioral assessments.
- **Performance Evaluation**: Comprehensive post-interview scoring across communication, technical competency, problem-solving, and clarity.
- **Skill Breakdown**: Detailed analytical breakdown highlighting candidate strengths, weaknesses, and actionable suggestions for improvement.
- **Interview History**: Persistent tracking of past interview sessions, historical scores, and trajectory over time.
- **Practice Modules**: Dedicated practice environments to build confidence before jumping into full simulated interviews.
- **Firebase Authentication**: Secure user registration, authentication, and session cookie management.
- **Firestore-Based Interview Data**: Real-time cloud persistence for user profiles, interview configurations, transcripts, and evaluation results.
- **Gemini-Powered Generation & Feedback**: Intelligent prompt engineering utilizing Google Gemini for real-time interview synthesis and rubric-based evaluations.
- **Vapi-Powered Voice Interaction**: Ultra-low latency voice conversational experience powered by Vapi's Web SDK.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Frontend Library**: [React 19](https://react.dev/)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Lucide React](https://lucide.dev/)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore) & [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- **Generative AI**: [Google Gemini](https://ai.google.dev/) via [Vercel AI SDK](https://sdk.vercel.ai/) (`@ai-sdk/google`)
- **Voice Intelligence**: [Vapi](https://vapi.ai/) Web SDK (`@vapi-ai/web`)
- **Form Handling & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## Project Structure

```text
candidai/
├── app/                          # Next.js App Router routes and pages
│   ├── (auth)/                   # Authentication route group (sign-in, sign-up)
│   ├── (root)/                   # Authenticated application core pages
│   │   ├── interview/            # Interview creation, active room, and feedback views
│   │   ├── interviews/           # User interview history and review list
│   │   └── practice/             # Practice workspace and exercises
│   ├── api/                      # Backend API route handlers
│   │   └── vapi/generate/        # Assistant prompt generation endpoint for Vapi
│   ├── globals.css               # Global styling and Tailwind design system
│   └── layout.tsx                # Root application layout
├── components/                   # Reusable UI & business logic components
│   ├── Agent.tsx                 # Real-time Vapi voice agent interface & waveform
│   ├── AuthForm.tsx              # Sign-in and sign-up form components
│   ├── CreateInterviewForm.tsx   # Modal & form to configure custom interviews
│   ├── InterviewCard.tsx         # Dashboard card displaying interview summaries
│   ├── PracticeWorkspace.tsx     # Interactive practice interface
│   ├── PerformanceChart.tsx      # Visual score trends and analytics
│   ├── SkillBreakdown.tsx        # Rubric-based skill rating components
│   └── Sidebar.tsx / TopHeader   # Navigation layout components
├── constants/                    # Application constants, mock data, and presets
├── firebase/                     # Firebase Client & Admin SDK initialization
│   ├── admin.ts                  # Server-side Firebase Admin credentials
│   └── client.ts                 # Client-side Firebase App instance
├── lib/                          # Utility functions and server actions
│   ├── actions/                  # Server Actions for auth and Firestore operations
│   ├── utils.ts                  # Helper functions and class mergers
│   └── vapi.sdk.ts               # Vapi SDK singleton client
├── public/                       # Static public assets, SVG icons, and company logos
└── types/                        # TypeScript type definitions and interfaces
```

---

## Environment Setup

Follow these steps to configure your environment variables:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd candidai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local`:**
   ```bash
   cp .env.example .env.local
   ```

4. **Copy required variables from `.env.example` & add valid credentials:**
   Open `.env.local` and populate the values:

   ```env
   # Firebase Client Configuration (Web SDK)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

   # Firebase Admin Configuration (Server SDK)
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"

   # Google Gemini API
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

   # Vapi AI Voice Agent Configuration
   NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token
   NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_workflow_id
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

---

## Running Locally

Use the following scripts available in `package.json`:

- **Start development server** (Turbopack enabled):
  ```bash
  npm run dev
  ```
  Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Start production server**:
  ```bash
  npm run start
  ```

---

## Build / Verification

Verify code quality and create a production build using:

- **Linting & Code Quality**:
  ```bash
  npm run lint
  ```

- **Production Build**:
  ```bash
  npm run build
  ```

---

## Security

> [!IMPORTANT]
> **Never commit real API keys, private credentials, or secrets to version control.**
>
> All sensitive configuration must remain inside `.env.local`, which is strictly ignored by `.gitignore`. Ensure that Firebase Admin private keys, Gemini API keys, and Vapi tokens are kept confidential and rotated immediately if exposed.

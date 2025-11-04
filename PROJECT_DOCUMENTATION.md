# Smart Insights Aggregator - Project Documentation

**Version:** 1.0.0
**Last Updated:** November 4, 2024
**Status:** Frontend MVP Completed (Mock Data)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Core Concepts & Terminology](#core-concepts--terminology)
4. [Data Structure](#data-structure)
5. [Technology Stack](#technology-stack)
6. [Project Structure](#project-structure)
7. [Completed Features](#completed-features)
8. [Remaining Work](#remaining-work)
9. [Backend Requirements](#backend-requirements)
10. [Getting Started](#getting-started)

---

## Project Overview

### What is Smart Insights Aggregator?

Smart Insights Aggregator is an **anonymous feedback collection and AI-powered analysis platform** designed for KFUEIT (Khwaja Fareed University of Engineering & Information Technology). The system enables:

- **Students** to submit anonymous feedback either in response to specific inquiries or as general input
- **Administrators** to create targeted inquiries, analyze aggregate feedback patterns, and interact with students
- **AI-Powered Analysis** to automatically categorize, analyze sentiment, assess quality, and generate actionable recommendations

### Key Objectives

1. **Anonymity & Safety**: Students can provide honest feedback without fear of identification
2. **Targeted Feedback Collection**: Admins can create specific inquiries for departments, programs, or semesters
3. **AI-Driven Insights**: Aggregate analysis provides executive summaries, identifies trends, and suggests prioritized actions
4. **Two-Way Communication**: Admins can reply to feedback and request identity reveal when necessary
5. **Topic Discovery**: AI automatically groups general feedback into themes/topics for analysis

### Problem Statement

Traditional feedback systems often suffer from:
- Low participation due to fear of identification
- Manual analysis that is time-consuming and subjective
- Difficulty in identifying actionable patterns from large volumes of feedback
- Lack of structured communication between administration and students

Smart Insights Aggregator solves these problems through anonymous submission, AI-powered aggregate analysis, and controlled two-way communication.

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌──────────────────┐          ┌──────────────────┐        │
│  │  Student Portal  │          │   Admin Portal   │        │
│  │  - Submit Input  │          │  - Manage Inq.   │        │
│  │  - View History  │          │  - View Topics   │        │
│  │  - See Inquiries │          │  - Analyze Data  │        │
│  └──────────────────┘          └──────────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    Backend (.NET 8 APIs)                     │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────┐        │
│  │ Auth API   │  │ Inquiry API │  │  Input API   │        │
│  └────────────┘  └─────────────┘  └──────────────┘        │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────┐        │
│  │ Topic API  │  │  AI Service │  │  User API    │        │
│  └────────────┘  └─────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    Database (PostgreSQL)                     │
│       Users | Inquiries | Inputs | Topics | Analysis        │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                  AI/ML Service (External)                    │
│    Sentiment Analysis | Topic Clustering | Quality Scoring  │
└─────────────────────────────────────────────────────────────┘
```

### User Flow Diagrams

#### Student Flow
```
Student Login → Dashboard (History)
              ↓
         See Active Inquiries
              ↓
    Submit Response OR Submit General Input
              ↓
         View Admin Reply (if any)
              ↓
    Approve/Deny Identity Reveal Request (if any)
```

#### Admin Flow
```
Admin Login → Dashboard (Overview Stats)
            ↓
       Create Inquiry
            ↓
    View Inquiry → AI Analysis (Executive Summary)
            ↓                    ↓
    View Topics → AI Analysis   View Individual Inputs
            ↓                    ↓
    Reply to Input OR Request Identity Reveal
```

---

## Core Concepts & Terminology

### 1. **Inquiry**
- **Definition**: A targeted question/prompt created by admins to gather specific feedback
- **Structure**: Contains a single `body` field (the question prompt)
- **Targeting**: Can target specific departments, programs, and/or semesters
- **Example**: "Is your lab equipment meeting your learning needs? Share your experience..."
- **AI Analysis**: Aggregate analysis of all responses with Executive Summary format

### 2. **Input** (Student Feedback)
Two types of inputs exist:

#### A. Inquiry-Linked Input
- **Definition**: A response to a specific inquiry
- **Characteristics**:
  - Has `inquiryId` reference
  - Does NOT have theme/topic (it's just a response)
  - Has quality metrics (urgency, importance, clarity, quality, severity)
  - Has sentiment and tone

#### B. General Input
- **Definition**: Open-ended feedback not tied to any inquiry
- **Characteristics**:
  - No `inquiryId` (null)
  - HAS `aiTheme` for AI topic grouping
  - Auto-assigned to a Topic by AI
  - Has same quality metrics as inquiry inputs

### 3. **Topic**
- **Definition**: Auto-generated category for general inputs
- **Creation**: AI groups similar general inputs into topics based on themes
- **Examples**: "IT Infrastructure & Connectivity", "Skill Development & Training"
- **AI Analysis**: Aggregate analysis of all inputs within the topic

### 4. **Quality Metrics**
Every input is analyzed and scored:
- **urgencyPct** (0-1): How time-sensitive is this feedback?
- **importancePct** (0-1): How important is this issue?
- **clarityPct** (0-1): How clear and well-articulated is the feedback?
- **helpfulnessPct** (0-1): How helpful is this feedback for decision-making?
- **qualityPct** (0-1): Overall quality score
- **score** (0-100): Composite score
- **severity** (1-3): LOW=1, MEDIUM=2, HIGH=3

### 5. **AI Analysis - Executive Summary Format**

#### For Inquiries (aiSummary):
```json
{
  "topics": ["topic1", "topic2"],
  "Executive Summary": {
    "Headline Insight": "Main finding in one sentence",
    "Response Mix": "Distribution insight",
    "Key Takeaways": "Detailed summary",
    "Risks": "What could go wrong",
    "Opportunities": "What could be improved"
  },
  "Suggested Prioritized Actions": [
    {
      "Action": "Specific action to take",
      "Impact": "HIGH/MEDIUM/LOW",
      "Challenges": "Obstacles to implementation",
      "Response Count": 123,
      "Supporting Reasoning": "Why this action matters"
    }
  ]
}
```

#### For Topics (insightsSummary):
Similar structure but in array format with slightly different keys.

### 6. **Admin Actions**
- **Reply**: Send a message back to the student (anonymous)
- **Request Identity Reveal**: Ask student to reveal their identity for this specific input
  - Student can approve or deny
  - Used only when follow-up is necessary

---

## Data Structure

### Inquiry Schema
```typescript
{
  id: string;
  body: string;  // The question prompt (NOT separate title + description)
  status: "ACTIVE" | "DRAFT" | "CLOSED";
  targetDepartments: string[];
  targetPrograms: string[];
  targetSemesters: string[];
  startDate: ISO8601;
  endDate: ISO8601;
  totalInputs: number;
  createdAt: ISO8601;
  updatedAt: ISO8601;
  createdBy: string;
  engagementMetrics: { date, views, responses }[];
  aiSummary: {
    topics: string[];
    "Executive Summary": { ... };
    "Suggested Prioritized Actions": [ ... ];
    overallSentiment: { positive, negative, neutral, mixed, dominant };
    sentimentTrend: [ ... ];
  };
}
```

### Input Schema
```typescript
{
  id: string;
  body: string;  // The feedback text
  type: "INQUIRY_LINKED" | "GENERAL";

  // Relations
  inquiryId: string | null;
  inquiryTitle: string | null;  // For display only
  topicId: string | null;       // For general inputs

  // Student metadata (anonymous)
  studentId: string;
  department: string;
  program: string;
  semester: string;
  identityRevealed: boolean;

  // AI Classification
  sentiment: string;  // "Frustrated", "Satisfied", "Hopeful", etc.
  tone: "positive" | "negative" | "neutral";
  aiTheme: string | null;  // ONLY for general inputs (topic grouping)

  // Quality Metrics
  urgencyPct: string;      // "0.85" = 85%
  importancePct: string;
  clarityPct: string;
  helpfulnessPct: string;
  qualityPct: string;
  score: number;           // 0-100
  severity: 1 | 2 | 3;     // LOW | MEDIUM | HIGH

  // Admin Interaction
  adminReply: {
    message: string;
    repliedAt: ISO8601;
    repliedBy: string;
  } | null;
  identityRevealRequested: boolean;
  identityRevealRequestedAt: ISO8601 | null;

  status: "PENDING" | "PROCESSING" | "PROCESSED";
  createdAt: ISO8601;
}
```

### Topic Schema
```typescript
{
  id: string;
  topic: string;  // Topic name
  description: string;
  totalInputs: number;
  status: "ACTIVE" | "ARCHIVED";
  createdAt: ISO8601;
  averageScore: string;  // "58.5000000000000000"
  severity: 1 | 2 | 3;

  insightsSummary: [{
    topics: string[];
    "Executive Summary": { ... };
    "Suggested Prioritized Actions": [ ... ];
  }];

  overallSentiment: { positive, negative, neutral, mixed, dominant };
  importanceBreakdown: { high, medium, low };
}
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14.2.5 (Pages Router)
- **UI Library**: Material-UI (MUI) 5.16.6
- **Styling**: Tailwind CSS 3.4.1 + MUI System
- **State Management**: React Query 3.39.3
- **Form Handling**: react-hook-form 7.52.1 + Zod 3.23.8
- **HTTP Client**: Axios 1.7.2
- **Date Handling**: Luxon 3.4.4
- **Notifications**: react-toastify 10.0.5

### Backend (Planned)
- **Framework**: .NET 8 Web APIs
- **Database**: PostgreSQL (or SQL Server)
- **ORM**: Entity Framework Core
- **Authentication**: JWT-based auth
- **AI Integration**: OpenAI API or Azure OpenAI

### Development Tools
- **Node.js**: 18.x or higher
- **Package Manager**: npm or yarn
- **Code Quality**: ESLint, Prettier

---

## Project Structure

```
/Users/mac/Projects/Work/FYP/frontend/
├── constants/
│   └── theme/              # Theme configuration (green color scheme)
│       └── palette.js
│
├── modules/                # Domain-Driven Design structure
│   ├── shared/            # Shared components, layouts, utilities
│   │   ├── components/
│   │   │   ├── button/
│   │   │   ├── loader/
│   │   │   ├── inline-loader/
│   │   │   ├── importance-badge/
│   │   │   ├── sentiment-indicator/
│   │   │   ├── theme-chip/
│   │   │   └── index.js
│   │   ├── icons/
│   │   │   └── LogoIcon.js  # Smart Insights Aggregator logo
│   │   ├── layouts/
│   │   │   └── root/
│   │   └── shared.mock-data-v2.js  # Mock data matching reference structure
│   │
│   ├── user/              # User context, auth
│   ├── input/             # Input submission forms, components
│   │   ├── components/
│   │   │   ├── input-form/
│   │   │   └── inquiry-card/
│   │   └── input.config.js
│   │
│   └── inquiry/           # Inquiry management
│       └── components/
│           └── create-inquiry-dialog/
│
├── pages/                 # Next.js Pages Router
│   ├── admin/
│   │   ├── dashboard.js       # Admin overview with stats
│   │   ├── inquiries.js       # List all inquiries
│   │   ├── inquiries/
│   │   │   └── [inquiryId].js # Inquiry detail with AI analysis
│   │   ├── topics.js          # List all topics
│   │   ├── topics/
│   │   │   └── [topicId].js   # Topic detail with AI analysis
│   │   └── inputs/
│   │       └── [inputId].js   # Input detail with admin actions
│   │
│   ├── student/
│   │   ├── home.js            # Student dashboard (input history)
│   │   └── inquiries.js       # Active inquiries to respond to
│   │
│   ├── input/
│   │   └── submit.js          # Submit general feedback
│   │
│   ├── _app.js
│   ├── _document.js
│   └── index.js               # Landing/redirect
│
├── public/
├── styles/
│   └── globals.css
│
├── package.json
├── next.config.js
└── jsconfig.json
```

### Key Design Patterns

1. **Domain-Driven Design (DDD)**: Modules organized by domain (user, input, inquiry)
2. **Component Composition**: Reusable UI components in shared module
3. **Mock API Pattern**: All API calls return mock data with simulated delays
4. **Pages Router**: Traditional Next.js routing (not App Router)
5. **Material Design**: Consistent UI following Material Design principles

---

## Completed Features

### ✅ Admin Portal

#### 1. Dashboard (`/admin/dashboard`)
- Total inputs, inquiries, topics statistics
- Sentiment breakdown visualization
- Importance breakdown
- Top themes chart
- Department-wise breakdown
- Recent inputs preview
- Identity reveal requests counter

#### 2. Inquiries Management (`/admin/inquiries`)
- List all inquiries with filters (All, Active, Draft, Closed)
- Create new inquiry with targeting options
- View inquiry cards showing question preview
- Delete inquiries

#### 3. Inquiry Detail Page (`/admin/inquiries/[inquiryId]`)
- **Tab 1: Overview & AI Analysis**
  - Inquiry question display (body field)
  - Inquiry metadata (dates, responses, target audience)
  - Engagement metrics timeline
  - Key topics identified
  - Executive Summary sections:
    - Headline Insight
    - Response Mix
    - Key Takeaways
    - Risks (highlighted in red)
    - Opportunities (highlighted in green)
  - Suggested Prioritized Actions (with impact, challenges, reasoning)
  - Sentiment distribution
- **Tab 2: Inputs**
  - List of all responses to this inquiry
  - Each input card shows: timestamp, sentiment, severity, body text
  - Quality scores displayed (urgency, importance, quality %)
  - Click to view input detail

#### 4. Topics Management (`/admin/topics`)
- Grid view of all auto-generated topics
- Topic cards showing:
  - Topic name and description
  - Total inputs count
  - Severity level
  - Dominant sentiment
  - Average score
- Click to view topic details

#### 5. Topic Detail Page (`/admin/topics/[topicId]`)
- Similar 2-tab structure to inquiry detail
- **Tab 1: Overview & AI Analysis**
  - Topic metadata (total inputs, average score, severity)
  - Key topics identified
  - Executive Summary (same format as inquiries)
  - Suggested Prioritized Actions
  - Sentiment and importance breakdowns
- **Tab 2: Inputs**
  - List of general inputs grouped in this topic
  - Shows AI theme classification
  - Quality metrics displayed

#### 6. Input Detail Page (`/admin/inputs/[inputId]`)
- Full input text display
- **Quality Metrics Grid**:
  - Urgency %
  - Importance %
  - Clarity %
  - Overall Quality %
  - Score and Tone chips
- Student metadata (anonymous: department, program, semester)
- Shows AI theme only for general inputs
- **Admin Actions**:
  - Reply to input with text field
  - Request identity reveal button
- **Activity History Timeline**:
  - Input submitted event
  - Admin reply sent (if any)
  - Identity reveal requested (if any)

### ✅ Student Portal

#### 1. Home/Dashboard (`/student/home`)
- Simple history view of submitted inputs
- Shows input text and timestamp
- Indicates if inquiry-linked or general
- Displays admin replies (in green success box)
- No AI analysis shown to students

#### 2. Active Inquiries (`/student/inquiries`)
- List of active inquiries student can respond to
- Inquiry cards showing:
  - Question prompt
  - Date range
  - Target audience
- "Respond to This Inquiry" button
- Filters out expired inquiries

#### 3. Submit General Feedback (`/input/submit`)
- Reusable InputForm component
- Character count (20-2000 characters)
- Form validation with Zod
- Anonymous submission notice
- Success feedback

### ✅ Shared Components

1. **ImportanceBadge**: Color-coded priority chips (HIGH/MEDIUM/LOW)
2. **SentimentIndicator**: Icons and colors for sentiment (Positive/Negative/Neutral/Mixed)
3. **ThemeChip**: Styled chips for displaying themes
4. **LoadingButton**: Button with loading state
5. **Loader**: Full-page loading spinner
6. **InlineLoader**: Inline loading indicator
7. **LogoIcon**: Text-based green gradient logo

### ✅ Theme & Styling
- Primary color changed from blue to green (#43a047 to #66bb6a)
- Consistent Material Design across all pages
- Responsive layouts for mobile, tablet, desktop
- Professional business aesthetic
- Color-coded severity/sentiment indicators

### ✅ Mock Data System
- Complete mock data matching reference project structure
- Realistic sample inputs, inquiries, topics
- AI analysis in Executive Summary format
- Pagination helpers
- Simulated API delays for realistic UX

---

## Remaining Work

### 🔴 Frontend (High Priority)

1. **Authentication System**
   - Currently no auth → sidebar empty
   - Need mock user toggle for development (Admin/Student switch)
   - Or wait for backend integration

2. **Create Inquiry Dialog**
   - Form needs `body` field instead of title + description
   - Update validation schema

3. **Student Input Submission**
   - Test inquiry response flow end-to-end
   - Test general feedback flow
   - Ensure form validation works correctly

4. **Missing Pages**
   - Student input detail page (view own submitted feedback)
   - Admin user management (if needed)

### 🟡 Frontend (Medium Priority)

5. **Error Handling**
   - Implement proper error boundaries
   - Toast notifications for all error cases
   - Retry mechanisms for failed API calls

6. **Loading States**
   - Skeleton loaders for list pages
   - Better loading indicators during transitions

7. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support

8. **Mobile Optimization**
   - Test all pages on mobile devices
   - Optimize tab layouts for small screens

### 🟢 Frontend (Low Priority / Nice to Have)

9. **Data Visualization**
   - Charts for sentiment trends
   - Engagement metrics graphs
   - Department comparison charts

10. **Search & Filters**
    - Search inputs by keyword
    - Filter topics by severity
    - Date range filters

11. **Export Features**
    - Export inquiry analysis to PDF
    - Export topic summary to Excel
    - Download raw input data

12. **Notifications**
    - Real-time notifications for new inputs
    - Admin notification for identity reveal approval
    - Student notification for admin replies

---

## Backend Requirements

### Database Schema

#### Users Table
```sql
- id (PK)
- email
- password_hash
- role (ADMIN, STUDENT)
- department
- program
- semester
- created_at
```

#### Inquiries Table
```sql
- id (PK)
- body (TEXT)
- status
- target_departments (JSON)
- target_programs (JSON)
- target_semesters (JSON)
- start_date
- end_date
- created_by (FK → Users)
- created_at
- updated_at
```

#### Inputs Table
```sql
- id (PK)
- body (TEXT)
- type (INQUIRY_LINKED, GENERAL)
- inquiry_id (FK → Inquiries, nullable)
- topic_id (FK → Topics, nullable)
- student_id (FK → Users)
- department
- program
- semester
- identity_revealed (boolean)
- sentiment
- tone
- ai_theme (nullable)
- urgency_pct (decimal)
- importance_pct (decimal)
- clarity_pct (decimal)
- helpfulness_pct (decimal)
- quality_pct (decimal)
- score (int)
- severity (int 1-3)
- admin_reply_message (TEXT, nullable)
- admin_reply_at (timestamp, nullable)
- admin_reply_by (FK → Users, nullable)
- identity_reveal_requested (boolean)
- identity_reveal_requested_at (timestamp, nullable)
- status (PENDING, PROCESSING, PROCESSED)
- created_at
```

#### Topics Table
```sql
- id (PK)
- topic (VARCHAR)
- description (TEXT)
- status (ACTIVE, ARCHIVED)
- average_score (decimal)
- severity (int 1-3)
- insights_summary (JSON)
- overall_sentiment (JSON)
- importance_breakdown (JSON)
- created_at
```

#### InquiryAnalysis Table (JSON storage or separate)
```sql
- id (PK)
- inquiry_id (FK → Inquiries)
- ai_summary (JSON)
- engagement_metrics (JSON)
- generated_at
```

### API Endpoints

#### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

#### Inquiries
- `GET /api/inquiries` - List inquiries (with filters)
- `POST /api/inquiries` - Create inquiry
- `GET /api/inquiries/:id` - Get inquiry detail with AI analysis
- `PUT /api/inquiries/:id` - Update inquiry
- `DELETE /api/inquiries/:id` - Delete inquiry

#### Inputs
- `GET /api/inputs` - List inputs (admin only)
- `POST /api/inputs` - Submit input (student)
- `GET /api/inputs/:id` - Get input detail
- `POST /api/inputs/:id/reply` - Admin reply
- `POST /api/inputs/:id/request-reveal` - Request identity reveal
- `POST /api/inputs/:id/approve-reveal` - Student approves reveal

#### Topics
- `GET /api/topics` - List topics
- `GET /api/topics/:id` - Get topic detail with AI analysis

#### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### AI Service Integration

The backend needs to integrate with an AI service (OpenAI, Azure OpenAI, or custom model) for:

1. **Input Classification**:
   - Sentiment analysis (Frustrated, Satisfied, Hopeful, Annoyed, etc.)
   - Tone detection (positive, negative, neutral)
   - Quality scoring (urgency, importance, clarity, helpfulness, quality)
   - Severity level (1-3)

2. **Topic Generation** (for general inputs):
   - Theme extraction (`aiTheme`)
   - Topic clustering
   - Topic naming and description

3. **Aggregate Analysis**:
   - Generate Executive Summary for inquiries
   - Generate Executive Summary for topics
   - Identify key topics
   - Create Suggested Prioritized Actions
   - Calculate sentiment distributions

### AI Prompting Strategy

**For Individual Inputs** (on submission):
```
Analyze this student feedback:
"{input_body}"

Provide:
1. Sentiment: One word (Frustrated, Satisfied, Hopeful, Annoyed, etc.)
2. Tone: positive, negative, or neutral
3. Scores (0-1):
   - Urgency: How time-sensitive?
   - Importance: How critical?
   - Clarity: How well-articulated?
   - Helpfulness: How actionable?
4. Severity: 1 (LOW), 2 (MEDIUM), or 3 (HIGH)
5. For general feedback only: Extract main theme (2-5 words)
```

**For Aggregate Analysis** (batch process or on-demand):
```
Analyze these {count} student feedback responses for inquiry: "{inquiry_body}"

Responses:
{list_of_inputs}

Generate:
1. Key topics (3-5 main themes)
2. Executive Summary:
   - Headline Insight (1 sentence)
   - Response Mix (distribution insights)
   - Key Takeaways (2-3 paragraphs)
   - Risks (what could go wrong)
   - Opportunities (what could be improved)
3. Suggested Prioritized Actions (3-5):
   - Action (specific, actionable)
   - Impact (HIGH/MEDIUM/LOW)
   - Challenges
   - Response Count (how many mentioned this)
   - Supporting Reasoning
```

---

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. **Clone the repository** (if using version control):
   ```bash
   cd /Users/mac/Projects/Work/FYP/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**:
   ```
   http://localhost:3000
   ```

### Testing the Application

Since authentication is not implemented, you'll need to:

1. **Mock User Context**: Uncomment or modify user context in `modules/user` to simulate logged-in users
2. **Test Admin Pages**: Navigate to `/admin/dashboard`
3. **Test Student Pages**: Navigate to `/student/home`

### Mock Data Location

All mock data is in:
```
/modules/shared/shared.mock-data-v2.js
```

You can modify this file to test with different data scenarios.

---

## Key Design Decisions

### 1. Why Single `body` Field for Inquiries?
Instead of separate `title` and `description`, using a single `body` field:
- **Simplifies data model**: One field to manage
- **More flexible**: Admin can structure the question as they see fit
- **Matches natural language**: Questions are inherently a single piece of text
- **Easier AI processing**: Single text input for context

### 2. Why No Theme for Inquiry Inputs?
Inquiry-linked inputs don't need themes because:
- **Context is clear**: The inquiry itself provides all context
- **Reduces noise**: Theme would be redundant with inquiry topic
- **Simpler analysis**: Focus on quality and sentiment, not categorization
- **AI efficiency**: Don't waste AI processing on unnecessary categorization

### 3. Why Executive Summary Format?
Structured format (Headline, Risks, Opportunities, etc.) provides:
- **Actionable insights**: Clear risk/opportunity identification
- **Executive-friendly**: Easy to scan and understand
- **Prioritized actions**: Immediate next steps with reasoning
- **Consistent format**: Same structure across inquiries and topics

### 4. Why Separate Inquiry and Topic Flows?
- **Different use cases**: Targeted vs. open-ended feedback
- **Different analysis needs**: Inquiry analysis is more focused
- **Better UX**: Students understand what they're responding to
- **Administrative control**: Admins can create inquiries proactively

---

## Next Steps for Backend Development

1. **Set up .NET 8 Web API project**
2. **Design and create database schema** (PostgreSQL or SQL Server)
3. **Implement authentication with JWT**
4. **Create API endpoints** (start with auth, then inquiries, inputs)
5. **Integrate OpenAI API** for AI analysis
6. **Implement background jobs** for:
   - Processing new inputs (AI classification)
   - Generating aggregate analysis (nightly or on-demand)
   - Topic clustering (batch process)
7. **Add real-time notifications** (SignalR)
8. **Deploy backend** (Azure, AWS, or on-premises)
9. **Update frontend** to consume real APIs (remove mock data)
10. **Comprehensive testing** (unit, integration, E2E)

---

## Contact & Support

**Project Owner**: KFUEIT Administration
**Development Team**: [Your Name/Team]
**Last Updated**: November 4, 2024

For questions or issues, please refer to the project repository or contact the development team.

---

**End of Documentation**

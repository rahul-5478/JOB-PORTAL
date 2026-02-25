# 🚀 HireAI — AI-Powered Job Portal (MERN Stack)

A full-stack placement platform where students build profiles, companies post jobs, and AI intelligently matches talent to opportunities.

---

## ✨ Features

### 👨‍🎓 Students
- Create rich profiles (skills, education, experience, projects)
- Upload resume to Cloudinary (PDF/DOC)
- **AI Job Matching** — GPT analyzes your profile and scores every job
- **AI Cover Letter Generator** — one click generates a personalized cover letter
- Apply to jobs with cover letter
- Track all applications with live status timeline
- Save favorite jobs
- Profile completeness tracker (0-100%)

### 🏢 Companies
- Company profile with logo upload
- **AI Job Description Generator** — write better JDs instantly
- Post, edit, close jobs
- Review applications with filters and sorting
- **AI Applicant Scoring** — score any candidate against the job with GPT
- Update application status with timeline notes
- Dashboard with stats

### 🤖 AI Features (via OpenAI GPT-3.5)
| Feature | Who | What it does |
|---------|-----|--------------|
| Job Matching | Students | Analyzes profile → scores all jobs → returns top 10 ranked |
| Cover Letter | Students | Generates personalized cover letter for any job |
| Applicant Scoring | Companies | Scores a candidate 0-100 with strengths & gaps |
| JD Generator | Companies | Writes a professional job description |

---

## 🗂 Project Structure

```
job-portal/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── cloudinary.js      # File upload config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── companyController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   └── aiController.js    # All AI features
│   ├── middleware/
│   │   └── auth.js            # JWT protect + role authorize
│   ├── models/
│   │   ├── User.js            # Base user (student/company/admin)
│   │   ├── Student.js         # Student profile + profileScore
│   │   ├── Company.js         # Company profile
│   │   ├── Job.js             # Job posting
│   │   └── Application.js     # Application with AI score + timeline
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── aiRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.js  # Global auth state
        ├── utils/
        │   └── api.js          # All API calls
        ├── components/
        │   └── shared/
        │       └── Navbar.js
        ├── pages/
        │   ├── Landing.js
        │   ├── Login.js
        │   ├── Register.js
        │   ├── Jobs.js         # Browse + filter jobs
        │   ├── JobDetail.js    # Apply + AI cover letter
        │   ├── Companies.js
        │   ├── student/
        │   │   ├── Dashboard.js
        │   │   ├── Profile.js  # Full profile editor
        │   │   ├── MyApplications.js
        │   │   └── AIMatches.js  # 🔥 AI job recommendations
        │   └── company/
        │       ├── Dashboard.js
        │       ├── Profile.js
        │       ├── PostJob.js    # AI description generator
        │       ├── ManageJobs.js
        │       └── ViewApplications.js  # AI candidate scoring
        ├── App.js
        ├── index.js
        └── index.css
```

---

## 🔧 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router 6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| AI | OpenAI GPT-3.5-turbo |
| File Storage | Cloudinary |
| Styling | Custom CSS (dark theme) |

---

## ⚡ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (free)
- OpenAI API key

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env    # Fill in your keys

# Frontend
cd ../frontend
npm install
```

### 2. Configure `.env` (backend)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_super_secret_key_here

# Get from cloudinary.com (free account)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Get from platform.openai.com
OPENAI_API_KEY=sk-...
```

### 3. Run

```bash
# Terminal 1 - Backend
cd backend
npm run dev    # runs on :5000

# Terminal 2 - Frontend
cd frontend
npm start      # runs on :3000
```

### 4. Open
Visit **http://localhost:3000**

---

## 📡 API Reference

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register student or company |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/me` | ✅ | Get current user |

### Jobs
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/jobs` | ❌ | List jobs with filters |
| POST | `/api/jobs` | Company | Create job |
| GET | `/api/jobs/:id` | ❌ | Get job detail |
| PUT | `/api/jobs/:id` | Company | Update job |
| DELETE | `/api/jobs/:id` | Company | Delete job |

### Applications
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/applications/apply/:jobId` | Student | Apply for job |
| GET | `/api/applications/my-applications` | Student | Get my applications |
| GET | `/api/applications/job/:jobId` | Company | Get job applications |
| PUT | `/api/applications/:id/status` | Company | Update status |

### AI
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/ai/job-matches` | Student | AI job recommendations |
| POST | `/api/ai/score-application/:id` | Company | Score applicant |
| POST | `/api/ai/generate-cover-letter` | Student | Generate cover letter |
| POST | `/api/ai/generate-job-description` | Company | Generate JD |

---

## 🗄 MongoDB Schema Relations

```
User (base) ──┬──→ Student (1:1)
              └──→ Company (1:1)

Company ──→ Job (1:many)
Job ──→ Application (1:many)
Student ──→ Application (1:many)
Student.savedJobs ──→ [Job] (many-to-many)
```

---

## 🛡 Security Features

- JWT authentication with 30-day expiry
- Role-based access control (student/company/admin)
- bcrypt password hashing (12 rounds)
- File type validation on upload
- Input validation on all endpoints
- CORS configuration

---

## 🎨 Design System

Dark theme with:
- `--primary: #6c63ff` (Indigo)
- `--accent: #ff6b9d` (Pink)
- Custom CSS variables (no UI library needed)
- Sora font family
- Responsive grid layouts
- Smooth animations

---

Built with ❤️ — HireAI MERN Stack

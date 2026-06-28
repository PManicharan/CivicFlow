# CivicFlow v2.1

> **Intelligent Community Safety Intelligence Platform Powered by AI**

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.9%2B-blue?style=flat-square&logo=python" alt="Python">
  <img src="https://img.shields.io/badge/TypeScript-React-blue?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Firebase-Firestore-orange?style=flat-square&logo=firebase" alt="Firebase">
  <img src="https://img.shields.io/badge/Google-Gemini%20AI-red?style=flat-square&logo=google" alt="Gemini">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License">
</p>

---

## 🚀 One-Line Pitch

**CivicFlow** is an AI-powered civic reporting platform that transforms raw community signals into actionable intelligence through multimodal analysis, intelligent verification, and responsible decision support—enabling faster, smarter emergency response and community safety.

---

## 📋 Table of Contents

- [The Problem](#the-problem)
- [Why Existing Systems Fall Short](#why-existing-systems-fall-short)
- [Our Solution](#our-solution)
- [Key Features](#key-features)
- [AI Investigation Workflow](#ai-investigation-workflow)
- [Responsible AI Principles](#responsible-ai-principles)
- [Security Features](#security-features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 The Problem

Every day, communities face safety challenges that require rapid, accurate information response:

- 🚨 **Information Overload**: Hundreds of reports flood emergency systems with incomplete or contradictory information
- 🔍 **Manual Verification Bottleneck**: Human operators spend hours fact-checking unstructured community reports
- ⚠️ **Response Delays**: Critical safety signals are buried in noise, causing preventable delays
- 📱 **Untapped Resources**: Rich media (photos, videos, descriptions) often goes unanalyzed in civic reporting systems
- 🎯 **Bias & Inconsistency**: Human review introduces subjective assessment and inconsistent severity classification

**Result**: Communities respond slower, make less informed decisions, and expend critical resources inefficiently.

---

## 🔄 Why Existing Systems Fall Short

Current civic reporting platforms are fundamentally limited:

| Problem | Traditional Systems | CivicFlow v2.1 |
|---------|-------------------|-----------|
| **Analysis Speed** | 10-30 minutes manual review | Real-time AI assessment |
| **Data Integration** | Text only | Photos, videos, descriptions (multimodal) |
| **Consistency** | Operator-dependent | AI-powered standardization |
| **Verification** | Manual cross-checking | Automated cross-reference & validation |
| **Scale** | Requires human scaling | Scales instantly with demand |
| **Context Awareness** | Limited context | Semantic understanding of situations |

---

## 🚀 Version 2.1 Updates
CivicFlow v2.1 introduces a complete separation between public and secure environments, transforming it into a production-grade AI civic platform:
- **Public Citizen Portal**: Read-only tracking, interactive heatmaps, and community dashboards.
- **Secure Operations Workspace**: Firebase Auth protected command center for city officials.
- **AI Copilot**: 5+ new Gemini action prompts for drafting citizen responses, internal notes, and more.
- **Enterprise Security**: Complete Firestore security rules and authenticated routes.

---

## 💡 Our Solution

**CivicFlow** is a modern civic intelligence platform that combines community reporting with intelligent analysis:

### For Community Members
- **Simple Reporting**: One-tap signal submission with optional photo/video
- **Real-time Status**: Track investigation progress in real-time
- **Transparent Process**: See exactly how your report is being analyzed

### For Responders
- **Decision Support**: AI-generated investigation reports with severity assessments
- **Evidence Analysis**: Automatic validation of submitted media
- **Operations Dashboard**: Unified view of all signals and investigations
- **Trend Detection**: Identify patterns across multiple reports

### For Municipalities
- **Response Optimization**: Data-driven allocation of emergency resources
- **Audit Trail**: Complete documentation of how each decision was made
- **Predictive Intelligence**: Anticipate safety issues before escalation
- **Responsible AI**: Transparency controls and human-in-the-loop safeguards

---

## ✨ Key Features

### 🤖 Intelligent Analysis
- **Multimodal Processing**: Analyzes text descriptions, photos, and video evidence simultaneously
- **Safety Assessment**: AI-driven severity classification (Critical, High, Medium, Low)
- **Contextual Understanding**: Semantic analysis of incidents with location and temporal awareness
- **Evidence Validation**: Cross-checks user descriptions against submitted media

### 🔒 Responsible AI
- **Human-in-the-Loop**: All decisions include explainable reasoning for human reviewers
- **Bias Mitigation**: Fairness-aware processing prevents discriminatory outcomes
- **Prompt Injection Protection**: Adversarial input handling prevents AI manipulation
- **Audit Logging**: Every decision is logged with full reasoning chains

### 🛡️ Enterprise Security
- **End-to-End Encryption**: Data encrypted in transit and at rest
- **Zero-Trust Architecture**: All endpoints require authentication
- **GDPR Compliant**: Privacy-by-design data handling
- **Regular Security Audits**: Third-party vulnerability assessments

### 📊 Real-Time Operations
- **Live Dashboard**: Unified operations center for all active signals
- **Automated Routing**: Intelligent dispatch to appropriate departments
- **AI Copilot Workspace**: Chat with Gemini to generate responses and internal notes
- **Integration Ready**: APIs for third-party systems and workflows

---

## 🔬 AI Investigation Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    Community Report                         │
│              (Text + Photo/Video + Location)               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│         1️⃣ INPUT VALIDATION & SANITIZATION                 │
│    • Verify media integrity (no manipulation detected)      │
│    • Extract location and temporal context                  │
│    • Anonymize personally identifiable information          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│    2️⃣ MULTIMODAL ANALYSIS (Powered by Gemini 1.5 Pro)      │
│    • Text: NLP for incident categorization                  │
│    • Vision: Computer vision for visual evidence            │
│    • Fusion: Cross-modal consistency checking               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│      3️⃣ EVIDENCE ASSESSMENT & SEVERITY CLASSIFICATION      │
│    • Consistency Score: How aligned are descriptions        │
│    • Confidence Level: AI certainty in classification       │
│    • Safety Severity: Critical → High → Medium → Low        │
│    • Reasoning Explanation: Why this classification         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│       4️⃣ HUMAN REVIEW & APPROVAL (Decision Gateway)        │
│    • Operator reviews AI reasoning and evidence             │
│    • Can accept, modify, or reject classification           │
│    • Adds human judgment to final assessment                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│    5️⃣ INTELLIGENT ROUTING & OPERATIONS                     │
│    • Route to appropriate department/responder              │
│    • Trigger automated workflows if needed                  │
│    • Generate audit trail with full decision chain          │
│    • Notify community member of investigation status        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
          ✅ INVESTIGATION COMPLETE
```

**Key Principles:**
- ✅ AI assists, humans decide
- ✅ Every decision is explainable
- ✅ Bias monitoring at each stage
- ✅ Full audit trail maintained

---

## 🤝 Responsible AI Principles

We believe AI should enhance human decision-making, not replace it. Our implementation follows these principles:

### 1. **Transparency**
- Every assessment includes reasoning explanation
- Users understand why severity was assigned
- Audit logs show complete decision history

### 2. **Human Oversight**
- No automated emergency dispatch without human approval
- Operators can see and modify AI reasoning
- Escalation paths for complex scenarios

### 3. **Fairness**
- Regular bias audits across demographic groups
- Continuous monitoring for discriminatory outcomes
- Feedback loops to improve consistency

### 4. **Robustness**
- Adversarial input testing prevents prompt injection
- Media validation prevents AI manipulation
- Graceful degradation if AI components fail

### 5. **Privacy**
- Minimal data retention with automatic purging
- No cross-domain data sharing
- User consent for all analytics

---

## 🔐 Security Features

### Data Protection
- 🔐 **AES-256 Encryption**: Data encrypted at rest
- 🔒 **TLS 1.3**: All transit data encrypted
- 🗝️ **Key Rotation**: Automatic credential management
- 🔑 **Zero-Trust**: Every request authenticated

### Input Security
- ✅ **Prompt Injection Prevention**: Adversarial input filtering
- 📸 **Media Validation**: File integrity checks
- 🛡️ **SQL Injection Protection**: Parameterized queries only
- 🚫 **XSS Prevention**: Content security policies

### Compliance
- ✅ **GDPR Ready**: Data minimization, right to deletion
- ✅ **CCPA Compliant**: Privacy controls and transparency
- ✅ **SOC 2**: Security audit frameworks
- ✅ **HIPAA**: If handling health data

### Monitoring
- 📊 Real-time security event logging
- 🚨 Anomaly detection for suspicious activity
- 🔔 Automated incident response triggers
- 📋 Regular penetration testing

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   CIVICFLOW PLATFORM                     │
└──────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + TypeScript)           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Community    │  │ Investigation│  │ Operations   │      │
│  │ Signal Entry │  │ Dashboard    │  │ Workspace    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────┬────────────────────────────────────────────────┘
             │
        🔌 REST/WebSocket
             │
┌────────────┴────────────────────────────────────────────────┐
│              BACKEND (FastAPI + Python)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ API Routes                                           │   │
│  │ • Signal Submission  • Investigation Management     │   │
│  │ • Media Upload       • Operations Dashboard         │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │                                             │
│  ┌──────────────┴───────────────────────────────────────┐   │
│  │ Services Layer                                       │   │
│  │ ┌────────────────┐  ┌─────────────────────────────┐ │   │
│  │ │ AI Analysis    │  │ Firestore Operations        │ │   │
│  │ │ (Gemini 1.5    │  │ • Reports  • Metadata       │ │   │
│  │ │  Pro)          │  │ • Media    • Audit Logs     │ │   │
│  │ └────────────────┘  └─────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────┬────────────────────────────────────────────────┘
             │
        🔌 Native SDKs
             │
┌────────────┴────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                              │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐    │
│  │ Firebase     │  │ Google       │  │ Security       │    │
│  │ Firestore    │  │ Gemini AI    │  │ Monitoring     │    │
│  │ Storage      │  │              │  │                │    │
│  └──────────────┘  └──────────────┘  └────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS + PostCSS
- **Build Tool**: Vite (lightning-fast dev server)
- **Router**: React Router v7
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Linting**: oxlint + Prettier

### Backend
- **Framework**: FastAPI (modern, fast, production-ready)
- **Server**: Uvicorn with async support
- **Validation**: Pydantic v2 with settings
- **Database**: Firebase Firestore (real-time, scalable)
- **Storage**: Firebase Cloud Storage
- **AI Model**: Google Gemini 1.5 Pro (multimodal)
- **Environment**: Python 3.9+

### DevOps & Infrastructure
- **Hosting**: Firebase (cloud functions, hosting)
- **CI/CD**: GitHub Actions (automated testing & deployment)
- **Monitoring**: Firebase Analytics + Cloud Logging
- **Container Ready**: Docker support (optional)

### Security
- **Auth**: Firebase Authentication
- **Secrets**: Environment-based configuration
- **Encryption**: TLS 1.3 + AES-256
- **API Security**: CORS + Rate Limiting

---

## 📁 Project Structure

```
CivicFlow/
├── .gitignore                  # Git exclusions
├── README.md                   # This file
├── SECURITY.md                 # Security guidelines
├── LICENSE                     # MIT License
│
├── frontend/                   # React TypeScript SPA
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── layout/         # Page layout components
│   │   │   ├── landing/        # Hero & marketing components
│   │   │   └── ui/             # Primitive UI components
│   │   ├── pages/              # Page components (routed)
│   │   ├── lib/                # Utility functions
│   │   ├── assets/             # Static assets
│   │   ├── App.tsx             # Root app component
│   │   └── main.tsx            # Entry point
│   ├── package.json            # Dependencies
│   ├── vite.config.ts          # Build config
│   ├── tailwind.config.js      # Tailwind theme
│   └── tsconfig.json           # TypeScript config
│
└── backend/                    # FastAPI Python API
    ├── app/
    │   ├── main.py             # FastAPI app factory
    │   ├── api/
    │   │   └── routes.py        # API endpoints
    │   ├── core/
    │   │   ├── config.py        # Settings & environment
    │   │   └── firebase.py      # Firebase initialization
    │   ├── models/
    │   │   └── schemas.py       # Pydantic schemas
    │   └── services/
    │       ├── firestore.py     # Database operations
    │       └── gemini.py        # AI analysis service
    ├── requirements.txt         # Python dependencies
    ├── .env.example             # Environment template
    └── test_endpoint.py         # Integration tests
```

---

## 🚀 Quick Start

Get CivicFlow running locally in under 5 minutes:

```bash
# Clone the repository
git clone https://github.com/yourusername/civicflow.git
cd civicflow

# Setup backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Firebase and Gemini API keys

# Start backend (from backend directory)
uvicorn app.main:create_app --reload --port 8000

# In a new terminal, setup frontend
cd frontend
npm install
cp .env.example .env
# Edit .env with your Firebase config

# Start frontend development server
npm run dev

# Open http://localhost:5173 in your browser
```

---

## 📦 Installation

### Prerequisites
- **Node.js**: 18.x or higher
- **Python**: 3.9 or higher
- **npm/pnpm**: Latest version
- **Git**: For version control
- **Firebase Project**: Create at [firebase.google.com](https://firebase.google.com)
- **Google Gemini API Key**: Get from [Google AI Studio](https://ai.google.dev/)

### Backend Installation

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate environment
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Verify installation
python -c "import fastapi; print(fastapi.__version__)"
```

### Frontend Installation

```bash
cd frontend

# Install dependencies
npm install
# or with pnpm:
pnpm install

# Verify installation
npm --version
npm list react react-dom
```

---

## ⚙️ Environment Variables

### Backend (.env)

```bash
# API Configuration
PROJECT_NAME=CivicFlow
ENVIRONMENT=development
PORT=8000

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration
FIREBASE_CREDENTIALS_PATH=./service-account.json

# CORS Settings
BACKEND_CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
```

**Getting Credentials:**
1. **Gemini API Key**: 
   - Visit [Google AI Studio](https://ai.google.dev/)
   - Click "Get API Key"
   - Copy your key to `GEMINI_API_KEY`

2. **Firebase Credentials**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing
   - Go to Service Accounts tab
   - Download JSON key file
   - Save as `service-account.json` in backend root

### Frontend (.env)

```bash
# API Configuration
VITE_API_URL=http://localhost:8000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Getting Firebase Config:**
- Firebase Console → Project Settings → Your apps
- Select your web app
- Copy the firebaseConfig object values

---

## ▶️ Running Locally

### Terminal 1: Backend API

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:create_app --reload --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

Visit http://localhost:8000/docs for Swagger API documentation.

### Terminal 2: Frontend Development

```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

Visit http://localhost:5173 to see the application.

### Terminal 3: Test Endpoint (Optional)

```bash
cd backend
python test_endpoint.py
```

---

## 🌐 Deployment

### Backend Deployment (Google Cloud Run)

```bash
# Build and deploy container
gcloud run deploy civicflow-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --set-env-vars ENVIRONMENT=production,GEMINI_API_KEY=your_key

# Get the service URL
gcloud run services describe civicflow-api --region us-central1
```

### Frontend Deployment (Firebase Hosting)

```bash
cd frontend

# Build for production
npm run build

# Initialize Firebase hosting
firebase init hosting

# Deploy
firebase deploy --only hosting
```

### Complete Stack (Docker)

```bash
# Build image
docker build -t civicflow .

# Run container
docker run -p 8000:8000 -p 5173:5173 \
  -e GEMINI_API_KEY=your_key \
  civicflow
```

---

## 📸 Screenshots

### Community Signal Submission
![Signal Submission](https://via.placeholder.com/800x450/0066cc/ffffff?text=Community+Signal+Submission)
*Submit civic reports with photos, descriptions, and location data*

### Investigation Dashboard
![Investigation Dashboard](https://via.placeholder.com/800x450/0066cc/ffffff?text=Investigation+Dashboard)
*Real-time AI analysis with severity assessment and evidence validation*

### Operations Workspace
![Operations Workspace](https://via.placeholder.com/800x450/0066cc/ffffff?text=Operations+Workspace)
*Unified dashboard for responders to manage and route investigations*

### AI Analysis Report
![AI Analysis Report](https://via.placeholder.com/800x450/0066cc/ffffff?text=AI+Analysis+Report)
*Detailed reasoning, confidence scores, and explainable AI decisions*

---

## 🗺️ Future Roadmap

### Phase 2: Advanced Intelligence
- [ ] **Predictive Analytics**: Anticipate safety hotspots
- [ ] **Pattern Recognition**: Detect coordinated incident campaigns
- [ ] **Anomaly Detection**: Identify unusual incident clusters
- [ ] **Trend Analysis**: Track incident evolution over time

### Phase 3: Ecosystem Integration
- [ ] **Emergency Services API**: Direct dispatch integration
- [ ] **Third-Party Analytics**: Export to BI tools
- [ ] **Public Portal**: Community dashboard
- [ ] **Mobile App**: iOS/Android native apps

### Phase 4: Advanced AI
- [ ] **Multi-Modal Fusion**: Video analysis in addition to photos
- [ ] **Natural Language Processing**: Extract intent from descriptions
- [ ] **Temporal Analysis**: Time-series incident patterns
- [ ] **Network Analysis**: Relationship mapping between incidents

### Phase 5: Enterprise
- [ ] **Role-Based Access Control**: Granular permissions
- [ ] **Audit Trail Export**: Compliance reporting
- [ ] **Custom Workflows**: Organization-specific processes
- [ ] **SLA Management**: Service level tracking

---

## 🤝 Contributing

We welcome contributions from the community! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on:
- Code of conduct
- Development setup
- Pull request process
- Commit message conventions
- Testing requirements

**Quick contribution guide:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

CivicFlow is licensed under the **MIT License**. See [LICENSE](LICENSE) file for details.

This means you can:
- ✅ Use commercially
- ✅ Modify the code
- ✅ Distribute copies
- ✅ Include in proprietary software

Under the condition that you include a copy of the license and copyright notice.

---

## 🙏 Acknowledgements

CivicFlow is built on the shoulders of incredible open-source projects:

**Frontend**
- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) - API framework
- [Pydantic](https://docs.pydantic.dev/) - Data validation
- [Firebase](https://firebase.google.com/) - Backend services

**AI/ML**
- [Google Gemini](https://ai.google.dev/) - Multimodal AI model
- [Google Cloud](https://cloud.google.com/) - Infrastructure

**Community**
- Special thanks to all contributors and community members
- Inspired by civic tech pioneers and emergency response professionals

---

## 📞 Support

- 📧 **Email**: support@civicflow.io
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/civicflow/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/civicflow/discussions)
- 📚 **Documentation**: [Full Docs](https://docs.civicflow.io)

---

<div align="center">

**Made with ❤️ by the CivicFlow Team**

[⬆ back to top](#civicflow)

</div>

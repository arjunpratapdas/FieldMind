# ⚡ FieldMind — AI Field Technician Assistant

> Real-time multimodal AI assistant for field service technicians powered by Google Gemini Live API

[![Live Demo](https://img.shields.io/badge/Demo-Live-success)](https://feisty-parity-416714.web.app)
[![Backend](https://img.shields.io/badge/Backend-Cloud%20Run-blue)](https://fieldmind-backend-809015144044.us-central1.run.app/health)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**URLS:**

**Live App:** https://feisty-parity-416714.web.app  
**Backend API:** https://fieldmind-backend-809015144044.us-central1.run.app

---

## 📖 Table of Contents
- [Overview](#-overview)
- [Quick Start for Judges](#-quick-start-for-judges-5-minutes)
- [Full Setup Instructions](#-full-setup-instructions)
- [Architecture](#-architecture)
- [Features & Demo Scenarios](#-features--demo-scenarios)
- [GCP Services Used](#-gcp-services-used)
- [Tech Stack](#-tech-stack)
- [Testing Guide](#-testing-guide)
- [Deployment](#-deployment)

---

## 🎯 Overview

**The Problem:** Field service technicians spend 40% of their time searching through equipment manuals, troubleshooting guides, and service records—time that could be spent actually fixing equipment. This inefficiency costs the HVAC industry billions annually.

**The Solution:** FieldMind is a multimodal AI assistant that combines voice, vision, and knowledge grounding to provide instant, cited technical guidance in real field conditions.

### Key Capabilities
- 🎤 **Voice Conversation** — Natural dialogue with barge-in capability (Gemini Live API)
- 📷 **Live Camera Vision** — Automatic equipment identification (Gemini Flash 2.0 Vision)
- 📚 **RAG over Manuals** — Grounded answers with citations (Vertex AI Vector Search)
- 📊 **Service History** — Context-aware diagnosis from Firestore
- 🚨 **Intelligent Escalation** — Multi-service workflow (Pub/Sub + Cloud Functions)

---

## 🚀 Quick Start for Judges (5 Minutes)

### Option 1: Try the Live Demo (Fastest)

**No setup required!** Just open on your phone or computer:

**🌐 Live App:** https://feisty-parity-416714.web.app

**What to do:**
1. Allow camera and microphone permissions
2. Verify status bar shows **"🟢 LIVE"** (connected to backend)
3. Point camera at any HVAC equipment (or Google "HVAC nameplate" and point at screen)
4. Tap microphone button and say: **"Hello, can you help me troubleshoot an AC unit?"**
5. Try: **"What does error code E7 mean?"**
6. Try: **"I need to escalate this case"** (watch for modal)

**Expected Results:**
- ✅ Equipment badge appears when pointing at equipment
- ✅ Your speech appears in transcript (blue text)
- ✅ AI responds with technical guidance (gold text)
- ✅ Escalation modal appears with case ID
- ✅ Case saved to Firestore (verify at console link below)

**Verify Backend:**
```bash
curl https://fieldmind-backend-809015144044.us-central1.run.app/health
# Should return: {"status":"healthy","active_sessions":N}
```

**Verify Database:**
- Firestore Console: https://console.firebase.google.com/project/feisty-parity-416714/firestore
- Check `/cases` collection for escalation records

---

### Option 2: Run Locally (15 Minutes)

**Prerequisites:**
- Node.js 18+ and Python 3.11+
- Google Cloud account (free tier works)
- Gemini API key

**Step 1: Clone Repository**
```bash
git clone https://github.com/arjunpratapdas/FieldMind.git
cd FieldMind
```

**Step 2: Backend Setup**
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start backend
uvicorn main:app --reload --port 8000
```

**Step 3: Frontend Setup (New Terminal)**
```bash
cd fieldmind-pwa

# Install dependencies
npm install

# Configure environment
echo "REACT_APP_BACKEND_URL=ws://localhost:8000/ws" > .env.local

# Start frontend
npm start
```

**Step 4: Test**
- Open http://localhost:3000
- Allow camera/microphone permissions
- Verify status shows "LIVE"
- Test voice and camera features

---

## 📋 Full Setup Instructions

### Prerequisites

**Required:**
- Node.js 18+ ([Download](https://nodejs.org/))
- Python 3.11+ ([Download](https://www.python.org/))
- Git ([Download](https://git-scm.com/))

**For Full Deployment:**
- Google Cloud account with billing enabled
- Firebase account (free tier works)
- SendGrid account (free tier, for escalation emails)

**API Keys Needed:**
- Gemini API Key ([Get it here](https://aistudio.google.com/app/apikey))
- SendGrid API Key (optional, for email notifications)

---

### Detailed Setup

#### 1. Clone and Navigate
```bash
git clone https://github.com/arjunpratapdas/FieldMind.git
cd FieldMind
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# GCP Configuration (for production)
GCP_PROJECT_ID=feisty-parity-416714
GCP_REGION=us-central1
PUBSUB_TOPIC=field-escalations

# SendGrid (optional, for escalation emails)
SENDGRID_API_KEY=your_sendgrid_key_here
DISPATCH_EMAIL=your_email@example.com
EOF

# Edit .env and add your actual API keys
nano .env  # or use your preferred editor

# Test backend
python -c "from agent import FieldMindAgent; print('✅ Backend imports working')"

# Start backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Backend should now be running at:** http://localhost:8000

**Test it:**
```bash
# In a new terminal
curl http://localhost:8000/health
# Should return: {"status":"healthy","active_sessions":0}
```

#### 3. Frontend Setup

```bash
# Open new terminal
cd fieldmind-pwa

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
# Backend WebSocket URL
# For local development:
REACT_APP_BACKEND_URL=ws://localhost:8000/ws

# For production (Cloud Run):
# REACT_APP_BACKEND_URL=wss://your-backend-url.run.app/ws
EOF

# Start development server
npm start
```

**Frontend should open automatically at:** http://localhost:3000

#### 4. Test the Application

**In your browser (http://localhost:3000):**

1. **Check Connection:**
   - Status bar should show "🟢 LIVE"
   - If not, check backend is running

2. **Test Camera:**
   - Allow camera permission
   - Point at any object
   - Equipment badge should appear (may show "Unknown" for non-HVAC items)

3. **Test Voice:**
   - Allow microphone permission
   - Click and hold microphone button
   - Say: "Hello, can you help me?"
   - Release button
   - Your text should appear in transcript
   - AI should respond

4. **Test Escalation:**
   - Click microphone
   - Say: "I need to escalate this case"
   - Orange modal should appear with case ID

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FIELDMIND                               │
│                    Multimodal AI Assistant                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (PWA)                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Camera     │  │    Voice     │  │  Transcript  │         │
│  │   Feed       │  │   Button     │  │   Overlay    │         │
│  │  (1 FPS)     │  │  (16kHz PCM) │  │  (Real-time) │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  React 18 + TypeScript + Tailwind CSS                          │
│  Deployed on: Firebase Hosting                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                         WebSocket
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (Cloud Run)                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              FastAPI WebSocket Server                    │  │
│  │  • Session Management                                    │  │
│  │  • Audio/Frame Processing                                │  │
│  │  • Message Routing                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           FieldMind Agent (ADK)                          │  │
│  │  • Gemini Live 2.5 Flash                                 │  │
│  │  • System Prompt + Tool Registration                     │  │
│  │  • Conversation History                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                    ┌─────────┴─────────┐                        │
│                    ▼                   ▼                        │
│  ┌─────────────────────┐  ┌─────────────────────┐             │
│  │  Audio Processing   │  │  Vision Processing  │             │
│  │  • Base64 Decode    │  │  • Frame Buffer     │             │
│  │  • PCM Validation   │  │  • Async Analysis   │             │
│  └─────────────────────┘  └─────────────────────┘             │
│                                                                 │
│  Python 3.11 + FastAPI + ADK                                   │
│  Deployed on: Cloud Run (min-instances=1)                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                      4 ADK TOOLS                                │
│                                                                 │
│  1️⃣  analyze_equipment(image_b64)                              │
│      → Gemini Flash 2.0 Vision API                             │
│      → Returns: {make, model, serial, confidence, faults}      │
│                                                                 │
│  2️⃣  search_manuals(query, model_id)                           │
│      → Vertex AI Vector Search                                 │
│      → Returns: [{text, source, confidence}]                   │
│                                                                 │
│  3️⃣  get_service_history(unit_id)                              │
│      → Cloud Firestore Query                                   │
│      → Returns: {equipment, service_history[]}                 │
│                                                                 │
│  4️⃣  escalate_case(summary, severity)                          │
│      → Firestore Write + Pub/Sub Publish                       │
│      → Returns: {case_id, status, eta}                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   GCP DATA LAYER         │  │   GCP AI LAYER           │
│                          │  │                          │
│  • Cloud Firestore       │  │  • Gemini Live API       │
│    - /equipment          │  │  • Gemini Flash Vision   │
│    - /service_records    │  │  • text-embedding-004    │
│    - /manual_chunks      │  │  • Vertex AI Vector      │
│    - /cases              │  │    Search                │
│                          │  │                          │
│  • Cloud Storage         │  └──────────────────────────┘
│    - Manual PDFs         │
│    - Embeddings JSONL    │
│                          │
│  • Cloud Pub/Sub         │
│    - field-escalations   │
│                          │
│  • Cloud Functions       │
│    - send-escalation     │
│      -email              │
└──────────────────────────┘
```

### Data Flow

**1. Voice Interaction:**
```
User speaks → MediaRecorder → 16kHz PCM → Base64 → WebSocket
→ Backend → Gemini Live API → Response → WebSocket → Frontend
→ Transcript Display
```

**2. Camera Vision:**
```
Camera (1 FPS) → JPEG → Base64 → WebSocket → Backend
→ analyze_equipment() → Gemini Vision → Equipment Data
→ WebSocket → Frontend → Equipment Badge
```

**3. Manual Search (RAG):**
```
User query → Gemini Live → search_manuals() tool call
→ text-embedding-004 → Vector Search → Top 3 chunks
→ Gemini Live (with context) → Cited response → User
```

**4. Escalation:**
```
User: "escalate" → Gemini Live → escalate_case() tool call
→ Firestore write → Pub/Sub publish → Cloud Function
→ SendGrid email → Dispatch notified
→ Modal shown to user
```

---

## 🎮 Features & Demo Scenarios

### Core Features

#### 1. **Real-Time Voice Conversation**
- Natural language dialogue with Gemini Live API
- Barge-in capability (interrupt AI mid-sentence)
- Hands-free operation for field conditions
- 16kHz PCM audio streaming

**Demo:**
```
YOU: "Hello, can you help me troubleshoot an AC unit?"
AI: "Of course! I'm FieldMind, your AI assistant. What seems to be the issue?"
YOU: "The unit is showing error code E7"
AI: "E7 indicates low refrigerant pressure. [Manual: Carrier 50XC, Section 4.2]
     Let me walk you through the troubleshooting steps..."
```

#### 2. **Live Camera Vision**
- Automatic equipment identification (1 FPS)
- Extracts make, model, serial number from nameplates
- Detects visible fault codes and damage
- Non-blocking async processing

**Demo:**
```
[Point camera at HVAC unit]
→ Equipment badge appears: "🏭 Carrier 50XC-A12 | Confidence: 87%"
→ AI: "I can see you're working on a Carrier 50XC unit. 
      This model is known for refrigerant pressure issues..."
```

#### 3. **RAG over Equipment Manuals**
- Semantic search across equipment manuals
- Every response includes citations
- Grounded in actual manufacturer documentation
- Prevents AI hallucination

**Demo:**
```
YOU: "How do I check refrigerant levels?"
AI: "To check refrigerant levels on this Carrier unit:
     1. Locate the service ports on the refrigerant lines
     2. Attach pressure gauges to both high and low sides
     3. Compare readings to spec: 120-130 PSI (low), 250-280 PSI (high)
     [Manual: Carrier 50XC Service Manual, Section 5.3, Page 42]"
```

#### 4. **Service History Context**
- Retrieves past service records from Firestore
- Identifies recurring issues
- Informs diagnosis with historical patterns

**Demo:**
```
AI: "I see this unit has had E7 fault codes 3 times in the past 18 months.
     Previous technician Mike R. added refrigerant each time but found no leaks.
     This suggests a slow leak that's hard to detect. I recommend using
     UV dye this time to locate the source."
```

#### 5. **Intelligent Case Escalation**
- Multi-service workflow (Firestore + Pub/Sub + Cloud Functions)
- Automatic dispatch notification
- Case tracking with unique IDs
- 30-minute response time SLA

**Demo:**
```
YOU: "This is beyond my scope, I need to escalate"
AI: "Understood. Creating escalation case now..."
[Modal appears]
┌─────────────────────────────┐
│  ⚠️  CASE ESCALATED         │
│  Case ID: CASE-1710612345   │
│  Severity: HIGH             │
│  ✅ Dispatch notified       │
│  Response time: 30 minutes  │
└─────────────────────────────┘
```

### Demo Scenarios for Judges

**Scenario 1: The Diagnosis (60 seconds)**
1. Point camera at HVAC equipment
2. Say: "What's wrong with this unit?"
3. Watch: Equipment identified → Manual searched → Cited response

**Scenario 2: Barge-In (30 seconds)**
1. Ask a long question
2. While AI is responding, interrupt with "Wait, I see something else"
3. Watch: AI stops immediately and adapts

**Scenario 3: Visual Reading (30 seconds)**
1. Point camera at wiring diagram or nameplate
2. Say: "Can you read this?"
3. Watch: AI reads and explains the diagram

**Scenario 4: Escalation (30 seconds)**
1. Say: "I need to escalate this case"
2. Watch: Modal appears → Check Firestore for case record

---

## 🔧 GCP Services Used

### 1. **Cloud Run**
- **Purpose:** Backend API hosting
- **Configuration:** 
  - min-instances: 1 (no cold starts)
  - memory: 1Gi
  - timeout: 300s
  - WebSocket support enabled
- **URL:** https://fieldmind-backend-809015144044.us-central1.run.app

### 2. **Gemini Live API (Vertex AI)**
- **Purpose:** Multimodal conversational AI
- **Model:** gemini-2.5-flash
- **Features Used:**
  - Voice conversation with barge-in
  - Tool calling (4 custom tools)
  - System instruction
  - Conversation history

### 3. **Gemini Flash 2.0 Vision (Vertex AI)**
- **Purpose:** Equipment identification from camera
- **Model:** gemini-1.5-flash (with vision)
- **Input:** Base64 JPEG images
- **Output:** Structured JSON with equipment data

### 4. **Vertex AI Vector Search**
- **Purpose:** Semantic search over equipment manuals
- **Embeddings:** text-embedding-004 (768 dimensions)
- **Index:** Manual chunks with metadata
- **Query:** Top-3 nearest neighbors

### 5. **Cloud Firestore**
- **Purpose:** Real-time NoSQL database
- **Collections:**
  - `/equipment` - Equipment records
  - `/service_records` - Service history
  - `/manual_chunks` - Manual text chunks
  - `/cases` - Escalation cases
- **Console:** https://console.firebase.google.com/project/feisty-parity-416714/firestore

### 6. **Cloud Storage**
- **Purpose:** File storage
- **Buckets:**
  - `fieldmind-manuals` - Equipment manual PDFs
  - Embeddings JSONL files for Vector Search

### 7. **Cloud Pub/Sub**
- **Purpose:** Event-driven messaging
- **Topic:** `field-escalations`
- **Subscribers:** Cloud Function for email notifications

### 8. **Cloud Functions (Gen2)**
- **Purpose:** Serverless escalation workflow
- **Function:** `send-escalation-email`
- **Trigger:** Pub/Sub topic `field-escalations`
- **Action:** Send email via SendGrid

### 9. **Firebase Hosting**
- **Purpose:** PWA deployment with global CDN
- **URL:** https://feisty-parity-416714.web.app
- **Features:** HTTPS, custom domain support, SPA routing

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.11+
- GCP account with billing enabled
- Firebase account

### Frontend Setup
```bash
cd fieldmind-pwa
npm install
cp .env.example .env.local
# Edit .env.local with your backend URL
npm start
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
# Configure .env with your GCP credentials
uvicorn main:app --reload
```

---

## 📦 Project Structure

```
FieldMind/
│
├── fieldmind-pwa/                    # React PWA Frontend
│   ├── public/
│   │   ├── index.html               # PWA entry point
│   │   └── manifest.json            # PWA manifest
│   │
│   ├── src/
│   │   ├── components/              # UI Components
│   │   │   ├── CameraFeed.tsx       # Camera view + equipment badge
│   │   │   ├── VoiceButton.tsx      # Mic button with audio level
│   │   │   ├── StatusBar.tsx        # Connection + agent status
│   │   │   ├── TranscriptOverlay.tsx # Conversation display
│   │   │   └── EscalationAlert.tsx  # Escalation modal
│   │   │
│   │   ├── hooks/                   # Custom React Hooks
│   │   │   ├── useWebSocket.ts      # WebSocket management
│   │   │   ├── useAudioStream.ts    # Audio capture + streaming
│   │   │   └── useCameraCapture.ts  # Camera frame capture
│   │   │
│   │   ├── types/                   # TypeScript Types
│   │   │   └── index.ts             # Shared type definitions
│   │   │
│   │   ├── FieldMindApp.tsx         # Main app component
│   │   ├── index.tsx                # React entry point
│   │   └── index.css                # Tailwind + custom styles
│   │
│   ├── .env.local                   # Environment variables
│   ├── .env.example                 # Environment template
│   ├── package.json                 # Dependencies
│   ├── tailwind.config.js           # Tailwind configuration
│   ├── firebase.json                # Firebase Hosting config
│   ├── .firebaserc                  # Firebase project
│   └── deploy.sh                    # Deployment script
│
├── backend/                          # Python FastAPI Backend
│   ├── main.py                      # FastAPI WebSocket server
│   ├── agent.py                     # FieldMind ADK agent
│   ├── tools.py                     # 4 ADK tools implementation
│   ├── firestore_client.py          # Firestore wrapper
│   ├── vector_search_client.py      # Vector Search wrapper
│   ├── chunk_manuals.py             # Manual chunking script
│   ├── seed_firestore.py            # Database seeding script
│   │
│   ├── requirements.txt             # Python dependencies
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Environment template
│   ├── Dockerfile                   # Container definition
│   ├── .dockerignore                # Docker ignore rules
│   ├── cloudbuild.yaml              # Cloud Build config
│   ├── deploy.sh                    # Deployment script
│   │
│   ├── manuals/                     # Equipment manual PDFs
│   │   ├── Carrier-50XC-Manual.pdf
│   │   ├── Trane-XR14-Manual.pdf
│   │   └── ...
│   │
│   └── tests/                       # Backend tests
│       ├── test_agent.py
│       ├── test_tools.py
│       └── test_vision_pipeline.py
│
├── cloud-functions/                  # Cloud Functions
│   └── send-escalation-email/
│       ├── main.py                  # Function entry point
│       ├── requirements.txt         # Dependencies
│       └── deploy.sh                # Deployment script
│
├── docs/                            # Documentation
│   ├── TESTING_GUIDE.md            # Comprehensive testing guide
│   ├── QUICK_TEST.md               # 5-minute quick test
│   ├── FIELDMIND_5DAY_ROADMAP.md   # Development roadmap
│   └── FieldMind_PRD.md            # Product requirements
│
├── test-connection.html             # Connection test page
├── test-app.sh                      # Automated test script
├── README.md                        # This file
└── LICENSE                          # MIT License
```

---

## 📊 Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI framework | 18.2.0 |
| TypeScript | Type safety | 4.9.5 |
| Tailwind CSS | Styling | 3.4.0 |
| Lucide React | Icons | 0.383.0 |
| WebSocket API | Real-time communication | Native |
| MediaRecorder API | Audio capture | Native |
| getUserMedia API | Camera access | Native |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| Python | Language | 3.11 |
| FastAPI | Web framework | 0.109.0 |
| Uvicorn | ASGI server | 0.27.0 |
| google-genai | Gemini SDK | 1.67.0 |
| google-cloud-firestore | Database | 2.14.0 |
| google-cloud-pubsub | Messaging | 2.19.0 |
| google-cloud-storage | File storage | 2.14.0 |

### AI/ML
| Service | Purpose | Model |
|---------|---------|-------|
| Gemini Live API | Conversational AI | gemini-2.5-flash |
| Gemini Vision | Equipment ID | gemini-1.5-flash |
| Text Embeddings | Vector search | text-embedding-004 |
| Vertex AI Vector Search | Semantic search | - |

### Infrastructure
| Service | Purpose |
|---------|---------|
| Cloud Run | Backend hosting |
| Firebase Hosting | Frontend CDN |
| Cloud Firestore | NoSQL database |
| Cloud Storage | File storage |
| Cloud Pub/Sub | Event messaging |
| Cloud Functions | Serverless compute |
| Cloud Build | CI/CD |
| Artifact Registry | Container registry |

---

## 🧪 Testing Guide

### Quick Test (5 Minutes)

**1. Test Backend Health**
```bash
curl https://fieldmind-backend-809015144044.us-central1.run.app/health
# Expected: {"status":"healthy","active_sessions":N}
```

**2. Open Live App**
```
https://feisty-parity-416714.web.app
```

**3. Verify Connection**
- Status bar shows "🟢 LIVE"
- WiFi icon (bottom right) is green

**4. Test Voice**
- Tap microphone button
- Say: "Hello, can you help me?"
- Verify transcript appears

**5. Test Camera**
- Point at any object
- Equipment badge should appear

**6. Test Escalation**
- Say: "I need to escalate this case"
- Verify modal appears

### Comprehensive Testing

For detailed testing instructions, see:
- **Full Guide:** [TESTING_GUIDE.md](docs/TESTING_GUIDE.md)
- **Quick Test:** [QUICK_TEST.md](docs/QUICK_TEST.md)

### Automated Testing

```bash
# Run automated test script
cd FieldMind
./test-app.sh

# Or manually test backend
curl https://fieldmind-backend-809015144044.us-central1.run.app/health

# Test WebSocket (requires wscat)
npm install -g wscat
wscat -c wss://fieldmind-backend-809015144044.us-central1.run.app/ws/test-session
```

### Test Scenarios

**Scenario 1: Equipment Identification**
```
1. Open app on phone
2. Point camera at HVAC equipment (or Google "HVAC nameplate")
3. Wait 2-3 seconds
4. ✅ Equipment badge appears with make/model
```

**Scenario 2: Voice Conversation**
```
1. Tap microphone button
2. Say: "What does error code E7 mean?"
3. Release button
4. ✅ Your text appears (blue)
5. ✅ AI responds with citation (gold)
```

**Scenario 3: Manual Search with Citations**
```
1. Ask: "How do I check refrigerant levels?"
2. ✅ Response includes: [Manual: Carrier 50XC, Section X, Page Y]
```

**Scenario 4: Case Escalation**
```
1. Say: "I need to escalate this case"
2. ✅ Orange modal appears
3. ✅ Case ID displayed
4. ✅ Check Firestore: https://console.firebase.google.com/project/feisty-parity-416714/firestore
5. ✅ Case record exists in /cases collection
```

### Verify in GCP Console

**Firestore Data:**
```
https://console.firebase.google.com/project/feisty-parity-416714/firestore
```
Check collections:
- `/equipment` - Equipment records
- `/service_records` - Service history
- `/cases` - Escalation cases

**Cloud Run Logs:**
```
https://console.cloud.google.com/run/detail/us-central1/fieldmind-backend/logs
```

**Pub/Sub Messages:**
```
https://console.cloud.google.com/cloudpubsub/topic/detail/field-escalations
```

---

## 🚀 Deployment

### Prerequisites for Deployment

1. **GCP Account** with billing enabled
2. **Firebase Project** created
3. **APIs Enabled:**
   ```bash
   gcloud services enable \
     run.googleapis.com \
     artifactregistry.googleapis.com \
     cloudbuild.googleapis.com \
     firestore.googleapis.com \
     pubsub.googleapis.com \
     cloudfunctions.googleapis.com \
     aiplatform.googleapis.com
   ```

### Deploy Backend to Cloud Run

```bash
cd backend

# Set your GCP project
gcloud config set project feisty-parity-416714

# Create Artifact Registry repository (one-time)
gcloud artifacts repositories create fieldmind \
  --repository-format=docker \
  --location=us-central1 \
  --description="FieldMind backend images"

# Build and deploy
./deploy.sh

# Or manually:
gcloud builds submit \
  --tag us-central1-docker.pkg.dev/feisty-parity-416714/fieldmind/backend:latest

gcloud run deploy fieldmind-backend \
  --image us-central1-docker.pkg.dev/feisty-parity-416714/fieldmind/backend:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --min-instances 1 \
  --memory 1Gi \
  --port 8080 \
  --timeout 300 \
  --set-env-vars="GCP_PROJECT_ID=feisty-parity-416714,GEMINI_API_KEY=YOUR_KEY"
```

**Get your Cloud Run URL:**
```bash
gcloud run services describe fieldmind-backend \
  --region us-central1 \
  --format 'value(status.url)'
```

### Deploy Frontend to Firebase Hosting

```bash
cd fieldmind-pwa

# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Update .env.local with your Cloud Run URL
echo "REACT_APP_BACKEND_URL=wss://YOUR-BACKEND-URL.run.app/ws" > .env.local

# Build and deploy
npm run build
firebase deploy --only hosting

# Or use the deploy script:
./deploy.sh wss://YOUR-BACKEND-URL.run.app/ws
```

### Deploy Cloud Function

```bash
cd cloud-functions/send-escalation-email

# Deploy
gcloud functions deploy send-escalation-email \
  --gen2 \
  --runtime python311 \
  --region us-central1 \
  --source . \
  --entry-point send_escalation_email \
  --trigger-topic field-escalations \
  --set-env-vars="SENDGRID_API_KEY=YOUR_KEY,DISPATCH_EMAIL=your@email.com"
```

### Verify Deployment

```bash
# Test backend
curl https://YOUR-BACKEND-URL.run.app/health

# Test frontend
open https://YOUR-PROJECT-ID.web.app

# Check Cloud Run logs
gcloud run services logs read fieldmind-backend --region us-central1

# Check Function logs
gcloud functions logs read send-escalation-email --region us-central1
```

---

## 🔐 Environment Variables

### Backend (.env)
```bash
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional (for full features)
GCP_PROJECT_ID=your-gcp-project-id
GCP_REGION=us-central1
PUBSUB_TOPIC=field-escalations
SENDGRID_API_KEY=your_sendgrid_key
DISPATCH_EMAIL=dispatch@example.com
```

### Frontend (.env.local)
```bash
# Required
REACT_APP_BACKEND_URL=wss://your-backend-url.run.app/ws

# For local development
# REACT_APP_BACKEND_URL=ws://localhost:8000/ws
```

---

## 📝 API Documentation

### WebSocket API

**Endpoint:** `wss://fieldmind-backend-809015144044.us-central1.run.app/ws/{session_id}`

**Message Types:**

**Client → Server:**
```json
{
  "type": "audio_chunk",
  "session_id": "uuid",
  "timestamp": 1234567890,
  "payload": "base64_encoded_pcm_audio"
}

{
  "type": "camera_frame",
  "session_id": "uuid",
  "timestamp": 1234567890,
  "payload": "base64_encoded_jpeg",
  "metadata": {"width": 640, "height": 480}
}

{
  "type": "ping",
  "session_id": "uuid",
  "timestamp": 1234567890
}
```

**Server → Client:**
```json
{
  "type": "transcript",
  "data": {
    "text": "Hello, how can I help?",
    "is_final": true,
    "speaker": "fieldmind"
  }
}

{
  "type": "equipment_identified",
  "data": {
    "make": "Carrier",
    "model": "50XC-A12",
    "confidence": 0.87
  }
}

{
  "type": "escalation_triggered",
  "data": {
    "case_id": "CASE-1234567890",
    "status": "escalated"
  }
}

{
  "type": "pong",
  "session_id": "uuid",
  "timestamp": 1234567890
}
```

### REST API

**Health Check:**
```bash
GET /health
Response: {"status": "healthy", "active_sessions": 0}
```

**Root:**
```bash
GET /
Response: {"status": "ok", "service": "FieldMind Backend"}
```

---

## 🤝 Contributing

This project was built for the Gemini Live Agent Challenge 2026. Contributions, issues, and feature requests are welcome!

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 👥 Team

Built by Arjun Pratap Das for the Gemini Live Agent Challenge 2026

---

## 🔗 Links

- **Live Demo:** https://feisty-parity-416714.web.app
- **Backend API:** https://fieldmind-backend-809015144044.us-central1.run.app
- **GitHub:** https://github.com/arjunpratapdas/FieldMind
- **Firestore Console:** https://console.firebase.google.com/project/feisty-parity-416714/firestore
- **Cloud Run Console:** https://console.cloud.google.com/run/detail/us-central1/fieldmind-backend

---

## 🆘 Troubleshooting

### Common Issues

**Issue: Status shows "OFFLINE"**
```bash
# Check backend health
curl https://fieldmind-backend-809015144044.us-central1.run.app/health

# If fails, backend might be down
# Check Cloud Run logs in GCP Console
```

**Issue: Camera not working**
- Allow camera permissions in browser
- Refresh page
- Try different browser (Chrome recommended)

**Issue: Microphone not recording**
- Allow microphone permissions
- Check browser settings
- Verify audio level indicator shows bars when speaking

**Issue: No AI response**
- Check status bar shows "LIVE"
- Verify backend is running
- Check browser console (F12) for errors

**Issue: Equipment badge shows 0% confidence**
- This is normal if not pointing at HVAC equipment
- Try pointing at actual equipment or Google "HVAC nameplate"

### Get Help

- Check [TESTING_GUIDE.md](docs/TESTING_GUIDE.md) for detailed troubleshooting
- Open an issue on GitHub
- Check Cloud Run logs for backend errors

---

**⚡ FieldMind — Expert AI in your ear, seeing what you see.**

*Transforming field service with multimodal AI*

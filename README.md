# ⚡ FieldMind — AI Field Technician Assistant

> Real-time voice + vision AI co-pilot for field service technicians powered by Google Gemini Live API

**Hackathon:** Gemini Live Agent Challenge 2026  
**Deadline:** March 16, 2026 @ 5:00 PM PT  
**Status:** 🚧 In Development

---

## 🎯 Overview

FieldMind is an AI-powered assistant that helps field service technicians diagnose equipment issues in real-time using:
- **Voice conversation** with barge-in capability (Gemini Live API)
- **Live camera vision** for equipment identification (Gemini Flash 2.0)
- **RAG over equipment manuals** for grounded answers (Vertex AI Vector Search)
- **Service history lookup** from Firestore
- **Intelligent case escalation** via Pub/Sub + Cloud Functions

---

## 🏗️ Architecture

### Frontend (PWA)
- **React 18** + TypeScript
- **Tailwind CSS** for styling
- **WebSocket** for real-time streaming
- **Firebase Hosting** for deployment

### Backend (Cloud Run)
- **FastAPI** + Python 3.11
- **ADK** for Gemini Live API integration
- **WebSocket** endpoint for bidirectional streaming
- **4 ADK Tools**: analyze_equipment, search_manuals, get_service_history, escalate_case

### GCP Services Used
1. **Cloud Run** — Backend orchestration
2. **Vertex AI** — Gemini Live 2.5 Flash + Gemini Flash 2.0 + text-embedding-004
3. **Vertex AI Vector Search** — Manual RAG
4. **Cloud Firestore** — Equipment & service data
5. **Cloud Storage** — Manual PDFs
6. **Cloud Pub/Sub** — Escalation events
7. **Cloud Functions** — Email notifications
8. **Firebase Hosting** — PWA deployment

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
fieldmind/
├── fieldmind-pwa/          # React PWA frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript types
│   │   └── FieldMindApp.tsx
│   └── public/
├── backend/                # FastAPI backend
│   ├── main.py            # WebSocket server
│   ├── agent.py           # ADK agent
│   ├── tools.py           # 4 ADK tools
│   ├── firestore_client.py
│   ├── vector_search_client.py
│   ├── requirements.txt
│   └── Dockerfile
└── README.md
```

---

## 🎮 How to Run

### Development Mode
```bash
# Terminal 1: Start backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2: Start frontend
cd fieldmind-pwa
npm start
```

### With Mock Backend
```bash
# Terminal 1: Start mock server
cd fieldmind-pwa
npm run mock-server

# Terminal 2: Start frontend
npm start
```

---

## 🔧 GCP Services Configuration

### Required APIs
- Cloud Run API
- Vertex AI API
- Firestore API
- Cloud Storage API
- Cloud Pub/Sub API
- Cloud Functions API
- Secret Manager API

### Service Account Roles
- Vertex AI User
- Cloud Filestore Editor (beta)
- Storage Admin
- Pub/Sub Editor
- Cloud Functions Developer
- Secret Manager Secret Accessor

---

## 🎯 Features

### Core Features
1. **Real-Time Voice Conversation** — Natural voice interface with barge-in
2. **Live Camera Vision** — Equipment identification from camera feed
3. **RAG over Manuals** — Grounded answers with manual citations
4. **Service History** — Context-aware diagnosis based on past repairs
5. **Case Escalation** — Automatic dispatch notification

### Demo Scenarios
1. **The Diagnosis** — Equipment ID + manual search + grounded response
2. **Barge-In** — Interrupt mid-sentence, AI adapts instantly
3. **Visual Reading** — Read faded wiring diagrams
4. **Escalation** — Multi-service integration in one action

---

## 📊 Tech Stack

| Category | Technology |
|----------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.11, ADK |
| AI Models | Gemini Live 2.5 Flash, Gemini Flash 2.0, text-embedding-004 |
| Database | Cloud Firestore |
| Storage | Cloud Storage |
| Messaging | Cloud Pub/Sub |
| Hosting | Firebase Hosting, Cloud Run |
| CI/CD | Cloud Build |

---

## 🧪 Testing

### Frontend Testing
```bash
cd fieldmind-pwa
npm test
```

### Backend Testing
```bash
cd backend
pytest
```

### Integration Testing
```bash
# Start both frontend and backend
# Open http://localhost:3000
# Test WebSocket connection, camera, microphone
```

---

## 🚀 Deployment

### Deploy Backend to Cloud Run
```bash
cd backend
gcloud builds submit --config cloudbuild.yaml
```

### Deploy Frontend to Firebase Hosting
```bash
cd fieldmind-pwa
npm run build
firebase deploy
```

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👥 Team

Built for the Gemini Live Agent Challenge 2026

---

## 🔗 Links

- **Demo Video:** [Coming Soon]
- **Devpost:** [Coming Soon]
- **Blog Post:** [Coming Soon]

---

**⚡ FieldMind — Expert AI in your ear, seeing what you see.**

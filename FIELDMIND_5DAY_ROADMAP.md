# ⚡ FIELDMIND — 5-DAY BUILD ROADMAP
**Deadline: March 16, 2026 @ 5:00 PM PT**

---

## DAY 1 (March 11) — FOUNDATION & SETUP

### Morning (9:00 AM – 12:00 PM)

#### Person A — Backend Infrastructure
1. Create GCP project (if not exists)
2. Enable APIs: Cloud Run, Vertex AI, Firestore, Cloud Storage, Pub/Sub, Cloud Functions, Secret Manager
3. Create service account `fieldmind-runner` with roles: Vertex AI User, Firestore Editor, Storage Admin, Pub/Sub Editor, Cloud Functions Developer
4. Download service account JSON key → store in Secret Manager
5. Create Cloud Storage bucket: `fieldmind-manuals` (for PDFs)
6. Create Firestore database (native mode, US region)
7. Create Pub/Sub topic: `field-escalations`
8. Set up billing alert at $70 in GCP Console
9. Create GitHub repo (public): `fieldmind-hackathon`
10. Clone repo locally, create `backend/` folder structure

#### Person B — Frontend Setup
1. Verify React PWA is running locally (npm start)
2. Create GitHub repo (if separate) or use shared repo
3. Verify `.env.local` has `REACT_APP_BACKEND_URL=ws://localhost:8000/ws`
4. Test camera + microphone permissions on mobile device
5. Create Firebase project (if not exists)
6. Set up Firebase Hosting configuration
7. Create `public/manifest.json` with PWA metadata
8. Verify Tailwind CSS is working (colors rendering correctly)

### Afternoon (1:00 PM – 5:00 PM)

#### Person A — Backend Core
1. Create FastAPI project structure:
   ```
   backend/
   ├── main.py
   ├── requirements.txt
   ├── agent.py
   ├── tools.py
   ├── firestore_client.py
   ├── vector_search_client.py
   ├── Dockerfile
   └── .env
   ```
2. Install dependencies: `fastapi`, `uvicorn`, `google-cloud-aiplatform`, `google-cloud-firestore`, `google-cloud-storage`, `google-cloud-pubsub`, `python-dotenv`, `aiofiles`
3. Create `/ws/{session_id}` WebSocket endpoint in FastAPI
4. Implement WebSocket message parsing (audio, frame, ping)
5. Create session manager class to track active sessions
6. Test WebSocket connection from frontend (should see "Connecting..." status)

#### Person B — Frontend Refinement
1. Clean up unused imports (already done)
2. Add `.env.local` to `.gitignore`
3. Create `public/index.html` with proper PWA meta tags
4. Test responsive layout on mobile viewport (375px width)
5. Verify all UI components render without errors
6. Create GitHub README skeleton with sections: Setup, Architecture, GCP Services, How to Run

### End of Day 1 Checklist
- [ ] GCP project fully configured with all APIs enabled
- [ ] Billing alert set at $70
- [ ] GitHub repo created (public)
- [ ] FastAPI WebSocket endpoint responds to connections
- [ ] Frontend connects to backend (shows "Connecting..." then "Ready")
- [ ] Camera + microphone permissions working on test device
- [ ] No console errors in browser or backend logs

---

## DAY 2 (March 12) — CORE AI & VISION PIPELINE

### Morning (9:00 AM – 12:00 PM)

#### Person A — ADK Agent Setup
1. Install ADK: `pip install google-cloud-generativeai`
2. Create `agent.py` with ADK LlmAgent initialization:
   - Model: `gemini-live-2.5-flash-native-audio`
   - System prompt (see PRD Section 7.1 — must enforce citation rule)
   - Register 4 tools: `analyze_equipment`, `search_manuals`, `get_service_history`, `escalate_case`
3. Implement tool stubs (return mock data for now)
4. Test ADK session creation and tool registration
5. Create audio stream handler: receives base64 PCM → decodes → sends to Gemini Live API
6. Implement VAD detection (Gemini Live handles this natively)

#### Person B — Audio Pipeline (Frontend)
1. Verify `useAudioStream` hook captures 16kHz PCM Int16
2. Test audio chunk encoding to base64
3. Implement WebSocket audio chunk sending (every 100ms)
4. Add audio level visualization to VoiceButton (waveform bars)
5. Test on actual mobile device with microphone permission
6. Verify audio is being received by backend (check logs)

### Afternoon (1:00 PM – 5:00 PM)

#### Person A — Vision Pipeline
1. Implement `analyze_equipment()` tool:
   - Receives base64 JPEG frame
   - Calls Gemini Flash 2.0 Vision API
   - Returns structured JSON: `{make, model, serial, confidence, visible_fault_codes}`
2. Create async task for vision processing (non-blocking audio pipeline)
3. Implement frame buffering: keep latest frame, process async
4. Test with sample HVAC equipment image
5. Create Firestore client: `firestore_client.py`
6. Seed Firestore with test data:
   - 3 equipment records in `/equipment` collection
   - 5 service records in `/service_records` collection
   - 10 fault codes in `/fault_codes` collection

#### Person B — Camera & Transcript
1. Verify `useCameraCapture` hook sends 1 frame/sec
2. Implement equipment badge display (appears when equipment identified)
3. Implement TranscriptOverlay: display last 3 exchanges
4. Add speaker labels: "⚡ FieldMind" (gold) vs "👷 Technician" (blue)
5. Test transcript rendering with mock data
6. Verify equipment badge slides in smoothly

### End of Day 2 Checklist
- [ ] ADK agent initializes without errors
- [ ] Audio stream flows from frontend → backend → Gemini Live API
- [ ] Vision pipeline processes frames async (non-blocking)
- [ ] `analyze_equipment()` returns valid JSON for test image
- [ ] Firestore seeded with test data (3 equipment, 5 service records, 10 fault codes)
- [ ] Equipment badge appears in UI when equipment identified
- [ ] Transcript overlay displays messages correctly
- [ ] No latency issues (audio should not stutter)

---

## DAY 3 (March 13) — RAG & KNOWLEDGE INTEGRATION

### Morning (9:00 AM – 12:00 PM)

#### Person A — Manual Ingestion & Vector Search
1. Download 3–5 HVAC equipment manuals (Trane, Carrier, Lennox — publicly available PDFs)
2. Upload PDFs to Cloud Storage bucket: `fieldmind-manuals`
3. Create manual chunking script:
   - Split PDFs into 400-token chunks
   - Extract section titles
   - Save chunks to Firestore `/manual_chunks` collection
4. Create embedding pipeline:
   - Use `text-embedding-004` to embed all chunks
   - Generate 768-dimensional vectors
   - Create JSONL file with chunk_id + embedding
5. Create Vertex AI Vector Search index:
   - Upload JSONL to Cloud Storage
   - Create index in Vertex AI Vector Search console
   - **Start this by 1:00 PM — index build takes 1–2 hours**
6. Implement `search_manuals()` tool:
   - Embed query with `text-embedding-004`
   - Query Vector Search for top-3 neighbors
   - Return chunks with source citations
7. Test `search_manuals("E7 fault code Trane XR14")` — should return relevant sections

#### Person B — GDG Membership & Blog Setup
1. Join GDG at gdg.community.dev (takes 10 min)
2. Copy public profile URL
3. Create Medium or dev.to account
4. Draft blog post outline (do not publish yet):
   - Problem statement (field service crisis)
   - Solution (FieldMind architecture)
   - 6 GCP services explained
   - 4 ADK tools explained
   - Barge-in innovation
   - Learnings & challenges
5. Create Twitter/LinkedIn accounts if needed

### Afternoon (1:00 PM – 5:00 PM)

#### Person A — Escalation Pipeline
1. Implement `escalate_case()` tool:
   - Write case record to Firestore `/cases` collection
   - Publish JSON message to Pub/Sub `field-escalations` topic
   - Return confirmation message
2. Create Cloud Function (Gen2):
   - Triggered by Pub/Sub `field-escalations` topic
   - Receives case JSON
   - Sends email via SendGrid API
   - Logs success/failure
3. Set up SendGrid:
   - Create free account
   - Generate API key
   - Store in Cloud Run environment variable: `SENDGRID_API_KEY`
   - Configure sender email
4. Test escalation end-to-end:
   - Call `escalate_case()` from agent
   - Verify Firestore record created
   - Verify Pub/Sub message visible in console
   - Verify email received (check spam folder)

#### Person B — Escalation UI
1. Implement EscalationAlert modal component
2. Add event listener for escalation messages from backend
3. Show case ID, severity badge, "Dispatch notified" message
4. Auto-dismiss after 5 seconds
5. Test modal appearance and animations
6. Verify modal does not block main UI

### End of Day 3 Checklist
- [ ] Vector Search index created and queryable (check status in console)
- [ ] `search_manuals()` returns cited sections with source PDFs
- [ ] Firestore `/manual_chunks` collection populated
- [ ] `escalate_case()` creates Firestore record
- [ ] Pub/Sub message visible in console after escalation
- [ ] Cloud Function sends email successfully
- [ ] SendGrid API key stored securely in Cloud Run env vars
- [ ] GDG membership confirmed
- [ ] Blog post outline drafted

---

## DAY 4 (March 14) — DEPLOYMENT & DEMO PREP

### Morning (9:00 AM – 12:00 PM)

#### Person A — Cloud Run Deployment
1. Create `Dockerfile` for FastAPI backend:
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
   ```
2. Create `cloudbuild.yaml`:
   - Build Docker image
   - Push to Artifact Registry
   - Deploy to Cloud Run
   - Set `min-instances=1`
   - Set environment variables (SENDGRID_API_KEY, etc.)
3. Create `deploy.sh` script:
   ```bash
   #!/bin/bash
   gcloud builds submit --config cloudbuild.yaml
   ```
4. Deploy backend to Cloud Run:
   - Run `./deploy.sh`
   - Verify deployment succeeds
   - Get Cloud Run URL: `https://fieldmind-xxxxx.run.app`
5. Set `min-instances=1` in Cloud Run console (CRITICAL for demo)
6. Test WebSocket connection to Cloud Run URL from frontend

#### Person B — Firebase Hosting Deployment
1. Create `firebase.json` configuration
2. Build React app: `npm run build`
3. Deploy to Firebase Hosting: `firebase deploy`
4. Get Firebase Hosting URL: `https://fieldmind-xxxxx.web.app`
5. Update frontend `.env` to use Cloud Run URL: `REACT_APP_BACKEND_URL=wss://fieldmind-xxxxx.run.app/ws`
6. Rebuild and redeploy frontend
7. Test full end-to-end: open Firebase Hosting URL on mobile → should connect to backend

### Afternoon (1:00 PM – 5:00 PM)

#### Person A — Demo Scenario Testing
1. Test Scenario 1 (Diagnosis):
   - Point camera at demo equipment
   - Say "What's wrong with this unit?"
   - Verify equipment identified
   - Verify service history retrieved
   - Verify manual citation in response
   - **Run 3 times, must succeed 3/3**
2. Test Scenario 2 (Barge-in):
   - FieldMind starts speaking diagnosis
   - Interrupt mid-sentence with "Wait — I see..."
   - Verify FieldMind stops immediately
   - Verify response adapts to new information
   - **Run 5 times, must succeed 5/5**
3. Test Scenario 3 (Wiring Diagram):
   - Point camera at faded wiring diagram
   - Ask "Can you read this?"
   - Verify FieldMind reads and explains circuit
   - **Run 2 times, must succeed 2/2**
4. Test Scenario 4 (Escalation):
   - Trigger escalation condition
   - Verify FieldMind says "escalating"
   - Verify Firestore case record created within 3 seconds
   - Verify Pub/Sub message in console
   - Verify email received
   - **Run 2 times, must succeed 2/2**

#### Person B — Demo Script & Recording Setup
1. Write final demo script (4 minutes):
   - 0:00–0:15: Problem statement (field service crisis stats)
   - 0:15–1:00: Scenario 1 (Diagnosis)
   - 1:00–1:30: Scenario 2 (Barge-in)
   - 1:30–2:00: Scenario 3 (Wiring Diagram)
   - 2:00–2:30: Scenario 4 (Escalation)
   - 2:30–4:00: GCP console proof (Cloud Run logs, Firestore, Pub/Sub, Cloud Functions)
2. Set up recording environment:
   - Quiet room, good lighting
   - Mobile device on tripod
   - GCP Console on second monitor (visible in recording)
   - Test audio levels
3. Create YouTube unlisted video channel
4. Prepare Devpost submission form (do not submit yet)

### End of Day 4 Checklist
- [ ] Backend deployed to Cloud Run with `min-instances=1`
- [ ] Frontend deployed to Firebase Hosting
- [ ] Full end-to-end connection works (mobile → Firebase → Cloud Run → Gemini Live)
- [ ] All 4 demo scenarios tested and working
- [ ] Barge-in tested 5 times, succeeds 5/5
- [ ] Escalation tested 2 times, succeeds 2/2
- [ ] GCP Console shows all services active
- [ ] Demo script finalized
- [ ] Recording environment set up
- [ ] `deploy.sh` and `cloudbuild.yaml` in repo
- [ ] GitHub README updated with setup instructions

---

## DAY 5 (March 15) — FINAL DEMO & SUBMISSION

### Morning (9:00 AM – 12:00 PM)

#### Person A — Final Backend Checks
1. Verify Cloud Run `min-instances=1` is set (check console)
2. Verify all environment variables are set correctly
3. Run health check: `curl https://fieldmind-xxxxx.run.app/health`
4. Check GCP billing: should be under $70
5. Verify Firestore, Vector Search, Pub/Sub, Cloud Functions all active
6. Create architecture diagram (draw.io):
   - Show all 6 GCP services
   - Show data flow arrows
   - Export as PNG
7. Prepare GCP Console screenshots for demo proof

#### Person B — Final Frontend Checks
1. Verify Firebase Hosting deployment is live
2. Test on 2 different mobile devices (iOS + Android if possible)
3. Verify camera + microphone permissions work
4. Verify all UI components render correctly
5. Test WebSocket reconnection (disconnect WiFi, reconnect)
6. Verify no console errors
7. Prepare demo device (fully charged, WiFi connected)

### Afternoon (1:00 PM – 3:00 PM) — DEMO RECORDING

#### Both — Record 4-Minute Demo Video
1. **Take 1:** Full demo run (all 4 scenarios + GCP proof)
   - If successful: proceed to Take 2 for backup
   - If failed: identify issue, fix, retry
2. **Take 2:** Full demo run (backup)
3. **Take 3:** Full demo run (backup)
4. Select best take (usually Take 1 or 2)
5. Upload to YouTube (unlisted) 
6. Get YouTube URL

### Afternoon (3:00 PM – 4:30 PM) — DEVPOST SUBMISSION

#### Person B — Complete Devpost Form
1. **Project Title:** FieldMind — AI Field Technician Assistant
2. **Category:** Live Agents
3. **Description (600+ words):**
   - Problem: field service crisis (cite stats from PRD)
   - Solution: FieldMind architecture
   - 6 GCP services: Cloud Run, Gemini Live, Vertex AI, Firestore, Pub/Sub, Cloud Functions
   - 4 ADK tools: analyze_equipment, search_manuals, get_service_history, escalate_case
   - Barge-in innovation
   - RAG grounding
   - Demo proof
4. **Video URL:** YouTube link
5. **GitHub URL:** Public repo link
6. **Architecture Diagram:** Upload PNG
7. **GCP Services List:** Explicitly list all 6
8. **Bonus Points:**
   - Blog post URL (+0.6)
   - GDG membership profile URL (+0.2)
   - `deploy.sh` + `cloudbuild.yaml` in repo (+0.2)

#### Person B — Publish Blog Post
1. Finalize blog post (600+ words)
2. Include required statement: *"I created this content for the purposes of entering the Gemini Live Agent Challenge."*
3. Publish on Medium or dev.to
4. Share on LinkedIn + Twitter with #GeminiLiveAgentChallenge
5. Copy blog URL to Devpost form

#### Person B — Final Devpost Review
1. Review all fields for completeness
2. Verify video plays correctly
3. Verify GitHub link is public
4. Verify all bonus points are documented
5. **SUBMIT by 3:00 PM PT** (safety buffer before 5:00 PM deadline)

### End of Day 5 Checklist
- [ ] Demo video recorded (4 minutes, all scenarios + GCP proof)
- [ ] Demo video uploaded to YouTube
- [ ] Devpost form completed with all required fields
- [ ] Blog post published with required statement
- [ ] Blog post shared on social media
- [ ] GDG membership profile URL added to Devpost
- [ ] `deploy.sh` and `cloudbuild.yaml` verified in GitHub
- [ ] Architecture diagram uploaded to Devpost
- [ ] Devpost submitted by 3:00 PM PT
- [ ] Confirmation email received from Devpost

---

## CRITICAL SUCCESS FACTORS

### Must-Have by End of Day 5
1. ✅ Gemini Live API voice conversation working (barge-in demonstrated)
2. ✅ Camera vision pipeline identifying equipment
3. ✅ Manual citations in responses (RAG working)
4. ✅ Escalation creating Firestore record + Pub/Sub message
5. ✅ 4-minute demo video recorded and uploaded
6. ✅ Devpost submission completed
7. ✅ Cloud Run `min-instances=1` set (no cold starts)
8. ✅ All 3 modalities (voice, vision, speech) active simultaneously

### If Something Fails
- **Vector Search not ready:** Use Firestore keyword fallback for fault codes. Demo still works.
- **Barge-in unreliable:** Slow down FieldMind speech pace. Wider barge-in window.
- **Escalation fails:** Hardcode escalation confirmation in system prompt. Firestore write still happens.
- **Cloud Run cold start:** Ensure `min-instances=1` is set. Test 1 hour before recording.
- **Mobile camera fails:** Use pre-recorded test images cycled via setInterval. Label as "camera simulation."

### Minimum Viable Demo (Safety Net)
If RAG, escalation, or Vector Search fails — the demo is still exceptional with:
1. Gemini Live voice conversation (barge-in working)
2. Camera equipment identification
3. Hardcoded knowledge for 2–3 equipment types

This alone scores in top 5% of submissions.

---

## DAILY STANDUP TEMPLATE

**Each morning at 9:00 AM:**
- Person A: What did you complete yesterday? What are you doing today? Any blockers?
- Person B: Same.
- **Blocker resolution:** If either person is blocked, solve it immediately.

**Each evening at 5:00 PM:**
- Review checklist for the day
- Update GitHub README with progress
- Check GCP billing
- Commit code to GitHub

---

## GITHUB COMMIT SCHEDULE

| Day | Commits | What |
|---|---|---|
| Day 1 | 3–4 | Backend setup, FastAPI skeleton, frontend verification |
| Day 2 | 4–5 | ADK agent, audio pipeline, vision pipeline, Firestore seeding |
| Day 3 | 3–4 | Manual ingestion, Vector Search, escalation pipeline |
| Day 4 | 3–4 | Cloud Run deployment, Firebase deployment, demo testing |
| Day 5 | 2–3 | Final fixes, demo recording, Devpost submission |

**Commit message format:**
```
[Day N] Feature: Brief description

- Detailed change 1
- Detailed change 2
```

---

## BUDGET TRACKING

| Service | Est. Cost | Actual | Notes |
|---|---|---|---|
| Vertex AI (Gemini Live API) | $30 | | 1M input tokens @ $0.075/1M |
| Vertex AI (Gemini Flash Vision) | $15 | | 1M input tokens @ $0.075/1M |
| Vertex AI (Embeddings) | $5 | | 100K tokens @ $0.02/1M |
| Vector Search | $10 | | Index creation + queries |
| Cloud Run | $15 | | 5 days × 24h × $0.00002/vCPU-sec |
| Firestore | $5 | | Free tier mostly, small overage |
| Cloud Storage | $2 | | Manual PDFs + embeddings |
| Cloud Functions | $2 | | Escalation emails |
| SendGrid | $0 | | Free tier (100 emails/day) |
| **TOTAL** | **$84** | | **Set alert at $70** |

---

**⚡ Build it. Ship it. Win it.**
**Deadline: March 16, 2026 @ 5:00 PM PT**

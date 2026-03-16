# ⚡ FieldMind — AI Field Technician Assistant (Frontend)

React PWA for the FieldMind hackathon submission. Voice + vision diagnostics powered by Gemini Live API.

## GCP Services Used
- **Gemini Live API** — real-time voice conversation with barge-in
- **Gemini Flash Vision** — camera frame equipment identification  
- **Vertex AI Vector Search** — RAG over HVAC manuals
- **Cloud Run** — backend deployment
- **Firestore** — equipment + service history database
- **Pub/Sub** — escalation event pipeline
- **Firebase Hosting** — PWA deployment
- **Cloud Storage** — manual PDFs + embeddings

## Day 1 Setup

```bash
cd fieldmind-pwa
npm install
cp .env.example .env.local
# Edit .env.local — set REACT_APP_BACKEND_URL to Person A's ngrok URL
npm start
```

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `REACT_APP_BACKEND_URL` | Backend WebSocket URL | `wss://xxxx.ngrok.io/ws` |

## Architecture

```
Browser PWA
├── useWebSocket       → persistent WS connection with auto-reconnect
├── useAudioStream     → mic → PCM Int16 @ 16kHz → base64 chunks
├── useCameraCapture   → rear camera → 1fps JPEG → base64
│
├── StatusBar          → connection + agent state indicator
├── CameraFeed         → live video with scan overlay + equipment ID
├── VoiceButton        → hold-to-talk with waveform visualization
├── TranscriptOverlay  → last 4 exchanges, color-coded by speaker
└── EscalationAlert    → modal for escalation events
```

## WebSocket Message Format

**Outbound (PWA → Backend):**
```json
{
  "type": "audio_chunk | camera_frame | session_start | ping",
  "session_id": "uuid-v4",
  "timestamp": 1234567890,
  "payload": "<base64>",
  "metadata": {}
}
```

**Inbound (Backend → PWA):**
```json
{
  "type": "transcript | agent_response | equipment_identified | escalation_triggered | status_update",
  "session_id": "uuid-v4",
  "timestamp": 1234567890,
  "data": {}
}
```

## Deploy to Firebase

```bash
chmod +x deploy.sh
REACT_APP_BACKEND_URL=wss://your-cloud-run-url.run.app/ws ./deploy.sh
```

## Sprint Timeline

- **Day 1 (Mar 11):** Scaffold + hooks + audio round-trip
- **Day 2 (Mar 12):** Camera vision + full UI + Scenario 1
- **Day 3 (Mar 13):** Firebase deploy + escalation UI + demo scenarios
- **Day 4 (Mar 14):** Bug crush + 4× rehearsals + feature freeze
- **Day 5 (Mar 15):** Record demo video + submit to Devpost

**Deadline: March 16, 2026 @ 5:00 PM PT**

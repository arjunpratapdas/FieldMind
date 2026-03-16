# ⚡ FIELDMIND — PRODUCT REQUIREMENTS DOCUMENT

> **Real-Time Voice + Vision AI Co-Pilot for Field Service Technicians**

| Version | Date | Type | Status |
|---|---|---|---|
| 1.0 | March 11, 2026 | Hackathon Build | CONFIDENTIAL |

**Competition:** Gemini Live Agent Challenge 2026 · Google Cloud Next, Las Vegas · April 22–24
**Deadline:** March 16, 2026 @ 5:00 PM Pacific Time
**Prize Target:** $40,000+ (Grand Prize $25K + Best Live Agent $10K + Best Multimodal UX $5K)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Product Vision & Goals](#3-product-vision--goals)
4. [Users & Personas](#4-users--personas)
5. [System Architecture Overview](#5-system-architecture-overview)
6. [Feature Specifications](#6-feature-specifications)
7. [Functional Requirements](#7-functional-requirements)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [API & Integration Specifications](#9-api--integration-specifications)
10. [Data Models & Database Schema](#10-data-models--database-schema)
11. [UI/UX Specifications](#11-uiux-specifications)
12. [Demo Scenarios](#12-demo-scenarios)
13. [Tech Stack & Infrastructure](#13-tech-stack--infrastructure)
14. [Security & Compliance](#14-security--compliance)
15. [Testing & Quality Assurance](#15-testing--quality-assurance)
16. [Submission Requirements](#16-submission-requirements)
17. [Risk Register](#17-risk-register)
18. [Success Metrics](#18-success-metrics)

---

## 1. Executive Summary

FieldMind is a real-time, voice-and-vision AI co-pilot built for field service technicians. Powered by Google's Gemini Live API, it sees equipment through a technician's phone camera, listens to problem descriptions, searches technical manuals in real time using Retrieval-Augmented Generation (RAG), and speaks back a grounded diagnosis — step by step — just like a 30-year expert on the job.

This document is the single source of truth for building FieldMind within the 5-day hackathon window (March 11–16, 2026). It covers every feature, every API, every data model, every UI screen, every acceptance criterion, and every risk. Nothing is left ambiguous.

### What FieldMind Does

- Listens to the technician's voice in real time
- Sees equipment through the phone camera
- Identifies make, model, and serial from live video frames
- Searches real equipment manuals (RAG) for grounded answers
- Retrieves the unit's full service history from Firestore
- Speaks back a diagnosis with exact manual citations
- Handles mid-sentence interruptions naturally (barge-in)
- Escalates to dispatch via Pub/Sub + Cloud Functions

### Why FieldMind Wins

- **Zero competition** — no other participant targets field service
- **All 3 modalities structurally required**, not bolted on — you cannot remove camera, voice, or speech and still have the product
- **6+ GCP services** = full technical architecture score
- **Grounded AI** — cites real manual sections, no hallucinations
- **Barge-in in a mission-critical context**, not trivial chat
- **$23.6B addressable market** — judges understand this value
- **Cinematic demo** that stops judges cold
- Targets **Grand Prize ($25K) + Best Live Agent ($10K) + Best Multimodal UX ($5K)**

---

## 2. Problem Statement

### 2.1 The Industry Crisis

The field service industry is experiencing a compounding crisis of expertise, efficiency, and cost. This is not a niche problem — it affects every building, factory, hospital, and commercial property in the world.

| Statistic | What It Means | Source |
|---|---|---|
| **58%** | Average first-time fix rate across the industry. 42% of visits fail to fix the problem. | Aquant 2025 |
| **86%** | First-time fix rate at top-performing companies — a 28-point gap worth billions in revenue. | Aquant 2025 |
| **$1,800** | Average additional cost per failed visit: 2 extra trips + 14 additional days to resolution. | IBM FSR 2025 |
| **14%** | Truck rolls that are completely unnecessary — one in seven dispatches is a wasted trip. | Industry avg |
| **74%** | Field service employers who report difficulty finding skilled technicians — doubled in a decade. | IBM FSR 2025 |
| **25%** | US field service workforce aged 55 or older. Retirement is accelerating the knowledge gap daily. | Bureau of Labor |
| **39%** | Reduction in repair times when AI tools are deployed in the field. | Aquant 2025 |
| **21%** | Improvement in diagnostic accuracy when AI is used alongside technicians. | Aquant 2025 |
| **$23.6B** | Field Service Management market projection by 2035, growing at 16% CAGR. | Global Market Insights |

### 2.2 Root Causes

- Expert knowledge is locked in the heads of retiring senior technicians — there is no scalable way to transfer it
- Equipment manuals exist as dense PDFs that nobody reads in the field — technicians guess instead
- Dispatch teams cannot see what the technician sees — escalation decisions are made blind
- Existing tools (phone calls to senior techs, PDF lookup) are slow, unreliable, and don't work on a job site
- No product currently exists that combines real-time voice conversation with live camera vision in this context

### 2.3 The Opportunity Gap

> **The Core Insight:** The difference between a 58% first-time fix rate and an 86% first-time fix rate is knowledge — not skill. Junior technicians with access to senior-level knowledge perform at senior-technician levels. FieldMind is that knowledge, delivered in real time, hands-free, at the job site. No product on the market does this. **FieldMind is the first.**

---

## 3. Product Vision & Goals

### 3.1 Vision Statement

> *"Every field service technician deserves the knowledge of a 30-year expert. FieldMind puts that expert in their ear — seeing what they see, hearing what they say, diagnosing what they find."*

### 3.2 Hackathon Goals

| Goal | Judging Criterion | Success Metric |
|---|---|---|
| All 3 modalities seamlessly integrated: camera (see), microphone (hear), speaker (speak) | Innovation & Multimodal UX (40%) | All 3 modalities active simultaneously. You cannot remove any one and still have FieldMind. |
| 6+ GCP services working together in a single user action | Technical Architecture (30%) | Architecture diagram shows Cloud Run, Gemini Live, Vertex AI, Firestore, Pub/Sub, Cloud Functions — all visible in GCP console during demo. |
| Emotional, cinematic 4-minute demo with live proof | Demo & Presentation (30%) | Demo video shows real equipment, real voice response, real barge-in. No mockups. GCP console logs visible. |
| Complete all bonus points for score ceiling separation | Bonus Points (+1.0 max) | Blog post (+0.6), deploy.sh (+0.2), GDG membership (+0.2). All three completed. |

### 3.3 Prize Targets

| Grand Prize | Best Live Agent | Best Multimodal UX | Total Potential |
|---|---|---|---|
| **$25,000** | **$10,000** | **$5,000** | **$40,000+** |

---

## 4. Users & Personas

FieldMind has two user types: the primary user (the technician in the field) and the secondary user (the dispatch supervisor). The hackathon demo focuses entirely on the primary user experience.

### Primary User — The Field Technician ("Mike")

**Profile**
- 28 years old, HVAC technician with 3 years experience
- Works for a mid-size commercial HVAC contractor
- Handles 6–8 service calls per day across multiple building types

**Pain Points**
- Encounters equipment he has never seen before — must call a senior tech
- Cannot read faded or technical wiring diagrams in the field
- Senior techs are unavailable 40% of the time he calls
- Misdiagnoses add extra visits, docking his performance score
- Cannot access PDF manuals with dirty gloves and a phone

**Goals**
- Fix it right on the first visit, every time
- Understand complex equipment without years of training
- Get help hands-free — both hands needed on the equipment
- Build a reputation as a reliable, accurate technician

**Tech Comfort:** Uses smartphone daily. Not a developer. Needs an app as simple as a phone call.

---

### Secondary User — The Dispatch Supervisor ("Sara")

**Profile**
- 45 years old, field ops manager, 20 years in the industry
- Manages 15–20 technicians across a metro area
- Responsible for SLA compliance, parts procurement, scheduling

**Pain Points**
- Does not know what is happening at a job site unless the tech calls in
- Parts orders are delayed because diagnosis is incomplete
- Truck roll decisions made without visual context
- No automatic record of what was diagnosed and when

**Goals**
- Reduce unnecessary truck rolls and repeat visits
- Get automatic case logs without requiring the tech to type notes
- Know immediately when a job needs a specialist or parts
- Have a documented audit trail for every service call

**Interaction With FieldMind:** Sara receives an automatic email when FieldMind escalates a case. She sees: technician ID, unit ID, full diagnostic summary, and recommended action. She does not interact with FieldMind directly.

### 4.1 Non-Users (Out of Scope)

- End customers / building owners — they never interact with FieldMind
- Parts suppliers — escalation emails go to dispatch, not suppliers
- Remote experts — FieldMind replaces the need to call them

---

## 5. System Architecture Overview

### 5.1 Architecture Principle

FieldMind is built on a strict separation of concerns: the frontend is a thin, stateless PWA that captures and streams data. All intelligence lives in the backend. This means the frontend can be replaced or upgraded without touching any AI logic.

### 5.2 Layer-by-Layer Architecture

#### Layer 1 — User Device (PWA)
- React Progressive Web App (TypeScript) — works on any smartphone browser
- WebRTC microphone access → PCM Int16 audio at 16kHz mono
- MediaDevices camera API → JPEG frames at 1 frame per second (640×360)
- WebSocket client — bidirectional stream (sends audio + frames, receives audio + text)
- Web Audio API — plays back AI voice responses
- Service Worker — handles connectivity loss and auto-reconnect
- Firebase Hosting — serves the PWA globally with HTTPS

#### Layer 2 — Backend Orchestration (Cloud Run)
- FastAPI Python server — WebSocket endpoint: `/ws/{session_id}`
- ADK LlmAgent — session management, tool orchestration, response routing
- Gemini Live 2.5 Flash Native Audio — voice conversation engine with VAD and barge-in
- Parallel vision pipeline — every camera frame sent to Gemini Flash 2.0 (async, non-blocking)
- Session state manager — maintains equipment context across multi-turn conversation
- Cloud Run `min-instances=1` — zero cold start latency for demo

#### Layer 3 — AI Models (Vertex AI)
- `gemini-live-2.5-flash-native-audio` — primary voice agent, tool calling, barge-in, <300ms latency
- `gemini-2.0-flash` — camera frame analysis, equipment OCR, wiring diagram reading
- `text-embedding-004` — embedding model for manual chunking and RAG queries

#### Layer 4 — Knowledge & Data (GCP Data Services)
- **Vertex AI Vector Search** — stores and queries 768-dimensional embeddings of equipment manuals
- **Cloud Storage** — stores raw manual PDFs and pre-built embeddings JSONL file
- **Firestore** — stores equipment records, service history, fault codes, escalated cases, session data

#### Layer 5 — Events & Notifications (Async Pipeline)
- **Cloud Pub/Sub** — topic: `field-escalations` receives escalation events from ADK tool
- **Cloud Functions (Gen2)** — triggered by Pub/Sub, sends email/SMS notification via SendGrid
- **Firestore** — case records written atomically with Pub/Sub publish

### 5.3 Complete Data Flow

The full sequence from "What's wrong with this unit?" to voice response:

```
Step 1:  Technician taps "Hold to Talk" in the PWA
Step 2:  Browser captures PCM audio → encodes to base64 → sends via WebSocket
Step 3:  Browser captures 1 JPEG frame/sec from camera → sends via same WebSocket
Step 4:  Cloud Run FastAPI server receives both streams simultaneously
Step 5:  ADK LlmAgent session receives audio chunk + latest camera frame as context
Step 6:  Gemini Live API processes audio with VAD — detects end of speech utterance
Step 7:  ADK triggers tool: analyze_equipment(image_frame) → Gemini Flash identifies "Trane XR14"
Step 8:  ADK triggers tool: get_service_history("HVAC-001") → Firestore returns last 3 visits
Step 9:  ADK triggers tool: search_manuals("E7 fault code Trane XR14") → Vector Search top-3 chunks
Step 10: All context injected into Gemini Live conversation window
Step 11: Gemini Live generates grounded voice response citing manual section
Step 12: Audio streams back over WebSocket → Web Audio API plays on phone speaker
Step 13: Transcript text simultaneously displayed as overlay on camera feed
Step 14: If technician interrupts ("wait — burnt wire!") → Gemini Live VAD fires →
         output stops immediately → camera re-analyzed → diagnosis revised
```

---

## 6. Feature Specifications

### Feature 1 — Real-Time Voice Conversation (Gemini Live API)

| Attribute | Detail |
|---|---|
| **What it is** | The core voice interface. The technician speaks naturally and FieldMind responds in natural speech. No typing. No menus. No touch required after the initial "hold" button. |
| **How it works** | ADK Bidi-streaming connects to Gemini Live 2.5 Flash Native Audio model. Raw PCM audio at 16kHz mono is streamed from the browser. The model handles Voice Activity Detection (VAD) automatically. |
| **Barge-in** | If the technician speaks while FieldMind is mid-sentence, the Gemini Live API's built-in VAD immediately detects the new speech, halts the current output, processes the interruption, and generates a new response. This is the #1 differentiating feature in the hackathon rubric. |
| **Turn management** | ADK handles all turn management. The agent tracks full conversation history so context accumulates — a fault code mentioned 3 exchanges ago is still known. |
| **Latency target** | Under 500ms from speech end to first audio response word. Cloud Run `min-instances=1` eliminates cold starts. |
| **Done when** | Technician speaks → FieldMind responds in voice. Technician interrupts mid-response → FieldMind immediately stops and adapts. Both demonstrated live, not mockup. |
| **Judging criterion** | Innovation & Multimodal UX (40%) — "Does the agent handle barge-in naturally?" |

---

### Feature 2 — Live Camera Vision (Equipment Identification)

| Attribute | Detail |
|---|---|
| **What it is** | FieldMind continuously watches what the technician's camera sees — 1 frame/sec — and uses this visual context to identify equipment and read visual information like fault codes and wiring diagrams. |
| **How it works** | PWA uses MediaDevices API (`facingMode: "environment"`) to capture video. Every second, the current frame is drawn to a hidden canvas (640×360), encoded as JPEG at 80% quality, base64 encoded, and sent over WebSocket alongside the audio stream. |
| **Equipment ID** | Each frame is passed to Gemini Flash 2.0 (async, non-blocking) via the `analyze_equipment` ADK tool. Returns structured JSON: `{make, model, serial, equipment_type, visible_fault_codes, visible_damage, confidence}`. |
| **Fault code OCR** | Gemini Flash reads text visible in the camera frame. If a fault code is flashing on a display panel, FieldMind reads it and incorporates it into the diagnosis automatically. |
| **Wiring diagram reading** | Gemini Flash can read faded or technical wiring diagrams from a camera frame and cross-reference them with the stored manual schema. |
| **Done when** | Technician points phone at HVAC unit → FieldMind identifies make and model without being told → equipment badge appears in UI → FieldMind uses it in the diagnosis. |
| **Judging criterion** | Innovation & Multimodal UX (40%) — "All 3 modalities feel seamless, not duct-taped" |

---

### Feature 3 — RAG over Equipment Manuals (Vertex AI Vector Search)

| Attribute | Detail |
|---|---|
| **What it is** | FieldMind's responses are grounded in real equipment manuals. Instead of hallucinating part numbers or torque specs, it searches indexed manual PDFs and cites the exact section it used. |
| **How it works** | Equipment manual PDFs (Trane, Carrier, Lennox — publicly available) are chunked into 400-token sections, embedded with `text-embedding-004` (768 dimensions), and stored in Vertex AI Vector Search. At query time, the question + equipment model is embedded and the top-3 closest manual chunks are returned. |
| **Index setup** | One-time process during setup. ~20–30 PDFs, ~500 chunks. Estimated cost: $2–5 one-time. |
| **Citation rule** | The ADK system prompt mandates FieldMind MUST call `search_manuals` before giving repair guidance, and MUST cite the source: *"According to Trane XR14 Service Manual, Section 4.3..."* |
| **Fallback** | If Vector Search fails, falls back to Firestore keyword-matched fault code lookup. Less impressive but functional. The demo never breaks. |
| **Done when** | Technician describes a fault → FieldMind's response includes a specific manual citation by section name and source document. Visible in transcript overlay in the UI. |
| **Judging criterion** | Technical Architecture (30%) — "Evidence of grounding, no hallucinations" |

---

### Feature 4 — Service History Lookup (Firestore)

| Attribute | Detail |
|---|---|
| **What it is** | FieldMind knows the repair history of the specific unit it is looking at. When it says "this unit was last serviced 8 months ago for a capacitor replacement," that is real data from Firestore, not a guess. |
| **How it works** | Once `analyze_equipment` identifies the unit, `get_service_history(unit_id)` queries `service_records` collection for the last 5 records sorted by date descending. Also pulls equipment record and known fault codes for that make. |
| **Data seeding** | Firestore is pre-seeded with 3–5 equipment records and 5–10 service records as part of Day 1 setup. Ensures reliable demo without depending on real customer data. |
| **Done when** | FieldMind references service history in its diagnosis: *"I can see this unit was last serviced 8 months ago — the capacitor was replaced then. This recurring fault suggests the underlying issue was not fully resolved."* |
| **Judging criterion** | Innovation & Multimodal UX (40%) — "Live context-awareness, not just reactive" |

---

### Feature 5 — Intelligent Case Escalation (Pub/Sub + Cloud Functions)

| Attribute | Detail |
|---|---|
| **What it is** | When FieldMind determines a job requires specialist intervention, it proactively escalates — logging the case, notifying dispatch, and confirming to the technician, all in a single spoken statement. |
| **How it works** | The `escalate_case` ADK tool executes four actions atomically: (1) writes case record to Firestore, (2) publishes JSON message to Cloud Pub/Sub `field-escalations` topic, (3) Cloud Function sends email via SendGrid to dispatch, (4) returns confirmation FieldMind speaks to the technician. |
| **Demo moment** | Judge sees in real time: FieldMind speaks "escalating now" → Pub/Sub console shows message → Cloud Function log shows email sent → Firestore shows new case record. **4 GCP services, one sentence.** |
| **Escalation trigger** | FieldMind escalates when: diagnosis confidence < 70%, issue requires physical parts not on the truck, or technician explicitly requests escalation. |
| **Done when** | FieldMind says "escalating" → Firestore case record exists within 3 seconds → Pub/Sub message visible in console → email sent. |
| **Judging criterion** | Technical Architecture (30%) — "Multiple GCP services working together" |

---

## 7. Functional Requirements

Priority levels: **MUST** = required for submission · **HIGH** = required for competitive score · **MED** = improves score · **NICE** = polish if time allows

### 7.1 Backend Functional Requirements

| ID | Requirement | Priority | Owner | Acceptance Criteria |
|---|---|---|---|---|
| BE-01 | WebSocket endpoint `/ws/{session_id}` accepts bidirectional connections | MUST | Person A | Must handle concurrent connections. Session ID is UUID generated by frontend. |
| BE-02 | ADK LlmAgent initialized per session with system prompt and 4 tools registered | MUST | Person A | Agent must persist across multiple audio chunks in the same session. |
| BE-03 | Gemini Live 2.5 Flash Native Audio processes audio stream with VAD enabled | MUST | Person A | Model: `gemini-live-2.5-flash-native-audio`. VAD detects speech end automatically. |
| BE-04 | Barge-in detection: new audio while agent is speaking stops current output immediately | MUST | Person A | Must be demonstrated in demo video. Explicitly in judging rubric. |
| BE-05 | Camera frame processed by Gemini Flash 2.0 Vision async (non-blocking audio pipeline) | MUST | Person A | Vision pipeline must not block voice pipeline. Use `asyncio.create_task()`. |
| BE-06 | `analyze_equipment()` returns structured JSON with make, model, serial, confidence | MUST | Person A | Must return valid JSON 100% of the time. Error state returns `{confidence:0.0, error:...}`. |
| BE-07 | `get_service_history()` queries Firestore and returns last 5 service records for unit | MUST | Person A | Returns empty list gracefully if unit not found. Never throws exception. |
| BE-08 | `search_manuals()` embeds query, queries Vector Search, returns top-3 manual chunks with citations | HIGH | Person A | Fallback to Firestore keyword search if Vector Search unavailable. |
| BE-09 | `escalate_case()` writes to Firestore AND publishes to Pub/Sub in single tool call | HIGH | Person A | Both operations must succeed. If Pub/Sub fails, Firestore write still committed. |
| BE-10 | Cloud Function triggered by Pub/Sub sends email notification within 30 seconds | HIGH | Person A | Use SendGrid free tier. Recipient configurable via environment variable. |
| BE-11 | FastAPI `/health` endpoint returns `{"status":"ok"}` for Cloud Run health checks | MUST | Person A | Required for Cloud Run to mark instance as healthy. |
| BE-12 | Session state persists `equipment_context` across multiple conversation turns | HIGH | Person A | If equipment identified in turn 1, still referenced in turn 5. |
| BE-13 | Cloud Run deployed with `min-instances=1` to prevent cold start during demo | MUST | Person A | **CRITICAL:** Cold start during live demo = failed demo. Must be set before recording. |
| BE-14 | System prompt enforces citation: agent must call `search_manuals` before repair guidance | MUST | Person A | Prompt rule: "ALWAYS call search_manuals before giving repair guidance." |
| BE-15 | Error handling: all tool exceptions caught and returned as structured error objects | HIGH | Person A | Never let a tool exception crash the ADK session. |

### 7.2 Frontend Functional Requirements

| ID | Requirement | Priority | Owner | Acceptance Criteria |
|---|---|---|---|---|
| FE-01 | WebSocket client connects to backend and auto-reconnects on disconnect (3-second retry) | MUST | Person B | Show "Connecting..." status while reconnecting. Never show blank screen. |
| FE-02 | Microphone access via `getUserMedia` with constraints: 16kHz, mono, `echoCancellation:true` | MUST | Person B | Float32 audio → Int16 PCM conversion required before sending. |
| FE-03 | Camera access via `getUserMedia` with `facingMode:"environment"` (rear camera) | MUST | Person B | Fall back to any camera if rear unavailable. Ask permission on first launch. |
| FE-04 | 1 frame per second JPEG capture (640×360, 80% quality) sent over WebSocket | MUST | Person B | Use `setInterval` on `canvas.toDataURL`. Must not block audio thread. |
| FE-05 | Hold-to-talk button: pressing starts audio stream, releasing stops it | MUST | Person B | Works on both mouse (desktop) and touch (mobile). Both `onMouseDown`/`onTouchStart`. |
| FE-06 | Incoming audio response from backend played via Web Audio API | MUST | Person B | Decode base64 → ArrayBuffer → `AudioContext.decodeAudioData` → play. |
| FE-07 | Real-time transcript overlay on camera feed — last 3 exchanges visible | MUST | Person B | FieldMind lines in yellow, technician lines in blue. Older lines fade (50% opacity). |
| FE-08 | Equipment identification badge: slides in when equipment is identified, shows make/model | HIGH | Person B | Animated slide-in from top. Orange if no service history found. |
| FE-09 | Status indicator shows: Connecting / Ready / Listening / Analyzing / Speaking | MUST | Person B | Waveform bars animate during Listening and Speaking states. |
| FE-10 | Escalation confirmation modal appears when backend sends escalation confirmation | HIGH | Person B | Shows case ID, severity badge, "Dispatch notified". Auto-dismiss after 5 seconds. |
| FE-11 | PWA `manifest.json` configured for standalone display, navy background, gold theme color | HIGH | Person B | Allows "Add to Home Screen" — app launches without browser chrome. |
| FE-12 | Service worker handles WebSocket reconnect prompts on network loss | MED | Person B | Caches app shell. Does not cache backend data. |
| FE-13 | Firebase Hosting deployment with HTTPS | MUST | Person B | HTTP will not work — browser blocks camera/mic on non-HTTPS origins. |
| FE-14 | Loading/splash screen while WebSocket connects | MED | Person B | Fades to main screen when WebSocket `"ready"` message received. |
| FE-15 | iOS Safari compatibility: AudioContext must be unlocked on user gesture | HIGH | Person B | Create `AudioContext` inside the `onTouchStart` handler, not at app load. |

---

## 8. Non-Functional Requirements

| Category | Requirement | Target |
|---|---|---|
| Performance — Latency | Time from end of technician speech to first word of FieldMind voice response | Under 500ms (target), under 1000ms (acceptable) |
| Performance — Vision | Time from camera frame sent to equipment metadata returned | Under 2 seconds per frame (async, non-blocking) |
| Reliability — Demo | Demo must work successfully during recording without errors | 9 out of 10 demo runs succeed end-to-end |
| Reliability — Backend | Cloud Run instance must be alive with 0 cold starts during demo window | `min-instances=1` set. Verified via health check before recording. |
| Scalability | System only needs to handle 1 concurrent user for the hackathon demo | 1 user. Scale-out architecture is in place but not load-tested. |
| Budget | Total GCP spend across all development and demo recording | Under $100. Billing alert set at $70. |
| Mobile Compatibility | PWA must work on iOS Safari 16+ and Android Chrome 110+ | Tested on at least one iOS and one Android device before demo recording. |
| Audio Quality | Voice response must be clearly intelligible in ambient conditions | Test at 60dB ambient noise. Enable `echoCancellation` and `noiseSuppression`. |
| Security — API Keys | No API keys or credentials in frontend code or GitHub repository | All secrets in GCP Secret Manager or Cloud Run environment variables. |
| Availability | Backend must be available for the judging window (March 16 – April 22) | Cloud Run always-on with `min-instances=1` during judging period only. |
| Code Quality | GitHub repository must be public with a complete README | README includes: architecture description, setup steps, GCP services list, how to run. |
| Demo Proof | GCP Console must show active services during demo recording | Cloud Run logs + Firestore records + Pub/Sub messages all visible in split-screen recording. |

---

## 9. API & Integration Specifications

### 9.1 WebSocket Protocol (Frontend ↔ Backend)

All communication uses a single persistent WebSocket connection. The protocol is JSON over WebSocket text frames.

**Messages FROM Frontend TO Backend:**

| Type | Structure | Description |
|---|---|---|
| `"audio"` | `{ "type": "audio", "data": "<base64 PCM Int16>" }` | Sent continuously while hold-to-talk is active. PCM Int16 @ 16kHz mono. 1024 samples per chunk. |
| `"frame"` | `{ "type": "frame", "data": "<base64 JPEG>" }` | Sent at 1 fps regardless of talk state. JPEG, 640×360, 80% quality. |
| `"ping"` | `{ "type": "ping" }` | Keepalive every 30 seconds. Backend responds with `{"type":"pong"}`. |

**Messages FROM Backend TO Frontend:**

| Type | Structure | Description |
|---|---|---|
| `"status"` | `{ "type": "status", "data": "ready" }` | Sent once when ADK session initialized. Frontend transitions from splash to main screen. |
| `"response"` | `{ "type": "response", "parts": [{"type":"audio","data":"<b64>"},{"type":"text","data":"..."}] }` | Voice audio (base64 PCM) AND transcript text simultaneously. |
| `"equipment"` | `{ "type": "equipment", "data": { "make":"Trane","model":"XR14" } }` | Sent when `analyze_equipment` returns high-confidence result. Frontend updates equipment badge. |
| `"escalation"` | `{ "type": "escalation", "data": { "case_id":"CASE-...", "severity":"HIGH" } }` | Sent when `escalate_case` completes. Frontend shows escalation confirmation modal. |
| `"error"` | `{ "type": "error", "data": "error description" }` | Sent on unrecoverable backend error. Frontend shows error state and triggers reconnect. |
| `"pong"` | `{ "type": "pong" }` | Response to frontend ping. Confirms connection is alive. |

---

### 9.2 ADK Tool API Contracts

#### `analyze_equipment(image_frame_b64: str) → dict`

```python
# Arguments
image_frame_b64: str  # Base64-encoded JPEG image from technician camera

# Returns
{
  "make": str | None,           # Equipment manufacturer name
  "model": str | None,          # Model number
  "serial": str | None,         # Serial number if visible in frame
  "equipment_type": str,        # HVAC | Electrical | Plumbing | Industrial | Unknown
  "visible_fault_codes": list,  # Fault codes visible on display panels e.g. ["E7"]
  "visible_damage": str | None, # Description of visible damage, corrosion, burns
  "confidence": float,          # 0.0–1.0. Below 0.5 = FieldMind asks clarifying question
  "notes": str                  # Any other relevant observations
}
```

#### `search_manuals(query: str, model_id: str = None, top_k: int = 3) → dict`

```python
# Arguments
query: str          # e.g. "E7 fault code Carrier 50XC fix procedure"
model_id: str       # Equipment model to narrow search scope (optional)
top_k: int          # Number of manual chunks to return (default 3)

# Returns
{
  "sections": [
    {
      "source": str,            # Source PDF filename e.g. "Trane_XR14_Service_Manual.pdf"
      "section": str,           # Section title e.g. "Section 4.3 — Fault Code Diagnosis"
      "content": str,           # 400-token text chunk with relevant information
      "relevance_score": float  # Vector Search similarity distance
    }
  ],
  "query": str,      # The enriched query that was used (for debugging)
  "error": str       # Present only if Vector Search is unavailable (optional)
}
```

#### `get_service_history(unit_id: str, limit: int = 5) → dict`

```python
# Arguments
unit_id: str    # Equipment unit identifier from analyze_equipment result
limit: int      # Maximum number of service records to return (default 5)

# Returns
{
  "unit_id": str,
  "equipment": {               # Full equipment record
    "make": str, "model": str, "serial": str,
    "install_date": str, "warranty_expiry": str
  },
  "service_history": [         # Last N records sorted by date descending
    {
      "date": str, "technician": str, "issue": str,
      "parts": list, "resolved": bool, "notes": str
    }
  ],
  "known_fault_codes": dict,   # All fault codes for this equipment make
  "history_count": int
}
```

#### `escalate_case(case_summary, technician_id, severity, unit_id, recommended_action) → dict`

```python
# Arguments
case_summary: str          # Full diagnostic summary in plain English
technician_id: str         # ID of the field technician (from session context)
severity: str              # LOW | MEDIUM | HIGH | CRITICAL
unit_id: str               # Equipment unit ID (optional)
recommended_action: str    # What parts/specialists are needed (optional)

# Returns
{
  "case_id": str,    # e.g. "CASE-20260315-143022"
  "status": str,     # "escalated" on success
  "message": str     # Human-readable confirmation FieldMind speaks to technician
}
```

---

## 10. Data Models & Database Schema

All persistent data lives in Firestore (NoSQL document database).

### `/equipment/{unit_id}`
> Master record for each piece of equipment. Populated during setup.

| Field | Type | Required | Description |
|---|---|---|---|
| `unit_id` | string | YES | Unique identifier e.g. `"HVAC-001"`. Used as Firestore document ID. |
| `make` | string | YES | Manufacturer name e.g. `"Trane"`, `"Carrier"`, `"Siemens"` |
| `model` | string | YES | Model number e.g. `"XR14"` |
| `serial` | string | NO | Serial number if known |
| `type` | string | YES | `HVAC \| Electrical \| Plumbing \| Industrial` |
| `location` | string | YES | Human-readable location e.g. `"Building A Rooftop"` |
| `install_date` | string | YES | ISO date string e.g. `"2020-03-15"` |
| `warranty_expiry` | string | NO | ISO date string |

### `/service_records/{record_id}`
> Historical service visits for each unit. FieldMind reads this to give context-aware advice.

| Field | Type | Required | Description |
|---|---|---|---|
| `unit_id` | string | YES | Foreign key to `/equipment` collection |
| `date` | string | YES | ISO date string — used for ordering |
| `technician` | string | YES | Technician name or ID |
| `issue` | string | YES | Plain English description of the reported issue |
| `parts` | list[string] | NO | Parts replaced during this visit |
| `resolved` | boolean | YES | Whether the issue was fully resolved |
| `notes` | string | NO | Additional technician notes |

### `/fault_codes/{make_code}`
> Known fault code definitions per equipment make. Used by `get_service_history` and as RAG fallback.

| Field | Type | Required | Description |
|---|---|---|---|
| `code` | string | YES | Fault code e.g. `"E7"` |
| `make` | string | YES | Equipment make this code applies to |
| `description` | string | YES | What the fault code means |
| `common_cause` | string | YES | Most likely causes ranked by frequency |
| `severity` | string | YES | `LOW \| MEDIUM \| HIGH` |
| `action` | string | YES | Immediate recommended action for the technician |

### `/cases/{case_id}`
> Escalated diagnostic cases. Written by `escalate_case()`. Read by dispatch supervisor via email.

| Field | Type | Required | Description |
|---|---|---|---|
| `case_id` | string | YES | Auto-generated e.g. `"CASE-20260313-143022"` |
| `created_at` | string | YES | ISO datetime UTC |
| `technician_id` | string | YES | Technician identifier from session |
| `unit_id` | string | NO | Equipment unit if identified |
| `severity` | string | YES | `LOW \| MEDIUM \| HIGH \| CRITICAL` |
| `summary` | string | YES | Full diagnostic summary generated by FieldMind |
| `recommended_action` | string | NO | Parts, specialists, or next steps needed |
| `status` | string | YES | `ESCALATED \| RESOLVED \| IN_PROGRESS` |

### `/manual_chunks/{chunk_id}`
> Stores text content of manual chunks alongside their Vector Search IDs. Populated once during setup.

| Field | Type | Required | Description |
|---|---|---|---|
| `chunk_id` | string | YES | UUID — matches Vector Search neighbor ID |
| `source_file` | string | YES | Source PDF filename e.g. `"Trane_XR14_Service_Manual"` |
| `section_title` | string | YES | Best-guess section name from the chunk |
| `text` | string | YES | 400-token text content of the chunk |
| `blob_path` | string | YES | Cloud Storage path of source PDF |

---

## 11. UI/UX Specifications

### 11.1 Design Principles

- **Field-first:** designed for a job site, not an office. Large touch targets. Readable in sunlight. Works with gloves.
- **Minimal interaction:** technician should need only ONE interaction — holding the talk button. Everything else is automatic.
- **Trust through transparency:** always show what FieldMind is doing (analyzing, speaking, thinking). No black boxes.
- **Professional, not cute:** dark navy color scheme, industrial typography, zero consumer-app clichés.

### 11.2 Color Palette

| Color Name | Hex | Tailwind Class | Usage |
|---|---|---|---|
| App Background | `#0D1B2A` | `bg-gray-950` | Main screen background, splash screen. Never white. |
| Card Background | `#1F2937` | `bg-gray-800` | Status bar, control area, modal backgrounds. |
| FieldMind Gold | `#F9A825` | `text-yellow-400` | FieldMind logo, FieldMind transcript text, active states. |
| Technician Blue | `#93C5FD` | `text-blue-300` | Technician transcript text, connection status dot. |
| Active Green | `#4ADE80` | `text-green-400` | Connection confirmed, successful escalation. |
| Alert Orange | `#FB923C` | `text-orange-400` | Equipment info strip when no service history found. |
| Talk Button Idle | `#1D4ED8` | `bg-blue-700` | Voice button in ready/idle state. |
| Talk Button Active | `#F9A825` | `bg-yellow-400` | Voice button when held. Ripple effect around it. |
| Text Primary | `#F9FAFB` | `text-gray-50` | Main readable text on dark backgrounds. |
| Text Secondary | `#9CA3AF` | `text-gray-400` | Labels, status descriptions, metadata. |
| Border/Divider | `#374151` | `border-gray-700` | Top bar border, section dividers. |

### 11.3 Screen Specifications

#### Screen A — Splash / Loading Screen

- **Background:** Full screen `#0D1B2A` (navy). No scroll.
- **Center:** `⚡ FieldMind` in gold `#F9A825` at 48px bold.
- **Below logo:** `"Expert AI Co-Pilot"` in gray at 20px.
- **Below tagline:** Animated spinning ring loader in blue.
- **Status text:** Cycles `"Connecting..."` → `"Initializing agent..."` → `"Ready"`
- **Transition:** When WebSocket sends `{"type":"status","data":"ready"}` → fade to Screen B over 300ms.
- **Failure state:** If no connection after 10 seconds → `"Connection failed. Retrying..."` + retry button.

---

#### Screen B — Main Agent Screen (Core Experience)

```
┌─────────────────────────────────────────────────┐
│  ⚡ FieldMind              [Trane XR14] 🟢       │  ← TOP BAR (8%)
├─────────────────────────────────────────────────┤
│                                                 │
│                                                 │
│           LIVE CAMERA FEED                      │  ← CAMERA FEED (52%)
│                                                 │
│  ⚡ FieldMind: I can see this is a Trane XR14.  │  ← TRANSCRIPT OVERLAY
│  👷 You: E7 fault code, won't cool.             │    (bottom 30% of camera)
├─────────────────────────────────────────────────┤
│  🔧  Trane XR14  ·  Last serviced 8mo ago       │  ← EQUIPMENT STRIP (8%)
├─────────────────────────────────────────────────┤
│  ████ ▌▌▌▌  FieldMind is speaking...            │  ← STATUS BAR (8%)
│                                                 │
│               ┌─────────┐                       │
│               │   🎤    │   ← TALK BUTTON (24%) │
│               └─────────┘                       │
│             HOLD TO TALK                        │
└─────────────────────────────────────────────────┘
```

**Equipment Badge (top bar right):**
- Hidden until `analyze_equipment` returns `confidence > 0.7`
- Slide-in animation from right over 300ms
- Format: `"Trane XR14"` in white on dark blue pill (`#1565C0`)
- Orange pill (`#E65100`) if equipment found but no service history exists

**Voice Button States:**

| State | Appearance | Behavior |
|---|---|---|
| IDLE | 112px circle, `#1D4ED8` (blue), microphone icon white 40px, label: "HOLD TO TALK" | Waits for touch/click |
| ACTIVE | 112px circle, `#F9A825` (gold), microphone dark 48px, two ripple rings animate, label: "RELEASE" | `onMouseDown`/`onTouchStart` starts audio stream. `onMouseUp`/`onTouchEnd` stops it. |
| DISABLED (speaking) | 40% opacity blue, cursor: not-allowed, label: "Wait..." | Cannot be pressed while FieldMind is speaking. Re-enables after FieldMind finishes. |
| DISABLED (connecting) | 40% opacity, spinner overlay | Cannot be pressed while WebSocket is connecting. |

---

#### Screen C — Escalation Confirmation Modal

- Dark semi-transparent overlay (`rgba(0,0,0,0.75)`) over main screen
- White card centered: 320px wide, rounded-2xl
- Warning icon (orange triangle) 48px
- Title: `"Case Escalated"` bold 20px dark navy
- Body: `"Case CASE-XXXXXXXX · Severity: HIGH · Dispatch team has been notified."`
- Green checkmark animation (draws itself over 500ms)
- Auto-dismiss after 5 seconds or tap to dismiss

---

## 12. Demo Scenarios

Four demo scenarios are planned for the 4-minute video. All four must be demonstrated live — no mockups.

### Scenario 1 — The Diagnosis `(0:45–1:40)`
> **Demonstrates:** All 3 modalities + grounded AI

**Setup:** Technician faces an HVAC unit with fault code E7 visible on the panel.

**Tech says:** *"FieldMind, this unit won't cool. I'm seeing fault code E7 flashing."*

**What happens internally:**
1. `analyze_equipment()` identifies the unit make and model from camera frame
2. `get_service_history()` retrieves last 3 service records from Firestore
3. `search_manuals()` queries Vector Search for `"E7 fault code [model]"`
4. FieldMind speaks a diagnosis citing the exact manual section

**FieldMind says:** *"I can see this is a [Make Model]. E7 is the outdoor temperature sensor fault — last time this unit was seen, it had a capacitor issue. According to the [Model] Service Manual, Section 4.2, E7 is typically caused by a corroded connector at the sensor harness. Check the right side service panel. I'll wait."*

**Why it wins:** Judges see camera identifying equipment, manual citation, and service history referenced — all 3 modalities in one exchange.

---

### Scenario 2 — Barge-In Handling `(1:40–2:15)`
> **Demonstrates:** Innovation — "Does barge-in feel natural?"

**Setup:** FieldMind is mid-explanation of the sensor replacement procedure.

**Tech says:** *"Wait — I'm seeing a burnt wire here."*

**What happens internally:**
1. Gemini Live VAD detects new speech mid-output — stops FieldMind immediately
2. Latest camera frame analyzed — shows burnt wire near contactor
3. Diagnosis is revised based on new visual evidence
4. FieldMind re-plans the repair sequence

**FieldMind says:** *"That changes things. That burnt wire to the contactor suggests a voltage surge — it likely triggered the E7 as a secondary fault. Do not replace the sensor yet. Fix the wiring first. The surge may have damaged the contactor contacts too — check those before powering back up."*

**Why it wins:** Interrupting the AI mid-sentence and having it adapt instantly is the most powerful demo of Gemini Live API capabilities. No chatbot can do this.

---

### Scenario 3 — Visual Manual Reading `(2:15–2:50)`
> **Demonstrates:** Vision modality — "can it read what I see?"

**Setup:** Technician points camera at a faded wiring diagram on the unit's inner panel.

**Tech says:** *"Can you read this wiring diagram? It's too faded to see clearly."*

**What happens internally:**
1. `analyze_equipment()` uses Gemini Flash OCR to read the wiring diagram text and layout
2. `search_manuals()` retrieves matching wiring schema from Vector Search
3. FieldMind explains the circuit and warns about live voltage points

**FieldMind says:** *"I can see the low-voltage thermostat wiring. R is 24V power, C is common, Y triggers the cooling contactor, G runs the fan independently. According to the [Model] wiring diagram on page 31 — the yellow Y wire goes to terminal Y2 for two-stage cooling. Before touching anything: the R terminal is live even with the unit off. Use your meter first."*

**Why it wins:** FieldMind reads something the technician cannot read. The vision modality delivers direct practical value, not just equipment identification.

---

### Scenario 4 — Expert Escalation `(2:50–3:15)`
> **Demonstrates:** Multi-GCP architecture in one action

**Setup:** After diagnosis, FieldMind determines the compressor has winding failure — requires full replacement.

**What happens internally:**
1. FieldMind determines confidence threshold is exceeded — specialist required
2. `escalate_case()` writes case record to Firestore
3. `escalate_case()` publishes to Cloud Pub/Sub `field-escalations` topic
4. Cloud Function triggers, sends email to dispatch
5. FieldMind speaks confirmation to technician

**FieldMind says:** *"This is a compressor winding failure — you'll need a full unit replacement. I've escalated this case to dispatch. Case ID CASE-20260315-143022 has been logged with the full diagnostic. Procurement will be notified for the replacement unit. You're done here — document your time."*

**Why it wins:** Judges watch: Pub/Sub console shows message → Cloud Function log shows email fired → Firestore shows case record. **4 GCP services, one sentence.**

---

## 13. Tech Stack & Infrastructure

| Category | Technology | Why This Choice |
|---|---|---|
| Frontend Framework | React 18 + TypeScript | Type safety prevents runtime errors. React hooks make audio/WebSocket state management clean. |
| CSS Framework | Tailwind CSS | Utility classes enable rapid UI development. Pre-built responsive utilities critical for mobile. |
| PWA Hosting | Firebase Hosting | Free tier. Global CDN. Automatic HTTPS (required for camera/mic). Simple deploy command. |
| Backend Framework | FastAPI (Python 3.11) | Native async/await critical for parallel audio+vision streams. ADK and all GCP libraries are Python-native. |
| Container Runtime | Cloud Run (GCP) | Serverless containers. `min-instances=1` eliminates cold start. Automatic HTTPS. WebSocket support. |
| AI Agent Framework | Google ADK 0.4.0 | Official ADK manages Gemini Live API session, tool calling, barge-in, and turn management. |
| Primary AI Model | Gemini Live 2.5 Flash Native Audio | Only model with sub-300ms voice latency + native tool calling + built-in VAD + barge-in. |
| Vision Model | Gemini Flash 2.0 | Best price/performance for repetitive vision tasks (1fps frames). Strong OCR for fault codes. |
| Embedding Model | text-embedding-004 (Vertex AI) | Google's best embedding model. 768 dimensions. Best compatibility with Vertex AI Vector Search. |
| Vector Database | Vertex AI Vector Search | Fully managed. Integrates natively with ADK and Vertex AI ecosystem. |
| Document Database | Cloud Firestore | NoSQL, real-time, serverless. Free tier generous. Native Python SDK. |
| Object Storage | Cloud Storage | Stores manual PDFs and embeddings JSONL. Integrates with Vector Search import natively. |
| Message Queue | Cloud Pub/Sub | Decouples escalation from agent response. Required for multi-GCP architecture proof. |
| Serverless Functions | Cloud Functions Gen2 | Triggered by Pub/Sub. Sends email notification. Free tier covers demo volume. |
| Email Service | SendGrid | Free tier: 100 emails/day. Simple REST API. Works from Cloud Functions. |
| CI/CD | Cloud Build + deploy.sh | Required for bonus points (+0.2). One-command deployment. |
| Source Control | GitHub (public repo) | Required by hackathon rules. README must have setup instructions and architecture description. |

---

## 14. Security & Compliance

### 14.1 Credentials & API Keys

- **ALL credentials** stored in GCP Secret Manager or Cloud Run environment variables
- **ZERO credentials** in source code — this will fail GitHub secret scanning and expose keys
- SendGrid API key: Cloud Run env var `SENDGRID_API_KEY`
- Google Application Default Credentials (ADC) used for all GCP service authentication
- Service account `fieldmind-runner` has minimum required IAM roles — principle of least privilege

### 14.2 Data Privacy

- No real customer data used — all Firestore records are seeded test data
- No PII stored in Firestore for the demo
- Camera frames processed in memory and never persisted to disk or storage
- Audio chunks processed in memory via WebSocket and never written to a file
- Session data in Firestore keyed by UUID, not linked to real identity

### 14.3 Network Security

- Cloud Run endpoint uses HTTPS only — HTTP requests are redirected
- CORS configured to allow-all during development — restrict to Firebase Hosting domain before judging
- WebSocket uses WSS (WebSocket Secure) — plain WS is not used
- Firebase Hosting provides free SSL certificate via Let's Encrypt

---

## 15. Testing & Quality Assurance

For a 5-day hackathon build, testing is focused entirely on demo reliability. The goal is: the 4-minute demo works perfectly **9 out of 10 dry runs** before recording begins.

### 15.1 Critical Path Tests (Must Pass Before Day 5 Recording)

| # | Test | Pass Criterion |
|---|---|---|
| T1 | WebSocket connects within 3 seconds of opening PWA on mobile phone | Status indicator shows "Ready" within 3 seconds of app opening |
| T2 | Microphone permission granted and audio sends | Status changes to "Listening" within 1 second of button hold. Backend logs show audio received. |
| T3 | Camera opens and frames are transmitted | Backend log shows frame received within 2 seconds of app open |
| T4 | `analyze_equipment` returns valid JSON for demo equipment | Tested with still photo of demo equipment 2 days before demo day. Confidence > 0.7. |
| T5 | `search_manuals` returns cited sections for E7 fault code query | Query returns at least 1 result with source citation. |
| T6 | FieldMind speaks a grounded response with manual citation | Response includes "According to [manual name]..." |
| T7 | Barge-in stops FieldMind mid-sentence | FieldMind is speaking → technician says "wait" → FieldMind stops within 300ms. Tested 3 times. |
| T8 | `escalate_case` creates Firestore record within 3 seconds | After FieldMind says "escalating" → Firestore `/cases` collection shows new document within 3 seconds |
| T9 | Pub/Sub message visible in GCP console after escalation | Cloud Pub/Sub console shows message in `field-escalations` topic |
| T10 | Full 4-minute demo runs without error | Complete demo script executed end-to-end at least 4 times. No crashes, no blank screens. |

---

## 16. Submission Requirements

**Deadline: March 16, 2026 @ 5:00 PM Pacific Time. Submit by 3:00 PM PT as safety buffer.**

| ☐ | Requirement | How to Meet It | Owner + Day |
|---|---|---|---|
| ☐ | Category selected: Live Agents | Select "Live Agents" in Devpost category dropdown | Person B · Day 5 |
| ☐ | Uses Gemini Live API or ADK | ADK Bidi-streaming is core. State model ID in description. | Person A · Day 1 |
| ☐ | At least 1 Google Cloud service | 6+ services used. List all explicitly in Devpost description. | Person A · Day 4 |
| ☐ | Project description (600+ words) | Problem stats → solution → 6 GCP services → 4 tools → barge-in → RAG → escalation → learnings | Person B · Day 5 |
| ☐ | Public GitHub repository | Create on Day 1. README must include: setup commands, architecture, GCP services, how to run. | Both · Day 1 (create), Day 4 (finalize) |
| ☐ | Architecture diagram | Created in draw.io. Shows all 6 GCP services with arrows. Upload as PNG to Devpost. | Person A · Day 4 |
| ☐ | GCP deployment proof | Screen recording: Cloud Run running + Vertex AI index + Firestore collections + Pub/Sub topic | Person A · Day 5 |
| ☐ | 4-minute demo video | YouTube (unlisted OK). Must show all 4 scenarios. Real working demo, NOT mockup. In English. | Person B · Day 5 |
| ☐ | Blog post (+0.6 bonus pts) | Medium or dev.to. Must include: *"I created this content for the purposes of entering the Gemini Live Agent Challenge."* Post on LinkedIn + Twitter with #GeminiLiveAgentChallenge | Person B · Day 5 |
| ☐ | `deploy.sh` (+0.2 bonus pts) | Shell script in repo root. One command: builds + deploys to Cloud Run. | Person A · Day 4 |
| ☐ | `cloudbuild.yaml` (+0.2 bonus pts) | Cloud Build config in repo root. Defines build + deploy steps. Mention in README. | Person A · Day 4 |
| ☐ | GDG membership (+0.2 bonus pts) | Join at gdg.community.dev. Takes 10 min. Copy public profile URL. Paste in Devpost form. | Person B · Day 3 |

---

## 17. Risk Register

| Risk | Probability | Impact | Owner | Mitigation |
|---|---|---|---|---|
| Gemini Live API audio latency >1 second during demo | MED | CRITICAL | A | Set Cloud Run `min-instances=1`. Test on actual mobile device over WiFi before recording. If >1s: use standard Gemini Flash for voice, simulate real-time with streaming. |
| `analyze_equipment()` fails to identify demo equipment | MED | HIGH | A | Pre-test with still photo of demo equipment 2 days before. If fails: add equipment as hardcoded fallback JSON in system prompt with specific make/model/serial. Demo still works. |
| Vertex AI Vector Search index build fails or too slow | MED | MED | A | Start index build by 1:00 PM Day 3. If not ready by 3:00 PM: implement Firestore keyword fallback for `fault_codes` collection. RAG still appears to work in demo. |
| Barge-in not working reliably in demo conditions | LOW | HIGH | A | Test barge-in 10 times before demo recording. If unreliable: slow down FieldMind speech pace — the barge-in window is wider with slower speech. |
| $100 GCP credit exhausted before demo day | LOW | CRITICAL | A | Set billing alert at $70. Use `min-instances=0` during development. Never leave Gemini Live API in active session while not testing. |
| iOS Safari AudioContext not starting (known bug) | HIGH | HIGH | B | Create `AudioContext` inside `onTouchStart`/`onClick` handler — NOT at app load. Add "Tap to Start Audio" screen before main UI on iOS. Test on iPhone before demo day. |
| Mobile camera not opening on demo device | MED | HIGH | B | Test on specific demo device 2 days before. If camera fails: use pre-recorded test images cycled via `setInterval`. Label as "camera simulation" in demo narrative. |
| WebSocket connection drops during live demo recording | MED | HIGH | B | Implement auto-reconnect with 3-second retry. Set Cloud Run `min-instances=1`. If reconnect fails: reload app (reconnect is instant with warm instance). |
| GCP billing alert not set — cost overrun | LOW | HIGH | A | Set alert at $70 on Day 1 before any API calls. Check billing dashboard at end of Days 1, 2, 3, 4. |
| Demo video upload to YouTube is slow / fails on Day 5 | LOW | HIGH | B | Upload in background while recording take 2 or 3. Have a Vimeo backup account ready. Start upload immediately after best take is selected. |
| Missing a required Devpost field at submission time | LOW | MED | B | Submit an incomplete draft early on Day 4. Update incrementally. Review Section 16 checklist with both people before final submit. |

---

## 18. Success Metrics

### 18.1 Hackathon Success Criteria

| Metric | Target | How Measured |
|---|---|---|
| Judging score — Innovation & Multimodal UX (40%) | 5.0 / 5.0 | All 3 modalities active. Barge-in demonstrated. Agent is proactive, not reactive. No text box in sight. |
| Judging score — Technical Architecture (30%) | 5.0 / 5.0 | 6+ GCP services shown in architecture diagram and in GCP console. Grounded responses with manual citations. |
| Judging score — Demo & Presentation (30%) | 5.0 / 5.0 | 4-minute live demo video. Problem stats at start. Clean arc. GCP console proof visible. Not a mockup. |
| Bonus points | +1.0 / 1.0 | Blog post published (+0.6), `deploy.sh` + `cloudbuild.yaml` in repo (+0.2), GDG membership (+0.2) |
| **Total hackathon score** | **6.0 / 6.0** | Composite of above. Top 5% of submissions required for Grand Prize consideration. |
| Prize — Grand Prize | $25,000 | Highest overall score across all categories. |
| Prize — Best Live Agent | $10,000 | Top score in Live Agents category. |
| Prize — Best Multimodal UX | $5,000 | Top multimodal innovation score. |
| Demo reliability | 9/10 dry runs pass | Tested 10 full demo runs before recording. 9 must complete without error. |
| Voice response latency | < 500ms | Measured from speech end to first audio output word. Cloud Run warm. |
| GCP budget compliance | < $100 total | Billing dashboard checked daily. Alert fires at $70. |

---

## Minimum Viable Demo (Safety Net)

> If Vector Search, escalation, or any non-core feature fails — the demo is **still exceptional** with just these three things:
>
> 1. **Gemini Live API voice conversation** (barge-in must work)
> 2. **Camera frame analysis via Gemini Flash** (equipment identification)
> 3. **Hardcoded knowledge** for 2–3 specific equipment types in the system prompt
>
> With just these three: technician points phone at equipment → FieldMind identifies it and speaks a diagnosis. Nobody has ever seen this before. This alone scores in the top 5. The RAG, escalation, and Pub/Sub are upgrades on top of something already extraordinary.

---

> *You are not building a demo.*
> *You are building the product that saves field service companies $1.8 billion a year.*
> **Build it like that.**

---
**⚡ FieldMind** · Gemini Live Agent Challenge 2026 · Deadline: March 16, 2026 @ 5:00 PM PT

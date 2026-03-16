# ⚡ FIELDMIND 5-MINUTE QUICK TEST

## Open App: https://feisty-parity-416714.web.app

---

## ✅ 1. CONNECTION TEST (30 seconds)

**What to check:**
- [ ] Status bar shows **"LIVE"** in green
- [ ] WiFi icon (bottom right) is green
- [ ] Camera feed appears
- [ ] No error messages

**If not working:** Refresh page, check permissions

---

## ✅ 2. CAMERA TEST (1 minute)

**What to do:**
1. Point camera at any HVAC equipment OR
2. Google "HVAC nameplate" and point camera at screen

**What to check:**
- [ ] Equipment badge appears on screen
- [ ] Shows make/model (even if "Unknown")
- [ ] Status briefly shows "ANALYZING"

**Example:** Point at AC unit → Badge shows "Carrier 50XC"

---

## ✅ 3. VOICE TEST (2 minutes)

**What to do:**
1. Tap the big microphone button (turns red)
2. Say: **"Hello, can you help me with an AC unit?"**
3. Tap mic again to stop
4. Wait for response

**What to check:**
- [ ] Your words appear in transcript (blue)
- [ ] AI responds in transcript (gold)
- [ ] Status shows "LISTENING" then "SPEAKING"
- [ ] Audio level bars appear when speaking

**Try these questions:**
- "What does error code E7 mean?"
- "How do I check refrigerant levels?"
- "The unit is not cooling, what should I check?"

---

## ✅ 4. ESCALATION TEST (1 minute)

**What to do:**
1. Press mic button
2. Say: **"I need to escalate this case"**
3. Stop recording

**What to check:**
- [ ] Orange/red modal appears
- [ ] Shows case ID (like "CASE-1234567890")
- [ ] Says "Dispatch notified"
- [ ] Modal auto-closes after 5 seconds

**Verify in database:**
- Open: https://console.firebase.google.com/project/feisty-parity-416714/firestore
- Check `/cases` collection
- Your case should be there

---

## 🎯 COMPLETE TEST SCENARIO (3 minutes)

**Simulate Real Field Service Call:**

```
1. Open app → Verify "LIVE" status
   ✅ Connected

2. Point camera at equipment
   ✅ Badge appears: "Carrier 50XC"

3. Press mic, say:
   "This Carrier unit is showing error code E7"
   ✅ AI responds with troubleshooting steps

4. Press mic, say:
   "I found a refrigerant leak, need to escalate"
   ✅ Escalation modal appears
   ✅ Case ID: CASE-1710612345

5. Check Firestore console
   ✅ Case record exists
```

---

## 📸 WHAT SUCCESS LOOKS LIKE

### Status Bar (Top):
```
⚡ FIELDMIND  │  #ABC12345  [◉ STANDBY]  🟢 LIVE
```

### Camera View:
```
┌─────────────────────────┐
│  [Camera Feed]          │
│                         │
│  ┌──────────────────┐   │
│  │ 🏭 Carrier 50XC  │   │ ← Equipment Badge
│  │ Confidence: 85%  │   │
│  └──────────────────┘   │
└─────────────────────────┘
```

### Transcript:
```
👷 Technician: "What does E7 mean?"

⚡ FieldMind: "E7 indicates low refrigerant 
pressure. [Manual: Carrier 50XC, Section 4.2]
Check for leaks in refrigerant lines..."
```

### Escalation Modal:
```
┌─────────────────────────────┐
│  ⚠️  CASE ESCALATED         │
│                             │
│  Case ID: CASE-1710612345   │
│  Severity: HIGH             │
│                             │
│  ✅ Dispatch notified       │
│  Response time: 30 minutes  │
└─────────────────────────────┘
```

---

## 🐛 QUICK FIXES

**Problem:** Status shows "OFFLINE"
**Fix:** Refresh page, wait 5 seconds

**Problem:** Camera not working
**Fix:** Allow permissions, refresh

**Problem:** Mic not recording
**Fix:** Check browser permissions, speak louder

**Problem:** No AI response
**Fix:** Check backend: 
```bash
curl https://fieldmind-backend-809015144044.us-central1.run.app/health
```
Should return: `{"status":"healthy","active_sessions":0}`

---

## 📱 BEST TESTING DEVICE

**Recommended:** iPhone or Android phone
- Better camera
- Better microphone
- Real field conditions

**Alternative:** Computer with webcam
- Works but less realistic
- Use Chrome browser

---

## ✅ FINAL CHECKLIST

Before demo/submission:

- [ ] App loads on mobile
- [ ] Status shows "LIVE"
- [ ] Camera works
- [ ] Voice recording works
- [ ] AI responds
- [ ] Escalation works
- [ ] Case in Firestore
- [ ] No console errors
- [ ] Recorded demo video

---

## 🎥 DEMO VIDEO SCRIPT (2 minutes)

**0:00-0:15** - "Field technicians waste 40% of time searching manuals. FieldMind fixes that."

**0:15-0:45** - Show camera identifying equipment, ask question, get AI response with citation

**0:45-1:15** - Show voice interaction, barge-in feature

**1:15-1:45** - Trigger escalation, show modal, show Firestore case

**1:45-2:00** - Show GCP console (Cloud Run, Firestore, Pub/Sub)

---

**App URL:** https://feisty-parity-416714.web.app
**Backend:** https://fieldmind-backend-809015144044.us-central1.run.app
**Firestore:** https://console.firebase.google.com/project/feisty-parity-416714/firestore

**Ready to test? Open the app and follow the steps above! 🚀**

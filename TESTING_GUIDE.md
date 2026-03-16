# 🧪 FIELDMIND APP TESTING GUIDE

## Complete Step-by-Step Testing with Examples

---

## 🎯 WHAT YOU'RE TESTING

FieldMind has **4 main functionalities**:

1. **Equipment Identification** (Camera + Vision AI)
2. **Voice Conversation** (Audio + Gemini Live)
3. **Manual Search** (RAG + Citations)
4. **Case Escalation** (Firestore + Pub/Sub)

---

## 📱 SETUP BEFORE TESTING

### Step 1: Open the App
- **URL:** https://feisty-parity-416714.web.app
- **Device:** Use your phone (best) or computer with webcam

### Step 2: Grant Permissions
- Allow **Camera** access
- Allow **Microphone** access

### Step 3: Verify Connection
- Top status bar should show **"LIVE"** in green
- Bottom right WiFi icon should be **green**
- If not connected, wait 5 seconds or refresh

---

## 🧪 TEST 1: EQUIPMENT IDENTIFICATION (Camera Vision)

### What It Does:
- Uses your camera to identify HVAC equipment
- Extracts make, model, serial number
- Shows equipment badge on screen

### How to Test:

**Option A: Using Real HVAC Equipment**
1. Point your camera at any HVAC unit (AC, furnace, heat pump)
2. Make sure the nameplate/label is visible
3. Wait 2-3 seconds
4. Look for equipment badge to appear on screen

**Option B: Using Images (If No Equipment Available)**
1. Open these images on another device/screen:
   - Google Image Search: "HVAC equipment nameplate"
   - Google Image Search: "Carrier AC unit label"
   - Google Image Search: "Trane furnace serial number"
2. Point your phone camera at the screen showing the image
3. Wait 2-3 seconds

### Expected Results:
✅ **SUCCESS:**
- Equipment badge appears on screen
- Shows: Make (e.g., "Carrier"), Model, Type
- Badge has confidence score
- Status changes to "ANALYZING" briefly

❌ **FAILURE:**
- No badge appears after 5 seconds
- Badge shows "Unknown" for everything
- Console shows errors

### Example Test Case:
```
SCENARIO: Identify Carrier AC Unit
1. Point camera at Carrier nameplate
2. Wait 3 seconds
3. EXPECTED: Badge shows "Carrier" + model number
4. ACTUAL: [Record what you see]
```

---

## 🧪 TEST 2: VOICE CONVERSATION (Audio + AI)

### What It Does:
- Records your voice when you press the mic button
- Sends audio to Gemini AI
- AI responds with helpful guidance
- Shows transcript on screen

### How to Test:

**Step 1: Start Recording**
1. Tap the large **microphone button** at bottom
2. Button should turn **red/active**
3. Status should change to **"LISTENING"**

**Step 2: Speak a Question**
Try these example questions:
- "Hello, can you help me troubleshoot an AC unit?"
- "What does error code E7 mean?"
- "How do I check refrigerant levels?"
- "The unit is not cooling properly, what should I check?"

**Step 3: Stop Recording**
1. Tap the mic button again to stop
2. Wait 2-3 seconds for AI response

### Expected Results:
✅ **SUCCESS:**
- Your speech appears in transcript (blue text)
- AI response appears in transcript (gold text)
- Status changes to "SPEAKING" when AI responds
- Audio level indicator shows bars when you speak

❌ **FAILURE:**
- No transcript appears
- Mic button doesn't change color
- No AI response after 10 seconds

### Example Test Cases:

**Test Case 1: Basic Greeting**
```
YOU SAY: "Hello FieldMind, can you hear me?"
EXPECTED AI RESPONSE: Greeting + asks what you're working on
ACTUAL: [Record response]
```

**Test Case 2: Technical Question**
```
YOU SAY: "What does error code E7 mean on a Carrier unit?"
EXPECTED AI RESPONSE: Explanation of E7 code with troubleshooting steps
ACTUAL: [Record response]
```

**Test Case 3: Barge-In (Interrupt)**
```
1. Ask a long question
2. While AI is responding, press mic and interrupt
3. EXPECTED: AI stops, listens to your new question
4. ACTUAL: [Record behavior]
```

---

## 🧪 TEST 3: MANUAL SEARCH (RAG + Citations)

### What It Does:
- Searches equipment manuals in database
- Returns relevant sections with citations
- AI uses these to answer your questions

### How to Test:

**Step 1: Ask About Specific Equipment**
```
YOU SAY: "Show me the wiring diagram for a Carrier 50XC unit"
EXPECTED: AI searches manuals and provides info with citation
```

**Step 2: Ask About Fault Codes**
```
YOU SAY: "What does fault code E7 mean?"
EXPECTED: AI provides explanation with manual citation
LOOK FOR: "[Manual: Carrier 50XC, Section X, Page Y]"
```

**Step 3: Ask for Troubleshooting Steps**
```
YOU SAY: "How do I troubleshoot low refrigerant pressure?"
EXPECTED: Step-by-step guide with manual references
```

### Expected Results:
✅ **SUCCESS:**
- AI response includes **[Manual: ...]** citations
- Citations show make, model, section, page
- Information is specific and technical

❌ **FAILURE:**
- No citations in response
- AI says "I don't have manual data"
- Generic answers without specifics

### Example Test Case:
```
SCENARIO: Search for E7 Fault Code
YOU SAY: "What is E7 fault code?"
EXPECTED RESPONSE FORMAT:
"E7 indicates low refrigerant pressure. 
[Manual: Carrier 50XC Service Manual, Section 4.2, Page 23]
Check for leaks in refrigerant lines..."

ACTUAL: [Record response]
```

---

## 🧪 TEST 4: CASE ESCALATION (Firestore + Pub/Sub)

### What It Does:
- Creates escalation case in database
- Sends notification to dispatch
- Shows confirmation modal on screen

### How to Test:

**Step 1: Trigger Escalation**
Say one of these phrases:
- "I need to escalate this case"
- "This is beyond my scope, I need help"
- "Can you escalate this to a specialist?"
- "I need to create an escalation"

**Step 2: Watch for Modal**
- Orange/red alert modal should appear
- Shows case ID (e.g., "CASE-1234567890")
- Shows severity badge
- Says "Dispatch notified"

**Step 3: Verify in Database**
1. Open: https://console.firebase.google.com/project/feisty-parity-416714/firestore
2. Look for `/cases` collection
3. Find your case ID
4. Verify data is saved

### Expected Results:
✅ **SUCCESS:**
- Modal appears within 2 seconds
- Case ID is displayed
- Modal auto-dismisses after 5 seconds
- Case appears in Firestore console
- Status changes to "ESCALATING"

❌ **FAILURE:**
- No modal appears
- AI just responds with text, no escalation
- No case in Firestore

### Example Test Case:
```
SCENARIO: Escalate Complex Issue
YOU SAY: "This unit has multiple fault codes and I need to escalate"
EXPECTED:
1. AI acknowledges escalation
2. Orange modal appears
3. Shows: "CASE-1710612345"
4. Firestore has new case record
ACTUAL: [Record what happens]
```

---

## 🎬 COMPLETE END-TO-END TEST SCENARIO

### Real-World Simulation: "Troubleshoot AC Unit"

**Step 1: Connect (30 seconds)**
1. Open app on phone
2. Verify "LIVE" status
3. Allow camera/mic permissions

**Step 2: Identify Equipment (1 minute)**
1. Point camera at HVAC unit or image
2. Wait for equipment badge
3. Note: Make, Model shown

**Step 3: Ask Initial Question (1 minute)**
1. Press mic button
2. Say: "This Carrier unit is showing error code E7, what should I check?"
3. Wait for AI response
4. Verify response includes manual citation

**Step 4: Follow-Up Question (1 minute)**
1. Press mic again
2. Say: "What's the service history for this unit?"
3. Wait for response with service records

**Step 5: Escalate (30 seconds)**
1. Say: "I found a refrigerant leak, I need to escalate this"
2. Watch for escalation modal
3. Note case ID

**Step 6: Verify Backend (1 minute)**
1. Open Firestore console
2. Check `/cases` collection
3. Verify your case exists

### Success Criteria:
- ✅ All 4 functionalities worked
- ✅ No errors in console
- ✅ Responses were relevant
- ✅ Citations appeared
- ✅ Case saved to database

---

## 🐛 TROUBLESHOOTING

### Problem: Camera Not Working
**Solution:**
- Refresh page and allow permissions again
- Check browser settings → Site permissions
- Try different browser (Chrome works best)

### Problem: Mic Not Recording
**Solution:**
- Check mic permissions in browser
- Try speaking louder
- Check audio level indicator shows bars

### Problem: No AI Response
**Solution:**
- Check status bar shows "LIVE"
- Refresh page
- Check backend: curl https://fieldmind-backend-809015144044.us-central1.run.app/health

### Problem: No Equipment Badge
**Solution:**
- Make sure nameplate is clearly visible
- Try different angle/lighting
- Wait 5 seconds (vision processing takes time)

### Problem: No Citations in Responses
**Solution:**
- This is expected if manuals aren't loaded yet
- AI will say "I don't have manual data"
- Manual search functionality is partially implemented

### Problem: Escalation Modal Doesn't Appear
**Solution:**
- Check browser console for errors (F12)
- Verify Firestore is accessible
- Try saying "escalate" more explicitly

---

## 📊 TEST RESULTS TEMPLATE

Copy this and fill it out:

```
FIELDMIND TEST RESULTS
Date: [DATE]
Tester: [YOUR NAME]
Device: [Phone/Computer]
Browser: [Chrome/Safari/etc]

TEST 1: EQUIPMENT IDENTIFICATION
Status: [ ] PASS [ ] FAIL
Notes: 

TEST 2: VOICE CONVERSATION
Status: [ ] PASS [ ] FAIL
Notes:

TEST 3: MANUAL SEARCH
Status: [ ] PASS [ ] FAIL
Notes:

TEST 4: CASE ESCALATION
Status: [ ] PASS [ ] FAIL
Notes:

OVERALL STATUS: [ ] ALL PASS [ ] SOME ISSUES [ ] MAJOR ISSUES

ISSUES FOUND:
1.
2.
3.

SCREENSHOTS/VIDEOS:
[Attach here]
```

---

## 🎥 RECORDING YOUR DEMO

### What to Record:
1. **Opening shot** (5 sec): Show app loading, status "LIVE"
2. **Equipment ID** (15 sec): Point at equipment, badge appears
3. **Voice interaction** (30 sec): Ask question, show AI response
4. **Manual citation** (15 sec): Highlight citation in transcript
5. **Escalation** (15 sec): Trigger escalation, show modal
6. **Backend proof** (20 sec): Show Firestore console with case

### Recording Tips:
- Use screen recording on phone
- Speak clearly and loudly
- Show status bar in frame
- Zoom in on important elements
- Keep it under 2 minutes

---

## ✅ QUICK CHECKLIST

Before submitting/demoing, verify:

- [ ] App loads and shows "LIVE" status
- [ ] Camera feed appears
- [ ] Mic button works and records
- [ ] AI responds to questions
- [ ] Transcript shows both sides
- [ ] Equipment badge appears (if equipment visible)
- [ ] Escalation modal works
- [ ] Case appears in Firestore
- [ ] No console errors
- [ ] Works on mobile device

---

## 🆘 NEED HELP?

If tests fail:
1. Check backend health: https://fieldmind-backend-809015144044.us-central1.run.app/health
2. Check browser console (F12) for errors
3. Try different browser/device
4. Clear browser cache and reload
5. Check Firestore console for data

**Backend URL:** https://fieldmind-backend-809015144044.us-central1.run.app
**Frontend URL:** https://feisty-parity-416714.web.app
**Firestore Console:** https://console.firebase.google.com/project/feisty-parity-416714/firestore

---

**Good luck with testing! 🚀**

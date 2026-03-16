# FieldMind — Quick Start Guide
**Copy & paste these commands to continue development**

---

## 🚀 IMMEDIATE ACTIONS (Next 30 Minutes)

### Step 1: Seed Firestore with Test Data

```bash
# Navigate to backend
cd backend

# Activate virtual environment
source venv/bin/activate

# Set Google Cloud credentials (IMPORTANT!)
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Run seeding script
python seed_firestore.py
```

**Expected Output:**
```
✅ Equipment created: UNIT-001 (Carrier 50XC-A12)
✅ Equipment created: UNIT-002 (Trane XR15)
✅ Equipment created: UNIT-003 (Lennox XC21)
✅ Service record created for UNIT-001: E7 fault code
✅ Service record created for UNIT-001: Low cooling capacity
✅ Service record created for UNIT-001: Routine maintenance
✅ Service record created for UNIT-002: Compressor not starting
✅ Service record created for UNIT-003: Blower motor noise
✅ Fault codes created for Carrier (3 codes)
✅ Fault codes created for Trane (3 codes)
✅ Fault codes created for Lennox (3 codes)
✅ Firestore seeding complete!
```

---

### Step 2: Verify Firestore Connection

```bash
# Still in backend directory with venv activated
python3 << 'EOF'
import asyncio
from firestore_client import FirestoreClient

async def test():
    print("🔍 Testing Firestore connection...")
    fs = FirestoreClient()
    
    # Test get_equipment
    equipment = await fs.get_equipment("UNIT-001")
    if equipment:
        print(f"✅ Equipment retrieved: {equipment['make']} {equipment['model']}")
    else:
        print("❌ Equipment not found")
    
    # Test get_service_history
    history = await fs.get_service_history("UNIT-001", limit=3)
    print(f"✅ Service history: {len(history)} records")
    
    # Test get_fault_codes
    codes = await fs.get_fault_codes("Carrier")
    print(f"✅ Fault codes: {len(codes)} codes")

asyncio.run(test())
EOF
```

**Expected Output:**
```
🔍 Testing Firestore connection...
✅ Equipment retrieved: Carrier 50XC-A12
✅ Service history: 3 records
✅ Fault codes: 3 codes
```

---

### Step 3: Test Vision Pipeline

```bash
# Create test script
cat > backend/test_vision_pipeline.py << 'EOF'
import asyncio
import base64
from agent import FieldMindAgent

async def test():
    print("📷 Testing vision pipeline...")
    
    # Create agent
    agent = FieldMindAgent(session_id="test-vision")
    
    # Create a simple test image (1x1 pixel JPEG)
    # In real use, you'd load an actual HVAC equipment image
    test_image_b64 = "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
    
    # Process frame
    result = await agent.process_frame(test_image_b64)
    print(f"✅ Frame processed: {result['type']}")
    print(f"   Equipment: {result['data'].get('make')} {result['data'].get('model')}")
    print(f"   Confidence: {result['data'].get('confidence')}")

asyncio.run(test())
EOF

# Run test
python backend/test_vision_pipeline.py
```

**Expected Output:**
```
📷 Testing vision pipeline...
✅ Frame processed: equipment_identified
   Equipment: None None
   Confidence: 0.0
```

---

## 🔧 VERIFY SYSTEMS ARE RUNNING

### Check Backend Server

```bash
# In a new terminal
curl -s http://localhost:8000/health | jq .
```

**Expected Output:**
```json
{
  "status": "healthy",
  "active_sessions": 0
}
```

### Check Frontend Server

```bash
# In a new terminal
curl -s http://localhost:3000 | grep -o '<title>.*</title>'
```

**Expected Output:**
```
<title>FieldMind</title>
```

### Test WebSocket Connection

```bash
# In a new terminal (requires wscat)
timeout 3 wscat -c ws://localhost:8000/ws/test-session 2>&1 || true
```

**Expected Output:**
```
Connected (press CTRL+C to quit)
< {"type":"status","data":"ready","session_id":"test-session","timestamp":...}
```

---

## 📋 VERIFICATION CHECKLIST

After running the above commands, verify:

- [ ] Firestore seeding completed successfully
- [ ] 3 equipment records created in Firestore
- [ ] 5 service records created in Firestore
- [ ] 10 fault codes created in Firestore
- [ ] Firestore connection test passed
- [ ] Equipment retrieved successfully
- [ ] Service history retrieved successfully
- [ ] Fault codes retrieved successfully
- [ ] Vision pipeline test completed
- [ ] Backend health check responding
- [ ] Frontend server responding
- [ ] WebSocket connection working

---

## 🎯 NEXT STEPS AFTER VERIFICATION

### If Everything Works ✅
1. Commit to GitHub:
   ```bash
   git add -A
   git commit -m "[Day 2] Firestore seeding and vision pipeline verification"
   git push origin main
   ```

2. Move to Day 3 tasks:
   - Download HVAC equipment manuals
   - Create manual chunking script
   - Set up Vector Search index
   - Implement escalation pipeline

### If Something Fails ❌
1. Check the logs:
   ```bash
   # Backend logs
   tail -50 backend/main.py  # Check for errors
   
   # Frontend logs
   # Open browser console (F12)
   ```

2. Verify environment variables:
   ```bash
   echo $GOOGLE_APPLICATION_CREDENTIALS
   echo $GEMINI_API_KEY
   ```

3. Check GCP Console:
   - Firestore: Collections tab
   - Pub/Sub: Topics tab
   - Cloud Storage: Buckets tab

---

## 🚨 TROUBLESHOOTING

### "GOOGLE_APPLICATION_CREDENTIALS not set"
```bash
# Download service account JSON from GCP Console
# Then set the environment variable
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Verify it's set
echo $GOOGLE_APPLICATION_CREDENTIALS
```

### "Firestore not initialized"
```bash
# Check that Firestore database exists in GCP Console
# Verify service account has "Cloud Firestore Editor" role
# Verify database is in "native mode" (not datastore mode)
```

### "Gemini API key not found"
```bash
# Check .env file
cat backend/.env | grep GEMINI_API_KEY

# If empty, add it:
echo "GEMINI_API_KEY=AIzaSyBev2cfDwmDlyrQE7rgBKh5Xy-YOgi2u5w" >> backend/.env
```

### "WebSocket connection refused"
```bash
# Check backend is running
curl http://localhost:8000/health

# If not running, start it:
cd backend && source venv/bin/activate && python -m uvicorn main:app --reload
```

---

## 📊 CURRENT STATUS

| Component | Status | Port |
|-----------|--------|------|
| Backend | ✅ Running | 8000 |
| Frontend | ✅ Running | 3000 |
| Firestore | ✅ Ready | N/A |
| Gemini API | ✅ Configured | N/A |
| WebSocket | ✅ Connected | 8000 |

---

## 💾 IMPORTANT FILES

```
backend/
├── .env                    # Gemini API key (DO NOT COMMIT)
├── main.py                 # FastAPI server
├── agent.py                # ADK agent
├── tools.py                # 4 ADK tools
├── firestore_client.py     # Firestore client
├── seed_firestore.py       # Seeding script (RUN THIS FIRST)
└── venv/                   # Virtual environment

fieldmind-pwa/
├── .env.local              # Backend URL (DO NOT COMMIT)
├── src/                    # React components
└── public/                 # PWA assets
```

---

## 🎓 USEFUL COMMANDS

```bash
# Activate virtual environment
source backend/venv/bin/activate

# Deactivate virtual environment
deactivate

# Install dependencies
pip install -r backend/requirements.txt

# Run backend tests
python backend/tests/test_agent.py

# Check Python version
python --version

# List installed packages
pip list | grep google

# View Firestore data (GCP Console)
# https://console.cloud.google.com/firestore/databases

# View Pub/Sub topics (GCP Console)
# https://console.cloud.google.com/pubsub/topics

# View Cloud Storage buckets (GCP Console)
# https://console.cloud.google.com/storage/browser
```

---

## 📞 SUPPORT

### Documentation
- `PROJECT_STATUS.md` — Detailed status report
- `NEXT_STEPS.md` — Next actions guide
- `CURRENT_STATE_SUMMARY.md` — Complete system overview
- `FIELDMIND_5DAY_ROADMAP.md` — Full 5-day plan
- `FieldMind_PRD(1).md` — Product requirements

### Quick Links
- [Gemini Live API Docs](https://ai.google.dev/gemini-api/docs/live-api)
- [Firestore Docs](https://cloud.google.com/firestore/docs)
- [GCP Console](https://console.cloud.google.com)
- [GitHub Repo](https://github.com/your-username/fieldmind-hackathon)

---

**Status: READY TO PROCEED ✅**
**Next Action: Run `python seed_firestore.py`**
**Time Estimate: 30 minutes**
**Deadline: March 16, 2026 @ 5:00 PM PT**

🚀 **Let's go!**

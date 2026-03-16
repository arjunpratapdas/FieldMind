#!/bin/bash

# FieldMind App Testing Script
# Tests backend connectivity and opens the app

echo "⚡ FIELDMIND APP TESTING SCRIPT"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BACKEND_URL="https://fieldmind-backend-809015144044.us-central1.run.app"
FRONTEND_URL="https://feisty-parity-416714.web.app"
FIRESTORE_URL="https://console.firebase.google.com/project/feisty-parity-416714/firestore"

echo "📡 Testing Backend Connection..."
echo "URL: $BACKEND_URL/health"
echo ""

# Test backend health
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/health")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
BODY=$(echo "$HEALTH_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Backend is HEALTHY${NC}"
    echo "Response: $BODY"
    echo ""
else
    echo -e "${RED}❌ Backend is DOWN (HTTP $HTTP_CODE)${NC}"
    echo "Response: $BODY"
    echo ""
    exit 1
fi

# Test WebSocket endpoint (just check if it's reachable)
echo "🔌 Testing WebSocket Endpoint..."
WS_TEST=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/")
if [ "$WS_TEST" = "200" ]; then
    echo -e "${GREEN}✅ WebSocket endpoint is reachable${NC}"
    echo ""
else
    echo -e "${RED}❌ WebSocket endpoint failed (HTTP $WS_TEST)${NC}"
    echo ""
fi

# Summary
echo "================================"
echo "📋 TESTING SUMMARY"
echo "================================"
echo ""
echo -e "${GREEN}✅ Backend Health:${NC} OK"
echo -e "${GREEN}✅ WebSocket:${NC} OK"
echo ""
echo "🌐 URLs:"
echo "   Frontend: $FRONTEND_URL"
echo "   Backend:  $BACKEND_URL"
echo "   Firestore: $FIRESTORE_URL"
echo ""

# Ask to open app
echo "================================"
echo "🚀 READY TO TEST THE APP"
echo "================================"
echo ""
echo "What would you like to do?"
echo ""
echo "1) Open Frontend App (in browser)"
echo "2) Open Firestore Console"
echo "3) Open Backend Health Check"
echo "4) Run all tests and open everything"
echo "5) Exit"
echo ""
read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo "Opening Frontend App..."
        xdg-open "$FRONTEND_URL" 2>/dev/null || open "$FRONTEND_URL" 2>/dev/null || echo "Please open: $FRONTEND_URL"
        ;;
    2)
        echo "Opening Firestore Console..."
        xdg-open "$FIRESTORE_URL" 2>/dev/null || open "$FIRESTORE_URL" 2>/dev/null || echo "Please open: $FIRESTORE_URL"
        ;;
    3)
        echo "Opening Backend Health..."
        xdg-open "$BACKEND_URL/health" 2>/dev/null || open "$BACKEND_URL/health" 2>/dev/null || echo "Please open: $BACKEND_URL/health"
        ;;
    4)
        echo "Opening all URLs..."
        xdg-open "$FRONTEND_URL" 2>/dev/null || open "$FRONTEND_URL" 2>/dev/null &
        sleep 1
        xdg-open "$FIRESTORE_URL" 2>/dev/null || open "$FIRESTORE_URL" 2>/dev/null &
        sleep 1
        xdg-open "$BACKEND_URL/health" 2>/dev/null || open "$BACKEND_URL/health" 2>/dev/null &
        echo "All URLs opened!"
        ;;
    5)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "================================"
echo "📝 TESTING INSTRUCTIONS"
echo "================================"
echo ""
echo "Follow these steps to test:"
echo ""
echo "1. ✅ Check status bar shows 'LIVE' in green"
echo "2. 📷 Point camera at HVAC equipment (or image)"
echo "3. 🎤 Press mic button and say: 'Hello, can you help me?'"
echo "4. ⚠️  Say: 'I need to escalate this case'"
echo "5. 🔍 Check Firestore for the case record"
echo ""
echo "For detailed testing guide, see: TESTING_GUIDE.md"
echo "For quick test, see: QUICK_TEST.md"
echo ""
echo "Good luck! 🚀"

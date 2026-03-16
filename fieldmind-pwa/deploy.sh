#!/bin/bash
# deploy.sh — FieldMind PWA deployment to Firebase Hosting
# Usage: chmod +x deploy.sh && ./deploy.sh [BACKEND_WSS_URL]
# Example: ./deploy.sh wss://fieldmind-backend-xxxx-uc.a.run.app/ws

set -e

BACKEND_URL=${1:-$REACT_APP_BACKEND_URL}

echo "⚡ FieldMind — Frontend Deploy"
echo "================================"

if [ -z "$BACKEND_URL" ]; then
  echo "⚠️  No backend URL provided."
  echo "   Usage: ./deploy.sh wss://your-cloud-run-url/ws"
  echo "   Falling back to .env.local value..."
else
  echo "🔗 Backend URL: $BACKEND_URL"
  # Write to .env.local so the build picks it up
  echo "REACT_APP_BACKEND_URL=$BACKEND_URL" > .env.local
  echo "✅ .env.local updated"
fi

# Install deps
echo "� Installing depelndencies..."
npm ci --silent

# Build
echo "� Building productionn bundle..."
npm run build

# Deploy to Firebase
echo "🚀 Deploying to Firebase Hosting..."
npx firebase deploy --only hosting

echo ""
echo "✅ Deploy complete!"
echo "🔗 Live at: https://feisty-parity-416714.web.app"

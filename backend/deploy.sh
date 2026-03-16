#!/bin/bash
# FieldMind Backend — Cloud Run deploy
# Usage: ./deploy.sh
# Reads GEMINI_API_KEY and SENDGRID_API_KEY from environment or prompts you.

set -e

PROJECT_ID="feisty-parity-416714"
REGION="us-central1"
SERVICE_NAME="fieldmind-backend"
REPO="fieldmind"

# ── Validate secrets ──────────────────────────────────────────────────────────
if [ -z "$GEMINI_API_KEY" ]; then
  # Try to read from .env
  if [ -f .env ]; then
    export $(grep -v '^#' .env | grep GEMINI_API_KEY | xargs)
  fi
fi

if [ -z "$SENDGRID_API_KEY" ]; then
  if [ -f .env ]; then
    export $(grep -v '^#' .env | grep SENDGRID_API_KEY | xargs)
  fi
fi

if [ -z "$DISPATCH_EMAIL" ]; then
  if [ -f .env ]; then
    export $(grep -v '^#' .env | grep DISPATCH_EMAIL | xargs)
  fi
fi

if [ -z "$GEMINI_API_KEY" ] || [ "$GEMINI_API_KEY" = "your-gemini-api-key" ]; then
  echo "❌ GEMINI_API_KEY is not set. Add it to backend/.env or export it."
  exit 1
fi

echo "⚡ FieldMind — Backend Deploy"
echo "================================"
echo "Project:  $PROJECT_ID"
echo "Region:   $REGION"
echo "Service:  $SERVICE_NAME"
echo "Gemini:   ${GEMINI_API_KEY:0:10}..."
echo ""

# ── Set project ───────────────────────────────────────────────────────────────
gcloud config set project $PROJECT_ID

# ── Ensure Artifact Registry repo exists ─────────────────────────────────────
echo "📦 Ensuring Artifact Registry repo..."
gcloud artifacts repositories create $REPO \
  --repository-format=docker \
  --location=$REGION \
  --description="FieldMind backend images" 2>/dev/null \
  || echo "   Repo already exists, continuing..."

# ── Configure Docker auth ─────────────────────────────────────────────────────
gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet

# ── Submit Cloud Build ────────────────────────────────────────────────────────
echo "🔨 Submitting Cloud Build (this takes ~5 min)..."
gcloud builds submit \
  --config cloudbuild.yaml \
  --project $PROJECT_ID \
  --substitutions="_GEMINI_API_KEY=${GEMINI_API_KEY},_SENDGRID_API_KEY=${SENDGRID_API_KEY:-placeholder},_DISPATCH_EMAIL=${DISPATCH_EMAIL:-dispatch@fieldmind.app}"

# ── Print result ──────────────────────────────────────────────────────────────
echo ""
echo "✅ Deploy complete!"
URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')
WSS_URL="${URL/https/wss}/ws"

echo "🔗 Cloud Run URL : $URL"
echo "🔗 WebSocket URL : $WSS_URL"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "NEXT: Run this to deploy frontend:"
echo "  cd ../fieldmind-pwa && ./deploy.sh $WSS_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

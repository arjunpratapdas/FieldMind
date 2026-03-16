#!/bin/bash
# Deploy Cloud Function for escalation emails
# Usage: SENDGRID_API_KEY=xxx DISPATCH_EMAIL=you@email.com ./deploy.sh

set -e

PROJECT_ID="feisty-parity-416714"
REGION="us-central1"
TOPIC="field-escalations"

echo "🚀 Deploying send-escalation-email Cloud Function..."

gcloud functions deploy send-escalation-email \
  --gen2 \
  --runtime=python311 \
  --region=$REGION \
  --source=. \
  --entry-point=send_escalation_email \
  --trigger-topic=$TOPIC \
  --set-env-vars="SENDGRID_API_KEY=${SENDGRID_API_KEY},DISPATCH_EMAIL=${DISPATCH_EMAIL},SENDGRID_FROM_EMAIL=${SENDGRID_FROM_EMAIL:-noreply@fieldmind.app}" \
  --project=$PROJECT_ID

echo "✅ Cloud Function deployed!"

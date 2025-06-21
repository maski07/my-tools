#!/bin/bash
# set -o allexport
# source .env
# set +o allexport

# Generate comma-separated list from .env
ENV_VARS=$(grep -v '^#' .env.prd | xargs | sed 's/ /,/g')

# Deploy to Cloud Run
gcloud run deploy my-tools \
  --image gcr.io/my-tools-459008/my-tools \
  --platform managed \
  --region asia-northeast1 \
  --set-env-vars "$ENV_VARS" \
  --allow-unauthenticated

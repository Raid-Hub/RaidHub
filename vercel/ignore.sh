#!/bin/bash

echo "VERCEL_GIT_PULL_REQUEST_ID: $VERCEL_GIT_PULL_REQUEST_ID"
echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"
echo "VERCEL_ENV: $VERCEL_ENV"

if [[ -n $VERCEL_GIT_PULL_REQUEST_ID || $VERCEL_GIT_COMMIT_REF == "develop" || $VERCEL_ENV == "production" ]] ; then
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1;

else
  # Don't build
  echo "🛑 - Build cancelled - open up a pull request or deploy manually to your namespace with yarn deploy"
  exit 0;
fi
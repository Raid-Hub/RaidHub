#!/bin/bash
if [[ -n $NAMESPACE ]] ; then 
  echo "Deploying local build to preview: $NAMESPACE.raidhub.app..."

  yarn prisma generate
  yarn prisma db push --accept-data-loss --skip-generate
  yarn prisma db seed

  yarn next build

elif [[ $APP_ENV == "staging" ]] ; then
  echo "Deploying to staging..."

  yarn prisma generate
  yarn prisma db push --skip-generate
  yarn prisma db seed

  yarn next build

elif [[ $VERCEL_ENV == "production" ]] ; then 
  echo "Deploying to production..."

  yarn prisma generate

  yarn next build
  
elif [[ $VERCEL_ENV == "preview" ]] ; then 
  echo "Deploying to preview..."

  yarn prisma generate
  yarn prisma db push --skip-generate
  yarn prisma db seed

  yarn next build

else
  echo "Building local..."
  
  yarn next build
fi

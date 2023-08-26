#!/bin/bash
function seed_and_build() {

    # Run build in the background
    yarn next build &
    pid1=$!

    # Run seed in the background
    yarn prisma db seed &
    pid2=$!

    # Wait for both commands to finish
    wait $pid1
    wait $pid2
}

if [[ -n $NAMESPACE ]] ; then 
  echo "Deploying local build to preview: $NAMESPACE.raidhub.app..."

  yarn prisma generate
  yarn prisma db push --force-reset --skip-generate
  
  seed_and_build

elif [[ $APP_ENV == "staging" ]] ; then
  echo "Deploying to staging..."

  yarn prisma generate
  yarn prisma db push --accept-data-loss --skip-generate

  seed_and_build

elif [[ $VERCEL_ENV == "production" ]] ; then 
  echo "Deploying to production..."

  yarn prisma generate

  yarn next build
  
elif [[ $VERCEL_ENV == "preview" ]] ; then 
  echo "Deploying to preview..."

  yarn prisma generate
  yarn prisma db push --skip-generate

  seed_and_build

else
  echo "Building local..."
  
  yarn next build
fi

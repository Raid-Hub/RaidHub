#!/bin/bash

if [[ $VERCEL_ENV == "production" ]] ; then 
  echo "Deploying to beta production..."

  echo y | yarn db:update
  yarn next build
elif [[ $VERCEL_GIT_COMMIT_REF != "develop"  ]] ; then 
  echo "Deploying to preview..."

  if [[  $DATABASE_URL ]] ; then
    # push the prisma schema to the new database and seed
    echo y | yarn db:update && yarn db:seed
    
    yarn next build

  else
    echo "Please set the DATABASE_URL for this deployment"
    exit 1
  fi
else 
    echo "Deploying to staging..."
    # Set the name of the branches
    organization="raidhub"
    database="app"
    production_branch="main"
    develop_branch="staging"

    # Delete the develop branch
    curl --request DELETE \
        --url https://api.planetscale.com/v1/organizations/$organization/databases/$database/branches/$develop_branch \
        --header "Authorization: $PLANETSCALE_TOKEN"

    # create the new branch
    curl --request POST \
        --url https://api.planetscale.com/v1/organizations/$organization/databases/$database/branches \
        --header "Authorization: $PLANETSCALE_TOKEN" \
        --header 'accept: application/json' \
        --header 'content-type: application/json' \
        --data "
    {
        "name": "$develop_branch",
        "parent_branch": "$production_branch"
    }
    "

    # apply the new prisma schema
    echo y | yarn db:update
    yarn next build
fi

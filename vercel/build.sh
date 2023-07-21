#!/bin/bash
if [[ -n $NAMESPACE ]] ; then 
  echo "Deploying local build to preview: $namespace.raidhub.app..."

  yarn prisma db push --accept-data-loss && yarn db:seed
  yarn next build

elif [[ $VERCEL_ENV == "production" ]] ; then 
  echo "Deploying to beta production..."

  yarn db:update
  yarn next build

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
    yarn db:update

    yarn next build
fi

#!/bin/bash
if [[ -n $NAMESPACE ]] ; then 
  echo "Deploying local build to preview: $NAMESPACE.raidhub.app..."

  yarn prisma generate
  yarn prisma db push --accept-data-loss
  yarn db:seed
  yarn next build

elif [[ $APP_ENV == "staging" ]] ; then
    echo "Deploying to staging..."
    # TODO: flow to pull main db to staging db
    # organization="raidhub"
    # database="app"
    # production_branch="main"
    # develop_branch="staging"
    # curl --request DELETE \
    #     --url https://api.planetscale.com/v1/organizations/$organization/databases/$database/branches/$develop_branch \
    #     --header "Authorization: $PLANETSCALE_TOKEN"

    # # create the new branch
    # curl --request POST \
    #     --url https://api.planetscale.com/v1/organizations/$organization/databases/$database/branches \
    #     --header "Authorization: $PLANETSCALE_TOKEN" \
    #     --header 'accept: application/json' \
    #     --header 'content-type: application/json' \
    #     --data "
    # {
    #     "name": "$develop_branch",
    #     "parent_branch": "$production_branch"
    # }
    # "

    # apply the new prisma schema
    yarn db:update

    yarn next build

elif [[ $VERCEL_ENV == "production" ]] ; then 
  echo "Deploying to production..."

  yarn prisma generate
  yarn db:update
  yarn next build
  
elif [[ $VERCEL_ENV == "preview" ]] ; then 
  echo "Deploying to preview..."

  yarn db:update
  yarn next build

else
  echo "Building local..."
  yarn next build
fi

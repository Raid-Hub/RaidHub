#!/bin/bash

if [ -n "$1" ]; then
    namespace="$1"

    read -p "Deploy to $namespace.raidhub.app (y/n)? " CONT
    if [ "$CONT" != "y" ]; then
        exit 1
    fi
else 
    echo "No namespace provided, deploying to generic branch. Use 'yarn deploy [namespace]' to deploy to your namespace"
fi

# Run the vercel command with environment variables
export APP_ENV=preview
vercel_build_command="vercel build"
vercel_deploy_command="vercel deploy --prebuilt -e APP_ENV=preview"
if [ -f .env.preview ]; then
    cp ./.env.preview .vercel/.env.preview.local
    
    while IFS= read -r line; do
        trimmed_line=$(echo "$line" | awk '{$1=$1};1')  # Remove leading/trailing spaces
        if [ -n "$trimmed_line" ] && [ "${trimmed_line:0:1}" != "#" ]; then
            key=$(echo $trimmed_line | cut -d'=' -f1)
            value=$(echo $trimmed_line | cut -d'=' -f2- | sed 's/^"\(.*\)"$/\1/')
            if [ $key == "VERCEL_ACCESS_TOKEN" ]; then
                token=$value
            else
                vercel_deploy_command+=" -e $key=$value"
            fi
        fi
    done < .env.preview
    vercel_deploy_command+=" --token=$token"
fi

if [ -z $namespace ]; then
    eval $vercel_build_command
    eval $vercel_deploy_command
else 
    export NAMESPACE=$namespace
    vercel_deploy_command+=" -e NEXTAUTH_URL=https://$namespace.raidhub.app"

    eval $vercel_build_command
    url="$(eval $vercel_deploy_command)"

    vercel alias set $url $namespace.raidhub.app --scope "raid-hub" --token=$token
fi

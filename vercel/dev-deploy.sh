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
vercel_command="deploy --force -e APP_ENV=preview"
if [ -f .env.preview ]; then
    while IFS= read -r line; do
        trimmed_line=$(echo "$line" | awk '{$1=$1};1')  # Remove leading/trailing spaces
        if [ -n "$trimmed_line" ] && [ "${trimmed_line:0:1}" != "#" ]; then
            key=$(echo $trimmed_line | cut -d'=' -f1)
            value=$(echo $trimmed_line | cut -d'=' -f2- | sed 's/^"\(.*\)"$/\1/')
            if [ $key == "VERCEL_ACCESS_TOKEN" ]; then
                token=$value
            elif [[ $key == "DATABASE_URL" || $key == "BUNGIE_API_KEY" ]]; then
                # these values need to be inserted at build time and run time
                vercel_command+=" -b $key=$value"
                vercel_command+=" -e $key=$value"
            else
                vercel_command+=" -e $key=$value"
            fi
        fi
    done < .env.preview
    vercel_command+=" --token=$token"
fi

if [ -z $namespace ]; then
    vercel $vercel_command
else 
    vercel_command+=" -b NAMESPACE=$namespace"
    vercel_command+=" -e NEXTAUTH_URL=https://$namespace.raidhub.app"

    url="$(vercel $vercel_command)"

    vercel alias set $url $namespace.raidhub.app --scope "raid-hub" --token=$token
fi

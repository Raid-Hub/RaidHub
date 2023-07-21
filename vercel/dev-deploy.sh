#!/bin/bash

# Check if the .env.deployment file exists
if [ ! -f .env.deployment ]; then
    echo "Please create a .env.deployment file in the root directory"
    exit 1
fi

namespace=""
if [ -n "$1" ]; then
    namespace="$1"
elif [ -n "$NAMESPACE" ]; then
    namespace="$NAMESPACE"
else 
    echo "No namespace provided. Use 'yarn deploy [namespace]'"
    exit 1
fi

read -p "Deploy to $namespace.raidhub.app (y/n)? " CONT
if [ "$CONT" != "y" ]; then
  exit 1
fi

# Run the vercel command with environment variables
vercel_command="vercel -b NAMESPACE=$namespace"
while IFS= read -r line; do
    trimmed_line=$(echo "$line" | awk '{$1=$1};1')  # Remove leading/trailing spaces
    if [ -n "$trimmed_line" ] && [ "${trimmed_line:0:1}" != "#" ]; then
        key=$(echo "$trimmed_line" | cut -d'=' -f1)
        value=$(echo "$trimmed_line" | cut -d'=' -f2-)
        vercel_command+=" --env $key=$value"
        if [ $key == DATABASE_URL ]; then
            vercel_command+=" -b $key=$value"
        fi
    fi
done < .env.deployment

url="$(eval "$vercel_command")"
vercel alias set $url $namespace.raidhub.app

#!/bin/bash

# Check if the .env.deployment file exists
if [ ! -f .env.deployment ]; then
    echo "Please create a .env.deployment file in the root directory"
    exit 1
fi

namespace=""
if [ -n "$NAMESPACE" ]; then
    echo x
     namespace="$NAMESPACE"
else 
    namespace="$USER"
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

#!/bin/bash

# Check if the .env.deployment file exists
if [ ! -f .env.deployment ]; then
    echo "Please create a .env.deployment file in the root directory"
    exit 1
fi

# Run the vercel command with environment variables
vercel_command="vercel -b LOCAL_DEPLOY=true"
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

eval "$vercel_command"

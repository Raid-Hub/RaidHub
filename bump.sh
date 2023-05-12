#!/bin/bash

# Read current version number from package.json
VERSION=$(cat package.json | grep version | awk -F'"' '{print $4}')

# Split the version into an array using the dot as a delimiter
VERSION_ARRAY=(${VERSION//./ })

# Get the first three numbers in the version
YEAR=${VERSION_ARRAY[0]}
MONTH=${VERSION_ARRAY[1]}
DAY=${VERSION_ARRAY[2]}
PATCH=${VERSION_ARRAY[3]}

# Get the current year, month, and day
CURRENT_YEAR=$(date +%Y)
CURRENT_MONTH=$(date +%-m)
CURRENT_DAY=$(date +%-d)

# Check if the major, minor, and patch version numbers match the current date
if [[ "$YEAR" == "$CURRENT_YEAR" && "$MONTH" == "$CURRENT_MONTH" && "$DAY" == "$CURRENT_DAY" ]]; then
  PATCH=$((PATCH+1))
else
  PATCH=0
fi

# Update version number with custom version format
UPDATED_VERSION="${CURRENT_YEAR}.${CURRENT_MONTH}.${CURRENT_DAY}.${PATCH}"

# Write updated version number back to package.json
sed -i -e "s/\"version\": \"${VERSION}\"/\"version\": \"${UPDATED_VERSION}\"/g" package.json;
sed -i -e "s/\"version\": \"${VERSION}\"/\"version\": \"${UPDATED_VERSION}\"/g" public/manifest.json;

echo $UPDATED_VERSION
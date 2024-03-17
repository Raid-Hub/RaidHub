#!/bin/bash

# Check if the schema matches the migration files
yarn prisma migrate diff --from-migrations "./prisma/migrations" --to-schema-datamodel "./prisma/schema.prisma" --exit-code 1>/dev/null
exit_code=$?

if [ $exit_code -eq 2 ]; then
    echo "Invalid migration files"
    exit 1
elif [ $exit_code -eq 1 ]; then
    echo "Error while reading migration files"
    exit 1
fi

# read applied schema from the database
response=$(curl -X POST \
  'https://$TURSO_DATABASE_NAME-raidhub.turso.io/v2/pipeline' \
  -H 'Authorization: Bearer $TURSO_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "requests": [
      { "type": "execute", "stmt": { "sql": "SELECT * FROM _migration WHERE is_applied = true" } },
      { "type": "close" }
    ]
  }')

if [ $? -ne 0 ]; then
    echo "Failed to read from database"
    exit 1
fi

files=$(find ./prisma/migrations -type d | grep -v -f <(echo $response | jq -r '.results[] | select(.response.type == "execute") | .response.result.rows[]'))

echo $files
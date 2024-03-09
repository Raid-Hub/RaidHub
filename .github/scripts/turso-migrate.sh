#!/bin/bash

# Check if the schema matches the migration files
yarn prisma migrate diff --from-migrations "./prisma/migrations" --to-schema-datamodel "./prisma/schema.prisma" --exit-code 1>/dev/null

if [ $? -eq 2 ]; then
    echo "Invalid migration files"
    exit 1
elif [ $? -eq 1 ]; then
    echo "Error while checking migration files"
    exit 1
fi

# Check if there are any changes to apply to prod
migrations=$(yarn prisma migrate status 2>/dev/null | awk '/^[0-9]{14}_/ {print $1}')

if [ -z "$(echo $migrations)" ]; then
    echo "No migration files found."
    exit 0
fi
command -v turso &> /dev/null || curl -sSfL https://get.tur.so/install.sh | bash

# Iterate over each migration file and run the turso db shell command
for file in $migrations; do
  echo "Applying migration $file..."
  turso db shell raidhub < "./prisma/migrations/$file/migration.sql"
    if [ $? -ne 0 ]; then
        echo "Failed to apply migration $file"
        exit 1
    else
        echo "Migration $file applied successfully"
    fi
done
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
schema=prisma/turso_migrations
mkdir -p ./$schema/ci/
cp ./prisma/migrations/migration_lock.toml $schema/migration_lock.toml
/home/runner/.turso/turso db shell $TURSO_DATABASE_NAME "SELECT CONCAT(sql, ';') FROM sqlite_master WHERE type='table' OR type='index' AND sql IS NOT NULL;" > $schema/tmp.sql
if [ $? -ne 0 ]; then 
    echo "Failed to read from database"
    exit 1
fi

sed '1d' $schema/tmp.sql > $schema/ci/migration.sql
rm $schema/tmp.sql

# generate the migration script
yarn prisma migrate diff --from-migrations "$schema" --to-migrations "./prisma/migrations" --script | sed '1,2d' | sed '$d'| sed '$d' > script.sql
if [ $? -ne 0 ]; then 
    echo "Failed to generate diff"
    exit 1
fi
cat script.sql

# apply the migration script
/home/runner/.turso/turso db shell $TURSO_DATABASE_NAME < script.sql
if [ $? -ne 0 ]; then
    echo "Failed to apply migration"
    exit 1
else
    echo "Migration applied successfully"
fi
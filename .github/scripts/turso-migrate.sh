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

command -v turso &> /dev/null || curl -sSfL https://get.tur.so/install.sh | bash 1>/dev/null

# read applied schema from the database
schema=prisma/turso_migrations
mkdir -p ./$schema/ci/
cp ./prisma/migrations/migration_lock.toml $schema/migration_lock.toml
turso db shell raidhub "SELECT CONCAT(sql, ';') FROM sqlite_master WHERE type='table' OR type='index' AND sql IS NOT NULL;" > $schema/tmp.sql
sed '1d' $schema/tmp.sql > $schema/ci/migration.sql
rm $schema/tmp.sql

# generate the migration script
yarn prisma migrate diff --from-migrations "$schema" --to-migrations "./prisma/migrations" --script | sed '1,2d' | sed '$d'| sed '$d' > script.sql
cat script.sql

# apply the migration script
turso db shell raidhub < script.sql
echo "Migrations applied successfully"
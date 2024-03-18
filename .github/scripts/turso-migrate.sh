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
applied_migrations_list=$(turso db shell $TURSO_DATABASE_NAME "SELECT id FROM _migration WHERE is_applied = true")

if [ $? -ne 0 ]; then
    echo "Failed to read from database"
    exit 1
fi
# apply the migrations
for dir in ./prisma/migrations/*/; do
    migration=$(basename "$dir")
    if ! grep -q "$migration" <<< "$applied_migrations_list"; then
        turso db shell $TURSO_DATABASE_NAME < $dir/migration.sql
        if [ $? -ne 0 ]; then
          echo "Failed to apply migration $migration"
          exit 1
        else
          turso db shell $TURSO_DATABASE_NAME "INSERT INTO _migration (id, is_applied) VALUES ('$migration', true) ON CONFLICT(id) DO UPDATE SET is_applied = excluded.is_applied;"
          if [ $? -ne 0 ]; then
            echo "Failed to update database"
            exit 1
          fi
          echo "Migration $migration applied successfully"
        fi
    fi
done
echo "Migrations applied successfully"

PRAGMA foreign_keys=OFF;

-- Bungie.net User
CREATE TABLE "bungie_user" (
    "bungie_membership_id" TEXT NOT NULL PRIMARY KEY,
    "primary_destiny_membership_id" TEXT,
    "email" TEXT,
    "email_verified" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL DEFAULT 'USER',
    FOREIGN KEY ("primary_destiny_membership_id") REFERENCES "destiny_profile" ("destiny_membership_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "bungie_user" ("bungie_membership_id", "created_at", "email", "email_verified", "role") SELECT "bungie_membership_id", "created_at", "email", "email_verified", "role" FROM "user";

CREATE UNIQUE INDEX "user_primary_destiny_membership_id" ON "bungie_user"("primary_destiny_membership_id");

DROP INDEX IF EXISTS "user_email_key";
CREATE UNIQUE INDEX "user_email_key" ON "bungie_user"("email");

-- Destiny Profile
CREATE TABLE "destiny_profile" (
    "destiny_membership_id" TEXT NOT NULL PRIMARY KEY,
    "destiny_membership_type" INTEGER NOT NULL,
    "bungie_membership_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "pinned_activity_id" TEXT,
    "vanity" TEXT,
    CONSTRAINT "profile_pinned_activity_id_fkey" FOREIGN KEY ("pinned_activity_id") REFERENCES "pgcr" ("instance_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "profile_bungie_membership_id_fkey" FOREIGN KEY ("bungie_membership_id") REFERENCES "bungie_user" ("bungie_membership_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "destiny_profile" ("destiny_membership_id", "destiny_membership_type", "bungie_membership_id", "image", "name", "pinned_activity_id", "vanity") 
SELECT "destiny_membership_id", "destiny_membership_type", "user"."bungie_membership_id", "image", "name", "pinned_activity_id", "vanity" FROM "profile"
JOIN "user" ON "profile"."user_id" = "user"."id";

DROP INDEX IF EXISTS "profile_bungie_membership_id_key";
CREATE UNIQUE INDEX "destiny_profile_bungie_membership_id_key" ON "destiny_profile"("bungie_membership_id");
DROP INDEX IF EXISTS "profile_vanity_key";
CREATE UNIQUE INDEX "destiny_profile_vanity_key" ON "destiny_profile"("vanity");
DROP INDEX IF EXISTS "profile_pinned_activity_id_idx";
CREATE INDEX "destiny_profile_pinned_activity_id_idx" ON "destiny_profile"("pinned_activity_id");

UPDATE "bungie_user" SET "primary_destiny_membership_id" = "destiny_profile"."destiny_membership_id"
FROM "destiny_profile" WHERE "bungie_user"."bungie_membership_id" = "destiny_profile"."bungie_membership_id";

DROP TABLE "profile";

UPDATE "account" SET "user_id" = "user"."bungie_membership_id" 
FROM "user" WHERE "account"."user_id" = "user"."id";

UPDATE "raidhub_access_token" SET "user_id" = "user"."bungie_membership_id" 
FROM "user" WHERE "raidhub_access_token"."user_id" = "user"."id";

UPDATE "session" SET "user_id" = "user"."bungie_membership_id" 
FROM "user" WHERE "session"."user_id" = "user"."id";

DROP TABLE "user";

-- Fix foreign key constraints
CREATE TABLE "new_session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bungie_membership_id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "session_bungie_bungie_membership_id_fkey" FOREIGN KEY ("bungie_membership_id") REFERENCES "bungie_user" ("bungie_membership_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_session" ("expires", "id", "session_token", "bungie_membership_id") SELECT "expires", "id", "session_token", "user_id" FROM "session";    
DROP TABLE "session";
ALTER TABLE "new_session" RENAME TO "session";
CREATE INDEX "session_bungie_membership_id_idx" ON "session"("bungie_membership_id");
CREATE UNIQUE INDEX "session_session_token_key" ON "session"("session_token");

CREATE TABLE "new_account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bungie_membership_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "display_name" TEXT,
    "url" TEXT,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "refresh_expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "account_bungie_membership_id_fkey" FOREIGN KEY ("bungie_membership_id") REFERENCES "bungie_user" ("bungie_membership_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_account" ("access_token", "display_name", "expires_at", "id", "id_token", "provider", "provider_account_id", "refresh_expires_at", "refresh_token", "scope", "session_state", "token_type", "type", "url", "bungie_membership_id") 
SELECT "access_token", "display_name", "expires_at",  "id", "id_token", "provider", "provider_account_id", "refresh_expires_at", "refresh_token", "scope", "session_state", "token_type", "type", "url", "user_id" FROM "account";
DROP TABLE "account";
ALTER TABLE "new_account" RENAME TO "account";
CREATE INDEX "account_bungie_membership_id_idx" ON "account"("bungie_membership_id");
CREATE UNIQUE INDEX "account_provider_provider_account_id_key" ON "account"("provider", "provider_account_id");
CREATE UNIQUE INDEX "account_provider_bungie_membership_id_key" ON "account"("provider", "bungie_membership_id");

CREATE TABLE "new_raidhub_access_token" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bungie_membership_id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    CONSTRAINT "raidhub_access_token_bungie_membership_id_fkey" FOREIGN KEY ("bungie_membership_id") REFERENCES "bungie_user" ("bungie_membership_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_raidhub_access_token" ("expires_at", "id", "bungie_membership_id", "value") SELECT "expires_at", "id", "user_id", "value" FROM "raidhub_access_token";
DROP TABLE "raidhub_access_token";
ALTER TABLE "new_raidhub_access_token" RENAME TO "raidhub_access_token";
CREATE UNIQUE INDEX "raidhub_access_token_bungie_membership_id_key" ON "raidhub_access_token"("bungie_membership_id");


PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

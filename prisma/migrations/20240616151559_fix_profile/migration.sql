/*
  Warnings:

  - You are about to drop the column `primary_destiny_membership_id` on the `bungie_user` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bungie_user" (
    "bungie_membership_id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "email_verified" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL DEFAULT 'USER'
);
INSERT INTO "new_bungie_user" ("bungie_membership_id", "created_at", "email", "email_verified", "role") SELECT "bungie_membership_id", "created_at", "email", "email_verified", "role" FROM "bungie_user";

CREATE TABLE "new_destiny_profile" (
    "destiny_membership_id" TEXT NOT NULL PRIMARY KEY,
    "destiny_membership_type" INTEGER NOT NULL,
    "bungie_membership_id" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "pinned_activity_id" TEXT,
    "vanity" TEXT,
    CONSTRAINT "destiny_profile_bungie_membership_id_fkey" FOREIGN KEY ("bungie_membership_id") REFERENCES "new_bungie_user" ("bungie_membership_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "destiny_profile_pinned_activity_id_fkey" FOREIGN KEY ("pinned_activity_id") REFERENCES "pgcr" ("instance_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_destiny_profile" ("bungie_membership_id", "destiny_membership_id", "destiny_membership_type", "is_primary", "image", "name", "pinned_activity_id", "vanity") 
  SELECT "bungie_membership_id", "destiny_membership_id", "destiny_membership_type", 0 AS "is_primary", "image", "name", "pinned_activity_id", "vanity"
  FROM "destiny_profile";

UPDATE "new_destiny_profile"
SET "is_primary" = 1
WHERE "destiny_membership_id" IN (
    SELECT "primary_destiny_membership_id"
    FROM "bungie_user"
    WHERE "primary_destiny_membership_id" IS NOT NULL
);

DROP TABLE "bungie_user";
ALTER TABLE "new_bungie_user" RENAME TO "bungie_user";
CREATE UNIQUE INDEX "user_email_key" ON "bungie_user"("email");

DROP TABLE "destiny_profile";
ALTER TABLE "new_destiny_profile" RENAME TO "destiny_profile";
CREATE UNIQUE INDEX "destiny_profile_vanity_key" ON "destiny_profile"("vanity");
CREATE INDEX "destiny_profile_pinned_activity_id_idx" ON "destiny_profile"("pinned_activity_id");
CREATE INDEX "destiny_profile_bungie_membership_id_idx" ON "destiny_profile"("bungie_membership_id");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

/*
  Warnings:

  - Added the required column `temp` to the `profile` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "destiny_membership_id" TEXT NOT NULL,
    "destiny_membership_type" INTEGER NOT NULL,
    "pinned_activity_id" TEXT,
    "vanity" TEXT,
    CONSTRAINT "profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "profile_pinned_activity_id_fkey" FOREIGN KEY ("pinned_activity_id") REFERENCES "pgcr" ("instance_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_profile" ("destiny_membership_id", "destiny_membership_type", "id", "image", "name", "pinned_activity_id", "user_id", "vanity") SELECT "destiny_membership_id", "destiny_membership_type", "id", "image", "name", "pinned_activity_id", "user_id", "vanity" FROM "profile";
DROP TABLE "profile";
ALTER TABLE "new_profile" RENAME TO "profile";
CREATE UNIQUE INDEX "profile_user_id_key" ON "profile"("user_id");
CREATE UNIQUE INDEX "profile_destiny_membership_id_key" ON "profile"("destiny_membership_id");
CREATE UNIQUE INDEX "profile_vanity_key" ON "profile"("vanity");
CREATE INDEX "profile_pinned_activity_id_idx" ON "profile"("pinned_activity_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_destiny_profile" (
    "destiny_membership_id" TEXT NOT NULL PRIMARY KEY,
    "destiny_membership_type" INTEGER NOT NULL,
    "bungie_membership_id" TEXT,
    "is_primary" BOOLEAN NOT NULL,
    "pinned_activity_id" TEXT,
    "vanity" TEXT,
    CONSTRAINT "destiny_profile_bungie_membership_id_fkey" FOREIGN KEY ("bungie_membership_id") REFERENCES "bungie_user" ("bungie_membership_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "destiny_profile_pinned_activity_id_fkey" FOREIGN KEY ("pinned_activity_id") REFERENCES "pgcr" ("instance_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_destiny_profile" ("bungie_membership_id", "destiny_membership_id", "destiny_membership_type", "is_primary", "pinned_activity_id", "vanity") SELECT "bungie_membership_id", "destiny_membership_id", "destiny_membership_type", "is_primary", "pinned_activity_id", "vanity" FROM "destiny_profile";
DROP TABLE "destiny_profile";
ALTER TABLE "new_destiny_profile" RENAME TO "destiny_profile";
CREATE UNIQUE INDEX "destiny_profile_vanity_key" ON "destiny_profile"("vanity");
CREATE INDEX "destiny_profile_pinned_activity_id_idx" ON "destiny_profile"("pinned_activity_id");
CREATE INDEX "destiny_profile_bungie_membership_id_idx" ON "destiny_profile"("bungie_membership_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

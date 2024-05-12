-- DropIndex
DROP INDEX IF EXISTS "destiny_profile_bungie_membership_id_key";
CREATE INDEX "destiny_profile_bungie_membership_id_idx" ON "destiny_profile"("bungie_membership_id");
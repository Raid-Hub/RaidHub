CREATE TABLE "profile" (
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
CREATE UNIQUE INDEX "profile_user_id_key" ON "profile"("user_id");
CREATE UNIQUE INDEX "profile_destiny_membership_id_key" ON "profile"("destiny_membership_id");
CREATE UNIQUE INDEX "profile_vanity_key" ON "profile"("vanity");
CREATE INDEX "profile_pinned_activity_id_idx" ON "profile"("pinned_activity_id");

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bungie_membership_id" TEXT NOT NULL,
    "email" TEXT,
    "email_verified" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT CHECK ("role" IN ('USER','ADMIN')) NOT NULL DEFAULT 'USER'
);
CREATE UNIQUE INDEX "user_bungie_membership_id_key" ON "user"("bungie_membership_id");
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "session_user_id_idx" ON "session"("user_id");
CREATE UNIQUE INDEX "session_session_token_key" ON "session"("session_token");

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
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
    CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "account_user_id_idx" ON "account"("user_id");
CREATE UNIQUE INDEX "account_provider_provider_account_id_key" ON "account"("provider", "provider_account_id");
CREATE UNIQUE INDEX "account_provider_user_id_key" ON "account"("provider", "user_id");

-- CreateTable
CREATE TABLE "raidhub_access_token" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    CONSTRAINT "raidhub_access_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "raidhub_access_token_user_id_key" ON "raidhub_access_token"("user_id");

-- CreateTable
CREATE TABLE "pgcr" (
    "instance_id" TEXT NOT NULL PRIMARY KEY,
    "video_url" TEXT
);


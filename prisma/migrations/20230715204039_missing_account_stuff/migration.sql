-- AlterTable
ALTER TABLE `Account` ADD COLUMN `access_token` TEXT NULL,
    ADD COLUMN `expires_at` INTEGER NULL,
    ADD COLUMN `refresh_token` TEXT NULL;

-- AlterTable
ALTER TABLE `Session` MODIFY `access_token` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `refresh_token` TEXT NOT NULL;

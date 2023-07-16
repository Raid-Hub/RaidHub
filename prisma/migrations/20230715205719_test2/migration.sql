-- AlterTable
ALTER TABLE `Session` ADD COLUMN `access_expires_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `access_token` TEXT NULL;

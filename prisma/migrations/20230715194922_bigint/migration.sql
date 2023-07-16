-- AlterTable
ALTER TABLE `Account` MODIFY `access_expires_at` BIGINT NULL DEFAULT 0,
    MODIFY `refresh_expires_at` BIGINT NULL DEFAULT 0;

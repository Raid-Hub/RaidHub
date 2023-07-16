-- AlterTable
ALTER TABLE `Session` MODIFY `access_token` VARCHAR(511) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `refresh_token` VARCHAR(511) NOT NULL;

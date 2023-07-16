/*
  Warnings:

  - You are about to drop the column `access_expires_at` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `access_token` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `membership_id` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_expires_at` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `membershipType` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,destinyMembershipType]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `access_token` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinyMembershipType` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refresh_token` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Account_membership_id_key` ON `Account`;

-- DropIndex
DROP INDEX `User_email_key` ON `User`;

-- AlterTable
ALTER TABLE `Account` DROP COLUMN `access_expires_at`,
    DROP COLUMN `access_token`,
    DROP COLUMN `membership_id`,
    DROP COLUMN `refresh_expires_at`,
    DROP COLUMN `refresh_token`,
    ADD COLUMN `scope` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Session` ADD COLUMN `access_expires_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `access_token` VARCHAR(191) NOT NULL,
    MODIFY `expires` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `User` DROP COLUMN `email`,
    DROP COLUMN `emailVerified`,
    DROP COLUMN `membershipType`,
    ADD COLUMN `destinyMembershipType` INTEGER NOT NULL,
    ADD COLUMN `refresh_expires_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `refresh_token` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_id_destinyMembershipType_key` ON `User`(`id`, `destinyMembershipType`);

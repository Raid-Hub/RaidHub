/*
  Warnings:

  - You are about to drop the column `expires_at` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_expires_in` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[membership_id]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Account` DROP COLUMN `expires_at`,
    DROP COLUMN `refresh_expires_in`,
    ADD COLUMN `access_expires_at` INTEGER NULL DEFAULT 0,
    ADD COLUMN `refresh_expires_at` INTEGER NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `emailVerified`;

-- CreateIndex
CREATE UNIQUE INDEX `Account_membership_id_key` ON `Account`(`membership_id`);

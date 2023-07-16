/*
  Warnings:

  - Added the required column `membership_id` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Account` ADD COLUMN `membership_id` VARCHAR(191) NOT NULL;

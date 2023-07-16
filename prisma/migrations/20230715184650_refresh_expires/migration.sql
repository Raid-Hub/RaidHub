/*
  Warnings:

  - You are about to drop the column `scope` on the `Account` table. All the data in the column will be lost.
  - Added the required column `refresh_expires_in` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Account` DROP COLUMN `scope`,
    ADD COLUMN `refresh_expires_in` INTEGER NOT NULL;

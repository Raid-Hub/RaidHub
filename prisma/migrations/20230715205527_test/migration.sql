/*
  Warnings:

  - You are about to drop the column `access_expires_at` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `access_token` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Session` DROP COLUMN `access_expires_at`,
    DROP COLUMN `access_token`;

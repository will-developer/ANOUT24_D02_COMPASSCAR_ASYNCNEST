/*
  Warnings:

  - You are about to drop the column `inativatedAt` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `client` DROP COLUMN `inativatedAt`,
    ADD COLUMN `inactivatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `deletedAt`,
    ADD COLUMN `inactivatedAt` DATETIME(3) NULL;

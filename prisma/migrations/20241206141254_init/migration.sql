/*
  Warnings:

  - You are about to drop the column `userId` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `client` DROP FOREIGN KEY `client_userId_fkey`;

-- AlterTable
ALTER TABLE `client` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `deletedAt`,
    ADD COLUMN `inativedAt` DATETIME(3) NULL;

/*
  Warnings:

  - You are about to drop the column `inativatedAt` on the `car` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `car` DROP COLUMN `inativatedAt`,
    ADD COLUMN `inactivatedAt` DATETIME(3) NULL;

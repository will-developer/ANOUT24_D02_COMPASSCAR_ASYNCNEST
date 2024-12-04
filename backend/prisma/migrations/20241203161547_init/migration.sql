/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `order` table. All the data in the column will be lost.
  - Added the required column `statusOrder` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `deletedAt`,
    DROP COLUMN `status`,
    ADD COLUMN `canceledAt` DATETIME(3) NULL,
    ADD COLUMN `statusOrder` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `password` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `car_item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `carId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `car_item` ADD CONSTRAINT `car_item_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `car`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

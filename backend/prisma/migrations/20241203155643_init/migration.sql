/*
  Warnings:

  - You are about to drop the column `createdById` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `user` table. All the data in the column will be lost.
  - Added the required column `userId` to the `client` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `client` DROP FOREIGN KEY `client_createdById_fkey`;

-- AlterTable
ALTER TABLE `client` DROP COLUMN `createdById`,
    DROP COLUMN `isActive`,
    ADD COLUMN `inativatedAt` DATETIME(3) NULL,
    ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `isActive`,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `car` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `brand` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `plate` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `km` INTEGER NOT NULL,
    `dailyPrice` DOUBLE NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `inativatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `car_plate_key`(`plate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `cep` VARCHAR(191) NOT NULL,
    `uf` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `rentalFee` DOUBLE NOT NULL,
    `totalAmount` DOUBLE NOT NULL,
    `closeDate` DATETIME(3) NULL,
    `lateFee` DOUBLE NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `clientId` INTEGER NOT NULL,
    `carId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `client` ADD CONSTRAINT `client_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `car`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

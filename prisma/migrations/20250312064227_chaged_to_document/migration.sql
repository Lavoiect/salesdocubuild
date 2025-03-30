/*
  Warnings:

  - You are about to drop the column `funnelId` on the `ClassName` table. All the data in the column will be lost.
  - You are about to drop the `Funnel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FunnelPage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `documentId` to the `ClassName` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `ClassName_funnelId_idx` ON `ClassName`;

-- AlterTable
ALTER TABLE `ClassName` DROP COLUMN `funnelId`,
    ADD COLUMN `documentId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Funnel`;

-- DropTable
DROP TABLE `FunnelPage`;

-- CreateTable
CREATE TABLE `Document` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `subDomainName` VARCHAR(191) NULL,
    `favicon` TEXT NULL,
    `agencyId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Document_subDomainName_key`(`subDomainName`),
    INDEX `Document_agencyId_idx`(`agencyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DocumentPage` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `pathName` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `visits` INTEGER NOT NULL DEFAULT 0,
    `content` LONGTEXT NULL,
    `order` INTEGER NOT NULL,
    `previewImage` TEXT NULL,
    `documentId` VARCHAR(191) NOT NULL,

    INDEX `DocumentPage_documentId_idx`(`documentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `ClassName_documentId_idx` ON `ClassName`(`documentId`);

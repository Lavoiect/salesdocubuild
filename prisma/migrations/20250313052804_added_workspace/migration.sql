-- AlterTable
ALTER TABLE `ClassName` ADD COLUMN `workspaceId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Workspace` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `subDomainName` VARCHAR(191) NULL,
    `favicon` TEXT NULL,
    `agencyId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Workspace_subDomainName_key`(`subDomainName`),
    INDEX `Workspace_agencyId_idx`(`agencyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `ClassName_workspaceId_idx` ON `ClassName`(`workspaceId`);

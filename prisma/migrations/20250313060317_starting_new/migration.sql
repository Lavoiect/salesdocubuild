/*
  Warnings:

  - You are about to drop the column `agencyId` on the `Document` table. All the data in the column will be lost.
  - Added the required column `workspaceId` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Document_agencyId_idx` ON `Document`;

-- AlterTable
ALTER TABLE `Document` DROP COLUMN `agencyId`,
    ADD COLUMN `workspaceId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Document_workspaceId_idx` ON `Document`(`workspaceId`);

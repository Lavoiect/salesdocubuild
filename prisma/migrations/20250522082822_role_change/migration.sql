/*
  Warnings:

  - The values [SUPER_ADMIN] on the enum `Invitation_role` will be removed. If these variants are still used in the database, this will fail.
  - The values [SUPER_ADMIN] on the enum `Invitation_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Invitation` MODIFY `role` ENUM('OWNER', 'ADMIN', 'USER', 'GUEST') NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('OWNER', 'ADMIN', 'USER', 'GUEST') NOT NULL DEFAULT 'USER';

/*
  Warnings:

  - You are about to alter the column `role` on the `Invitation` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `Enum(EnumId(3))`.
  - You are about to alter the column `role` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `Invitation` MODIFY `role` ENUM('SUPER_ADMIN', 'ADMIN', 'USER', 'GUEST') NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('SUPER_ADMIN', 'ADMIN', 'USER', 'GUEST') NOT NULL DEFAULT 'USER';

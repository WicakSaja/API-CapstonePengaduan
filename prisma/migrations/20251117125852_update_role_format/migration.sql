/*
  Warnings:

  - You are about to alter the column `role` on the `admin` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `admin` MODIFY `role` ENUM('admin', 'master_admin') NOT NULL DEFAULT 'admin';

/*
  Warnings:

  - You are about to alter the column `status` on the `pengaduan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `admin` MODIFY `role` ENUM('admin', 'master_admin', 'pimpinan') NOT NULL DEFAULT 'admin';

-- AlterTable
ALTER TABLE `pengaduan` MODIFY `status` ENUM('BARU', 'DITERIMA', 'DITOLAK', 'DILAKSANAKAN') NOT NULL DEFAULT 'BARU';

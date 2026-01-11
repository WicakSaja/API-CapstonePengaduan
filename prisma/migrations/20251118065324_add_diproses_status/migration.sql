-- AlterTable
ALTER TABLE `pengaduan` MODIFY `status` ENUM('pending', 'diterima', 'diproses', 'ditolak', 'dilaksanakan') NOT NULL DEFAULT 'pending';

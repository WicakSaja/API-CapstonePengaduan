-- AlterTable
ALTER TABLE `pengaduan` MODIFY `status` ENUM('pending', 'diterima', 'diproses', 'ditolak', 'dilaksanakan', 'selesai') NOT NULL DEFAULT 'pending';

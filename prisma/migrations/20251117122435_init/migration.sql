-- DropForeignKey
ALTER TABLE `lampiran` DROP FOREIGN KEY `Lampiran_pengaduanId_fkey`;

-- DropForeignKey
ALTER TABLE `pengaduan` DROP FOREIGN KEY `Pengaduan_kategoriId_fkey`;

-- DropForeignKey
ALTER TABLE `pengaduan` DROP FOREIGN KEY `Pengaduan_userId_fkey`;

-- AddForeignKey
ALTER TABLE `lampiran` ADD CONSTRAINT `lampiran_pengaduanId_fkey` FOREIGN KEY (`pengaduanId`) REFERENCES `pengaduan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengaduan` ADD CONSTRAINT `pengaduan_kategoriId_fkey` FOREIGN KEY (`kategoriId`) REFERENCES `kategori`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengaduan` ADD CONSTRAINT `pengaduan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pengumuman` ADD CONSTRAINT `Pengumuman_dibuatOleh_fkey` FOREIGN KEY (`dibuatOleh`) REFERENCES `admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `admin` RENAME INDEX `Admin_username_key` TO `admin_username_key`;

-- RenameIndex
ALTER TABLE `kategori` RENAME INDEX `Kategori_nama_kategori_key` TO `kategori_nama_kategori_key`;

-- RenameIndex
ALTER TABLE `lampiran` RENAME INDEX `Lampiran_pengaduanId_fkey` TO `lampiran_pengaduanId_idx`;

-- RenameIndex
ALTER TABLE `pengaduan` RENAME INDEX `Pengaduan_kategoriId_fkey` TO `pengaduan_kategoriId_idx`;

-- RenameIndex
ALTER TABLE `pengaduan` RENAME INDEX `Pengaduan_userId_fkey` TO `pengaduan_userId_idx`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_nik_key` TO `user_nik_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_username_key` TO `user_username_key`;

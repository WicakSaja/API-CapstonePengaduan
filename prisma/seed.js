import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  // Hash password untuk master admin
  const hashedPassword = await bcrypt.hash('masteradmin123', 10);

  // Buat atau update master admin
  const masterAdmin = await prisma.admin.upsert({
    where: { username: 'masteradmin' },
    update: {},
    create: {
      nama_lengkap: 'Master Administrator',
      username: 'masteradmin',
      password: hashedPassword,
      role: 'master_admin',
    },
  });

  console.log('✅ Master Admin created:', masterAdmin);

  // Optional: Buat admin biasa untuk testing
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  
  const adminBiasa = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      nama_lengkap: 'Admin Biasa',
      username: 'admin',
      password: hashedAdminPassword,
      role: 'admin',
    },
  });

  console.log('✅ Admin Biasa created:', adminBiasa);

  // Optional: Buat pimpinan untuk testing
  const hashedPimpinanPassword = await bcrypt.hash('pimpinan123', 10);
  
  const pimpinan = await prisma.admin.upsert({
    where: { username: 'pimpinan' },
    update: {},
    create: {
      nama_lengkap: 'Pimpinan',
      username: 'pimpinan',
      password: hashedPimpinanPassword,
      role: 'pimpinan',
    },
  });

  console.log('✅ Pimpinan created:', pimpinan);

  // Seeder untuk kategori pengaduan
  console.log('\n📋 Seeding kategori pengaduan...');

  const kategoriData = [
    {
      nama_kategori: 'Jalan Rusak',
      deskripsi: 'Laporan terkait kerusakan jalan, jalan berlubang, atau infrastruktur jalan lainnya',
    },
    {
      nama_kategori: 'Infrastruktur Desa',
      deskripsi: 'Laporan terkait pembangunan dan perbaikan infrastruktur desa seperti jembatan, drainase, dan fasilitas umum',
    },
    {
      nama_kategori: 'Kejahatan',
      deskripsi: 'Laporan terkait tindak kriminal, pencurian, perampokan, atau gangguan keamanan',
    },
    {
      nama_kategori: 'Konflik',
      deskripsi: 'Laporan terkait konflik sosial, perselisihan warga, atau masalah kemasyarakatan',
    },
    {
      nama_kategori: 'Bantuan Masyarakat',
      deskripsi: 'Permohonan bantuan untuk masyarakat yang membutuhkan',
    },
    {
      nama_kategori: 'Kebersihan Lingkungan',
      deskripsi: 'Laporan terkait sampah, kebersihan, dan pemeliharaan lingkungan',
    },
    {
      nama_kategori: 'Fasilitas Umum',
      deskripsi: 'Laporan terkait kondisi fasilitas umum seperti taman, lapangan, balai desa',
    },
    {
      nama_kategori: 'Pelayanan Publik',
      deskripsi: 'Laporan terkait kualitas pelayanan publik dan administrasi pemerintahan',
    },
    {
      nama_kategori: 'Kesehatan',
      deskripsi: 'Laporan terkait kesehatan masyarakat, sanitasi, dan layanan kesehatan',
    },
    {
      nama_kategori: 'Lainnya',
      deskripsi: 'Laporan lainnya yang tidak termasuk dalam kategori di atas',
    },
  ];

  for (const kategori of kategoriData) {
    const createdKategori = await prisma.kategori.upsert({
      where: { nama_kategori: kategori.nama_kategori },
      update: {
        deskripsi: kategori.deskripsi,
      },
      create: kategori,
    });
    console.log(`✅ Kategori created: ${createdKategori.nama_kategori}`);
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

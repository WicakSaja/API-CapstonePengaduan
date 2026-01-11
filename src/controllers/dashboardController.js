import prisma from '../utils/prisma.js';
export const getStatistics = async (req, res) => {
  try {
    const role = req.user.role;

    const roleFilter = {};
    if (role === 'pimpinan') {
      roleFilter.status = {
        in: ['diterima', 'diproses', 'dilaksanakan'],
      };
    }

    const total = await prisma.pengaduan.count({});

  
    const pending = await prisma.pengaduan.count({
      where: { AND: [{ status: 'pending' }, roleFilter] },
    });

    const diterima = await prisma.pengaduan.count({
      where: { AND: [{ status: 'diterima' }, roleFilter] },
    });
    
    const diproses = await prisma.pengaduan.count({
      where: { AND: [{ status: 'diproses' }, roleFilter] },
    });


    const dilaksanakan = await prisma.pengaduan.count({
      where: { AND: [{ status: 'dilaksanakan' }, roleFilter] },
    });

    const ditolak = await prisma.pengaduan.count({
      where: { AND: [{ status: 'ditolak' }, roleFilter] },
    });

    const prosesGabungan = diterima + diproses;

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil statistik pengaduan',
      data: {
        total: total,
        pending: pending,
        proses: prosesGabungan, // Kirim gabungan
        selesai: dilaksanakan, // Kirim 'dilaksanakan'
        ditolak: ditolak,
      },
    });
  } catch (error) {
    console.error('Statistik Laporan Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat statistik pengaduan',
      error: error.message,
    });
  }
};

export const getSystemStatistics = async (req, res) => {
  try {
    const total_users = await prisma.user.count();
    const total_pengaduan = await prisma.pengaduan.count();
    const active_admins = await prisma.admin.count();

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil statistik sistem',
      data: { total_users, total_pengaduan, active_admins },
    });
  } catch (error) {
    console.error('System Statistics Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat statistik sistem',
      error: error.message,
    });
  }
};

export default {
  getStatistics,
  getSystemStatistics,
};
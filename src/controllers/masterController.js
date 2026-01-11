import prisma from '../utils/prisma.js';

/**
 * 🔥 Statistik Sistem → dipakai oleh Master Admin Dashboard
 */
export const getStatistikSistem = async (req, res) => {
  try {
    const total_users = await prisma.user.count();
    const total_pengaduan = await prisma.pengaduan.count();
    const active_admins = await prisma.admin.count();

    res.status(200).json({
      message: "Berhasil mengambil statistik sistem",
      data: {
        total_users,
        total_pengaduan,
        active_admins,
      },
    });
  } catch (error) {
    console.error("Statistik Sistem Error:", error);
    res.status(500).json({
      message: "Gagal memuat statistik sistem",
      error: error.message,
    });
  }
};


/**
 * Statistik Pengaduan
 */
export const getStatistikPengaduan = async (req, res) => {
  try {
    const total = await prisma.pengaduan.count();
    const pending = await prisma.pengaduan.count({ where: { status: "pending" } });
    const proses = await prisma.pengaduan.count({ where: { status: "proses" } });
    const selesai = await prisma.pengaduan.count({ where: { status: "selesai" } });
    const ditolak = await prisma.pengaduan.count({ where: { status: "ditolak" } });

    res.status(200).json({
      message: "Berhasil mengambil statistik pengaduan",
      data: { total, pending, proses, selesai, ditolak },
    });
  } catch (error) {
    console.error("Statistik Pengaduan Error:", error);
    res.status(500).json({
      message: "Gagal memuat statistik pengaduan",
      error: error.message,
    });
  }
};


/**
 * Daftar admin
 */
export const getDaftarAdmin = async (req, res) => {
  try {
    const admins = await prisma.admin.findMany();

    res.status(200).json({
      message: "Berhasil mengambil daftar admin",
      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil daftar admin",
      error: error.message,
    });
  }
};


/**
 * Daftar Users
 */
export const getDaftarUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json({
      message: "Berhasil mengambil daftar pengguna",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil daftar pengguna",
      error: error.message,
    });
  }
};


/**
 * Semua pengaduan
 */
export const getSemuaPengaduan = async (req, res) => {
  try {
    const semuaPengaduan = await prisma.pengaduan.findMany({
      include: { kategori: true, user: true },
    });

    res.status(200).json({
      message: "Berhasil mengambil semua pengaduan",
      data: semuaPengaduan,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil pengaduan",
      error: error.message,
    });
  }
};

export default {
  getStatistikSistem,
  getStatistikPengaduan,
  getDaftarAdmin,
  getDaftarUsers,
  getSemuaPengaduan
};

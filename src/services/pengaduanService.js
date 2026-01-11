import prisma from '../utils/prisma.js';
import { ErrorResponse } from '../utils/responseHelper.js';

// =============================
// 1. CREATE PENGADUAN
// =============================
export const createPengaduan = async (data, userId) => {
  try {
    const payload = {
      kategoriId: Number(data.kategori_id || data.kategoriId),
      judul: data.judul,
      deskripsi: data.deskripsi || data.isi || '',
      lokasi: data.lokasi || '',
      status: 'pending',
      userId: userId ? Number(userId) : null
    };

    const pengaduan = await prisma.pengaduan.create({
      data: payload
    });

    return pengaduan;
  } catch (error) {
    throw new ErrorResponse('Failed to create complaint', 500, error);
  }
};

// =============================
// 2. GET PENGADUAN MILIK USER
// =============================
export const getPengaduanByUser = async (userId) => {
  try {
    const list = await prisma.pengaduan.findMany({
      where: { userId: Number(userId) },
      include: {
        lampiran: true,        // <-- WAJIB supaya gambar muncul
        kategori: true         // opsional, buat tampilan kategori
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return list;
  } catch (error) {
    throw new ErrorResponse('Failed to retrieve complaints', 500, error);
  }
};

// =============================
// 3. GET DETAIL PENGADUAN
// =============================
export const getPengaduanDetails = async (id, userId) => {
  try {
    const pengaduan = await prisma.pengaduan.findUnique({
      where: { id: Number(id) },
      include: {
        lampiran: true,     // <-- supaya gambar muncul di halaman detail
        kategori: true
      }
    });

    if (!pengaduan) {
      throw new ErrorResponse('Complaint not found', 404);
    }

    // validasi hak akses user
    if (pengaduan.userId && pengaduan.userId !== Number(userId)) {
      throw new ErrorResponse('Access denied', 403);
    }

    return pengaduan;
  } catch (error) {
    throw new ErrorResponse('Failed to retrieve complaint details', 500, error);
  }
};

export default {
  createPengaduan,
  getPengaduanByUser,
  getPengaduanDetails
};

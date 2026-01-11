import prisma from "../utils/prisma.js";
import path from "path";
import fs from "fs";

export const createPengaduan = async (req, res) => {
  try {
    const userId = req.user.id;

    const { kategori_id, judul, deskripsi, lokasi } = req.body;

    if (!kategori_id) {
      return res.status(400).json({
        success: false,
        message: "kategori_id wajib dikirim",
      });
    }

    const pengaduan = await prisma.pengaduan.create({
      data: {
        user: { connect: { id: userId } },
        kategori: { connect: { id: Number(kategori_id) } },
        judul,
        deskripsi,
        lokasi,
      },
    });

    res.json({
      success: true,
      message: "Pengaduan berhasil dibuat",
      data: pengaduan,
    });

  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({ success: false, message: "Gagal membuat pengaduan" });
  }
};

export const getPengaduanSaya = async (req, res) => {
  try {
    const userId = req.user?.id;

    const data = await prisma.pengaduan.findMany({
      where: { userId },
      include: {
        kategori: true,
        lampiran: true
      },
      orderBy: { id: "desc" }
    });

    return res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error("GET ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil riwayat"
    });
  }
};

export const getPengaduanDetail = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const data = await prisma.pengaduan.findUnique({
      where: { id },
      include: {
        kategori: true,
        user: {
          select: {
            nama_lengkap: true,
            nik: true,
            no_hp: true
          }
        },
        lampiran: true
      }
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Pengaduan tidak ditemukan"
      });
    }

    return res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error("DETAIL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil detail pengaduan"
    });
  }
};

export const uploadLampiran = async (req, res) => {
  try {
    const pengaduanId = Number(req.params.id);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada file yang diupload"
      });
    }

    const filePath = process.env.FILE_STORAGE_PATH + `/${req.file.filename}`;

    const lampiran = await prisma.lampiran.create({
      data: {
        pengaduanId,
        filePath
      }
    });

    return res.json({
      success: true,
      message: "Lampiran berhasil diupload",
      lampiran
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal upload lampiran"
    });
  }
};

export const getLampiranByPengaduan = async (req, res) => {
  try {
    const pengaduanId = Number(req.params.id);

    const lampiran = await prisma.lampiran.findMany({
      where: { pengaduanId }
    });

    return res.json({
      success: true,
      data: lampiran
    });

  } catch (error) {
    console.error("GET LAMPIRAN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil lampiran"
    });
  }
};

export const deleteLampiran = async (req, res) => {
  try {
    const id = Number(req.params.lampiranId);

    const lampiran = await prisma.lampiran.findUnique({
      where: { id }
    });

    if (!lampiran) {
      return res.status(404).json({
        success: false,
        message: "Lampiran tidak ditemukan"
      });
    }

    await prisma.lampiran.delete({
      where: { id }
    });

    return res.json({
      success: true,
      message: "Lampiran berhasil dihapus"
    });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus lampiran"
    });
  }
};

export const downloadLampiran = async (req, res) => {
  try {
    const id = Number(req.params.lampiranId);

    const lampiran = await prisma.lampiran.findUnique({
      where: { id }
    });

    if (!lampiran) {
      return res.status(404).json({
        success: false,
        message: "Lampiran tidak ditemukan"
      });
    }

    const filePath = "." + lampiran.filePath;

    return res.download(filePath);

  } catch (error) {
    console.error("DOWNLOAD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengunduh lampiran"
    });
  }
};

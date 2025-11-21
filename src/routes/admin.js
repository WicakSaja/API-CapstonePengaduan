import express from "express";
import * as kategoriController from "../controllers/kategoriController.js";
import prisma from "../utils/prisma.js";
import { generateLaporanPDF } from "../controllers/pdfController.js";

// Impor service Anda
import {
  loginAdmin,
  getAllUsers,
  getAllPengaduan,
  countPengaduan,
  getComplaintDetails,
  verifikasiPengaduan,
  setujuiPengaduan,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  selesaikanAduan
} from "../services/adminService.js";
import { getSystemStatistics } from "../controllers/dashboardController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await loginAdmin(username, password);

    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }

    return res.json({
      success: true,
      token: result.token,
      admin: result.admin,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get(
  "/users",
  authMiddleware,
  roleMiddleware(["admin", "master_admin"]),
  async (req, res) => {
    try {
      const users = await getAllUsers();
      return res.json({ success: true, data: { users } });
    } catch (err) {
      console.error("ERROR USERS:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
);
router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware(["admin", "master_admin"]),
  async (req, res) => {
    try {
      const deleted = await prisma.user.delete({
        where: { id: Number(req.params.id) },
      });

      return res.json({ success: true, data: deleted });
    } catch (err) {
      console.error("DELETE USER ERROR:", err);
      return res
        .status(500)
        .json({ success: false, message: "Gagal menghapus user" });
    }
  }
);

router.get(
  "/pengaduan",
  authMiddleware,
  roleMiddleware(["admin", "master_admin", "pimpinan"]), 
  async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search || "";
      const role = req.user.role; // Ambil role user

      // Kirim role ke service untuk filter data
      const data = await getAllPengaduan(page, limit, search, role);
      const total = await countPengaduan(search, role);

      return res.json({
        success: true,
        data: {
          pengaduan: data,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      console.error("ERROR PENGADUAN:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

router.get(
  "/pengaduan/:id",
  authMiddleware,
  roleMiddleware(["admin", "master_admin", "pimpinan"]), // Pimpinan boleh lihat
  async (req, res) => {
    try {
      const detail = await getComplaintDetails(req.params.id);
      return res.json({ success: true, data: detail });
    } catch (err) {
      console.error("DETAIL ERROR:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

router.put(
  "/pengaduan/:id/verifikasi",
  authMiddleware,
  roleMiddleware(["admin", "master_admin"]),
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;

      if (!status) {
        return res
          .status(400)
          .json({ success: false, message: "Status wajib diisi" });
      }

      const updated = await verifikasiPengaduan(id, status);

      return res.json({
        success: true,
        message: "Status pengaduan berhasil diverifikasi",
        data: updated,
      });
    } catch (err) {
      console.error("VERIFIKASI ERROR:", err);
      return res
        .status(500)
        .json({ success: false, message: "Gagal memverifikasi status" });
    }
  }
);
router.put(
  "/pengaduan/:id/selesai", // Endpoint baru
  authMiddleware,
  roleMiddleware(["admin", "master_admin"]), // HANYA Admin/Master Admin
  async (req, res) => {
    try {
      const updated = await selesaikanAduan(req.params.id); // Panggil service baru

      return res.json({
        success: true,
        message: "Aduan berhasil ditandai SELESAI.",
        data: updated,
      });
    } catch (err) {
      console.error("SELESAI ADUAN ERROR:", err);
      return res
        .status(500)
        .json({ success: false, message: err.message || "Gagal menandai selesai" });
    }
  }
);

router.put(
  "/pengaduan/:id/persetujuan",
  authMiddleware,
  roleMiddleware(["pimpinan"]),
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const status = "dilaksanakan";

      const updated = await setujuiPengaduan(id, status);

      return res.json({
        success: true,
        message: "Aduan disetujui untuk dilaksanakan",
        data: updated,
      });
    } catch (err) {
      console.error("PERSETUJUAN ERROR:", err);
      return res
        .status(500)
        .json({ success: false, message: err.message || "Gagal menyetujui aduan" });
    }
  }
);


// 1. GET ALL ADMINS
router.get(
  "/admins",
  authMiddleware,
  roleMiddleware(["master_admin"]),
  async (req, res) => {
    try {
      const admins = await getAllAdmins();
      return res.json({ success: true, data: admins });
    } catch (err) {
      console.error("GET ADMINS ERROR:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// 2. CREATE ADMIN
router.post(
  "/admins",
  authMiddleware,
  roleMiddleware(["master_admin"]),
  async (req, res) => {
    try {
      if (!req.body.username || !req.body.password || !req.body.nama_lengkap) {
        return res.status(400).json({
          success: false,
          message: "Data tidak lengkap",
        });
      }

      const newAdmin = await createAdmin(req.body);
      return res.json({
        success: true,
        message: "Admin berhasil ditambahkan",
        data: newAdmin,
      });
    } catch (err) {
      console.error("CREATE ADMIN ERROR:", err);
      if (err.code === "P2002") {
        return res
          .status(400)
          .json({ success: false, message: "Username sudah digunakan" });
      }
      return res
        .status(500)
        .json({ success: false, message: "Gagal membuat admin" });
    }
  }
);

// 3. UPDATE ADMIN
router.put(
  "/admins/:id",
  authMiddleware,
  roleMiddleware(["master_admin"]),
  async (req, res) => {
    try {
      const updated = await updateAdmin(req.params.id, req.body);
      return res.json({
        success: true,
        message: "Admin berhasil diupdate",
        data: updated,
      });
    } catch (err) {
      console.error("UPDATE ADMIN ERROR:", err);
      return res
        .status(500)
        .json({ success: false, message: "Gagal update admin" });
    }
  }
);

// 4. DELETE ADMIN
router.delete(
  "/admins/:id",
  authMiddleware,
  roleMiddleware(["master_admin"]),
  async (req, res) => {
    try {
      if (Number(req.params.id) === req.user.id) {
        return res.status(400).json({
          success: false,
          message: "Tidak bisa menghapus akun sendiri saat login",
        });
      }

      await deleteAdmin(req.params.id);
      return res.json({ success: true, message: "Admin berhasil dihapus" });
    } catch (err) {
      console.error("DELETE ADMIN ERROR:", err);
      return res
        .status(500)
        .json({ success: false, message: "Gagal hapus admin" });
    }
  }
);

router.get(
  "/kategori",
  authMiddleware,
  roleMiddleware(["admin", "master_admin", "pimpinan"]), // Pimpinan bisa lihat
  kategoriController.getAllCategories
);

router.post(
  "/kategori",
  authMiddleware,
  roleMiddleware(["admin", "master_admin", "pimpinan"]), // Pimpinan bisa buat
  kategoriController.createCategory
);

router.put(
  "/kategori/:id",
  authMiddleware,
  roleMiddleware(["admin", "master_admin", "pimpinan"]),
  kategoriController.updateCategory
);

router.delete(
  "/kategori/:id",
  authMiddleware,
  roleMiddleware(["admin", "master_admin", "pimpinan"]),
  kategoriController.deleteCategory
);

router.get(
  "/dashboard/statistik-sistem",
  authMiddleware,
  roleMiddleware(["master_admin"]),
  getSystemStatistics
);

// pdf 

router.get(
  "/pengaduan/:id/pdf",
  authMiddleware,
  roleMiddleware(["admin" , "master_admin" ,"pimpinan"]),
  generateLaporanPDF
);

export default router;
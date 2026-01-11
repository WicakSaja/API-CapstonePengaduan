import express from "express";
import {
  createPengumuman,
  getAllPengumuman,
  getPengumumanById,
  updatePengumuman,
  deletePengumuman,
} from "../services/pengumumanService.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "master_admin"]),
  upload.single("gambar"),
  async (req, res) => {
    try {
      const data = await createPengumuman(
        {
          judul: req.body.judul,
          isi: req.body.isi,
          gambar: req.file ? `/uploads/${req.file.filename}` : null,
        },
        req.user.id
      );

      res.json({ success: true, data });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  }
);


// GET ALL
router.get("/", async (_, res) => {
  res.json({ success: true, data: await getAllPengumuman() });
});

// GET ONE
router.get("/:id", async (req, res) => {
  res.json({ success: true, data: await getPengumumanById(req.params.id) });
});

// UPDATE
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "master_admin"]),
  async (req, res) => {
    res.json({
      success: true,
      data: await updatePengumuman(req.params.id, req.body),
    });
  }
);

// DELETE
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "master_admin"]),
  async (req, res) => {
    res.json({
      success: true,
      data: await deletePengumuman(req.params.id),
    });
  }
);

export default router;

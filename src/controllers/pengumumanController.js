import * as service from "../services/pengumumanService.js";
export const createPengumuman = async (req, res) => {
  try {
    // Data body
    const { judul, isi } = req.body;
    const adminId = req.user?.id;

    if (!judul || !isi) {
      return res.status(400).json({
        success: false,
        message: "Judul dan isi pengumuman wajib diisi.",
      });
    }
    const gambar = req.file ? process.env.FILE_STORAGE_PATH + `/${req.file.filename}` : null;

    const pengumumanBaru = await service.createPengumuman(
      { judul, isi, gambar },
      adminId
    );

    return res.json({
      success: true,
      message: "Pengumuman berhasil ditambahkan.",
      data: pengumumanBaru,
    });
  } catch (err) {
    console.error("❌ > CREATE PENGUMUMAN ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllPengumuman = async (_, res) => {
  try {
    const data = await service.getAllPengumuman();
    return res.json({ success: true, data });
  } catch (err) {
    console.error("❌ > GET ALL PENGUMUMAN ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getPengumumanById = async (req, res) => {
  try {
    const data = await service.getPengumumanById(req.params.id);

    if (!data) {
      return res.status(404).json({ success: false, message: "Pengumuman tidak ditemukan." });
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error("❌ > GET PENGUMUMAN BY ID ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


export const updatePengumuman = async (req, res) => {
  try {
    const updated = await service.updatePengumuman(req.params.id, req.body);
    return res.json({ success: true, message: "Berhasil update.", data: updated });
  } catch (err) {
    console.error("❌ > UPDATE PENGUMUMAN ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deletePengumuman = async (req, res) => {
  try {
    await service.deletePengumuman(req.params.id);
    return res.json({ success: true, message: "Pengumuman telah dihapus." });
  } catch (err) {
    console.error("❌ > DELETE PENGUMUMAN ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

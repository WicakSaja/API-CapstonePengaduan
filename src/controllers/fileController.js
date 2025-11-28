import prisma from '../utils/prisma.js';
import path from 'path';
import fs from 'fs';
import mime from "mime";

export const uploadLampiran = async (req, res) => {
  try {
    const pengaduanId = parseInt(req.params.id);

    if (!req.file) {
      return res.status(400).json({ message: 'Tidak ada file yang diunggah' });
    }

    const filePath = `/uploads/${req.file.filename}`;

    const lampiran = await prisma.lampiran.create({
      data: {
        pengaduanId,
        filePath,
      },
    });

    res.status(201).json({
      message: 'Lampiran berhasil diunggah',
      lampiran,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      message: 'Gagal mengunggah lampiran',
      error: error.message,
    });
  }
};

export const downloadLampiran = async (req, res) => {
  try {
    const { fileId } = req.params;
    const lampiran = await prisma.lampiran.findUnique({
      where: { id: parseInt(fileId) },
    });

    if (!lampiran) return res.status(404).json({ message: "Lampiran tidak ditemukan" });

    const filePath = path.join(process.cwd(), lampiran.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File tidak ditemukan di server" });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    const contentType = mime.getType(filePath) || "application/octet-stream";

    // === Streaming Mode untuk VIDEO dengan range ===
    if (contentType.startsWith("video") && range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunkSize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": contentType,
      });

      return file.pipe(res);
    }

    // === Jika bukan video, kirim biasa ===
    res.setHeader("Content-Type", contentType);
    return res.sendFile(filePath);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal membuka file" });
  }
};


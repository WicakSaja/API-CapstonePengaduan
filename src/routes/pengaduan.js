import express from 'express';
import multer from 'multer';
import authMiddleware from '../middlewares/authMiddleware.js';

import {
  createPengaduan,
  getPengaduanSaya,
  getPengaduanDetail,
  uploadLampiran,
  getLampiranByPengaduan,
  downloadLampiran,
  deleteLampiran,
} from '../controllers/pengaduanController.js';

const router = express.Router();

// Konfigurasi upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/', authMiddleware, createPengaduan);
router.get('/me', authMiddleware, getPengaduanSaya);
router.get('/:id', authMiddleware, getPengaduanDetail);

router.post('/:id/lampiran', authMiddleware, upload.single('lampiran'), uploadLampiran);
router.get('/:id/lampiran', authMiddleware, getLampiranByPengaduan);
router.get('/lampiran/:lampiranId/download', authMiddleware, downloadLampiran);
router.delete('/lampiran/:lampiranId', authMiddleware, deleteLampiran);

export default router;
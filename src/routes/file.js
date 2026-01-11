import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../utils/fileStorage.js';
import * as fileController from '../controllers/fileController.js';

const router = express.Router();

// Upload file lampiran
router.post('/pengaduan/:id/lampiran', authMiddleware, upload.single('lampiran'), fileController.uploadLampiran);

// Download file lampiran
router.get('/pengaduan/:id/lampiran/:fileId', authMiddleware, fileController.downloadLampiran);

export default router;

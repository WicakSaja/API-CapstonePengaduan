import express from 'express';
import * as notifikasiController from '../controllers/notifikasiController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Pastikan middleware yang dipakai adalah authMiddleware
router.get('/', authMiddleware, notifikasiController.getNotifikasi);
router.post('/baca-semua', authMiddleware, notifikasiController.markAllAsRead);
router.patch('/:id/baca', authMiddleware, notifikasiController.markAsRead);

export default router;

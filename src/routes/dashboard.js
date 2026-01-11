// src/routes/dashboard.js

import express from 'express';
const router = express.Router();

// 1. Impor HANYA 'getStatistics' secara spesifik
import { getStatistics } from '../controllers/dashboardController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

// 2. Gunakan 'getStatistics' SECARA LANGSUNG (tanpa 'dashboardController.')
router.get(
    '/statistik-laporan', 
    authMiddleware, 
    getStatistics // <-- PERBAIKAN DI SINI
);

// 3. Rute '/statistik-sistem' DIHAPUS dari file ini
//    karena frontend mencarinya di prefix yang berbeda.

export default router;
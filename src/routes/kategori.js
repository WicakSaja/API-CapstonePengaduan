import express from 'express';
const router = express.Router();
import * as kategoriController from '../controllers/kategoriController.js';
import middlewares from '../middlewares/index.js';

// GET semua kategori
router.get('/', kategoriController.getAllCategories);

// GET kategori by ID  <-- ROUTE INI SANGAT PENTING !!
router.get('/:id', kategoriController.getCategoryById);

// CREATE kategori
router.post(
    '/',
    middlewares.authMiddleware,
    middlewares.roleMiddleware(['admin', 'master_admin']),
    kategoriController.createCategory
);

// UPDATE kategori
router.put(
    '/:id',
    middlewares.authMiddleware,
    middlewares.roleMiddleware(['admin', 'master_admin']),
    kategoriController.updateCategory
);

// DELETE kategori
router.delete(
    '/:id',
    middlewares.authMiddleware,
    middlewares.roleMiddleware(['admin', 'master_admin']),
    kategoriController.deleteCategory
);

export default router;

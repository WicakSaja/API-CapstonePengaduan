import express from "express";
import masterController from "../controllers/masterController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Master Admin Only
router.get(
  "/dashboard/statistik-sistem",
  authMiddleware,
  roleMiddleware(["master_admin"]),
  masterController.getStatistikSistem
);

router.get(
  "/dashboard/statistik-pengaduan",
  authMiddleware,
  roleMiddleware(["admin", "master_admin"]),
  masterController.getStatistikPengaduan
);

router.get(
  "/admin/list",
  authMiddleware,
  roleMiddleware(["master_admin"]),
  masterController.getDaftarAdmin
);

router.get(
  "/users/list",
  authMiddleware,
  roleMiddleware(["master_admin"]),
  masterController.getDaftarUsers
);

router.get(
  "/pengaduan/all",
  authMiddleware,
  roleMiddleware(["master_admin"]),
  masterController.getSemuaPengaduan
);

export default router;

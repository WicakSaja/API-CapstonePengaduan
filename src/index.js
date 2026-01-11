import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs"; 
import dotenv from 'dotenv'
dotenv.config();

import authRoutes from "./routes/auth.js";
import pengaduanRoutes from "./routes/pengaduan.js";
import adminRoutes from "./routes/admin.js";
import masterRoutes from "./routes/master.js";
import kategoriRoutes from "./routes/kategori.js";
import fileRoutes from "./routes/file.js";
import dashboardRoutes from "./routes/dashboard.js";
import notifikasiRoutes from "./routes/notifikasi.js";
import pengumumanRoute from "./routes/pengumumanRoute.js";

import prisma from "./utils/prisma.js";
import config from "./config/index.js";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/api-specs.json" with { type: "json" };


const app = express();

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/uploads/:filename", (req, res) => {
  const rawFilename = req.params.filename;
  const decodedFilename = decodeURIComponent(rawFilename); 
  const pathRoot = path.join(process.cwd(), "uploads", decodedFilename);
  const existRoot = fs.existsSync(pathRoot);

  if (existRoot) {
    return res.sendFile(pathRoot);
  }
});

app.use(express.static(path.join(process.cwd(), "public")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); 

app.use("/api/auth", authRoutes);
app.use("/api/pengaduan", pengaduanRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/master", masterRoutes);
app.use("/api/kategori", kategoriRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifikasi", notifikasiRoutes);
app.use("/api/pengumuman", pengumumanRoute);

console.log("\n Registered Routes Loaded.");
prisma.$connect().then(() => console.log(" Prisma connected successfully"));

app.listen(config.port, () =>
  console.log(` Server running on PORT ${config.port}`)
);
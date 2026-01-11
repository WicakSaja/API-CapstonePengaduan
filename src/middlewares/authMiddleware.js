import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";
import config from "../config/index.js";

export default async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized. Token missing." });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, config.JWT_SECRET);

    console.log("DECODED TOKEN:", decoded);

    let user;

    if (
      decoded.role === "admin" ||
      decoded.role === "master_admin" ||
      decoded.role === "pimpinan" 
    ) {
      // Cari di tabel ADMIN
      user = await prisma.admin.findUnique({
        where: { id: decoded.id },
      });
    } else {
      // Cari di tabel USER (Masyarakat)
      user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });
    }

    if (!user) {
      console.error("❌ User not found in DB for ID:", decoded.id, "Role:", decoded.role);
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }
    req.user = user;
    req.user.role = decoded.role; 

    next();
  } catch (err) {
    console.error("TOKEN ERROR:", err.message);
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
}
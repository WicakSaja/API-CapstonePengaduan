const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    // 1. Cek apakah user ada
    if (!req.user || !req.user.role) {
      console.log("❌ RoleMiddleware: User tidak ditemukan atau tidak punya role di token.");
      return res.status(401).json({ message: "Unauthorized: No user data found" });
    }

    // 2. LOG DEBUGGING (PENTING: Lihat ini di terminal saat error)
    console.log(`🔍 RoleMiddleware Check:`);
    console.log(`   - Role User (dari Token): '${req.user.role}'`);
    console.log(`   - Role yang Diizinkan: [${allowedRoles.join(", ")}]`);

    // 3. Cek apakah role user ada di dalam array yang diizinkan
    if (!allowedRoles.includes(req.user.role)) {
      console.log("⛔ RoleMiddleware: Akses DITOLAK.");
      return res.status(403).json({ 
        message: `Forbidden: Role '${req.user.role}' tidak memiliki akses.` 
      });
    }

    console.log("✅ RoleMiddleware: Akses DITERIMA.");
    next();
  };
};

export default roleMiddleware;
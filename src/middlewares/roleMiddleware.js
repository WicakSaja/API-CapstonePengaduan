const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    // 1. Cek apakah user ada
    if (!req.user || !req.user.role) {
      console.log("❌ RoleMiddleware: User tidak ditemukan atau tidak punya role di token.");
      return res.status(401).json({ message: "Unauthorized: No user data found" });
    }

    // 3. Cek apakah role user ada di dalam array yang diizinkan
    if (!allowedRoles.includes(req.user.role)) {
      console.log("⛔ RoleMiddleware: Akses DITOLAK.");
      return res.status(403).json({ 
        message: `Forbidden: Role '${req.user.role}' tidak memiliki akses.` 
      });
    }

    next();
  };
};

export default roleMiddleware;
export default function checkAdmin(requiredRole = "master_admin") {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: "Unauthorized (Admin tidak ditemukan)" });
    }

    if (req.admin.role !== requiredRole) {
      return res.status(403).json({ message: "Akses ditolak (role tidak sesuai)" });
    }

    next();
  };
}

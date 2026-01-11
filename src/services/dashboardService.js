import prisma from "../utils/prisma.js"; 
export const getStatistics = async (role) => {
  try {
    const roleFilter = {};
    if (role === "pimpinan") {
      roleFilter.status = {
        in: ["diterima", "diproses", "dilaksanakan"],
      };
    }
    const total = await prisma.pengaduan.count({});

   
    const pending = await prisma.pengaduan.count({
      where: { AND: [{ status: "pending" }, roleFilter] },
    });

    const diterima = await prisma.pengaduan.count({
      where: { AND: [{ status: "diterima" }, roleFilter] },
    });

    const diproses = await prisma.pengaduan.count({
      where: { AND: [{ status: "diproses" }, roleFilter] },
    });

    const dilaksanakan = await prisma.pengaduan.count({
      where: { AND: [{ status: "dilaksanakan" }, roleFilter] },
    });

    const ditolak = await prisma.pengaduan.count({
      where: { AND: [{ status: "ditolak" }, roleFilter] },
    });

    const prosesGabungan = diterima + diproses;

    return {
      total: total,           
      pending: pending,       
      proses: prosesGabungan, 
      selesai: dilaksanakan,  
      ditolak: ditolak,
    };
  } catch (err) {
    console.error("Error di getStatistics:", err);
    // Kembalikan 0 jika ada error
    return { total: 0, pending: 0, proses: 0, selesai: 0, ditolak: 0 };
  }
};

export const getSystemStatistics = async () => {
  try {
    const total_users = await prisma.user.count({});
    const active_admins = await prisma.admin.count({});
  

    return {
      total_users: total_users,
      active_admins: active_admins,
    };
  } catch (err) {
    console.error("Error di getSystemStatistics:", err);
    return { total_users: 0, active_admins: 0 };
  }
};

export default {
  getStatistics,
  getSystemStatistics,
};
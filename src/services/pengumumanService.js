import prisma from "../utils/prisma.js";
export const createPengumuman = async (data, adminId) => {
  console.log("🟢 CREATE:", {
    judul: data.judul,
    isi: data.isi,
    gambar: data.gambar,
    adminId,
  });

  return prisma.pengumuman.create({
    data: {
      judul: data.judul,
      isi: data.isi,
      gambar: data.gambar || null,
      dibuatOleh: adminId,
    },
  });
};

export const getAllPengumuman = async () => {
  return prisma.pengumuman.findMany({
    orderBy: { dibuatPada: "desc" },
    include: {
      admin: {
        select: { nama_lengkap: true },
      },
    },
  });
};

export const getPengumumanById = async (id) => {
  return prisma.pengumuman.findUnique({
    where: { id: Number(id) },
    include: {
      admin: { select: { nama_lengkap: true } },
    },
  });
};

export const updatePengumuman = async (id, data) => {
  console.log("🟡 UPDATE:", id, data);

  return prisma.pengumuman.update({
    where: { id: Number(id) },
    data: {
      judul: data.judul,
      isi: data.isi,
      gambar: data.gambar || undefined,
    },
  });
};

export const deletePengumuman = async (id) => {
  console.log("🔴 DELETE:", id);

  return prisma.pengumuman.delete({
    where: { id: Number(id) },
  });
};

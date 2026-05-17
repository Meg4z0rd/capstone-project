const prisma = require("../config/prisma");

const AnalysisModel = {
  // Simpan hasil analisis
  create: async ({
    userId,
    imagePath,
    skinType,
    concerns,
    additionalNotes,
    result,
  }) => {
    return prisma.analysisHistory.create({
      data: {
        userId,
        imagePath,
        skinType,
        concerns,
        additionalNotes,
        result,
      },
    });
  },

  // Ambil riwayat analisis per user
  findByUserId: async (userId) => {
    return prisma.analysisHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  // Ambil detail analisis by id (pastikan milik user)
  findById: async (id, userId) => {
    return prisma.analysisHistory.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
    });
  },
};

module.exports = AnalysisModel;

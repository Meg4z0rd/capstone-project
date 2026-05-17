const prisma = require("../config/prisma");

const UserModel = {
  findByEmail: async (email) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  findById: async (id) => {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        password: true,
        googleId: true,
      },
    });
  },

  create: async ({ name, email, password }) => {
    return prisma.user.create({
      data: { name, email, password },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });
  },

  findOrCreateGoogle: async ({ googleId, name, email, avatar }) => {
    // Cek apakah user sudah ada (by googleId atau email)
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId }, { email }],
      },
    });

    if (user) {
      // Update googleId dan avatar jika belum diset
      if (!user.googleId || user.avatar !== avatar) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId, avatar },
        });
      }
      return user;
    }

    // Buat user baru
    return prisma.user.create({
      data: { googleId, name, email, avatar },
    });
  },

  updateName: async (userId, name) => {
    return prisma.user.update({
      where: { id: userId },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });
  },

  updatePassword: async (userId, hashedPassword) => {
    return prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  },
};

module.exports = UserModel;

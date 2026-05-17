const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const logger = require("../utils/logger");
require("dotenv").config();

// Prisma v7: gunakan adapter pg untuk koneksi langsung ke PostgreSQL
const adapter = new PrismaPg(process.env.DATABASE_URL);

const prisma = new PrismaClient({
  adapter,
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "error" },
  ],
});

prisma.$on("error", (e) => {
  logger.error({ err: e }, "Prisma error");
});

if (process.env.NODE_ENV === "development") {
  prisma.$on("query", (e) => {
    logger.debug({ query: e.query, duration: e.duration }, "Prisma query");
  });
}

module.exports = prisma;

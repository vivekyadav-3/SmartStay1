import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

function getDatabaseUrl(): string {
  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    (process.platform === "linux" && process.env.NODE_ENV === "production")
  );

  if (isServerless) {
    const tmpDb = "/tmp/dev.db";
    const srcDb = path.join(process.cwd(), "prisma", "dev.db");

    try {
      if (fs.existsSync(srcDb)) {
        const needCopy = !fs.existsSync(tmpDb);
        if (needCopy) {
          fs.copyFileSync(srcDb, tmpDb);
          console.log(`[SmartStay DB] Successfully initialized database at ${tmpDb}`);
        }
      }
    } catch (err) {
      console.error("[SmartStay DB] /tmp copy error:", err);
    }

    return fs.existsSync(tmpDb) ? `file:${tmpDb}` : `file:${srcDb}`;
  }

  const localDb = path.join(process.cwd(), "prisma", "dev.db");
  if (fs.existsSync(localDb)) {
    return `file:${localDb.replace(/\\/g, "/")}`;
  }

  return "file:./dev.db";
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

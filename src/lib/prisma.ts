import { PrismaClient } from '@prisma/client';

// This is the only Prisma Client instance for the entire project.
// All modules must import Prisma from this file to ensure a single source of truth for the database connection.
// Do not instantiate or import Prisma Client elsewhere.

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 
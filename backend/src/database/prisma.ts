// src/database/prisma.ts
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

// A single PrismaClient instance is shared by the whole process.
// `globalThis` keeps it from being re-created on nodemon/ts-node hot reloads.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export const connectToDatabase = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL');
    return true;
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
    throw new Error('Error connecting to PostgreSQL');
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
};

export default prisma;

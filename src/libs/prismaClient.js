import { ENV } from '../constants/common.js';
import { PrismaClient } from '@prisma/client';

let prisma;

if (ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }

  prisma = global.prisma;
}

export default prisma;
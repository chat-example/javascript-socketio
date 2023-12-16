import { PrismaClient } from '@prisma/client';
import serverDataList from './dummy/servers.js';

const prisma = new PrismaClient()
async function main() {
  const serverList = await prisma.server.createMany({
    data: serverDataList,
  });

  console.log({ serverList })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
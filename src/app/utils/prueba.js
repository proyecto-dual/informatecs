import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function test() {
  const data = await prisma.estudicarr.findMany({
    include: { carrera: true, estudiante: true },
    take: 3,
  });
  console.log(JSON.stringify(data, null, 2));
}

test().finally(() => prisma.$disconnect());

// testPrisma.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const carreras = await prisma.carrera.findMany();
    console.log("Carreras:", carreras);
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

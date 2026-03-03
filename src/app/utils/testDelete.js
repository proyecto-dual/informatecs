import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  try {
    // Borrar primero inscripciones asociadas a ofertas activas
    await prisma.inscripact.deleteMany({
      where: {
        ofertaId: {
          in: (
            await prisma.ofertaSemestre.findMany({
              where: { activa: true, semestre: "2024-2" },
              select: { id: true },
            })
          ).map((o) => o.id),
        },
      },
    });

    // Luego borrar las ofertas
    const resultado = await prisma.ofertaSemestre.deleteMany({
      where: { activa: true, semestre: "2024-2" },
    });

    console.log(`Se borraron ${resultado.count} ofertas.`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

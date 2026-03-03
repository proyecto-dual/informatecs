import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const estudiantes = await prisma.estudiantes.findMany({
      select: {
        aluctr: true,
        alunom: true,
        aluapp: true,
        aluapm: true,
        alumai: true,
        alusex: true,
        alutsa: true,
      },
      orderBy: {
        aluctr: 'asc'
      }
    });

    return new Response(JSON.stringify(estudiantes), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
    return new Response(
      JSON.stringify({ error: "Error al obtener estudiantes" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const numeroControl = searchParams.get('numeroControl');

    if (!numeroControl) {
      return new Response(
        JSON.stringify({ error: "Número de control requerido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Obtener constancias del estudiante
    const constancias = await prisma.constancias.findMany({
      where: {
        numeroControl: numeroControl,
      },
      orderBy: {
        fechaEmision: 'desc', // Más recientes primero
      },
    });

    return new Response(
      JSON.stringify(constancias),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error(" Error al obtener constancias:", error);
    return new Response(
      JSON.stringify([]), // Array vacío en caso de error
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}

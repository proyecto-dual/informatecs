import { prisma } from "@/lib/prisma";

const jsonRes = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const formatMaestro = (m) => ({
  ...m,
  nombreCompleto: `${m.pernom || ""} ${m.perapp || ""} ${m.perapm || ""}`.trim(),
  sexoTexto: m.persex === 1 ? "Masculino" : m.persex === 2 ? "Femenino" : "No especificado",
});

const selectBase = {
  percve: true,
  pernom: true,
  perapp: true,
  perapm: true,
  perdvi: true,
  perdce: true,
  perdte: true,
  persex: true,
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const percve = searchParams.get("percve");
    const search = searchParams.get("search");

    // Buscar por ID específico
    if (percve) {
      const maestro = await prisma.maestros.findUnique({
        where: { percve: parseInt(percve) },
        select: {
          ...selectBase,
          perdep: true,
          ofertasImpartidas: {
            where: { activa: true },
            include: { actividad: true, inscripact: true },
          },
        },
      });

      if (!maestro)
        return jsonRes({ error: "Maestro no encontrado" }, 404);

      return jsonRes(formatMaestro(maestro));
    }

    // Buscar por nombre o ID
    if (search) {
      const searchTerm = search.trim();
      const isNumeric = !isNaN(parseInt(searchTerm));

      const maestros = await prisma.maestros.findMany({
        where: {
          OR: [
            isNumeric ? { percve: parseInt(searchTerm) } : undefined,
            { pernom: { contains: searchTerm, mode: "insensitive" } },
            { perapp: { contains: searchTerm, mode: "insensitive" } },
            { perapm: { contains: searchTerm, mode: "insensitive" } },
          ].filter(Boolean),
        },
        select: selectBase,
        take: 20,
        orderBy: { perapp: "asc" },
      });

      return jsonRes(maestros.map(formatMaestro));
    }

    // Listar todos con paginación
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 50;

    const [maestros, total] = await Promise.all([
      prisma.maestros.findMany({
        select: { ...selectBase, perdep: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { perapp: "asc" },
      }),
      prisma.maestros.count(),
    ]);

    return jsonRes({
      maestros: maestros.map(formatMaestro),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(" Error en API maestros:", error.message);
    return jsonRes({ error: "Error interno", message: error.message }, 500);
  }
}
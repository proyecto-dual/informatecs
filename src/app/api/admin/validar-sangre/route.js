import { prisma } from "@/lib/prisma";

export async function PATCH(request) {
  return handleRequest(request);
}

export async function PUT(request) {
  return handleRequest(request);
}

async function handleRequest(request) {
  try {
    const body = await request.json();
    const { aluctr, accion, mensaje } = body;

    if (!aluctr) {
      return new Response(JSON.stringify({ error: "Faltan datos (aluctr)" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1. Lógica para RECHAZAR
    if (accion === "rechazar") {
      await prisma.inscripact.updateMany({
        where: { estudianteId: aluctr },
        data: {
          mensajeAdmin: mensaje || "Documento rechazado.",
          sangreValidada: false,
        },
      });
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // 2. Lógica para APROBAR
    // Buscamos primero el tipo de sangre que el alumno solicitó
    const registro = await prisma.inscripact.findFirst({
      where: { estudianteId: aluctr },
      select: { tipoSangreSolicitado: true },
    });

    // Actualizamos todas las inscripciones del alumno
    await prisma.inscripact.updateMany({
      where: { estudianteId: aluctr },
      data: {
        sangreValidada: true,
        mensajeAdmin: null, // <--- ESTO QUITA EL CUADRO ROJO
      },
    });

    // Actualizamos la tabla maestra de estudiantes
    if (registro?.tipoSangreSolicitado) {
      await prisma.estudiantes.update({
        where: { aluctr: aluctr },
        data: { alutsa: registro.tipoSangreSolicitado },
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Validado y limpiado" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error en API:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

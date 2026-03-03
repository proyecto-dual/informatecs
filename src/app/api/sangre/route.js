
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//  determina si el alumno tiene sangre validada o pendiente
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const aluctr = searchParams.get("aluctr");

    if (!aluctr)
      return NextResponse.json({ error: "Falta aluctr" }, { status: 400 });

    const estudiante = await prisma.estudiantes.findUnique({
      where: { aluctr },
      select: { aluctr: true, alutsa: true },
    });

    const inscripcion = await prisma.inscripact.findFirst({
      where: { estudianteId: aluctr },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({
      estudiante,
      tieneSolicitudPendiente: !!(
        inscripcion?.tipoSangreSolicitado && !inscripcion?.sangreValidada
      ),
      solicitudPendiente:
        inscripcion?.tipoSangreSolicitado && !inscripcion?.sangreValidada
          ? inscripcion
          : null,
      inscripcion: inscripcion || null,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//actualiza la inscripcion con el archivo
export async function POST(request) {
  try {
    const formData = await request.formData();
    const aluctr = formData.get("aluctr");
    const bloodType = formData.get("bloodType");
    const file = formData.get("file");

    if (!aluctr || !file) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // Convertir archivo a Base64 para almacenamiento sencillo o Buffer si prefieres Blob
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;

    const inscripcion = await prisma.inscripact.findFirst({
      where: { estudianteId: aluctr },
      orderBy: { id: "desc" },
    });

    if (!inscripcion) {
      return NextResponse.json(
        { error: "No hay inscripción activa" },
        { status: 404 },
      );
    }

    await prisma.inscripact.update({
      where: { id: inscripcion.id },
      data: {
        tipoSangreSolicitado: bloodType,
        comprobanteSangrePDF: base64String, // Guardamos como string para previsualización directa
        nombreArchivoSangre: file.name,
        sangreValidada: false,
        mensajeAdmin: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(" Error en POST /api/sangre:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

// 3.  el panel de control usa esto para Aprobar/Rechazar
export async function PATCH(request) {
  try {
    const body = await request.json();
    console.log("PATCH /api/sangre body:", body); // temporal para debug

    const { aluctr, accion, mensaje } = body;

    if (!aluctr) {
      return NextResponse.json({ error: "Falta aluctr" }, { status: 400 });
    }

    // sin filtros extra — solo la inscripcion mas reciente del alumno
    const inscripcion = await prisma.inscripact.findFirst({
      where: { estudianteId: aluctr },
      orderBy: { id: "desc" },
    });

    if (!inscripcion)
      return NextResponse.json(
        { error: "No se encontró inscripción para este alumno" },
        { status: 404 },
      );

    if (accion === "aprobar") {
      await prisma.$transaction([
        prisma.estudiantes.update({
          where: { aluctr },
          data: { alutsa: inscripcion.tipoSangreSolicitado },
        }),
        prisma.inscripact.update({
          where: { id: inscripcion.id },
          data: {
            sangreValidada: true,
            mensajeAdmin: null, 
          },
        }),
      ]);
    } else if (accion === "rechazar") {
      await prisma.$transaction([
        
        prisma.estudiantes.update({
          where: { aluctr },
          data: { alutsa: null },
        }),
        prisma.inscripact.update({
          where: { id: inscripcion.id },
          data: {
            comprobanteSangrePDF: null,
            sangreValidada: false,
            tipoSangreSolicitado: null,
            mensajeAdmin: mensaje || "Documento rechazado por el administrador.",
          },
        }),
      ]);
    }

    return NextResponse.json({
      success: true,
      mensaje: `Expediente ${accion}ado`,
    });
  } catch (error) {
    console.error(" Error en PATCH /api/sangre:", error);
    return NextResponse.json(
      { error: "Error en la operación de base de datos" },
      { status: 500 },
    );
  }
}
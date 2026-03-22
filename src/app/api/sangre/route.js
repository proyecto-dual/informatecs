import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// ── GET: determina si el alumno tiene sangre validada o pendiente ──
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

// ── POST: actualiza la inscripcion con el archivo ──
export async function POST(request) {
  try {
    const formData = await request.formData();
    const aluctr = formData.get("aluctr");
    const bloodType = formData.get("bloodType");
    const file = formData.get("file");

    if (!aluctr || !file) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

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

    // ── SUBIR A SUPABASE STORAGE ──
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.includes(".")
      ? "." + file.name.split(".").pop()
      : ".pdf";
    const filename = `${aluctr}_${Date.now()}${ext}`;
    const storagePath = `sangre/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(storagePath, buffer, {
        contentType: file.type || "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error Supabase:", uploadError.message);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // ── OBTENER URL PÚBLICA ──
    const {
      data: { publicUrl },
    } = supabase.storage.from("uploads").getPublicUrl(storagePath);

    // ── GUARDAR URL EN BD ──
    await prisma.inscripact.update({
      where: { id: inscripcion.id },
      data: {
        tipoSangreSolicitado: bloodType,
        comprobanteSangrePDF: publicUrl, // ✅ URL pública, no base64
        nombreArchivoSangre: filename,
        sangreValidada: false,
        mensajeAdmin: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en POST /api/sangre:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

// ── PATCH: el panel de control usa esto para Aprobar/Rechazar ──
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { aluctr, accion, mensaje } = body;

    if (!aluctr) {
      return NextResponse.json({ error: "Falta aluctr" }, { status: 400 });
    }

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
      // ── ELIMINAR ARCHIVO DE SUPABASE AL RECHAZAR ──
      if (inscripcion.nombreArchivoSangre) {
        await supabase.storage
          .from("uploads")
          .remove([`sangre/${inscripcion.nombreArchivoSangre}`]);
      }

      await prisma.$transaction([
        prisma.estudiantes.update({
          where: { aluctr },
          data: { alutsa: null },
        }),
        prisma.inscripact.update({
          where: { id: inscripcion.id },
          data: {
            comprobanteSangrePDF: null,
            nombreArchivoSangre: null,
            sangreValidada: false,
            tipoSangreSolicitado: null,
            mensajeAdmin:
              mensaje || "Documento rechazado por el administrador.",
          },
        }),
      ]);
    }

    return NextResponse.json({
      success: true,
      mensaje: `Expediente ${accion}ado`,
    });
  } catch (error) {
    console.error("Error en PATCH /api/sangre:", error);
    return NextResponse.json(
      { error: "Error en la operación de base de datos" },
      { status: 500 },
    );
  }
}

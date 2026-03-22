export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// ── GET ──
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

// ── POST ──
export async function POST(request) {
  console.log("🆕 POST /api/sangre corriendo");
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

    const ext = file.name.includes(".")
      ? "." + file.name.split(".").pop()
      : ".pdf";
    const filename = `${aluctr}_${Date.now()}${ext}`;
    const arrayBuffer = await file.arrayBuffer();

    // ✅ Subida directa via fetch a la REST API de Supabase
    const uploadRes = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/uploads/sangre/${filename}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": file.type || "application/pdf",
        },
        body: arrayBuffer,
      },
    );

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      console.error("Error subiendo a Supabase:", err);
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/sangre/${filename}`;
    console.log("✅ Archivo subido:", publicUrl);

    await prisma.inscripact.update({
      where: { id: inscripcion.id },
      data: {
        tipoSangreSolicitado: bloodType,
        comprobanteSangrePDF: publicUrl,
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

// ── PATCH ──
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
          data: { sangreValidada: true, mensajeAdmin: null },
        }),
      ]);
    } else if (accion === "rechazar") {
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

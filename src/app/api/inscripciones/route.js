import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import path from "path";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// ── GET: OBTENER INSCRIPCIONES ────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const aluctr = searchParams.get("aluctr");
    const whereClause = aluctr ? { estudianteId: aluctr } : {};

    const inscripciones = await prisma.inscripact.findMany({
      where: whereClause,
      include: {
        actividad: true,
        estudiante: {
          select: {
            aluctr: true,
            alunom: true,
            aluapp: true,
            aluapm: true,
            alusme: true,
            alusex: true,
            alumai: true,
            alutsa: true,
            alunac: true,
            alurfc: true,
            alucur: true,
            aluciu: true,
            alufac: true,
            aluseg: true,
            alute1: true,
            alute2: true,
            aluale: true,
            inscripciones: {
              select: {
                calnpe: true,
                carcve: true,
                carrera: { select: { carcve: true, carnom: true } },
              },
            },
          },
        },
      },
      orderBy: [{ comprobanteSangrePDF: "desc" }, { fechaInscripcion: "desc" }],
    });

    const inscripcionesTransformadas = inscripciones.map((inscripcion) => {
      let formularioData = null;
      if (inscripcion.formularioData) {
        try {
          formularioData =
            typeof inscripcion.formularioData === "string"
              ? JSON.parse(inscripcion.formularioData)
              : inscripcion.formularioData;
        } catch (error) {
          console.error("Error parseando formularioData:", error);
        }
      }

      const inscripcionAcademica = inscripcion.estudiante.inscripciones;
      return {
        ...inscripcion,
        formularioData,
        estudiante: {
          ...inscripcion.estudiante,
          calnpe: inscripcionAcademica?.calnpe ?? null,
          carrera: inscripcionAcademica?.carrera
            ? {
                carcve: inscripcionAcademica.carrera.carcve?.toString() || null,
                carnom: inscripcionAcademica.carrera.carnom || null,
              }
            : null,
        },
      };
    });

    return new Response(JSON.stringify(inscripcionesTransformadas), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify([]), { status: 500 });
  }
}

// ── POST: CREAR INSCRIPCIÓN ───────────────────────────────────────────────
export async function POST(request) {
  try {
    const formData = await request.formData();
    const aluctr = formData.get("aluctr");
    const actividadId = parseInt(formData.get("actividadId"));
    const ofertaId = parseInt(formData.get("ofertaId"));
    const file = formData.get("bloodTypeFile");

    if (!aluctr || isNaN(actividadId) || isNaN(ofertaId)) {
      return new Response(JSON.stringify({ error: "Datos incompletos" }), {
        status: 400,
      });
    }

    // ── GESTIÓN DE ARCHIVO (Supabase Storage) ──
    let fileNamePath = null;
    if (file && typeof file !== "string" && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.name.includes(".")
        ? "." + file.name.split(".").pop()
        : ".pdf";
      const uniqueFileName = `${aluctr}_${actividadId}_${Date.now()}${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(`sangre/${uniqueFileName}`, buffer, {
          contentType: file.type || "application/pdf",
          upsert: true,
        });

      if (uploadError) {
        console.error("Error subiendo a Supabase:", uploadError.message);
      } else {
        const {
          data: { publicUrl },
        } = supabase.storage
          .from("uploads")
          .getPublicUrl(`sangre/${uniqueFileName}`);
        fileNamePath = publicUrl;
      }
    }

    // ── GUARDAR EN BASE DE DATOS ──
    let nuevaInscripcion;
    try {
      nuevaInscripcion = await prisma.inscripact.create({
        data: {
          estudiante: { connect: { aluctr: aluctr } },
          actividad: { connect: { id: actividadId } },
          oferta: { connect: { id: ofertaId } },
          telefono: formData.get("telefono") || null,
          modalidad: formData.get("modalidad") || "PRESENCIAL",
          tipoSangreSolicitado: formData.get("bloodType") || null,
          comprobanteSangrePDF: fileNamePath,
          nombreArchivoSangre: file instanceof File ? file.name : null,
          sangreValidada: false,
          formularioData: JSON.stringify({
            purpose: formData.get("purpose"),
            hasCondition: formData.get("hasCondition"),
            takesMedication: formData.get("takesMedication"),
            hasAllergy: formData.get("hasAllergy"),
            hasInjury: formData.get("hasInjury"),
            hasRestriction: formData.get("hasRestriction"),
          }),
          fechaInscripcion: new Date(),
        },
        include: { estudiante: true, actividad: true },
      });
    } catch (dbError) {
      if (dbError.code === "P2002") {
        return new Response(JSON.stringify({ error: "Ya estás inscrito." }), {
          status: 400,
        });
      }
      throw dbError;
    }

    // ── ENVÍO DE CORREO ──
    const correoDestino =
      nuevaInscripcion.estudiante.alumai || nuevaInscripcion.estudiante.alumail;

    if (!correoDestino) {
      console.error("ERROR: No hay correo para este alumno en la DB.");
    } else {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const nombreEstudiante = `${nuevaInscripcion.estudiante.alunom} ${nuevaInscripcion.estudiante.aluapp}`;
        const nombreActividad =
          nuevaInscripcion.actividad.aconco || "Actividad";
        const logoPath = path.join(
          process.cwd(),
          "public",
          "imagenes",
          "logoen.png",
        );

        await transporter.sendMail({
          from: `"Equipo Actividades ITE" <${process.env.EMAIL_USER}>`,
          to: correoDestino,
          subject: `Confirmación de Inscripción - ${nombreActividad}`,
          attachments: [
            {
              filename: "logoen.png",
              path: logoPath,
              cid: "logoite",
            },
          ],
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
              
              <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 3px solid #013ee3;">
                <img src="cid:logoite" alt="ITE Intramuros" style="width: 180px; height: auto; display: block; margin: auto;">
              </div>

              <div style="padding: 30px; color: #1a1a1a;">
                <p style="font-size: 16px;">Hola <strong>${nombreEstudiante}</strong>,</p>
                <p style="font-size: 16px;">Tu inscripción a la actividad <strong>"${nombreActividad}"</strong> ha sido confirmada correctamente.</p>
                <p style="font-size: 16px;">Gracias por participar en las actividades del ITE.</p>
                
                <div style="background: #f8fafc; padding: 15px; margin-top: 20px; border-radius: 8px; font-size: 14px; border: 1px solid #e2e8f0;">
                  <p style="margin: 5px 0;"><strong>No. Control:</strong> ${aluctr}</p>
                  <p style="margin: 5px 0;"><strong>Modalidad:</strong> ${nuevaInscripcion.modalidad}</p>
                  <p style="margin: 5px 0;"><strong>Fecha:</strong> ${new Date().toLocaleDateString("es-MX")}</p>
                </div>

                <p style="margin-top: 30px; font-size: 15px;">Saludos,<br><strong>Equipo de Actividades Extracurriculares ITE</strong></p>
              </div>
              
              <div style="background: #0f36a1ff; padding: 10px; text-align: center; color: white; font-size: 12px;">
                © ${new Date().getFullYear()} Instituto Tecnológico de Ensenada
              </div>
            </div>
          `,
        });
        console.log(`Correo enviado con éxito a: ${correoDestino}`);
      } catch (mailError) {
        console.error("Error en Nodemailer:", mailError.message);
      }
    }

    return new Response(JSON.stringify(nuevaInscripcion), { status: 201 });
  } catch (error) {
    console.error("Error general:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

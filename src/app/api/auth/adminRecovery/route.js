import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Recuerda: Debe ser "Contraseña de Aplicación" de 16 letras
  },
});

export async function POST(req) {
  try {
    const { adminUser } = await req.json();

    if (!adminUser?.trim()) {
      return NextResponse.json(
        { message: "El usuario es requerido." },
        { status: 400 },
      );
    }

    // Buscar al administrador
    const admin = await prisma.adminCredentials.findUnique({
      where: { username: adminUser.trim() },
    });

    // Respuesta genérica por seguridad
    if (!admin) {
      return NextResponse.json({
        message:
          "Si el usuario existe, las administradoras recibirán una solicitud de aprobación.",
      });
    }

    // 1. Invalidar tokens anteriores para este usuario
    await prisma.adminRecoveryToken.updateMany({
      where: { username: admin.username, used: false },
      data: { used: true },
    });

    // 2. Crear nuevo token de aprobación (Válido por 1 hora)
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.adminRecoveryToken.create({
      data: {
        username: admin.username,
        token: token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        used: false,
      },
    });

    // 3. Configurar destinatarios (Dueñas)
    const owners = [
      process.env.DB_OWNER_EMAIL_1 || process.env.EMAIL_USER,
      process.env.DB_OWNER_EMAIL_2,
    ].filter(Boolean);

    // 4. Construir el enlace de aprobación
    const BASE_URL = (process.env.BASE_URL || "localhost:3000").replace(
      /\/$/,
      "",
    );
    const approvalLink = `${BASE_URL}/admin-reset?token=${token}`;

    // 5. Enviar el correo
    await transporter.sendMail({
      from: `"Eventos ITE" <${process.env.EMAIL_USER}>`,
      to: owners.join(", "),
      subject: "⚠️ Solicitud de recuperación de contraseña – Acción requerida",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;
                    border:1px solid #e0e0e0;border-radius:10px;overflow:hidden">
          <div style="background:#1b396a;padding:28px;text-align:center">
            <h1 style="color:#fff;margin:0;font-size:20px">
              🔐 Solicitud de Recuperación de Contraseña
            </h1>
          </div>
          <div style="padding:32px">
            <p style="font-size:15px;color:#333;margin-top:0">
              El administrador <strong style="color:#1b396a">${admin.username}</strong> 
              ha solicitado recuperar su contraseña en <strong>Eventos ITE</strong>.
            </p>
            <p style="font-size:14px;color:#555">
              Si reconoces esta solicitud, haz clic en el botón de abajo para aprobarla.<br>
              Esto permitirá al administrador establecer una nueva contraseña.<br><br>
              Si <strong>no</strong> reconoces esta solicitud, simplemente ignora este correo.
            </p>
            <div style="text-align:center;margin:32px 0">
              <a href="${approvalLink}" 
                 style="background:#1b396a;color:#fff;padding:14px 36px;border-radius:8px;
                        text-decoration:none;font-size:15px;font-weight:bold;display:inline-block">
                ✅ Aprobar solicitud
              </a>
            </div>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
            <p style="font-size:12px;color:#aaa;text-align:center;margin:0">
              Este enlace expira en <strong>1 hora</strong> · Usuario solicitado: <strong>${admin.username}</strong>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      message:
        "Solicitud enviada. Las administradoras recibirán un correo para aprobar el cambio.",
    });
  } catch (error) {
    // Esto imprimirá el error real en los logs de Vercel
    console.error("[adminRecovery] Error Detallado:", error);

    return NextResponse.json(
      {
        message: "Error interno del servidor.",
        details: error.message, // Útil para debug, quitar en producción si prefieres privacidad
      },
      { status: 500 },
    );
  }
}

// src/app/api/auth/adminRecovery/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req) {
  const { adminUser } = await req.json();

  if (!adminUser?.trim()) {
    return NextResponse.json(
      { message: "Escribe tu usuario de administrador" },
      { status: 400 },
    );
  }

  try {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

    // Borrar tokens anteriores del mismo usuario y crear uno nuevo
    await prisma.adminRecoveryToken.deleteMany({
      where: { username: adminUser },
    });
    await prisma.adminRecoveryToken.create({
      data: { username: adminUser, token, expiresAt },
    });

    const approvalLink = `${process.env.NEXT_PUBLIC_BASE_URL}/designs/adminApproval?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Eventos ITE - Sistema" <${process.env.EMAIL_USER}>`,
      to: "lizets018@gmail.com",
      subject: "⚠️ Solicitud de recuperación de contraseña - Admin",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #1b396a;">Solicitud de recuperación de contraseña</h2>
          <p>El usuario administrador <strong>${adminUser}</strong> ha solicitado recuperar su contraseña.</p>
          <p>Si autorizas el cambio, haz clic aquí para establecer una nueva contraseña:</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${approvalLink}"
              style="background: #1b396a; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 1rem;">
              Cambiar contraseña del administrador
            </a>
          </div>
          <p style="color: #888; font-size: 0.82rem;">
            Este enlace expira en <strong>30 minutos</strong>. Si no reconoces esta solicitud, ignora este correo.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      message:
        "Solicitud enviada. El propietario del sistema fue notificado y aprobará el cambio.",
    });
  } catch (error) {
    console.error("❌ Error en adminRecovery:", error);
    return NextResponse.json(
      { message: "Error al procesar la solicitud" },
      { status: 500 },
    );
  }
}

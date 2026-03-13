// src/app/api/auth/adminApproval/route.js
// Dueña confirma aprobación → envía correo al ADMIN con link para cambiar su contraseña
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { message: "Token requerido." },
        { status: 400 },
      );
    }

    // Validar token de aprobación
    const record = await prisma.adminRecoveryToken.findUnique({
      where: { token },
    });

    if (!record)
      return NextResponse.json(
        { message: "El enlace no es válido." },
        { status: 400 },
      );
    if (record.used)
      return NextResponse.json(
        { message: "Este enlace ya fue utilizado." },
        { status: 400 },
      );
    if (record.expiresAt < new Date())
      return NextResponse.json(
        { message: "El enlace ha expirado." },
        { status: 400 },
      );

    // Buscar correo del admin
    const admin = await prisma.adminCredentials.findUnique({
      where: { username: record.username },
    });

    if (!admin?.email) {
      return NextResponse.json(
        { message: "El administrador no tiene correo registrado." },
        { status: 400 },
      );
    }

    // Marcar token de aprobación como usado
    await prisma.adminRecoveryToken.update({
      where: { token },
      data: { used: true },
    });

    // Generar token de reset para el ADMIN (30 min)
    const resetToken = crypto.randomBytes(32).toString("hex");
    await prisma.adminRecoveryToken.create({
      data: {
        username: record.username,
        token: resetToken,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        used: false,
      },
    });

    // ✅ BASE_URL sin slash final para evitar doble //
    const BASE_URL = (process.env.BASE_URL || "http://localhost:3000").replace(
      /\/$/,
      "",
    );
    const resetLink = `${BASE_URL}/admin-reset?token=${resetToken}`;

    console.log("🔗 Link de reset generado:", resetLink);

    await transporter.sendMail({
      from: `"Eventos ITE" <${process.env.EMAIL_USER}>`,
      to: admin.email,
      subject: "✅ Tu solicitud fue aprobada – Restablece tu contraseña",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;
                    border:1px solid #e0e0e0;border-radius:10px;overflow:hidden">
          <div style="background:#27ae60;padding:28px;text-align:center">
            <h1 style="color:#fff;margin:0;font-size:20px">✅ Solicitud Aprobada</h1>
          </div>
          <div style="padding:32px">
            <p style="font-size:15px;color:#333;margin-top:0">
              Hola <strong style="color:#1b396a">${record.username}</strong>,
            </p>
            <p style="font-size:14px;color:#555">
              Las administradoras han <strong>aprobado</strong> tu solicitud.<br>
              Haz clic en el botón de abajo para establecer tu nueva contraseña.
            </p>
            <div style="text-align:center;margin:32px 0">
              <a href="${resetLink}"
                 style="background:#1b396a;color:#fff;padding:14px 36px;border-radius:8px;
                        text-decoration:none;font-size:15px;font-weight:bold;display:inline-block">
                🔑 Restablecer mi contraseña
              </a>
            </div>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
            <p style="font-size:12px;color:#aaa;text-align:center;margin:0">
              Este enlace expira en <strong>30 minutos</strong>.<br>
              Si no solicitaste este cambio, ignora este correo.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      message: `Aprobación confirmada. Se envió el enlace de restablecimiento a ${admin.email}.`,
    });
  } catch (error) {
    console.error("[adminApproval] Error:", error);
    return NextResponse.json(
      { message: "Error interno del servidor." },
      { status: 500 },
    );
  }
}

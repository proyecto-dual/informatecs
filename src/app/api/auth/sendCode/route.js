// src/app/api/auth/sendCode/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const { matricula, correo } = await req.json();

  const expectedEmail = `al${matricula}@ite.edu.mx`.toLowerCase();
  const providedEmail = correo?.trim().toLowerCase();

  if (providedEmail !== expectedEmail) {
    return NextResponse.json(
      {
        message: `El correo no corresponde a tu matrícula. Debe ser: al${matricula}@ite.edu.mx`,
      },
      { status: 400 },
    );
  }

  // 1. Verificar que la matrícula exista en la tabla principal de estudiantes
  const estudiante = await prisma.estudiantes.findUnique({
    where: { aluctr: matricula },
  });

  if (!estudiante) {
    return NextResponse.json(
      { message: "Matrícula no encontrada en el sistema" },
      { status: 404 },
    );
  }

  // 2. Buscar o crear en authStudents
  let student = await prisma.authStudents.findUnique({
    where: { matricula },
  });

  if (!student) {
    const nombreCompleto = [
      estudiante.alunom,
      estudiante.aluapp,
      estudiante.aluapm,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    student = await prisma.authStudents.create({
      data: {
        matricula,
        password: "",
        nombreCompleto,
        correo: providedEmail,
        isVerified: false,
      },
    });
  }

  // 3. Generar y enviar código
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Informatec" <${process.env.EMAIL_USER}>`,
      to: providedEmail,
      subject: "Código de verificación - Eventos ITE",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #1b396a;">Código de verificación</h2>
          <p>Hola, usa este código para restablecer tu contraseña:</p>
          <div style="font-size: 2rem; font-weight: bold; letter-spacing: 0.3rem; color: #1b396a; text-align: center; padding: 16px; background: #f0f4ff; border-radius: 8px;">
            ${code}
          </div>
          <p style="color: #888; font-size: 0.85rem; margin-top: 16px;">Este código expira en 10 minutos. Si no lo solicitaste, ignora este correo.</p>
        </div>
      `,
    });

    await prisma.authStudents.update({
      where: { matricula },
      data: {
        emailCode: code,
        correo: providedEmail,
      },
    });

    return NextResponse.json({
      message: "Código enviado al correo institucional",
    });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return NextResponse.json(
      { message: "Error enviando el correo", error: error.message },
      { status: 500 },
    );
  }
}

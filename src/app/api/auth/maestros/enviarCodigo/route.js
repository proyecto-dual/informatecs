import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const { percve, correo } = await req.json();

  if (!percve || !correo) {
    return NextResponse.json(
      { message: "ID y correo son obligatorios" },
      { status: 400 },
    );
  }

  // 1. Verificar que el maestro existe en authMaestros
  const authMaestro = await prisma.authMaestros.findUnique({
    where: { percve: parseInt(percve) },
  });

  if (!authMaestro) {
    return NextResponse.json(
      { message: "Maestro no encontrado" },
      { status: 404 },
    );
  }

  // 2. Verificar que el correo coincide con el registrado en la tabla maestros
  const maestro = await prisma.maestros.findUnique({
    where: { percve: parseInt(percve) },
    select: { perdce: true },
  });

  if (!maestro?.perdce) {
    return NextResponse.json(
      { message: "Este maestro no tiene correo registrado en el sistema" },
      { status: 400 },
    );
  }

  if (maestro.perdce.trim().toLowerCase() !== correo.trim().toLowerCase()) {
    return NextResponse.json(
      { message: "El correo no coincide con el registrado para este maestro" },
      { status: 400 },
    );
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
      from: `"Eventos ite" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: "Código de verificación",
      html: `<p>Tu código de verificación es: <strong>${code}</strong></p>`,
    });

    // 4. Guardar código y correo verificado en authMaestros
    await prisma.authMaestros.update({
      where: { percve: parseInt(percve) },
      data: {
        emailCode: code,
        correo,
      },
    });

    return NextResponse.json({ message: "Código enviado al correo" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return NextResponse.json(
      { message: "Error enviando el correo", error: error.message },
      { status: 500 },
    );
  }
}

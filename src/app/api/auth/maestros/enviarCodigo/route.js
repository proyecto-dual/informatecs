import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const { percve, correo } = await req.json();

  const maestro = await prisma.authMaestros.findUnique({
    where: { percve: parseInt(percve) },
  });

  if (!maestro) {
    return NextResponse.json({ message: 'Maestro no encontrado' }, { status: 404 });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Informatec" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: 'Código de verificación',
      html: `<p>Tu código de verificación es: <strong>${code}</strong></p>`,
    });

    await prisma.authMaestros.update({
      where: { percve: parseInt(percve) },
      data: {
        emailCode: code,
        correo,
      },
    });

    return NextResponse.json({ message: 'Código enviado al correo' });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return NextResponse.json({ message: 'Error enviando el correo', error: error.message }, { status: 500 });
  }
}

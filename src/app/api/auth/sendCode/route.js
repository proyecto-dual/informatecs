import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';




export async function POST(req) {
  const { matricula, correo } = await req.json();

  const student = await prisma.authStudents.findUnique({
    where: { matricula },
  });

  if (!student) {
    return NextResponse.json({ message: 'Estudiante no encontrado' }, { status: 404 });
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

    await prisma.authStudents.update({
      where: { matricula },
      data: {
        emailCode: code, // se guarda en la database xd
        correo,
      },
    });

    return NextResponse.json({ message: 'Código enviado al correo' });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return NextResponse.json({ message: 'Error enviando el correo', error: error.message }, { status: 500 });
  }
}

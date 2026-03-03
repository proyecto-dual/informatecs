import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';



export async function POST(req) {
  const { matricula, newPassword } = await req.json();

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.authStudents.update({
    where: { matricula },
    data: {
      password: hashedPassword,
      isVerified: true,
      emailCode: null,
    },
  });

  return NextResponse.json({ message: 'Contraseña actualizada ' });
}

import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const actividadesDisponibles = await prisma.ofertaSemestre.findMany({
      where: { 
        activa: true,
        semestre: '2024-2' // hacer dinamico después
      },
      include: {
        actividad: true
      },
      orderBy: {
        actividad: { aconco: 'asc' }
      }
    });

    return new Response(JSON.stringify(actividadesDisponibles), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

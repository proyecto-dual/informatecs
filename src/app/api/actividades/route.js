import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log("📥 Cargando todas las actividades...");
    
    const actividades = await prisma.actividades.findMany({
      include: {
        maestro: true, //  incluir relacion con maestros
      },
      orderBy: { aconco: 'asc' }
    });
    
    
    return Response.json(actividades);
  } catch (error) {
    console.error(' Error al cargar actividades:', error);
    return Response.json({ error: 'Error al obtener actividades' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const actividad = await prisma.actividades.create({
      data: {
        acocve: data.acocve,
        aticve: data.aticve,
        aconco: data.aconco,
        acodes: data.acodes,
        acocre: data.acocre,
        acohrs: data.acohrs,
        depcve: data.depcve,
        puecve: data.puecve
      }
    });
    return Response.json(actividad);
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Error al crear actividad' }, { status: 500 });
  }
}

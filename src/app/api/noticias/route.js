// app/api/noticias/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// GET - Obtener todas las noticias y eventos
export async function GET() {
  try {
    const { data: noticias, error: errorNoticias } = await supabase
      .from("noticias")
      .select("*")
      .order("createdAt", { ascending: false });

    const { data: eventos, error: errorEventos } = await supabase
      .from("eventos")
      .select("*")
      .order("createdAt", { ascending: false });

    if (errorNoticias || errorEventos) {
      throw new Error(errorNoticias?.message || errorEventos?.message);
    }

    return NextResponse.json({
      noticias: noticias || [],
      eventos: eventos || [],
    });
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json({
      noticias: [],
      eventos: [],
      error: error.message,
    });
  }
}

// POST - Crear noticia o evento
export async function POST(request) {
  try {
    const newItem = await request.json();
    const id = Date.now().toString();

    if (newItem.type === "noticia") {
      const { error } = await supabase.from("noticias").insert({
        id,
        titulo: newItem.titulo,
        descripcion: newItem.descripcion,
        fecha: newItem.fecha,
        imagen: newItem.imagen || "",
        createdAt: new Date().toISOString(),
      });
      if (error) throw error;
    } else if (newItem.type === "evento") {
      const { error } = await supabase.from("eventos").insert({
        id,
        titulo: newItem.titulo,
        descripcion: newItem.descripcion,
        fecha: newItem.fecha,
        ubicacion: newItem.ubicacion,
        imagen: newItem.imagen || "",
        createdAt: new Date().toISOString(),
      });
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en POST:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// PUT - Actualizar noticia o evento
export async function PUT(request) {
  try {
    const updatedItem = await request.json();

    if (updatedItem.type === "noticia") {
      const { error } = await supabase
        .from("noticias")
        .update({
          titulo: updatedItem.titulo,
          descripcion: updatedItem.descripcion,
          fecha: updatedItem.fecha,
          imagen: updatedItem.imagen || "",
        })
        .eq("id", updatedItem.id);
      if (error) throw error;
    } else if (updatedItem.type === "evento") {
      const { error } = await supabase
        .from("eventos")
        .update({
          titulo: updatedItem.titulo,
          descripcion: updatedItem.descripcion,
          fecha: updatedItem.fecha,
          ubicacion: updatedItem.ubicacion,
          imagen: updatedItem.imagen || "",
        })
        .eq("id", updatedItem.id);
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en PUT:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar noticia o evento
export async function DELETE(request) {
  try {
    const { id, type } = await request.json();

    if (type === "noticia") {
      const { error } = await supabase.from("noticias").delete().eq("id", id);
      if (error) throw error;
    } else if (type === "evento") {
      const { error } = await supabase.from("eventos").delete().eq("id", id);
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en DELETE:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

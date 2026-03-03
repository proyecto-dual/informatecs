"use client";
import React, { useState, useEffect } from "react";
import {
  FilePlus,
  Edit2,
  Trash2,
  XCircle,
  CalendarPlus,
  Image,
} from "lucide-react";

const AdminPanel = () => {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newsForm, setNewsForm] = useState({
    title: "",
    content: "",
    date: "",
    image: "",
  });
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    image: "",
  });
  const [editingNews, setEditingNews] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const [newsImagePreview, setNewsImagePreview] = useState("");
  const [eventImagePreview, setEventImagePreview] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch("/api/noticias");
      if (response.ok) {
        const data = await response.json();
        setNews(data.noticias || []);
        setEvents(data.eventos || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const handleNewsImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen es muy grande. Máximo 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setNewsForm({ ...newsForm, image: base64String });
        setNewsImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEventImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen es muy grande. Máximo 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setEventForm({ ...eventForm, image: base64String });
        setEventImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const addNews = async () => {
    if (!newsForm.title || !newsForm.content || !newsForm.date) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      const response = await fetch("/api/noticias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "noticia",
          titulo: newsForm.title,
          descripcion: newsForm.content,
          fecha: newsForm.date,
          imagen: newsForm.image,
        }),
      });

      if (response.ok) {
        await loadData();
        setNewsForm({ title: "", content: "", date: "", image: "" });
        setNewsImagePreview("");
        alert("¡Noticia publicada exitosamente!");
      } else {
        const result = await response.json();
        alert("Error: " + (result.error || "No se pudo publicar"));
      }
    } catch (error) {
      alert("Error al guardar la noticia: " + error.message);
    }
  };

  const updateNews = async () => {
    if (!newsForm.title || !newsForm.content || !newsForm.date) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      const response = await fetch("/api/noticias", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "noticia",
          id: editingNews.id,
          titulo: newsForm.title,
          descripcion: newsForm.content,
          fecha: newsForm.date,
          imagen: newsForm.image,
        }),
      });

      if (response.ok) {
        await loadData();
        setEditingNews(null);
        setNewsForm({ title: "", content: "", date: "", image: "" });
        setNewsImagePreview("");
        alert("¡Noticia actualizada exitosamente!");
      }
    } catch (error) {
      alert("Error al actualizar la noticia");
    }
  };

  const deleteNews = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta noticia?")) {
      try {
        const response = await fetch("/api/noticias", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "noticia", id }),
        });

        if (response.ok) {
          await loadData();
          alert("Noticia eliminada");
        }
      } catch (error) {
        alert("Error al eliminar la noticia");
      }
    }
  };

  const addEvent = async () => {
    if (
      !eventForm.title ||
      !eventForm.description ||
      !eventForm.date ||
      !eventForm.location
    ) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      const response = await fetch("/api/noticias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "evento",
          titulo: eventForm.title,
          descripcion: eventForm.description,
          fecha: eventForm.date,
          ubicacion: eventForm.location,
          imagen: eventForm.image,
        }),
      });

      if (response.ok) {
        await loadData();
        setEventForm({
          title: "",
          description: "",
          date: "",
          location: "",
          image: "",
        });
        setEventImagePreview("");
        alert("¡Evento publicado exitosamente!");
      }
    } catch (error) {
      alert("Error al guardar el evento");
    }
  };

  const updateEvent = async () => {
    if (
      !eventForm.title ||
      !eventForm.description ||
      !eventForm.date ||
      !eventForm.location
    ) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      const response = await fetch("/api/noticias", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "evento",
          id: editingEvent.id,
          titulo: eventForm.title,
          descripcion: eventForm.description,
          fecha: eventForm.date,
          ubicacion: eventForm.location,
          imagen: eventForm.image,
        }),
      });

      if (response.ok) {
        await loadData();
        setEditingEvent(null);
        setEventForm({
          title: "",
          description: "",
          date: "",
          location: "",
          image: "",
        });
        setEventImagePreview("");
        alert("¡Evento actualizado exitosamente!");
      }
    } catch (error) {
      alert("Error al actualizar el evento");
    }
  };

  const deleteEvent = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este evento?")) {
      try {
        const response = await fetch("/api/noticias", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "evento", id }),
        });

        if (response.ok) {
          await loadData();
          alert("Evento eliminado");
        }
      } catch (error) {
        alert("Error al eliminar el evento");
      }
    }
  };

  const startEditNews = (item) => {
    setEditingNews(item);
    setNewsForm({
      title: item.titulo,
      content: item.descripcion,
      date: item.fecha,
      image: item.imagen || "",
    });
    setNewsImagePreview(item.imagen || "");
  };

  const startEditEvent = (item) => {
    setEditingEvent(item);
    setEventForm({
      title: item.titulo,
      description: item.descripcion,
      date: item.fecha,
      location: item.ubicacion,
      image: item.imagen || "",
    });
    setEventImagePreview(item.imagen || "");
  };

  const cancelEdit = () => {
    setEditingNews(null);
    setEditingEvent(null);
    setNewsForm({ title: "", content: "", date: "", image: "" });
    setEventForm({
      title: "",
      description: "",
      date: "",
      location: "",
      image: "",
    });
    setNewsImagePreview("");
    setEventImagePreview("");
  };

  if (loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>Cargando...</div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1
        style={{
          textAlign: " center",
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "0px",
        }}
      >
        Publicar Noticias
      </h1>

      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          marginBottom: "30px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
        >
          Gestionar Noticias
        </h2>

        <div
          style={{
            backgroundColor: "#f0f9ff",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "15px",
            }}
          >
            {editingNews && <Edit2 size={20} />}{" "}
            {editingNews ? "Editar Noticia" : "Nueva Noticia"}
          </h3>

          <input
            type="text"
            value={newsForm.title}
            onChange={(e) =>
              setNewsForm({ ...newsForm, title: e.target.value })
            }
            placeholder="Título de la noticia"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />

          <textarea
            value={newsForm.content}
            onChange={(e) =>
              setNewsForm({ ...newsForm, content: e.target.value })
            }
            placeholder="Contenido de la noticia"
            rows="4"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />

          <input
            type="date"
            value={newsForm.date}
            onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />

          <div
            style={{
              border: "2px dashed #ddd",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            <label
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Image size={30} />
              <span>Subir Imagen (Opcional - Máx 5MB)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleNewsImageUpload}
                style={{ display: "none" }}
              />
              <span style={{ color: "#4f46e5", textDecoration: "underline" }}>
                Click para seleccionar archivo
              </span>
            </label>
            {newsImagePreview && (
              <div style={{ marginTop: "15px" }}>
                <img
                  src={newsImagePreview}
                  alt="Preview"
                  style={{ maxHeight: "150px", borderRadius: "8px" }}
                />
                <button
                  onClick={() => {
                    setNewsImagePreview("");
                    setNewsForm({ ...newsForm, image: "" });
                  }}
                  style={{
                    display: "block",
                    margin: "10px auto",
                    padding: "5px 15px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  <XCircle size={16} /> Eliminar imagen
                </button>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={editingNews ? updateNews : addNews}
              style={{
                padding: "12px 24px",
                backgroundColor: "#4f46e5",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {editingNews ? <Edit2 size={20} /> : <FilePlus size={20} />}
              {editingNews ? "Guardar Cambios" : "Publicar Noticia"}
            </button>
            {editingNews && (
              <button
                onClick={cancelEdit}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <XCircle size={20} /> Cancelar
              </button>
            )}
          </div>
        </div>

        <div>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "15px",
            }}
          >
            Noticias Publicadas ({news.length})
          </h3>
          {news.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>
              No hay noticias publicadas
            </p>
          ) : (
            news.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: "15px",
                  padding: "15px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              >
                {item.imagen && (
                  <img
                    src={item.imagen}
                    alt={item.titulo}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: "bold", marginBottom: "5px" }}>
                    {item.titulo}
                  </h4>
                  <p
                    style={{
                      color: "#666",
                      marginBottom: "5px",
                      fontSize: "14px",
                    }}
                  >
                    {item.descripcion}
                  </p>
                  <p style={{ fontSize: "12px", color: "#4f46e5" }}>
                    📅 {new Date(item.fecha).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <div
                  style={{ display: "flex", gap: "5px", alignItems: "center" }}
                >
                  <button
                    onClick={() => startEditNews(item)}
                    style={{
                      padding: "10px",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteNews(item.id)}
                    style={{
                      padding: "10px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

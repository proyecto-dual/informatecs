import { useState, useEffect, useMemo, useCallback } from "react";

const normalizarDia = (dia) => {
  if (!dia) return dia;
  return dia.charAt(0).toUpperCase() + dia.slice(1).toLowerCase();
};

export function useHorarioData() {
  const [inscripciones, setInscripciones] = useState([]);
  const [actividadesPersonales, setActividadesPersonales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);

  const loadData = useCallback(async (numeroControl) => {
    if (!numeroControl) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/inscripciones?aluctr=${numeroControl}`);
      const data = await res.json();
      if (Array.isArray(data)) setInscripciones(data);
    } catch (err) {
      console.error("❌ Error al cargar inscripciones:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("studentData");
    if (stored) {
      const parsed = JSON.parse(stored);
      setStudentData(parsed);
      loadData(parsed.numeroControl);
    } else {
      setLoading(false);
    }

    const personalStored = localStorage.getItem("actividadesPersonales");
    if (personalStored) {
      setActividadesPersonales(JSON.parse(personalStored));
    }
  }, [loadData]);

  // --- 1. ACTIVIDADES PERSONALES AGRUPADAS (Para ListaView) ---
  // Esta es la clave para que NO se repitan las tarjetas en la lista
  const agrupadasParaLista = useMemo(() => {
    const agrupadas = [];
    const procesadas = new Set();

    actividadesPersonales.forEach((act) => {
      if (procesadas.has(act.nombre)) return;

      const instancias = actividadesPersonales.filter(
        (a) => a.nombre === act.nombre,
      );
      procesadas.add(act.nombre);

      const diasPresentes = instancias.map((i) => normalizarDia(i.dia));
      const horariosEspeciales = {};

      instancias.forEach((inst) => {
        const diaNorm = normalizarDia(inst.dia);
        if (inst.horariosEspeciales?.[diaNorm]) {
          horariosEspeciales[diaNorm] = inst.horariosEspeciales[diaNorm];
        }
      });

      agrupadas.push({
        ...act,
        diasPresentes,
        horariosEspeciales,
        tipo: "personal",
      });
    });
    return agrupadas;
  }, [actividadesPersonales]);

  // --- 2. TODAS LAS ACTIVIDADES EXPANDIDAS (Para CalendarioView) ---
  const allActivities = useMemo(() => {
    // Mapear inscripciones
    const inscritasMapped = inscripciones.flatMap((insc) => {
      const act = insc.actividad || insc;
      const horario = act?.horario;
      if (!horario?.dias) return [];
      const diasArray = Array.isArray(horario.dias)
        ? horario.dias
        : [horario.dias];

      return diasArray.map((dia) => ({
        id: `insc-${insc.id || act.aticve}-${dia}`,
        nombre: act.aconco || act.nombre || "Materia",
        dia: normalizarDia(dia),
        horaInicio: horario.horaInicio || "08:00",
        horaFin: horario.horaFin || "09:00",
        ubicacion: horario.salon || "Por asignar",
        color: "#1b396a",
        tipo: "inscrita",
      }));
    });

    // Expandir las agrupadas para el calendario
    const personalesMapped = agrupadasParaLista.flatMap((act) => {
      return (act.diasPresentes || [act.dia]).map((dia) => {
        const hEsp = act.horariosEspeciales?.[dia];
        return {
          ...act,
          dia: normalizarDia(dia),
          horaInicio: hEsp?.horaInicio || act.horaInicio,
          horaFin: hEsp?.horaFin || act.horaFin,
          actividadOriginal: act,
        };
      });
    });

    return [...inscritasMapped, ...personalesMapped];
  }, [inscripciones, agrupadasParaLista]);

  // --- 3. RANGO HORARIO ---
  const { horasVisibles, primeraHora } = useMemo(() => {
    if (allActivities.length === 0) {
      return {
        horasVisibles: Array.from({ length: 11 }, (_, i) => i + 8),
        primeraHora: 8,
      };
    }
    const inicios = allActivities.map((a) =>
      parseInt(a.horaInicio.split(":")[0]),
    );
    const fines = allActivities.map((a) => parseInt(a.horaFin.split(":")[0]));
    const min = Math.min(8, ...inicios);
    const max = Math.max(18, ...fines);
    return {
      horasVisibles: Array.from({ length: max - min + 1 }, (_, i) => i + min),
      primeraHora: min,
    };
  }, [allActivities]);

  return {
    loading,
    studentData,
    inscripciones,
    actividadesPersonales, // Array crudo
    agrupadasParaLista, // ✅ Array agrupado (Mate una sola vez con sus días)
    setActividadesPersonales,
    allActivities, // Array expandido (Para el grid)
    horasVisibles,
    primeraHora,
    loadData,
  };
}

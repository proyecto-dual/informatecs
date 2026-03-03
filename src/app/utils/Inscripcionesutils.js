// ─── Clasificador de tipo de actividad ───────────────────────────────────────

export const obtenerTipoActividad = (codigo, nombreActividad, descripcion) => {
  const codigoUpper = (codigo || "").toUpperCase().trim();
  const textoCompleto = `${(nombreActividad || "").toUpperCase()} ${(descripcion || "").toUpperCase()}`;

  const match = (list) => list.some((p) => textoCompleto.includes(p));

  if (codigoUpper === "D") return "DEPORTIVA";
  if (
    match([
      "FUTBOL",
      "SOCCER",
      "VOLEIBOL",
      "VOLLEYBALL",
      "BEISBOL",
      "BASEBALL",
      "SOFTBOL",
      "SOFTBALL",
      "BASQUETBOL",
      "BASKETBALL",
      "ATLETISMO PISTA",
      "ATLETISMO CAMPO",
      "NATACION",
      "SWIMMING",
      "TENIS DE MESA",
      "TENIS ",
      " TENIS",
      "TENNIS",
      "AJEDREZ",
      "CHESS",
      "ACTIVIDAD DEPORTIVA",
      "EVENTO DEPORTIVO",
    ])
  )
    return "DEPORTIVA";
  if (
    match([
      "TUTORIA",
      "TUTORIAS",
      "TALLER TALENTO",
      "TICS",
      "TECNOLOGIA",
      "CONGRESO GENERAL",
      "INVESTIGACION",
      "RALLY LATINOAMERICANO",
      "RALLY CB",
      "RALLY DE CIENCIAS",
      "ENCUENTRO NACIONAL",
      "ARGOS",
      "CLUB TECNOLOGICO",
      "EVENTO EXTERNO",
      "CONCURSO CB",
      "ANFEI",
      "MOOCS DEPORTIVOS",
    ])
  )
    return "OTRA";
  if (
    match([
      "ACT CIVICAS",
      "ACTIVIDAD CIVICA",
      "ACTIVIDADES CIVICAS",
      "ESCOLTA",
      "CENTRO DE ACOPIO",
      "CARRERA ALBATROS",
      "COLILLATON",
    ])
  )
    return "CIVICA";
  if (
    match([
      "ACT CULTURALES",
      "ACT ARTISTICAS",
      "MUSICA",
      "DANZA FOLCLORICA",
      "DANZA FOLKLORICA",
      "ARTES VISUALES",
      "ALTAR DE MUERTOS",
      "CLUB DE LECTURA",
      "CATRINES",
      "CATRINAS",
      "BANDA DE GUERRA",
      "MOOCS CULTURALES",
    ])
  )
    return "CULTURAL";
  if (codigoUpper === "C") return "CULTURAL";
  return "OTRA";
};

// ─── Filtro de inscripciones según filtros activos ────────────────────────────

export const filtrarInscripciones = (
  inscritos,
  { filtroSemestre, filtroSexo, filtroProposito },
) => {
  const sexoNum = filtroSexo === "M" ? 1 : filtroSexo === "F" ? 2 : null;
  return inscritos.filter(
    (i) =>
      (!filtroSemestre ||
        i.estudiante?.calnpe?.toString() === filtroSemestre) &&
      (!filtroSexo || i.estudiante?.alusex === sexoNum) &&
      (!filtroProposito || i.formularioData?.purpose === filtroProposito),
  );
};

// ─── Cálculo de totales ───────────────────────────────────────────────────────

export const calcularTotales = (
  actividadesFiltradas,
  inscripciones,
  filtros,
) => {
  const unicos = new Set();
  const porSexo = { M: new Set(), F: new Set() };
  const porTipo = {
    CIVICA: new Set(),
    CULTURAL: new Set(),
    DEPORTIVA: new Set(),
    OTRA: new Set(),
  };
  const porProp = {
    creditos: new Set(),
    servicio_social: new Set(),
    por_gusto: new Set(),
  };

  actividadesFiltradas.forEach((oferta) => {
    const tipo = obtenerTipoActividad(
      oferta.actividad?.aticve,
      oferta.actividad?.aconco,
      oferta.actividad?.acodes,
    );
    const filtrados = filtrarInscripciones(
      inscripciones[oferta.actividadId] || [],
      filtros,
    );

    if (filtrados.length > 0) porTipo[tipo].add(oferta.actividadId);

    filtrados.forEach((i) => {
      const nc = i.estudiante?.aluctr;
      const p = i.formularioData?.purpose;
      if (!nc) return;
      unicos.add(nc);
      if (i.estudiante?.alusex === 1) porSexo.M.add(nc);
      else if (i.estudiante?.alusex === 2) porSexo.F.add(nc);
      if (p && porProp[p]) porProp[p].add(nc);
    });
  });

  return {
    totalEstudiantes: unicos.size,
    totalActividades: actividadesFiltradas.length,
    porSexo: { M: porSexo.M.size, F: porSexo.F.size },
    porTipoActividad: {
      CIVICA: porTipo.CIVICA.size,
      CULTURAL: porTipo.CULTURAL.size,
      DEPORTIVA: porTipo.DEPORTIVA.size,
      OTRA: porTipo.OTRA.size,
    },
    porProposito: {
      creditos: porProp.creditos.size,
      servicio_social: porProp.servicio_social.size,
      por_gusto: porProp.por_gusto.size,
    },
  };
};

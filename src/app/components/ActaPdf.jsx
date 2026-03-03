import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: "40 50 120 50", // Espacio amplio abajo para el footer
    fontSize: 9,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  headerLogos: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    height: 60, // Reservamos el espacio
  },
  logoEducacion: { width: 280 },
  logoTecNM: { width: 120 },

  titleSection: {
    textAlign: "center",
    marginBottom: 20,
  },
  mainTitle: { fontSize: 11, fontWeight: "bold" },

  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },

  table: { display: "table", width: "auto" },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    minHeight: 20,
    alignItems: "center",
  },
  tableHeader: { backgroundColor: "#f0f0f0", fontWeight: "bold" },

  colIndex: { width: "8%" },
  colControl: { width: "18%" },
  colNombre: { width: "54%" },
  colCalif: { width: "20%", textAlign: "center" },
  cell: { padding: 4 },

  signatureSection: { marginTop: 40, alignItems: "center" },
  signatureLine: { borderTopWidth: 1, width: 220, marginBottom: 5 },

  footerPagina: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  logoFooter: { width: 500 },
});

const ActaPDF = ({ materia, maestro, calificaciones }) => {
  // Función para obtener la URL completa.
  // En Next.js, las imágenes en /public se sirven en la raíz /
  const getLogoPath = (name) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/imagenes/${name}`;
    }
    return "";
  };

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* 1. Logos del Header */}
        <View style={styles.headerLogos}>
          <Image
            src={getLogoPath("educacionlogo.png")}
            style={styles.logoEducacion}
            cache={false} // Evita problemas de caché durante desarrollo
          />
          <Image
            src={getLogoPath("tecnologo.png")}
            style={styles.logoTecNM}
            cache={false}
          />
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>
            INSTITUTO TECNOLÓGICO DE ENSENADA
          </Text>
          <Text style={{ fontWeight: "bold", textAlign: "center" }}>
            ACTA DE CALIFICACIONES - ACTIVIDADES COMPLEMENTARIAS
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <View>
            <Text>
              <Text style={{ fontWeight: "bold" }}>Actividad:</Text>{" "}
              {materia?.aconco || materia?.aticve}
            </Text>
            <Text>
              <Text style={{ fontWeight: "bold" }}>Maestro:</Text>{" "}
              {maestro?.nombreCompleto}
            </Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text>Código: {materia?.aticve}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.cell, styles.colIndex]}>No.</Text>
            <Text style={[styles.cell, styles.colControl]}>Control</Text>
            <Text style={[styles.cell, styles.colNombre]}>
              Nombre del Estudiante
            </Text>
            <Text style={[styles.cell, styles.colCalif]}>Calif.</Text>
          </View>

          {(materia?.inscripact || []).map((ins, i) => (
            <View key={ins.estudiante.aluctr} style={styles.tableRow}>
              <Text style={[styles.cell, styles.colIndex]}>{i + 1}</Text>
              <Text style={[styles.cell, styles.colControl]}>
                {ins.estudiante.aluctr}
              </Text>
              <Text style={[styles.cell, styles.colNombre]}>
                {`${ins.estudiante.alunom} ${ins.estudiante.aluapp} ${ins.estudiante.aluapm || ""}`}
              </Text>
              <Text style={[styles.cell, styles.colCalif]}>
                {calificaciones[ins.estudiante.aluctr]?.calificacion || "N/A"}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureLine} />
          <Text style={{ fontWeight: "bold" }}>{maestro?.nombreCompleto}</Text>
          <Text>Firma del Maestro Asesor</Text>
        </View>

        {/* 2. Logo del Footer */}
        <View style={styles.footerPagina} fixed>
          <Image
            src={getLogoPath("logofooter.png")}
            style={styles.logoFooter}
            cache={false}
          />
        </View>
      </Page>
    </Document>
  );
};

export default ActaPDF;

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
    padding: "40 50 60 50", // Padding balanceado al no tener imagen de fondo
    fontSize: 9,
    fontFamily: "Helvetica",
    lineHeight: 1.2,
  },
  headerLogos: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoEducacion: { width: 220 },
  logoTecNM: { width: 90 },
  topInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottomWidth: 0.5,
    paddingBottom: 10,
  },
  titleColumn: { width: "60%", textAlign: "right" },
  bold: { fontWeight: "bold" },

  // Tabla de datos
  table: { display: "table", width: "100%", marginTop: 10 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderBottomWidth: 1,
    height: 25,
    alignItems: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    minHeight: 25,
    alignItems: "center",
  },
  colNo: { width: "8%", textAlign: "center" },
  colNombre: { width: "42%", paddingLeft: 5 },
  colAct: { width: "20%" },
  colEquipo: { width: "15%" },
  colFirma: {
    width: "15%",
    borderLeftWidth: 0.5,
    borderLeftColor: "#ccc",
    height: "100%",
  },

  // Sección de Firmas y Sello
  footerSection: {
    marginTop: 40,
  },
  atentamenteBlock: {
    marginBottom: 10,
  },
  lemaText: {
    fontStyle: "italic",
    fontSize: 8,
  },
  firmaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 35,
  },
  firmaLine: {
    width: 220,
    borderTopWidth: 1,
    paddingTop: 5,
    textAlign: "center",
  },
  selloBox: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 8,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

export const CedulaPDF = ({ filtrados }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      {/* 1. Encabezado con Logos Institucionales */}
      <View style={styles.headerLogos}>
        <Image src="/imagenes/educacionlogo.png" style={styles.logoEducacion} />
        <Image src="/imagenes/tecnologo.png" style={styles.logoTecNM} />
      </View>

      {/* 2. Información de Control y Títulos */}
      <View style={styles.topInfoContainer}>
        <View style={{ width: "40%" }}>
          <Text style={styles.bold}>
            Cédula: {new Date().getFullYear()}-REG
          </Text>
          <Text style={{ fontSize: 7 }}>Control de Asistencia Oficial</Text>
        </View>
        <View style={styles.titleColumn}>
          <Text style={[styles.bold, { fontSize: 11 }]}>
            Cédula de Registro y Control de Asistencia
          </Text>
          <Text style={{ fontSize: 9 }}>DEPARTAMENTO DE EXTRAESCOLARES</Text>
        </View>
      </View>

      {/* 3. Listado de Participantes */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.colNo}>#</Text>
          <Text style={styles.colNombre}>Nombre del Atleta</Text>
          <Text style={styles.colAct}>Actividad</Text>
          <Text style={styles.colEquipo}>Equipo/Rol</Text>
          <Text style={styles.colFirma}>Firma</Text>
        </View>

        {filtrados.map((p, idx) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={styles.colNo}>{idx + 1}</Text>
            <Text style={[styles.colNombre, styles.bold]}>
              {p.nombre.toUpperCase()}
            </Text>
            <Text style={styles.colAct}>{p.actividad}</Text>
            <Text style={styles.colEquipo}>{p.rol}</Text>
            <View style={styles.colFirma} />
          </View>
        ))}
      </View>

      {/* 4. Bloque de Validación Final */}
      <View style={styles.footerSection} wrap={false}>
        <View style={styles.atentamenteBlock}>
          <Text style={styles.bold}>Atentamente</Text>
          <Text style={styles.lemaText}>
            «Excelencia en Educación Tecnológica»
          </Text>
          <Text style={styles.lemaText}>
            «Por la tecnología de hoy y del futuro»
          </Text>
        </View>

        <View style={styles.firmaContainer}>
          <View style={styles.firmaLine}>
            <Text style={styles.bold}>Juan Carlos Leal Nodal</Text>
            <Text>Promotor de Actividades Extraescolares</Text>
          </View>

          <View style={styles.selloBox}>
            <Text style={{ fontSize: 7, color: "#ccc" }}>SELLO</Text>
          </View>
        </View>
      </View>

      {/* Numeración de página automática */}
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  </Document>
);

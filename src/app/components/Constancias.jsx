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
    padding: "30 50 40 50", // Reducido el padding inferior de 120 a 40 para evitar saltos
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.2,
  },
  // Logos superiores
  headerLogos: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoEducacion: { width: 280 }, // Reducido ligeramente para ganar altura
  logoTecNM: { width: 120 },

  // Folio y Título
  topInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30, // Reducido de 60 a 30
  },
  folioColumn: { width: "40%" },
  titleColumn: {
    width: "60%",
    textAlign: "right",
  },
  bold: { fontWeight: "bold" },

  mainTitle: { fontSize: 11, fontWeight: "bold" },
  subTitle: { fontSize: 11, fontWeight: "bold", marginTop: 2 },

  // Cuerpo
  destinatario: { marginBottom: 20 },
  parrafo: { textAlign: "justify", marginBottom: 10 },

  // --- SECCIÓN DE FIRMA Y QR (CORREGIDA) ---
  firmaYQrContainer: {
    marginTop: 25,
  },
  atentamenteBlock: {
    marginBottom: 10,
  },
  atentamenteText: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  lemaText: {
    fontStyle: "italic",
    fontSize: 8,
  },
  firmaYQrFlex: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end", // Alinea el QR con la base de la firma
  },
  firmaBlock: {
    width: 250,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderColor: "black",
    width: "100%",
    marginTop: 40, // Espacio para la firma física
    marginBottom: 5,
  },
  qrContainer: {
    alignItems: "center",
    width: 90,
  },
  qrImage: {
    width: 75,
    height: 75,
  },
  qrText: {
    fontSize: 7,
    marginTop: 3,
    textAlign: "center",
  },

  // Footer fijo (Imagen de fondo inferior)
  footerPagina: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: "center",
  },
  logoFooterImg: {
    width: "100%",
    height: "auto",
  },
});

export const ConstanciaPDF = ({ datos }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      {/* 1. Logos */}
      <View style={styles.headerLogos}>
        <Image src="/imagenes/educacionlogo.png" style={styles.logoEducacion} />
        <Image src="/imagenes/tecnologo.png" style={styles.logoTecNM} />
      </View>

      {/* 2. Folio y Títulos */}
      <View style={styles.topInfoContainer}>
        <View style={styles.folioColumn}>
          <Text style={styles.bold}>Folio: {datos?.folio}</Text>
          <Text style={{ fontSize: 8 }}>
            Código: {datos?.codigoVerificacion || datos?.codigo}
          </Text>
        </View>
        <View style={styles.titleColumn}>
          <Text style={styles.mainTitle}>
            Constancia de Acreditación de Actividad
          </Text>
          <Text style={styles.mainTitle}>Complementaria</Text>
          <Text style={styles.subTitle}>
            {datos?.acreditacion?.includes("Horas")
              ? "Liberación de horas"
              : datos?.acreditacion?.includes("Créditos")
                ? "Liberación de créditos"
                : "Constancia de participación"}
          </Text>
        </View>
      </View>

      {/* 3. Destinatario */}
      <View style={styles.destinatario}>
        <Text>A quien corresponda</Text>
        <Text style={[styles.bold, { marginTop: 10 }]}>Presente</Text>
      </View>

      {/* 4. Cuerpo del Texto */}
      <View style={styles.parrafo}>
        <Text>
          Se envía un cordial saludo y a su vez se le extiende la presente
          constancia al (la) alumno (a):{" "}
          <Text style={styles.bold}>
            {datos?.nombreCompleto || datos?.nombre}
          </Text>
          , con número de control{" "}
          <Text style={styles.bold}>
            {datos?.numeroControl || datos?.control}
          </Text>
          , quien ha participado en la actividad complementaria:{" "}
          <Text style={styles.bold}>
            {datos?.actividadNombre || datos?.actividad}
          </Text>
          , en el período <Text style={styles.bold}>{datos?.periodo}</Text>,
          bajo la asesoría de Juan Carlos Leal Nodal, obteniendo una
          acreditación de <Text style={styles.bold}>{datos?.acreditacion}</Text>{" "}
          conforme a las disposiciones del ITE.
        </Text>
      </View>

      <Text style={styles.parrafo}>
        Por lo que agradezco su atención para las gestiones necesarias que se
        requieran.
      </Text>

      <Text style={styles.parrafo}>Saludos.</Text>

      {/* 5. Bloque de Firma y QR Corregido */}
      <View style={styles.firmaYQrContainer}>
        <View style={styles.atentamenteBlock}>
          <Text style={styles.atentamenteText}>Atentamente</Text>
          <Text style={styles.lemaText}>
            «Excelencia en Educación Tecnológica»
          </Text>
          <Text style={styles.lemaText}>
            «Por la tecnología de hoy y del futuro»
          </Text>
        </View>

        <View style={styles.firmaYQrFlex}>
          <View style={styles.firmaBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.bold}>Juan Carlos Leal Nodal</Text>
            <Text>Departamento de Actividades Extraescolares</Text>
          </View>

          <View style={styles.qrContainer}>
            {datos?.qrData && (
              <Image src={datos.qrData} style={styles.qrImage} />
            )}
            <Text style={styles.qrText}>Escanea para verificar</Text>
          </View>
        </View>
      </View>

      {/* Footer Fijo */}
      <View style={styles.footerPagina} fixed>
        <Image src="/imagenes/logofooter.png" style={styles.logoFooterImg} />
      </View>
    </Page>
  </Document>
);

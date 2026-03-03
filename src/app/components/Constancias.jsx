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
    padding: "40 50 120 50",
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  // Logos en los extremos superiores
  headerLogos: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  logoEducacion: { width: 350 },
  logoTecNM: { width: 150 },

  // Sección de Folio a la izquierda y Título a la derecha
  topInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 60,
  },
  folioColumn: { width: "40%" },
  titleColumn: {
    width: "60%",
    textAlign: "right",
  },
  bold: { fontWeight: "bold" },

  mainTitle: { fontSize: 11, fontWeight: "bold" },
  subTitle: { fontSize: 11, fontWeight: "bold", marginTop: 2 },

  // Cuerpo del documento
  section: { marginBottom: 20 },
  destinatario: { marginBottom: 30 },
  parrafo: { textAlign: "justify", marginBottom: 15 },

  // Firma y QR alineados
  footerSign: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  signatureLine: {
    borderTopWidth: 1,
    borderColor: "black",
    width: 250,
    marginTop: 60,
    marginBottom: 5,
  },
  qrContainer: {
    alignItems: "center",
    width: 100,
  },
  qrImage: { width: 80, height: 80 },

  footerPagina: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 7,
    color: "#333",
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

      {/* 2. Folio y Títulos Superiores */}
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
        <Text style={[styles.bold, { marginTop: 15 }]}>Presente</Text>
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

      {/* 5. Firma y QR */}
      <View style={{ marginTop: 40 }}>
        <Text style={styles.bold}>Atentamente</Text>
        <Text style={{ fontStyle: "italic", fontSize: 9 }}>
          «Excelencia en Educación Tecnológica»
        </Text>
        <Text style={{ fontStyle: "italic", fontSize: 9 }}>
          «Por la tecnología de hoy y del futuro»
        </Text>
      </View>

      <View style={styles.footerSign}>
        <View>
          <View style={styles.signatureLine} />
          <Text>Juan Carlos Leal Nodal</Text>
          <Text>Departamento de Actividades Extracurriculares</Text>
        </View>

        <View style={styles.qrContainer}>
          {datos?.qrData && <Image src={datos.qrData} style={styles.qrImage} />}
          <Text style={{ fontSize: 7, marginTop: 5 }}>
            Escanea para verificar
          </Text>
        </View>
      </View>

      <View style={styles.footerPagina} fixed>
        <Image src="/imagenes/logofooter.png" style={styles.logoFooter} />
      </View>
    </Page>
  </Document>
);

import { pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import { ConstanciaPDF } from '../components/Constancias';

export const descargarConstanciaPDF = async (datos) => {
  try {
    // 1. Generar el QR
    const urlVerificacion = `${window.location.origin}/verificar/${datos.folio}`;
    const qrDataURL = await QRCode.toDataURL(urlVerificacion, {
      width: 200,
      margin: 1,
    });

    // 2. Preparar el documento con el QR inyectado
    const doc = <ConstanciaPDF datos={{ ...datos, qrData: qrDataURL }} />;
    
    // 3. Convertir a Blob y descargar
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Constancia_${datos.folio}.pdf`;
    link.click();
    
    // Limpieza
    setTimeout(() => URL.revokeObjectURL(url), 100);
    return true;
  } catch (error) {
    console.error("Error al generar PDF:", error);
    throw error;
  }
};
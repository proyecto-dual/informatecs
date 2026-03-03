// ========================================
// PDF UPLOAD & PARSING IMPLEMENTATION
// ========================================

// OPCIÓN 1: Cliente-side con PDF.js
// -----------------------------------

// 1. Instalar dependencia
// npm install pdfjs-dist

// 2. Componente PDFUploader.jsx
import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configurar worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PDFUploader({ onActivitiesExtracted }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setProgress(0);

    try {
      // Leer archivo como ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Cargar PDF
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      
      let fullText = '';
      
      // Extraer texto de cada página
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
        
        setProgress((i / numPages) * 100);
      }
      
      // Parsear el texto extraído
      const actividades = parseScheduleText(fullText);
      
      onActivitiesExtracted(actividades);
      
      alert(`¡Horario importado! ${actividades.length} clases agregadas.`);
    } catch (error) {
      console.error('Error al procesar PDF:', error);
      alert('Error al procesar el PDF. Intenta manualmente.');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="pdf-uploader">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        disabled={loading}
      />
      {loading && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
          <span>{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
}

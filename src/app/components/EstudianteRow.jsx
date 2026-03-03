"use client";
import { FileText } from "lucide-react";

export const EstudianteRow = ({ est, onSelect }) => (
  <tr className="constanciasge-table-row">
    <td className="constanciasge-td">{est.aluctr}</td>
    <td className="constanciasge-td">{`${est.alunom} ${est.aluapp}`}</td>
    <td className="constanciasge-td constanciasge-td-center">
      <span
        className={`constanciasge-badge ${est.apto ? "aprobado" : "pendiente"}`}
      >
        {est.apto ? "Aprobado" : "Pendiente"}
      </span>
    </td>
    <td className="constanciasge-td constanciasge-td-center">
      <button className="constanciasge-btn-generar" onClick={onSelect}>
        <FileText size={16} /> Generar
      </button>
    </td>
  </tr>
);

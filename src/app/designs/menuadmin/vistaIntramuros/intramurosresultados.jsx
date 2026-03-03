"use client";
import React, { useState } from 'react';
import { Trophy, Plus, X, Send, Loader2 } from 'lucide-react';

const WEB_APP_URL = "/api/intramuros"; 

const SeccionPartidos = ({ actividades, resultados, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [enviando, setEnviando] = useState(false);
  
  const [form, setForm] = useState({
    Fecha: new Date().toISOString().split('T')[0],
    Actividad: '',
    Equipo_Local: '',
    Marcador_L: '0',
    Marcador_V: '0',
    Equipo_Visitante: '',
  });

  const handleSavePartido = async (e) => {
    e.preventDefault();
    setEnviando(true);

    const pL = parseInt(form.Marcador_L || 0);
    const pV = parseInt(form.Marcador_V || 0);
    let ganadorFinal = 'Empate';
    if (pL > pV) ganadorFinal = form.Equipo_Local;
    else if (pV > pL) ganadorFinal = form.Equipo_Visitante;

    const dataToSend = {
      action: 'saveResult',
      hoja: 'partidos', // Coincide con tu nueva pestaña
      Fecha: form.Fecha,
      Actividad: form.Actividad,
      "Equipo Local": form.Equipo_Local,
      Marcador: `${pL} - ${pV}`,
      "Equipo Visitante": form.Equipo_Visitante,
      Ganador: ganadorFinal
    };

    try {
      await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', 
        body: JSON.stringify(dataToSend)
      });
      
      setShowModal(false);
      setForm({ ...form, Equipo_Local: '', Equipo_Visitante: '', Marcador_L: '0', Marcador_V: '0' });
      
      // Delay para que Google Sheets registre el cambio antes de pedir los datos
      setTimeout(() => { onRefresh(); }, 1500);
      
    } catch (error) {
      alert("Error al conectar.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Trophy className="text-yellow-500" size={28} /> Partidos
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Hoja: partidos</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <Plus size={20} /> Registrar Resultado
        </button>
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-4">Fecha</th>
                <th className="p-4">Torneo</th>
                <th className="p-4 text-right">Local</th>
                <th className="p-4 text-center">Marcador</th>
                <th className="p-4">Visitante</th>
                <th className="p-4 text-center">Ganador</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {resultados && resultados.length > 0 ? (
                resultados.map((res, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-slate-500">{res.Fecha}</td>
                    <td className="p-4 font-bold text-blue-900">{res.Actividad}</td>
                    <td className="p-4 text-right font-medium text-slate-700">
                        {res["Equipo Local"] || res.Equipo_Local}
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-slate-900 text-white px-3 py-1 rounded-lg font-mono font-bold">
                        {res.Marcador}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-700">
                        {res["Equipo Visitante"] || res.Equipo_Visitante}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        res.Ganador === 'Empate' 
                          ? 'bg-slate-100 text-slate-400' 
                          : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        {res.Ganador}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-20 text-center text-slate-300 font-medium">
                    No hay datos disponibles en la hoja "partidos".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL REGISTRO */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden border animate-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50 font-bold">
              <span>NUEVO RESULTADO</span>
              <button onClick={() => setShowModal(false)} className="text-slate-400"><X/></button>
            </div>
            
            <form onSubmit={handleSavePartido} className="p-8 space-y-6">
              <select 
                required 
                className="w-full bg-slate-100 p-4 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
                value={form.Actividad}
                onChange={e => setForm({...form, Actividad: e.target.value})}
              >
                <option value="">¿A qué torneo pertenece?</option>
                {actividades.map((a, i) => (
                  <option key={i} value={a.Nombre_Actividad || a.Actividad}>{a.Nombre_Actividad || a.Actividad}</option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <input placeholder="Equipo Local" className="w-full bg-slate-100 p-4 rounded-2xl font-bold" 
                    onChange={e => setForm({...form, Equipo_Local: e.target.value})} required />
                  <input type="number" className="w-full bg-blue-50 p-4 rounded-2xl text-center text-3xl font-black text-blue-600" 
                    value={form.Marcador_L} onChange={e => setForm({...form, Marcador_L: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <input placeholder="Equipo Visitante" className="w-full bg-slate-100 p-4 rounded-2xl font-bold" 
                    onChange={e => setForm({...form, Equipo_Visitante: e.target.value})} required />
                  <input type="number" className="w-full bg-blue-50 p-4 rounded-2xl text-center text-3xl font-black text-blue-600" 
                    value={form.Marcador_V} onChange={e => setForm({...form, Marcador_V: e.target.value})} />
                </div>
              </div>

              <button disabled={enviando} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
                {enviando ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                {enviando ? "PUBLICANDO..." : "GUARDAR MARCADOR"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeccionPartidos;
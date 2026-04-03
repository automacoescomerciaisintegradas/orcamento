'use client';

import React, { useState, useEffect } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import SmartMeasure from '@/lib/plugins/SmartMeasure';

interface Opening {
  id: string;
  type: string;
  area: number;
  enabled: boolean;
}

interface SmartMeasureProps {
  onMeasure: (area: number) => void;
  label?: string;
}

export default function SmartMeasureUI({ onMeasure, label = "Medição Inteligente" }: SmartMeasureProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [grossArea, setGrossArea] = useState<number | null>(null);
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Calcular a área líquida (total - vãos ativos)
  const netArea = grossArea !== null 
    ? grossArea - openings.filter(o => o.enabled).reduce((acc, curr) => acc + curr.area, 0)
    : null;

  // Notificar o pai sempre que a área líquida mudar
  useEffect(() => {
    if (netArea !== null && netArea > 0) {
      onMeasure(netArea);
    }
  }, [netArea, onMeasure]);

  const startMeasurement = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });

      if (!image.base64String) throw new Error("Falha ao capturar imagem.");

      const data = await SmartMeasure.measureArea({
        image: image.base64String,
        referenceSize: 0.085 // Cartão
      });

      setGrossArea(data.grossArea);
      setOpenings(data.openings.map((o: any) => ({ ...o, enabled: true })));
      
    } catch (err: any) {
      console.error("Erro na medição:", err);
      setError(err.message || "Erro ao processar imagem na NPU.");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleOpening = (id: string) => {
    setOpenings(prev => prev.map(o => o.id === id ? { ...o, enabled: !o.enabled } : o));
  };

  const updateOpeningArea = (id: string, newArea: string) => {
    const val = parseFloat(newArea) || 0;
    setOpenings(prev => prev.map(o => o.id === id ? { ...o, area: val } : o));
  };

  return (
    <div className="relative overflow-hidden group rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 transition-all hover:border-blue-500/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold leading-tight">{label}</h3>
            <p className="text-white/40 text-xs">LiteRT NPU + Manual Adjustment</p>
          </div>
        </div>
      </div>

      <button
        onClick={startMeasurement}
        disabled={isProcessing}
        className={`w-full group/btn relative flex items-center justify-center gap-2 overflow-hidden rounded-xl py-4 font-bold transition-all ${
          isProcessing 
            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/20 hover:scale-[1.02] active:scale-95'
        }`}
      >
        {isProcessing ? 'Sincronizando NPU...' : 'Medir Parede'}
      </button>

      {netArea !== null && (
        <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Área Líquida de Pintura</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-300 to-emerald-500">
                {netArea.toFixed(2)} m²
              </h4>
              <span className="text-white/20 text-sm line-through">
                {grossArea?.toFixed(2)}m²
              </span>
            </div>
          </div>

          {openings.length > 0 && (
            <div className="space-y-2">
              <p className="text-white/40 text-[10px] uppercase font-bold px-1">Vãos Detectados (Descontos)</p>
              {openings.map((o) => (
                <div key={o.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${o.enabled ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/5 border-transparent opacity-40'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={o.enabled} 
                      onChange={() => toggleOpening(o.id)}
                      className="w-4 h-4 rounded border-white/20 bg-transparent text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-white">{o.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      step="0.1"
                      value={o.area}
                      onChange={(e) => updateOpeningArea(o.id, e.target.value)}
                      className="w-16 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-right text-amber-400 focus:outline-none focus:border-amber-500/50"
                    />
                    <span className="text-[10px] text-white/30">m²</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          Erro: {error}
        </div>
      )}
    </div>
  );
}

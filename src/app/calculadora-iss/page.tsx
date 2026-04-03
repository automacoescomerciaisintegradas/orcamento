"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calculator, 
  Info, 
  AlertCircle, 
  TrendingUp, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";
import { calcularIssReforma, RtcOutput } from "@/app/actions/rtc";
import Footer from "@/components/Footer";

export default function IssCalculatorPage() {
  const [valorBruto, setValorBruto] = useState<string>("10000");
  const [aliquota, setAliquota] = useState<string>("5");
  const [resultado, setResultado] = useState<RtcOutput | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCalcular = () => {
    startTransition(async () => {
      const res = await calcularIssReforma({
        valorBruto: parseFloat(valorBruto) || 0,
        aliquotaIss: parseFloat(aliquota) || 0,
        dataReferencia: "2026-04-01",
      });
      setResultado(res);
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-cyan-500/30 flex flex-col relative overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-cyan-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="p-2 hover:bg-white/5 rounded-full transition-all text-zinc-400 hover:text-white">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/20">
                R
              </div>
              <h1 className="font-bold tracking-tight text-lg">ISS <span className="text-cyan-400">2026</span></h1>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 text-xs uppercase tracking-widest font-semibold text-zinc-500 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <ShieldCheck size={14} className="text-cyan-400" />
            Conformidade LC 116/2003
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 w-full">
        <header className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
            Calculadora de Serviço (ISS)
          </h2>
          <p className="text-zinc-400">
            Ferramenta técnica para prestadores de serviços. Validação de alíquotas municipais e simulação automática dos impactos da Reforma Tributária.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity">
                <Calculator size={80} />
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-400 mb-2 px-1">Valor Bruto do Serviço (R$)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-lg">R$</span>
                    <input 
                      type="number"
                      value={valorBruto}
                      onChange={(e) => setValorBruto(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xl font-bold focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-zinc-700"
                      placeholder="0,00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-400 mb-2 px-1 flex items-center justify-between">
                    <span>Alíquota ISS (%)</span>
                    <span className="text-[10px] text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">Legal: 2% a 5%</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="number"
                      step="0.1"
                      value={aliquota}
                      onChange={(e) => setAliquota(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-4 text-xl font-bold focus:outline-none focus:border-cyan-500/50 transition-all"
                      placeholder="5"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-lg">%</span>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-3 items-start">
                  <Info className="text-blue-400 shrink-0 mt-0.5" size={18} />
                  <p className="text-xs text-blue-200/60 leading-relaxed">
                    Em 2026, o IBS e CBS iniciam com alíquota teste de **0,1%** cada. O ISS continua vigente até a transição completa.
                  </p>
                </div>

                <button 
                  onClick={handleCalcular}
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold py-5 rounded-2xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {isPending ? "Processando..." : (
                    <>
                      <Zap size={20} /> Calcular Tributos
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Globe size={18} />
              </div>
              <div className="text-xs">
                <p className="text-zinc-400 font-bold">Base de Dados Integrada</p>
                <p className="text-zinc-500">Conectado ao piloto de Reforma Tributária 2026.</p>
              </div>
            </div>
          </div>

          {/* Result Side */}
          <div className="lg:col-span-7 h-full">
            {!resultado ? (
              <div className="h-full min-h-[400px] border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center text-zinc-600 group">
                <div className="w-20 h-20 bg-zinc-900/50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Calculator size={32} />
                </div>
                <p className="font-medium">Preencha os dados à esquerda</p>
                <p className="text-sm">O resultado aparecerá em tempo real</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Current Scenario Card */}
                <div className="p-8 bg-zinc-900/40 border border-white/10 rounded-[40px] relative overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                       Situação Atual <span className="text-zinc-500 font-normal">| 2024-2025</span>
                    </h3>
                    <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] rounded-full font-bold uppercase tracking-widest">
                      Vigente
                    </div>
                  </div>

                  {!resultado.valid ? (
                    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center gap-4 text-red-400">
                      <AlertCircle size={24} />
                      <p className="font-bold">{resultado.message}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Dedução ISS ({aliquota}%)</p>
                        <p className="text-3xl font-bold text-white">
                          - R$ {resultado.valorIss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Valor Líquido</p>
                        <p className="text-3xl font-bold text-cyan-400">
                          R$ {resultado.valorLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Transition Card */}
                <div className="p-8 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-[40px] relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
                  
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                       Simulação Transição <span className="text-blue-400">2026</span>
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                      <TrendingUp size={16} /> Impacto Projetado
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-300 font-black text-[10px]">IBS</div>
                        <div>
                          <p className="text-sm font-bold text-white">Novo ISS (Municipal)</p>
                          <p className="text-[10px] text-zinc-500">Transição teste 0,1%</p>
                        </div>
                      </div>
                      <p className="font-mono text-zinc-400">R$ {resultado.impacto2026.ibs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-300 font-black text-[10px]">CBS</div>
                        <div>
                          <p className="text-sm font-bold text-white">Contribuição Federal</p>
                          <p className="text-[10px] text-zinc-500">Substitui PIS/COFINS (0,1%)</p>
                        </div>
                      </div>
                      <p className="font-mono text-zinc-400">R$ {resultado.impacto2026.cbs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>

                    <div className="pt-4 mt-2 border-t border-white/10 flex flex-col items-center">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Impacto Adicional em 2026</p>
                      <p className="text-2xl font-black text-blue-400">
                        + R$ {resultado.impacto2026.totalReforma.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-3xl">
                  <div className="flex gap-3">
                    <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                    <div className="text-sm">
                      <p className="text-amber-200 font-bold mb-1">Nota Técnica Importante</p>
                      <p className="text-amber-200/60 leading-relaxed">
                        A partir de 2026, inicia-se a cobrança experimental do IBS e da CBS. É fundamental que sua empresa esteja preparada para a emissão da NFS-e nacional já integrando estes novos grupos tributários.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

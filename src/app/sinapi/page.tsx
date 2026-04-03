"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Database, ExternalLink, Download, Filter, RefreshCcw, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getApiUrl } from "@/lib/api";

interface Insumo {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  precoMedio: number;
  fonte: string;
  estado: string;
  dataRef: string;
}

interface Composicao {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  precoTotal: number;
  fonte: string;
  estado: string;
  dataRef: string;
}

interface SinapiResponse {
  data: {
    insumos: Insumo[];
    composicoes: Composicao[];
  };
  pagination: {
    page: number;
    limit: number;
    totalInsumos: number;
    totalComposicoes: number;
    totalPagesInsumos: number;
    totalPagesComposicoes: number;
  };
}

type FilterType = "ALL" | "INSUMO" | "COMPOSICAO";

export default function SinapiPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("ALL");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SinapiResponse | null>(null);
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchTerm,
        type: filterType,
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(getApiUrl(`/api/sinapi?${params}`));
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterType, page]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setPage(1);
      fetchData();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filterType]);

  useEffect(() => {
    fetchData();
  }, [page, fetchData]);

  const getTotalItems = () => {
    if (!data) return 0;
    if (filterType === "INSUMO") return data.pagination.totalInsumos;
    if (filterType === "COMPOSICAO") return data.pagination.totalComposicoes;
    return data.pagination.totalInsumos + data.pagination.totalComposicoes;
  };

  const getTotalPages = () => {
    if (!data) return 0;
    if (filterType === "INSUMO") return data.pagination.totalPagesInsumos;
    if (filterType === "COMPOSICAO") return data.pagination.totalPagesComposicoes;
    return Math.max(
      data.pagination.totalPagesInsumos,
      data.pagination.totalPagesComposicoes
    );
  };

  const formatPrice = (value: number) => {
    return value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-cyan-500/30 flex flex-col">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <Navbar title="SINAPI" showBack showImport onImport={() => alert("Funcionalidade de importação em desenvolvimento")} />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex-grow w-full space-y-8">

        {/* Search & Stats Bar */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-cyan-400 transition-colors">
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
            </div>
            <input
              type="text"
              placeholder="Pesquisar por descrição ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all text-lg"
            />
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center text-cyan-400">
                <Database size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Última Atualização</p>
                <p className="font-bold text-sm">FEV 2026 (Ceará)</p>
              </div>
            </div>
            <button 
              onClick={fetchData}
              className="p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </section>

        {/* Filters & Results */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-4 text-sm font-medium text-zinc-400">
              <button 
                onClick={() => setFilterType("ALL")}
                className={`pb-4 transition-colors ${filterType === "ALL" ? "text-white border-b-2 border-cyan-500 -mb-[18px]" : "hover:text-white"}`}
              >
                Todos ({data ? data.pagination.totalInsumos + data.pagination.totalComposicoes : 0})
              </button>
              <button 
                onClick={() => setFilterType("INSUMO")}
                className={`pb-4 transition-colors ${filterType === "INSUMO" ? "text-white border-b-2 border-cyan-500 -mb-[18px]" : "hover:text-white"}`}
              >
                Insumos ({data?.pagination.totalInsumos || 0})
              </button>
              <button 
                onClick={() => setFilterType("COMPOSICAO")}
                className={`pb-4 transition-colors ${filterType === "COMPOSICAO" ? "text-white border-b-2 border-cyan-500 -mb-[18px]" : "hover:text-white"}`}
              >
                Composições ({data?.pagination.totalComposicoes || 0})
              </button>
            </div>
            <button className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors">
              <Filter size={16} /> Filtros Avançados
            </button>
          </div>

          {/* Results */}
          <div className="bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-wider text-zinc-600 bg-white/[0.02]">
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Código</th>
                  <th className="px-6 py-4">Descrição do Serviço / Insumo</th>
                  <th className="px-6 py-4 text-center">Und</th>
                  <th className="px-6 py-4 text-right">Preço (R$)</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading && !data ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                      <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                      <p>Carregando dados...</p>
                    </td>
                  </tr>
                ) : data && (
                  <>
                    {filterType !== "COMPOSICAO" && data.data.insumos.map((insumo) => (
                      <tr key={insumo.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-5">
                          <span className="text-[10px] px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30 uppercase font-bold tracking-wider">
                            Insumo
                          </span>
                        </td>
                        <td className="px-6 py-5 font-mono text-sm text-cyan-400/80">{insumo.codigo}</td>
                        <td className="px-6 py-5 font-medium text-zinc-300">{insumo.descricao}</td>
                        <td className="px-6 py-5 text-center text-zinc-500">{insumo.unidade}</td>
                        <td className="px-6 py-5 text-right font-bold">{formatPrice(insumo.precoMedio)}</td>
                        <td className="px-6 py-5 text-right">
                          <button className="text-zinc-600 hover:text-cyan-400 transition-colors">
                            <ExternalLink size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filterType !== "INSUMO" && data.data.composicoes.map((composicao) => (
                      <tr key={composicao.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-5">
                          <span className="text-[10px] px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30 uppercase font-bold tracking-wider">
                            Composição
                          </span>
                        </td>
                        <td className="px-6 py-5 font-mono text-sm text-purple-400/80">{composicao.codigo}</td>
                        <td className="px-6 py-5 font-medium text-zinc-300">{composicao.descricao}</td>
                        <td className="px-6 py-5 text-center text-zinc-500">{composicao.unidade}</td>
                        <td className="px-6 py-5 text-right font-bold">{formatPrice(composicao.precoTotal)}</td>
                        <td className="px-6 py-5 text-right">
                          <button className="text-zinc-600 hover:text-cyan-400 transition-colors">
                            <ExternalLink size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {data.data.insumos.length === 0 && data.data.composicoes.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                          <Search size={32} className="mx-auto mb-2 opacity-50" />
                          <p>Nenhum resultado encontrado</p>
                          <p className="text-sm mt-1">Tente buscar por outro termo ou código</p>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && getTotalPages() > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500">
                Mostrando <span className="font-bold text-white">{getTotalItems()}</span> resultados
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-sm font-bold text-cyan-400">
                  Página {page} de {getTotalPages()}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(getTotalPages(), p + 1))}
                  disabled={page === getTotalPages()}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
}

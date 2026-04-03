"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Plus,
  Calendar,
  User,
  DollarSign
} from "lucide-react";

interface Orcamento {
  id: string;
  cliente: string;
  documento: string;
  dataCriacao: string;
  valor: number;
  status: "rascunho" | "aprovado" | "recusado" | "pendente";
  itens: number;
}

const orcamentosExemplo: Orcamento[] = [
  {
    id: "001",
    cliente: "Raimundo Nonato",
    documento: "123.456.789-00",
    dataCriacao: "2026-03-27",
    valor: 7500.00,
    status: "aprovado",
    itens: 12
  },
  {
    id: "002",
    cliente: "Maria das Graças",
    documento: "987.654.321-00",
    dataCriacao: "2026-03-26",
    valor: 15800.00,
    status: "pendente",
    itens: 24
  },
  {
    id: "003",
    cliente: "João Pereira",
    documento: "456.789.123-00",
    dataCriacao: "2026-03-25",
    valor: 4200.00,
    status: "rascunho",
    itens: 8
  },
  {
    id: "004",
    cliente: "Ana Costa",
    documento: "321.654.987-00",
    dataCriacao: "2026-03-24",
    valor: 22000.00,
    status: "recusado",
    itens: 35
  },
];

export default function OrcamentosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");

  const getStatusBadge = (status: string) => {
    const badges = {
      aprovado: {
        bg: "bg-emerald-500/20",
        border: "border-emerald-500/30",
        text: "text-emerald-400",
        icon: CheckCircle2,
        label: "Aprovado"
      },
      pendente: {
        bg: "bg-amber-500/20",
        border: "border-amber-500/30",
        text: "text-amber-400",
        icon: Clock,
        label: "Pendente"
      },
      rascunho: {
        bg: "bg-zinc-500/20",
        border: "border-zinc-500/30",
        text: "text-zinc-400",
        icon: FileText,
        label: "Rascunho"
      },
      recusado: {
        bg: "bg-red-500/20",
        border: "border-red-500/30",
        text: "text-red-400",
        icon: XCircle,
        label: "Recusado"
      }
    };
    
    const badge = badges[status as keyof typeof badges] || badges.rascunho;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badge.bg} ${badge.border} ${badge.text}`}>
        <Icon size={12} />
        {badge.label}
      </span>
    );
  };

  const formatPrice = (value: number) => {
    return value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const orcamentosFiltrados = orcamentosExemplo.filter(orc => {
    const matchSearch = orc.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       orc.documento.includes(searchTerm);
    const matchStatus = filtroStatus === "todos" || orc.status === filtroStatus;
    return matchSearch && matchStatus;
  });

  const totalOrcamentos = orcamentosFiltrados.reduce((acc, orc) => acc + orc.valor, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-cyan-500/30 flex flex-col">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full" />
      </div>

      <Navbar title="Orçamentos" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex-grow w-full space-y-8">
        
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center text-cyan-400">
                <FileText size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Total</span>
            </div>
            <p className="text-3xl font-bold">{orcamentosExemplo.length}</p>
            <p className="text-xs text-zinc-500 mt-1">Orçamentos cadastrados</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-green-600/10 border border-emerald-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Aprovados</span>
            </div>
            <p className="text-3xl font-bold">{orcamentosExemplo.filter(o => o.status === "aprovado").length}</p>
            <p className="text-xs text-zinc-500 mt-1">Orçamentos aprovados</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-yellow-600/10 border border-amber-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400">
                <Clock size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Pendentes</span>
            </div>
            <p className="text-3xl font-bold">{orcamentosExemplo.filter(o => o.status === "pendente").length}</p>
            <p className="text-xs text-zinc-500 mt-1">Aguardando revisão</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">
                <DollarSign size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Valor Total</span>
            </div>
            <p className="text-2xl font-bold">R$ {formatPrice(totalOrcamentos)}</p>
            <p className="text-xs text-zinc-500 mt-1">Soma de todos orçamentos</p>
          </div>
        </div>

        {/* Search & Filters */}
        <section className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative group w-full md:w-auto md:flex-1 max-w-xl">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-cyan-400 transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Buscar por cliente ou documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 rounded-xl text-sm font-bold transition-all">
              <Filter size={18} />
              Filtros
            </button>
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 rounded-xl text-sm font-bold transition-all">
              <Download size={18} />
              Exportar
            </button>
            <Link
              href="/orcamento/novo"
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-500/20 ml-auto"
            >
              <Plus size={18} />
              Novo Orçamento
            </Link>
          </div>
        </section>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
          <button
            onClick={() => setFiltroStatus("todos")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              filtroStatus === "todos"
                ? "bg-white/10 text-white"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltroStatus("aprovado")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              filtroStatus === "aprovado"
                ? "bg-emerald-500/20 text-emerald-400"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            Aprovados
          </button>
          <button
            onClick={() => setFiltroStatus("pendente")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              filtroStatus === "pendente"
                ? "bg-amber-500/20 text-amber-400"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            Pendentes
          </button>
          <button
            onClick={() => setFiltroStatus("rascunho")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              filtroStatus === "rascunho"
                ? "bg-zinc-500/20 text-zinc-400"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            Rascunhos
          </button>
        </div>

        {/* Orçamentos Table */}
        <div className="bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wider text-zinc-600 bg-white/[0.02]">
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Documento</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4 text-center">Itens</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orcamentosFiltrados.map((orcamento) => (
                <tr key={orcamento.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-600/10 flex items-center justify-center text-cyan-400 font-bold">
                        {orcamento.cliente.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{orcamento.cliente}</p>
                        <p className="text-xs text-zinc-500">#{orcamento.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-zinc-400 font-mono text-sm">
                    {orcamento.documento}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Calendar size={14} />
                      {formatDate(orcamento.dataCriacao)}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-xs bg-white/5 px-3 py-1 rounded-full text-zinc-400 font-bold">
                      {orcamento.itens} itens
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {getStatusBadge(orcamento.status)}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <p className="font-bold text-lg">R$ {formatPrice(orcamento.valor)}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 justify-end">
                      <button className="p-2 text-zinc-600 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-zinc-600 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orcamentosFiltrados.length === 0 && (
            <div className="p-16 text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Search size={40} className="text-zinc-600" />
              </div>
              <p className="text-zinc-500 font-medium">Nenhum orçamento encontrado</p>
              <p className="text-sm text-zinc-600 mt-1">Tente ajustar os filtros ou buscar por outro termo</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

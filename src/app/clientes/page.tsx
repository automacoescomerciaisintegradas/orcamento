"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Mail,
  Phone,
  MapPin,
  User,
  Building,
  Calendar,
  FileText
} from "lucide-react";
import Link from "next/link";

interface Cliente {
  id: string;
  nome: string;
  documento: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  dataCadastro: string;
  orcamentosCount: number;
  valorTotal: number;
}

const clientesExemplo: Cliente[] = [
  {
    id: "001",
    nome: "Raimundo Nonato",
    documento: "123.456.789-00",
    email: "raimundo@email.com",
    telefone: "(88) 99999-9999",
    endereco: "Rua das Flores, 123",
    cidade: "Juazeiro do Norte - CE",
    dataCadastro: "2026-01-15",
    orcamentosCount: 5,
    valorTotal: 45000.00
  },
  {
    id: "002",
    nome: "Maria das Graças",
    documento: "987.654.321-00",
    email: "maria.gracas@email.com",
    telefone: "(88) 98888-8888",
    endereco: "Av. Castelo Branco, 456",
    cidade: "Crato - CE",
    dataCadastro: "2026-02-10",
    orcamentosCount: 3,
    valorTotal: 28500.00
  },
  {
    id: "003",
    nome: "João Pereira",
    documento: "456.789.123-00",
    email: "joao.pereira@email.com",
    telefone: "(88) 97777-7777",
    endereco: "Rua São José, 789",
    cidade: "Barbalha - CE",
    dataCadastro: "2026-02-20",
    orcamentosCount: 2,
    valorTotal: 12000.00
  },
  {
    id: "004",
    nome: "Ana Costa",
    documento: "321.654.987-00",
    email: "ana.costa@email.com",
    telefone: "(88) 96666-6666",
    endereco: "Rua das Palmeiras, 321",
    cidade: "Juazeiro do Norte - CE",
    dataCadastro: "2026-03-05",
    orcamentosCount: 8,
    valorTotal: 89000.00
  },
  {
    id: "005",
    nome: "Francisco Alves",
    documento: "654.321.987-00",
    email: "chico.alves@email.com",
    telefone: "(88) 95555-5555",
    endereco: "Rua do Comércio, 555",
    cidade: "Sobral - CE",
    dataCadastro: "2026-03-12",
    orcamentosCount: 1,
    valorTotal: 5500.00
  },
];

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");

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

  const clientesFiltrados = clientesExemplo.filter(cliente => {
    const term = searchTerm.toLowerCase();
    return cliente.nome.toLowerCase().includes(term) ||
           cliente.documento.includes(term) ||
           cliente.email.toLowerCase().includes(term) ||
           cliente.cidade.toLowerCase().includes(term);
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-cyan-500/30 flex flex-col">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <Navbar title="Clientes" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex-grow w-full space-y-8">
        
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center text-cyan-400">
                <User size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Total</span>
            </div>
            <p className="text-3xl font-bold">{clientesExemplo.length}</p>
            <p className="text-xs text-zinc-500 mt-1">Clientes cadastrados</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-green-600/10 border border-emerald-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
                <FileText size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Orçamentos</span>
            </div>
            <p className="text-3xl font-bold">{clientesExemplo.reduce((acc, c) => acc + c.orcamentosCount, 0)}</p>
            <p className="text-xs text-zinc-500 mt-1">Total de orçamentos</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">
                <Building size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Cidades</span>
            </div>
            <p className="text-3xl font-bold">{new Set(clientesExemplo.map(c => c.cidade.split(" - ")[0])).size}</p>
            <p className="text-xs text-zinc-500 mt-1">Cidades atendidas</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-yellow-600/10 border border-amber-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400">
                <span className="text-lg font-bold">R$</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Faturamento</span>
            </div>
            <p className="text-2xl font-bold">R$ {formatPrice(clientesExemplo.reduce((acc, c) => acc + c.valorTotal, 0))}</p>
            <p className="text-xs text-zinc-500 mt-1">Valor total em orçamentos</p>
          </div>
        </div>

        {/* Search & Actions */}
        <section className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative group w-full md:w-auto md:flex-1 max-w-xl">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-cyan-400 transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome, documento, email ou cidade..."
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
            <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-500/20">
              <Plus size={18} />
              Novo Cliente
            </button>
          </div>
        </section>

        {/* Clientes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientesFiltrados.map((cliente) => (
            <div 
              key={cliente.id} 
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] hover:border-cyan-500/20 transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-cyan-400 font-bold text-xl border border-cyan-500/20">
                    {cliente.nome.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-cyan-400 transition-colors">{cliente.nome}</h3>
                    <p className="text-xs text-zinc-500 font-mono">{cliente.documento}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 text-zinc-600 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <Mail size={16} className="text-zinc-600" />
                  <span className="truncate">{cliente.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <Phone size={16} className="text-zinc-600" />
                  <span>{cliente.telefone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <MapPin size={16} className="text-zinc-600" />
                  <span className="truncate">{cliente.cidade}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Orçamentos</p>
                  <p className="text-2xl font-bold text-cyan-400">{cliente.orcamentosCount}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Valor Total</p>
                  <p className="text-lg font-bold">R$ {formatPrice(cliente.valorTotal)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/5">
                <Link
                  href={`/orcamentos?cliente=${cliente.id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-xl text-sm font-bold transition-all"
                >
                  <FileText size={16} />
                  Ver Orçamentos
                </Link>
                <button className="p-2.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl transition-all">
                  <Eye size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {clientesFiltrados.length === 0 && (
          <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-16 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Search size={40} className="text-zinc-600" />
            </div>
            <p className="text-zinc-500 font-medium">Nenhum cliente encontrado</p>
            <p className="text-sm text-zinc-600 mt-1">Tente buscar por outro termo</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

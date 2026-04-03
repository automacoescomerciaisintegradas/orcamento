import Link from "next/link";
import { PlusCircle, Database, FileText, Settings, Search, ArrowRight, User, Phone, Calculator, TrendingUp } from "lucide-react";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-cyan-500/30 flex flex-col">
      {/* Premium Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/20">
              R
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-lg">RQR <span className="text-cyan-400">Pinturas</span></h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Soluções em Acabamentos</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/sinapi" className="hover:text-white transition-colors">SINAPI</Link>
            <Link href="/orcamentos" className="hover:text-white transition-colors">Orçamentos</Link>
            <Link href="/clientes" className="hover:text-white transition-colors">Clientes</Link>
            <Link href="/calculadora-iss" className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold flex items-center gap-1">
              <Calculator size={14} /> ISS 2026
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 text-sm transition-all">
              Configurações
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex-grow w-full">
        {/* Header Section */}
        <header className="mb-12">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Bem-vindo, <span className="text-cyan-400">Raimundo Alves</span></h2>
          <p className="text-zinc-400 max-w-2xl">
            Sua central de orçamentos técnicos profissionais. Precisão SINAPI, agilidade de 60 segundos e design premium para seus clientes.
          </p>
        </header>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/orcamento/novo" className="group p-6 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:border-cyan-500/50 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <PlusCircle size={24} />
            </div>
            <h3 className="font-bold mb-2">Novo Orçamento</h3>
            <p className="text-sm text-zinc-500">Crie propostas profissionais no padrão Alex Wetler.</p>
          </Link>

          <Link href="/sinapi" className="group p-6 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:border-blue-500/50 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <Database size={24} />
            </div>
            <h3 className="font-bold mb-2">Base SINAPI</h3>
            <p className="text-sm text-zinc-500">Importar ou atualizar preços oficiais da CAIXA (888).</p>
          </Link>

          <div className="group p-6 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:border-purple-500/50 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
            <h3 className="font-bold mb-2">Modelos de Contrato</h3>
            <p className="text-sm text-zinc-500">Gere contratos jurídicos a partir de orçamentos aprovados.</p>
          </div>

          <div className="group p-6 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:border-amber-500/50 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Settings size={24} />
            </div>
            <h3 className="font-bold mb-2">Configurar BDI</h3>
            <p className="text-sm text-zinc-500">Defina lucro e impostos aplicáveis aos serviços.</p>
          </div>

          <Link href="/calculadora-iss" className="group p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Calculator size={24} />
            </div>
            <h3 className="font-bold mb-2 text-cyan-400">ISS 2026</h3>
            <p className="text-sm text-zinc-500">Simule os impactos da Reforma Tributária no seu serviço.</p>
          </Link>
        </div>

        {/* Recent Budgets & Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold">Orçamentos Recentes</h3>
              <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1">
                Ver todos <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between hover:bg-white/[0.05] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">Raimundo Nonato (Teste)</h4>
                    <p className="text-xs text-zinc-500">Pintura e Alvenaria • 27 Mar 2026</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">R$ 7.500,00</p>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 uppercase font-bold tracking-wider">Aprovado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel: SINAPI Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Status SINAPI</h3>
            <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Database className="text-cyan-400" size={20} />
                <span className="text-sm font-bold uppercase tracking-wider text-cyan-400/80">Referência Atual</span>
              </div>
              <p className="text-3xl font-bold mb-1">FEV 2026</p>
              <p className="text-xs text-zinc-400 mb-6">Desonerado • Ceará (CE)</p>
              
              <Link href="/sinapi" className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
                <Search size={18} /> Buscar Insumos
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download } from "lucide-react";

interface NavbarProps {
  title?: string;
  showBack?: boolean;
  backHref?: string;
  showImport?: boolean;
  onImport?: () => void;
}

export default function Navbar({ 
  title, 
  showBack = false, 
  backHref = "/",
  showImport = false,
  onImport
}: NavbarProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/sinapi", label: "SINAPI" },
    { href: "/orcamentos", label: "Orçamentos" },
    { href: "/clientes", label: "Clientes" },
  ];

  return (
    <nav className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {showBack && (
            <Link 
              href={backHref} 
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7"/>
                <path d="M19 12H5"/>
              </svg>
            </Link>
          )}
          
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/20">
              R
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-lg">RQR <span className="text-cyan-400">Pinturas</span></h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Soluções em Acabamentos</p>
            </div>
          </Link>

          {title && (
            <>
              <span className="text-white/20">/</span>
              <h1 className="text-lg font-bold text-white">{title}</h1>
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-white transition-colors relative ${
                pathname === link.href ? "text-white" : ""
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-8 left-0 right-0 h-0.5 bg-cyan-500 rounded-full" />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {showImport && (
            <button 
              onClick={onImport}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm font-bold transition-all"
            >
              <Download size={16} /> Importar Excel
            </button>
          )}
          <Link 
            href="/orcamento/novo"
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-4 py-2 rounded-full text-sm transition-all shadow-lg shadow-cyan-500/20"
          >
            + Novo Orçamento
          </Link>
        </div>
      </div>
    </nav>
  );
}

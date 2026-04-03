import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto py-12 border-t border-white/5 bg-zinc-950/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
        <h2 className="text-lg font-black uppercase tracking-[0.3em] text-zinc-500">
          Desenvolvido por
        </h2>
        <div className="space-y-4">
          <p className="text-sm text-zinc-400 font-medium">
            © Automações Comerciais Integradas! 2026 ⚙️ Todos os direitos reservados.
          </p>
          <div className="flex flex-col items-center gap-3">
            <a 
              href="mailto:contato@automacoescomerciais.com.br" 
              className="text-zinc-500 hover:text-cyan-400 transition-colors text-xs font-mono"
            >
              contato@automacoescomerciais.com.br
            </a>
            <Link 
              href="https://wa.me/558894227586" 
              target="_blank"
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-2xl text-emerald-500 text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>📱</span> WhatsApp
            </Link>
            <p className="text-[10px] text-zinc-800 font-mono select-all">
              https://wa.me/558894227586
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client'

import { SearchResult } from '@/app/actions/sinapi-advanced'
import { highlightText } from '@/lib/searchUtils'
import { HardHat, Paintbrush, Search, Loader2, X, History, TrendingUp } from 'lucide-react'

interface SearchResultsProps {
  results: SearchResult[]
  loading: boolean
  query: string
  onSelect: (result: SearchResult) => void
  onClear: () => void
  searchHistory: string[]
  onHistoryClick: (query: string) => void
  onClearHistory: () => void
}

export default function SearchResults({
  results,
  loading,
  query,
  onSelect,
  onClear,
  searchHistory,
  onHistoryClick,
  onClearHistory,
}: SearchResultsProps) {
  if (!loading && results.length === 0 && !query) {
    return (
      <div className="p-8 text-center text-zinc-500">
        <Search size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">Digite para buscar na base SINAPI</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 size={32} className="mx-auto mb-2 animate-spin text-amber-500" />
        <p className="text-sm text-zinc-400">Buscando na base SINAPI...</p>
      </div>
    )
  }

  if (!loading && results.length === 0 && query.length >= 2) {
    return (
      <div className="p-8 text-center text-zinc-500">
        <Search size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">Nenhum resultado encontrado para "{query}"</p>
        <p className="text-xs mt-1">Tente buscar por outro termo ou código</p>
      </div>
    )
  }

  // Mostrar histórico quando não há query
  if (!query && searchHistory.length > 0) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
            <History size={14} />
            Buscas Recentes
          </div>
          <button
            onClick={onClearHistory}
            className="text-xs text-zinc-600 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <X size={12} /> Limpar
          </button>
        </div>
        <div className="space-y-1">
          {searchHistory.slice(0, 5).map((item, idx) => (
            <button
              key={idx}
              onClick={() => onHistoryClick(item)}
              className="w-full text-left p-3 hover:bg-amber-500/10 rounded-xl flex items-center gap-3 transition-all group"
            >
              <History size={14} className="text-zinc-600 group-hover:text-amber-500 transition-colors" />
              <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">{item}</span>
              <TrendingUp size={12} className="ml-auto text-zinc-700 group-hover:text-amber-500 transition-colors opacity-0 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-h-[450px] overflow-y-auto p-3 scrollbar-hide">
      <div className="flex items-center justify-between mb-2 px-2">
        <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
          {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
        </span>
        <button
          onClick={onClear}
          className="text-xs text-zinc-600 hover:text-white transition-colors flex items-center gap-1"
        >
          <X size={12} /> Limpar
        </button>
      </div>

      {results.map((result) => (
        <button
          key={`${result.tipo}-${result.id}`}
          onClick={() => onSelect(result)}
          className="w-full text-left p-4 hover:bg-amber-500/10 rounded-2xl flex items-center justify-between group/item transition-all mb-1 last:mb-0 border border-transparent hover:border-amber-500/20"
        >
          <div className="flex items-center gap-5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              result.tipo === 'INSUMO'
                ? 'bg-blue-500/10 text-blue-400 group-hover/item:bg-blue-500/20'
                : 'bg-emerald-500/10 text-emerald-400 group-hover/item:bg-emerald-500/20'
            }`}>
              {result.tipo === 'INSUMO' ? <HardHat size={22} /> : <Paintbrush size={22} />}
            </div>
            <div className="flex-1 min-w-0">
              <div 
                className="font-bold text-gray-100 group-hover/item:text-amber-400 transition-colors line-clamp-2 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: highlightText(result.descricao, query) }}
              />
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-500 font-mono">
                  {result.codigo}
                </span>
                <span className="text-[10px] text-gray-600 uppercase font-bold tracking-tighter">
                  {result.unidade}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold uppercase tracking-wider">
                  {result.tipo}
                </span>
                {result.score && result.score >= 70 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold uppercase tracking-wider">
                    Alta relevância
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right pl-4">
            <div className="font-black text-xl text-white whitespace-nowrap">
              R$ {result.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-amber-500/60 font-black uppercase tracking-widest mt-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity">
              Selecionar
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

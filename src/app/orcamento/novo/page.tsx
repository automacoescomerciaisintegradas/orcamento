'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Search,
  Trash2,
  Save,
  FileText,
  Calculator,
  HardHat,
  Paintbrush,
  Settings,
  X,
  Info,
  CheckCircle2,
  Download,
  MessageCircle,
  Mail,
  History,
  TrendingUp,
  Clock,
  Layout
} from 'lucide-react'
import Link from 'next/link'
import { searchSinapi, SearchResult } from '@/app/actions/sinapi-advanced'
import { highlightText } from '@/lib/searchUtils'
import { useSearchSinapi } from '@/hooks/useSearchSinapi'
import Navbar from '@/components/Navbar'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Footer from "@/components/Footer"
import SmartMeasureUI from '@/components/SmartMeasure'

interface ItemOrcamento {
  id: string
  codigo: string
  descricao: string
  unidade: string
  precoUnitario: number
  quantidade: number
  total: number
  tipo: 'INSUMO' | 'COMPOSIÇÃO'
}

interface BDIVariables {
  ac: number // Adm Central
  s: number  // Seguros
  r: number  // Riscos
  g: number  // Garantia
  df: number // Despesas Financeiras
  l: number  // Lucro
  i: number  // Impostos
}

interface ClienteData {
  nome: string
  documento: string
  endereco: string
}

// Hook personalizado para busca com debounce e cache
function useDebounceSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const cacheRef = React.useRef<Map<string, SearchResult[]>>(new Map())

  // Carregar histórico
  useEffect(() => {
    const saved = localStorage.getItem('orcamentoSearchHistory')
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Erro ao carregar histórico:', e)
      }
    }
  }, [])

  // Salvar histórico
  useEffect(() => {
    localStorage.setItem('orcamentoSearchHistory', JSON.stringify(searchHistory.slice(0, 10)))
  }, [searchHistory])

  const addToHistory = useCallback((query: string) => {
    if (query.length < 2) return
    setSearchHistory(prev => {
      const filtered = prev.filter(q => q !== query)
      return [query, ...filtered].slice(0, 10)
    })
  }, [])

  const clearHistory = useCallback(() => {
    setSearchHistory([])
  }, [])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true)
        try {
          // Verificar cache
          const cacheKey = searchQuery
          const cached = cacheRef.current.get(cacheKey)
          if (cached) {
            setSearchResults(cached)
          } else {
            const results = await searchSinapi({
              query: searchQuery,
              type: 'ALL',
              limit: 20,
              sortBy: 'relevancia'
            })
            cacheRef.current.set(cacheKey, results)
            setSearchResults(results)
            addToHistory(searchQuery)
          }
        } catch (error) {
          console.error('Erro na busca:', error)
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, addToHistory])

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchHistory,
    addToHistory,
    clearHistory,
    setSearchResults
  }
}

export default function NovoOrcamentoPage() {
  const [items, setItems] = useState<ItemOrcamento[]>([])
  const [cliente, setCliente] = useState<ClienteData>({ nome: '', documento: '', endereco: '' })
  const [titulo, setTitulo] = useState('')
  const [descricaoGeral, setDescricaoGeral] = useState('')
  const [cronograma, setCronograma] = useState('')
  const orcamentoRef = React.useRef<HTMLDivElement>(null)
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchHistory,
    addToHistory,
    clearHistory,
    setSearchResults
  } = useDebounceSearch()
  const [showBdiModal, setShowBdiModal] = useState(false)
  const [status, setStatus] = useState<'RASCUNHO' | 'APROVADO'>('RASCUNHO')
  const [isGenerating, setIsGenerating] = useState(false)

  const [bdiVars, setBdiVars] = useState<BDIVariables>({
    ac: 5,   // 5% default
    s: 0.8,  // 0.8%
    r: 1.2,  // 1.2%
    g: 0.5,  // 0.5%
    df: 1.0, // 1%
    l: 10,   // 10%
    i: 13.15 // 13.15% (ISS + PIS + COFINS base)
  })

  const [bdiValue, setBdiValue] = useState(25)

  // Calculate BDI percentage based on variables
  useEffect(() => {
    const { ac, s, r, g, df, l, i } = bdiVars
    const acDecimal = ac / 100
    const sDecimal = s / 100
    const rDecimal = r / 100
    const gDecimal = g / 100
    const dfDecimal = df / 100
    const lDecimal = l / 100
    const iDecimal = i / 100

    const bdi = (((1 + acDecimal + sDecimal + rDecimal + gDecimal) * (1 + dfDecimal) * (1 + lDecimal)) / (1 - iDecimal) - 1) * 100
    setBdiValue(parseFloat(bdi.toFixed(2)))
  }, [bdiVars])

  const addItem = (result: any) => {
    const newItem: ItemOrcamento = {
      id: Math.random().toString(36).substr(2, 9),
      codigo: result.codigo,
      descricao: result.descricao,
      unidade: result.unidade,
      precoUnitario: result.preco,
      quantidade: 1,
      total: result.preco,
      tipo: result.tipo
    }
    setItems([...items, newItem])
    setSearchQuery('')
    setSearchResults([])
  }

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id))
  }

  const updateQuantity = (id: string, q: number) => {
    setItems(items.map(i => {
      if (i.id === id) {
        return { ...i, quantidade: q, total: q * i.precoUnitario }
      }
      return i
    }))
  }

  const addManualItem = () => {
    const newItem: ItemOrcamento = {
      id: Math.random().toString(36).substr(2, 9),
      codigo: 'MANUAL',
      descricao: 'Novo Serviço Personalizado',
      unidade: 'UN',
      precoUnitario: 0,
      quantidade: 1,
      total: 0,
      tipo: 'COMPOSIÇÃO'
    }
    setItems([...items, newItem])
  }

  const updateItemDesc = (id: string, desc: string) => {
    setItems(items.map(i => i.id === id ? { ...i, descricao: desc } : i))
  }

  const updateUnitPrice = (id: string, price: number) => {
    setItems(items.map(i => {
      if (i.id === id) {
        return { ...i, precoUnitario: price, total: i.quantidade * price }
      }
      return i
    }))
  }

  const subtotal = items.reduce((acc, i) => acc + i.total, 0)
  const valorBdi = subtotal * (bdiValue / 100)
  const totalGeral = subtotal + valorBdi

  const handleGerarContrato = async () => {
    if (items.length === 0) {
      alert("Adicione pelo menos um item ao orçamento.")
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/contrato/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente,
          items,
          total: totalGeral,
          bdi: bdiValue,
          dataAtual: new Date().toISOString()
        })
      })

      if (response.ok) {
        const data = await response.json()
        const blob = new Blob([data.content], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = data.filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else {
        throw new Error("Erro ao gerar contrato")
      }
    } catch (error) {
      console.error(error)
      alert("Houve um erro ao gerar o contrato.")
    } finally {
      setIsGenerating(false)
    }
  }

  const formatOrcamentoText = () => {
    let text = `*ORÇAMENTO - RQR PINTURAS*\n\n`
    text += `*Cliente:* ${cliente.nome || 'Não informado'}\n`
    if (titulo) text += `*Projeto:* ${titulo}\n`
    text += `*Data:* ${new Date().toLocaleDateString('pt-BR')}\n\n`
    
    if (descricaoGeral) text += `*Descrição:* ${descricaoGeral}\n\n`
    
    text += `*ITENS:* \n`
    items.forEach((item, idx) => {
      text += `${idx + 1}. ${item.descricao} (${item.quantidade} ${item.unidade}) - R$ ${item.total.toLocaleString('pt-BR')}\n`
    })
    
    if (cronograma) text += `\n*Cronograma:* ${cronograma}\n`
    
    text += `\n*TOTAL GERAL: R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}*`
    text += `\n\n_Gerado por RQR Pinturas System_`
    return text
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(formatOrcamentoText())
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const handleEmail = () => {
    const subject = encodeURIComponent(`Orçamento - ${titulo || 'Serviços de Pintura'}`)
    const body = encodeURIComponent(formatOrcamentoText().replace(/\*/g, ''))
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const handleDownloadPDF = async () => {
    if (!orcamentoRef.current) return
    
    setIsGenerating(true)
    try {
      const element = orcamentoRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0a0b',
        logging: false
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`orcamento-${cliente.nome.replace(/\s+/g, '-').toLowerCase() || 'projeto'}.pdf`)
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar PDF. Verifique o console.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAiMeasurement = (area: number) => {
    const newItem: ItemOrcamento = {
      id: Math.random().toString(36).substr(2, 9),
      codigo: 'IA-MEASURE',
      descricao: `Pintura de Parede (Medição de Precisão NPU)`,
      unidade: 'M2',
      precoUnitario: 0,
      quantidade: parseFloat(area.toFixed(2)),
      total: 0,
      tipo: 'COMPOSIÇÃO'
    }
    setItems(prev => [...prev, newItem])
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white font-sans selection:bg-amber-500/30 flex flex-col">
      <Navbar title="Novo Orçamento" showBack backHref="/orcamentos" />
      
      <div ref={orcamentoRef} className="max-w-6xl mx-auto px-6 py-8 space-y-8 flex-grow">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent tracking-tight">
              RQR Pinturas & Acabamentos
            </h1>
            <p className="text-amber-500/80 font-medium tracking-widest text-xs uppercase flex items-center gap-2">
              <HardHat size={14} /> Precisão SINAPI • Engenharia de Custos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStatus('APROVADO')}
              className={`px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-2xl ${
                status === 'APROVADO'
                ? 'bg-emerald-500 text-black shadow-emerald-500/20'
                : 'bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/20'
              }`}
            >
              {status === 'APROVADO' ? <CheckCircle2 size={18} /> : <Save size={18} />}
              {status === 'APROVADO' ? 'Orçamento Aprovado' : 'Aprovar Orçamento'}
            </button>
            {status === 'APROVADO' && (
              <button
                onClick={handleGerarContrato}
                disabled={isGenerating}
                className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all flex items-center gap-2 backdrop-blur-xl group disabled:opacity-50"
              >
                {isGenerating ? <div className="animate-spin"><Settings size={18} /></div> : <FileText size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />}
                {isGenerating ? 'Processando...' : 'Gerar Contrato'}
              </button>
            )}
            <button
              onClick={handleDownloadPDF}
              className="px-8 py-3 bg-amber-500 text-black hover:bg-amber-400 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95"
            >
              <Download size={18} />
              Baixar PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Client Info Section */}
            <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 space-y-6">
               <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <CheckCircle2 size={18} />
                </div>
                Identificação do Cliente
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  type="text" placeholder="Nome Completo do Cliente" value={cliente.nome}
                  onChange={(e) => setCliente({...cliente, nome: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all"
                />
                <input 
                  type="text" placeholder="CPF ou CNPJ" value={cliente.documento}
                  onChange={(e) => setCliente({...cliente, documento: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all"
                />
                <input 
                  type="text" placeholder="Endereço da Obra" value={cliente.endereco}
                  onChange={(e) => setCliente({...cliente, endereco: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all md:col-span-2"
                />
              </div>
            </div>

            {/* Project Details Section */}
            <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 space-y-6">
               <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Layout size={18} />
                </div>
                Escopo do Projeto
              </h2>
              <div className="space-y-4">
                <input 
                  type="text" placeholder="Título do Orçamento (Ex: Pintura Predial Bloco A)" value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all font-bold"
                />
                <textarea 
                  placeholder="Descrição Detalhada dos Serviços (Ex: Alvenaria, troca de blocos, preparação de superfície...)" 
                  value={descricaoGeral}
                  onChange={(e) => setDescricaoGeral(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all min-h-[120px] text-sm leading-relaxed"
                />
                 <div className="relative">
                  <div className="absolute top-3 left-4 text-amber-500/50">
                    <Clock size={16} />
                  </div>
                  <textarea 
                    placeholder="Cronograma Estimado (Ex: Preparação: 1 dia, Execução: 3 dias...)" 
                    value={cronograma}
                    onChange={(e) => setCronograma(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all min-h-[80px] text-sm italic"
                  />
                </div>
              </div>
            </div>

            {/* Search Section */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-amber-500 transition-colors">
                {isSearching ? (
                  <Search size={22} className="animate-pulse" />
                ) : (
                  <Search size={22} />
                )}
              </div>
              <input
                type="text"
                placeholder="Busca Inteligente SINAPI (ex: Pintura, Tubo, Vidro...)"
                className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-5 pl-14 pr-6 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500/50 transition-all placeholder:text-gray-600 text-lg font-medium shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              )}

              {/* Dynamic Search Results */}
              {(searchResults.length > 0 || isSearching || searchHistory.length > 0) && (
                <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-[#0f0f11]/95 border border-white/10 rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] z-50 overflow-hidden backdrop-blur-2xl ring-1 ring-white/10">
                  {isSearching ? (
                    <div className="p-8 text-center">
                      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-sm text-gray-400">Buscando na base SINAPI...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="max-h-[450px] overflow-y-auto p-3 scrollbar-hide">
                      <div className="flex items-center justify-between mb-2 px-2">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                          {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {searchResults.map((result) => (
                        <button
                          key={`${result.tipo}-${result.id}`}
                          onClick={() => addItem(result)}
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
                                dangerouslySetInnerHTML={{ __html: highlightText(result.descricao, searchQuery) }}
                              />
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-500 font-mono">{result.codigo}</span>
                                <span className="text-[10px] text-gray-600 uppercase font-bold tracking-tighter">{result.unidade}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold uppercase tracking-wider">{result.tipo}</span>
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
                  ) : searchHistory.length > 0 && !searchQuery ? (
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                          <History size={14} />
                          Buscas Recentes
                        </div>
                        <button
                          onClick={clearHistory}
                          className="text-xs text-gray-600 hover:text-red-400 transition-colors flex items-center gap-1"
                        >
                          <X size={12} /> Limpar
                        </button>
                      </div>
                      <div className="space-y-1">
                        {searchHistory.slice(0, 5).map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSearchQuery(item)}
                            className="w-full text-left p-3 hover:bg-amber-500/10 rounded-xl flex items-center gap-3 transition-all group"
                          >
                            <History size={14} className="text-gray-600 group-hover:text-amber-500 transition-colors" />
                            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{item}</span>
                            <TrendingUp size={12} className="ml-auto text-gray-700 group-hover:text-amber-500 transition-colors opacity-0 group-hover:opacity-100" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
              <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <Calculator size={22} className="text-amber-500" />
                  Composições de Custo
                </h2>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={addManualItem}
                    className="flex items-center gap-2 text-[10px] bg-amber-500/10 hover:bg-amber-500/20 px-4 py-2 rounded-full text-amber-500 uppercase tracking-widest font-black border border-amber-500/20 transition-all"
                  >
                    <Plus size={14} /> Item Personalizado
                  </button>
                  <span className="text-[10px] bg-white/5 px-4 py-2 rounded-full text-gray-400 uppercase tracking-[0.2em] font-black border border-white/5">
                    {items.length} itens no carrinho
                  </span>
                </div>
              </div>
              
              <div className="divide-y divide-white/[0.03]">
                {items.length === 0 ? (
                  <div className="p-32 text-center flex flex-col items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-white/[0.03] flex items-center justify-center text-gray-800 animate-pulse">
                      <Search size={48} />
                    </div>
                    <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-500">Seu orçamento está vazio.</p>
                    <p className="text-sm text-gray-700 max-w-xs mx-auto">Use a busca acima para adicionar insumos e serviços direto da base SINAPI.</p>
                    </div>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="p-8 flex flex-col md:flex-row md:items-center gap-8 group transition-all hover:bg-white/[0.03]">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-[10px] text-amber-500 font-black px-2 py-0.5 bg-amber-500/10 rounded-md uppercase tracking-tighter">
                            {item.tipo}
                          </span>
                          <span className="text-[10px] text-gray-600 font-mono">{item.codigo}</span>
                        </div>
                        <textarea 
                          value={item.descricao}
                          onChange={(e) => updateItemDesc(item.id, e.target.value)}
                          className="w-full bg-transparent border-none p-0 font-bold text-xl leading-snug text-white focus:ring-0 focus:outline-none resize-none overflow-hidden min-h-[1.5em] group-hover:text-amber-50 transition-colors"
                          rows={2}
                        />
                        <div className="text-gray-600 text-[11px] mt-2 font-bold uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                          Unidade: {item.unidade}
                        </div>
                      </div>
                      <div className="flex items-center gap-10">
                        <div className="flex flex-col items-end">
                          <label className="text-[9px] text-gray-600 uppercase font-black mb-1.5 tracking-widest">Preço Un.</label>
                          {item.codigo === 'MANUAL' ? (
                            <input 
                              type="number"
                              value={item.precoUnitario}
                              onChange={(e) => updateUnitPrice(item.id, parseFloat(e.target.value))}
                              className="w-24 bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-right text-sm font-bold text-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                            />
                          ) : (
                            <div className="font-bold text-gray-300">R$ {item.precoUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          <label className="text-[9px] text-gray-600 uppercase font-black mb-1.5 tracking-widest">Qtd.</label>
                          <input 
                            type="number"
                            value={item.quantidade}
                            onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value))}
                            className="w-24 bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-right focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-black text-amber-500 text-lg"
                          />
                        </div>
                        <div className="flex flex-col items-end min-w-[140px]">
                          <label className="text-[9px] text-gray-600 uppercase font-black mb-1.5 tracking-widest">Item Total</label>
                          <div className="font-black text-2xl text-white">R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-3 text-gray-700 hover:text-red-500 transition-all rounded-2xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
                        >
                          <Trash2 size={22} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Checkout Panel */}
          <div className="space-y-6">
            {/* Medição Inteligente NPU */}
            <SmartMeasureUI onMeasure={handleAiMeasurement} />

            <div className="bg-[#111113] border border-white/10 rounded-[2.5rem] p-10 sticky top-8 shadow-[0_48px_80px_-16px_rgba(0,0,0,0.6)] backdrop-blur-xl">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black flex items-center gap-3 italic">
                  FECHAMENTO
                </h3>
                <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-black shadow-lg shadow-amber-500/30">
                  <Calculator size={24} />
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="flex justify-between text-gray-500 text-sm font-bold uppercase tracking-widest">
                  <span>Subtotal Líquido</span>
                  <span className="text-gray-300">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => setShowBdiModal(true)}
                      className="flex items-center gap-2 group"
                    >
                      <span className="text-gray-400 text-sm font-black uppercase tracking-widest group-hover:text-amber-500 transition-colors">Configurar BDI</span>
                      <Settings size={14} className="text-gray-600 group-hover:rotate-90 transition-transform" />
                    </button>
                    <div className="flex items-center gap-2 font-black text-amber-500 text-xl italic drop-shadow-sm">
                      {bdiValue}%
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-600 font-medium leading-tight">
                    Incidência técnica de benefícios e despesas indiretas sobre o custo base.
                  </div>
                  <div className="flex justify-between text-amber-500/80 text-sm font-black italic">
                    <span>Adicional BDI</span>
                    <span>R$ {valorBdi.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div className="h-px bg-white/5 my-4" />

                <div className="space-y-3">
                  <div className="text-[10px] text-gray-600 uppercase font-black tracking-[0.4em] ml-1">Preço Final de Venda</div>
                  <div className="text-5xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] tracking-tighter">
                    R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleWhatsApp}
                    className="flex items-center justify-center gap-2 py-4 rounded-3xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-500 font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <MessageCircle size={18} /> WhatsApp
                  </button>
                  <button 
                    onClick={handleEmail}
                    className="flex items-center justify-center gap-2 py-4 rounded-3xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-500 font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <Mail size={18} /> E-mail
                  </button>
                </div>

                <div className="pt-2">
                  <div className="bg-amber-500/5 rounded-3xl p-6 border border-amber-500/10 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-amber-500">
                        <Info size={16} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-black text-amber-500 uppercase tracking-widest">Condições Padrão</h4>
                        <p className="text-[12px] text-gray-500 font-medium leading-relaxed">
                          Pagamento: 50% Entrada / 50% Conclusão.<br />
                          Validade da proposta: 15 dias corridos.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support context Footer */}
            <div className="px-6 text-center space-y-3">
              <p className="text-[9px] text-gray-800 uppercase tracking-[0.5em] font-black">
                Development Ecosystem
              </p>
              <div className="flex flex-col gap-1">
                <p className="text-[11px] text-gray-600 font-bold">
                  © Automações Comerciais Integradas! 2026
                </p>
                <Link href="https://wa.me/558894227586" className="text-[10px] text-gray-700 hover:text-amber-500 transition-colors font-medium">
                  Suporte especializado: 88 9422-7586
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* BDI Calculator Modal */}
      {showBdiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowBdiModal(false)} />
          <div className="bg-[#111113] w-full max-w-xl rounded-[3rem] border border-white/10 shadow-[0_64px_128px_-16px_rgba(0,0,0,1)] relative overflow-hidden backdrop-blur-2xl">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                  <Settings size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black italic tracking-tight">ENGENHARIA DE CUSTOS</h3>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Configuração de Coeficientes Técnicos</p>
                </div>
              </div>
              <button 
                onClick={() => setShowBdiModal(false)}
                className="p-3 text-gray-500 hover:text-white transition-all hover:bg-white/5 rounded-2xl"
              >
                <X size={28} />
              </button>
            </div>
            
            <div className="p-10 space-y-10">
              <div className="grid grid-cols-2 gap-x-14 gap-y-10">
                <div className="space-y-3">
                  <label className="flex items-center justify-between px-1">
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Adm. Central</span>
                    <span className="text-amber-500 font-black font-mono">{bdiVars.ac}%</span>
                  </label>
                  <input 
                    type="range" min="0" max="25" step="0.5"
                    value={bdiVars.ac}
                    onChange={(e) => setBdiVars({...bdiVars, ac: parseFloat(e.target.value)})}
                    className="w-full accent-amber-500 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center justify-between px-1">
                    <span className="text-[10px] text-emerald-500/50 font-black uppercase tracking-widest">Lucro Desejado</span>
                    <span className="text-emerald-500 font-black font-mono">{bdiVars.l}%</span>
                  </label>
                  <input 
                    type="range" min="0" max="40" step="1"
                    value={bdiVars.l}
                    onChange={(e) => setBdiVars({...bdiVars, l: parseFloat(e.target.value)})}
                    className="w-full accent-emerald-500 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center justify-between px-1">
                    <span className="text-[10px] text-red-400/50 font-black uppercase tracking-widest">Imp. sobre Venda</span>
                    <span className="text-red-400 font-black font-mono">{bdiVars.i}%</span>
                  </label>
                  <input 
                    type="range" min="0" max="30" step="0.05"
                    value={bdiVars.i}
                    onChange={(e) => setBdiVars({...bdiVars, i: parseFloat(e.target.value)})}
                    className="w-full accent-red-400 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center justify-between px-1">
                    <span className="text-[10px] text-blue-400/50 font-black uppercase tracking-widest">Custo Financeiro</span>
                    <span className="text-blue-400 font-black font-mono">{bdiVars.df}%</span>
                  </label>
                  <input 
                    type="range" min="0" max="10" step="0.1"
                    value={bdiVars.df}
                    onChange={(e) => setBdiVars({...bdiVars, df: parseFloat(e.target.value)})}
                    className="w-full accent-blue-400 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center justify-between px-1">
                    <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Risco / Reserva</span>
                    <span className="text-gray-300 font-black font-mono">{bdiVars.r}%</span>
                  </label>
                  <input 
                    type="range" min="0" max="15" step="0.1"
                    value={bdiVars.r}
                    onChange={(e) => setBdiVars({...bdiVars, r: parseFloat(e.target.value)})}
                    className="w-full accent-white/20 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center justify-between px-1">
                    <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Seguros & Gar.</span>
                    <span className="text-gray-300 font-black font-mono">{(bdiVars.s + bdiVars.g).toFixed(2)}%</span>
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="number" step="0.01" value={bdiVars.s}
                      onChange={(e) => setBdiVars({...bdiVars, s: parseFloat(e.target.value)})}
                      className="w-1/2 bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs font-mono text-center focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <input 
                      type="number" step="0.01" value={bdiVars.g}
                      onChange={(e) => setBdiVars({...bdiVars, g: parseFloat(e.target.value)})}
                      className="w-1/2 bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs font-mono text-center focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/10 flex items-center justify-between shadow-inner relative overflow-hidden group/final">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover/final:opacity-100 transition-opacity" />
                <div className="space-y-1 relative z-10">
                  <div className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">BDI Calculado</div>
                  <div className="text-6xl font-black text-white italic tracking-tighter drop-shadow-xl underline decoration-amber-500/30 underline-offset-8">
                    {bdiValue}%
                  </div>
                </div>
                <button 
                  onClick={() => setShowBdiModal(false)}
                  className="bg-amber-500 text-black px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-amber-400 transition-all shadow-[0_20px_40px_-10px_rgba(245,158,11,0.4)] active:scale-95 relative z-10"
                >
                  APLICAR
                </button>
              </div>
              
              <div className="flex items-center gap-2 justify-center py-2">
                <Info size={12} className="text-gray-600" />
                <p className="text-[9px] text-gray-700 font-black uppercase tracking-[0.2em] text-center">
                  Fórmula Técnica IBEC: ( (1+AC+S+R+G)*(1+DF)*(1+L) / (1-I) ) - 1
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

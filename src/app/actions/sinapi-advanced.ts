'use server'

import { prisma } from '@/lib/prisma'
import { normalizeText } from '@/lib/searchUtils'

export interface SearchResult {
  id: string
  codigo: string
  descricao: string
  unidade: string
  preco: number
  tipo: 'INSUMO' | 'COMPOSIÇÃO'
  fonte?: string
  estado?: string
  dataRef?: string
  score?: number // Score de relevância
}

export interface SearchFilters {
  query: string
  type?: 'INSUMO' | 'COMPOSIÇÃO' | 'ALL'
  unidade?: string
  precoMin?: number
  precoMax?: number
  limit?: number
  sortBy?: 'relevancia' | 'preco_asc' | 'preco_desc' | 'codigo' | 'descricao'
}

/**
 * Calcula score de relevância baseado em múltiplos fatores
 */
function calculateRelevanceScore(
  item: { codigo: string; descricao: string },
  query: string
): number {
  const queryLower = query.toLowerCase()
  const codigoLower = item.codigo.toLowerCase()
  const descricaoLower = item.descricao.toLowerCase()

  let score = 0

  // Match exato no código (maior prioridade)
  if (codigoLower === queryLower) {
    score += 100
  }
  // Match exato no início da descrição
  else if (descricaoLower.startsWith(queryLower)) {
    score += 80
  }
  // Match exato no início do código
  else if (codigoLower.startsWith(queryLower)) {
    score += 70
  }
  // Match parcial no código
  else if (codigoLower.includes(queryLower)) {
    score += 50
  }
  // Match de palavra completa na descrição
  else if (descricaoLower.split(/\s+/).some(word => word.startsWith(queryLower))) {
    score += 40
  }
  // Match parcial na descrição
  else if (descricaoLower.includes(queryLower)) {
    score += 20
  }

  // Bônus por código curto (mais específico)
  if (item.codigo.length <= 8) {
    score += 5
  }

  return score
}

/**
 * Busca avançada no SINAPI com múltiplos filtros e ordenação por relevância
 */
export async function searchSinapi(filters: SearchFilters): Promise<SearchResult[]> {
  const {
    query,
    type = 'ALL',
    unidade,
    precoMin,
    precoMax,
    limit = 20,
    sortBy = 'relevancia',
  } = filters

  if (!query || query.length < 2) {
    return []
  }

  const normalizedQuery = normalizeText(query)

  // Filtros comuns
  const baseFilters: any = {
    OR: [
      { descricao: { contains: query, mode: 'insensitive' as const } },
      { codigo: { contains: query, mode: 'insensitive' as const } },
    ],
  }

  // Filtro por unidade
  if (unidade && unidade !== 'ALL') {
    baseFilters.unidade = { equals: unidade, mode: 'insensitive' as const }
  }

  // Filtros de preço
  const priceFilters: any = {}
  if (precoMin !== undefined && precoMin > 0) {
    priceFilters.gte = precoMin
  }
  if (precoMax !== undefined && precoMax > 0) {
    priceFilters.lte = precoMax
  }

  let insumos: any[] = []
  let composicoes: any[] = []

  // Buscar Insumos
  if (type === 'ALL' || type === 'INSUMO') {
    const insumoWhere: any = { AND: [baseFilters] }
    if (Object.keys(priceFilters).length > 0) {
      insumoWhere.AND.push({ precoMedio: priceFilters })
    }

    insumos = await prisma.insumo.findMany({
      where: insumoWhere,
      take: type === 'ALL' ? limit * 2 : limit,
      orderBy:
        sortBy === 'preco_asc'
          ? { precoMedio: 'asc' }
          : sortBy === 'preco_desc'
          ? { precoMedio: 'desc' }
          : sortBy === 'codigo'
          ? { codigo: 'asc' }
          : sortBy === 'descricao'
          ? { descricao: 'asc' }
          : undefined,
    })
  }

  // Buscar Composições
  if (type === 'ALL' || type === 'COMPOSIÇÃO') {
    const composicaoWhere: any = { AND: [baseFilters] }
    if (Object.keys(priceFilters).length > 0) {
      composicaoWhere.AND.push({ precoTotal: priceFilters })
    }

    composicoes = await prisma.composicao.findMany({
      where: composicaoWhere,
      take: type === 'ALL' ? limit * 2 : limit,
      orderBy:
        sortBy === 'preco_asc'
          ? { precoTotal: 'asc' }
          : sortBy === 'preco_desc'
          ? { precoTotal: 'desc' }
          : sortBy === 'codigo'
          ? { codigo: 'asc' }
          : sortBy === 'descricao'
          ? { descricao: 'asc' }
          : undefined,
    })
  }

  // Transformar e calcular scores
  const results: SearchResult[] = [
    ...insumos.map((i) => ({
      id: i.id,
      codigo: i.codigo,
      descricao: i.descricao,
      unidade: i.unidade,
      preco: i.precoMedio,
      tipo: 'INSUMO' as const,
      fonte: i.fonte,
      estado: i.estado,
      dataRef: i.dataRef.toISOString(),
      score: calculateRelevanceScore(i, query),
    })),
    ...composicoes.map((c) => ({
      id: c.id,
      codigo: c.codigo,
      descricao: c.descricao,
      unidade: c.unidade,
      preco: c.precoTotal,
      tipo: 'COMPOSIÇÃO' as const,
      fonte: c.fonte,
      estado: c.estado,
      dataRef: c.dataRef.toISOString(),
      score: calculateRelevanceScore(c, query),
    })),
  ]

  // Ordenar por relevância se necessário
  if (sortBy === 'relevancia') {
    results.sort((a, b) => (b.score || 0) - (a.score || 0))
  }

  // Limitar resultados
  return results.slice(0, limit)
}

/**
 * Busca unidades disponíveis para filtro
 */
export async function getUnidadesDisponiveis(): Promise<string[]> {
  const insumos = await prisma.insumo.findMany({
    select: { unidade: true },
    distinct: ['unidade'],
  })

  return insumos.map((i) => i.unidade).sort()
}

/**
 * Busca um item específico por código
 */
export async function getItemByCodigo(codigo: string): Promise<SearchResult | null> {
  // Tentar em Insumos
  const insumo = await prisma.insumo.findUnique({
    where: { codigo },
  })

  if (insumo) {
    return {
      id: insumo.id,
      codigo: insumo.codigo,
      descricao: insumo.descricao,
      unidade: insumo.unidade,
      preco: insumo.precoMedio,
      tipo: 'INSUMO',
      fonte: insumo.fonte,
      estado: insumo.estado,
      dataRef: insumo.dataRef.toISOString(),
    }
  }

  // Tentar em Composições
  const composicao = await prisma.composicao.findUnique({
    where: { codigo },
  })

  if (composicao) {
    return {
      id: composicao.id,
      codigo: composicao.codigo,
      descricao: composicao.descricao,
      unidade: composicao.unidade,
      preco: composicao.precoTotal,
      tipo: 'COMPOSIÇÃO',
      fonte: composicao.fonte,
      estado: composicao.estado,
      dataRef: composicao.dataRef.toISOString(),
    }
  }

  return null
}

'use server'

import { PrismaClient, Insumo, Composicao } from '@prisma/client'

const prisma = new PrismaClient()

export interface SearchResult {
  id: string
  codigo: string
  descricao: string
  unidade: string
  preco: number
  tipo: 'INSUMO' | 'COMPOSIÇÃO'
}

export async function searchSinapi(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return []

  // Busca em Insumos
  const insumos = await prisma.insumo.findMany({
    where: {
      OR: [
        { descricao: { contains: query } },
        { codigo: { contains: query } },
      ],
    },
    take: 10,
  })

  // Busca em Composições
  const composicoes = await prisma.composicao.findMany({
    where: {
      OR: [
        { descricao: { contains: query } },
        { codigo: { contains: query } },
      ],
    },
    take: 10,
  })

  // Transformar para um formato unificado para a UI do editor
  const results: SearchResult[] = [
    ...insumos.map((i: Insumo) => ({
      id: i.id,
      codigo: i.codigo,
      descricao: i.descricao,
      unidade: i.unidade,
      preco: i.precoMedio,
      tipo: 'INSUMO' as const,
    })),
    ...composicoes.map((c: Composicao) => ({
      id: c.id,
      codigo: c.codigo,
      descricao: c.descricao,
      unidade: c.unidade,
      preco: c.precoTotal,
      tipo: 'COMPOSIÇÃO' as const,
    })),
  ]

  return results
}

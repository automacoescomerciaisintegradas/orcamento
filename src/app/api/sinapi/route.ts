import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * API para busca de Insumos e Composições do SINAPI
 * 
 * Query params:
 * - q: termo de busca (descricao ou codigo)
 * - type: tipo de busca (INSUMO, COMPOSICAO, ou ALL)
 * - unidade: filtro por unidade (opcional)
 * - page: página (default: 1)
 * - limit: itens por página (default: 20)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "ALL";
    const unidade = searchParams.get("unidade") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // Busca por código ou descrição
    const searchFilter = query
      ? {
          OR: [
            { codigo: { contains: query, mode: "insensitive" as const } },
            { descricao: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {};

    const unidadeFilter = unidade ? { unidade: { equals: unidade, mode: "insensitive" as const } } : {};

    let insumos: any[] = [];
    let composicoes: any[] = [];
    let totalInsumos = 0;
    let totalComposicoes = 0;

    // Buscar Insumos
    if (type === "ALL" || type === "INSUMO") {
      const [insumosResult, insumosCount] = await Promise.all([
        prisma.insumo.findMany({
          where: {
            AND: [searchFilter, unidadeFilter],
          },
          skip: offset,
          take: limit,
          orderBy: { codigo: "asc" },
        }),
        prisma.insumo.count({
          where: {
            AND: [searchFilter, unidadeFilter],
          },
        }),
      ]);
      insumos = insumosResult;
      totalInsumos = insumosCount;
    }

    // Buscar Composições
    if (type === "ALL" || type === "COMPOSICAO") {
      const [composicoesResult, composicoesCount] = await Promise.all([
        prisma.composicao.findMany({
          where: {
            AND: [searchFilter, unidadeFilter],
          },
          skip: offset,
          take: limit,
          orderBy: { codigo: "asc" },
        }),
        prisma.composicao.count({
          where: {
            AND: [searchFilter, unidadeFilter],
          },
        }),
      ]);
      composicoes = composicoesResult;
      totalComposicoes = composicoesCount;
    }

    return NextResponse.json({
      data: {
        insumos,
        composicoes,
      },
      pagination: {
        page,
        limit,
        totalInsumos,
        totalComposicoes,
        totalPagesInsumos: Math.ceil(totalInsumos / limit),
        totalPagesComposicoes: Math.ceil(totalComposicoes / limit),
      },
    });
  } catch (error) {
    console.error("Erro na busca SINAPI:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados do SINAPI" },
      { status: 500 }
    );
  }
}

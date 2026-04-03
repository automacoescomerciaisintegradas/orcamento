import * as XLSX from "xlsx";
import { prisma } from "./prisma";

/**
 * SINAPI Importer Utility
 * Processes SINAPI Excel files (Insumos and Composições) from the CAIXA website
 * and populates the SQLite database.
 */

export async function importSinapiExcel(filePath: string, type: "INSUMO" | "COMPOSICAO", estado: string, dataRef: Date) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
  
  // Skip header rows (usually first 6-7 rows in CAIXA's spreadsheets)
  // Logic needs to find where the actual data begins based on column headers.
  let startIndex = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].some(cell => String(cell).toLowerCase().includes("código") || String(cell).toLowerCase().includes("codigo"))) {
      startIndex = i + 1;
      break;
    }
  }

  console.log(`Iniciando importação de ${type} (${estado}) - ${data.length - startIndex} registros encontrados.`);

  for (let i = startIndex; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length < 3) continue;

    try {
      if (type === "INSUMO") {
        // Expected columns for Insumo: Código, Descrição, Unidade, Preço Mediano
        const codigo = String(row[0]);
        const descricao = String(row[1]);
        const unidade = String(row[2]);
        const preco = parseFloat(String(row[3]).replace(",", "."));

        if (!codigo || isNaN(preco)) continue;

        await prisma.insumo.upsert({
          where: { codigo },
          update: { descricao, unidade, precoMedio: preco, estado, dataRef },
          create: { codigo, descricao, unidade, precoMedio: preco, estado, dataRef }
        });
      } else {
        // Expected columns for Composicao: Código, Descrição, Unidade, Preço Total
        const codigo = String(row[1]); // Composições costumam ter colunas diferentes
        const descricao = String(row[2]);
        const unidade = String(row[3]);
        const preco = parseFloat(String(row[6]).replace(",", "."));

        if (!codigo || isNaN(preco)) continue;

        await prisma.composicao.upsert({
          where: { codigo },
          update: { descricao, unidade, precoTotal: preco, estado, dataRef },
          create: { codigo, descricao, unidade, precoTotal: preco, estado, dataRef }
        });
      }
    } catch (error) {
      console.warn(`Erro na linha ${i}:`, error);
    }
  }

  console.log(`Importação de ${type} concluída.`);
}

"use server";

export interface RtcInput {
  valorBruto: number;
  aliquotaIss: number;
  dataReferencia: string;
}

export interface RtcOutput {
  valorIss: number;
  valorLiquido: number;
  impacto2026: {
    ibs: number; // 0.1% transition
    cbs: number; // 0.1% transition
    totalReforma: number;
  };
  valid: boolean;
  message?: string;
}

/**
 * Calcula o ISS e simula o impacto da Reforma Tributária 2026 (IBS/CBS).
 * Seguindo a Lei Complementar 116/2003 e a Emenda Constitucional 132/2023.
 */
export async function calcularIssReforma(input: RtcInput): Promise<RtcOutput> {
  const { valorBruto, aliquotaIss } = input;

  // Validação Alíquota ISS (2-5% conforme LC 116/2003)
  if (aliquotaIss < 2 || aliquotaIss > 5) {
    return {
      valorIss: 0,
      valorLiquido: valorBruto,
      impacto2026: { ibs: 0, cbs: 0, totalReforma: 0 },
      valid: false,
      message: "A alíquota de ISS deve estar entre 2% e 5%.",
    };
  }

  // Cálculo ISS Atual
  const valorIss = (valorBruto * aliquotaIss) / 100;
  const valorLiquido = valorBruto - valorIss;

  // Simulação Transição 2026 (IBS e CBS a 0.1% cada)
  // Nota: Durante a transição, esses valores são cobrados para teste do sistema.
  const ibs2026 = (valorBruto * 0.1) / 100;
  const cbs2026 = (valorBruto * 0.1) / 100;
  const totalReforma = ibs2026 + cbs2026;

  // Integração com API Real (Mocked ou Pilot)
  // try {
  //   const response = await fetch("https://piloto-cbs.tributos.gov.br/servico/calculadora-consumo/api/calculadora/regime-geral", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ ... })
  //   });
  //   // ... process real API response
  // } catch (e) {
  //   console.error("RTC API Offline, using local fallback calculation.");
  // }

  return {
    valorIss,
    valorLiquido,
    impacto2026: {
      ibs: ibs2026,
      cbs: cbs2026,
      totalReforma,
    },
    valid: true,
  };
}

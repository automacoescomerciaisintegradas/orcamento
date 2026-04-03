import { NextRequest, NextResponse } from 'next/server'

/**
 * API para geração de contrato jurídico dinâmico
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { cliente, items, total, bdi, dataAtual } = data

    const subtotal = items.reduce((acc: number, item: any) => acc + item.total, 0)
    const valorEntrada = total * 0.5
    const valorFinal = total * 0.5
    const validadeDias = 15

    // Template do Contrato (Markdown / Texto formatado)
    const contratoTemplate = `
# CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE PINTURA E ACABAMENTO

**CONTRATADA (PRESTADOR):**
RAIMUNDO NONATO QUEIROS ALVES (RQR Pinturas)
CNPJ: 61.189.176/0001-28
Telefone: (88) 99677-9445

**CONTRATANTE (CLIENTE):**
Nome: ${cliente.nome || '________________________________'}
CPF/CNPJ: ${cliente.documento || '________________________________'}
Endereço: ${cliente.endereco || '________________________________'}

---

## 1. OBJETO DO SERVIÇO
Prestação de serviço especializado de pintura e acabamentos técnicos conforme detalhamento abaixo:

${items.map((item: any) => `- ${item.descricao} (${item.quantidade} ${item.unidade})`).join('\n')}

---

## 2. VALORES E CONDIÇÕES DE PAGAMENTO
O valor total do investimento para a execução dos serviços acima descritos é de:
**R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}** (Já incluso BDI de ${bdi}%).

**Condição de Pagamento (50/50):**
- **Sinal / Entrada (50%):** R$ ${valorEntrada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (Vencimento na aprovação)
- **Parcela Final (50%):** R$ ${valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (Vencimento na entrega final)

---

## 3. VALIDADE E PRAZOS
Esta proposta tem validade de **${validadeDias} dias corridos** a partir da data de emissão.
Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}

---

## 4. ASSINATURAS

__________________________________________
${cliente.nome || 'CONTRATANTE'}

__________________________________________
RAIMUNDO NONATO QUEIROS ALVES (CONTRATADA)
`

    return NextResponse.json({ 
      success: true, 
      content: contratoTemplate,
      filename: `contrato-${cliente.nome?.replace(/\s+/g, '-').toLowerCase() || 'proposta'}.md`
    })

  } catch (error) {
    console.error("Erro ao gerar contrato:", error)
    return NextResponse.json({ error: "Falha na geração do documento" }, { status: 500 })
  }
}

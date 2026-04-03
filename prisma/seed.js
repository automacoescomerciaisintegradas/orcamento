const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Semeando dados de teste do SINAPI...');

  const insumos = [
    { codigo: '3750', descricao: 'TINTA EPOXI PARA PISOS E PAREDES', unidade: 'GL', precoMedio: 189.90, estado: 'CE', dataRef: new Date('2026-02-01') },
    { codigo: '88489', descricao: 'PINTURA DE MEIO-FIO COM TINTA EPÓXI, 2 DEMÃOS', unidade: 'M', precoMedio: 45.67, estado: 'CE', dataRef: new Date('2026-02-01') },
    { codigo: '12345', descricao: 'BLOCO DE CONCRETO 19X19X39CM (GELO BAIANO)', unidade: 'UN', precoMedio: 4.50, estado: 'CE', dataRef: new Date('2026-02-01') },
    { codigo: '40552', descricao: 'PEDREIRO COM ENCARGOS COMPLEMENTARES', unidade: 'H', precoMedio: 25.50, estado: 'CE', dataRef: new Date('2026-02-01') },
    { codigo: '40566', descricao: 'PINTOR COM ENCARGOS COMPLEMENTARES', unidade: 'H', precoMedio: 22.80, estado: 'CE', dataRef: new Date('2026-02-01') }
  ];

  for (const insumo of insumos) {
    try {
      await prisma.insumo.upsert({
        where: { codigo: insumo.codigo },
        update: insumo,
        create: insumo,
      });
      console.log(`Insumo ${insumo.codigo} pronto.`);
    } catch (err) {
      console.error(`Erro ao inserir ${insumo.codigo}:`, err.message);
    }
  }

  console.log('Dados semeados com sucesso.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

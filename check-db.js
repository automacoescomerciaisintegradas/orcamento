const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.insumo.count();
  console.log(`Banco de dados: ${count} insumos cadastrados.`);
  
  const insumos = await prisma.insumo.findMany({ take: 5 });
  console.log('Primeiros 5 resultados:', JSON.stringify(insumos, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

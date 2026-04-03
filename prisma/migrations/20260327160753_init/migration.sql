-- CreateTable
CREATE TABLE "Insumo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "unidade" TEXT NOT NULL,
    "precoMedio" REAL NOT NULL,
    "fonte" TEXT NOT NULL DEFAULT 'SINAPI',
    "estado" TEXT NOT NULL,
    "dataRef" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Composicao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "unidade" TEXT NOT NULL,
    "precoTotal" REAL NOT NULL,
    "fonte" TEXT NOT NULL DEFAULT 'SINAPI',
    "estado" TEXT NOT NULL,
    "dataRef" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "documento" TEXT,
    "email" TEXT,
    "telefone" TEXT,
    "endereco" TEXT
);

-- CreateTable
CREATE TABLE "Orcamento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "dataCriacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validadeDias" INTEGER NOT NULL DEFAULT 15,
    "status" TEXT NOT NULL DEFAULT 'RASCUNHO',
    "bdi" REAL NOT NULL DEFAULT 25.0,
    "condicoesPgto" TEXT NOT NULL DEFAULT '50% de entrada na aprovação e 50% na entrega final.',
    "clienteId" TEXT NOT NULL,
    CONSTRAINT "Orcamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemOrcamento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descricao" TEXT NOT NULL,
    "quantidade" REAL NOT NULL,
    "precoUnitario" REAL NOT NULL,
    "total" REAL NOT NULL,
    "ordem" INTEGER NOT NULL,
    "orcamentoId" TEXT NOT NULL,
    "insumoId" TEXT,
    "composicaoId" TEXT,
    CONSTRAINT "ItemOrcamento_orcamentoId_fkey" FOREIGN KEY ("orcamentoId") REFERENCES "Orcamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ItemOrcamento_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "Insumo" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ItemOrcamento_composicaoId_fkey" FOREIGN KEY ("composicaoId") REFERENCES "Composicao" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Configuracao" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'GLOBAL',
    "empresaNome" TEXT NOT NULL DEFAULT 'Automações Comerciais Integradas! 2026',
    "empresaCnpj" TEXT NOT NULL DEFAULT '61.189.176/0001-28',
    "empresaLogotipo" TEXT,
    "contatoEmail" TEXT NOT NULL DEFAULT 'contato@automacoescomerciais.com.br',
    "contatoWhatsapp" TEXT NOT NULL DEFAULT 'https://wa.me/558894227586'
);

-- CreateIndex
CREATE UNIQUE INDEX "Insumo_codigo_key" ON "Insumo"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Composicao_codigo_key" ON "Composicao"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Orcamento_numero_key" ON "Orcamento"("numero");

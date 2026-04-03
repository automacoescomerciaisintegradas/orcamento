-- Limpar dados anteriores para evitar conflitos de teste
DELETE FROM ItemOrcamento;
DELETE FROM Orcamento;
DELETE FROM Cliente;
DELETE FROM Insumo;
DELETE FROM Composicao;

-- Inserir Insumos (Materiais e Mão de Obra direta)
INSERT INTO Insumo (id, codigo, descricao, unidade, precoMedio, fonte, estado, dataRef) 
VALUES ('ins1', '3750', 'TINTA EPOXI PARA PISOS E PAREDES', 'GL', 189.90, 'SINAPI', 'CE', 1738368000000);

INSERT INTO Insumo (id, codigo, descricao, unidade, precoMedio, fonte, estado, dataRef) 
VALUES ('ins2', '40552', 'PEDREIRO COM ENCARGOS COMPLEMENTARES', 'H', 25.50, 'SINAPI', 'CE', 1738368000000);

INSERT INTO Insumo (id, codigo, descricao, unidade, precoMedio, fonte, estado, dataRef) 
VALUES ('ins3', '40566', 'PINTOR COM ENCARGOS COMPLEMENTARES', 'H', 22.80, 'SINAPI', 'CE', 1738368000000);

-- Inserir Composições (Serviços completos que usam insumos)
INSERT INTO Composicao (id, codigo, descricao, unidade, precoTotal, fonte, estado, dataRef) 
VALUES ('comp1', '88489', 'PINTURA DE MEIO-FIO COM TINTA EPÓXI, 2 DEMÃOS', 'M', 45.67, 'SINAPI', 'CE', 1738368000000);

INSERT INTO Composicao (id, codigo, descricao, unidade, precoTotal, fonte, estado, dataRef) 
VALUES ('comp2', '87529', 'ALVENARIA DE VEDAÇÃO COM BLOCOS DE CONCRETO 19X19X39CM', 'M2', 125.40, 'SINAPI', 'CE', 1738368000000);

-- Inserir um Cliente de Teste
INSERT INTO Cliente (id, nome, documento, email, telefone, endereco)
VALUES ('cli1', 'Raimundo Teste', '000.000.000-00', 'cliente@exemplo.com', '(88) 99999-9999', 'Rua da Obra, 123');

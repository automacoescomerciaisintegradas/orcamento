## 📚 **DOCUMENTAÇÃO ATUALIZADA - SISTEMA DE ORÇAMENTOS**


# 📑 **SISTEMA DE ORÇAMENTOS**
### *Programa para criar orçamentos para oficinas com API REST integrada*

---

## 📋 **SUMÁRIO**
1. [Visão Geral](#-visão-geral)
2. [Funcionalidades Principais](#-funcionalidades-principais)
3. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
4. [Arquitetura do Sistema](#-arquitetura-do-sistema)
5. [API REST - Endpoints](#-api-rest---endpoints)
6. [Exemplos de Requisições](#-exemplos-de-requisições)
7. [Modelo de Dados](#-modelo-de-dados)
8. [Como Executar](#-como-executar)
9. [Testando com Postman](#-testando-com-postman)
10. [Estrutura do Frontend](#-estrutura-do-frontend)
11. [Contribuição](#-contribuição)
12. [Contato do Desenvolvedor](#-contato-do-desenvolvedor)

---

## 🎯 **VISÃO GERAL**

Ferramenta web moderna e responsiva para **criação de orçamentos de manutenção veicular**, com foco em **usabilidade**, **automatização**, **geração de documentos profissionais (PDF)** e **API REST completa** para persistência de dados.

O sistema é composto por:
- **Frontend:** Interface web elegante e responsiva
- **Backend:** API REST desenvolvida em Spring Boot
- **Banco de Dados:** H2 (em memória ou arquivo)
- **Documentação:** OpenAPI/Swagger disponível

---

## ✨ **FUNCIONALIDADES PRINCIPAIS**

### **Frontend**
- ✅ **Entrada de Dados Simplificada:** Formulário intuitivo para informações da empresa, cliente, veículo e itens do orçamento
- ✅ **Cálculo Automático de Sinistro:** Aplicação dinâmica de percentual de acréscimo sobre o subtotal
- ✅ **Prévia em Tempo Real:** Visualização instantânea do orçamento final
- ✅ **Gestão de Itens:** Adição, remoção e cálculo automático
- ✅ **Upload e Otimização de Imagens:** Drag and drop com compressão automática
- ✅ **Geração de PDF Profissional:** Documentos estruturados e prontos para envio
- ✅ **Design Moderno:** Tema azul, animações suaves e ícones elegantes

### **Backend (API REST)**
- ✅ **CRUD Completo:** Criar, listar, buscar, atualizar e deletar orçamentos
- ✅ **Gestão de Itens:** Endpoints específicos para itens do orçamento
- ✅ **Cálculos Automáticos:** Subtotal e total com sinistro via API
- ✅ **Validações:** Dados validados antes de persistir
- ✅ **Persistência:** Banco H2 com opção em memória ou arquivo
- ✅ **CORS Configurado:** Pronto para consumo por qualquer frontend

---

## 🛠️ **TECNOLOGIAS UTILIZADAS**

### **Frontend**
| Tecnologia | Finalidade |
|------------|------------|
| **HTML5** | Estrutura semântica |
| **CSS3** | Estilização e responsividade |
| **JavaScript (Vanilla)** | Lógica de negócios e interatividade |
| **Font Awesome 6.4.2** | Ícones elegantes |
| **jsPDF 2.5.1** | Geração de PDF |
| **jsPDF-AutoTable** | Tabelas no PDF |

### **Backend**
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| **Spring Boot** | 3.2.x | Framework principal |
| **Java** | 17 | Linguagem de programação |
| **Spring Web** | - | API REST |
| **Spring Data JPA** | - | Persistência |
| **H2 Database** | - | Banco de dados |
| **Lombok** | - | Redução de boilerplate |
| **Maven** | - | Gerenciamento de dependências |

---

## 🏗️ **ARQUITETURA DO SISTEMA**

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   FRONTEND      │────▶│   API REST      │────▶│   BANCO H2      │
│   (index.html)  │     │   (Spring Boot) │     │   (Dados)       │
│                 │◀────│                 │◀────│                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                         │
        │                       │                         │
        ▼                       ▼                         ▼
   Geração PDF             Validações                 Consultas
   Upload Fotos            Cálculos                   Persistência
   Interface               Lógica de Negócio          Relacionamentos
```

---

## 🌐 **API REST - ENDPOINTS**

### **Base URL**
```
http://localhost:8080/api
```

### **Orçamentos**

| Verbo | Endpoint | Descrição | Códigos HTTP |
|-------|----------|-----------|--------------|
| **POST** | `/orcamentos` | Criar novo orçamento | 201 Created, 400 Bad Request |
| **GET** | `/orcamentos` | Listar todos orçamentos | 200 OK |
| **GET** | `/orcamentos/{id}` | Buscar orçamento por ID | 200 OK, 404 Not Found |
| **PUT** | `/orcamentos/{id}` | Atualizar orçamento | 200 OK, 404 Not Found |
| **DELETE** | `/orcamentos/{id}` | Deletar orçamento | 204 No Content |

### **Itens (relacionados a um orçamento)**

| Verbo | Endpoint | Descrição |
|-------|----------|-----------|
| **POST** | `/orcamentos/{id}/itens` | Adicionar item |
| **POST** | `/orcamentos/{id}/itens/batch` | Adicionar múltiplos itens |
| **GET** | `/orcamentos/{id}/itens` | Listar itens |
| **GET** | `/orcamentos/{id}/itens/{itemId}` | Buscar item específico |
| **PUT** | `/orcamentos/{id}/itens/{itemId}` | Atualizar item |
| **DELETE** | `/orcamentos/{id}/itens/{itemId}` | Remover item |
| **DELETE** | `/orcamentos/{id}/itens` | Remover todos itens |

### **Cálculos**

| Verbo | Endpoint | Descrição |
|-------|----------|-----------|
| **GET** | `/orcamentos/{id}/itens/subtotal` | Calcular subtotal |
| **GET** | `/orcamentos/{id}/itens/total` | Calcular total com sinistro |

---

## 📝 **EXEMPLOS DE REQUISIÇÕES**

### **1. CRIAR ORÇAMENTO (POST)**
```json
POST http://localhost:8080/api/orcamentos
Content-Type: application/json

{
  "endereco": "Av. República do Líbano, 1551 - St. Oeste, Goiânia - GO, 74115-030",
  "cliente": "Maria da Silva Santos",
  "clienteEndereco": "Rua das Flores, 123 - Centro, Goiânia - GO, 74000-000",
  "clienteTelefone": "(62) 99988-7766",
  "clienteEmail": "maria.silva@email.com",
  "placaCarro": "ABC-1D23",
  "modeloCarro": "VW Gol 1.0 Highline 2022 Preto",
  "validade": 15,
  "porcentagemSinistro": "10",
  "observacoes": "Orçamento válido por 15 dias. Pagamento à vista com 5% de desconto.",
  "itens": [
    {
      "descricao": "Troca de óleo do motor e filtro de óleo (Semi-sintético)",
      "quantidade": 1,
      "valorUnitario": 350.00
    },
    {
      "descricao": "Alinhamento e balanceamento das 4 rodas",
      "quantidade": 1,
      "valorUnitario": 180.00
    },
    {
      "descricao": "Troca de pastilhas de freio dianteiras",
      "quantidade": 2,
      "valorUnitario": 145.50
    },
    {
      "descricao": "Lavagem e higienização interna completa",
      "quantidade": 1,
      "valorUnitario": 120.00
    },
    {
      "descricao": "Troca de filtro de ar do motor",
      "quantidade": 1,
      "valorUnitario": 85.00
    }
  ],
  "fotos": []
}
```

**Resposta (201 Created):**
```json
{
  "id": 1,
  "empresa": "ITA Frotas",
  "endereco": "Av. República do Líbano, 1551 - St. Oeste, Goiânia - GO, 74115-030",
  "cliente": "Maria da Silva Santos",
  "clienteEndereco": "Rua das Flores, 123 - Centro, Goiânia - GO, 74000-000",
  "clienteTelefone": "(62) 99988-7766",
  "clienteEmail": "maria.silva@email.com",
  "placaCarro": "ABC-1D23",
  "modeloCarro": "VW Gol 1.0 Highline 2022 Preto",
  "validade": 15,
  "porcentagemSinistro": "10",
  "observacoes": "Orçamento válido por 15 dias. Pagamento à vista com 5% de desconto.",
  "itens": [...],
  "subtotal": 875.50,
  "acrescimoSinistro": 87.55,
  "totalGeral": 963.05,
  "dataCriacao": "2026-03-11T12:30:00",
  "dataAtualizacao": "2026-03-11T12:30:00"
}
```

---

### **2. CRIAR SEGUNDO ORÇAMENTO (POST)**
```json
POST http://localhost:8080/api/orcamentos
Content-Type: application/json

{
  "endereco": "Av. República do Líbano, 1551 - St. Oeste, Goiânia - GO",
  "cliente": "João Oliveira",
  "clienteEndereco": "Rua 15, nº 45 - Centro, Goiânia - GO",
  "clienteTelefone": "(62) 98877-5544",
  "clienteEmail": "joao@email.com",
  "placaCarro": "XYZ-2A34",
  "modeloCarro": "Fiat Uno 1.0 2021 Branco",
  "validade": 30,
  "porcentagemSinistro": "5",
  "observacoes": "Orçamento para revisão completa",
  "itens": [
    {
      "descricao": "Revisão completa 50.000km",
      "quantidade": 1,
      "valorUnitario": 890.00
    },
    {
      "descricao": "Troca de pneus dianteiros",
      "quantidade": 2,
      "valorUnitario": 450.00
    }
  ],
  "fotos": []
}
```

---

### **3. LISTAR TODOS ORÇAMENTOS (GET)**
```http
GET http://localhost:8080/api/orcamentos
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "cliente": "Maria da Silva Santos",
    "placaCarro": "ABC-1D23",
    "totalGeral": 963.05,
    ...
  },
  {
    "id": 2,
    "cliente": "João Oliveira",
    "placaCarro": "XYZ-2A34",
    "totalGeral": 1845.00,
    ...
  }
]
```

---

### **4. BUSCAR ORÇAMENTO POR ID (GET)**
```http
GET http://localhost:8080/api/orcamentos/1
```

---

### **5. ATUALIZAR ORÇAMENTO (PUT)**
```http
PUT http://localhost:8080/api/orcamentos/1
Content-Type: application/json

{
  "endereco": "Av. República do Líbano, 1551 - St. Oeste, Goiânia - GO",
  "cliente": "Maria da Silva Santos (ATUALIZADO)",
  "clienteEndereco": "Rua das Flores, 123 - Centro, Goiânia - GO",
  "clienteTelefone": "(62) 99988-7766",
  "clienteEmail": "maria.atualizado@email.com",
  "placaCarro": "ABC-1D23",
  "modeloCarro": "VW Gol 1.0 Highline 2022 Preto",
  "validade": 20,
  "porcentagemSinistro": "15",
  "observacoes": "ORÇAMENTO ATUALIZADO - Validade 20 dias",
  "itens": [...],
  "fotos": []
}
```

---

### **6. DELETAR ORÇAMENTO (DELETE)**
```http
DELETE http://localhost:8080/api/orcamentos/2
```

**Resposta:** `204 No Content`

---

### **7. ADICIONAR ITEM (POST)**
```http
POST http://localhost:8080/api/orcamentos/1/itens
Content-Type: application/json

{
  "descricao": "Troca de bateria 60Ah",
  "quantidade": 1,
  "valorUnitario": 550.00
}
```

---

### **8. CALCULAR SUBTOTAL (GET)**
```http
GET http://localhost:8080/api/orcamentos/1/itens/subtotal
```

**Resposta:**
```json
875.50
```

---

### **9. CALCULAR TOTAL COM SINISTRO (GET)**
```http
GET http://localhost:8080/api/orcamentos/1/itens/total
```

**Resposta:**
```json
963.05
```

---

## 📊 **MODELO DE DADOS**

### **Orçamento**
```java
{
  "id": Long,
  "empresa": String,
  "endereco": String,
  "cliente": String,
  "clienteEndereco": String,
  "clienteTelefone": String,
  "clienteEmail": String,
  "placaCarro": String,
  "modeloCarro": String,
  "validade": Integer,
  "porcentagemSinistro": String,
  "observacoes": String,
  "itens": List<Item>,
  "fotos": List<String>,
  "dataCriacao": LocalDateTime,
  "dataAtualizacao": LocalDateTime
}
```

### **Item**
```java
{
  "id": Long,
  "descricao": String,
  "quantidade": Integer,
  "valorUnitario": BigDecimal,
  "total": BigDecimal (calculado)
}
```

---

## 🚀 **COMO EXECUTAR**

### **Backend (Spring Boot)**

```bash
# Clonar o repositório
git clone [seu-repositorio]

# Entrar na pasta
cd orcamento-api

# Executar com Maven
./mvnw spring-boot:run

# Ou gerar JAR e executar
./mvnw clean package
java -jar target/orcamento-api-1.0.0.jar
```

### **Frontend**
O frontend está integrado no backend. Após iniciar o Spring Boot, acesse:
```
http://localhost:8080
```

### **Acessos Importantes**
| Recurso | URL |
|---------|-----|
| Aplicação Web | http://localhost:8080 |
| API Base | http://localhost:8080/api |
| Console H2 | http://localhost:8080/h2-console |
| Health Check | http://localhost:8080/actuator/health |

---

## 🛠️ **TESTANDO COM POSTMAN**

### **Configuração da Coleção**

1. **Importar a coleção** (arquivo JSON fornecido)
2. **Criar variáveis de ambiente:**
```json
{
  "baseUrl": "localhost:8080",
  "apiUrl": "localhost:8080/api"
}
```

### **Fluxo de Testes Recomendado**

```
1. POST /api/orcamentos (criar primeiro)
2. POST /api/orcamentos (criar segundo)
3. GET  /api/orcamentos (listar todos)
4. GET  /api/orcamentos/1 (buscar específico)
5. POST /api/orcamentos/1/itens (adicionar item)
6. GET  /api/orcamentos/1/itens/subtotal (calcular)
7. PUT  /api/orcamentos/1 (atualizar)
8. DELETE /api/orcamentos/2 (deletar)
```

### **Códigos HTTP Esperados**

| Código | Significado | Quando ocorre |
|--------|-------------|---------------|
| **200 OK** | Sucesso | GET, PUT |
| **201 Created** | Recurso criado | POST |
| **204 No Content** | Sucesso sem corpo | DELETE |
| **400 Bad Request** | Dados inválidos | Validação falhou |
| **404 Not Found** | Recurso não existe | ID inexistente |
| **500 Internal Error** | Erro no servidor | Problema interno |

---

## 🎨 **ESTRUTURA DO FRONTEND**

O frontend está organizado em um único arquivo `index.html` com:

### **Seções Principais**
- **Header:** Título e decoração floral
- **Quick Actions:** Botões para exemplo, limpar e tour
- **Dados da Empresa:** Informações fixas
- **Dados do Cliente/Veículo:** Formulário principal
- **Itens do Orçamento:** Tabela dinâmica
- **Fotos da Avaria:** Upload com preview
- **Observações:** Campo de texto
- **Prévia do Orçamento:** Visualização em tempo real

### **Integração com API**
O JavaScript possui funções dedicadas para comunicação com a API:

```javascript
// Funções principais de integração
async function salvarNoBanco()     // POST /api/orcamentos
async function carregarDoBanco()   // GET /api/orcamentos/{id}
async function listarOrcamentos()  // GET /api/orcamentos
```

---

## 🤝 **CONTRIBUIÇÃO**

### **Como contribuir**
1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### **Sugestões de Melhorias**
- [ ] Adicionar autenticação JWT
- [ ] Implementar busca avançada
- [ ] Adicionar gráficos de análise
- [ ] Suporte a múltiplas empresas
- [ ] Exportar para Excel
- [ ] Envio de e-mail automático
- [ ] Assinatura digital no PDF

---

## 📧 **CONTATO DO DESENVOLVEDOR**

**Desenvolvido por:** Wally Camelo Ferreira  
📧 **E-mail:** [wallycamelo@gmail.com](mailto:wallycamelo@gmail.com)  
📞 **Telefone:** (62) 99875-2663  
🐙 **GitHub:** [@wallycamelo](https://github.com/wallycamelo)  
💼 **LinkedIn:** [Wally Camelo](https://linkedin.com/in/wallycamelo)

---


**Sistema de Orçamentos Elegante**  
*Versão 3.0 | Design Moderno | API REST | 2026*

# SISTEMA-DE-ORÇAMENTOS
Programa para criar orçamentos para oficinas
# 📑 Sistema de Orçamento ITA Frotas

Ferramenta web moderna e responsiva para **criação de orçamentos de manutenção veicular**, com foco em **usabilidade**, **automatização** e **geração de documentos profissionais (PDF)**.

---

## ✨ Funcionalidades Principais

- **Entrada de Dados Simplificada:** Formulário intuitivo para informações da empresa, cliente, veículo e itens do orçamento.  
- **Cálculo Automático de Sinistro:** Aplicação dinâmica de um percentual de acréscimo sobre o subtotal, com atualização em tempo real.  
- **Prévia em Tempo Real:** Visualização instantânea do orçamento final antes da geração do PDF.  
- **Gestão de Itens:** Adição, remoção e cálculo automático do total de itens.  
- **Upload e Otimização de Imagens:** Suporte a _drag and drop_ para fotos de avarias, com compressão e redimensionamento automáticos.  
- **Geração de PDF Profissional:** Utiliza `jsPDF` e `jsPDF-AutoTable` para criar documentos estruturados e prontos para envio.  
- **Armazenamento Local:** Recursos de **Salvar Rascunho** e **Carregar Rascunho** automáticos via `localStorage`.  
- **Design Moderno:** Tema escuro/azul, animações suaves e ícones `Font Awesome`.  
- **Header Imersivo:** Efeito de vídeo de fundo decorativo no cabeçalho.  
- **Responsividade:** Layout adaptável para dispositivos móveis e desktops.  

---

## 🚀 Como Executar o Projeto

Este projeto é **autoexecutável**, sendo um único arquivo `index.html` com todo o código (HTML, CSS e JavaScript).  
Não há necessidade de servidor web ou instalação de dependências.

**Passos:**
1. Baixe o código e salve como `index.html`.  
2. Dê um duplo clique no arquivo.  
3. ✅ O sistema abrirá automaticamente no seu navegador.

---

## 📋 Tecnologias Utilizadas

| Tecnologia | Finalidade |
|-------------|-------------|
| **HTML5** | Estrutura semântica do documento |
| **CSS3** | Estilização moderna, responsividade e variáveis de tema |
| **Vanilla JavaScript** | Lógica de negócios, cálculos e manipulação do DOM |
| **Font Awesome 6.4.2** | Ícones |
| **jsPDF 2.5.1** | Biblioteca principal de geração de PDF |
| **jsPDF-AutoTable 3.5.28** | Plugin para criação de tabelas estruturadas no PDF |

---

## ⚙️ Estrutura do Código

O código está organizado dentro de um único arquivo, mas com separação lógica entre seções:

### 🧩 HTML (`<body>`)
- **`<header>`:** Título e container do vídeo de fundo (fixo no topo).  
- **`.app-container:`** Dividido em:
  - `.form-section:` Formulários, tabela de itens e botões.
  - `.preview-section:` Prévia dinâmica do orçamento.  
- **Formulários agrupados em cartões**: Dados da Empresa, Cliente/Veículo, Itens, Fotos e Observações.

### 🎨 CSS (`<style>`)
Organizado por seções e com variáveis globais `:root` para cores e espaçamentos:
- Variáveis e Reset  
- Header e Vídeo de Fundo  
- Layout Principal (Flexbox)  
- Formulários, Botões e Tabelas  
- Prévia e Upload de Fotos (drag and drop)  
- Responsividade com `@media` queries  

### 🧠 JavaScript (`<script>`)
Encapsulado em uma **IIFE** para evitar poluição global, com um objeto central `orcamento` e funções modulares:

| Função | Descrição |
|--------|------------|
| `initialize()` | Inicializa o player, carrega rascunho e listeners |
| `updateOrcamento()` | Atualiza o objeto principal com os dados de entrada |
| `calculateTotals()` | Recalcula subtotal, sinistro e total geral |
| `renderItemsTable()` | Renderiza a tabela de itens dinamicamente |
| `renderPreview()` | Mostra a prévia do orçamento em tempo real |
| `addItem()` | Adiciona novo item à lista |
| `removeItem(index)` | Remove item pelo índice |
| `handleFileUpload(files)` | Processa e otimiza imagens |
| `optimizeImage(file)` | Redimensiona e comprime imagem via Canvas |
| `renderPhotosPreview()` | Exibe miniaturas das fotos |
| `saveDraft()` / `loadDraft()` | Gerencia rascunhos via localStorage |
| `clearAll()` | Reseta campos e localStorage |
| `populateExample()` | Preenche dados de exemplo |
| `generatePDF()` | Gera o PDF final com texto, tabelas e imagens |
| `showNotification()` | Mostra notificações visuais |
| `formatCurrency(value)` | Formata valores em R$ |

---

## 🧑‍💻 Instruções de Contribuição

Como o projeto é um único arquivo HTML, as contribuições podem seguir estes passos:

1. Clone ou baixe o repositório.  
2. (Opcional) **Separação recomendada:**
   - CSS → `style.css`
   - JavaScript → `script.js`
3. **Customizações sugeridas:**
   - `generatePDF()`: ajustar layout e estilo do PDF.  
   - `MAX_IMAGE_WIDTH` e `IMAGE_QUALITY`: equilibrar qualidade e tamanho final do documento.

---

## ⚠️ Pontos de Atenção

- **Bibliotecas de Terceiros:** O sistema depende de `jsPDF` e `jsPDF-AutoTable`. Substituições devem manter compatibilidade.  
- **Armazenamento Base64:** Imagens são salvas em Base64 no `localStorage`. Muitas imagens podem afetar o desempenho.  
- **Vídeo do Header:** O vídeo do YouTube é usado apenas como fundo animado (autoplay mudo, loop, sem controles).  

---

## 👤 Desenvolvedor

**Desenvolvido por:** Wally Camelo Ferreira  
📧 **E-mail:** [wallycamelo@gmail.com](mailto:wallycamelo@gmail.com)  
📞 **Telefone:** (62) 99875-2663  

---

⭐ _Se este projeto te ajudou, não esqueça de deixar uma estrela no repositório!_

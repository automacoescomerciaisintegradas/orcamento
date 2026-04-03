# Scraping de Fornecedores - ORSE/CEHOP-SE

Script Python para extrair dados de fornecedores do site [ORSE/CEHOP-SE](https://orse.cehop.se.gov.br/fornecedores.asp).

## Instalação

```bash
pip install -r requirements.txt
```

## Uso

### Extrair todos os fornecedores (~105 páginas)
```bash
python scrape_fornecedores.py --all
```

### Extrair apenas algumas páginas (para teste)
```bash
python scrape_fornecedores.py --max-pages 10
```

### Extrair uma página específica
```bash
python scrape_fornecedores.py --page 5
```

### Ver ajuda
```bash
python scrape_fornecedores.py --help
```

## Saída

O script gera um arquivo CSV chamado `fornecedores_orse.csv` com as seguintes colunas:

| Coluna    | Descrição                      |
|-----------|--------------------------------|
| `codigo`  | Código do fornecedor           |
| `nome`    | Nome do fornecedor             |
| `homepage`| Site do fornecedor (se houver) |

## Exemplo de dados

```csv
codigo,nome,homepage
000970,3RCorp/Camcorp,
001114,4M Locações,
000847,A Geradora,http://www.ageradora.com.br
000778,A8 Metal Concept,http://www.a8.ind.br
```

## Funcionalidades

- ✅ Extração automática de todas as páginas
- ✅ Detecção automática de parâmetros de paginação
- ✅ Remoção de duplicatas
- ✅ Delay entre requisições para não sobrecarregar o servidor
- ✅ Salvamento em CSV compatível com Excel

## Dados extraídos

- **Total de fornecedores únicos:** ~1049
- **Páginas processadas:** 105
- **Registros por página:** ~10-13

## Aviso

Este script faz requisições HTTP a um servidor público. Use com responsabilidade e respeite os termos de uso do site.

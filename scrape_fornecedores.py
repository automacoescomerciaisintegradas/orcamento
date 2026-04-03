"""
Script para extrair dados de fornecedores do site ORSE/CEHOP-SE
URL: https://orse.cehop.se.gov.br/fornecedores.asp
"""

import requests
from bs4 import BeautifulSoup
import csv
import time
import re
from urllib.parse import urljoin, urlparse, parse_qs

BASE_URL = "https://orse.cehop.se.gov.br"
FORNECEDORES_URL = f"{BASE_URL}/fornecedores.asp"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}

def get_session():
    """Cria uma sessão requests com headers apropriados"""
    session = requests.Session()
    session.headers.update(HEADERS)
    return session

def extract_fornecedores_from_html(html_content):
    """Extrai lista de fornecedores do HTML da página"""
    soup = BeautifulSoup(html_content, 'html.parser')
    fornecedores = []
    
    # Encontra a tabela de fornecedores
    table = soup.find('table')
    if not table:
        print("⚠️ Tabela não encontrada no HTML")
        return fornecedores
    
    # Encontra todas as linhas (excluindo header)
    rows = table.find_all('tr')
    
    for row in rows:
        cols = row.find_all('td')
        if len(cols) >= 2:  # Pelo menos código e nome
            try:
                codigo = cols[0].get_text(strip=True)
                nome = cols[1].get_text(strip=True)
                
                # Verifica se há homepage na terceira coluna
                homepage = ""
                if len(cols) >= 3:
                    hp_col = cols[2]
                    link = hp_col.find('a')
                    if link and link.get('href'):
                        homepage = link.get('href')
                    else:
                        hp_text = hp_col.get_text(strip=True)
                        if hp_text.lower() not in ['no existente', 'não existente', '-']:
                            homepage = hp_text
                
                # Filtra linhas inválidas (header, footer, etc)
                if codigo and nome and codigo.isdigit():
                    fornecedores.append({
                        'codigo': codigo,
                        'nome': nome,
                        'homepage': homepage
                    })
            except Exception as e:
                continue
    
    return fornecedores

def get_total_pages(html_content):
    """Extrai o total de páginas da paginação"""
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Tenta encontrar informações de paginação
    # Pode estar em links, spans, ou texto na página
    
    # Procura por padrões como "Página X de Y" ou "Total de X registros"
    page_text = soup.get_text()
    
    # Tenta extrair do link "Avançar" ou similar
    avancar_link = soup.find('a', string=re.compile(r'avançar|next|»', re.I))
    
    # Conta links de paginação
    page_links = soup.find_all('a', href=re.compile(r'fornecedores\.asp', re.I))
    
    # Estimativa baseada em 1049 registros / 10 por página = ~105 páginas
    return 105  # Valor conhecido da análise inicial

def discover_pagination_params(session):
    """Descobre os parâmetros de paginação da URL"""
    # Tenta acessar a página e analisar os links
    response = session.get(FORNECEDORES_URL)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Procura todos os links na página
    links = soup.find_all('a', href=True)
    
    pagination_patterns = []
    print("\n🔍 Links de paginação encontrados:")
    for link in links:
        href = link['href']
        text = link.get_text(strip=True)
        # Filtra links relevantes
        if any(x in href.lower() for x in ['fornecedores', 'page', 'pagina', 'pg']) or \
           any(x in text.lower() for x in ['avançar', 'próxima', '>>', '»', '2', '3', '4', '5']):
            pagination_patterns.append({'text': text, 'href': href})
            print(f"   '{text}' -> {href}")
    
    return pagination_patterns

def scrape_all_fornecedores(output_file='fornecedores_orse.csv', max_pages=None):
    """
    Faz scraping de todos os fornecedores
    
    Args:
        output_file: Nome do arquivo CSV de saída
        max_pages: Limite máximo de páginas para processar (None = todas)
    """
    session = get_session()
    todos_fornecedores = []
    
    print("🔍 Acessando página inicial...")
    response = session.get(FORNECEDORES_URL)
    
    if response.status_code != 200:
        print(f"❌ Erro ao acessar página inicial: {response.status_code}")
        return []
    
    # Extrai fornecedores da primeira página
    fornecedores = extract_fornecedores_from_html(response.text)
    todos_fornecedores.extend(fornecedores)
    print(f"✅ Página 1: {len(fornecedores)} fornecedores encontrados")
    
    # Descobre parâmetros de paginação
    print("\n🔍 Descobrindo padrão de paginação...")
    pagination_links = discover_pagination_params(session)
    
    # Tenta identificar o padrão de paginação
    # Padrões comuns: ?page=2, ?pagina=2, ?pg=2
    page_param = None
    for link in pagination_links:
        if '?' in link:
            params = parse_qs(link.split('?')[1])
            for key in params.keys():
                if key.lower() in ['page', 'pagina', 'pg', 'p']:
                    page_param = key
                    break
        if page_param:
            break
    
    # Se não encontrou parâmetro, tenta padrões comuns
    if not page_param:
        print("⚠️ Não foi possível identificar parâmetro de paginação automático")
        print("📋 Tentando padrões comuns...")
        
        # Tenta acessar páginas sequencialmente com diferentes parâmetros
        test_params = ['page', 'pagina', 'pg', 'p']
        for param in test_params:
            test_url = f"{FORNECEDORES_URL}?{param}=2"
            try:
                test_response = session.get(test_url, timeout=10)
                if test_response.status_code == 200:
                    test_fornecedores = extract_fornecedores_from_html(test_response.text)
                    if test_fornecedores:
                        page_param = param
                        print(f"✅ Parâmetro identificado: {param}")
                        break
            except:
                continue
    
    if not page_param:
        print("\n❌ Não foi possível identificar paginação automática")
        print("💡 Salvando resultados da primeira página...")
        save_to_csv(todos_fornecedores, output_file)
        return todos_fornecedores
    
    # Processa páginas restantes
    total_pages = get_total_pages(response.text)
    if max_pages:
        total_pages = min(total_pages, max_pages)
    
    print(f"\n📊 Processando {total_pages - 1} páginas restantes...")
    
    # Tenta extrair o parâmetro correto dos links de paginação
    page_url_pattern = None
    for link_info in pagination_links:
        href = link_info.get('href', '')
        if '?' in href:
            page_url_pattern = href
            break
    
    for page in range(2, total_pages + 1):
        # Constrói URL baseada no padrão encontrado
        if page_url_pattern and '=' in page_url_pattern:
            base_param = page_url_pattern.split('=')[0].split('?')[-1]
            url = f"{FORNECEDORES_URL}?{base_param}={page}"
        else:
            # Fallback para parâmetros comuns
            url = f"{FORNECEDORES_URL}?page={page}"
        
        try:
            response = session.get(url, timeout=15)
            
            if response.status_code != 200:
                print(f"⚠️ Página {page}: Erro {response.status_code}")
                continue
            
            fornecedores = extract_fornecedores_from_html(response.text)
            
            if fornecedores:
                todos_fornecedores.extend(fornecedores)
                print(f"✅ Página {page}: {len(fornecedores)} fornecedores (Total: {len(todos_fornecedores)})")
            else:
                print(f"⚠️ Página {page}: Nenhum fornecedor encontrado (possível fim da lista)")
                break
            
            # Delay para não sobrecarregar o servidor
            time.sleep(1)
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Página {page}: Erro na requisição - {e}")
            continue
    
    # Salva resultados
    save_to_csv(todos_fornecedores, output_file)
    
    print(f"\n{'='*60}")
    print(f"✅ Scraping concluído!")
    print(f"📦 Total de fornecedores extraídos: {len(todos_fornecedores)}")
    print(f"💾 Arquivo salvo: {output_file}")
    print(f"{'='*60}")
    
    return todos_fornecedores

def save_to_csv(fornecedores, output_file, remover_duplicatas=True):
    """Salva lista de fornecedores em arquivo CSV"""
    if not fornecedores:
        print("⚠️ Nenhum dado para salvar")
        return
    
    # Remove duplicatas baseado no código
    if remover_duplicatas:
        vistos = {}
        for f in fornecedores:
            codigo = f['codigo']
            if codigo not in vistos:
                vistos[codigo] = f
        fornecedores_unicos = list(vistos.values())
        duplicatas = len(fornecedores) - len(fornecedores_unicos)
        if duplicatas > 0:
            print(f"🗑️  Removidas {duplicatas} duplicatas")
        fornecedores = fornecedores_unicos
    
    with open(output_file, 'w', newline='', encoding='utf-8-sig') as f:
        fieldnames = ['codigo', 'nome', 'homepage']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        
        writer.writeheader()
        writer.writerows(fornecedores)
    
    print(f"💾 Dados salvos em {output_file}")

def scrape_single_page(page_num):
    """Extrai fornecedores de uma página específica"""
    session = get_session()
    
    if page_num == 1:
        url = FORNECEDORES_URL
    else:
        # Tenta parâmetros comuns
        url = f"{FORNECEDORES_URL}?page={page_num}"
    
    print(f"📄 Acessando página {page_num}...")
    response = session.get(url)
    
    if response.status_code != 200:
        print(f"❌ Erro: {response.status_code}")
        return []
    
    fornecedores = extract_fornecedores_from_html(response.text)
    print(f"✅ {len(fornecedores)} fornecedores encontrados")
    
    for f in fornecedores[:5]:  # Mostra primeiros 5
        print(f"   - {f['codigo']}: {f['nome']}")
    
    if len(fornecedores) > 5:
        print(f"   ... e mais {len(fornecedores) - 5}")
    
    return fornecedores

if __name__ == "__main__":
    import sys
    
    print("=" * 60)
    print("🏗️  Scraping de Fornecedores - ORSE/CEHOP-SE")
    print("=" * 60)
    
    if len(sys.argv) > 1:
        if sys.argv[1] == '--page':
            # Extrai página específica
            page = int(sys.argv[2]) if len(sys.argv) > 2 else 1
            scrape_single_page(page)
        elif sys.argv[1] == '--max-pages':
            # Extrai com limite de páginas
            max_pages = int(sys.argv[2]) if len(sys.argv) > 2 else 10
            scrape_all_fornecedores(max_pages=max_pages)
        elif sys.argv[1] == '--all':
            # Extrai tudo sem confirmação
            print("\n🚀 Iniciando extração completa...\n")
            scrape_all_fornecedores()
        elif sys.argv[1] == '--help':
            print("""
Uso: python scrape_fornecedores.py [opções]

Opções:
  --page NUM        Extrai apenas a página NUM
  --max-pages NUM   Extrai até NUM páginas
  --all             Extrai todos os fornecedores (~105 páginas)
  --help            Mostra esta ajuda
  (sem opções)      Extrai todos os fornecedores (~105 páginas)

Exemplos:
  python scrape_fornecedores.py --all
  python scrape_fornecedores.py --max-pages 10
  python scrape_fornecedores.py --page 1
            """)
    else:
        # Extrai todos os fornecedores
        confirm = input(f"\n⚠️  Isso irá acessar ~105 páginas (~1049 fornecedores).\n   Deseja continuar? (s/n): ")
        if confirm.lower() == 's':
            scrape_all_fornecedores()
        else:
            print("❌ Cancelado")

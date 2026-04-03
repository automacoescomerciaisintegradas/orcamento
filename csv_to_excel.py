"""
Converte o CSV de fornecedores para Excel
"""

import csv
from openpyxl import Workbook

def csv_to_excel(csv_file, excel_file):
    """Converte CSV para Excel com formatação"""
    
    # Lê o CSV
    with open(csv_file, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        dados = list(reader)
    
    # Cria workbook
    wb = Workbook()
    ws = wb.active
    ws.title = "Fornecedores ORSE"
    
    # Header
    ws.append(['Código', 'Nome do Fornecedor', 'Homepage'])
    
    # Dados
    for row in dados:
        ws.append([
            row['codigo'],
            row['nome'],
            row['homepage'] if row['homepage'] else ''
        ])
    
    # Formata header
    for cell in ws[1]:
        cell.font = cell.font.copy(bold=True)
        cell.fill = cell.fill.copy(fill_type='solid', fgColor='CCCCCC')
    
    # Ajusta largura das colunas
    ws.column_dimensions['A'].width = 12
    ws.column_dimensions['B'].width = 50
    ws.column_dimensions['C'].width = 40
    
    # Congela header
    ws.freeze_panes = 'A2'
    
    # Salva
    wb.save(excel_file)
    print(f"✅ Excel salvo em: {excel_file}")
    print(f"📊 Total de registros: {len(dados)}")

if __name__ == "__main__":
    try:
        csv_to_excel('fornecedores_orse.csv', 'fornecedores_orse.xlsx')
    except ImportError:
        print("❌ openpyxl não instalado. Execute: pip install openpyxl")

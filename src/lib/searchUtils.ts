/**
 * Destaca os termos de busca no texto
 */
export function highlightText(text: string, query: string): string {
  if (!query || query.length < 2) return text

  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(t => t.length >= 2)

  let highlighted = text

  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi')
    highlighted = highlighted.replace(
      regex,
      '<mark class="bg-amber-500/30 text-amber-300 px-0.5 rounded font-bold">$1</mark>'
    )
  })

  return highlighted
}

/**
 * Normaliza texto para busca (remove acentos e caracteres especiais)
 */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

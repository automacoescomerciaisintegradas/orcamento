'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { searchSinapi, SearchResult } from '@/app/actions/sinapi-advanced'

interface UseSearchOptions {
  debounceMs?: number
  minQueryLength?: number
  limit?: number
}

interface UseSearchReturn {
  results: SearchResult[]
  loading: boolean
  error: string | null
  query: string
  setQuery: (query: string) => void
  clearResults: () => void
  searchHistory: string[]
  addToHistory: (query: string) => void
  clearHistory: () => void
}

/**
 * Hook para busca com debounce, cache e histórico
 */
export function useSearchSinapi(
  type: 'INSUMO' | 'COMPOSIÇÃO' | 'ALL' = 'ALL',
  options: UseSearchOptions = {}
): UseSearchReturn {
  const {
    debounceMs = 300,
    minQueryLength = 2,
    limit = 20,
  } = options

  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQueryState] = useState('')
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  const queryRef = useRef(query)
  const cacheRef = useRef<Map<string, SearchResult[]>>(new Map())
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Carregar histórico do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory')
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Erro ao carregar histórico:', e)
      }
    }
  }, [])

  // Salvar histórico no localStorage
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.slice(0, 10)))
  }, [searchHistory])

  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery)
  }, [])

  const clearResults = useCallback(() => {
    setResults([])
    setQuery('')
    setError(null)
  }, [setQuery])

  const addToHistory = useCallback((newQuery: string) => {
    if (newQuery.length < minQueryLength) return

    setSearchHistory(prev => {
      const filtered = prev.filter(q => q !== newQuery)
      return [newQuery, ...filtered].slice(0, 10)
    })
  }, [minQueryLength])

  const clearHistory = useCallback(() => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
  }, [])

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < minQueryLength) {
      setResults([])
      return
    }

    // Verificar cache
    const cacheKey = `${type}-${searchQuery}-${limit}`
    const cached = cacheRef.current.get(cacheKey)
    if (cached) {
      setResults(cached)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const searchResults = await searchSinapi({
        query: searchQuery,
        type,
        limit,
        sortBy: 'relevancia',
      })

      cacheRef.current.set(cacheKey, searchResults)
      setResults(searchResults)
    } catch (err) {
      console.error('Erro na busca:', err)
      setError('Erro ao buscar resultados. Tente novamente.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [type, limit, minQueryLength])

  // Debounce da busca
  useEffect(() => {
    queryRef.current = query

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (query.length >= minQueryLength) {
      debounceTimerRef.current = setTimeout(() => {
        if (query === queryRef.current) {
          performSearch(query)
          addToHistory(query)
        }
      }, debounceMs)
    } else {
      setResults([])
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [query, debounceMs, minQueryLength, performSearch, addToHistory])

  return {
    results,
    loading,
    error,
    query,
    setQuery,
    clearResults,
    searchHistory,
    addToHistory,
    clearHistory,
  }
}

/**
 * Hook para busca com filtros avançados
 */
export function useAdvancedSearch(options: UseSearchOptions = {}) {
  const {
    debounceMs = 300,
    minQueryLength = 2,
    limit = 20,
  } = options

  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQueryState] = useState('')
  const [filters, setFilters] = useState({
    type: 'ALL' as 'INSUMO' | 'COMPOSIÇÃO' | 'ALL',
    unidade: '',
    precoMin: undefined as number | undefined,
    precoMax: undefined as number | undefined,
    sortBy: 'relevancia' as 'relevancia' | 'preco_asc' | 'preco_desc' | 'codigo' | 'descricao',
  })

  const cacheRef = useRef<Map<string, SearchResult[]>>(new Map())
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery)
  }, [])

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      type: 'ALL',
      unidade: '',
      precoMin: undefined,
      precoMax: undefined,
      sortBy: 'relevancia',
    })
  }, [])

  const performSearch = useCallback(async () => {
    if (query.length < minQueryLength) {
      setResults([])
      return
    }

    setLoading(true)
    setError(null)

    const cacheKey = JSON.stringify({ query, ...filters, limit })
    const cached = cacheRef.current.get(cacheKey)
    if (cached) {
      setResults(cached)
      setError(null)
      setLoading(false)
      return
    }

    try {
      const searchResults = await searchSinapi({
        query,
        ...filters,
        limit,
      })

      cacheRef.current.set(cacheKey, searchResults)
      setResults(searchResults)
    } catch (err) {
      console.error('Erro na busca:', err)
      setError('Erro ao buscar resultados. Tente novamente.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [query, filters, limit, minQueryLength])

  // Debounce da busca quando query ou filtros mudam
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (query.length >= minQueryLength) {
      debounceTimerRef.current = setTimeout(() => {
        performSearch()
      }, debounceMs)
    } else {
      setResults([])
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [query, filters, debounceMs, minQueryLength, performSearch])

  return {
    results,
    loading,
    error,
    query,
    setQuery,
    filters,
    updateFilters,
    clearFilters,
  }
}

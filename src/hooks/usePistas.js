import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function usePistas() {
  const [pistas, setPistas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPistas() {
      try {
        const { data, error } = await supabase
          .from('pistas')
          .select('*')
          .eq('activa', true)

        if (error) throw error

        // tenis primero (1-6), luego padel (1-2)
        const sorted = [...(data ?? [])].sort((a, b) => {
          if (a.tipo !== b.tipo) return a.tipo === 'tenis' ? -1 : 1
          return a.numero - b.numero
        })

        setPistas(sorted)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPistas()
  }, [])

  return { pistas, loading, error }
}

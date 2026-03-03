import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useReservas(fecha) {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!fecha) return

    let cancelled = false
    setLoading(true)
    setReservas([])

    async function fetchReservas() {
      try {
        const { data, error } = await supabase
          .from('reservas')
          .select('*, profesores(nombre, color)')
          .eq('fecha', fecha)
          .order('hora_inicio')

        if (error) throw error
        if (!cancelled) setReservas(data ?? [])
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchReservas()
    return () => { cancelled = true }
  }, [fecha, tick])

  const refetch = () => setTick(t => t + 1)

  return { reservas, loading, error, refetch }
}

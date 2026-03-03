import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// Nombre del evento personalizado que dispara ModalDetalleReserva
export const EVT_NUEVA_NOTIFICACION = 'nueva-notificacion'

export function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNoLeidas = useCallback(async () => {
    const { data } = await supabase
      .from('notificaciones')
      .select('*')
      .eq('leida', false)
      .order('created_at', { ascending: false })

    setNotificaciones(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    // Carga inicial
    fetchNoLeidas()

    // Escucha el evento que dispara el modal al cancelar una reserva
    // (evita prop-drilling y no requiere Supabase Realtime activado)
    window.addEventListener(EVT_NUEVA_NOTIFICACION, fetchNoLeidas)
    return () => window.removeEventListener(EVT_NUEVA_NOTIFICACION, fetchNoLeidas)
  }, [fetchNoLeidas])

  // Marca todas las no leídas como leídas (optimista + persistido)
  async function marcarTodasLeidas() {
    const ids = notificaciones.map(n => n.id)
    if (!ids.length) return

    setNotificaciones([]) // actualización optimista inmediata

    await supabase
      .from('notificaciones')
      .update({ leida: true })
      .in('id', ids)
  }

  return { notificaciones, loading, marcarTodasLeidas }
}

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { EVT_NUEVA_NOTIFICACION } from '../hooks/useNotificaciones'

// ─── Config tipos ───────────────────────────────────────────────────────────────
const TIPO_INFO = {
  grupal:     { label: 'Grupal',     color: '#22c55e' },
  particular: { label: 'Particular', color: '#f97316' },
  alquiler:   { label: 'Alquiler',   color: '#3b82f6' },
}

function formatFecha(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}

// ─── Icono persona ───────────────────────────────────────────────────────────────
function IconPersona() {
  return (
    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

// ─── Componente ─────────────────────────────────────────────────────────────────
export default function ModalDetalleReserva({ reserva, pista, onClose, onSuccess }) {
  const [confirmando, setConfirmando] = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)

  const tipo    = TIPO_INFO[reserva.tipo] ?? TIPO_INFO.alquiler
  const inicio  = reserva.hora_inicio.slice(0, 5)
  const fin     = reserva.hora_fin.slice(0, 5)
  const cliente = reserva.nombre_cliente
  const profe   = reserva.profesores?.nombre

  // Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Cerrar con ESC (solo si no estamos en paso de confirmación)
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape' && !confirmando) onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onClose, confirmando])

  async function handleEliminar() {
    setLoading(true)
    setError(null)

    // 1. Eliminar la reserva
    const { error: sbError } = await supabase
      .from('reservas')
      .delete()
      .eq('id', reserva.id)

    if (sbError) { setLoading(false); setError(sbError.message); return }

    // 2. Insertar notificación de pista liberada.
    //    reserva_id = null porque la reserva ya no existe en BD.
    const mensaje = `${pista.nombre} libre - ${inicio}h`
    await supabase.from('notificaciones').insert({
      reserva_id: null,
      mensaje,
      leida:      false,
    })

    // 3. Notificar al banner mediante evento de ventana (sin prop-drilling)
    window.dispatchEvent(new Event(EVT_NUEVA_NOTIFICACION))

    setLoading(false)
    onSuccess?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop — no cierra si estamos confirmando */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !confirmando && onClose()}
      />

      {/* Panel */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Franja de color superior según tipo */}
        <div className="h-1.5" style={{ backgroundColor: tipo.color }} />

        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: tipo.color }}
            />
            <span className="text-sm font-bold text-gray-900">{tipo.label}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Detalles */}
        <div className="px-6 pb-6 space-y-4">

          {/* Pista + horario */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-gray-800">{pista.nombre}</p>
                <p className="text-xs text-gray-400 capitalize mt-0.5">
                  {formatFecha(reserva.fecha)}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-gray-900">{inicio}–{fin}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {Math.round(
                    (parseInt(fin) * 60 + parseInt(fin.split(':')[1]) -
                     parseInt(inicio) * 60 - parseInt(inicio.split(':')[1]))
                  )} min
                </p>
              </div>
            </div>
          </div>

          {/* Cliente / Profesor */}
          {(cliente || profe) && (
            <div className="space-y-2">
              {cliente && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <IconPersona />
                  <span>{cliente}</span>
                </div>
              )}
              {profe && (
                <div className="flex items-center gap-2 text-sm">
                  <IconPersona />
                  <span className="text-gray-400">Profesor:</span>
                  <span className="text-gray-700">{profe}</span>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* ── Zona de cancelación ── */}
          {!confirmando ? (
            <button
              onClick={() => setConfirmando(true)}
              className="w-full py-2.5 rounded-xl border border-red-200 text-red-500
                         hover:bg-red-50 text-sm font-medium transition-colors"
            >
              Cancelar reserva
            </button>
          ) : (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-3">
              <p className="text-sm text-red-700 font-medium text-center">
                ¿Eliminar esta reserva?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmando(false)}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-sm
                             font-medium text-gray-600 hover:bg-white transition-colors"
                >
                  Volver
                </button>
                <button
                  onClick={handleEliminar}
                  disabled={loading}
                  className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600
                             disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                >
                  {loading ? 'Eliminando...' : 'Sí, eliminar'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

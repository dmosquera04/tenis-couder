import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// ─── Config tipos ───────────────────────────────────────────────────────────────
const TIPOS = [
  {
    value: 'grupal',
    label: 'Grupal',
    sel:   'bg-green-500  border-green-500  text-white',
    unsel: 'border-gray-200 text-gray-600 hover:bg-green-50  hover:border-green-300',
  },
  {
    value: 'particular',
    label: 'Particular',
    sel:   'bg-orange-500 border-orange-500 text-white',
    unsel: 'border-gray-200 text-gray-600 hover:bg-orange-50 hover:border-orange-300',
  },
  {
    value: 'alquiler',
    label: 'Alquiler',
    sel:   'bg-blue-500   border-blue-500   text-white',
    unsel: 'border-gray-200 text-gray-600 hover:bg-blue-50   hover:border-blue-300',
  },
]

// ─── Helper ─────────────────────────────────────────────────────────────────────
function addMinutes(hora, mins) {
  const [h, m] = hora.split(':').map(Number)
  const total  = h * 60 + m + mins
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

// ─── Componente ─────────────────────────────────────────────────────────────────
export default function ModalNuevaReserva({ pista, hora, fecha, onClose, onSuccess }) {
  const [tipo,          setTipo]          = useState('')
  const [nombreCliente, setNombreCliente] = useState('')
  const [duracion,      setDuracion]      = useState(60)
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState(null)

  const horaFin = addMinutes(hora, duracion)

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Cerrar con ESC
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onClose])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!tipo) { setError('Selecciona un tipo de reserva.'); return }

    setLoading(true)
    setError(null)

    const { error: sbError } = await supabase.from('reservas').insert({
      pista_id:       pista.id,
      fecha,
      hora_inicio:    hora,
      hora_fin:       horaFin,
      tipo,
      nombre_cliente: nombreCliente.trim() || null,
    })

    setLoading(false)
    if (sbError) { setError(sbError.message); return }

    onSuccess?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Nueva reserva</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {pista.tipo === 'tenis' ? 'Tenis' : 'Pádel'} {pista.numero}
              <span className="mx-1">·</span>
              {hora}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-4 -mt-0.5 flex-shrink-0"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {/* ── Tipo ── */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">
              Tipo de reserva
            </p>
            <div className="flex gap-2">
              {TIPOS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTipo(t.value)}
                  className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all
                    ${tipo === t.value ? t.sel : t.unsel}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Nombre del cliente ── */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">
              Nombre del cliente
              <span className="ml-1 text-gray-300 font-normal normal-case">(opcional)</span>
            </p>
            <input
              type="text"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              placeholder="Nombre o apellidos"
              autoFocus
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                         text-gray-800 placeholder-gray-300 focus:outline-none
                         focus:ring-2 focus:ring-gray-300 focus:border-transparent transition"
            />
          </div>

          {/* ── Duración ── */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">
              Duración
              <span className="ml-2 text-gray-400 font-normal normal-case">
                {hora} → {horaFin}
              </span>
            </p>
            <div className="flex gap-2">
              {[60, 90].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuracion(d)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all
                    ${duracion === d
                      ? 'bg-gray-800 border-gray-800 text-white'
                      : 'border-gray-200 text-gray-500 hover:border-gray-400'
                    }`}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>

          {/* ── Error ── */}
          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* ── Acciones ── */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium
                         text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-600
                         disabled:opacity-60 text-white text-sm font-semibold transition-colors"
            >
              {loading ? 'Creando...' : 'Crear reserva'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

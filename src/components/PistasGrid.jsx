import { usePistas }   from '../hooks/usePistas'
import { useReservas } from '../hooks/useReservas'

// ─── Constantes ────────────────────────────────────────────────────────────────

const CELL_H   = 64   // px por franja de 1 hora
const H_INICIO = 8    // 08:00
const H_FIN    = 22   // 22:00
const COL_W    = 68   // px columna de horas

const HORAS = Array.from({ length: H_FIN - H_INICIO }, (_, i) => {
  const h = i + H_INICIO
  return `${String(h).padStart(2, '0')}:00`
})

// Estilos de cabecera por tipo de pista
const PISTA_STYLE = {
  tenis: {
    headerBg:   'bg-green-50',
    headerText: 'text-green-800',
    accent:     'bg-green-500',
    badge:      'bg-green-100 text-green-700',
  },
  padel: {
    headerBg:   'bg-blue-50',
    headerText: 'text-blue-800',
    accent:     'bg-blue-500',
    badge:      'bg-blue-100 text-blue-700',
  },
}

// Colores de bloque por tipo de reserva (hex para evitar purge de Tailwind JIT)
const RESERVA_COLOR = {
  grupal:     { bg: '#22c55e', label: 'Grupal'     },  // green-500
  particular: { bg: '#f97316', label: 'Particular' },  // orange-500
  alquiler:   { bg: '#3b82f6', label: 'Alquiler'   },  // blue-500
}

// Fondo rayado diagonal para celdas libres
const STRIPE_BG = {
  backgroundImage: 'repeating-linear-gradient('
    + '-45deg, #f3f4f6 0px, #f3f4f6 4px, #ffffff 4px, #ffffff 14px)',
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

// "09:30:00" | "09:30" → 570
function toMin(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

// Posición top del bloque dentro de la columna (en px)
function blockTop(hora_inicio) {
  return ((toMin(hora_inicio) - H_INICIO * 60) / 60) * CELL_H
}

// Altura del bloque según duración  → 60 min = 64 px · 90 min = 96 px
function blockHeight(hora_inicio, hora_fin) {
  return ((toMin(hora_fin) - toMin(hora_inicio)) / 60) * CELL_H
}

// ¿Alguna reserva toca la franja [hora, hora+1h)?
function isCellOccupied(hora, reservasDePista) {
  const start = toMin(hora)
  const end   = start + 60
  return reservasDePista.some(r => toMin(r.hora_inicio) < end && toMin(r.hora_fin) > start)
}

// ─── Sub-componentes ───────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-400">Cargando pistas...</span>
      </div>
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="bg-red-50 border border-red-200 rounded-lg px-6 py-4 text-center">
        <p className="text-sm font-medium text-red-700">Error al cargar las pistas</p>
        <p className="text-xs text-red-500 mt-1">{message}</p>
      </div>
    </div>
  )
}

// Bloque de reserva: absolutamente posicionado dentro de su columna.
// height proporcional a la duración → 90 min ocupa 1.5 celdas (96 px).
function ReservaBlock({ reserva }) {
  const color  = RESERVA_COLOR[reserva.tipo] ?? RESERVA_COLOR.alquiler
  const top    = blockTop(reserva.hora_inicio)
  const height = blockHeight(reserva.hora_inicio, reserva.hora_fin)
  const nombre = reserva.nombre_cliente ?? reserva.profesores?.nombre ?? ''
  const inicio = reserva.hora_inicio.slice(0, 5)
  const fin    = reserva.hora_fin.slice(0, 5)

  return (
    <div
      title={`${color.label}${nombre ? ' · ' + nombre : ''} · ${inicio}–${fin}`}
      style={{
        position:        'absolute',
        top:             top + 2,
        height:          height - 4,
        left:            3,
        right:           3,
        zIndex:          10,
        backgroundColor: color.bg,
        borderRadius:    6,
        overflow:        'hidden',
      }}
      className="px-2 py-1 text-white shadow-sm cursor-pointer select-none"
    >
      {/* Tipo de reserva */}
      <p className="text-[11px] font-semibold leading-tight truncate">
        {color.label}
      </p>

      {/* Nombre cliente/profesor (si hay espacio) */}
      {height > 38 && nombre && (
        <p className="text-[10px] leading-tight truncate opacity-90 mt-0.5">
          {nombre}
        </p>
      )}

      {/* Horario (si hay espacio) */}
      {height > 56 && (
        <p className="text-[10px] leading-tight opacity-75 mt-0.5">
          {inicio}–{fin}
        </p>
      )}
    </div>
  )
}

// ─── Componente principal ──────────────────────────────────────────────────────

export default function PistasGrid({ fecha }) {
  const { pistas,  loading: pistasLoading,  error: pistasError  } = usePistas()
  const { reservas, loading: reservasLoading }                    = useReservas(fecha)

  if (pistasLoading) return <LoadingState />
  if (pistasError)   return <ErrorState message={pistasError.message} />
  if (!pistas.length) return (
    <div className="flex items-center justify-center h-64 text-sm text-gray-400">
      No hay pistas configuradas. Ejecuta el schema SQL en Supabase.
    </div>
  )

  return (
    <div
      className="overflow-auto rounded-xl border border-gray-200 shadow-sm bg-white"
      style={{ maxHeight: 'calc(100vh - 148px)' }}
    >

      {/* ══ CABECERA STICKY (top) ══════════════════════════════════════════════ */}
      <div
        className="flex border-b-2 border-gray-200 bg-white"
        style={{ position: 'sticky', top: 0, zIndex: 20 }}
      >
        {/* Esquina — sticky top + left */}
        <div
          className="flex-shrink-0 bg-gray-50 border-r border-gray-200
                     flex items-center justify-center"
          style={{ position: 'sticky', left: 0, zIndex: 30, width: COL_W }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Hora
          </span>
        </div>

        {/* Encabezado de cada pista */}
        {pistas.map((pista) => {
          const s = PISTA_STYLE[pista.tipo]
          return (
            <div
              key={pista.id}
              className={`relative flex-1 min-w-[130px] border-r border-gray-100
                          flex flex-col items-center justify-center gap-1 px-2 py-3
                          ${s.headerBg}`}
            >
              {/* Barra de color en la parte superior */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${s.accent}`} />

              <span className={`text-sm font-bold leading-tight ${s.headerText}`}>
                {pista.tipo === 'tenis' ? 'Tenis' : 'Pádel'} {pista.numero}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${s.badge}`}>
                {pista.nombre}
              </span>
            </div>
          )
        })}
      </div>

      {/* ══ CUERPO ════════════════════════════════════════════════════════════ */}
      <div className="flex">

        {/* Columna de horas — sticky left */}
        <div
          className="flex-shrink-0 bg-gray-50 border-r border-gray-200"
          style={{ position: 'sticky', left: 0, zIndex: 10, width: COL_W }}
        >
          {HORAS.map((hora) => (
            <div
              key={hora}
              className="border-b border-gray-200 flex items-center justify-center"
              style={{ height: CELL_H }}
            >
              <span className="text-xs font-semibold text-gray-400">{hora}</span>
            </div>
          ))}
        </div>

        {/* Una columna por pista */}
        {pistas.map((pista) => {
          const reservasDePista = reservas.filter(r => r.pista_id === pista.id)

          return (
            <div
              key={pista.id}
              className="relative flex-1 min-w-[130px] border-r border-gray-100"
            >
              {/* Celdas de fondo: rayadas si libres, blancas si ocupadas */}
              {HORAS.map((hora) => (
                <div
                  key={hora}
                  className="border-b border-gray-100"
                  style={{
                    height: CELL_H,
                    ...(isCellOccupied(hora, reservasDePista) ? {} : STRIPE_BG),
                  }}
                />
              ))}

              {/* Bloques de reserva: absolutos sobre el fondo */}
              {reservasDePista.map((reserva) => (
                <ReservaBlock key={reserva.id} reserva={reserva} />
              ))}

              {/* Velo semitransparente mientras recarga reservas */}
              {reservasLoading && (
                <div className="absolute inset-0 bg-white/60 z-20" />
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}

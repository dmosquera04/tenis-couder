import { Fragment } from 'react'
import { usePistas } from '../hooks/usePistas'

const HORA_INICIO = 8
const HORA_FIN = 22

const HORAS = Array.from({ length: HORA_FIN - HORA_INICIO }, (_, i) => {
  const h = i + HORA_INICIO
  return `${String(h).padStart(2, '0')}:00`
})

const TIPO = {
  tenis: {
    headerBg: 'bg-green-50',
    headerText: 'text-green-800',
    accentBar: 'bg-green-500',
    badge: 'bg-green-100 text-green-700',
    cellHover: 'hover:bg-green-50',
  },
  padel: {
    headerBg: 'bg-blue-50',
    headerText: 'text-blue-800',
    accentBar: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700',
    cellHover: 'hover:bg-blue-50',
  },
}

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

function EmptyState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="text-sm text-gray-400">No hay pistas configuradas.</p>
        <p className="text-xs text-gray-300 mt-1">Ejecuta el schema SQL en Supabase para crear las pistas.</p>
      </div>
    </div>
  )
}

export default function PistasGrid({ fecha }) {
  const { pistas, loading, error } = usePistas()

  if (loading) return <LoadingState />
  if (error)   return <ErrorState message={error.message} />
  if (!pistas.length) return <EmptyState />

  return (
    <div
      className="overflow-auto rounded-xl border border-gray-200 shadow-sm bg-white"
      style={{ maxHeight: 'calc(100vh - 148px)' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `68px repeat(${pistas.length}, minmax(130px, 1fr))`,
          width: '100%',
        }}
      >
        {/* ── Celda esquina (Hora) ── */}
        <div
          className="bg-gray-50 border-b-2 border-r border-gray-200 flex items-center justify-center"
          style={{ position: 'sticky', top: 0, left: 0, zIndex: 30 }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Hora
          </span>
        </div>

        {/* ── Cabeceras de pistas ── */}
        {pistas.map((pista) => {
          const t = TIPO[pista.tipo]
          return (
            <div
              key={pista.id}
              className={`relative border-b-2 border-r border-gray-200 flex flex-col items-center justify-center gap-1 px-2 py-3 ${t.headerBg}`}
              style={{ position: 'sticky', top: 0, zIndex: 20 }}
            >
              {/* Barra de color superior */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${t.accentBar}`} />

              <span className={`text-sm font-bold leading-tight ${t.headerText}`}>
                {pista.tipo === 'tenis' ? 'Tenis' : 'Pádel'} {pista.numero}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${t.badge}`}>
                {pista.nombre}
              </span>
            </div>
          )
        })}

        {/* ── Filas de franjas horarias ── */}
        {HORAS.map((hora) => (
          <Fragment key={hora}>
            {/* Etiqueta de hora */}
            <div
              className="bg-gray-50 border-r border-b border-gray-200 flex items-center justify-center"
              style={{ position: 'sticky', left: 0, zIndex: 10, height: 64 }}
            >
              <span className="text-xs font-semibold text-gray-400">{hora}</span>
            </div>

            {/* Celdas por pista */}
            {pistas.map((pista) => {
              const t = TIPO[pista.tipo]
              return (
                <div
                  key={pista.id}
                  title={`${pista.nombre} — ${hora} | ${fecha}`}
                  className={`border-r border-b border-gray-100 cursor-pointer transition-colors duration-100 ${t.cellHover}`}
                  style={{ height: 64 }}
                />
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

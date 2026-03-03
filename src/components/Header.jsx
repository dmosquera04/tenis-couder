// ─── Helper de navegación ────────────────────────────────────────────────────
function moveDay(iso, delta) {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + delta)
  return d.toISOString().split('T')[0]
}

function formatFecha(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
  })
}

// ─── Botón de navegación ─────────────────────────────────────────────────────
function NavBtn({ onClick, title, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-9 h-9 flex items-center justify-center rounded-xl
                 text-gray-500 hover:bg-gray-100 active:bg-gray-200
                 transition-colors text-xl leading-none select-none"
    >
      {children}
    </button>
  )
}

// ─── Componente ──────────────────────────────────────────────────────────────
export default function Header({ fecha, onChange }) {
  return (
    <header className="bg-white border-b border-gray-200 flex-shrink-0">
      <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-2 sm:gap-4">

        {/* ── Título ── */}
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-tight">
            Tenis Couder
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-400 capitalize mt-0.5 truncate">
            {formatFecha(fecha)}
          </p>
        </div>

        {/* ── Controles de fecha ── */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <NavBtn onClick={() => onChange(moveDay(fecha, -1))} title="Día anterior">
            ‹
          </NavBtn>

          <input
            type="date"
            value={fecha}
            onChange={(e) => onChange(e.target.value)}
            className="border border-gray-200 rounded-xl px-2 sm:px-3 py-1.5
                       text-sm text-gray-700 focus:outline-none focus:ring-2
                       focus:ring-green-400 focus:border-transparent transition
                       w-[120px] sm:w-auto"
          />

          <NavBtn onClick={() => onChange(moveDay(fecha, +1))} title="Día siguiente">
            ›
          </NavBtn>

          <button
            onClick={() => onChange(new Date().toISOString().split('T')[0])}
            className="ml-1 px-2.5 sm:px-3 py-1.5 bg-green-500 hover:bg-green-600
                       active:bg-green-700 text-white text-xs sm:text-sm font-semibold
                       rounded-xl transition-colors"
          >
            Hoy
          </button>
        </div>

      </div>
    </header>
  )
}

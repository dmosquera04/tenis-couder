// ─── Icono campana ─────────────────────────────────────────────────────────────
function IconCampana() {
  return (
    <svg
      className="w-4 h-4 flex-shrink-0 text-yellow-500"
      fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002
           6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388
           6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3
           0 11-6 0v-1m6 0H9" />
    </svg>
  )
}

// ─── Componente ─────────────────────────────────────────────────────────────────
export default function BannerNotificaciones({ notificaciones, onDismiss }) {
  if (!notificaciones.length) return null

  const count    = notificaciones.length
  const visibles = notificaciones.slice(0, 2)
  const extra    = count - 2

  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-4 px-5 py-2.5
                 bg-yellow-50 border-b border-yellow-200"
    >
      {/* Icono + texto */}
      <div className="flex items-center gap-2.5 min-w-0">
        <IconCampana />

        <p className="text-sm text-yellow-800 line-clamp-2 sm:truncate sm:line-clamp-none">
          {visibles.map(n => n.mensaje).join('  ·  ')}
          {extra > 0 && (
            <span className="text-yellow-600 ml-1">
              · y {extra} más
            </span>
          )}
        </p>
      </div>

      {/* Contador + botón */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {count > 1 && (
          <span className="bg-yellow-200 text-yellow-800 text-[11px] font-bold
                           px-2 py-0.5 rounded-full leading-none">
            {count}
          </span>
        )}
        <button
          onClick={onDismiss}
          className="text-xs font-semibold text-yellow-700 hover:text-yellow-900
                     underline underline-offset-2 transition-colors"
        >
          Marcar leído
        </button>
      </div>
    </div>
  )
}

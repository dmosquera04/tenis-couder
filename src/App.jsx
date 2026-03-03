import { useState } from 'react'
import PistasGrid from './components/PistasGrid'

const today = () => new Date().toISOString().split('T')[0]

function formatFecha(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function moveDay(iso, delta) {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + delta)
  return d.toISOString().split('T')[0]
}

export default function App() {
  const [fecha, setFecha] = useState(today)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between gap-4 flex-shrink-0">

        {/* Título */}
        <div>
          <h1 className="text-lg font-bold text-gray-900 leading-tight tracking-tight">
            Tenis Couder
          </h1>
          <p className="text-xs text-gray-400 capitalize">{formatFecha(fecha)}</p>
        </div>

        {/* Navegación de fecha */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFecha((f) => moveDay(f, -1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none"
            title="Día anterior"
          >
            ‹
          </button>

          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />

          <button
            onClick={() => setFecha((f) => moveDay(f, +1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none"
            title="Día siguiente"
          >
            ›
          </button>

          <button
            onClick={() => setFecha(today())}
            className="ml-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Hoy
          </button>
        </div>
      </header>

      {/* ── Contenido principal ── */}
      <main className="flex-1 p-4 overflow-hidden">
        <PistasGrid fecha={fecha} />
      </main>

    </div>
  )
}

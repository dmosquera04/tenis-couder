export default function Bienvenida({ onLogin, onRegistro }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">

      <div className="w-full max-w-sm flex flex-col items-center gap-8">

        {/* ── Logo ── */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center shadow-md">
            <span className="text-4xl select-none">🎾</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tenis Couder</h1>
            <p className="text-sm text-gray-400 mt-1">Gestión de pistas y reservas</p>
          </div>
        </div>

        {/* ── Opciones ── */}
        <div className="w-full flex flex-col gap-3">

          <button
            onClick={onLogin}
            className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700
                       text-white font-semibold text-sm rounded-xl py-3
                       transition-colors shadow-sm"
          >
            Iniciar sesión
          </button>

          <button
            onClick={onRegistro}
            className="w-full bg-white hover:bg-gray-50 active:bg-gray-100
                       text-gray-700 font-semibold text-sm rounded-xl py-3
                       border border-gray-200 transition-colors"
          >
            Crear cuenta nueva
          </button>

        </div>

      </div>

    </div>
  )
}

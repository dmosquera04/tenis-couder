export default function Bienvenida({ onLogin, onRegistro }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">

      <div className="w-full max-w-sm flex flex-col items-center gap-8">

        {/* ── Logo ── */}
        <div className="flex flex-col items-center gap-3">
          <img
            src="/logo.jpg"
            alt="Tenis Couder"
            className="w-40 h-40 object-contain drop-shadow-sm"
          />
          <p className="text-sm text-gray-400">Gestión de pistas y reservas</p>
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

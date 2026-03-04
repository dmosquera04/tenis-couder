import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Registro({ onVolver }) {
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError]         = useState('')
  const [ok, setOk]               = useState(false)
  const [loading, setLoading]     = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else setOk(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10">

        {/* ── Logo ── */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.jpg" alt="Tenis Couder" className="w-16 h-16 object-contain mb-2" />
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Crear cuenta</h1>
          <p className="text-sm text-gray-400 mt-1">Acceso para profesores</p>
        </div>

        {/* ── Confirmación ── */}
        {ok ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              ✉️
            </div>
            <p className="text-sm text-gray-700 font-medium">
              Cuenta creada. Revisa tu email para confirmarla.
            </p>
            <button
              onClick={onVolver}
              className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        ) : (

          /* ── Formulario ── */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="profesor@teniscouder.com"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm
                           text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2
                           focus:ring-green-400 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm
                           text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2
                           focus:ring-green-400 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700" htmlFor="confirmar">
                Confirmar contraseña
              </label>
              <input
                id="confirmar"
                type="password"
                autoComplete="new-password"
                required
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm
                           text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2
                           focus:ring-green-400 focus:border-transparent transition"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full bg-green-500 hover:bg-green-600 active:bg-green-700
                         disabled:opacity-60 disabled:cursor-not-allowed
                         text-white font-semibold text-sm rounded-xl py-2.5
                         transition-colors"
            >
              {loading ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>

            <button
              type="button"
              onClick={onVolver}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors text-center"
            >
              ← Volver
            </button>

          </form>
        )}

      </div>

    </div>
  )
}

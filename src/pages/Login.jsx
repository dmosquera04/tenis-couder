import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function Login({ onVolver }) {
  const { login } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await login(email, password)

    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">

      {/* ── Card ── */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10">

        {/* ── Logo ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <span className="text-white text-2xl select-none">🎾</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Tenis Couder</h1>
          <p className="text-sm text-gray-400 mt-1">Acceso para profesores</p>
        </div>

        {/* ── Formulario ── */}
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm
                         text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2
                         focus:ring-green-400 focus:border-transparent transition"
            />
          </div>

          {/* ── Error ── */}
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
            {loading ? 'Entrando…' : 'Entrar'}
          </button>

          {onVolver && (
            <button
              type="button"
              onClick={onVolver}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors text-center"
            >
              ← Volver
            </button>
          )}

        </form>
      </div>

    </div>
  )
}

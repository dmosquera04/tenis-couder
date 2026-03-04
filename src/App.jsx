import { useState } from 'react'
import Header from './components/Header'
import PistasGrid from './components/PistasGrid'
import BannerNotificaciones from './components/BannerNotificaciones'
import { useNotificaciones } from './hooks/useNotificaciones'
import { useAuth } from './hooks/useAuth'
import Login from './pages/Login'

const today = () => new Date().toISOString().split('T')[0]

export default function App() {
  const { session, user, loading, logout } = useAuth()
  const [fecha, setFecha] = useState(today)
  const { notificaciones, marcarTodasLeidas } = useNotificaciones()

  if (loading) return null

  if (!session) return <Login />

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">

      {/* ── Header ── */}
      <Header fecha={fecha} onChange={setFecha} user={user} onLogout={logout} />

      {/* ── Banner notificaciones no leídas ── */}
      <BannerNotificaciones
        notificaciones={notificaciones}
        onDismiss={marcarTodasLeidas}
      />

      {/* ── Contenido principal ── */}
      <main className="flex-1 min-h-0 flex flex-col p-3 sm:p-4">
        <PistasGrid fecha={fecha} />
      </main>

    </div>
  )
}

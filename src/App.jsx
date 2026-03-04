import { useState } from 'react'
import Header from './components/Header'
import PistasGrid from './components/PistasGrid'
import BannerNotificaciones from './components/BannerNotificaciones'
import { useNotificaciones } from './hooks/useNotificaciones'
import { useAuth } from './hooks/useAuth'
import Bienvenida from './pages/Bienvenida'
import Login from './pages/Login'
import Registro from './pages/Registro'

const today = () => new Date().toISOString().split('T')[0]

export default function App() {
  const { session, user, loading, logout } = useAuth()
  const [fecha, setFecha] = useState(today)
  const { notificaciones, marcarTodasLeidas } = useNotificaciones()
  const [pagina, setPagina] = useState('bienvenida') // 'bienvenida' | 'login' | 'registro'

  if (loading) return null

  if (!session) {
    if (pagina === 'login')    return <Login    onVolver={() => setPagina('bienvenida')} />
    if (pagina === 'registro') return <Registro onVolver={() => setPagina('bienvenida')} />
    return <Bienvenida onLogin={() => setPagina('login')} onRegistro={() => setPagina('registro')} />
  }

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
        <PistasGrid fecha={fecha} onFechaChange={setFecha} />
      </main>

    </div>
  )
}

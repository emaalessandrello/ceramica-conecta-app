import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import api from '../lib/api'

function Dashboard() {
  const { user, logout, refreshMe } = useAuthStore()
  const [backendStatus, setBackendStatus] = useState('checking')
  const [backendData, setBackendData] = useState(null)

  useEffect(() => {
    // Refrescar datos del usuario desde /me (útil tras recargar la página)
    refreshMe()

    // Probar el health check
    const healthUrl = api.defaults.baseURL.replace('/api/v1', '') + '/health'
    fetch(healthUrl)
      .then((res) => res.json())
      .then((data) => {
        setBackendStatus('ok')
        setBackendData(data)
      })
      .catch((err) => {
        setBackendStatus('error')
        setBackendData({ error: err.message })
      })
  }, [refreshMe])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Cerámica Conecta</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">
                {user?.email} · <span className="uppercase">{user?.role}</span>
              </p>
            </div>
            <button
              onClick={logout}
              className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded-lg transition"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">¡Bienvenido!</h2>
          <p className="text-gray-600">
            Estás logueado correctamente con JWT. Desde acá vamos a construir el resto
            de la app: productos, precios, competidores, márgenes.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Estado del sistema
          </h2>
          {backendStatus === 'checking' && (
            <p className="text-gray-500">Consultando /health…</p>
          )}
          {backendStatus === 'ok' && (
            <div>
              <p className="text-green-600 font-medium">✅ Backend vivo</p>
              <pre className="mt-2 bg-gray-100 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(backendData, null, 2)}
              </pre>
            </div>
          )}
          {backendStatus === 'error' && (
            <p className="text-red-600 font-medium">❌ Backend no responde</p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Tu sesión
          </h2>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

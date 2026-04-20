import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
const APP_NAME = import.meta.env.VITE_APP_NAME || 'Cerámica Conecta'

function App() {
  const [backendStatus, setBackendStatus] = useState('checking')
  const [backendData, setBackendData] = useState(null)

  useEffect(() => {
    // El backend expone /health (fuera de /api/v1)
    const healthUrl = API_URL.replace('/api/v1', '') + '/health'
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
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{APP_NAME}</h1>
        <p className="text-gray-600 mb-6">
          Sistema de Gestión Comercial — frontend conectado.
        </p>

        <div className="border-t pt-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Estado del backend
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
            <div>
              <p className="text-red-600 font-medium">❌ No se pudo conectar al backend</p>
              <pre className="mt-2 bg-red-50 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(backendData, null, 2)}
              </pre>
              <p className="mt-2 text-xs text-gray-500">
                Verificá que el backend esté corriendo en {API_URL}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

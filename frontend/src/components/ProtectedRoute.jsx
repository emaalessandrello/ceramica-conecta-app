import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

/**
 * Wrapper de rutas protegidas. Si no hay sesión, redirige a /login.
 *
 * Uso:
 *   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default ProtectedRoute

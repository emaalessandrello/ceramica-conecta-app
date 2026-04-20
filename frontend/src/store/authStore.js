import { create } from 'zustand'
import api from '../lib/api'

// Cargar estado inicial desde localStorage (para persistir la sesión al recargar)
const loadInitialAuth = () => {
  const token = localStorage.getItem('auth_token')
  const userRaw = localStorage.getItem('auth_user')
  let user = null
  try {
    user = userRaw ? JSON.parse(userRaw) : null
  } catch {
    user = null
  }
  return { token, user }
}

const initial = loadInitialAuth()

export const useAuthStore = create((set, get) => ({
  user: initial.user,
  token: initial.token,
  isLoading: false,
  error: null,

  // Acción: login
  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.post('/auth/login', { email, password })
      const { user, token } = res.data
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(user))
      set({ user, token, isLoading: false })
      return { ok: true }
    } catch (err) {
      const message = err.response?.data?.error || 'Error al iniciar sesión'
      set({ error: message, isLoading: false })
      return { ok: false, error: message }
    }
  },

  // Acción: logout
  logout: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    set({ user: null, token: null, error: null })
  },

  // Acción: refrescar datos del usuario desde /me (útil después de reload)
  refreshMe: async () => {
    if (!get().token) return
    try {
      const res = await api.get('/auth/me')
      const { user } = res.data
      localStorage.setItem('auth_user', JSON.stringify(user))
      set({ user })
    } catch {
      // Si falla (token expiró), el interceptor ya se ocupa del logout
    }
  },

  isAuthenticated: () => !!get().token && !!get().user,
}))

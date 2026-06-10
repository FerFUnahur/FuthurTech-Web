import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import { useToast } from './ToastContext'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { error: toastError, warning } = useToast()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      api.get('/auth/me').then(res => {
        setUser(res.data.user)
      }).catch(() => {
        localStorage.removeItem('token')
      }).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
      setUser(res.data.user)
      return res.data.user
    } catch (err) {
      const msg = err?.response?.data?.error || 'Error al iniciar sesión'
      toastError(msg)
      throw err
    }
  }

  const register = async (data) => {
    try {
      const res = await api.post('/auth/register', data)
      localStorage.setItem('token', res.data.token)
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
      setUser(res.data.user)
      return res.data.user
    } catch (err) {
      const msg = err?.response?.data?.error || 'Error al registrarse'
      toastError(msg)
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    warning('Sesión cerrada')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

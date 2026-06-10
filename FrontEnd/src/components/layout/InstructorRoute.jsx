import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

function InstructorRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="p-4 text-center">Cargando...</div>
  }

  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'student') return <Navigate to="/dashboard" replace />
  if (user.role !== 'instructor' && user.role !== 'admin') return <Navigate to="/login" replace />

  return children
}

export default InstructorRoute

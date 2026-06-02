import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

function InstructorRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="p-4 text-center">Cargando...</div>
  }

  if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
    return <Navigate to="/login" />
  }

  return children
}

export default InstructorRoute

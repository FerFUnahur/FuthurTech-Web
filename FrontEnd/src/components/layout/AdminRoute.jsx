import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Spinner } from 'react-bootstrap'

function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin' && user.role !== 'instructor') return <Navigate to="/dashboard" replace />
  return children
}

export default AdminRoute

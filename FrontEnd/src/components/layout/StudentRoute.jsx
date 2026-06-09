import { Navigate } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'

function StudentRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'student') return <Navigate to="/instructor" replace />

  return children
}

export default StudentRoute

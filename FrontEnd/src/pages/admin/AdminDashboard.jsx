import { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import { Alert, Container, Row, Col, Nav, Card, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

function AdminDashboard() {
  const { user } = useAuth()
  const location = useLocation()
  const [counts, setCounts] = useState({ users: '-', courses: '-', orders: '-' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')

    Promise.all([api.get('/users'), api.get('/courses'), api.get('/orders')])
      .then(([u, c, o]) => {
        setCounts({ users: u.data.length, courses: c.data.length, orders: o.data.length })
      })
      .catch((err) => {
        setError(err?.response?.data?.error || 'No se pudieron cargar las estadísticas')
      })
      .finally(() => setLoading(false))
  }, [])

  const isRoot = location.pathname === '/admin'

  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={2} className="admin-sidebar mb-4 mb-lg-0">
          <h5 className="fw-bold mb-4">
            <i className="bi bi-gear me-2"></i>Panel Admin
          </h5>
          <Nav className="flex-column gap-1">
            <Nav.Link as={NavLink} to="/admin" end className="text-dark">
              <i className="bi bi-graph-up me-2"></i>Resumen
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/usuarios" className="text-dark">
              <i className="bi bi-people me-2"></i>Usuarios
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/cursos" className="text-dark">
              <i className="bi bi-book me-2"></i>Cursos
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/pedidos" className="text-dark">
              <i className="bi bi-cart me-2"></i>Pedidos
            </Nav.Link>
          </Nav>
          <hr />
          <Link to="/dashboard/perfil" className="btn btn-verde btn-sm w-100">
            Mi Perfil
          </Link>
        </Col>

        <Col lg={10}>
          {isRoot ? (
            <>
              <h3 className="fw-bold mb-4">
                <i className="bi bi-gear me-2 text-verde"></i>
                Panel de Administración
              </h3>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <div className="text-muted mt-2">Cargando resumen...</div>
                </div>
              ) : error ? (
                <Alert variant="danger" className="d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </Alert>
              ) : (
                <>
                  <p className="text-muted mb-4">
                    Bienvenido, {user?.name}. Rol: <strong>{user?.role}</strong>
                  </p>
                  
                  <Row className="g-3 mb-4">
                    <Col md={4}>
                      <Card className="border-0 shadow-sm text-center p-3">
                        <i className="bi bi-people text-azul fs-1"></i>
                        <h4 className="fw-bold mt-2">{counts.users}</h4>
                        <p className="text-muted small mb-0">Usuarios</p>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="border-0 shadow-sm text-center p-3">
                        <i className="bi bi-book text-verde fs-1"></i>
                        <h4 className="fw-bold mt-2">{counts.courses}</h4>
                        <p className="text-muted small mb-0">Cursos</p>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="border-0 shadow-sm text-center p-3">
                        <i className="bi bi-cart text-naranja fs-1"></i>
                        <h4 className="fw-bold mt-2">{counts.orders}</h4>
                        <p className="text-muted small mb-0">Pedidos</p>
                      </Card>
                    </Col>
                  </Row>
                  <Row className="g-3">
                    <Col md={4}>
                      <Card as={Link} to="/admin/usuarios" className="text-decoration-none border-0 shadow-sm text-center p-4 h-100" style={{ cursor: 'pointer' }}>
                        <i className="bi bi-people-fill text-azul fs-2"></i>
                        <h5 className="fw-bold mt-2 text-dark">Gestionar Usuarios</h5>
                        <p className="text-muted small mb-0">Ver, editar y eliminar usuarios</p>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card as={Link} to="/admin/cursos" className="text-decoration-none border-0 shadow-sm text-center p-4 h-100" style={{ cursor: 'pointer' }}>
                        <i className="bi bi-book-fill text-verde fs-2"></i>
                        <h5 className="fw-bold mt-2 text-dark">Gestionar Cursos</h5>
                        <p className="text-muted small mb-0">Crear y administrar cursos</p>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card as={Link} to="/admin/pedidos" className="text-decoration-none border-0 shadow-sm text-center p-4 h-100" style={{ cursor: 'pointer' }}>
                        <i className="bi bi-cart-fill text-naranja fs-2"></i>
                        <h5 className="fw-bold mt-2 text-dark">Gestionar Pedidos</h5>
                        <p className="text-muted small mb-0">Ver y actualizar pedidos</p>
                      </Card>
                    </Col>
                  </Row>
                </>
              )}
            </>
          ) : (
            <Outlet />
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default AdminDashboard

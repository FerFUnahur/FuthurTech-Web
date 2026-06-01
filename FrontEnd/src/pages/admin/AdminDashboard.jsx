import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Nav, Card } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

function AdminDashboard() {
  const { user } = useAuth()
  const [counts, setCounts] = useState({ users: '-', courses: '-', orders: '-' })

  useEffect(() => {
    Promise.all([
      api.get('/users'),
      api.get('/courses'),
      api.get('/orders'),
    ]).then(([u, c, o]) => {
      setCounts({ users: u.data.length, courses: c.data.length, orders: o.data.length })
    }).catch(() => {})
  }, [])

  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={2} className="admin-sidebar mb-4 mb-lg-0">
          <h5 className="fw-bold mb-3"><i className="bi bi-shield-lock me-2"></i>Admin Panel</h5>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/admin" end className="text-dark">Resumen</Nav.Link>
            <Nav.Link as={Link} to="/admin/usuarios" className="text-dark"><i className="bi bi-people me-2"></i>Usuarios</Nav.Link>
            <Nav.Link as={Link} to="/admin/cursos" className="text-dark"><i className="bi bi-book me-2"></i>Cursos</Nav.Link>
            <Nav.Link as={Link} to="/admin/pedidos" className="text-dark"><i className="bi bi-cart me-2"></i>Pedidos</Nav.Link>
          </Nav>
          <hr />
          <Link to="/dashboard" className="btn btn-outline-secondary btn-sm w-100">Volver al Panel</Link>
        </Col>
        <Col lg={10}>
          <h3 className="fw-bold mb-4">
            <i className="bi bi-shield-lock me-2 text-azul"></i>
            Panel de Administración
          </h3>
          <p className="text-muted mb-4">Bienvenido, {user?.name}. Rol: <strong>{user?.role}</strong></p>

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
        </Col>
      </Row>
    </Container>
  )
}

export default AdminDashboard

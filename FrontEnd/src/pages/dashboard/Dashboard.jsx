import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

function Dashboard() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/enrollments').then(res => setEnrollments(res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (user?.role === 'admin' || user?.role === 'instructor') {
    return <Navigate to="/admin" replace />
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">¡Bienvenido, {user?.name}!</h2>
          <p className="text-muted mb-0">{user?.email} · <Badge bg="success">{user?.role}</Badge></p>
        </div>
        <div className="d-flex gap-2">
          <Button as={Link} to="/dashboard/perfil" variant="outline-primary" size="sm"><i className="bi bi-pencil me-1"></i>Editar Perfil</Button>
          <Button as={Link} to="/dashboard/certificados" variant="outline-success" size="sm"><i className="bi bi-award me-1"></i>Certificados</Button>
        </div>
      </div>

      <Row className="g-4 mb-4">
        <Col md={3} xs={6}>
          <Card className="border-0 shadow-sm text-center p-3">
            <Card.Body>
              <i className="bi bi-book text-azul fs-1"></i>
              <h3 className="fw-bold mt-2">{enrollments.filter(e => !e.completed).length}</h3>
              <p className="text-muted small mb-0">Cursos en curso</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} xs={6}>
          <Card className="border-0 shadow-sm text-center p-3">
            <Card.Body>
              <i className="bi bi-check-circle text-verde fs-1"></i>
              <h3 className="fw-bold mt-2">{enrollments.filter(e => e.completed).length}</h3>
              <p className="text-muted small mb-0">Completados</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} xs={6}>
          <Card className="border-0 shadow-sm text-center p-3">
            <Card.Body>
              <i className="bi bi-award text-naranja fs-1"></i>
              <h3 className="fw-bold mt-2">{enrollments.filter(e => e.completed).length}</h3>
              <p className="text-muted small mb-0">Certificados</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} xs={6}>
          <Card className="border-0 shadow-sm text-center p-3">
            <Card.Body>
              <i className="bi bi-bar-chart text-info fs-1"></i>
              <h3 className="fw-bold mt-2">{enrollments.length > 0 ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length) : 0}%</h3>
              <p className="text-muted small mb-0">Progreso promedio</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h4 className="fw-bold mb-3">Mis Cursos</h4>
      {loading ? (
        <div className="text-center py-3"><Spinner animation="border" variant="primary" /></div>
      ) : enrollments.length === 0 ? (
        <div className="text-center py-4 bg-light rounded-3">
          <p className="text-muted">No estás inscrito en ningún curso todavía.</p>
          <Button as={Link} to="/cursos" className="btn-verde">Explorar Cursos</Button>
        </div>
      ) : (
        <Row className="g-3">
          {[...enrollments].sort((a, b) => a.completed - b.completed).map(en => (
            <Col md={6} key={en.id}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="fw-bold">{en.Course?.title}</h5>
                      <p className="text-muted small mb-2">{en.Course?.description?.slice(0, 80)}...</p>
                    </div>
                    {en.completed ? (
                      <Badge bg="success">Completado</Badge>
                    ) : (
                      <Badge bg="warning" text="dark">En progreso</Badge>
                    )}
                  </div>
                  <div className="mb-2">
                    <div className="d-flex justify-content-between small">
                      <span>Progreso</span>
                      <span>{en.progress}%</span>
                    </div>
                    <div className="progress progress-thin">
                      <div className="progress-bar bg-verde" style={{ width: `${en.progress}%` }}></div>
                    </div>
                  </div>
                  <Button
                    as={Link}
                    to={`/cursos/${en.courseId}/leccion/${en.lastLessonId || en.Course?.Modules?.[0]?.Lessons?.[0]?.id}`}
                    size="sm"
                    variant={en.completed ? 'outline-success' : 'outline-primary'}
                  >
                    {en.completed ? 'Repasar' : 'Continuar'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default Dashboard

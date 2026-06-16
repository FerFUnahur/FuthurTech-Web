import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Alert, Container, Row, Col, Nav, Card, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

function InstructorDashboard() {
  const { user } = useAuth()
  const location = useLocation()
  const [stats, setStats] = useState({ courses: 0, students: 0, enrollments: 0 })
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError('')

      try {
        const coursesRes = await api.get('/courses')
        const myCourses = coursesRes.data.filter(c => c.instructorId === user.id)
        setCourses(myCourses)

        if (myCourses.length > 0) {
          const enrollmentsRes = await api.get('/enrollments')
          const enrolledInMyCourses = enrollmentsRes.data.filter(e =>
            myCourses.some(c => c.id === e.courseId)
          )

          setStats({
            courses: myCourses.length,
            enrollments: enrolledInMyCourses.length,
            students: new Set(enrolledInMyCourses.map(e => e.userId)).size,
          })
        } else {
          setStats({ courses: 0, enrollments: 0, students: 0 })
        }
      } catch (err) {
        setError(err?.response?.data?.error || 'No se pudieron cargar las estadísticas')
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) fetchData()
    else {
      setLoading(false)
      setError('No hay sesión activa')
    }
  }, [user])

  const isRoot = location.pathname === '/instructor'

  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={2} className="instructor-sidebar mb-4 mb-lg-0">
          <h5 className="fw-bold mb-3">
            <i className="bi bi-mortarboard me-2"></i>Panel Docente
          </h5>
          <Nav className="flex-column gap-1">
            <Nav.Link as={NavLink} to="/instructor" end className="text-dark">
              <i className="bi bi-graph-up me-2"></i>Resumen
            </Nav.Link>
            <Nav.Link as={NavLink} to="/instructor/cursos" className="text-dark">
              <i className="bi bi-book me-2"></i>Mis Cursos
            </Nav.Link>
            <Nav.Link as={NavLink} to="/instructor/estudiantes" className="text-dark">
              <i className="bi bi-people me-2"></i>Estudiantes
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
                <i className="bi bi-mortarboard me-2 text-verde"></i>
                Panel Docente
              </h3>
              <p className="text-muted mb-4">
                Bienvenido, {user?.name}. Rol: <strong>{user?.role}</strong>
              </p>

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
                  <Row className="g-3 mb-5">
                    <Col md={4}>
                      <Card className="border-0 shadow-sm text-center p-3 bg-light-verde">
                        <i className="bi bi-book-half text-verde fs-1"></i>
                        <h4 className="fw-bold mt-2">{stats.courses}</h4>
                        <p className="text-muted small mb-0">Cursos Creados</p>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="border-0 shadow-sm text-center p-3 bg-light-azul">
                        <i className="bi bi-people text-azul fs-1"></i>
                        <h4 className="fw-bold mt-2">{stats.students}</h4>
                        <p className="text-muted small mb-0">Estudiantes Totales</p>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="border-0 shadow-sm text-center p-3 bg-light-naranja">
                        <i className="bi bi-clipboard-check text-naranja fs-1"></i>
                        <h4 className="fw-bold mt-2">{stats.enrollments}</h4>
                        <p className="text-muted small mb-0">Inscripciones Activas</p>
                      </Card>
                    </Col>
                  </Row>

                  <Row className="g-3">
                    <Col md={6}>
                      <Card
                        as={Link}
                        to="/instructor/cursos"
                        className="text-decoration-none border-0 shadow-sm h-100"
                        style={{ cursor: 'pointer' }}
                      >
                        <Card.Body className="text-center">
                          <i className="bi bi-pencil-square text-verde fs-2 d-block mb-2"></i>
                          <h5 className="fw-bold text-dark">Gestionar Cursos</h5>
                          <p className="text-muted small mb-0">Crear, editar y eliminar tus cursos</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card
                        as={Link}
                        to="/instructor/estudiantes"
                        className="text-decoration-none border-0 shadow-sm h-100"
                        style={{ cursor: 'pointer' }}
                      >
                        <Card.Body className="text-center">
                          <i className="bi bi-graph-up text-azul fs-2 d-block mb-2"></i>
                          <h5 className="fw-bold text-dark">Ver Estudiantes</h5>
                          <p className="text-muted small mb-0">Seguimiento de progreso y estadísticas</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {courses.length > 0 && (
                    <>
                      <hr className="my-5" />
                      <h5 className="fw-bold mb-3">Tus Cursos Recientes</h5>
                      <Row className="g-3">
                        {courses.slice(0, 3).map(course => (
                          <Col md={4} key={course.id}>
                            <Card className="border-0 shadow-sm h-100">
                              <Card.Body>
                                <h6 className="fw-bold text-truncate">{course.title}</h6>
                                <p className="text-muted small mb-2">
                                  {course.description?.substring(0, 50)}...
                                </p>
                                <div className="d-flex gap-2">
                                  <Link to={`/instructor/cursos/${course.id}`} className="btn btn-sm btn-outline-verde">
                                    Editar
                                  </Link>
                                  <Link to={`/cursos/${course.id}`} className="btn btn-sm btn-outline-secondary">
                                    Ver
                                  </Link>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </>
                  )}
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

export default InstructorDashboard

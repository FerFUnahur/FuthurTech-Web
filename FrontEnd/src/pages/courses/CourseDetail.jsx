import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, Row, Col, Button, Spinner, Alert, Accordion, Badge, ListGroup, Toast, ToastContainer, Form } from 'react-bootstrap'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

function CourseDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [enrolled, setEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const [loading, setLoading] = useState(true)
  const [accessCode, setAccessCode] = useState('')
  const [accessError, setAccessError] = useState('')
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    api.get(`/courses/${id}`).then(res => setCourse(res.data)).catch(() => {}).finally(() => setLoading(false))
    if (user) {
      api.get('/enrollments').then(res => {
        const e = res.data.find(en => en.courseId === Number(id))
        if (e) setEnrolled(e)
      }).catch(() => {})
    }
  }, [id, user])

  const handleEnroll = async () => {
    setEnrolling(true)
    setAccessError('')
    try {
      const res = await api.post(`/courses/${id}/enroll`, { accessCode })
      setEnrolled(res.data)
      setShowToast(true)
    } catch (err) {
      setAccessError(err.response?.data?.error || 'Error al inscribirse')
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
  if (!course) return <Container className="py-5"><Alert variant="warning">Curso no encontrado</Alert></Container>

  const totalLessons = course.Modules?.reduce((sum, m) => sum + (m.Lessons?.length || 0), 0) || 0
  const totalMinutes = course.Modules?.reduce((sum, m) =>
    sum + (m.Lessons?.reduce((s, l) => s + (l.duration || 0), 0) || 0), 0) || 0
  const totalHours = totalMinutes >= 60 ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}min` : `${totalMinutes}min`

  return (
    <Container className="py-5">
      <Link to="/cursos" className="btn btn-outline-secondary btn-sm mb-4"><i className="bi bi-arrow-left me-1"></i>Volver</Link>
      <Row className="g-4">
        <Col lg={8}>
          <div className="card-img-top-placeholder rounded-3 mb-4" style={{ height: 250 }}>
            <i className="bi bi-laptop" style={{ fontSize: '5rem' }}></i>
          </div>
          <h2 className="fw-bold">{course.title}</h2>
          <div className="d-flex gap-3 mb-3">
            <Badge bg="success">{course.Category?.name || 'General'}</Badge>
            <Badge bg="secondary">Acceso por código</Badge>
            <span className="text-muted small"><i className="bi bi-file-text me-1"></i>{totalLessons} lecciones</span>
            <span className="text-muted small"><i className="bi bi-clock me-1"></i>{totalHours}</span>
          </div>
          <p className="text-muted">{course.description}</p>
          <p className="small text-muted"><i className="bi bi-person me-1"></i>Instructor: {course.instructor?.name || 'No asignado'}</p>

          <h4 className="fw-bold mt-4 mb-3">Contenido del Curso</h4>
          <Accordion>
            {course.Modules?.map((mod, i) => (
              <Accordion.Item eventKey={String(i)} key={mod.id}>
                <Accordion.Header>
                  <strong>Módulo {mod.order}: {mod.title}</strong>
                </Accordion.Header>
                <Accordion.Body>
                  <p className="text-muted small">{mod.description}</p>
                  <ListGroup variant="flush">
                    {mod.Lessons?.map(l => (
                      <ListGroup.Item key={l.id} className="d-flex justify-content-between align-items-center">
                        <span><i className="bi bi-play-circle me-2 text-verde"></i>{l.title}</span>
                        <small className="text-muted">{l.duration} min</small>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
        <Col lg={4}>
          <div className="bg-light p-4 rounded-3 position-sticky" style={{ top: '80px' }}>
            {enrolled ? (
              <>
                <h5 className="fw-bold text-verde"><i className="bi bi-check-circle me-2"></i>Inscripto</h5>
                <div className="mb-3">
                  <p className="small text-muted mb-1">Progreso: {enrolled.progress}%</p>
                  <div className="progress progress-thin">
                    <div className="progress-bar bg-verde" style={{ width: `${enrolled.progress}%` }}></div>
                  </div>
                </div>
                <Button as={Link} to={`/cursos/${course.id}/leccion/${course.Modules?.[0]?.Lessons?.[0]?.id}`} className="btn-verde w-100 mb-2">
                  <i className="bi bi-play-circle me-2"></i>Ir al curso
                </Button>
                {enrolled.completed && (
                  <Button as={Link} to="/dashboard/certificados" variant="outline-success" className="w-100">
                    <i className="bi bi-award me-2"></i>Ver certificado
                  </Button>
                )}
              </>
            ) : user ? (
              <>
                {user.role === 'admin' ? (
                  <Alert variant="warning">
                    <i className="bi bi-info-circle me-2"></i>Los administradores no pueden inscribirse a cursos
                  </Alert>
                ) : (
                  <>
                    {accessError && <Alert variant="danger" className="py-2 small">{accessError}</Alert>}
                    <Form.Control
                      type="text"
                      placeholder="Ingresá el código de acceso"
                      value={accessCode}
                      onChange={e => setAccessCode(e.target.value)}
                      className="mb-2"
                    />
                    <Button className="btn-verde w-100" onClick={handleEnroll} disabled={enrolling}>
                      {enrolling ? 'Validando...' : 'Inscribirme'}
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                <p className="text-muted small mb-3">Necesitás una cuenta y un código de acceso para inscribirte a este curso.</p>
                <Button as={Link} to="/login" variant="outline-primary" className="w-100">
                  Iniciá sesión para inscribirte
                </Button>
              </>
            )}
          </div>
        </Col>
      </Row>

      <ToastContainer position="top-center" className="p-3" style={{ zIndex: 9999 }}>
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="success">
          <Toast.Body className="text-white fw-semibold">
            <i className="bi bi-check-circle me-2"></i>¡Inscripción exitosa! Ya podés acceder al curso.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  )
}

export default CourseDetail

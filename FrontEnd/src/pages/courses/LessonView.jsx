import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button, Spinner, Alert, ListGroup } from 'react-bootstrap'
import api from '../../services/api'

function LessonView() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [lesson, setLesson] = useState(null)
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const res = await api.get(`/courses/${courseId}`)
      setCourse(res.data)
      const allLessons = res.data.Modules.flatMap(m => m.Lessons)
      const current = allLessons.find(l => l.id === Number(lessonId))
      setLesson(current)

      const enr = await api.get('/enrollments')
      const enrollment = enr.data.find(e => e.courseId === Number(courseId))
      if (enrollment) {
        const prog = await api.get(`/enrollments/${enrollment.id}/progress`)
        const progMap = {}
        prog.data.lessonProgress.forEach(lp => {
          progMap[lp.lessonId] = lp.completed
        })
        setProgress(progMap)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [courseId, lessonId])

  useEffect(() => {
    if (course && lesson) {
      api.put(`/courses/${courseId}/last-lesson`, { lessonId: Number(lessonId) }).catch(() => {})
    }
  }, [courseId, lessonId, course, lesson])

  const markComplete = async () => {
    try {
      await api.post(`/lessons/${lessonId}/progress`)
      loadData()
    } catch (err) {
      console.error(err)
    }
  }

  const allLessons = course ? course.Modules.flatMap(m => m.Lessons) : []
  const currentIndex = allLessons.findIndex(l => l.id === Number(lessonId))
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
  const completedLessons = allLessons.filter(l => progress[l.id]).length
  const pct = allLessons.length > 0 ? Math.round((completedLessons / allLessons.length) * 100) : 0

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
  if (!course || !lesson) return <Container className="py-5"><Alert variant="warning">Lección no encontrada</Alert></Container>

  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={3} className="lesson-sidebar mb-4 mb-lg-0">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">{course.title}</h5>
            <Button variant="outline-verde" size="sm" onClick={() => navigate('/dashboard')}>
              <i className="bi bi-arrow-left me-1"></i>Volver al Panel
            </Button>
          </div>
          <div className="mb-3">
            <div className="d-flex justify-content-between small mb-1">
              <span>Progreso</span>
              <span>{pct}%</span>
            </div>
            <div className="progress progress-thin">
              <div className="progress-bar bg-verde" style={{ width: `${pct}%` }}></div>
            </div>
          </div>
          {course.Modules?.map(mod => (
            <div key={mod.id} className="mb-3">
              <h6 className="fw-semibold small text-muted text-uppercase">Módulo {mod.order}: {mod.title}</h6>
              <ListGroup variant="flush" className="small">
                {mod.Lessons?.map(l => (
                  <ListGroup.Item
                    key={l.id}
                    active={l.id === Number(lessonId)}
                    className={`${progress[l.id] ? 'completed' : ''} ${l.id === Number(lessonId) ? 'active' : ''}`}
                    action
                    onClick={() => navigate(`/cursos/${courseId}/leccion/${l.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex justify-content-between w-100 align-items-center">
                      <span><i className={`bi ${progress[l.id] ? 'bi-check-circle-fill text-verde' : l.id === Number(lessonId) ? 'bi-play-circle-fill text-verde' : 'bi-play-circle'} me-2`}></i>{l.title}</span>
                      <small className="text-muted ms-2 text-nowrap">{l.duration} min</small>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          ))}
        </Col>
        <Col lg={9}>
          <h3 className="fw-bold mb-3">{lesson.title}</h3>
          {lesson.videoUrl && (
            <div className="ratio ratio-16x9 mb-4" style={{ maxWidth: '700px' }}>
              <iframe src={lesson.videoUrl} title={lesson.title} allowFullScreen></iframe>
            </div>
          )}
          <div className="bg-light p-4 rounded-3 mb-4">
            <p>{lesson.content}</p>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              {prevLesson && (
                <Button variant="outline-secondary" onClick={() => navigate(`/cursos/${courseId}/leccion/${prevLesson.id}`)}>
                  <i className="bi bi-chevron-left me-1"></i>Anterior
                </Button>
              )}
            </div>
            <div className="d-flex gap-2">
              {!progress[lesson.id] && (
                <Button className="btn-verde" onClick={markComplete}>
                  <i className="bi bi-check-lg me-1"></i>Marcar como completada
                </Button>
              )}
              {progress[lesson.id] && (
                <Button variant="outline-success" disabled>
                  <i className="bi bi-check-circle-fill me-1"></i>Completada
                </Button>
              )}
            </div>
            <div>
              {nextLesson && (
                <Button className="btn-verde" onClick={() => navigate(`/cursos/${courseId}/leccion/${nextLesson.id}`)}>
                  Siguiente<i className="bi bi-chevron-right ms-1"></i>
                </Button>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default LessonView

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Button, Spinner, Alert, Card, Badge, ListGroup, Form, Modal } from 'react-bootstrap'
import api from '../../services/api'
import { useToast } from '../../context/ToastContext'

function InstructorCourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success, error: toastError } = useToast()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [showModuleModal, setShowModuleModal] = useState(false)
  const [moduleForm, setModuleForm] = useState({ title: '', description: '' })
  const [savingModule, setSavingModule] = useState(false)

  const [showLessonModal, setShowLessonModal] = useState(false)
  const [activeModuleId, setActiveModuleId] = useState(null)
  const [lessonForm, setLessonForm] = useState({ title: '', content: '', duration: 10, videoUrl: '' })
  const [savingLesson, setSavingLesson] = useState(false)

  const loadCourse = async () => {
    try {
      const res = await api.get(`/courses/${id}`)
      setCourse(res.data)
    } catch {
      setLoadError('Error al cargar el curso')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCourse() }, [id])

  const handleAddModule = async (e) => {
    e.preventDefault()
    setSavingModule(true)
    try {
      await api.post(`/courses/${id}/modules`, moduleForm)
      success('Módulo agregado correctamente')
      setShowModuleModal(false)
      setModuleForm({ title: '', description: '' })
      loadCourse()
    } catch {
      toastError('Error al agregar el módulo')
    } finally {
      setSavingModule(false)
    }
  }

  const openLessonModal = (moduleId) => {
    setActiveModuleId(moduleId)
    setLessonForm({ title: '', content: '', duration: 10, videoUrl: '' })
    setShowLessonModal(true)
  }

  const handleAddLesson = async (e) => {
    e.preventDefault()
    setSavingLesson(true)
    try {
      await api.post(`/modules/${activeModuleId}/lessons`, lessonForm)
      success('Lección agregada correctamente')
      setShowLessonModal(false)
      loadCourse()
    } catch {
      toastError('Error al agregar la lección')
    } finally {
      setSavingLesson(false)
    }
  }

  const handleDeleteModule = async (moduleId) => {
    if (!confirm('¿Eliminar este módulo y todas sus lecciones?')) return
    try {
      await api.delete(`/modules/${moduleId}`)
      success('Módulo eliminado')
      loadCourse()
    } catch {
      toastError('Error al eliminar el módulo')
    }
  }

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm('¿Eliminar esta lección?')) return
    try {
      await api.delete(`/lessons/${lessonId}`)
      success('Lección eliminada')
      loadCourse()
    } catch {
      toastError('Error al eliminar la lección')
    }
  }

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
  if (loadError || !course) return <Container className="py-5"><Alert variant="danger">{loadError || 'Curso no encontrado'}</Alert></Container>

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Button variant="outline-secondary" size="sm" onClick={() => navigate('/instructor/cursos')} className="mb-2">
            <i className="bi bi-arrow-left me-1"></i>Volver
          </Button>
          <h3 className="fw-bold mb-1">{course.title}</h3>
          <p className="text-muted mb-0">{course.description}</p>
          <div className="mt-2">
            <Badge bg={course.status === 'publicado' ? 'success' : 'secondary'} className="me-2">{course.status}</Badge>
            <Badge bg="primary">{course.Modules?.length || 0} módulos</Badge>
            <Badge bg="info" className="ms-2">{course.studentCount || 0} estudiantes</Badge>
          </div>
        </div>
        <Button className="btn-verde" onClick={() => setShowModuleModal(true)}>
          <i className="bi bi-plus-lg me-1"></i>Agregar Módulo
        </Button>
      </div>

      {!course.Modules || course.Modules.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-3">
          <i className="bi bi-folder-plus" style={{ fontSize: '3rem', color: '#ccc' }}></i>
          <p className="text-muted mt-3">Este curso no tiene módulos todavía.</p>
          <Button className="btn-verde" onClick={() => setShowModuleModal(true)}>Crear primer módulo</Button>
        </div>
      ) : (
        course.Modules.sort((a, b) => a.order - b.order).map(mod => (
          <Card key={mod.id} className="mb-3 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="fw-bold mb-1">Módulo {mod.order}: {mod.title}</h5>
                  {mod.description && <p className="text-muted small mb-2">{mod.description}</p>}
                </div>
                <div className="d-flex gap-1">
                  <Button size="sm" variant="outline-primary" onClick={() => openLessonModal(mod.id)}>
                    <i className="bi bi-plus-lg"></i>
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDeleteModule(mod.id)}>
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              </div>
              {mod.Lessons && mod.Lessons.length > 0 ? (
                <ListGroup variant="flush" className="small">
                  {mod.Lessons.sort((a, b) => a.order - b.order).map(lesson => (
                    <ListGroup.Item key={lesson.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <i className="bi bi-play-circle me-2 text-muted"></i>
                        {lesson.title}
                        <span className="text-muted ms-2">({lesson.duration} min)</span>
                      </div>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDeleteLesson(lesson.id)}>
                        <i className="bi bi-trash"></i>
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted small mb-0 mt-2">Sin lecciones. Agregá una con el botón +</p>
              )}
            </Card.Body>
          </Card>
        ))
      )}

      <Modal show={showModuleModal} onHide={() => setShowModuleModal(false)}>
        <Modal.Header closeButton><Modal.Title>Agregar Módulo</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddModule}>
            <Form.Group className="mb-3">
              <Form.Label>Título *</Form.Label>
              <Form.Control value={moduleForm.title} onChange={e => setModuleForm({...moduleForm, title: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={3} value={moduleForm.description} onChange={e => setModuleForm({...moduleForm, description: e.target.value})} />
            </Form.Group>
            <Button type="submit" className="btn-verde w-100" disabled={savingModule}>
              {savingModule ? 'Guardando...' : 'Agregar Módulo'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showLessonModal} onHide={() => setShowLessonModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Agregar Lección</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddLesson}>
            <Form.Group className="mb-3">
              <Form.Label>Título *</Form.Label>
              <Form.Control value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contenido *</Form.Label>
              <Form.Control as="textarea" rows={5} value={lessonForm.content} onChange={e => setLessonForm({...lessonForm, content: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duración (minutos)</Form.Label>
              <Form.Control type="number" min={1} value={lessonForm.duration} onChange={e => setLessonForm({...lessonForm, duration: parseInt(e.target.value) || 1})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL del video (opcional)</Form.Label>
              <Form.Control type="url" value={lessonForm.videoUrl} onChange={e => setLessonForm({...lessonForm, videoUrl: e.target.value})} placeholder="https://..." />
            </Form.Group>
            <Button type="submit" className="btn-verde w-100" disabled={savingLesson}>
              {savingLesson ? 'Guardando...' : 'Agregar Lección'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default InstructorCourseDetail

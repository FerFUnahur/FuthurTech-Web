import { useState, useEffect } from 'react'
import { Table, Button, Badge, Modal, Form } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

function InstructorCourses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    accessCode: '',
    status: 'publicado'
  })

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses')
        const myCourses = res.data.filter(c => c.instructorId === user.id)
        setCourses(myCourses)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    if (user?.id) fetchCourses()
  }, [user])

  const handleEdit = (course) => {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      description: course.description,
      accessCode: course.accessCode,
      status: course.status
    })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingCourse) {
        await api.put(`/courses/${editingCourse.id}`, formData)
        setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...formData } : c))
      } else {
        const res = await api.post('/courses', { ...formData, instructorId: user.id })
        setCourses([...courses, res.data])
      }
      setShowModal(false)
      setEditingCourse(null)
      setFormData({ title: '', description: '', accessCode: '', status: 'publicado' })
    } catch (error) {
      console.error('Error al guardar:', error)
    } finally {
      setSaving(false)
    }
  }

  const generateCode = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'curso'
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
    setFormData({ ...formData, accessCode: `${slug}-${rand}` })
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro?')) {
      try {
        await api.delete(`/courses/${id}`)
        setCourses(courses.filter(c => c.id !== id))
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  return (
    <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold"><i className="bi bi-book me-2 text-verde"></i>Mis Cursos</h3>
            <Button
              variant="success"
              onClick={() => {
                setEditingCourse(null)
                setFormData({ title: '', description: '', accessCode: '', status: 'publicado' })
                setShowModal(true)
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>Crear Curso
            </Button>
          </div>

          {courses.length === 0 ? (
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              No tienes cursos aún. <button onClick={() => setShowModal(true)} className="btn btn-link p-0">Crea uno ahora</button>.
            </div>
          ) : (
            <Table responsive striped hover className="shadow-sm">
              <thead className="table-light">
                <tr>
                  <th>Título</th>
                  <th>Estudiantes</th>
                  <th>Código de acceso</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id}>
                    <td className="fw-bold">{course.title}</td>
                    <td>-</td>
                    <td><code>{course.accessCode}</code></td>
                    <td>
                      <Badge bg={course.status === 'publicado' ? 'success' : 'warning'}>
                        {course.status}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleEdit(course)}
                        className="me-2"
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(course.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{editingCourse ? 'Editar' : 'Crear'} Curso</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSave}>
                <Form.Group className="mb-3">
                  <Form.Label>Título *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Descripción *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Código de acceso *</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      value={formData.accessCode}
                      onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                      required
                      placeholder="Ej: ROBOTICA-001"
                    />
                    <Button variant="outline-secondary" onClick={generateCode} title="Generar código automático">
                      <i className="bi bi-arrow-repeat"></i>
                    </Button>
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="publicado">Publicado</option>
                    <option value="borrador">Borrador</option>
                  </Form.Select>
                </Form.Group>
                <Button variant="success" type="submit" className="w-100" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar Curso'}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
    </div>
  )
}

export default InstructorCourses

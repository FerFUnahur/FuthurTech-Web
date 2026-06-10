import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Spinner, Badge, Alert } from 'react-bootstrap'
import api from '../../services/api'
import TablePagination from '../../components/TablePagination'
import { useToast } from '../../context/ToastContext'

const ROWS_PER_PAGE = 10

function AdminCourses() {
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [editCourse, setEditCourse] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', accessCode: '', categoryId: '', status: 'borrador', instructorId: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const { success, error: toastError } = useToast()

  const loadData = () => {
    Promise.all([
      api.get('/courses'),
      api.get('/categories'),
      api.get('/users?role=instructor')
    ]).then(([c, cat, ins]) => {
      setCourses(c.data)
      setCategories(cat.data)
      setInstructors(ins.data)
    }).catch(() => {
      toastError('Error al cargar los datos')
    }).finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  const openEdit = (course) => {
    setEditCourse(course)
    setForm({ title: course.title, description: course.description, accessCode: course.accessCode, categoryId: course.categoryId || '', status: course.status, instructorId: course.instructorId || '' })
    setShow(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const data = { ...form, categoryId: form.categoryId ? Number(form.categoryId) : null }
      if (editCourse) {
        await api.put(`/courses/${editCourse.id}`, data)
      } else {
        await api.post('/courses', data)
      }
      setShow(false)
      loadData()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este curso?')) return
    try {
      await api.delete(`/courses/${id}`)
      success('Curso eliminado correctamente')
      loadData()
    } catch {
      toastError('Error al eliminar el curso')
    }
  }

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0"><i className="bi bi-book me-2"></i>Gestionar Cursos</h4>
        <Button className="btn-verde" onClick={() => { setEditCourse(null); setForm({ title: '', description: '', accessCode: '', categoryId: '', status: 'borrador', instructorId: '' }); setShow(true) }}>
          <i className="bi bi-plus-lg me-2"></i>Nuevo Curso
        </Button>
      </div>
      <Table responsive striped hover>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Instructor</th>
            <th>Código</th>
            <th>Estado</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {courses.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE).map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.title}</td>
              <td>{c.instructor?.name || '-'}</td>
              <td><code>{c.accessCode || '-'}</code></td>
              <td><Badge bg={c.status === 'publicado' ? 'success' : 'secondary'}>{c.status}</Badge></td>
              <td>{c.Category?.name || '-'}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openEdit(c)}><i className="bi bi-pencil"></i></Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(c.id)}><i className="bi bi-trash"></i></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <TablePagination
        currentPage={page}
        totalPages={Math.ceil(courses.length / ROWS_PER_PAGE)}
        onPageChange={setPage}
      />

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>{editCourse ? 'Editar Curso' : 'Nuevo Curso'}</Modal.Title></Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Código de acceso *</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control type="text" value={form.accessCode} onChange={e => setForm({...form, accessCode: e.target.value})} required placeholder="Ej: ROBOTICA-001" />
                <Button variant="outline-secondary" onClick={() => {
                  const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'curso'
                  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
                  setForm({...form, accessCode: `${slug}-${rand}`})
                }} title="Generar código automático">
                  <i className="bi bi-arrow-repeat"></i>
                </Button>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}>
                <option value="">Sin categoría</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option value="borrador">Borrador</option>
                <option value="publicado">Publicado</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Instructor</Form.Label>
              <Form.Select value={form.instructorId} onChange={e => setForm({...form, instructorId: e.target.value})}>
                <option value="">Seleccionar instructor</option>
                {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancelar</Button>
          <Button className="btn-verde" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default AdminCourses

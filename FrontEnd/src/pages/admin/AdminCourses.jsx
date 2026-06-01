import { useState, useEffect } from 'react'
import { Container, Table, Button, Modal, Form, Spinner, Badge, Alert } from 'react-bootstrap'
import api from '../../services/api'

function AdminCourses() {
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [editCourse, setEditCourse] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', price: 0, categoryId: '', status: 'borrador' })
  const [error, setError] = useState('')

  const loadData = () => {
    Promise.all([
      api.get('/courses'),
      api.get('/categories')
    ]).then(([c, cat]) => {
      setCourses(c.data)
      setCategories(cat.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  const openEdit = (course) => {
    setEditCourse(course)
    setForm({ title: course.title, description: course.description, price: course.price, categoryId: course.categoryId || '', status: course.status })
    setShow(true)
  }

  const handleSave = async () => {
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
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este curso?')) return
    await api.delete(`/courses/${id}`)
    loadData()
  }

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0"><i className="bi bi-book me-2"></i>Gestionar Cursos</h4>
        <Button className="btn-verde" onClick={() => { setEditCourse(null); setForm({ title: '', description: '', price: 0, categoryId: '', status: 'borrador' }); setShow(true) }}>
          <i className="bi bi-plus-lg me-2"></i>Nuevo Curso
        </Button>
      </div>
      <Table responsive striped hover>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.title}</td>
              <td>{c.price === 0 ? 'Gratis' : `$${c.price.toLocaleString()}`}</td>
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
              <Form.Label>Precio ($)</Form.Label>
              <Form.Control type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancelar</Button>
          <Button className="btn-verde" onClick={handleSave}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default AdminCourses

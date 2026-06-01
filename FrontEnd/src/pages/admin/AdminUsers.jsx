import { useState, useEffect } from 'react'
import { Container, Table, Button, Modal, Form, Spinner, Badge, Alert } from 'react-bootstrap'
import api from '../../services/api'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', role: 'student' })
  const [error, setError] = useState('')

  const loadUsers = () => {
    api.get('/users').then(res => setUsers(res.data)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { loadUsers() }, [])

  const openEdit = (user) => {
    setEditUser(user)
    setForm({ name: user.name, email: user.email, role: user.role })
    setShow(true)
  }

  const handleSave = async () => {
    try {
      await api.put(`/users/${editUser.id}`, form)
      setShow(false)
      loadUsers()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este usuario?')) return
    await api.delete(`/users/${id}`)
    loadUsers()
  }

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>

  return (
    <Container fluid className="py-4">
      <h4 className="fw-bold mb-4"><i className="bi bi-people me-2"></i>Gestionar Usuarios</h4>
      <Table responsive striped hover>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td><Badge bg={u.role === 'admin' ? 'danger' : u.role === 'instructor' ? 'warning' : 'success'}>{u.role}</Badge></td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openEdit(u)}><i className="bi bi-pencil"></i></Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(u.id)}><i className="bi bi-trash"></i></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>Editar Usuario</Modal.Title></Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="student">Estudiante</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
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

export default AdminUsers

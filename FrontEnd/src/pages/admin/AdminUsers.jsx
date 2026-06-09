import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Spinner, Badge, Alert } from 'react-bootstrap'

import api from '../../services/api'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [form, setForm] = useState({ role: 'student' })
  const [error, setError] = useState('')

  const loadUsers = () => {
    api.get('/users').then(res => setUsers(res.data)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { loadUsers() }, [])

  const openEdit = (user) => {
    setEditUser(user)
    setForm({ role: user.role, active: user.active })
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
    <div>
      {/* Tip: en el panel admin las pestañas se mueven por rutas internas */}

      <h4 className="fw-bold mb-4"><i className="bi bi-people me-2"></i>Gestionar Usuarios</h4>

      <Table responsive striped hover>
<thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
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
                <td><Badge bg={u.active ? 'success' : 'secondary'}>{u.active ? 'Activo' : 'Inactivo'}</Badge></td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openEdit(u)}><i className="bi bi-pencil"></i></Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(u.id)}><i className="bi bi-trash"></i></Button>
                </td>
              </tr>
            ))}
          </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>Cambiar Rol - {editUser?.name}</Modal.Title></Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <p className="text-muted small mb-3">
            <i className="bi bi-info-circle me-1"></i>
            Solo puedes modificar rol y estado del usuario. Para editar nombre, email u otros datos, el usuario debe actualizar su propio perfil.
          </p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="student">Estudiante</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check 
                type="switch"
                id="active-switch"
                label="Usuario activo"
                checked={form.active}
                onChange={e => setForm({...form, active: e.target.checked})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancelar</Button>
          <Button className="btn-verde" onClick={handleSave}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

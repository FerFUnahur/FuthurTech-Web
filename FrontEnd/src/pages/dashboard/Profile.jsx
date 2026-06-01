import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

function Profile() {
  const { user, login } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', bio: user?.bio || '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put(`/users/${user.id}`, form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container className="py-5">
      <h2 className="section-title">Mi Perfil</h2>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              {saved && <Alert variant="success">Perfil actualizado correctamente</Alert>}
              <Form onSubmit={handleSubmit}>
                <div className="text-center mb-4">
                  <div className="rounded-circle bg-azul text-white d-inline-flex align-items-center justify-content-center" style={{ width: 80, height: 80, fontSize: '2rem' }}>
                    <i className="bi bi-person-fill"></i>
                  </div>
                </div>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Biografía</Form.Label>
                  <Form.Control as="textarea" rows={4} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Contá algo sobre vos..." />
                </Form.Group>
                <Button type="submit" className="btn-verde w-100" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Profile

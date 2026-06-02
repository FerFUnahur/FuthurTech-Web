import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

const argentinaProvinces = [
  'Gran Buenos Aires',
  'Buenos Aires (interior)',
  'Ciudad Autónoma de Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
]

function Profile() {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthDate: user?.birthDate || '',
    city: user?.city || '',
    province: user?.province || '',
    bio: user?.bio || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      birthDate: user?.birthDate || '',
      city: user?.city || '',
      province: user?.province || '',
      bio: user?.bio || '',
    })
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.put(`/users/${user.id}`, form)
      setUser(res.data.user)
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
                  <Form.Label>Número de teléfono</Form.Label>
                  <Form.Control type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Ej: 11 1234-5678" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de nacimiento</Form.Label>
                  <Form.Control type="date" value={form.birthDate} onChange={e => setForm({...form, birthDate: e.target.value})} />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ciudad</Form.Label>
                      <Form.Control type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="Ej: Hurlingham" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Provincia / región</Form.Label>
                      <Form.Select value={form.province} onChange={e => setForm({...form, province: e.target.value})}>
                        <option value="">Seleccioná una provincia o región</option>
                        {argentinaProvinces.map(province => (
                          <option key={province} value={province}>{province}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Sobre vos</Form.Label>
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

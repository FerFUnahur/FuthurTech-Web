import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Spinner, InputGroup } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

function Register() {
  const { register, user } = useAuth()
  const { success, error: toastError } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', birthDate: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  if (user) { navigate('/dashboard'); return null }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toastError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password, birthDate: form.birthDate })
      success('¡Cuenta creada exitosamente!')
      navigate('/dashboard')
    } catch {
      // Error handled by useAuth register interceptor
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={5}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h3 className="fw-bold text-center mb-4"><i className="bi bi-person-plus me-2"></i>Crear Cuenta</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Tu nombre" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="tu@email.com" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de nacimiento</Form.Label>
                  <Form.Control type="date" value={form.birthDate} onChange={e => setForm({...form, birthDate: e.target.value})} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <InputGroup>
                    <Form.Control type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} required placeholder="Mínimo 6 caracteres" minLength={6} />
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </Button>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <InputGroup>
                    <Form.Control type={showConfirmPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} required placeholder="Repetí la contraseña" />
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Ocultar confirmación de contraseña' : 'Mostrar confirmación de contraseña'}
                    >
                      <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </Button>
                  </InputGroup>
                </Form.Group>
                <Button type="submit" className="btn-verde w-100 py-2 fw-bold" disabled={loading}>
                  {loading ? <Spinner size="sm" animation="border" /> : 'Crear Cuenta'}
                </Button>
              </Form>
              <p className="text-center mt-3 text-muted small">
                ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Register

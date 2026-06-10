import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Spinner, InputGroup } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

function Login() {
  const { login, user } = useAuth()
  const { success } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: 'student@futhurtech.com', password: '123456' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  if (user) {
    if (user.role === 'admin') {
      navigate('/admin');
    } else if (user.role === 'instructor') {
      navigate('/instructor');
    } else {
      navigate('/guia');
    }
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const userData = await login(form.email, form.password)
      success(`¡Bienvenido, ${userData.name}!`)
      if (userData.role === 'admin') {
        navigate('/admin')
      } else if (userData.role === 'instructor') {
        navigate('/instructor')
      } else if (userData.role === 'student') {
        navigate('/guia')
      } else {
        navigate('/dashboard')
      }
    } catch {
      // Error handled by useAuth login interceptor
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
              <h3 className="fw-bold text-center mb-4"><i className="bi bi-box-arrow-in-right me-2"></i>Iniciar Sesión</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="tu@email.com" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <InputGroup>
                    <Form.Control type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} required placeholder="Tu contraseña" />
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
                <Button type="submit" className="btn-verde w-100 py-2 fw-bold" disabled={loading}>
                  {loading ? <Spinner size="sm" animation="border" /> : 'Ingresar'}
                </Button>
              </Form>
              <p className="text-center mt-3 text-muted small">
                ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
              </p>
              <div className="bg-light p-3 rounded mt-3">
                <p className="small text-muted mb-1 fw-semibold">Demo:</p>
                <p className="small text-muted mb-0">Admin: admin@futhurtech.com / 123456</p>
                <p className="small text-muted mb-0">Instructor: instructor@futhurtech.com / 123456</p>
                <p className="small text-muted mb-0">Student: student@futhurtech.com / 123456</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Login

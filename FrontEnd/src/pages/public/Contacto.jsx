import { useState } from 'react'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'

function Contacto() {
  const [sent, setSent] = useState(false)
  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <Container className="py-5">
      <h2 className="section-title">Contacto</h2>
      <Row className="g-5">
        <Col lg={7}>
          {sent ? (
            <Alert variant="success">¡Mensaje enviado con éxito! Te responderemos a la brevedad.</Alert>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control type="text" required placeholder="Tu nombre" />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" required placeholder="tu@email.com" />
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>¿Sobre qué querés consultar?</Form.Label>
                <Form.Select required>
                  <option value="">Seleccioná una opción</option>
                  <option>Cursos</option>
                  <option>Productos</option>
                  <option>Ser instructor</option>
                  <option>Otro</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mensaje</Form.Label>
                <Form.Control as="textarea" rows={5} required placeholder="Escribí tu mensaje..." />
              </Form.Group>
              <Button type="submit" className="btn-verde px-4">Enviar Mensaje</Button>
            </Form>
          )}
        </Col>
        <Col lg={5}>
          <div className="bg-light p-4 rounded-3">
            <h5 className="fw-bold mb-3"><i className="bi bi-info-circle text-azul me-2"></i>Información de contacto</h5>
            <div className="d-flex flex-column gap-3">
              <div><i className="bi bi-envelope text-verde me-2"></i> info@futhurtech.com</div>
              <div><i className="bi bi-telephone text-verde me-2"></i> +54 11 5555-0123</div>
              <div><i className="bi bi-geo-alt text-verde me-2"></i> Buenos Aires, Argentina</div>
              <div><i className="bi bi-clock text-verde me-2"></i> Lun a Vie: 9:00 - 18:00</div>
            </div>
            <hr />
            <p className="text-muted small mb-0">Respondemos todos los mensajes en menos de 24 horas hábiles.</p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Contacto

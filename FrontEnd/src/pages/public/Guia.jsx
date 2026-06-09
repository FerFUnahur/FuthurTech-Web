import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function Guia() {
  return (
    <Container className="py-5">
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold text-azul">Guía para Estudiantes</h1>
        <p className="lead text-muted">Todo lo que necesitás saber para empezar tu camino en la robótica.</p>
      </header>

      <Row className="g-4">
        {/* Paso 1: Compras */}
        <Col lg={4}>
          <Card className="h-100 border-0 shadow-sm p-3">
            <Card.Body>
              <div className="text-azul fs-1 mb-3"><i className="bi bi-cart-plus"></i></div>
              <h3 className="h4 fw-bold">1. Comprar tu kit</h3>
              <p className="text-muted">
                Explorá nuestra sección de <strong>Hardware</strong> y elegí el kit de robótica que necesites. Al completar la compra, <strong>recibirás un código de acceso</strong> por email para inscribirte a los cursos asociados.
              </p>
              <Button as={Link} to="/productos" variant="outline-azul" className="w-100 mt-2">Ir a la Tienda</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Paso 2: Cursos */}
        <Col lg={4}>
          <Card className="h-100 border-0 shadow-sm p-3">
            <Card.Body>
              <div className="text-verde fs-1 mb-3"><i className="bi bi-journal-bookmark"></i></div>
              <h3 className="h4 fw-bold">2. Inscribirse a un curso</h3>
              <p className="text-muted">
                En la pestaña de <strong>Cursos</strong>, elegí el nivel que quieras aprender. Usá el código que recibiste con tu compra para inscribirte (ver paso 3). El curso aparecerá en tu panel y podés avanzar a tu propio ritmo.
              </p>
              <Button as={Link} to="/cursos" className="btn-verde w-100 mt-2">Explorar Cursos</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Paso 3: Códigos de acceso */}
        <Col lg={4}>
          <Card className="h-100 border-0 shadow-sm p-3">
            <Card.Body>
              <div className="text-warning fs-1 mb-3"><i className="bi bi-key"></i></div>
              <h3 className="h4 fw-bold">3. Códigos de acceso</h3>
              <p className="text-muted small mb-3">
                Cada compra incluye un código único para sus cursos (ej: <code>ROBOTICA-001</code>).
              </p>
              <ListGroup variant="flush" className="small">
                <ListGroup.Item><i className="bi bi-envelope me-2 text-azul"></i><strong>Dónde llega:</strong> Al email registrado al completar la compra</ListGroup.Item>
                <ListGroup.Item><i className="bi bi-ui-checks me-2 text-verde"></i><strong>Cómo usarlo:</strong> Al hacer clic en "Inscribirme" en un curso, ingresá el código recibido</ListGroup.Item>
                <ListGroup.Item><i className="bi bi-question-circle me-2 text-warning"></i><strong>¿No lo recibiste?</strong> Revisá spam o contactá a soporte</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="bg-light p-4 rounded-4 mt-5 text-center shadow-sm">
        <h4 className="fw-bold mb-3">¿Ya tenés todo claro?</h4>
        <Button as={Link} to="/dashboard" className="btn-verde btn-lg px-5 fw-bold">Ir a mi Panel de Control</Button>
      </div>
    </Container>
  )
}

export default Guia
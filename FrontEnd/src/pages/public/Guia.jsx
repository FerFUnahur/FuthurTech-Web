import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function Guia() {
  return (
    <Container className="py-5">
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold text-azul">Guía para Estudiantes</h1>
        <p className="lead text-muted">Todo lo que necesitás saber para empezar tu camino en la robótica.</p>
      </header>

      <Row className="g-4">
        {/* Paso 1: Cursos */}
        <Col lg={6}>
          <Card className="h-100 border-0 shadow-sm p-3">
            <Card.Body>
              <div className="text-verde fs-1 mb-3"><i className="bi bi-journal-bookmark"></i></div>
              <h3 className="h4 fw-bold">1. Inscribirse a un curso</h3>
              <p className="text-muted">
                En la pestaña de <strong>Cursos</strong>, elegí el nivel que quieras aprender. Hacé clic en "Inscribirme" y el curso aparecerá en tu panel. Podés avanzar a tu propio ritmo y ver las clases cuando quieras.
              </p>
              <Button as={Link} to="/cursos" className="btn-verde w-100 mt-2">Explorar Cursos</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Paso 2: Compras */}
        <Col lg={6}>
          <Card className="h-100 border-0 shadow-sm p-3">
            <Card.Body>
              <div className="text-azul fs-1 mb-3"><i className="bi bi-cart-plus"></i></div>
              <h3 className="h4 fw-bold">2. Comprar productos</h3>
              <p className="text-muted">
                Explorá nuestra sección de <strong>Hardware</strong>. Seleccioná el kit que te interese, agregalo al carrito y completá el pago. Recibirás un mail de confirmación y el seguimiento de tu envío.
              </p>
              <Button as={Link} to="/productos" variant="outline-verde" className="w-100 mt-2">Ir a la Tienda</Button>
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
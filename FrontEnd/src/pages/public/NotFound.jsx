import { Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'

function NotFound() {
  return (
    <Container className="py-5 text-center">
      <div className="mb-4">
        <i className="bi bi-question-circle text-muted" style={{ fontSize: '6rem' }}></i>
      </div>
      <h1 className="display-4 fw-bold">404</h1>
      <p className="lead text-muted mb-4">La página que buscás no existe o fue movida.</p>
      <Link to="/" className="btn btn-verde btn-lg px-5">
        <i className="bi bi-house me-2"></i>Volver al Inicio
      </Link>
    </Container>
  )
}

export default NotFound
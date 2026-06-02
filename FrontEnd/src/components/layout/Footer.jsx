import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'

function Footer() {
  return (
    <footer className="footer-custom text-white pt-3 pb-2 mt-auto">
      <Container>
        <Row className="g-5">
          <Col md={5} className="mb-2">
            <h5 className="fw-bold mb-2"><i className="bi bi-cpu me-2"></i>FuthurTech</h5>
            <p className="small text-light-emphasis mb-0">Educación y robótica para el futuro. Transformando ideas en tecnología.</p>
          </Col>
          <Col md={2} className="mb-2">
            <h6 className="fw-bold mb-2">Navegación</h6>
            <div className="d-flex flex-column gap-1">
              <Link to="/" className="footer-link">Inicio</Link>
              <Link to="/productos" className="footer-link">Productos</Link>
              <Link to="/cursos" className="footer-link">Cursos</Link>
              <Link to="/nosotros" className="footer-link">Nosotros</Link>
            </div>
          </Col>
          <Col md={2} className="mb-2">
            <h6 className="fw-bold mb-2">Ayuda</h6>
            <div className="d-flex flex-column gap-1">
              <Link to="/faq" className="footer-link">FAQ</Link>
              <Link to="/contacto" className="footer-link">Contacto</Link>
            </div>
          </Col>
          <Col md={3} className="mb-2 text-center">
            <h6 className="fw-bold mb-2">Seguinos</h6>
            <div className="d-flex gap-3 fs-5 justify-content-center">
              <a href="https://www.instagram.com/futhurtech_argentina/" className="text-white" target="_blank" rel="noopener noreferrer"><i className="bi bi-instagram"></i></a>
              <a href="https://www.facebook.com/FuthurtechArgentina/" className="text-white" target="_blank" rel="noopener noreferrer"><i className="bi bi-facebook"></i></a>
              <a href="https://www.youtube.com/channel/UCfmf7oKje5CYEKXvQrP4sMQ" className="text-white" target="_blank" rel="noopener noreferrer"><i className="bi bi-youtube"></i></a>
              <a href="https://www.linkedin.com/company/futhur-tech/" className="text-white" target="_blank" rel="noopener noreferrer"><i className="bi bi-linkedin"></i></a>
            </div>
          </Col>
        </Row>
        <hr className="border-light opacity-25 my-2" />
        <p className="text-center small text-light-emphasis mb-0">&copy; {new Date().getFullYear()} FuthurTech. Todos los derechos reservados.</p>
      </Container>
    </footer>
  )
}

export default Footer

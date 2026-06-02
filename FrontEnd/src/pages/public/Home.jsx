import { Link } from 'react-router-dom'
import { Container, Row, Col, Button } from 'react-bootstrap'

function Home() {
  return (
    <>
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <h1>Transformá tu futuro con <span className="text-verde">tecnología</span> y <span className="text-naranja">robótica</span></h1>
              <p className="hero-lead fs-5 my-4">Cursos autoasistidos, kits de robótica y una comunidad apasionada por la innovación. Todo lo que necesitás para dar el próximo paso.</p>
              <div className="d-flex gap-3 flex-wrap">
                <Button as={Link} to="/cursos" size="lg" className="btn-verde fw-bold px-4">Explorar Cursos</Button>
                <Button as={Link} to="/productos" size="lg" variant="outline-light" className="fw-bold px-4">Ver Productos</Button>
              </div>
            </Col>
            <Col lg={5} className="d-none d-lg-block">
              <div className="hero-visual">
                <div className="hero-robot-icon">
                  <div className="circle">
                    <div className="circle-inner">
                      <div className="icon-center">
                        <i className="bi bi-robot"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="stats-bar">
        <Container>
          <Row className="text-center">
            <Col md={3} xs={6} className="mb-3 mb-md-0"><div className="stat-number">500+</div><div>Estudiantes</div></Col>
            <Col md={3} xs={6} className="mb-3 mb-md-0"><div className="stat-number">15+</div><div>Cursos</div></Col>
            <Col md={3} xs={6} className="mb-3 mb-md-0"><div className="stat-number">50+</div><div>Productos</div></Col>
            <Col md={3} xs={6} className="mb-3 mb-md-0"><div className="stat-number">98%</div><div>Satisfacción</div></Col>
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <h2 className="section-title text-center">¿Cómo funciona?</h2>
          <Row className="g-4">
            <Col md={4}>
              <div className="step-card">
                <div className="step-number">1</div>
                <h5 className="fw-bold">Registrate</h5>
                <p className="text-muted">Creá tu cuenta gratis y accedé a todos los cursos y productos.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="step-card">
                <div className="step-number">2</div>
                <h5 className="fw-bold">Aprendé</h5>
                <p className="text-muted">Cursos autoasistidos con videos, teoría y proyectos prácticos.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="step-card">
                <div className="step-number">3</div>
                <h5 className="fw-bold">Certificate</h5>
                <p className="text-muted">Completá los cursos y obtené certificados descargables.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h2 className="section-title">¿Listo para empezar?</h2>
              <p className="fs-5 text-muted">Unite a FuthurTech y formá parte de la próxima generación de innovadores. Cursos, kits y una comunidad que te acompaña.</p>
              <Button as={Link} to="/registro" size="lg" className="btn-verde fw-bold px-4">Comenzá Ahora</Button>
            </Col>
            <Col lg={6} className="text-center">
              <i className="bi bi-mortarboard-fill" style={{ fontSize: '8rem', color: 'var(--azul)', opacity: 0.2 }}></i>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Home

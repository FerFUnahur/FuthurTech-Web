import { Container, Row, Col } from 'react-bootstrap'

const team = [
  { name: 'Laura Fernández', role: 'CEO & Fundadora', desc: 'Ingeniera en sistemas con 15 años de experiencia en tecnología educativa.' },
  { name: 'Martín Rodríguez', role: 'Director Técnico', desc: 'Especialista en robótica y automatización. Ex-investigador del CONICET.' },
  { name: 'Sofía Martínez', role: 'Lead Instructor', desc: 'Docente de programación y robótica para todas las edades.' },
  { name: 'Javier Gómez', role: 'Desarrollador Full Stack', desc: 'Creador de la plataforma y apasionado por la educación digital.' },
]

function Nosotros() {
  return (
    <Container className="py-5">
      <h2 className="section-title">Sobre FuthurTech</h2>
      <Row className="mb-5">
        <Col lg={8}>
          <p className="fs-5 text-muted">FuthurTech nació en 2020 con la misión de democratizar el acceso a la educación en tecnología y robótica en Argentina. Creemos que el futuro se construye con conocimiento, y queremos ser parte de ese cambio.</p>
          <p className="text-muted">Ofrecemos cursos autoasistidos diseñados por expertos, kits de robótica cuidadosamente seleccionados y una plataforma intuitiva que permite a cada estudiante avanzar a su propio ritmo. Desde principiantes hasta avanzados, tenemos algo para todos.</p>
        </Col>
      </Row>

      <Row className="mb-5 g-4">
        <Col md={4}>
          <div className="p-4 bg-light rounded-3 h-100">
            <h4 className="text-azul fw-bold"><i className="bi bi-bullseye me-2"></i>Misión</h4>
            <p className="text-muted">Empoderar a personas de todas las edades con las habilidades tecnológicas necesarias para prosperar en la era digital, a través de educación accesible y práctica.</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="p-4 bg-light rounded-3 h-100">
            <h4 className="text-verde fw-bold"><i className="bi bi-eye me-2"></i>Visión</h4>
            <p className="text-muted">Ser la plataforma líder de educación en tecnología y robótica en Latinoamérica, formando la próxima generación de innovadores y creadores.</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="p-4 bg-light rounded-3 h-100">
            <h4 className="text-naranja fw-bold"><i className="bi bi-heart me-2"></i>Valores</h4>
            <p className="text-muted">Innovación, accesibilidad, calidad educativa, comunidad y compromiso con el futuro de nuestros estudiantes.</p>
          </div>
        </Col>
      </Row>

      <h3 className="fw-bold mb-4">Nuestro Equipo</h3>
      <Row className="g-4">
        {team.map((m, i) => (
          <Col md={3} key={i}>
            <div className="team-card h-100">
              <div className="team-img-placeholder"><i className="bi bi-person-circle"></i></div>
              <div className="p-3">
                <h5 className="fw-bold mb-1">{m.name}</h5>
                <p className="text-verde fw-semibold small mb-2">{m.role}</p>
                <p className="text-muted small mb-0">{m.desc}</p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default Nosotros

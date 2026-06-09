import { Link, useNavigate } from 'react-router-dom'
import { Navbar as BSNavbar, Nav, NavDropdown, Container, Badge } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <BSNavbar expand="lg" className="navbar-custom" sticky="top">
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="fw-bold text-white">
          <i className="bi bi-cpu me-2"></i>FuthurTech
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="main-navbar" />
        <BSNavbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
            <Nav.Link as={Link} to="/cursos">Cursos</Nav.Link>
            <Nav.Link as={Link} to="/nosotros">Nosotros</Nav.Link>
            <Nav.Link as={Link} to="/faq">FAQ</Nav.Link>
            <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>
          </Nav>
          <Nav className="align-items-center gap-2">
            <Nav.Link as={Link} to="/carrito" className="position-relative text-white">
              <i className="bi bi-cart3 fs-5"></i>
              {count > 0 && (
                <Badge bg="warning" text="dark" className="position-absolute top-0 start-100 translate-middle rounded-pill" style={{ fontSize: '0.6rem' }}>
                  {count}
                </Badge>
              )}
            </Nav.Link>
            {user ? (
              <NavDropdown title={<><i className="bi bi-person-circle me-1"></i>{user.name}</>} id="user-dropdown" align="end">
                {user.role === 'admin' && (
                  <NavDropdown.Item as={Link} to="/admin">Mi Panel</NavDropdown.Item>
                )}

                {user.role === 'instructor' && (
                  <NavDropdown.Item as={Link} to="/instructor">Mi Panel</NavDropdown.Item>
                )}


                {user.role === 'student' && (
                  <NavDropdown.Item as={Link} to="/dashboard">Mi Panel</NavDropdown.Item>
                )}

                <NavDropdown.Item as={Link} to="/dashboard/perfil">Mi Perfil</NavDropdown.Item>
                {user.role === 'student' && (
                  <NavDropdown.Item as={Link} to="/dashboard/certificados">Mis Certificados</NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="btn btn-success btn-sm px-3">Ingresar</Nav.Link>
                <Nav.Link as={Link} to="/registro" className="btn btn-success btn-sm px-3">Registrarse</Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  )
}

export default Navbar

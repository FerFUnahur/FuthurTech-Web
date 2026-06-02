import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

function ProductDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    api.get(`/products/${id}`).then(res => {
      setProduct(res.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
  if (!product) return <Container className="py-5"><Alert variant="warning">Producto no encontrado</Alert></Container>

  const handleAdd = () => {
    if (user?.role === 'admin') {
      alert('Los administradores no pueden comprar productos')
      return
    }
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Container className="py-5">
      <Link to="/productos" className="btn btn-outline-secondary btn-sm mb-4"><i className="bi bi-arrow-left me-1"></i>Volver</Link>
      <Row className="g-4">
        <Col md={5}>
          <div className="card-img-top-placeholder rounded-3" style={{ height: 350 }}>
            <i className="bi bi-cpu" style={{ fontSize: '5rem' }}></i>
          </div>
        </Col>
        <Col md={7}>
          <small className="text-muted">{product.Category?.name || 'General'}</small>
          <h2 className="fw-bold mt-1">{product.name}</h2>
          <p className="text-muted fs-5 mb-3">{product.description}</p>
          <h3 className="text-azul fw-bold mb-3">${product.price.toLocaleString()}</h3>
          <p className="mb-3"><span className="fw-semibold">Stock:</span> {product.stock} unidades</p>
          {user ? (
            added ? (
              <Button variant="success" disabled><i className="bi bi-check-lg me-1"></i>Agregado al carrito</Button>
            ) : user?.role === 'admin' ? (
              <Button className="btn-verde" size="lg" disabled>
                <i className="bi bi-ban me-2"></i>Admin no puede comprar
              </Button>
            ) : (
              <Button className="btn-verde" size="lg" onClick={handleAdd} disabled={product.stock === 0}>
                <i className="bi bi-cart-plus me-2"></i>Agregar al Carrito
              </Button>
            )
          ) : (
            <Button as={Link} to="/login" variant="outline-primary" size="lg">Iniciá sesión para comprar</Button>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default ProductDetail

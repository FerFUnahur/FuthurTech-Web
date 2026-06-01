import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap'
import api from '../../services/api'

function ProductList() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (categoryId) params.categoryId = categoryId
    api.get('/products', { params }).then(res => {
      setProducts(res.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [search, categoryId])

  return (
    <Container className="py-5">
      <h2 className="section-title">Productos</h2>

      <Row className="mb-4 g-2">
        <Col md={6}>
          <Form.Control type="search" placeholder="Buscar productos..." value={search} onChange={e => setSearch(e.target.value)} />
        </Col>
        <Col md={4}>
          <Form.Select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : products.length === 0 ? (
        <p className="text-muted text-center py-5">No se encontraron productos.</p>
      ) : (
        <Row className="g-4">
          {products.map(p => (
            <Col md={4} lg={3} key={p.id}>
              <Card className="product-card h-100">
                <div className="card-img-top-placeholder"><i className="bi bi-cpu"></i></div>
                <Card.Body className="d-flex flex-column">
                  <small className="text-muted">{p.Category?.name || 'General'}</small>
                  <Card.Title className="fw-bold mt-1">{p.name}</Card.Title>
                  <Card.Text className="text-muted small flex-grow-1">{p.description.slice(0, 80)}...</Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-azul fs-5">${p.price.toLocaleString()}</span>
                    <Button as={Link} to={`/productos/${p.id}`} variant="outline-primary" size="sm">Ver más</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default ProductList

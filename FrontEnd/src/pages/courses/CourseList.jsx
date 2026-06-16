import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Form, Spinner, Badge } from 'react-bootstrap'
import api from '../../services/api'
import { useToast } from '../../context/ToastContext'

function CourseList() {
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(true)
  const { error: toastError } = useToast()

  useEffect(() => {
    api.get('/courses/categories').then(res => setCategories(res.data)).catch(() => {
      toastError('Error al cargar las categorías')
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (categoryId) params.categoryId = categoryId
    api.get('/courses', { params }).then(res => {
      setCourses(res.data)
    }).catch(() => {
      toastError('Error al cargar los cursos')
    }).finally(() => setLoading(false))
  }, [search, categoryId])

  return (
    <Container className="py-5">
      <h2 className="section-title">Cursos</h2>

      <Row className="mb-4 g-2">
        <Col md={6}>
          <Form.Control type="search" placeholder="Buscar cursos..." value={search} onChange={e => setSearch(e.target.value)} />
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
      ) : courses.length === 0 ? (
        <p className="text-muted text-center py-5">No se encontraron cursos.</p>
      ) : (
        <Row className="g-4">
          {courses.map(c => (
            <Col md={6} lg={4} key={c.id}>
              <Card className="course-card h-100">
                <div className="card-img-top-placeholder"><i className="bi bi-laptop"></i></div>
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex gap-2 mb-2">
                    <Badge bg="success">{c.Category?.name || 'General'}</Badge>
                    <Badge bg="secondary">Acceso por código</Badge>
                  </div>
                  <Card.Title className="fw-bold">{c.title}</Card.Title>
                  <Card.Text className="text-muted small flex-grow-1">{c.description.slice(0, 100)}...</Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <small className="text-muted"><i className="bi bi-person me-1"></i>{c.instructor?.name || 'Instructor'}</small>
                    <Button as={Link} to={`/cursos/${c.id}`} variant="outline-success" size="sm">Ver curso</Button>
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

export default CourseList

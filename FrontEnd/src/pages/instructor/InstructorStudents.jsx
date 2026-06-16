import { useState, useEffect } from 'react'
import { Table, Badge, Card, Row, Col, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import api from '../../services/api'
import TablePagination from '../../components/TablePagination'

const ROWS_PER_PAGE = 10

function InstructorStudents() {
  const { user } = useAuth()
  const { error: toastError } = useToast()
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await api.get('/courses')
        const myCourses = coursesRes.data.filter(c => c.instructorId === user.id)
        setCourses(myCourses)
        if (myCourses.length > 0) {
          setSelectedCourse(myCourses[0].id)
        }
      } catch {
        toastError('Error al cargar los cursos')
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) fetchData()
  }, [user])

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedCourse) return
      try {
        const studentsRes = await api.get(`/courses/${selectedCourse}/students`)
        
        const studentsList = studentsRes.data.map(enrollment => ({
          ...enrollment,
          studentName: enrollment.User?.name,
          studentEmail: enrollment.User?.email,
          userId: enrollment.User?.id
        }))

        setStudents(studentsList)
        setPage(1)
      } catch {
        toastError('Error al cargar los estudiantes')
      }
    }

    fetchStudents()
  }, [selectedCourse])

  return (
    <div>
          <h3 className="fw-bold mb-4"><i className="bi bi-people me-2 text-azul"></i>Estudiantes Inscriptos</h3>

          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
          ) : courses.length === 0 ? (
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              No tienes cursos aún.
            </div>
          ) : (
            <>
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Body>
                  <label className="fw-bold mb-2">Selecciona un curso:</label>
                  <select
                    className="form-select"
                    value={selectedCourse || ''}
                    onChange={(e) => setSelectedCourse(parseInt(e.target.value))}
                  >
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </Card.Body>
              </Card>

              {students.length === 0 ? (
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  No hay estudiantes inscriptos en este curso aún.
                </div>
              ) : (
                <>
                  <Row className="g-3 mb-4">
                    <Col md={4}>
                      <Card className="text-center border-0 shadow-sm">
                        <Card.Body>
                          <i className="bi bi-people text-azul fs-2 d-block mb-2"></i>
                          <h4 className="fw-bold">{students.length}</h4>
                          <p className="text-muted small mb-0">Estudiantes Totales</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="text-center border-0 shadow-sm">
                        <Card.Body>
                          <i className="bi bi-calendar-check text-naranja fs-2 d-block mb-2"></i>
                          <h4 className="fw-bold">{students.filter(s => !s.completed).length}</h4>
                          <p className="text-muted small mb-0">En progreso</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Table responsive striped hover className="shadow-sm">
                    <thead className="table-dark">
                      <tr>
                        <th>Estudiante</th>
                        <th>Email</th>
                        <th>Fecha de Inscripción</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE).map((student, idx) => (
                        <tr key={idx}>
                          <td className="fw-bold">{student.studentName}</td>
                          <td>{student.studentEmail}</td>
                          <td>{new Date(student.createdAt).toLocaleDateString('es-AR')}</td>
                          <td>
                            <Badge bg={student.completed ? 'success' : 'warning'}>
                              {student.completed ? 'Completado' : 'En progreso'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <TablePagination
                    currentPage={page}
                    totalPages={Math.ceil(students.length / ROWS_PER_PAGE)}
                    onPageChange={setPage}
                  />
                </>
              )}
            </>
          )}
    </div>
  )
}

export default InstructorStudents

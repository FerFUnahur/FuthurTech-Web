import { useState, useEffect } from 'react'
import { Table, Badge, Card, Row, Col } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

function InstructorStudents() {
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener cursos del instructor
        const coursesRes = await api.get('/courses')
        const myCourses = coursesRes.data.filter(c => c.instructorId === user.id)
        setCourses(myCourses)
        if (myCourses.length > 0) {
          setSelectedCourse(myCourses[0].id)
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }

    if (user?.id) fetchData()
  }, [user])

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedCourse) return
      try {
        const enrollmentsRes = await api.get('/enrollments')
        const courseEnrollments = enrollmentsRes.data.filter(e => e.courseId === selectedCourse)

        const usersRes = await api.get('/users')
        // Usamos un Map para búsquedas instantáneas por ID
        const usersMap = new Map(usersRes.data.map(u => [u.id, u]))

        const studentsList = courseEnrollments.map(enrollment => {
          const student = usersMap.get(enrollment.userId)
          return {
            ...enrollment,
            studentName: student?.name,
            studentEmail: student?.email
          }
        })

        setStudents(studentsList)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchStudents()
  }, [selectedCourse])

  return (
    <div>
          <h3 className="fw-bold mb-4"><i className="bi bi-people me-2 text-azul"></i>Estudiantes Inscriptos</h3>

          {courses.length === 0 ? (
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
                          <h4 className="fw-bold">{students.filter(s => s.status === 'activo').length}</h4>
                          <p className="text-muted small mb-0">Activos</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Table responsive striped hover className="shadow-sm">
                    <thead className="table-light">
                      <tr>
                        <th>Estudiante</th>
                        <th>Email</th>
                        <th>Fecha de Inscripción</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, idx) => (
                        <tr key={idx}>
                          <td className="fw-bold">{student.studentName}</td>
                          <td>{student.studentEmail}</td>
                          <td>{new Date(student.createdAt).toLocaleDateString('es-AR')}</td>
                          <td>
                            <Badge bg={student.status === 'activo' ? 'success' : 'secondary'}>
                              {student.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )}
            </>
          )}
    </div>
  )
}

export default InstructorStudents

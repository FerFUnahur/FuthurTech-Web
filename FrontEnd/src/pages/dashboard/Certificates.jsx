import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap'
import api from '../../services/api'

function Certificates() {
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/certificates').then(res => setCerts(res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleDownload = async (id) => {
    try {
      const res = await api.get(`/certificates/${id}/download`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `certificado-${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Error al descargar el certificado')
    }
  }

  return (
    <Container className="py-5">
      <h2 className="section-title">Mis Certificados</h2>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : certs.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-3">
          <i className="bi bi-award" style={{ fontSize: '4rem', color: '#ccc' }}></i>
          <p className="text-muted fs-5 mt-3">Todavía no tenés certificados.</p>
          <p className="text-muted">Completá un curso para obtener tu certificado.</p>
        </div>
      ) : (
        <Row className="g-4">
          {certs.map(cert => (
            <Col md={6} key={cert.id}>
              <div className="certificate-preview">
                <i className="bi bi-award-fill text-naranja" style={{ fontSize: '3rem' }}></i>
                <h2>FuthurTech</h2>
                <p className="text-muted mb-0">Certificado de Finalización</p>
                <div className="cert-name">{cert.Course?.title}</div>
                <p className="text-muted small mt-2">Código: {cert.code}</p>
                <p className="text-muted small">Emitido el {new Date(cert.createdAt).toLocaleDateString('es-AR')}</p>
                <Button className="btn-verde mt-2" onClick={() => handleDownload(cert.id)}>
                  <i className="bi bi-download me-2"></i>Descargar PDF
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default Certificates

import { useState, useEffect } from 'react'
import { Table, Button, Badge, Spinner } from 'react-bootstrap'
import api from '../../services/api'

const statusColors = {
  pendiente: 'warning',
  pagado: 'info',
  enviado: 'primary',
  entregado: 'success',
}

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const loadOrders = () => {
    api.get('/orders').then(res => setOrders(res.data)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { loadOrders() }, [])

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status })
    loadOrders()
  }

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>

  return (
    <div>
      <h4 className="fw-bold mb-4"><i className="bi bi-cart me-2"></i>Gestionar Pedidos</h4>
      {orders.length === 0 ? (
        <p className="text-muted">No hay pedidos registrados.</p>
      ) : (
        <Table responsive striped hover>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Items</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.userId}</td>
                <td>
                  {o.OrderItems?.map(item => (
                    <div key={item.id} className="small">{item.Product?.name} x{item.quantity}</div>
                  ))}
                </td>
                <td className="fw-bold">${o.total.toLocaleString()}</td>
                <td><Badge bg={statusColors[o.status] || 'secondary'}>{o.status}</Badge></td>
                <td className="small">{new Date(o.createdAt).toLocaleDateString('es-AR')}</td>
                <td>
                  <div className="d-flex gap-1">
                    {['pendiente', 'pagado', 'enviado', 'entregado'].map(s => (
                      <Button key={s} size="sm" variant={o.status === s ? 'primary' : 'outline-secondary'}
                        onClick={() => updateStatus(o.id, s)} disabled={o.status === s} style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                        {s}
                      </Button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}

export default AdminOrders

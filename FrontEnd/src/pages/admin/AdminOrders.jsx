import { useState, useEffect } from 'react'
import { Table, Button, Badge, Spinner } from 'react-bootstrap'
import api from '../../services/api'
import TablePagination from '../../components/TablePagination'
import { useToast } from '../../context/ToastContext'

const ROWS_PER_PAGE = 10

const statusColors = {
  pendiente: 'warning',
  pagado: 'info',
  enviado: 'primary',
  entregado: 'success',
}

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const { success, error: toastError } = useToast()

  const loadOrders = () => {
    api.get('/orders').then(res => setOrders(res.data)).catch(() => {
      toastError('Error al cargar los pedidos')
    }).finally(() => setLoading(false))
  }

  useEffect(() => { loadOrders() }, [])

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status })
      success('Estado actualizado correctamente')
      loadOrders()
    } catch {
      toastError('Error al actualizar el estado')
    }
  }

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>

  return (
    <div>
      <h4 className="fw-bold mb-4"><i className="bi bi-cart me-2"></i>Gestionar Pedidos</h4>
      {orders.length === 0 ? (
        <p className="text-muted">No hay pedidos registrados.</p>
      ) : (
      <>
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
            {orders.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE).map(o => (
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
        <TablePagination
          currentPage={page}
          totalPages={Math.ceil(orders.length / ROWS_PER_PAGE)}
          onPageChange={setPage}
        />
      </>
      )}
    </div>
  )
}

export default AdminOrders

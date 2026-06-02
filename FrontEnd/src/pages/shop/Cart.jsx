import { Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button, Table, Form } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import api from '../../services/api'
import { useState } from 'react'

function Cart() {
  const { user } = useAuth()
  const { items, updateQuantity, removeItem, clearCart, total, count } = useCart()
  const navigate = useNavigate()
  const [ordering, setOrdering] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleCheckout = async () => {
    if (!user) { navigate('/login'); return }
    if (user.role === 'admin') { 
      alert('Los administradores no pueden realizar compras'); 
      return; 
    }
    setOrdering(true)
    try {
      await api.post('/orders', {
        items: items.map(i => ({ productId: i.id, quantity: i.quantity }))
      })
      setSuccess(true)
      clearCart()
    } catch (err) {
      alert('Error al crear el pedido')
    } finally {
      setOrdering(false)
    }
  }

  if (success) {
    return (
      <Container className="py-5 text-center">
        <div className="py-5">
          <i className="bi bi-check-circle-fill text-verde" style={{ fontSize: '4rem' }}></i>
          <h3 className="fw-bold mt-3">¡Pedido realizado con éxito!</h3>
          <p className="text-muted">Te contactaremos para coordinar el envío.</p>
          <Button as={Link} to="/productos" className="btn-verde">Seguir comprando</Button>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <h2 className="section-title">Carrito de Compras {count > 0 && <span className="fs-5 text-muted">({count} items)</span>}</h2>

      {items.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-cart3" style={{ fontSize: '4rem', color: '#ccc' }}></i>
          <p className="text-muted fs-5 mt-3">Tu carrito está vacío</p>
          <Button as={Link} to="/productos" className="btn-verde">Ver productos</Button>
        </div>
      ) : (
        <>
          <Table responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id}>
                  <td><span className="fw-semibold">{i.name}</span></td>
                  <td>${i.price.toLocaleString()}</td>
                  <td style={{ width: 120 }}>
                    <Form.Control type="number" min={1} value={i.quantity} onChange={e => updateQuantity(i.id, parseInt(e.target.value) || 1)} />
                  </td>
                  <td className="fw-bold">${(i.price * i.quantity).toLocaleString()}</td>
                  <td>
                    <Button variant="outline-danger" size="sm" onClick={() => removeItem(i.id)}>
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between align-items-center border-top pt-3">
            <Button variant="outline-secondary" onClick={clearCart}>Vaciar carrito</Button>
            <div className="text-end">
              <h4 className="fw-bold text-azul">Total: ${total.toLocaleString()}</h4>
              {user?.role === 'admin' ? (
                <Button className="btn-lg" disabled style={{ backgroundColor: '#ccc', color: '#666' }}>
                  <i className="bi bi-ban me-2"></i>Admin no puede comprar
                </Button>
              ) : (
                <Button className="btn-verde btn-lg" onClick={handleCheckout} disabled={ordering}>
                  {ordering ? 'Procesando...' : 'Realizar Pedido'}
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </Container>
  )
}

export default Cart

const { Order, OrderItem, Product } = require('../models');

exports.getAll = async (req, res) => {
  const orders = await Order.findAll({
    where: req.user.role === 'admin' ? {} : { userId: req.user.id },
    include: [{ model: OrderItem, include: [Product] }],
    order: [['createdAt', 'DESC']],
  });
  res.json(orders);
};

exports.getById = async (req, res) => {
  const order = await Order.findByPk(req.params.id, {
    include: [{ model: OrderItem, include: [Product] }],
  });
  if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });
  if (req.user.role !== 'admin' && order.userId !== req.user.id) {
    return res.status(403).json({ error: 'No autorizado' });
  }
  res.json(order);
};

exports.create = async (req, res) => {
  if (req.user.role === 'admin') {
    return res.status(403).json({ error: 'Los administradores no pueden realizar compras' });
  }
  const { items } = req.body;
  let total = 0;
  const orderItems = [];
  for (const item of items) {
    const product = await Product.findByPk(item.productId);
    if (!product) return res.status(404).json({ error: `Producto ${item.productId} no encontrado` });
    total += product.price * item.quantity;
    orderItems.push({ productId: item.productId, quantity: item.quantity, price: product.price });
  }
  const order = await Order.create({ userId: req.user.id, total, status: 'pendiente' });
  for (const oi of orderItems) {
    await OrderItem.create({ ...oi, orderId: order.id });
  }
  const result = await Order.findByPk(order.id, {
    include: [{ model: OrderItem, include: [Product] }],
  });
  res.status(201).json(result);
};

exports.updateStatus = async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });
  await order.update({ status: req.body.status });
  res.json(order);
};

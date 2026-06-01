const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  total: { type: DataTypes.FLOAT, allowNull: false },
  status: {
    type: DataTypes.ENUM('pendiente', 'pagado', 'enviado', 'entregado'),
    defaultValue: 'pendiente',
  },
}, { timestamps: true });

module.exports = Order;
